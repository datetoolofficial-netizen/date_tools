export const DEFAULT_LINK_PREVIEW = {
    useSiteTitle: true,
    useSiteSlogan: true,
    useLogoImage: true,
    title: '',
    description: '',
    siteName: '',
    imageUrl: '',
};

export function normalizeLinkPreviewSettings(settings = {}) {
    return {
        ...DEFAULT_LINK_PREVIEW,
        ...settings,
        useSiteTitle: settings.useSiteTitle !== false,
        useSiteSlogan: settings.useSiteSlogan !== false,
        useLogoImage: settings.useLogoImage !== false,
        title: String(settings.title || '').trim().slice(0, 90),
        description: String(settings.description || '').trim().slice(0, 220),
        siteName: String(settings.siteName || '').trim().slice(0, 70),
        imageUrl: String(settings.imageUrl || '').trim().slice(0, 500),
    };
}

export function resolveLinkPreview(config = {}) {
    const settings = normalizeLinkPreviewSettings(config.linkPreview || {});
    const titleFallback = config.toolDisplayName || config.mainSEO?.title || 'أدوات التاريخ الشاملة';
    const descriptionFallback = config.toolSlogan || config.mainSEO?.description || 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة';
    const logoFallback = config.logoUrl || config.faviconUrl || '';

    return {
        ...settings,
        title: settings.useSiteTitle ? titleFallback : (settings.title || titleFallback),
        description: settings.useSiteSlogan ? descriptionFallback : (settings.description || descriptionFallback),
        siteName: settings.siteName || config.toolDisplayName || titleFallback,
        imageUrl: settings.useLogoImage ? logoFallback : (settings.imageUrl || logoFallback),
    };
}
