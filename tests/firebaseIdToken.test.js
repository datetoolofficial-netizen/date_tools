import { webcrypto } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyFirebaseIdToken } from '../app/api/_lib/firebaseIdToken';

function base64Url(value) {
    const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
    return Buffer.from(bytes).toString('base64url');
}

async function createSignedToken(overrides = {}) {
    const keyPair = await webcrypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['sign', 'verify'],
    );
    const kid = 'test-key';
    const now = Math.floor(Date.now() / 1000);
    const header = base64Url(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' }));
    const payload = base64Url(JSON.stringify({
        aud: 'date-tool-official',
        iss: 'https://securetoken.google.com/date-tool-official',
        sub: 'admin-user-id',
        email: 'admin@example.com',
        iat: now - 10,
        exp: now + 3600,
        auth_time: now - 20,
        ...overrides,
    }));
    const unsignedToken = `${header}.${payload}`;
    const signature = await webcrypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        keyPair.privateKey,
        new TextEncoder().encode(unsignedToken),
    );
    const jwk = await webcrypto.subtle.exportKey('jwk', keyPair.publicKey);

    return {
        token: `${unsignedToken}.${base64Url(signature)}`,
        jwk: { ...jwk, kid, alg: 'RS256', use: 'sig' },
    };
}

describe('Firebase ID token verification', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('accepts a correctly signed token for the Firebase project', async () => {
        const { token, jwk } = await createSignedToken();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
            JSON.stringify({ keys: [jwk] }),
            { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'max-age=60' } },
        )));

        const user = await verifyFirebaseIdToken(token);

        expect(user).toMatchObject({ localId: 'admin-user-id', email: 'admin@example.com' });
    });

    it('rejects malformed and wrong-project tokens before granting access', async () => {
        expect(await verifyFirebaseIdToken('not-a-token')).toBeNull();

        const { token } = await createSignedToken({ aud: 'another-project' });
        expect(await verifyFirebaseIdToken(token)).toBeNull();
    });
});
