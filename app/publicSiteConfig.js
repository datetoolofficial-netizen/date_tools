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
    'pwaUpdatePrompt',
    'mainSEO',
    'identityTranslations',
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
        adsTxtSnippet: String(value.adsTxtSnippet || '').trim(),
    };
}

function cleanGoogleAdSlots(slots = {}) {
    if (!slots || typeof slots !== 'object' || Array.isArray(slots)) return {};

    return Object.fromEntries(Object.entries(slots).map(([slotId, value = {}]) => [
        slotId,
        {
            client: String(value.client || '').trim(),
            slot: String(value.slot || '').trim(),
            format: String(value.format || 'auto').trim(),
            fullWidthResponsive: value.fullWidthResponsive !== false,
            enabledWhenNoAdvertiser: value.enabledWhenNoAdvertiser === true,
            showHouseAd: value.showHouseAd === true,
            houseAdText: String(value.houseAdText || '').trim(),
        },
    ]));
}

function cleanInternalPages(pages, includeContent) {
    if (!Array.isArray(pages)) return [];
    return pages.map((page = {}) => ({
        title: page.title || page.name || page.label || '',
        slug: page.slug || page.path || page.url || '',
        path: page.path || '',
        url: page.url || '',
        location: page.location || '',
        isActive: page.isActive !== false,
        order: Number(page.order || 0),
        ...(includeContent ? { content: String(page.content || '') } : {}),
    }));
}

export function pickPublicSiteConfig(config = {}, includeContent = false) {
    const publicConfig = PUBLIC_CONFIG_KEYS.reduce((result, key) => {
        if (key in config) result[key] = config[key];
        return result;
    }, {});

    publicConfig.externalIntegrations = cleanPublicExternalIntegrations(config.externalIntegrations || {});
    publicConfig.googleAdSlots = cleanGoogleAdSlots(publicConfig.googleAdSlots);
    publicConfig.internalPages = cleanInternalPages(publicConfig.internalPages, includeContent);
    publicConfig.externalLinks = Array.isArray(publicConfig.externalLinks) ? publicConfig.externalLinks : [];
    publicConfig.socialLinks = Array.isArray(publicConfig.socialLinks) ? publicConfig.socialLinks : [];
    publicConfig.events = Array.isArray(publicConfig.events) ? publicConfig.events : [];
    publicConfig.adCampaigns = [];
    publicConfig.identityTranslations = normalizeIdentityTranslations(publicConfig.identityTranslations);
    publicConfig.pwaUpdatePrompt = normalizePwaUpdatePrompt(publicConfig.pwaUpdatePrompt);

    if (includeContent) {
        publicConfig.customPages = config.customPages || {};
        publicConfig.pages = config.pages || {};
    }

    return publicConfig;
}
import { normalizeIdentityTranslations } from './localizedConfig';
import { normalizePwaUpdatePrompt } from './pwaPromptSettings';
