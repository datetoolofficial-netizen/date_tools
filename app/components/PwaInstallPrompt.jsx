'use client';

import { useEffect, useState } from 'react';

const LEGACY_DISMISSED_KEY = 'date_tools_pwa_install_dismissed';
const COLLAPSED_KEY = 'date_tools_pwa_install_collapsed';
const COMPLETED_KEY = 'date_tools_pwa_install_decided';
const INSTALL_PROMPT_DELAY_MS = 12_000;
const DEFAULT_PROMPT_TEXT = 'ثبّت الأداة على جهازك لاستخدام أسرع';
const DEFAULT_BUTTON_TEXT = 'ثبّت الأداة';

function isStandaloneDisplay() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true
        || document.referrer.startsWith('android-app://');
}

export default function PwaInstallPrompt({ settings, iconUrl }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [view, setView] = useState('hidden');
    const isEnabled = settings?.enabled !== false;
    const promptText = settings?.text?.trim() || DEFAULT_PROMPT_TEXT;
    const buttonText = settings?.buttonText?.trim() || DEFAULT_BUTTON_TEXT;

    useEffect(() => {
        if (!isEnabled || isStandaloneDisplay()) return undefined;

        const hasDecided = localStorage.getItem(COMPLETED_KEY) === 'true';
        if (hasDecided) return undefined;

        const wasCollapsed = localStorage.getItem(COLLAPSED_KEY) === 'true'
            || localStorage.getItem(LEGACY_DISMISSED_KEY) === 'true';
        if (localStorage.getItem(LEGACY_DISMISSED_KEY) === 'true') {
            localStorage.setItem(COLLAPSED_KEY, 'true');
            localStorage.removeItem(LEGACY_DISMISSED_KEY);
        }

        let showTimerId;

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

    if (!isEnabled || view === 'hidden' || !installPrompt) return null;

    const installApp = async () => {
        installPrompt.prompt();
        await installPrompt.userChoice.catch(() => null);
        setInstallPrompt(null);
        setView('hidden');
        localStorage.setItem(COMPLETED_KEY, 'true');
        localStorage.removeItem(COLLAPSED_KEY);
    };

    const dismiss = () => {
        localStorage.setItem(COLLAPSED_KEY, 'true');
        setView('compact');
    };

    if (view === 'compact') {
        return (
            <button type="button" className="site-compact-action pwa-compact-action" onClick={() => setView('full')}>
                <i className="fa-solid fa-mobile-screen-button"></i>
                <span>{buttonText}</span>
            </button>
        );
    }

    return (
        <div className="pwa-install-prompt" role="status">
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
                <span>{promptText}</span>
            </span>
            <span className="pwa-install-actions">
                <button type="button" className="pwa-install-main" onClick={installApp}>
                    <i className="fa-solid fa-mobile-screen-button"></i>
                    <span>{buttonText}</span>
                </button>
                <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="إخفاء إشعار تثبيت الأداة">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </span>
        </div>
    );
}
