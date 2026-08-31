import { SITE_URL, publicToolSeo } from './seoConfig';
import { normalizeToolSettings } from './toolSettings';
import { LEGACY_TOOL_SECTION_REDIRECTS } from '../toolSectionRoutes';
import { getPublicSiteConfigFromFirestore } from './firestorePublicConfig';

export const revalidate = 3600;

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
    ...Object.keys(LEGACY_TOOL_SECTION_REDIRECTS).map((legacyPath) => legacyPath.slice(1)),
]);

const legacyAliasSlugs = new Set(['about']);
const staticEntries = [
    { path: '/month-names', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
];

// Update only the affected family when its public page content changes.
const toolContentLastModified = {
    date: '2026-08-31',
    clock: '2026-08-31',
    weather: '2026-08-31',
};

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
    return getPublicSiteConfigFromFirestore({ revalidate });
}

function normalizeLastModified(value) {
    const parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
}

function latestLastModified(...values) {
    return values
        .map(normalizeLastModified)
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())[0];
}

function collectToolEntries(settings = {}) {
    const tools = normalizeToolSettings(settings.toolSettings || {});
    const mainTools = [
        { path: publicToolSeo.date.path, changeFrequency: 'weekly', priority: 1, lastModified: latestLastModified(tools.date.seo?.lastModified, toolContentLastModified.date) },
        { path: publicToolSeo.clock.path, changeFrequency: 'weekly', priority: 0.85, lastModified: latestLastModified(tools.clock.seo?.lastModified, toolContentLastModified.clock) },
        { path: publicToolSeo.weather.path, changeFrequency: 'weekly', priority: 0.85, lastModified: latestLastModified(tools.weather.seo?.lastModified, toolContentLastModified.weather) },
    ];

    return mainTools;
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
