'use client';

import { getPrivacyConsent } from './privacyConsent';
import { normalizeAnonymousAnalyticsId } from './statisticsPolicy';

const ANALYTICS_ID_KEY = 'date_tools_anonymous_analytics_id_v1';

export function getAnonymousAnalyticsId() {
    if (typeof window === 'undefined' || getPrivacyConsent()?.analytics !== true) return '';

    try {
        const current = normalizeAnonymousAnalyticsId(localStorage.getItem(ANALYTICS_ID_KEY));
        if (current) return current;

        const next = crypto.randomUUID();
        localStorage.setItem(ANALYTICS_ID_KEY, next);
        return next;
    } catch {
        return '';
    }
}

export async function sendPublicStatisticEvent(payload) {
    if (typeof window === 'undefined' || getPrivacyConsent()?.analytics !== true) return;

    const visitorId = getAnonymousAnalyticsId();
    try {
        await fetch('/api/statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, ...(visitorId ? { visitorId } : {}) }),
            keepalive: true,
        });
    } catch {
        // Analytics must never interrupt the visitor experience.
    }
}

export function trackPwaInstallation(method = 'standalone') {
    return sendPublicStatisticEvent({ event: 'pwaInstall', method });
}
