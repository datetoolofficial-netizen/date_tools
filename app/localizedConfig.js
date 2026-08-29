const IDENTITY_TEXT_FIELDS = [
    'toolDisplayName',
    'toolSlogan',
    'copyrightName',
    'copyrightText',
];

function cleanText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

export function normalizeIdentityTranslations(value = {}) {
    const english = value?.en || {};
    return {
        en: {
            ...Object.fromEntries(IDENTITY_TEXT_FIELDS.map((field) => [field, cleanText(english[field])])),
            pwaInstallPrompt: {
                text: cleanText(english.pwaInstallPrompt?.text),
                buttonText: cleanText(english.pwaInstallPrompt?.buttonText),
            },
            mainSEO: {
                title: cleanText(english.mainSEO?.title),
                description: cleanText(english.mainSEO?.description),
            },
        },
    };
}

export function getLocalizedSiteConfig(config = {}, lang = 'ar') {
    if (lang !== 'en') return config;

    const english = normalizeIdentityTranslations(config.identityTranslations).en;
    const localized = { ...config };
    IDENTITY_TEXT_FIELDS.forEach((field) => {
        if (english[field]) localized[field] = english[field];
    });

    localized.pwaInstallPrompt = {
        ...(config.pwaInstallPrompt || {}),
        ...(english.pwaInstallPrompt.text ? { text: english.pwaInstallPrompt.text } : {}),
        ...(english.pwaInstallPrompt.buttonText ? { buttonText: english.pwaInstallPrompt.buttonText } : {}),
    };
    localized.mainSEO = {
        ...(config.mainSEO || {}),
        ...(english.mainSEO.title ? { title: english.mainSEO.title } : {}),
        ...(english.mainSEO.description ? { description: english.mainSEO.description } : {}),
    };

    return localized;
}
