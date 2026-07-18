'use client';

import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'date_tools_pwa_install_dismissed';
const DEFAULT_PROMPT_TEXT = 'ثبّت الأداة على جهازك لاستخدام أسرع';
const DEFAULT_BUTTON_TEXT = 'ثبّت الأداة';

function isStandaloneDisplay() {
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

export default function PwaInstallPrompt({ settings }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const isEnabled = settings?.enabled !== false;
    const promptText = settings?.text?.trim() || DEFAULT_PROMPT_TEXT;
    const buttonText = settings?.buttonText?.trim() || DEFAULT_BUTTON_TEXT;

    useEffect(() => {
        if (!isEnabled) return undefined;
        if (isStandaloneDisplay()) return undefined;
        if (localStorage.getItem(DISMISSED_KEY) === 'true') return undefined;

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
            setIsVisible(true);
        };

        const handleInstalled = () => {
            setInstallPrompt(null);
            setIsVisible(false);
            localStorage.setItem(DISMISSED_KEY, 'true');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, [isEnabled]);

    if (!isEnabled || !isVisible || !installPrompt) return null;

    const installApp = async () => {
        installPrompt.prompt();
        await installPrompt.userChoice.catch(() => null);
        setInstallPrompt(null);
        setIsVisible(false);
    };

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, 'true');
        setIsVisible(false);
    };

    return (
        <div className="pwa-install-prompt" role="status">
            <span className="pwa-install-copy">{promptText}</span>
            <button type="button" className="pwa-install-main" onClick={installApp}>
                <i className="fa-solid fa-mobile-screen-button"></i>
                <span>{buttonText}</span>
            </button>
            <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="إخفاء زر تثبيت التطبيق">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
