import { TOOL_SECTION_ROUTE_ENTRIES } from '../toolSectionRoutes';

export const ENGLISH_ROUTE_PREFIX = '/en';

const TOOL_FAMILY_PATHS = ['/', '/clock', '/weather'];
const TOOL_PUBLIC_PATHS = new Set([
    ...TOOL_FAMILY_PATHS,
    ...TOOL_SECTION_ROUTE_ENTRIES.map(({ publicPath }) => publicPath),
]);

function normalizePathname(value = '/') {
    const raw = String(value || '/').trim().split('?')[0].split('#')[0];
    const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
    const normalized = withLeadingSlash.replace(/\/{2,}/g, '/').replace(/\/$/, '');
    return normalized || '/';
}

export function addEnglishPrefix(pathname = '/') {
    const normalized = normalizePathname(pathname);
    if (normalized === ENGLISH_ROUTE_PREFIX || normalized.startsWith(`${ENGLISH_ROUTE_PREFIX}/`)) return normalized;
    return normalized === '/' ? ENGLISH_ROUTE_PREFIX : `${ENGLISH_ROUTE_PREFIX}${normalized}`;
}

export function getArabicToolPath(pathname = '/') {
    const normalized = normalizePathname(pathname);
    if (TOOL_PUBLIC_PATHS.has(normalized)) return normalized;

    if (normalized === ENGLISH_ROUTE_PREFIX) return '/';
    if (!normalized.startsWith(`${ENGLISH_ROUTE_PREFIX}/`)) return '';

    const candidate = normalized.slice(ENGLISH_ROUTE_PREFIX.length) || '/';
    return TOOL_PUBLIC_PATHS.has(candidate) ? candidate : '';
}

export function getToolRouteLanguage(pathname = '/') {
    const normalized = normalizePathname(pathname);
    if (!getArabicToolPath(normalized)) return '';
    return normalized === ENGLISH_ROUTE_PREFIX || normalized.startsWith(`${ENGLISH_ROUTE_PREFIX}/`) ? 'en' : 'ar';
}

export function localizeToolPath(pathname = '/', lang = 'ar') {
    const arabicPath = getArabicToolPath(pathname);
    if (!arabicPath) return normalizePathname(pathname);
    return lang === 'en' ? addEnglishPrefix(arabicPath) : arabicPath;
}

export function getToolLanguageAlternates(pathname = '/') {
    const arabicPath = getArabicToolPath(pathname) || normalizePathname(pathname);
    return {
        ar: arabicPath,
        en: addEnglishPrefix(arabicPath),
    };
}

export function isIndexableToolPath(pathname = '/') {
    return Boolean(getArabicToolPath(pathname));
}
