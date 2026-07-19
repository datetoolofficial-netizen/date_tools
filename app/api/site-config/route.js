const FIRESTORE_SETTINGS_URL = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

export const revalidate = 300;

const PUBLIC_CONFIG_KEYS = [
    'toolDisplayName',
    'toolSlogan',
    'contactEmail',
    'hasLogo',
    'logoUrl',
    'faviconUrl',
    'googleAdSlots',
    'copyrightName',
    'copyrightText',
    'internalPages',
    'socialLinks',
    'externalLinks',
    'events',
    'toolSettings',
    'linkPreview',
    'privacySettingsButton',
    'pwaInstallPrompt',
    'mainSEO',
];

function jsonResponse(body, status = 200, cacheControl = 'public, s-maxage=300, stale-while-revalidate=86400') {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': cacheControl,
        },
    });
}

function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue || '';
    if ('booleanValue' in value) return Boolean(value.booleanValue);
    if ('integerValue' in value) return Number(value.integerValue || 0);
    if ('doubleValue' in value) return Number(value.doubleValue || 0);
    if ('nullValue' in value) return null;
    if ('arrayValue' in value) {
        return (value.arrayValue.values || [])
            .map(decodeFirestoreValue)
            .filter((item) => item !== undefined);
    }
    if ('mapValue' in value) {
        return decodeFirestoreFields(value.mapValue.fields || {});
    }

    return undefined;
}

function decodeFirestoreFields(fields = {}) {
    return Object.entries(fields).reduce((result, [key, value]) => {
        const decodedValue = decodeFirestoreValue(value);
        if (decodedValue !== undefined) result[key] = decodedValue;
        return result;
    }, {});
}

function cleanPublicExternalIntegrations(value = {}) {
    return {
        googleTagId: String(value.googleTagId || '').trim(),
        googleTagManagerId: String(value.googleTagManagerId || '').trim(),
        googleAdsenseClient: String(value.googleAdsenseClient || '').trim(),
        googleSiteVerification: String(value.googleSiteVerification || '').trim(),
        bingSiteVerification: String(value.bingSiteVerification || '').trim(),
        microsoftClarityProjectId: String(value.microsoftClarityProjectId || '').trim(),
        metaPixelId: String(value.metaPixelId || '').trim(),
    };
}

function cleanInternalPages(pages, includeContent) {
    if (!Array.isArray(pages)) return [];
    if (includeContent) return pages;

    return pages.map((page = {}) => ({
        title: page.title || page.name || page.label || '',
        slug: page.slug || page.path || page.url || '',
        path: page.path || '',
        url: page.url || '',
        location: page.location || '',
        isActive: page.isActive !== false,
        order: Number(page.order || 0),
    }));
}

function pickPublicConfig(config = {}, includeContent = false) {
    const publicConfig = PUBLIC_CONFIG_KEYS.reduce((result, key) => {
        if (key in config) result[key] = config[key];
        return result;
    }, {});

    publicConfig.externalIntegrations = cleanPublicExternalIntegrations(config.externalIntegrations || {});
    publicConfig.internalPages = cleanInternalPages(publicConfig.internalPages, includeContent);
    publicConfig.externalLinks = Array.isArray(publicConfig.externalLinks) ? publicConfig.externalLinks : [];
    publicConfig.socialLinks = Array.isArray(publicConfig.socialLinks) ? publicConfig.socialLinks : [];
    publicConfig.events = Array.isArray(publicConfig.events) ? publicConfig.events : [];
    publicConfig.adCampaigns = [];

    if (includeContent) {
        publicConfig.customPages = config.customPages || {};
        publicConfig.pages = config.pages || {};
    }

    return publicConfig;
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const includeContent = url.searchParams.get('include') === 'pages';
        const response = await fetch(FIRESTORE_SETTINGS_URL, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            return jsonResponse({ ok: false, config: {} }, response.status, 'no-store');
        }

        const payload = await response.json();
        const config = pickPublicConfig(decodeFirestoreFields(payload.fields || {}), includeContent);

        return jsonResponse({ ok: true, config });
    } catch {
        return jsonResponse({ ok: false, config: {} }, 500, 'no-store');
    }
}
