import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/clock', '/weather', '/contact', '/en', '/en/clock', '/en/weather'];

test.describe('server language and direction', () => {
    for (const route of ['/', '/clock', '/weather']) {
        test(`${route} starts as Arabic HTML`, async ({ request }) => {
            const response = await request.get(route);
            const html = await response.text();
            const htmlTag = html.match(/<html[^>]*>/i)?.[0] || '';

            expect(response.ok()).toBe(true);
            expect(htmlTag).toContain('lang="ar"');
            expect(htmlTag).toContain('dir="rtl"');
        });
    }

    for (const route of ['/en', '/en/clock', '/en/weather']) {
        test(`${route} starts as English HTML`, async ({ request }) => {
            const response = await request.get(route);
            const html = await response.text();
            const htmlTag = html.match(/<html[^>]*>/i)?.[0] || '';

            expect(response.ok()).toBe(true);
            expect(htmlTag).toContain('lang="en"');
            expect(htmlTag).toContain('dir="ltr"');
        });
    }
});

test.describe('public page quality', () => {
    for (const route of publicRoutes) {
        test(`${route} renders without serious accessibility or viewport failures`, async ({ page }, testInfo) => {
            const pageErrors = [];
            page.on('pageerror', (error) => pageErrors.push(error.message));

            await page.goto(route, { waitUntil: 'domcontentloaded' });
            await page.locator('h1').first().waitFor({ state: 'visible' });

            const overflow = await page.evaluate(() => ({
                viewport: document.documentElement.clientWidth,
                content: document.documentElement.scrollWidth,
            }));
            expect(overflow.content, `${route} overflows in ${testInfo.project.name}`).toBeLessThanOrEqual(overflow.viewport + 1);

            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();
            const seriousViolations = results.violations.filter(({ impact }) => (
                impact === 'critical' || impact === 'serious'
            ));

            expect(pageErrors).toEqual([]);
            expect(seriousViolations).toEqual([]);
        });
    }
});

test('manifest remains installable and the runtime policy stays online-only', async ({ page, request }) => {
    const response = await request.get('/manifest.webmanifest');
    const manifest = await response.json();

    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');

    await page.goto('/');
    const registrations = await page.evaluate(async () => (
        'serviceWorker' in navigator ? (await navigator.serviceWorker.getRegistrations()).length : 0
    ));
    expect(registrations).toBe(0);
});

test('health and discovery endpoints expose valid public responses', async ({ request }) => {
    const [healthResponse, manifestResponse, robotsResponse, sitemapResponse] = await Promise.all([
        request.get('/api/health'),
        request.get('/manifest.webmanifest'),
        request.get('/robots.txt'),
        request.get('/sitemap.xml'),
    ]);
    const health = await healthResponse.json();
    const manifest = await manifestResponse.json();

    expect(healthResponse.ok()).toBe(true);
    expect(health).toMatchObject({ status: 'ok', service: 'date-tools-web' });
    expect(health).not.toHaveProperty('secrets');
    expect(manifestResponse.ok()).toBe(true);
    expect(manifest.shortcuts.map((shortcut) => shortcut.url)).toEqual(['/', '/clock', '/weather']);
    expect(await robotsResponse.text()).toContain('sitemap');
    expect(await sitemapResponse.text()).toContain('<urlset');
});

test('anonymous visitor measurement starts only after analytics consent', async ({ page }) => {
    const payloads = [];
    await page.route('**/api/statistics', async (route) => {
        payloads.push(JSON.parse(route.request().postData() || '{}'));
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ ok: true }),
        });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    expect(payloads).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('date_tools_anonymous_analytics_id_v1'))).toBeNull();

    await page.evaluate(() => {
        localStorage.setItem('date_tools_privacy_consent_v1', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: false,
            updatedAt: new Date().toISOString(),
        }));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect.poll(() => payloads.find(({ event }) => event === 'visit')?.visitorId || '')
        .toMatch(/^[0-9a-f-]{36}$/i);
});

test('dark mode and 200 percent text scaling keep the home page usable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'One desktop run is enough for the text-scale check.');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

    await expect(page.locator('h1').first()).toBeVisible();
    const overflow = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
    }));
    expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);
});
