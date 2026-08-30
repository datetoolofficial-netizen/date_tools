const IDENTITY_TEXT_FIELDS = [
    'toolDisplayName',
    'toolSlogan',
    'copyrightName',
    'copyrightText',
];

const DEFAULT_ENGLISH_IDENTITY = {
    toolDisplayName: 'Comprehensive Tools',
    toolSlogan: 'All tools at your fingertips',
    copyrightName: 'Comprehensive Tools',
    copyrightText: 'All rights reserved',
};

const DEFAULT_ENGLISH_PAGE_TITLES = {
    contact: 'Contact Us',
    support: 'Contact Us',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    months: 'Months Table',
    'months-table': 'Months Table',
    'month-names': 'Months Table',
    about: 'About Us',
    'about-us': 'About Us',
};

function cleanText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function containsArabic(value) {
    return /[\u0600-\u06ff]/.test(value);
}

export function normalizeIdentityTranslations(value = {}) {
    const english = value?.en || {};
    return {
        en: {
            ...Object.fromEntries(IDENTITY_TEXT_FIELDS.map((field) => [field, cleanText(english[field]) || DEFAULT_ENGLISH_IDENTITY[field] || ''])),
            pwaInstallPrompt: {
                text: cleanText(english.pwaInstallPrompt?.text) || 'Install this tool for faster access.',
                buttonText: cleanText(english.pwaInstallPrompt?.buttonText) || 'Install',
                manualInstructions: cleanText(english.pwaInstallPrompt?.manualInstructions) || 'On iPhone or iPad, open Share and choose Add to Home Screen.',
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
        ...(english.pwaInstallPrompt.manualInstructions ? { manualInstructions: english.pwaInstallPrompt.manualInstructions } : {}),
    };
    localized.mainSEO = {
        ...(config.mainSEO || {}),
        ...(english.mainSEO.title ? { title: english.mainSEO.title } : {}),
        ...(english.mainSEO.description ? { description: english.mainSEO.description } : {}),
    };

    const localizeItems = (items = []) => items.map((item = {}) => {
        const fallbackTitle = DEFAULT_ENGLISH_PAGE_TITLES[String(item.slug || '').toLowerCase()] || '';
        const savedEnglishTitle = cleanText(item.titleEn);
        return {
            ...item,
            title: (savedEnglishTitle && !containsArabic(savedEnglishTitle) ? savedEnglishTitle : '') || fallbackTitle || item.title,
            label: cleanText(item.labelEn) || item.label,
            name: cleanText(item.nameEn) || item.name,
        };
    });

    localized.internalPages = localizeItems(config.internalPages);
    localized.externalLinks = localizeItems(config.externalLinks);
    localized.socialLinks = localizeItems(config.socialLinks);

    return localized;
}
