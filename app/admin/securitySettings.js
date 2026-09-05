const DEFAULT_PAGE_TITLE_EN = {
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

function normalizeSlug(value) {
    return String(value || '')
        .trim()
        .replace(/^\/+/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_ء-ي]/g, '');
}

export function normalizeSecurityPagePath(value) {
    const cleanValue = String(value || '/').trim();
    if (!cleanValue || cleanValue === '/') return '/';
    const withoutQuery = cleanValue.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

export function getPrivacyPageChoices(pages = []) {
    const choices = [
        { path: '/', title: 'التاريخ', titleEn: 'Date' },
        { path: '/clock', title: 'الساعة', titleEn: 'Clock' },
        { path: '/weather', title: 'الطقس', titleEn: 'Weather' },
    ];

    pages.forEach((page) => {
        const slug = normalizeSlug(page?.slug);
        if (!slug) return;
        const path = normalizeSecurityPagePath(slug);
        if (choices.some((choice) => choice.path === path)) return;

        choices.push({
            path,
            title: page?.title || path,
            titleEn: page?.titleEn || DEFAULT_PAGE_TITLE_EN[slug] || '',
        });
    });

    return choices;
}

export function pickSecuritySettings(config = {}) {
    return {
        privacySettingsButton: {
            enabled: config.privacySettingsButton?.enabled === true,
            pages: Array.isArray(config.privacySettingsButton?.pages)
                ? config.privacySettingsButton.pages.map(normalizeSecurityPagePath)
                : [],
        },
        internalPages: Array.isArray(config.internalPages) ? config.internalPages : [],
    };
}
