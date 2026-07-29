'use client';

import { useEffect, useState } from 'react';
import { APP_VERSION } from '../version';

const DISMISSED_KEY = 'date_tools_pwa_install_dismissed';
const LAST_SEEN_KEY = 'date_tools_pwa_install_last_seen_key';
const INSTALLED_VERSION_KEY = 'date_tools_pwa_installed_version';
const UPDATE_DISMISSED_VERSION_KEY = 'date_tools_pwa_update_dismissed_version';
const DEFAULT_PROMPT_TEXT = 'ثبّت الأداة على جهازك لاستخدام أسرع';
const DEFAULT_BUTTON_TEXT = 'ثبّت الأداة';
const UPDATE_TITLE = 'تحديث جديد متاح';
const UPDATE_TEXT = 'صدرت نسخة جديدة من الأداة المثبتة. حدّثها الآن حتى تصل لك آخر التحسينات.';
const MANUAL_UPDATE_TEXT = 'تم تحديث الأداة. أغلق التطبيق وافتحه من جديد حتى تظهر النسخة الأحدث.';

function isStandaloneDisplay() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true
        || document.referrer.startsWith('android-app://');
}

export default function PwaInstallPrompt({ settings, iconUrl }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdateNotice, setIsUpdateNotice] = useState(false);
    const [isVersionUpdate, setIsVersionUpdate] = useState(false);
    const isEnabled = settings?.enabled !== false;
    const promptText = settings?.text?.trim() || DEFAULT_PROMPT_TEXT;
    const buttonText = settings?.buttonText?.trim() || DEFAULT_BUTTON_TEXT;
    const showAgainKey = String(settings?.showAgainKey || 'default');

    useEffect(() => {
        const hasFreshShowAgain = showAgainKey !== 'default' && localStorage.getItem(LAST_SEEN_KEY) !== showAgainKey;
        const isInstalledApp = isStandaloneDisplay();
        const installedVersion = localStorage.getItem(INSTALLED_VERSION_KEY);
        const dismissedUpdateVersion = localStorage.getItem(UPDATE_DISMISSED_VERSION_KEY);
        const hasAppVersionUpdate = isInstalledApp
            && installedVersion !== APP_VERSION
            && dismissedUpdateVersion !== APP_VERSION;

        if (isInstalledApp) {
            if (hasAppVersionUpdate) {
                setInstallPrompt(null);
                setIsUpdateNotice(true);
                setIsVersionUpdate(true);
                setIsVisible(true);
            } else if (hasFreshShowAgain && isEnabled) {
                setInstallPrompt(null);
                setIsUpdateNotice(true);
                setIsVersionUpdate(false);
                setIsVisible(true);
            } else if (installedVersion !== APP_VERSION) {
                localStorage.setItem(INSTALLED_VERSION_KEY, APP_VERSION);
            }
            return undefined;
        }

        if (!isEnabled) return undefined;

        const wasDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
        if (wasDismissed && !hasFreshShowAgain) return undefined;

        let receivedInstallPrompt = false;

        const handleBeforeInstallPrompt = (event) => {
            receivedInstallPrompt = true;
            event.preventDefault();
            setInstallPrompt(event);
            setIsUpdateNotice(false);
            setIsVersionUpdate(false);
            setIsVisible(true);
        };

        const handleInstalled = () => {
            setInstallPrompt(null);
            setIsUpdateNotice(false);
            setIsVersionUpdate(false);
            setIsVisible(false);
            localStorage.setItem(DISMISSED_KEY, 'true');
            localStorage.setItem(INSTALLED_VERSION_KEY, APP_VERSION);
            localStorage.setItem(UPDATE_DISMISSED_VERSION_KEY, APP_VERSION);
            if (showAgainKey !== 'default') localStorage.setItem(LAST_SEEN_KEY, showAgainKey);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);

        const fallbackTimer = window.setTimeout(() => {
            if (hasFreshShowAgain && !receivedInstallPrompt && !isStandaloneDisplay()) {
                setInstallPrompt(null);
                setIsUpdateNotice(true);
                setIsVersionUpdate(false);
                setIsVisible(true);
            }
        }, 1200);

        return () => {
            window.clearTimeout(fallbackTimer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, [isEnabled, showAgainKey]);

    if ((!isEnabled && !isUpdateNotice) || !isVisible || (!installPrompt && !isUpdateNotice)) return null;

    const markSeen = () => {
        if (showAgainKey !== 'default') localStorage.setItem(LAST_SEEN_KEY, showAgainKey);
    };

    const rememberCurrentVersion = () => {
        localStorage.setItem(INSTALLED_VERSION_KEY, APP_VERSION);
        localStorage.setItem(UPDATE_DISMISSED_VERSION_KEY, APP_VERSION);
    };

    const installApp = async () => {
        if (!installPrompt) {
            markSeen();
            rememberCurrentVersion();
            setIsUpdateNotice(false);
            setIsVersionUpdate(false);
            setIsVisible(false);
            if (isVersionUpdate) {
                window.setTimeout(() => window.location.reload(), 120);
            }
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
        if (isUpdateNotice) rememberCurrentVersion();
        setIsVisible(false);
    };

    const isUpdateMode = isUpdateNotice && !installPrompt;
    const title = installPrompt ? buttonText : UPDATE_TITLE;
    const description = isVersionUpdate ? UPDATE_TEXT : MANUAL_UPDATE_TEXT;
    const actionLabel = installPrompt ? buttonText : (isVersionUpdate ? 'تحديث الآن' : 'تم');

    return (
        <div className={`pwa-install-prompt ${isUpdateNotice ? 'is-update-notice' : ''}`} role="status">
            <span className="pwa-install-icon" aria-hidden="true">
                {iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconUrl} alt="" />
                ) : (
                    <i className="fa-solid fa-mobile-screen-button"></i>
                )}
            </span>
            <span className="pwa-install-copy">
                <strong>{title}</strong>
                <span>{isUpdateMode ? description : promptText}</span>
                {isVersionUpdate ? (
                    <span className="pwa-update-steps">
                        <span>1. اضغط تحديث الآن.</span>
                        <span>2. إذا بقيت النسخة القديمة، أغلق التطبيق وافتحه من جديد.</span>
                    </span>
                ) : null}
            </span>
            <span className="pwa-install-actions">
                <button type="button" className="pwa-install-main" onClick={installApp}>
                    <i className={`fa-solid ${installPrompt ? 'fa-mobile-screen-button' : (isVersionUpdate ? 'fa-rotate' : 'fa-circle-check')}`}></i>
                    <span>{actionLabel}</span>
                </button>
                <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="إخفاء إشعار تثبيت أو تحديث الأداة">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </span>
        </div>
    );
}
