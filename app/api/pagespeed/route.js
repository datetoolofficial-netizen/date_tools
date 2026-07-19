import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const FIREBASE_WEB_API_KEY = 'AIzaSyAgdxyNBFrwJuAnoVq6OmZKZZvRknFyVQ8';
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const DEFAULT_TARGET_URL = 'https://date-tool.com/';
const ALLOWED_HOSTS = new Set(['date-tool.com', 'www.date-tool.com']);
const CACHE_TTL_MS = 10 * 60 * 1000;
const PAGESPEED_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

export const dynamic = 'force-dynamic';

const pagespeedCache = globalThis.__dateToolsPagespeedCache || new Map();
globalThis.__dateToolsPagespeedCache = pagespeedCache;

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

async function getEnvValue(...keys) {
    for (const key of keys) {
        if (process.env[key]) return process.env[key];
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        for (const key of keys) {
            if (typeof env?.[key] === 'string' && env[key]) return env[key];
        }
    } catch {
        // Local builds may not have a Cloudflare request context.
    }

    return '';
}

async function getServiceAccount() {
    const json = await getEnvValue('FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_SERVICE_ACCOUNT_JSON');

    if (json) {
        try {
            const parsed = JSON.parse(json);
            return {
                projectId: parsed.project_id || DEFAULT_PROJECT_ID,
                clientEmail: parsed.client_email || '',
                privateKey: parsed.private_key || '',
            };
        } catch {
            // Fall back to split service account secrets.
        }
    }

    return {
        projectId: (await getEnvValue('FIREBASE_PROJECT_ID', 'GOOGLE_CLOUD_PROJECT')) || DEFAULT_PROJECT_ID,
        clientEmail: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL'),
        privateKey: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY'),
    };
}

function normalizePrivateKey(privateKey) {
    return privateKey.replace(/\\n/g, '\n').trim();
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncodeText(value) {
    return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function pemToArrayBuffer(pem) {
    const base64 = normalizePrivateKey(pem)
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
}

async function signJwt(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const unsignedToken = [
        base64UrlEncodeText(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        base64UrlEncodeText(JSON.stringify({
            iss: serviceAccount.clientEmail,
            scope: TOKEN_SCOPE,
            aud: TOKEN_AUDIENCE,
            iat: now,
            exp: now + TOKEN_TTL_SECONDS,
        })),
    ].join('.');

    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(serviceAccount.privateKey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsignedToken));

    return `${unsignedToken}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

async function getAccessToken(serviceAccount) {
    if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

    const response = await fetch(TOKEN_AUDIENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: await signJwt(serviceAccount),
        }),
    });

    if (!response.ok) throw new Error(`token_failed_${response.status}`);

    const tokenData = await response.json();
    cachedToken = tokenData.access_token;
    cachedTokenExpiresAt = Date.now() + Math.max(1, (tokenData.expires_in || TOKEN_TTL_SECONDS) - 60) * 1000;
    return cachedToken;
}

async function lookupFirebaseUser(idToken) {
    const apiKey = (await getEnvValue('FIREBASE_WEB_API_KEY')) || FIREBASE_WEB_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.users?.[0] || null;
}

async function getAdminProfile(serviceAccount, uid) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const documentName = `projects/${projectId}/databases/(default)/documents/admins/${uid}`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.fields || null;
}

async function requireActiveAdmin(request, serviceAccount) {
    const authorization = request.headers.get('authorization') || '';
    const [, idToken] = authorization.match(/^Bearer\s+(.+)$/i) || [];

    if (!idToken) return false;

    const user = await lookupFirebaseUser(idToken);
    if (!user?.localId) return false;

    const adminProfile = await getAdminProfile(serviceAccount, user.localId);
    return adminProfile?.active?.booleanValue === true;
}

function normalizeStrategy(value) {
    return value === 'desktop' ? 'desktop' : 'mobile';
}

function normalizeTargetUrl(value) {
    const rawValue = String(value || '').trim();
    const parsed = rawValue
        ? new URL(rawValue.startsWith('/') ? rawValue : rawValue, DEFAULT_TARGET_URL)
        : new URL(DEFAULT_TARGET_URL);

    if (parsed.protocol !== 'https:') {
        throw new Error('invalid_target_url');
    }

    if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
        throw new Error('invalid_target_url');
    }

    parsed.hash = '';
    parsed.search = '';
    return parsed.toString();
}

function scoreToPercent(category) {
    const score = Number(category?.score);
    return Number.isFinite(score) ? Math.round(score * 100) : null;
}

function summarizeAudit(audit = {}) {
    return {
        id: audit.id || '',
        title: audit.title || '',
        description: audit.description || '',
        score: typeof audit.score === 'number' ? Math.round(audit.score * 100) : null,
        scoreDisplayMode: audit.scoreDisplayMode || '',
        displayValue: audit.displayValue || '',
        numericValue: typeof audit.numericValue === 'number' ? audit.numericValue : null,
        savingsMs: Math.round(Number(audit.details?.overallSavingsMs || 0)),
        savingsBytes: Math.round(Number(audit.details?.overallSavingsBytes || 0)),
    };
}

function metricFromAudit(audits, id) {
    const audit = audits?.[id];
    if (!audit) return null;

    return {
        id,
        title: audit.title || id,
        displayValue: audit.displayValue || '',
        score: typeof audit.score === 'number' ? Math.round(audit.score * 100) : null,
        numericValue: typeof audit.numericValue === 'number' ? audit.numericValue : null,
    };
}

function summarizeFieldExperience(experience = {}) {
    const metrics = experience.metrics || {};

    return {
        id: experience.id || '',
        overallCategory: experience.overall_category || 'NONE',
        metrics: Object.fromEntries(
            Object.entries(metrics).map(([key, value]) => [
                key,
                {
                    percentile: value?.percentile ?? null,
                    category: value?.category || 'NONE',
                },
            ]),
        ),
    };
}

function summarizePagespeedResult(data) {
    const lighthouse = data?.lighthouseResult || {};
    const categories = lighthouse.categories || {};
    const audits = lighthouse.audits || {};
    const metricIds = [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index',
        'interactive',
        'interaction-to-next-paint',
    ];

    const failingAudits = Object.values(audits)
        .filter((audit) => audit?.id && typeof audit.score === 'number' && audit.score < 1)
        .map(summarizeAudit)
        .sort((first, second) => {
            const secondImpact = (second.savingsMs * 10) + second.savingsBytes + (100 - (second.score || 0));
            const firstImpact = (first.savingsMs * 10) + first.savingsBytes + (100 - (first.score || 0));
            return secondImpact - firstImpact;
        })
        .slice(0, 10);

    return {
        requestedUrl: lighthouse.requestedUrl || '',
        finalUrl: lighthouse.finalUrl || data?.id || '',
        fetchTime: lighthouse.fetchTime || '',
        analysisUTCTimestamp: data?.analysisUTCTimestamp || '',
        lighthouseVersion: lighthouse.lighthouseVersion || '',
        scores: {
            performance: scoreToPercent(categories.performance),
            accessibility: scoreToPercent(categories.accessibility),
            bestPractices: scoreToPercent(categories['best-practices']),
            seo: scoreToPercent(categories.seo),
        },
        metrics: Object.fromEntries(
            metricIds
                .map((id) => [id, metricFromAudit(audits, id)])
                .filter(([, value]) => Boolean(value)),
        ),
        opportunities: failingAudits,
        warnings: [
            ...(Array.isArray(lighthouse.runWarnings) ? lighthouse.runWarnings : []),
            ...(lighthouse.runtimeError?.message ? [lighthouse.runtimeError.message] : []),
        ],
        fieldData: {
            page: summarizeFieldExperience(data?.loadingExperience),
            origin: summarizeFieldExperience(data?.originLoadingExperience),
        },
    };
}

async function fetchPagespeedReport(targetUrl, strategy) {
    const cacheKey = `${strategy}:${targetUrl}`;
    const cached = pagespeedCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
        return { ...cached.body, cached: true, cacheExpiresAt: new Date(cached.expiresAt).toISOString() };
    }

    const apiKey = await getEnvValue('PAGESPEED_API_KEY', 'GOOGLE_PAGESPEED_API_KEY');
    const requestUrl = new URL(PAGESPEED_ENDPOINT);
    requestUrl.searchParams.set('url', targetUrl);
    requestUrl.searchParams.set('strategy', strategy);
    requestUrl.searchParams.set('locale', 'ar');
    requestUrl.searchParams.set('utm_source', 'date-tool-admin');
    requestUrl.searchParams.set('utm_campaign', 'pagespeed-dashboard');
    PAGESPEED_CATEGORIES.forEach((category) => requestUrl.searchParams.append('category', category));
    if (apiKey) requestUrl.searchParams.set('key', apiKey);

    const response = await fetch(requestUrl.toString(), {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const upstreamText = await response.text();
        const status = response.status === 429 ? 429 : 502;
        return {
            ok: false,
            status,
            error: response.status === 429 ? 'pagespeed_quota_exceeded' : 'pagespeed_request_failed',
            needsApiKey: !apiKey,
            message: response.status === 429
                ? 'تم تجاوز كوتا PageSpeed مؤقتًا. إضافة PAGESPEED_API_KEY في Cloudflare تجعل الفحص أكثر استقرارًا.'
                : 'تعذر جلب تقرير PageSpeed من Google في الوقت الحالي.',
            upstreamStatus: response.status,
            upstreamHint: upstreamText.slice(0, 220),
        };
    }

    const data = await response.json();
    const body = {
        ok: true,
        strategy,
        targetUrl,
        cached: false,
        hasApiKey: Boolean(apiKey),
        ...summarizePagespeedResult(data),
    };

    pagespeedCache.set(cacheKey, {
        body,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return body;
}

export async function GET(request) {
    try {
        const serviceAccount = await getServiceAccount();
        if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
            return jsonResponse({ ok: false, error: 'pagespeed_admin_auth_not_configured' }, 503);
        }

        if (!(await requireActiveAdmin(request, serviceAccount))) {
            return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
        }

        const requestUrl = new URL(request.url);
        const strategy = normalizeStrategy(requestUrl.searchParams.get('strategy'));
        const targetUrl = normalizeTargetUrl(requestUrl.searchParams.get('url'));
        const report = await fetchPagespeedReport(targetUrl, strategy);

        return jsonResponse(report, report.ok ? 200 : report.status || 502);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown';

        if (message === 'invalid_target_url') {
            return jsonResponse({ ok: false, error: 'invalid_target_url' }, 400);
        }

        console.error('pagespeed endpoint error:', message);
        return jsonResponse({ ok: false, error: 'pagespeed_failed' }, 500);
    }
}
