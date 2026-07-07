import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const MAX_BODY_BYTES = 4096;
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ATTACHMENT_TYPES = new Map([
    ['image/png', 'png'],
    ['image/jpeg', 'jpg'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
]);

export const dynamic = 'force-dynamic';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: { 'Cache-Control': 'no-store' },
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
        if (process.env[key]) return process.env[key];
    }

    const env = await getCloudflareEnv();
    for (const key of keys) {
        if (typeof env?.[key] === 'string' && env[key]) return env[key];
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

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
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
        ['sign']
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

async function readLimitedJson(request) {
    if (!request.body) return {};
    const reader = request.body.getReader();
    const chunks = [];
    let totalBytes = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > MAX_BODY_BYTES) throw new Error('body_too_large');
        chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }

    const text = new TextDecoder().decode(bytes).trim();
    return text ? JSON.parse(text) : {};
}

function cleanText(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function getStringField(value) {
    return { stringValue: value };
}

function getIntegerField(value) {
    return { integerValue: String(Number.isFinite(value) ? value : 0) };
}

function getSafeFileName(name) {
    return String(name || 'attachment')
        .toLowerCase()
        .replace(/\.[^.]+$/g, '')
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'attachment';
}

function getAttachmentInfo(file) {
    const extension = ALLOWED_ATTACHMENT_TYPES.get(file?.type);
    if (!extension) return null;
    return {
        extension,
        contentType: file.type,
    };
}

async function uploadSupportAttachment(file, ticketNumber) {
    if (!file || file.size <= 0) return null;

    if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new Error('attachment_too_large');
    }

    const attachmentInfo = getAttachmentInfo(file);
    if (!attachmentInfo) {
        throw new Error('unsupported_attachment_type');
    }

    const env = await getCloudflareEnv();
    const bucket = env?.MEDIA_BUCKET || null;
    if (!bucket) {
        throw new Error('media_storage_not_configured');
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const safeName = getSafeFileName(file.name);
    const key = `support/${year}/${month}/${ticketNumber}-${crypto.randomUUID()}-${safeName}.${attachmentInfo.extension}`;

    await bucket.put(key, await file.arrayBuffer(), {
        httpMetadata: {
            contentType: attachmentInfo.contentType,
            cacheControl: 'private, max-age=0, no-store',
        },
        customMetadata: {
            originalName: file.name.slice(0, 120),
            category: 'support',
            ticketNumber,
        },
    });

    return {
        key,
        name: file.name.slice(0, 120),
        contentType: attachmentInfo.contentType,
        size: file.size,
    };
}

async function readSupportPayload(request) {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const attachment = formData.get('attachment');

        return {
            payload: {
                senderName: formData.get('senderName'),
                senderEmail: formData.get('senderEmail'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                website: formData.get('website'),
            },
            attachment: attachment instanceof File && attachment.size > 0 ? attachment : null,
        };
    }

    return {
        payload: await readLimitedJson(request),
        attachment: null,
    };
}

async function createSupportTicket(serviceAccount, payload, ticketNumber, attachment) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const databaseName = `projects/${projectId}/databases/(default)`;
    const attachmentFields = attachment ? {
        attachmentKey: getStringField(attachment.key),
        attachmentName: getStringField(attachment.name),
        attachmentContentType: getStringField(attachment.contentType),
        attachmentSize: getIntegerField(attachment.size),
    } : {};

    const response = await fetch(`https://firestore.googleapis.com/v1/${databaseName}/documents/support_tickets`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                ticketNumber: getStringField(ticketNumber),
                senderName: getStringField(payload.senderName),
                senderEmail: getStringField(payload.senderEmail),
                subject: getStringField(payload.subject),
                message: getStringField(payload.message),
                ...attachmentFields,
                status: getStringField('جديدة'),
                source: getStringField('support_page'),
                createdAt: { timestampValue: new Date().toISOString() },
            },
        }),
    });

    if (!response.ok) throw new Error(`firestore_failed_${response.status}`);
    return ticketNumber;
}

export async function POST(request) {
    try {
        const { payload, attachment } = await readSupportPayload(request);

        if (cleanText(payload.website, 80)) {
            return jsonResponse({ ok: true, ticketNumber: 'queued' });
        }

        const cleaned = {
            senderName: cleanText(payload.senderName, 80),
            senderEmail: cleanText(payload.senderEmail, 120).toLowerCase(),
            subject: cleanText(payload.subject, 120),
            message: cleanText(payload.message, 1200),
        };

        if (!cleaned.senderName || !EMAIL_PATTERN.test(cleaned.senderEmail) || !cleaned.subject || cleaned.message.length < 10) {
            return jsonResponse({ ok: false, error: 'invalid_support_payload' }, 400);
        }

        const serviceAccount = await getServiceAccount();
        if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
            return jsonResponse({ ok: false, error: 'support_not_configured' }, 503);
        }

        const ticketNumber = `date-${Math.floor(1000 + Math.random() * 9000)}`;
        const uploadedAttachment = await uploadSupportAttachment(attachment, ticketNumber);
        await createSupportTicket(serviceAccount, cleaned, ticketNumber, uploadedAttachment);
        return jsonResponse({ ok: true, ticketNumber });
    } catch (error) {
        console.error('support endpoint error:', error);
        const badRequestErrors = new Set(['attachment_too_large', 'unsupported_attachment_type']);
        const errorMessage = error instanceof Error ? error.message : '';
        const errorCode = error instanceof SyntaxError ? 'invalid_json' : badRequestErrors.has(errorMessage) ? errorMessage : 'support_create_failed';
        return jsonResponse({ ok: false, error: errorCode }, errorCode === 'support_create_failed' ? 500 : 400);
    }
}
