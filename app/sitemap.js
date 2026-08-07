import { SITE_URL, publicToolSeo } from './seoConfig';
import { normalizeToolSettings } from './toolSettings';

export const revalidate = 3600;

const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

const reservedSlugs = new Set([
    'admin',
    'admin_login',
    'api',
    'client',
    'support',
    'manifest.webmanifest',
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'ads.txt',
]);

const legacyAliasSlugs = new Set(['about']);
const DEFAULT_LAST_MODIFIED = '2026-08-04';

const staticEntries = [
    { path: '/month-names', changeFrequency: 'monthly', priority: 0.6, lastModified: DEFAULT_LAST_MODIFIED },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.5, lastModified: DEFAULT_LAST_MODIFIED },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.5, lastModified: DEFAULT_LAST_MODIFIED },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5, lastModified: DEFAULT_LAST_MODIFIED },
];

function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) {
        return (value.arrayValue.values || []).map(decodeFirestoreValue);
    }
    if ('mapValue' in value) {
        return decodeFirestoreFields(value.mapValue.fields || {});
    }
    return undefined;
}
function decodeFirestoreFields(fields = {}) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)])
    );
}

function normalizePublicPath(page, fallbackSlug) {
    const raw = String(page?.slug || page?.path || fallbackSlug || '').trim();
    if (!raw) return '';

    const path = raw
        .replace(/^https?:\/\/[^/]+/i, '')
        .split('?')[0]
        .split('#')[0]
        .replace(/^\/+|\/+$/g, '');

    if (!path) return '/';
    if (path.includes('/')) return '';

    const slug = path.toLowerCase();
    if (reservedSlugs.has(slug)) return '';
    if (legacyAliasSlugs.has(slug)) return '';

    return `/${path}`;
}

function isPageVisible(page = {}) {
    if (page.deleted === true) return false;
    if (page.isDeleted === true) return false;
    if (page.active === false) return false;
    if (page.enabled === false) return false;
    if (page.published === false) return false;
    return true;
}

function collectDynamicPages(settings = {}) {
    const groups = [
        settings.customPages,
        settings.pages,
        settings.internalPages,
    ].filter((group) => group && typeof group === 'object');

    const entries = [];
    groups.forEach((group) => {
        const pages = Array.isArray(group)
            ? group.map((page, index) => [page?.slug || page?.path || String(index), page])
            : Object.entries(group);

        pages.forEach(([fallbackSlug, page]) => {
            if (!page || typeof page !== 'object') return;
            if (!isPageVisible(page)) return;

            const path = normalizePublicPath(page, fallbackSlug);
            if (!path || path === '/') return;

            entries.push({
                path,
                changeFrequency: 'monthly',
                priority: 0.5,
                lastModified: page.lastModified || page.updatedAt || page.modifiedAt || page.publishedAt,
            });
        });
    });

    return entries;
}

async function getSettings() {
    try {
        const response = await fetch(firestoreSettingsUrl, {
            headers: { Accept: 'application/json' },
            next: { revalidate },
        });

        if (!response.ok) return {};

        const payload = await response.json();
        return decodeFirestoreFields(payload.fields || {});
    } catch {
        return {};
    }
}

function normalizeLastModified(value) {
    const parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
}

function collectToolEntries(settings = {}) {
    const tools = normalizeToolSettings(settings.toolSettings || {});
    return [
        { path: publicToolSeo.date.path, changeFrequency: 'weekly', priority: 1, lastModified: tools.date.seo?.lastModified },
        { path: publicToolSeo.clock.path, changeFrequency: 'weekly', priority: 0.85, lastModified: tools.clock.seo?.lastModified },
        { path: publicToolSeo.weather.path, changeFrequency: 'weekly', priority: 0.85, lastModified: tools.weather.seo?.lastModified },
    ];
}

export default async function sitemap() {
    const settings = await getSettings();
    const entriesByPath = new Map();

    [...staticEntries, ...collectToolEntries(settings), ...collectDynamicPages(settings)].forEach((entry) => {
        entriesByPath.set(entry.path, entry);
    });

    return Array.from(entriesByPath.values()).map(({ path, lastModified, ...entry }) => {
        const normalizedDate = normalizeLastModified(lastModified);

        return {
            url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
            ...(normalizedDate ? { lastModified: normalizedDate } : {}),
            ...entry,
        };
    });
}
