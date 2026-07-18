const siteUrl = 'https://date-tool.com';
const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';
const fallbackName = 'أدوات التاريخ الشاملة';
const fallbackShortName = 'أدوات التاريخ';
const fallbackDescription = 'أداة شاملة لحساب العمر وتحويل التواريخ وأدوات الساعة والطقس.';

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
        };
    } catch {
        return {};
    }
}

export default async function manifest() {
    const identity = await getInstallIdentity();
    const name = identity.name || fallbackName;
    const shortName = identity.shortName || fallbackShortName;
    const description = identity.description || fallbackDescription;
    const logoUrl = identity.logoUrl || '';
    const logoIcons = logoUrl
        ? [
            {
                src: logoUrl,
                sizes: '192x192',
                purpose: 'any',
            },
            {
                src: logoUrl,
                sizes: '512x512',
                purpose: 'any',
            },
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
        icons: [
            ...logoIcons,
            {
                src: '/pwa-icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa-icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name,
                short_name: 'التاريخ',
                url: '/',
                icons: [{ src: logoUrl || '/pwa-icon-192.png', sizes: '192x192', type: logoUrl ? undefined : 'image/png' }],
            },
            {
                name: 'أدوات الساعة',
                short_name: 'الساعة',
                url: '/clock',
                icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
                name: 'أدوات الطقس',
                short_name: 'الطقس',
                url: '/weather',
                icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
        ],
    };
}
