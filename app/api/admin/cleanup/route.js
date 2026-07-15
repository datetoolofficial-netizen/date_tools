import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const FIREBASE_WEB_API_KEY = 'AIzaSyAgdxyNBFrwJuAnoVq6OmZKZZvRknFyVQ8';
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const CLEANUP_FIELD_PATHS = [
    'adCampaigns',
    'adImages',
    'pages',
    '`toolSlogan `',
    'customPages.about',
];

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

async function getEnvValue(...keys) {
    for (const key of keys) {
        if (process.env[key]) return process.env[key];
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        for (const key of keys) {
            if (typeof env?.[key] === 'string' && env[key]) return env[key];
        }
    } catch {
        // Local builds may not have a Cloudflare request context.
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
            // Fall back to split service account secrets.
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

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
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

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
}

async function signJwt(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const unsignedToken = [
        base64UrlEncodeText(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        base64UrlEncodeText(JSON.stringify({
            iss: serviceAccount.clientEmail,
            scope: TOKEN_SCOPE,
            aud: TOKEN_AUDIENCE,
            iat: now,
            exp: now + TOKEN_TTL_SECONDS,
        })),
    ].join('.');

    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(serviceAccount.privateKey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsignedToken));

    return `${unsignedToken}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

async function getAccessToken(serviceAccount) {
    if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

    const response = await fetch(TOKEN_AUDIENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: await signJwt(serviceAccount),
        }),
    });

    if (!response.ok) throw new Error(`token_failed_${response.status}`);

    const tokenData = await response.json();
    cachedToken = tokenData.access_token;
    cachedTokenExpiresAt = Date.now() + Math.max(1, (tokenData.expires_in || TOKEN_TTL_SECONDS) - 60) * 1000;
    return cachedToken;
}

async function lookupFirebaseUser(idToken) {
    const apiKey = (await getEnvValue('FIREBASE_WEB_API_KEY')) || FIREBASE_WEB_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.users?.[0] || null;
}

async function getAdminProfile(serviceAccount, uid) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const documentName = `projects/${projectId}/databases/(default)/documents/admins/${uid}`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.fields || null;
}

async function requireActiveAdmin(request, serviceAccount) {
    const authorization = request.headers.get('authorization') || '';
    const [, idToken] = authorization.match(/^Bearer\s+(.+)$/i) || [];

    if (!idToken) return false;

    const user = await lookupFirebaseUser(idToken);
    if (!user?.localId) return false;

    const adminProfile = await getAdminProfile(serviceAccount, user.localId);
    return adminProfile?.active?.booleanValue === true;
}

async function cleanupSettingsDocument(serviceAccount) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const databaseName = `projects/${projectId}/databases/(default)`;
    const documentName = `${databaseName}/documents/settings/main`;

    const response = await fetch(`https://firestore.googleapis.com/v1/${databaseName}/documents:commit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            writes: [
                {
                    update: {
                        name: documentName,
                        fields: {},
                    },
                    updateMask: {
                        fieldPaths: CLEANUP_FIELD_PATHS,
                    },
                },
            ],
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`firestore_failed_${response.status}_${text.slice(0, 160)}`);
    }
}

export async function POST(request) {
    try {
        const serviceAccount = await getServiceAccount();
        if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
            return jsonResponse({ ok: false, error: 'cleanup_not_configured' }, 503);
        }

        if (!(await requireActiveAdmin(request, serviceAccount))) {
            return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
        }

        await cleanupSettingsDocument(serviceAccount);

        return jsonResponse({
            ok: true,
            removedFields: CLEANUP_FIELD_PATHS,
        });
    } catch (error) {
        console.error('admin cleanup endpoint error:', error instanceof Error ? error.message : 'unknown');
        return jsonResponse({ ok: false, error: 'cleanup_failed' }, 500);
    }
}
