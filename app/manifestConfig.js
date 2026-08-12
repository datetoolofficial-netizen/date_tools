import { APP_VERSION } from './version';
import { getPublicSiteConfigFromFirestore } from './firestorePublicConfig';

const siteUrl = 'https://date-tool.com';
const fallbackName = 'أدوات التاريخ الشاملة';
const fallbackShortName = 'أدوات التاريخ';
const fallbackDescription = 'أداة شاملة لحساب العمر وتحويل التواريخ وأدوات الساعة والطقس.';
export const revalidate = 300;

function cleanText(value, fallback = '') {
    return String(value || '').replace(/\s+/g, ' ').trim() || fallback;
}

function normalizeIconUrl(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('/')) return raw;

    try {
        const url = new URL(raw, siteUrl);
        return /^https?:$/i.test(url.protocol) ? url.toString() : '';
    } catch {
        return '';
    }
}

function appendIconVersion(value = '') {
    if (!value) return '';

    try {
        const url = new URL(value, siteUrl);
        url.searchParams.set('v', APP_VERSION);
        return value.startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : url.toString();
    } catch {
        return value;
    }
}

function getIconType(value = '') {
    const path = String(value || '').split('?')[0].toLowerCase();
    if (path.endsWith('.png')) return 'image/png';
    if (path.endsWith('.webp')) return 'image/webp';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
    if (path.endsWith('.ico')) return 'image/x-icon';
    return undefined;
}

function buildAppIcon(src, sizes, purpose) {
    const icon = {
        src: appendIconVersion(src),
        sizes,
        purpose,
    };
    const type = getIconType(src);
    if (type) icon.type = type;
    return icon;
}

async function getInstallIdentity() {
    const config = await getPublicSiteConfigFromFirestore({ revalidate: 300 });
    return {
        name: cleanText(config.toolDisplayName, fallbackName),
        shortName: cleanText(config.toolDisplayName, fallbackShortName).slice(0, 24),
        description: cleanText(config.toolSlogan, fallbackDescription),
        logoUrl: normalizeIconUrl(config.logoUrl),
        faviconUrl: normalizeIconUrl(config.faviconUrl),
        appIconUrl: normalizeIconUrl(config.appIconUrl),
        pwaShortcutDateIconUrl: normalizeIconUrl(config.pwaShortcutDateIconUrl),
        pwaShortcutClockIconUrl: normalizeIconUrl(config.pwaShortcutClockIconUrl),
        pwaShortcutWeatherIconUrl: normalizeIconUrl(config.pwaShortcutWeatherIconUrl),
    };
}

function withShortcutIcon(shortcut, customIconUrl = '') {
    if (!customIconUrl) return shortcut;

    return {
        ...shortcut,
        icons: [
            buildAppIcon(customIconUrl, '192x192', 'any'),
            buildAppIcon(customIconUrl, '512x512', 'any'),
        ],
    };
}

export async function buildManifest() {
    const identity = await getInstallIdentity();
    const name = identity.name || fallbackName;
    const shortName = identity.shortName || fallbackShortName;
    const description = identity.description || fallbackDescription;
    const appIconUrl = identity.appIconUrl || identity.logoUrl || identity.faviconUrl || '';
    const appIcons = appIconUrl
        ? [
            buildAppIcon(appIconUrl, '192x192', 'any'),
            buildAppIcon(appIconUrl, '512x512', 'any'),
            buildAppIcon(appIconUrl, '192x192', 'maskable'),
            buildAppIcon(appIconUrl, '512x512', 'maskable'),
        ]
        : [];

    return {
        name,
        short_name: shortName,
        description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'ar',
        background_color: '#0f172a',
        theme_color: '#1e3a8a',
        categories: ['utilities', 'productivity'],
        icons: appIcons,
        shortcuts: [
            withShortcutIcon({
                name,
                short_name: 'التاريخ',
                url: '/',
            }, identity.pwaShortcutDateIconUrl),
            withShortcutIcon({
                name: 'أدوات الساعة',
                short_name: 'الساعة',
                url: '/clock',
            }, identity.pwaShortcutClockIconUrl),
            withShortcutIcon({
                name: 'أدوات الطقس',
                short_name: 'الطقس',
                url: '/weather',
            }, identity.pwaShortcutWeatherIconUrl),
        ],
    };
}
