'use client';

import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'date_tools_pwa_install_dismissed';
const LAST_SEEN_KEY = 'date_tools_pwa_install_last_seen_key';
const DEFAULT_PROMPT_TEXT = 'ثبّت الأداة على جهازك لاستخدام أسرع';
const DEFAULT_BUTTON_TEXT = 'ثبّت الأداة';

function isStandaloneDisplay() {
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

export default function PwaInstallPrompt({ settings }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdateNotice, setIsUpdateNotice] = useState(false);
    const isEnabled = settings?.enabled !== false;
    const promptText = settings?.text?.trim() || DEFAULT_PROMPT_TEXT;
    const buttonText = settings?.buttonText?.trim() || DEFAULT_BUTTON_TEXT;
    const showAgainKey = String(settings?.showAgainKey || 'default');

    useEffect(() => {
        if (!isEnabled) return undefined;
        const hasFreshShowAgain = showAgainKey !== 'default' && localStorage.getItem(LAST_SEEN_KEY) !== showAgainKey;
        const wasDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';

        if (isStandaloneDisplay()) {
            if (hasFreshShowAgain) {
                setInstallPrompt(null);
                setIsUpdateNotice(true);
                setIsVisible(true);
            }
            return undefined;
        }

        if (wasDismissed && !hasFreshShowAgain) return undefined;

        let receivedInstallPrompt = false;

        const handleBeforeInstallPrompt = (event) => {
            receivedInstallPrompt = true;
            event.preventDefault();
            setInstallPrompt(event);
            setIsUpdateNotice(false);
            setIsVisible(true);
        };

        const handleInstalled = () => {
            setInstallPrompt(null);
            setIsUpdateNotice(false);
            setIsVisible(false);
            localStorage.setItem(DISMISSED_KEY, 'true');
            if (showAgainKey !== 'default') localStorage.setItem(LAST_SEEN_KEY, showAgainKey);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);

        const fallbackTimer = window.setTimeout(() => {
            if (hasFreshShowAgain && !receivedInstallPrompt && !isStandaloneDisplay()) {
                setInstallPrompt(null);
                setIsUpdateNotice(true);
                setIsVisible(true);
            }
        }, 1200);

        return () => {
            window.clearTimeout(fallbackTimer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, [isEnabled, showAgainKey]);

    if (!isEnabled || !isVisible || (!installPrompt && !isUpdateNotice)) return null;

    const markSeen = () => {
        if (showAgainKey !== 'default') localStorage.setItem(LAST_SEEN_KEY, showAgainKey);
    };

    const installApp = async () => {
        if (!installPrompt) {
            markSeen();
            setIsUpdateNotice(false);
            setIsVisible(false);
            return;
        }

        installPrompt.prompt();
        await installPrompt.userChoice.catch(() => null);
        markSeen();
        setInstallPrompt(null);
        setIsVisible(false);
    };

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, 'true');
        markSeen();
        setIsVisible(false);
    };

    return (
        <div className={`pwa-install-prompt ${isUpdateNotice ? 'is-update-notice' : ''}`} role="status">
            <span className="pwa-install-copy">{promptText}</span>
            <button type="button" className="pwa-install-main" onClick={installApp}>
                <i className={`fa-solid ${installPrompt ? 'fa-mobile-screen-button' : 'fa-circle-check'}`}></i>
                <span>{installPrompt ? buttonText : 'تم'}</span>
            </button>
            <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="إخفاء زر تثبيت التطبيق">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
