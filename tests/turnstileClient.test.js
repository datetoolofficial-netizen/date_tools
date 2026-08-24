import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileChallenge } from '../app/turnstileClient';

describe('Turnstile client verification', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns a successful server verification result', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
            JSON.stringify({ ok: true, configured: true, error: '' }),
            { status: 200, headers: { 'content-type': 'application/json' } },
        )));

        await expect(verifyTurnstileChallenge('valid-token', 'admin-login')).resolves.toMatchObject({ ok: true });
    });

    it('preserves a safe failure reason so the form can recover correctly', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
            JSON.stringify({ ok: false, configured: true, error: 'expired_or_duplicate' }),
            { status: 403, headers: { 'content-type': 'application/json' } },
        )));

        await expect(verifyTurnstileChallenge('expired-token', 'admin-login')).rejects.toMatchObject({
            code: 'security/turnstile-failed',
            reason: 'expired_or_duplicate',
        });
    });
});
