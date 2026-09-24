import { describe, expect, it, vi } from 'vitest';
import { buildPostDeployChecks, runPostDeployHealth } from '../scripts/post-deploy-health.mjs';

function responseFor(url, version = '0.3.58') {
    const path = new URL(url).pathname;
    if (path === '/api/health') return Response.json({ status: 'ok', version });
    if (path === '/api/app-version') return Response.json({ version });
    if (path === '/') return new Response('<html lang="ar" dir="rtl"><h1>الرئيسية</h1></html>');
    if (path === '/en') return new Response('<html lang="en" dir="ltr"><h1>Home</h1></html>');
    if (path === '/weather' || path === '/en/weather') return new Response('<html><h1>Weather</h1></html>');
    if (path === '/manifest.webmanifest') return Response.json({ start_url: '/' });
    if (path === '/robots.txt') return new Response('Sitemap: https://date-tool.com/sitemap.xml');
    if (path === '/sitemap.xml') return new Response('<urlset><loc>https://date-tool.com/en</loc></urlset>');
    if (path === '/ads.txt') return new Response('google.com, pub-1147243690926079, DIRECT, f08c47fec0942fa0');
    return new Response('', { status: 404 });
}

describe('post-deploy health verification', () => {
    it('checks version, languages, critical routes, SEO, PWA, and ads.txt', () => {
        expect(buildPostDeployChecks('0.3.58').map((check) => check.path)).toEqual([
            '/api/health', '/api/app-version', '/', '/en', '/weather', '/en/weather',
            '/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/ads.txt',
        ]);
    });

    it('requires the exact production origin for the English sitemap entry', () => {
        const sitemapCheck = buildPostDeployChecks('0.3.58').find((check) => check.path === '/sitemap.xml');

        expect(sitemapCheck.validate('<urlset><loc>https://date-tool.com/en</loc></urlset>')).toBe(true);
        expect(sitemapCheck.validate('<urlset><loc>https://date-tool.com.evil/en</loc></urlset>')).toBe(false);
        expect(sitemapCheck.validate('<urlset><loc>not a URL</loc></urlset>')).toBe(false);
    });

    it('passes a fully propagated deployment', async () => {
        const fetchImpl = vi.fn((url) => Promise.resolve(responseFor(url)));
        await expect(runPostDeployHealth({
            expectedVersion: '0.3.58',
            attempts: 1,
            fetchImpl,
        })).resolves.toEqual({ ok: true, attemptsUsed: 1, expectedVersion: '0.3.58' });
        expect(fetchImpl).toHaveBeenCalledTimes(10);
    });

    it('retries an old deployed version and reports only safe path/status failures', async () => {
        const fetchImpl = vi.fn((url) => Promise.resolve(responseFor(url, '0.3.57')));
        const sleep = vi.fn().mockResolvedValue(undefined);
        const result = await runPostDeployHealth({
            expectedVersion: '0.3.58',
            attempts: 2,
            retryDelayMs: 1,
            fetchImpl,
            sleep,
        });

        expect(result.ok).toBe(false);
        expect(result.failures).toEqual(['/api/health (200)', '/api/app-version (200)']);
        expect(sleep).toHaveBeenCalledOnce();
    });
});
