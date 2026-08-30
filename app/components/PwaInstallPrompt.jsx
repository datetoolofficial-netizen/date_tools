'use client';

import { useEffect, useState } from 'react';

const LEGACY_DISMISSED_KEY = 'date_tools_pwa_install_dismissed';
const COLLAPSED_KEY = 'date_tools_pwa_install_collapsed';
const COMPLETED_KEY = 'date_tools_pwa_install_decided';
const PROMPT_STATE_VERSION_KEY = 'date_tools_pwa_install_state_version';
const PROMPT_STATE_VERSION = '2';
const INSTALL_PROMPT_DELAY_MS = 12_000;
const DEFAULT_PROMPT_TEXT = 'ثبّت الأداة على جهازك لاستخدام أسرع';
const DEFAULT_BUTTON_TEXT = 'ثبّت الأداة';

function isStandaloneDisplay() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true
        || document.referrer.startsWith('android-app://');
}

export default function PwaInstallPrompt({ settings, iconUrl, lang = 'ar', blocked = false }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isIosInstall, setIsIosInstall] = useState(false);
    const [view, setView] = useState('hidden');
    const isEnabled = settings?.enabled !== false;
    const promptText = settings?.text?.trim() || DEFAULT_PROMPT_TEXT;
    const buttonText = settings?.buttonText?.trim() || DEFAULT_BUTTON_TEXT;
    const manualInstructions = settings?.manualInstructions?.trim() || (lang === 'en'
        ? 'On iPhone or iPad, open Share and choose Add to Home Screen.'
        : 'على iPhone أو iPad: افتح قائمة المشاركة ثم اختر إضافة إلى الشاشة الرئيسية.');

    useEffect(() => {
        if (!isEnabled || isStandaloneDisplay()) return undefined;

        // Older releases treated a dismissed prompt as a permanent decision.
        // A normal browser session should stay eligible until standalone mode is detected.
        localStorage.removeItem(COMPLETED_KEY);
        if (localStorage.getItem(PROMPT_STATE_VERSION_KEY) !== PROMPT_STATE_VERSION) {
            localStorage.removeItem(COLLAPSED_KEY);
            localStorage.removeItem(LEGACY_DISMISSED_KEY);
            localStorage.setItem(PROMPT_STATE_VERSION_KEY, PROMPT_STATE_VERSION);
        }

        const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent || '')
            && window.navigator.standalone !== true;

        const wasCollapsed = localStorage.getItem(COLLAPSED_KEY) === 'true'
            || localStorage.getItem(LEGACY_DISMISSED_KEY) === 'true';
        if (localStorage.getItem(LEGACY_DISMISSED_KEY) === 'true') {
            localStorage.setItem(COLLAPSED_KEY, 'true');
            localStorage.removeItem(LEGACY_DISMISSED_KEY);
        }

        let showTimerId;

        if (isIos) {
            setIsIosInstall(true);
            showTimerId = window.setTimeout(() => setView(wasCollapsed ? 'compact' : 'full'), INSTALL_PROMPT_DELAY_MS);
        }

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
            window.clearTimeout(showTimerId);
            if (wasCollapsed) {
                setView('compact');
            } else {
                showTimerId = window.setTimeout(() => setView('full'), INSTALL_PROMPT_DELAY_MS);
            }
        };

        const handleInstalled = () => {
            window.clearTimeout(showTimerId);
            setInstallPrompt(null);
            setView('hidden');
            localStorage.setItem(COMPLETED_KEY, 'true');
            localStorage.removeItem(COLLAPSED_KEY);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.clearTimeout(showTimerId);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, [isEnabled]);

    if (blocked || !isEnabled || view === 'hidden' || (!installPrompt && !isIosInstall)) return null;

    const installApp = async () => {
        if (isIosInstall) {
            localStorage.setItem(COLLAPSED_KEY, 'true');
            setView('compact');
            return;
        }
        installPrompt.prompt();
        const choice = await installPrompt.userChoice.catch(() => null);
        setInstallPrompt(null);
        setView('hidden');
        if (choice?.outcome === 'accepted') {
            localStorage.setItem(COMPLETED_KEY, 'true');
            localStorage.removeItem(COLLAPSED_KEY);
        } else {
            localStorage.setItem(COLLAPSED_KEY, 'true');
        }
    };

    const dismiss = () => {
        localStorage.setItem(COLLAPSED_KEY, 'true');
        setView('compact');
    };

    if (view === 'compact') {
        return (
            <button type="button" className="privacy-settings-button pwa-settings-button" onClick={() => setView('full')}>
                <i className="fa-solid fa-mobile-screen-button"></i>
                <span>{buttonText}</span>
            </button>
        );
    }

    return (
        <div className="pwa-install-prompt" role="dialog" aria-label={lang === 'en' ? 'Install app' : 'تثبيت الأداة'}>
            <span className="pwa-install-icon" aria-hidden="true">
                {iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconUrl} alt="" />
                ) : (
                    <i className="fa-solid fa-mobile-screen-button"></i>
                )}
            </span>
            <span className="pwa-install-copy">
                <strong>{buttonText}</strong>
                <span>{isIosInstall
                    ? manualInstructions
                    : promptText}</span>
            </span>
            <span className="pwa-install-actions">
                <button type="button" className="pwa-install-main" onClick={installApp}>
                    <i className={isIosInstall ? 'fa-solid fa-share-from-square' : 'fa-solid fa-mobile-screen-button'}></i>
                    <span>{isIosInstall ? (lang === 'en' ? 'Got it' : 'فهمت') : buttonText}</span>
                </button>
                <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label={lang === 'en' ? 'Hide app install notice' : 'إخفاء إشعار تثبيت الأداة'}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </span>
        </div>
    );
}
