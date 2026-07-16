'use client';

import { useEffect } from 'react';
import { getPrivacyConsent, PRIVACY_CONSENT_EVENT } from '../privacyConsent';

const GOOGLE_TAG_PATTERN = /^(G|AW|DC)-[A-Z0-9-]+$/i;
const GOOGLE_TAG_MANAGER_PATTERN = /^GTM-[A-Z0-9-]+$/i;
const CLARITY_PROJECT_PATTERN = /^[A-Za-z0-9]{6,30}$/;
const META_PIXEL_PATTERN = /^[0-9]{5,30}$/;
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

function appendMicrosoftClarity(projectId) {
    if (!CLARITY_PROJECT_PATTERN.test(projectId)) return;

    appendHeadScript({
        content: [
            '(function(c,l,a,r,i,t,y){',
            'c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};',
            't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;',
            'y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);',
            `})(window, document, "clarity", "script", "${projectId}");`,
        ].join('\n'),
    });
}

function appendMetaPixel(pixelId) {
    if (!META_PIXEL_PATTERN.test(pixelId)) return;

    appendHeadScript({
        content: [
            '!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?',
            'n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;',
            'n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;',
            't.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}',
            '(window, document,"script","https://connect.facebook.net/en_US/fbevents.js");',
            `fbq("init", "${pixelId}");`,
            'fbq("track", "PageView");',
        ].join('\n'),
    });
}

export default function ExternalIntegrations() {
    useEffect(() => {
        let isMounted = true;

        async function loadIntegrations() {
            try {
                const consent = getPrivacyConsent();
                const canLoadAnalytics = consent?.analytics === true;
                const canLoadMarketing = consent?.marketing === true;

                removeExistingNodes();
                if (!canLoadAnalytics && !canLoadMarketing) return;

                const { getSiteConfig } = await import('../firebase');
                const siteConfig = await getSiteConfig();
                const integrations = siteConfig?.externalIntegrations || {};

                if (!isMounted) return;

                removeExistingNodes();

                if (canLoadAnalytics) {
                    appendGoogleTag(clean(integrations.googleTagId).toUpperCase());
                    appendGoogleTagManager(clean(integrations.googleTagManagerId).toUpperCase());
                    appendMicrosoftClarity(clean(integrations.microsoftClarityProjectId));
                }

                if (canLoadMarketing) {
                    appendMetaPixel(clean(integrations.metaPixelId));
                }
            } catch (error) {
                console.warn('External integrations were skipped.');
            }
        }

        loadIntegrations();
        window.addEventListener(PRIVACY_CONSENT_EVENT, loadIntegrations);

        return () => {
            isMounted = false;
            window.removeEventListener(PRIVACY_CONSENT_EVENT, loadIntegrations);
            removeExistingNodes();
        };
    }, []);

    return null;
}
