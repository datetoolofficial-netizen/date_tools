import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const MAX_BODY_BYTES = 4096;
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = 'force-dynamic';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: { 'Cache-Control': 'no-store' },
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
        // Local builds do not always have a Cloudflare request context.
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

async function createSupportTicket(serviceAccount, payload) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const databaseName = `projects/${projectId}/databases/(default)`;
    const ticketNumber = `date-${Math.floor(1000 + Math.random() * 9000)}`;

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
                attachmentNote: getStringField(payload.attachmentNote),
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
        const payload = await readLimitedJson(request);

        if (cleanText(payload.website, 80)) {
            return jsonResponse({ ok: true, ticketNumber: 'queued' });
        }

        const cleaned = {
            senderName: cleanText(payload.senderName, 80),
            senderEmail: cleanText(payload.senderEmail, 120).toLowerCase(),
            subject: cleanText(payload.subject, 120),
            message: cleanText(payload.message, 1200),
            attachmentNote: cleanText(payload.attachmentNote, 240),
        };

        if (!cleaned.senderName || !EMAIL_PATTERN.test(cleaned.senderEmail) || !cleaned.subject || cleaned.message.length < 10) {
            return jsonResponse({ ok: false, error: 'invalid_support_payload' }, 400);
        }

        const serviceAccount = await getServiceAccount();
        if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
            return jsonResponse({ ok: false, error: 'support_not_configured' }, 503);
        }

        const ticketNumber = await createSupportTicket(serviceAccount, cleaned);
        return jsonResponse({ ok: true, ticketNumber });
    } catch (error) {
        console.error('support endpoint error:', error);
        const errorCode = error instanceof SyntaxError ? 'invalid_json' : 'support_create_failed';
        return jsonResponse({ ok: false, error: errorCode }, errorCode === 'invalid_json' ? 400 : 500);
    }
}
