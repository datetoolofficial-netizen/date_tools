import { SITE_URL, publicToolSeo } from './seoConfig';
import { normalizeToolSettings } from './toolSettings';
import { TOOL_SECTION_ROUTE_ENTRIES } from '../toolSectionRoutes';
import { getPublicSiteConfigFromFirestore } from './firestorePublicConfig';
import { getToolLanguageAlternates } from './localizedToolRoutes';

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
    ...TOOL_SECTION_ROUTE_ENTRIES.map(({ publicPath }) => publicPath.slice(1)),
]);

const legacyAliasSlugs = new Set(['about']);

// Update only the affected family when its public page content changes.
const toolContentLastModified = {
    date: '2026-09-01',
    clock: '2026-09-01',
    weather: '2026-09-01',
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

function findPageInList(pages, slug) {
    if (!Array.isArray(pages)) return null;
    const expectedPath = `/${slug}`;

    return pages.find((page) => normalizePublicPath(page) === expectedPath) || null;
}

function resolveManagedPage(settings, slug) {
    const customPages = settings.customPages || {};
    const pages = settings.pages || {};
    const internalPage = findPageInList(settings.internalPages, slug);

    if (!Array.isArray(customPages) && customPages[slug]) {
        return {
            ...(internalPage || {}),
            ...customPages[slug],
            slug,
            title: customPages[slug].title || internalPage?.title,
        };
    }

    if (!Array.isArray(pages) && pages[slug]) return { ...pages[slug], slug };

    const customPage = findPageInList(customPages, slug);
    if (customPage) return customPage;
    if (internalPage) return internalPage;

    return findPageInList(pages, slug);
}

export function collectDynamicPages(settings = {}) {
    const groups = [
        settings.customPages,
        settings.pages,
        settings.internalPages,
    ].filter((group) => group && typeof group === 'object');

    const slugs = new Set();
    groups.forEach((group) => {
        const pages = Array.isArray(group)
            ? group.map((page, index) => [page?.slug || page?.path || String(index), page])
            : Object.entries(group);

        pages.forEach(([fallbackSlug, page]) => {
            if (!page || typeof page !== 'object') return;
            const path = normalizePublicPath(page, fallbackSlug);
            if (!path || path === '/') return;
            slugs.add(path.slice(1));
        });
    });

    return Array.from(slugs).flatMap((slug) => {
        const page = resolveManagedPage(settings, slug);
        if (!page || !isPageVisible(page)) return [];

        const path = normalizePublicPath(page, slug);
        if (!path || path === '/') return [];

        return [{
            path,
            changeFrequency: 'monthly',
            priority: 0.5,
            lastModified: page.lastModified || page.updatedAt || page.modifiedAt || page.publishedAt,
        }];
    });
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

    const subtools = TOOL_SECTION_ROUTE_ENTRIES.map(({ toolKey, subtoolKey, publicPath }) => ({
        path: publicPath,
        changeFrequency: 'weekly',
        priority: toolKey === 'date' ? 0.9 : 0.8,
        lastModified: latestLastModified(
            tools[toolKey]?.subtoolSeo?.[subtoolKey]?.lastModified,
            toolContentLastModified[toolKey]
        ),
    }));

    return [...mainTools, ...subtools].flatMap((entry) => {
        const paths = getToolLanguageAlternates(entry.path);
        const languages = {
            ar: paths.ar === '/' ? SITE_URL : `${SITE_URL}${paths.ar}`,
            en: `${SITE_URL}${paths.en}`,
        };

        return [
            { ...entry, path: paths.ar, alternates: { languages } },
            { ...entry, path: paths.en, alternates: { languages } },
        ];
    });
}

export default async function sitemap() {
    const settings = await getSettings();
    const entriesByPath = new Map();

    [...collectToolEntries(settings), ...collectDynamicPages(settings)].forEach((entry) => {
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
