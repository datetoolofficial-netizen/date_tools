const DEFAULT_FIREBASE_PROJECT_ID = 'date-tool-official';
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const CLOCK_SKEW_SECONDS = 5 * 60;

let cachedJwks = null;
let cachedJwksExpiresAt = 0;

function decodeBase64Url(value) {
    const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

function decodeJsonSegment(value) {
    return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

function getMaxAgeSeconds(response) {
    const cacheControl = response.headers.get('cache-control') || '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] || 0);
    return Number.isFinite(maxAge) && maxAge > 0 ? maxAge : 60 * 60;
}

async function getFirebaseJwks() {
    if (cachedJwks && Date.now() < cachedJwksExpiresAt) return cachedJwks;

    const response = await fetch(FIREBASE_JWKS_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`firebase_jwks_failed_${response.status}`);

    const payload = await response.json();
    if (!Array.isArray(payload?.keys) || payload.keys.length === 0) {
        throw new Error('firebase_jwks_missing_keys');
    }

    cachedJwks = payload.keys;
    cachedJwksExpiresAt = Date.now() + getMaxAgeSeconds(response) * 1000;
    return cachedJwks;
}

export async function verifyFirebaseIdToken(idToken, projectId = DEFAULT_FIREBASE_PROJECT_ID) {
    try {
        const parts = String(idToken || '').split('.');
        if (parts.length !== 3) return null;

        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        const header = decodeJsonSegment(encodedHeader);
        const claims = decodeJsonSegment(encodedPayload);
        const now = Math.floor(Date.now() / 1000);

        if (header?.alg !== 'RS256' || !header?.kid) return null;
        if (claims?.aud !== projectId) return null;
        if (claims?.iss !== `https://securetoken.google.com/${projectId}`) return null;
        if (typeof claims?.sub !== 'string' || claims.sub.length < 1 || claims.sub.length > 128) return null;
        if (!Number.isFinite(claims?.exp) || claims.exp <= now) return null;
        if (!Number.isFinite(claims?.iat) || claims.iat > now + CLOCK_SKEW_SECONDS) return null;
        if (Number.isFinite(claims?.auth_time) && claims.auth_time > now + CLOCK_SKEW_SECONDS) return null;

        const jwks = await getFirebaseJwks();
        const jwk = jwks.find((candidate) => candidate?.kid === header.kid && candidate?.kty === 'RSA');
        if (!jwk) return null;

        const publicKey = await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            false,
            ['verify'],
        );
        const isValid = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            publicKey,
            decodeBase64Url(encodedSignature),
            new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
        );

        if (!isValid) return null;

        return {
            localId: claims.sub,
            email: typeof claims.email === 'string' ? claims.email : '',
            claims,
        };
    } catch {
        return null;
    }
}
