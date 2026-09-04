import { getCloudflareContext } from '@opennextjs/cloudflare';

const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_TTL_SECONDS = 55 * 60;
const DEFAULT_PROJECT_ID = 'date-tool-official';

let cachedToken = '';
let cachedTokenExpiresAt = 0;

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
        // Local Next builds can run without a Cloudflare request context.
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
            // Fall through to split secrets when the JSON value is unavailable or malformed.
        }
    }

    return {
        projectId: (await getEnvValue('FIREBASE_PROJECT_ID', 'GOOGLE_CLOUD_PROJECT')) || DEFAULT_PROJECT_ID,
        clientEmail: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL'),
        privateKey: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY'),
    };
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function base64UrlEncodeText(value) {
    return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function pemToArrayBuffer(privateKey) {
    const base64 = privateKey
        .replace(/\\n/g, '\n')
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
    const header = base64UrlEncodeText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64UrlEncodeText(JSON.stringify({
        iss: serviceAccount.clientEmail,
        scope: TOKEN_SCOPE,
        aud: TOKEN_AUDIENCE,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS,
    }));
    const unsignedToken = `${header}.${payload}`;
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

    if (!response.ok) throw new Error(`firebase_service_token_${response.status}`);

    const tokenData = await response.json();
    cachedToken = String(tokenData.access_token || '');
    cachedTokenExpiresAt = Date.now()
        + Math.max(1, Number(tokenData.expires_in || TOKEN_TTL_SECONDS) - 60) * 1000;
    return cachedToken;
}

export async function getFirestoreServerAuthorization() {
    try {
        const serviceAccount = await getServiceAccount();
        if (!serviceAccount.clientEmail || !serviceAccount.privateKey) return '';

        const token = await getAccessToken(serviceAccount);
        return token ? `Bearer ${token}` : '';
    } catch {
        // settings/public remains readable under the current rules while App Check is monitoring.
        return '';
    }
}
