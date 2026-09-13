export const ADSENSE_SITE_STATUS = Object.freeze({
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    PAUSED: 'paused',
});

export function normalizeAdsenseSiteStatus(value) {
    const status = String(value || '').trim().toLowerCase();
    return Object.values(ADSENSE_SITE_STATUS).includes(status)
        ? status
        : ADSENSE_SITE_STATUS.UNDER_REVIEW;
}

export function canServeAdsense(config = {}) {
    return normalizeAdsenseSiteStatus(config?.externalIntegrations?.adsenseSiteStatus)
        === ADSENSE_SITE_STATUS.APPROVED;
}
