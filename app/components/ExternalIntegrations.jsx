'use client';

import { useEffect } from 'react';

const GOOGLE_TAG_PATTERN = /^(G|AW|DC)-[A-Z0-9-]+$/i;
const GOOGLE_TAG_MANAGER_PATTERN = /^GTM-[A-Z0-9-]+$/i;
const GOOGLE_VERIFICATION_PATTERN = /^[A-Za-z0-9_-]{10,120}$/;
const INTEGRATION_ATTRIBUTE = 'data-date-tools-integration';

function clean(value = '') {
    return String(value || '').trim();
}

function removeExistingNodes() {
    document
        .querySelectorAll(`[${INTEGRATION_ATTRIBUTE}="true"]`)
        .forEach((node) => node.remove());
}

function appendHeadScript({ src, content, async = false, crossOrigin = '' }) {
    const script = document.createElement('script');
    script.setAttribute(INTEGRATION_ATTRIBUTE, 'true');

    if (src) script.src = src;
    if (content) script.text = content;
    if (async) script.async = true;
    if (crossOrigin) script.crossOrigin = crossOrigin;

    document.head.appendChild(script);
}

function appendGoogleSiteVerification(code) {
    if (!GOOGLE_VERIFICATION_PATTERN.test(code)) return;

    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = code;
    meta.setAttribute(INTEGRATION_ATTRIBUTE, 'true');
    document.head.appendChild(meta);
}

function appendGoogleTag(tagId) {
    if (!GOOGLE_TAG_PATTERN.test(tagId)) return;

    const encodedTagId = encodeURIComponent(tagId);
    appendHeadScript({
        src: `https://www.googletagmanager.com/gtag/js?id=${encodedTagId}`,
        async: true,
    });
    appendHeadScript({
        content: [
            'window.dataLayer = window.dataLayer || [];',
            'function gtag(){dataLayer.push(arguments);}',
            'gtag("js", new Date());',
            `gtag("config", "${tagId}");`,
        ].join('\n'),
    });
}

function appendGoogleTagManager(containerId) {
    if (!GOOGLE_TAG_MANAGER_PATTERN.test(containerId)) return;

    const encodedContainerId = encodeURIComponent(containerId);
    appendHeadScript({
        content: [
            'window.dataLayer = window.dataLayer || [];',
            'window.dataLayer.push({"gtm.start": new Date().getTime(), event: "gtm.js"});',
        ].join('\n'),
    });
    appendHeadScript({
        src: `https://www.googletagmanager.com/gtm.js?id=${encodedContainerId}`,
        async: true,
    });
}

export default function ExternalIntegrations() {
    useEffect(() => {
        let isMounted = true;

        async function loadIntegrations() {
            try {
                const { getSiteConfig } = await import('../firebase');
                const siteConfig = await getSiteConfig();
                const integrations = siteConfig?.externalIntegrations || {};

                if (!isMounted) return;

                removeExistingNodes();
                appendGoogleSiteVerification(clean(integrations.googleSiteVerification));
                appendGoogleTag(clean(integrations.googleTagId).toUpperCase());
                appendGoogleTagManager(clean(integrations.googleTagManagerId).toUpperCase());
            } catch (error) {
                console.warn('External integrations were skipped:', error);
            }
        }

        loadIntegrations();

        return () => {
            isMounted = false;
            removeExistingNodes();
        };
    }, []);

    return null;
}
