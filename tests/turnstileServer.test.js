import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileTokenWithConfig } from '../app/turnstileVerification';

function createRequest(hostname = 'date-tool.com') {
    return new Request(`https://${hostname}/api/security/turnstile`, {
        headers: { 'cf-connecting-ip': '203.0.113.10' },
    });
}

function siteverifyResponse(payload, status = 200) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

describe('Turnstile server verification', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('accepts a valid token only for the expected hostname and action', async () => {
        const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse({
            success: true,
            hostname: 'date-tool.com',
            action: 'admin-login',
        }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest(),
            token: 'valid-token',
            action: 'admin-login',
            siteKey: 'site-key',
            secretKey: 'secret-key',
            configuredHostnames: 'preview.date-tool.com',
            fetchImpl: fetchMock,
        })).resolves.toEqual({ success: true, configured: true, error: '' });

        const body = fetchMock.mock.calls[0][1].body;
        expect(body.get('secret')).toBe('secret-key');
        expect(body.get('response')).toBe('valid-token');
        expect(body.get('remoteip')).toBe('203.0.113.10');
        expect(body.get('idempotency_key')).toBeTruthy();
    });

    it('rejects a successful challenge issued for another hostname', async () => {
        const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse({
            success: true,
            hostname: 'attacker.example',
            action: 'admin-login',
        }));

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest(),
            token: 'valid-token',
            action: 'admin-login',
            siteKey: 'site-key',
            secretKey: 'secret-key',
            fetchImpl: fetchMock,
        })).resolves.toMatchObject({ success: false, error: 'hostname_mismatch' });
    });

    it('rejects a token created for a different protected action', async () => {
        const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse({
            success: true,
            hostname: 'date-tool.com',
            action: 'support-form',
        }));

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest(),
            token: 'valid-token',
            action: 'admin-login',
            siteKey: 'site-key',
            secretKey: 'secret-key',
            fetchImpl: fetchMock,
        })).resolves.toMatchObject({ success: false, error: 'action_mismatch' });
    });

    it('classifies expired or reused tokens without retrying them as valid', async () => {
        const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse({
            success: false,
            'error-codes': ['timeout-or-duplicate'],
        }));

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest(),
            token: 'expired-token',
            action: 'admin-login',
            siteKey: 'site-key',
            secretKey: 'secret-key',
            fetchImpl: fetchMock,
        })).resolves.toMatchObject({ success: false, error: 'expired_or_duplicate' });
    });

    it('fails closed when Siteverify is unavailable in production', async () => {
        const fetchMock = vi.fn().mockRejectedValue(new Error('network unavailable'));

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest(),
            token: 'valid-token',
            action: 'admin-login',
            siteKey: 'site-key',
            secretKey: 'secret-key',
            fetchImpl: fetchMock,
        })).resolves.toMatchObject({ success: false, error: 'verification_unavailable' });
    });

    it('allows missing configuration only on local development hosts', async () => {
        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest('date-tool.com'),
            token: '',
            action: 'admin-login',
        })).resolves.toEqual({ success: false, configured: false, error: 'not_configured' });

        await expect(verifyTurnstileTokenWithConfig({
            request: createRequest('localhost'),
            token: '',
            action: 'admin-login',
        })).resolves.toEqual({ success: true, configured: false, error: '' });
    });
});
