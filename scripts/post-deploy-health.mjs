import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const DEFAULT_BASE_URL = 'https://date-tool.com';

export function buildPostDeployChecks(expectedVersion) {
    return [
        { path: '/api/health', type: 'json', validate: (body) => body.status === 'ok' && body.version === expectedVersion },
        { path: '/api/app-version', type: 'json', validate: (body) => body.version === expectedVersion },
        { path: '/', type: 'text', validate: (body) => /<html[^>]+lang="ar"[^>]+dir="rtl"/i.test(body) },
        { path: '/en', type: 'text', validate: (body) => /<html[^>]+lang="en"[^>]+dir="ltr"/i.test(body) },
        { path: '/weather', type: 'text', validate: (body) => /<h1[\s>]/i.test(body) },
        { path: '/en/weather', type: 'text', validate: (body) => /<h1[\s>]/i.test(body) },
        { path: '/manifest.webmanifest', type: 'json', validate: (body) => body.start_url === '/' },
        {
            path: '/robots.txt',
            type: 'text',
            validate: (body) => String(body).toLowerCase().includes('sitemap: https://date-tool.com/sitemap.xml'),
        },
        {
            path: '/sitemap.xml',
            type: 'text',
            validate: (body) => {
                const normalizedBody = String(body).toLowerCase();
                return normalizedBody.includes('<urlset') && normalizedBody.includes('https://date-tool.com/en');
            },
        },
        { path: '/ads.txt', type: 'text', validate: (body) => /google\.com,\s*pub-1147243690926079,\s*DIRECT/i.test(body) },
    ];
}

export async function runPostDeployHealth({
    baseUrl = DEFAULT_BASE_URL,
    expectedVersion = packageJson.version,
    attempts = 6,
    retryDelayMs = 10_000,
    timeoutMs = 12_000,
    fetchImpl = fetch,
    sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay)),
} = {}) {
    const normalizedBaseUrl = String(baseUrl).replace(/\/$/, '');
    const checks = buildPostDeployChecks(expectedVersion);
    let lastFailures = [];

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const failures = [];
        for (const check of checks) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchImpl(`${normalizedBaseUrl}${check.path}`, {
                    headers: { 'User-Agent': 'date-tools-post-deploy-check/1.0' },
                    cache: 'no-store',
                    signal: controller.signal,
                });
                const body = check.type === 'json' ? await response.json() : await response.text();
                if (!response.ok || !check.validate(body)) failures.push(`${check.path} (${response.status})`);
            } catch (error) {
                failures.push(`${check.path} (${error?.name || 'request_failed'})`);
            } finally {
                clearTimeout(timer);
            }
        }

        if (failures.length === 0) return { ok: true, attemptsUsed: attempt, expectedVersion };
        lastFailures = failures;
        if (attempt < attempts) await sleep(retryDelayMs);
    }

    return { ok: false, attemptsUsed: attempts, expectedVersion, failures: lastFailures };
}

async function main() {
    const baseUrl = process.env.HEALTH_BASE_URL || DEFAULT_BASE_URL;
    const expectedVersion = process.env.EXPECTED_VERSION || packageJson.version;
    const result = await runPostDeployHealth({ baseUrl, expectedVersion });

    if (result.ok) {
        console.log(`[post-deploy] PASS ${baseUrl} version ${expectedVersion} after ${result.attemptsUsed} attempt(s)`);
        return;
    }

    console.error(`[post-deploy] FAIL ${baseUrl} expected version ${expectedVersion}`);
    result.failures.forEach((failure) => console.error(`[post-deploy] ${failure}`));
    process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main();
}
