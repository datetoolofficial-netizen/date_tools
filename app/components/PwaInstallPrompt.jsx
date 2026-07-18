'use client';

import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'date_tools_pwa_install_dismissed';

function isStandaloneDisplay() {
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

export default function PwaInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
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
    }, []);

    if (!isVisible || !installPrompt) return null;

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
            <button type="button" className="pwa-install-main" onClick={installApp}>
                <i className="fa-solid fa-mobile-screen-button"></i>
                <span>ثبّت الأداة</span>
            </button>
            <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="إخفاء زر تثبيت التطبيق">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
