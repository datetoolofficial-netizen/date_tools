import { getCloudflareContext } from '@opennextjs/cloudflare';
import {
    getAllowedImageInfo,
    getSafeMediaCategory,
    hasExpectedImageSignature,
    MAX_IMAGE_BYTES,
} from '../../_lib/mediaValidation';
import { verifyFirebaseIdToken } from '../../_lib/firebaseIdToken';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';

export const dynamic = 'force-dynamic';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

async function getCloudflareEnv() {
    try {
        const { env } = await getCloudflareContext({ async: true });
        return env || {};
    } catch {
        return {};
    }
}

async function getEnvValue(...keys) {
    for (const key of keys) {
        const value = process.env[key];
        if (value) return value;
    }

    const env = await getCloudflareEnv();

    for (const key of keys) {
        const value = env?.[key];
        if (typeof value === 'string' && value) return value;
    }

    return '';
}

async function getServiceAccount() {
    const json = await getEnvValue('FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_SERVICE_ACCOUNT_JSON');

    if (json) {
        try {
            const parsed = JSON.parse(json);
            return {
                projectId: parsed.project_id || DEFAULT_PROJECT_ID,
                clientEmail: parsed.client_email || '',
                privateKey: parsed.private_key || '',
            };
        } catch {
            // Fall back to split service account secrets if JSON was pasted incorrectly.
        }
    }

    return {
        projectId: (await getEnvValue('FIREBASE_PROJECT_ID', 'GOOGLE_CLOUD_PROJECT')) || DEFAULT_PROJECT_ID,
        clientEmail: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL'),
        privateKey: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY'),
    };
}

function normalizePrivateKey(privateKey) {
    return privateKey.replace(/\\n/g, '\n').trim();
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function base64UrlEncodeText(value) {
    return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function pemToArrayBuffer(pem) {
    const base64 = normalizePrivateKey(pem)
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

async function signJwt(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: serviceAccount.clientEmail,
        scope: TOKEN_SCOPE,
        aud: TOKEN_AUDIENCE,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS,
    };
    const unsignedToken = `${base64UrlEncodeText(JSON.stringify(header))}.${base64UrlEncodeText(JSON.stringify(payload))}`;
    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(serviceAccount.privateKey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        new TextEncoder().encode(unsignedToken)
    );

    return `${unsignedToken}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

async function getAccessToken(serviceAccount) {
    if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

    const assertion = await signJwt(serviceAccount);
    const response = await fetch(TOKEN_AUDIENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion,
        }),
    });

    if (!response.ok) throw new Error(`token_failed_${response.status}`);

    const tokenData = await response.json();
    cachedToken = tokenData.access_token;
    cachedTokenExpiresAt = Date.now() + Math.max(1, (tokenData.expires_in || TOKEN_TTL_SECONDS) - 60) * 1000;

    return cachedToken;
}

async function getProfile(serviceAccount, collectionName, uid) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const documentName = `projects/${projectId}/databases/(default)/documents/${collectionName}/${uid}`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.fields || null;
}

async function requireUploader(request) {
    const authorization = request.headers.get('authorization') || '';
    const [, idToken] = authorization.match(/^Bearer\s+(.+)$/i) || [];

    if (!idToken) return null;

    const user = await verifyFirebaseIdToken(idToken, DEFAULT_PROJECT_ID);
    if (!user?.localId) return null;

    const serviceAccount = await getServiceAccount();
    if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) return null;

    const adminProfile = await getProfile(serviceAccount, 'admins', user.localId);
    if (adminProfile?.active?.booleanValue === true) {
        return { type: 'admin', uid: user.localId, profile: adminProfile };
    }

    const advertiserProfile = await getProfile(serviceAccount, 'advertisers', user.localId);
    if (advertiserProfile?.status?.stringValue === 'active') return { type: 'advertiser', uid: user.localId };

    return null;
}

function readProfileTokens(field) {
    if (!field) return [];
    if (field.stringValue) return [field.stringValue];
    if (field.arrayValue?.values) return field.arrayValue.values.flatMap(readProfileTokens);
    if (field.mapValue?.fields) {
        return Object.entries(field.mapValue.fields)
            .filter(([, value]) => value?.booleanValue === true)
            .map(([key]) => key);
    }
    return [];
}

function canAdminUploadCategory(profile, category) {
    const role = String(profile?.role?.stringValue || profile?.adminRole?.stringValue || '').toLowerCase();
    if (!['assistant', 'helper', 'مساعد'].includes(role)) return true;

    const permissions = new Set([
        ...readProfileTokens(profile?.permissions),
        ...readProfileTokens(profile?.adminPermissions),
        ...readProfileTokens(profile?.allowedPages),
        ...readProfileTokens(profile?.allowedAdminPages),
    ].map((value) => String(value).trim().toLowerCase()));
    const identityCategories = new Set([
        'logo', 'favicon', 'link-preview', 'app-icon',
        'pwa-shortcut-date', 'pwa-shortcut-clock', 'pwa-shortcut-weather',
    ]);

    if (identityCategories.has(category)) {
        return ['identity', 'brand', 'branding'].some((permission) => permissions.has(permission));
    }

    if (category === 'seo-share') {
        return ['tool-management', 'toolmanagement', 'tools-management', 'toolscontent']
            .some((permission) => permissions.has(permission));
    }

    if (category === 'ads') {
        return ['ads', 'campaigns', 'ad-campaigns', 'ad-settings', 'ads-settings'].some((permission) => permissions.has(permission));
    }

    return false;
}

function getSafeFileName(name) {
    return String(name || 'image')
        .toLowerCase()
        .replace(/\.[^.]+$/g, '')
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'image';
}

function getMediaBucket(env) {
    return env?.MEDIA_BUCKET || null;
}

export async function POST(request) {
    const uploader = await requireUploader(request);
    if (!uploader) {
        return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_IMAGE_BYTES + 32 * 1024) {
        return jsonResponse({ ok: false, error: 'request_too_large' }, 413);
    }

    const env = await getCloudflareEnv();
    const bucket = getMediaBucket(env);

    if (!bucket) {
        return jsonResponse({ ok: false, error: 'media_storage_not_configured' }, 503);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const category = getSafeMediaCategory(formData.get('category'));

    if (!category) {
        return jsonResponse({ ok: false, error: 'invalid_category' }, 400);
    }

    if (uploader.type === 'advertiser' && category !== 'ads') {
        return jsonResponse({ ok: false, error: 'forbidden_category' }, 403);
    }
    if (uploader.type === 'admin' && !canAdminUploadCategory(uploader.profile, category)) {
        return jsonResponse({ ok: false, error: 'forbidden_category' }, 403);
    }

    if (!(file instanceof File)) {
        return jsonResponse({ ok: false, error: 'missing_file' }, 400);
    }

    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
        return jsonResponse({ ok: false, error: 'invalid_file_size' }, 400);
    }

    const imageInfo = getAllowedImageInfo(file);
    if (!imageInfo) {
        return jsonResponse({ ok: false, error: 'unsupported_image_type' }, 400);
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const safeName = getSafeFileName(file.name);
    const key = `${category}/${year}/${month}/${crypto.randomUUID()}-${safeName}.${imageInfo.extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasExpectedImageSignature(bytes, imageInfo.contentType)) {
        return jsonResponse({ ok: false, error: 'invalid_image_content' }, 400);
    }

    await bucket.put(key, bytes, {
        httpMetadata: {
            contentType: imageInfo.contentType,
            cacheControl: 'public, max-age=31536000, immutable',
        },
        customMetadata: {
            originalName: file.name.slice(0, 120),
            category,
            uploadedBy: uploader.uid,
            uploaderType: uploader.type,
        },
    });

    return jsonResponse({
        ok: true,
        key,
        url: `/api/media/${key}`,
        contentType: imageInfo.contentType,
        size: file.size,
    });
}
