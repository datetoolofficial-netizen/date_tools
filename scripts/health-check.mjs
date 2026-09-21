const baseUrl = String(process.argv[2] || process.env.HEALTH_BASE_URL || 'http://127.0.0.1:3000')
    .replace(/\/$/, '');
const timeoutMs = 10_000;
const checks = [
    { path: '/api/health', type: 'json', validate: (body) => body.status === 'ok' },
    { path: '/api/app-version', type: 'json', validate: (body) => Boolean(body.version) },
    { path: '/manifest.webmanifest', type: 'json', validate: (body) => body.start_url === '/' },
    { path: '/robots.txt', type: 'text', validate: (body) => /sitemap/i.test(body) },
    { path: '/sitemap.xml', type: 'text', validate: (body) => /<urlset/i.test(body) },
];

let failed = false;
for (const check of checks) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(`${baseUrl}${check.path}`, {
            headers: { 'User-Agent': 'date-tools-health-check/1.0' },
            signal: controller.signal,
        });
        const body = check.type === 'json' ? await response.json() : await response.text();
        if (!response.ok || !check.validate(body)) throw new Error(`unexpected response (${response.status})`);
        console.log(`[health] PASS ${check.path}`);
    } catch (error) {
        failed = true;
        console.error(`[health] FAIL ${check.path}: ${error.message}`);
    } finally {
        clearTimeout(timer);
    }
}

process.exit(failed ? 1 : 0);
