import { afterEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import {
    LOCAL_MUTATION_ERROR_CODE,
    assertProductionMutationAllowed,
    isLocalMutationRequest,
    isLoopbackHostname,
    isSameOriginMutationRequest,
    normalizeHostname,
} from '../app/localMutationSafety';

const originalWindow = globalThis.window;

afterEach(() => {
    if (originalWindow === undefined) {
        delete globalThis.window;
    } else {
        globalThis.window = originalWindow;
    }
});

function createRequest(host, forwardedHost = '') {
    const headers = new Headers({ host });
    if (forwardedHost) headers.set('x-forwarded-host', forwardedHost);
    return { headers, nextUrl: { hostname: normalizeHostname(host) } };
}

describe('local production mutation safety', () => {
    it.each([
        ['localhost', true],
        ['localhost:3000', true],
        ['127.0.0.1:8787', true],
        ['[::1]:3000', true],
        ['date-tool.com', false],
        ['localhost.example.com', false],
    ])('classifies %s safely', (host, expected) => {
        expect(isLoopbackHostname(host)).toBe(expected);
    });

    it('prefers the forwarded host and blocks a local mutation request', () => {
        expect(isLocalMutationRequest(createRequest('date-tool.com', '127.0.0.1:3000'))).toBe(true);
        expect(isLocalMutationRequest(createRequest('date-tool.com'))).toBe(false);
    });

    it('rejects cross-origin browser writes but permits same-origin and server requests', () => {
        const sameOrigin = new Request('https://date-tool.com/api/support', {
            method: 'POST',
            headers: { origin: 'https://date-tool.com', 'sec-fetch-site': 'same-origin' },
        });
        const crossOrigin = new Request('https://date-tool.com/api/support', {
            method: 'POST',
            headers: { origin: 'https://attacker.example', 'sec-fetch-site': 'cross-site' },
        });
        const serverRequest = new Request('https://date-tool.com/api/admin/indexnow', { method: 'POST' });

        expect(isSameOriginMutationRequest(sameOrigin)).toBe(true);
        expect(isSameOriginMutationRequest(crossOrigin)).toBe(false);
        expect(isSameOriginMutationRequest(serverRequest)).toBe(true);
    });

    it('throws a stable error before browser mutations on loopback only', () => {
        globalThis.window = { location: { hostname: 'localhost' } };
        expect(assertProductionMutationAllowed).toThrowError(
            expect.objectContaining({ code: LOCAL_MUTATION_ERROR_CODE }),
        );

        globalThis.window = { location: { hostname: 'date-tool.com' } };
        expect(assertProductionMutationAllowed).not.toThrow();
    });

    it('returns 403 before a local data API mutation reaches production', async () => {
        const response = middleware(new NextRequest('http://127.0.0.1:3000/api/media/upload', {
            method: 'POST',
        }));

        expect(response.status).toBe(403);
        expect(response.headers.get('cache-control')).toBe('no-store');
        await expect(response.json()).resolves.toEqual({
            ok: false,
            error: LOCAL_MUTATION_ERROR_CODE,
        });
    });

    it('does not block safe reads or the production host', () => {
        const localRead = middleware(new NextRequest('http://127.0.0.1:3000/api/admin/support'));
        const productionWrite = middleware(new NextRequest('https://date-tool.com/api/media/upload', {
            method: 'POST',
        }));

        expect(localRead.status).toBe(200);
        expect(productionWrite.status).toBe(200);
    });

    it('returns 403 for a production browser write from a foreign origin', async () => {
        const response = middleware(new NextRequest('https://date-tool.com/api/security/turnstile', {
            method: 'POST',
            headers: { origin: 'https://attacker.example', 'sec-fetch-site': 'cross-site' },
        }));

        expect(response.status).toBe(403);
        await expect(response.json()).resolves.toMatchObject({ error: 'forbidden_origin' });
    });
});
