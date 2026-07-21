import { APP_VERSION } from './version';

const siteUrl = 'https://date-tool.com';
const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';
const fallbackName = 'أدوات التاريخ الشاملة';
const fallbackShortName = 'أدوات التاريخ';
const fallbackDescription = 'أداة شاملة لحساب العمر وتحويل التواريخ وأدوات الساعة والطقس.';
const shortcutIconPaths = {
    date: {
        icon192: '/pwa-shortcut-date-192.png',
        icon512: '/pwa-shortcut-date-512.png',
    },
    clock: {
        icon192: '/pwa-shortcut-clock-192.png',
        icon512: '/pwa-shortcut-clock-512.png',
    },
    weather: {
        icon192: '/pwa-shortcut-weather-192.png',
        icon512: '/pwa-shortcut-weather-512.png',
    },
};

export const revalidate = 300;

function getStringField(fields = {}, key) {
    return fields?.[key]?.stringValue || '';
}

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
    try {
        const response = await fetch(firestoreSettingsUrl, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) return {};

        const payload = await response.json();
        const fields = payload.fields || {};

        return {
            name: cleanText(getStringField(fields, 'toolDisplayName'), fallbackName),
            shortName: cleanText(getStringField(fields, 'toolDisplayName'), fallbackShortName).slice(0, 24),
            description: cleanText(getStringField(fields, 'toolSlogan'), fallbackDescription),
            logoUrl: normalizeIconUrl(getStringField(fields, 'logoUrl')),
            faviconUrl: normalizeIconUrl(getStringField(fields, 'faviconUrl')),
            appIconUrl: normalizeIconUrl(getStringField(fields, 'appIconUrl')),
        };
    } catch {
        return {};
    }
}

function getShortcutIcons(tool) {
    const paths = shortcutIconPaths[tool] || shortcutIconPaths.date;

    return [
        {
            src: paths.icon192,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
        },
        {
            src: paths.icon512,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
        },
    ];
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
            {
                name,
                short_name: 'التاريخ',
                url: '/',
                icons: getShortcutIcons('date'),
            },
            {
                name: 'أدوات الساعة',
                short_name: 'الساعة',
                url: '/clock',
                icons: getShortcutIcons('clock'),
            },
            {
                name: 'أدوات الطقس',
                short_name: 'الطقس',
                url: '/weather',
                icons: getShortcutIcons('weather'),
            },
        ],
    };
}
