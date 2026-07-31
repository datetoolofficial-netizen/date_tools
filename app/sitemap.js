import { SITE_URL, publicToolSeo } from './seoConfig';

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
    'ads.txt',
]);

const staticEntries = [
    { path: publicToolSeo.date.path, changeFrequency: 'daily', priority: 1 },
    { path: publicToolSeo.clock.path, changeFrequency: 'weekly', priority: 0.85 },
    { path: publicToolSeo.weather.path, changeFrequency: 'weekly', priority: 0.85 },
    { path: '/month-names', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
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
    ].filter((group) => group && typeof group === 'object' && !Array.isArray(group));

    const entries = [];
    groups.forEach((group) => {
        Object.entries(group).forEach(([fallbackSlug, page]) => {
            if (!page || typeof page !== 'object') return;
            if (!isPageVisible(page)) return;

            const path = normalizePublicPath(page, fallbackSlug);
            if (!path || path === '/') return;

            entries.push({
                path,
                changeFrequency: 'monthly',
                priority: 0.5,
            });
        });
    });

    return entries;
}

async function getDynamicEntries() {
    try {
        const response = await fetch(firestoreSettingsUrl, {
            headers: { Accept: 'application/json' },
            next: { revalidate },
        });

        if (!response.ok) return [];

        const payload = await response.json();
        const settings = decodeFirestoreFields(payload.fields || {});
        return collectDynamicPages(settings);
    } catch {
        return [];
    }
}

export default async function sitemap() {
    const now = new Date();
    const entriesByPath = new Map();

    [...staticEntries, ...(await getDynamicEntries())].forEach((entry) => {
        entriesByPath.set(entry.path, entry);
    });

    return Array.from(entriesByPath.values()).map(({ path, ...entry }) => ({
        url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
        lastModified: now,
        ...entry,
    }));
}
