'use client';

export const PRIVACY_CONSENT_STORAGE_KEY = 'date_tools_privacy_consent_v1';
export const PRIVACY_CONSENT_EVENT = 'date-tools-privacy-consent';

export const DEFAULT_PRIVACY_CONSENT = {
    necessary: true,
    analytics: false,
    marketing: false,
};

function normalizeConsent(value = {}) {
    return {
        necessary: true,
        analytics: value.analytics === true,
        marketing: value.marketing === true,
    };
}

export function getPrivacyConsent() {
    if (typeof window === 'undefined') return DEFAULT_PRIVACY_CONSENT;

    try {
        const raw = window.localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY);
        if (!raw) return null;
        return normalizeConsent(JSON.parse(raw));
    } catch {
        return null;
    }
}

export function savePrivacyConsent(value) {
    if (typeof window === 'undefined') return DEFAULT_PRIVACY_CONSENT;

    const consent = normalizeConsent(value);
    window.localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, JSON.stringify({
        ...consent,
        updatedAt: new Date().toISOString(),
    }));
    window.dispatchEvent(new CustomEvent(PRIVACY_CONSENT_EVENT, { detail: consent }));
    return consent;
}

export function getSafeCurrentUrl() {
    if (typeof window === 'undefined') return 'https://date-tool.com/';
    return `${window.location.origin}${window.location.pathname}`;
}
