const MAX_BODY_BYTES = 2048;
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const DEFAULT_PROJECT_ID = 'date-tool-official';
const ALLOWED_TOOL_EVENTS = new Set(['ageCalc', 'dateConverter', 'durationCalc']);
const SAFE_AD_ID_PATTERN = /^[a-zA-Z0-9_-]{1,40}$/;

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

function getEnvValue(...keys) {
    for (const key of keys) {
        const value = process.env[key];
        if (value) return value;
    }

    return '';
}

function getServiceAccount() {
    const json = getEnvValue('FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_SERVICE_ACCOUNT_JSON');

    if (json) {
        try {
            const parsed = JSON.parse(json);
            return {
                projectId: parsed.project_id || DEFAULT_PROJECT_ID,
                clientEmail: parsed.client_email || '',
                privateKey: parsed.private_key || '',
            };
        } catch {
            return null;
        }
    }

    return {
        projectId: getEnvValue('FIREBASE_PROJECT_ID', 'GOOGLE_CLOUD_PROJECT') || DEFAULT_PROJECT_ID,
        clientEmail: getEnvValue('FIREBASE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL'),
        privateKey: getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY'),
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
    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };
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
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
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
    if (cachedToken && Date.now() < cachedTokenExpiresAt) {
        return cachedToken;
    }

    const assertion = await signJwt(serviceAccount);
    const response = await fetch(TOKEN_AUDIENCE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to mint Google access token.');
    }

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
        if (totalBytes > MAX_BODY_BYTES) {
            throw new Error('Request body is too large.');
        }

        chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }

    const text = new TextDecoder().decode(bytes).trim();
    if (!text) return {};

    return JSON.parse(text);
}

function getAllowedOrigins(request) {
    const requestOrigin = new URL(request.url).origin;
    const configuredOrigins = getEnvValue('STATISTICS_ALLOWED_ORIGINS')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return new Set([
        requestOrigin,
        'https://date-tool.com',
        'https://www.date-tool.com',
        'https://datetools.date-tool-official.workers.dev',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:8787',
        'http://127.0.0.1:8787',
        ...configuredOrigins,
    ]);
}

function isAllowedOrigin(request) {
    const origin = request.headers.get('origin');
    if (!origin) return true;

    return getAllowedOrigins(request).has(origin);
}

function normalizeAdId(adId) {
    const value = String(adId || '').trim();
    if (!SAFE_AD_ID_PATTERN.test(value)) return '';

    return value.replace(/-/g, '_');
}

function getFieldTransforms(payload) {
    if (payload.event === 'visit') {
        return ['visits'];
    }

    if (payload.event === 'tool' && ALLOWED_TOOL_EVENTS.has(payload.toolName)) {
        return [payload.toolName];
    }

    if (payload.event === 'adClick') {
        const adId = normalizeAdId(payload.adId);
        if (!adId) return [];

        return ['adClicks', `ad_${adId}`];
    }

    return [];
}

async function commitStatisticIncrement(serviceAccount, fieldPaths) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const databaseName = `projects/${projectId}/databases/(default)`;
    const documentName = `${databaseName}/documents/statistics/main`;
    const fieldTransforms = fieldPaths.map((fieldPath) => ({
        fieldPath,
        increment: {
            integerValue: '1',
        },
    }));

    fieldTransforms.push({
        fieldPath: 'lastUpdated',
        setToServerValue: 'REQUEST_TIME',
    });

    const response = await fetch(`https://firestore.googleapis.com/v1/${databaseName}/documents:commit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            writes: [
                {
                    transform: {
                        document: documentName,
                        fieldTransforms,
                    },
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update Firestore statistics.');
    }
}

export async function POST(request) {
    if (!isAllowedOrigin(request)) {
        return jsonResponse({ ok: false, error: 'forbidden_origin' }, 403);
    }

    const serviceAccount = getServiceAccount();
    if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
        return jsonResponse({ ok: false, error: 'statistics_not_configured' }, 503);
    }

    try {
        const payload = await readLimitedJson(request);
        const fieldPaths = getFieldTransforms(payload);

        if (fieldPaths.length === 0) {
            return jsonResponse({ ok: false, error: 'invalid_event' }, 400);
        }

        await commitStatisticIncrement(serviceAccount, fieldPaths);

        return jsonResponse({ ok: true });
    } catch (error) {
        console.error('statistics endpoint error:', error);
        return jsonResponse({ ok: false, error: 'statistics_update_failed' }, 500);
    }
}

export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}
