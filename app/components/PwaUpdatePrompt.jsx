'use client';

import { useEffect, useMemo, useState } from 'react';
import { normalizePwaUpdatePrompt } from '../pwaPromptSettings';

const UPDATE_SEEN_KEY = 'date_tools_pwa_update_seen';

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
    const instructions = useMemo(() => (
        typeof navigator === 'undefined' ? '' : getPlatformInstructions(lang)
    ), [lang]);

    useEffect(() => {
        if (!normalized.enabled || !isStandaloneDisplay()) {
            setIsVisible(false);
            return;
        }

        setIsVisible(localStorage.getItem(UPDATE_SEEN_KEY) !== normalized.version);
    }, [normalized.enabled, normalized.version]);

    if (blocked || !isVisible) return null;

    const dismiss = () => {
        localStorage.setItem(UPDATE_SEEN_KEY, normalized.version);
        setIsVisible(false);
    };

    const updateNow = () => {
        localStorage.setItem(UPDATE_SEEN_KEY, normalized.version);
        window.location.reload();
    };

    return (
        <div className="pwa-install-prompt pwa-update-prompt" role="dialog" aria-live="polite" aria-label={lang === 'en' ? 'App update available' : 'يتوفر تحديث للأداة'}>
            <span className="pwa-install-icon" aria-hidden="true">
                <i className="fa-solid fa-rotate"></i>
            </span>
            <span className="pwa-install-copy">
                <strong>{lang === 'en' ? `Update ${normalized.version} is available` : `يتوفر تحديث جديد ${normalized.version}`}</strong>
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
