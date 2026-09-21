import { describe, expect, it, vi } from 'vitest';
import {
    FETCH_TIMEOUT_ERROR_CODE,
    fetchJsonWithTimeout,
    fetchWithTimeout,
} from '../app/fetchWithTimeout';

describe('bounded external requests', () => {
    it('returns a successful response before the deadline', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(new Response('ok'));
        const response = await fetchWithTimeout('https://example.test', {}, { fetchImpl, timeoutMs: 50 });

        expect(await response.text()).toBe('ok');
        expect(fetchImpl).toHaveBeenCalledOnce();
        expect(fetchImpl.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    });

    it('aborts a slow request with a stable public-safe code', async () => {
        const fetchImpl = vi.fn((url, init) => new Promise((resolve, reject) => {
            init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }));

        await expect(fetchWithTimeout('https://slow.example', {}, {
            fetchImpl,
            timeoutMs: 5,
        })).rejects.toMatchObject({ code: FETCH_TIMEOUT_ERROR_CODE });
    });

    it('rejects upstream HTTP errors and invalid JSON without leaking the body', async () => {
        await expect(fetchJsonWithTimeout('https://example.test', {}, {
            fetchImpl: vi.fn().mockResolvedValue(new Response('secret body', { status: 503 })),
        })).rejects.toMatchObject({ code: 'upstream_http_error', status: 503 });

        await expect(fetchJsonWithTimeout('https://example.test', {}, {
            fetchImpl: vi.fn().mockResolvedValue(new Response('not-json', { status: 200 })),
        })).rejects.toMatchObject({ code: 'invalid_json_response' });
    });

    it('keeps weather and R2-facing browser requests behind finite deadlines', async () => {
        const weather = await import('node:fs').then(({ readFileSync }) => readFileSync('app/weather/WeatherPageClient.jsx', 'utf8'));
        const adminAds = await import('node:fs').then(({ readFileSync }) => readFileSync('app/admin/ads/page.jsx', 'utf8'));
        const clientCampaign = await import('node:fs').then(({ readFileSync }) => readFileSync('app/client/create-campaign/page.jsx', 'utf8'));

        expect(weather).toContain('fetchJsonWithTimeout');
        expect(weather).toContain('timeoutMs: 12_000');
        expect(adminAds).toContain('fetchWithTimeout');
        expect(clientCampaign).toContain('fetchWithTimeout');
        expect(adminAds).toContain('timeoutMs: 25_000');
        expect(clientCampaign).toContain('timeoutMs: 25_000');
    });
});
