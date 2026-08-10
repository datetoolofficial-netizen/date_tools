const PUBLIC_CONFIG_KEYS = [
    'toolDisplayName',
    'toolSlogan',
    'contactEmail',
    'hasLogo',
    'logoUrl',
    'faviconUrl',
    'appIconUrl',
    'pwaShortcutDateIconUrl',
    'pwaShortcutClockIconUrl',
    'pwaShortcutWeatherIconUrl',
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

export function pickPublicSiteConfig(config = {}, includeContent = false) {
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
