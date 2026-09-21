export const ANONYMOUS_ANALYTICS_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeAnonymousAnalyticsId(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return ANONYMOUS_ANALYTICS_ID_PATTERN.test(normalized) ? normalized : '';
}

export function calculateInstallConversion(installs, visitors) {
    const safeInstalls = Math.max(0, Number(installs) || 0);
    const safeVisitors = Math.max(0, Number(visitors) || 0);
    if (safeVisitors === 0) return 0;
    return Math.min(100, (safeInstalls / safeVisitors) * 100);
}
