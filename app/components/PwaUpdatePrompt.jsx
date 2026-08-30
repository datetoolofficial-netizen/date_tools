'use client';

import { useEffect, useMemo, useState } from 'react';
import { normalizePwaUpdatePrompt } from '../pwaPromptSettings';
import { APP_VERSION } from '../version';
import { shouldShowPwaUpdate } from '../pwaVersionCheck';

const UPDATE_DISMISSED_KEY = 'date_tools_pwa_update_dismissed';
const LEGACY_UPDATE_SEEN_KEY = 'date_tools_pwa_update_seen';
const VERSION_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

function isStandaloneDisplay() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true
        || document.referrer.startsWith('android-app://');
}

function getPlatformInstructions(lang) {
    const userAgent = navigator.userAgent || '';
    const isIos = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isEdge = /Edg\//i.test(userAgent);

    if (lang === 'en') {
        if (isIos) return 'Close the app completely, then open it again. If needed, pull the page down to refresh it.';
        if (isAndroid) return 'Tap Update now, or close the installed app and open it again to load the latest version.';
        if (isEdge) return 'Select Update now. You can also close the installed app and reopen it, then press Ctrl+R if needed.';
        return 'Select Update now. You can also close the installed app and reopen it, then press Ctrl+R if needed.';
    }

    if (isIos) return 'أغلق الأداة بالكامل ثم افتحها من جديد. ويمكنك سحب الصفحة إلى الأسفل لإعادة تحميلها عند الحاجة.';
    if (isAndroid) return 'اضغط تحديث الآن، أو أغلق التطبيق المثبّت وافتحه من جديد لتحميل النسخة الأخيرة.';
    if (isEdge) return 'اضغط تحديث الآن. ويمكنك أيضًا إغلاق التطبيق المثبّت وفتحه مجددًا ثم استخدام Ctrl+R عند الحاجة.';
    return 'اضغط تحديث الآن. ويمكنك أيضًا إغلاق التطبيق المثبّت وفتحه مجددًا ثم استخدام Ctrl+R عند الحاجة.';
}

export default function PwaUpdatePrompt({ settings, blocked = false, lang = 'ar' }) {
    const normalized = normalizePwaUpdatePrompt(settings);
    const [isVisible, setIsVisible] = useState(false);
    const [latestRelease, setLatestRelease] = useState(null);
    const instructions = useMemo(() => (
        typeof navigator === 'undefined' ? '' : getPlatformInstructions(lang)
    ), [lang]);

    useEffect(() => {
        if (!normalized.enabled || !isStandaloneDisplay()) {
            setIsVisible(false);
            return;
        }

        const loadedUrl = new URL(window.location.href);
        if (loadedUrl.searchParams.has('app-update')) {
            loadedUrl.searchParams.delete('app-update');
            window.history.replaceState(window.history.state, '', loadedUrl.toString());
        }

        let isActive = true;
        let lastCheckedAt = 0;

        const checkLatestVersion = async (force = false) => {
            const now = Date.now();
            if (!force && now - lastCheckedAt < VERSION_CHECK_INTERVAL_MS) return;
            lastCheckedAt = now;

            try {
                const response = await fetch(`/api/app-version?t=${now}`, {
                    cache: 'no-store',
                    headers: { Accept: 'application/json' },
                });
                if (!response.ok) return;

                const release = await response.json();
                if (!isActive || typeof release?.version !== 'string') return;

                const dismissedVersion = localStorage.getItem(UPDATE_DISMISSED_KEY)
                    || localStorage.getItem(LEGACY_UPDATE_SEEN_KEY)
                    || '';
                setLatestRelease(release);
                setIsVisible(shouldShowPwaUpdate({
                    currentVersion: APP_VERSION,
                    latestVersion: release.version,
                    dismissedVersion,
                }));
            } catch {
                // A failed background check must not interrupt the installed app.
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') checkLatestVersion(true);
        };
        const handleFocus = () => checkLatestVersion();

        checkLatestVersion(true);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            isActive = false;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [normalized.enabled]);

    if (blocked || !isVisible) return null;

    const dismiss = () => {
        if (latestRelease?.version) {
            localStorage.setItem(UPDATE_DISMISSED_KEY, latestRelease.version);
        }
        setIsVisible(false);
    };

    const updateNow = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('app-update', latestRelease?.version || String(Date.now()));
        window.location.replace(url.toString());
    };

    return (
        <div className="pwa-install-prompt pwa-update-prompt" role="dialog" aria-live="polite" aria-label={lang === 'en' ? 'App update available' : 'يتوفر تحديث للأداة'}>
            <span className="pwa-install-icon" aria-hidden="true">
                <i className="fa-solid fa-rotate"></i>
            </span>
            <span className="pwa-install-copy">
                <strong>{lang === 'en' ? `Update ${latestRelease?.version || ''} is available` : `يتوفر تحديث جديد ${latestRelease?.version || ''}`}</strong>
                {latestRelease?.publishedAt && (
                    <small>{lang === 'en' ? `Published ${latestRelease.publishedAt}` : `تاريخ النشر: ${latestRelease.publishedAt}`}</small>
                )}
                <span>{instructions}</span>
            </span>
            <span className="pwa-install-actions">
                <button type="button" className="pwa-install-main" onClick={updateNow}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span>{lang === 'en' ? 'Update now' : 'تحديث الآن'}</span>
                </button>
                <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label={lang === 'en' ? 'Dismiss update notice' : 'إخفاء تنبيه التحديث'}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </span>
        </div>
    );
}
