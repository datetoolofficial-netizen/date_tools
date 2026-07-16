'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { defaultFirebaseApi, SiteContext } from './SiteContext';
import { DEFAULT_PRIVACY_CONSENT, getPrivacyConsent, savePrivacyConsent } from './privacyConsent';

const excludedShellPrefixes = ['/admin', '/admin_login', '/client', '/support'];

function timezoneLabel(timezone) {
    if (!timezone) return 'موقعك الحالي';
    return timezone.split('/').pop()?.replaceAll('_', ' ') || 'موقعك الحالي';
}

function normalizePagePath(value) {
    const cleanValue = String(value || '/').trim();
    if (!cleanValue || cleanValue === '/') return '/';
    const withoutQuery = cleanValue.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

function shouldShowPrivacySettingsButton(configData, pathname) {
    const settings = configData?.privacySettingsButton;
    if (settings?.enabled !== true) return false;

    const pages = Array.isArray(settings.pages)
        ? settings.pages.map(normalizePagePath).filter(Boolean)
        : [];

    if (pages.length === 0) return false;
    return pages.includes(normalizePagePath(pathname));
}

async function resolveLocationLabel(latitude, longitude, fallbackLabel) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);

    try {
        const params = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            localityLanguage: 'ar',
        });
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`, {
            signal: controller.signal,
        });

        if (!response.ok) return fallbackLabel;

        const data = await response.json();
        return data.city || data.locality || data.principalSubdivision || data.countryName || fallbackLabel;
    } catch {
        return fallbackLabel;
    } finally {
        window.clearTimeout(timer);
    }
}

async function fetchPublicCampaigns() {
    try {
        const response = await fetch('/api/public-campaigns', { cache: 'no-store' });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok || !Array.isArray(data.campaigns)) return [];

        return data.campaigns;
    } catch {
        console.warn('Unable to load public campaigns.');
        return [];
    }
}

function PublicShellSkeleton() {
    return (
        <div className="home-skeleton shell-skeleton" aria-label="جاري تحميل الموقع">
            <div className="skeleton-header-panel">
                <div className="skeleton-controls">
                    <span className="skeleton-block skeleton-control"></span>
                    <span className="skeleton-block skeleton-control"></span>
                </div>
                <div className="skeleton-brand-row">
                    <div className="skeleton-title-stack">
                        <span className="skeleton-block skeleton-title"></span>
                        <span className="skeleton-block skeleton-subtitle"></span>
                    </div>
                    <span className="skeleton-block skeleton-logo"></span>
                </div>
            </div>

            <div className="skeleton-nav-row">
                <span className="skeleton-block skeleton-nav-pill"></span>
                <span className="skeleton-block skeleton-nav-pill"></span>
                <span className="skeleton-block skeleton-nav-pill"></span>
            </div>

            <span className="skeleton-block skeleton-hero"></span>
            <span className="skeleton-block skeleton-banner"></span>
            <span className="skeleton-block skeleton-ad"></span>

            <div className="skeleton-events-grid">
                <span className="skeleton-block skeleton-event-card"></span>
                <span className="skeleton-block skeleton-event-card"></span>
            </div>

            <span className="skeleton-block skeleton-card-large"></span>
        </div>
    );
}

export default function SiteShell({ children }) {
    const pathname = usePathname() || '/';
    const [lang, setLang] = useState('ar');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [configData, setConfigData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle');
    const [locationError, setLocationError] = useState('');
    const [locationNotice, setLocationNotice] = useState(null);
    const [privacyConsent, setPrivacyConsent] = useState(null);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [privacyDraft, setPrivacyDraft] = useState(DEFAULT_PRIVACY_CONSENT);
    const firebaseApiRef = useRef(defaultFirebaseApi);
    const autoLocationRequestRef = useRef(false);

    const shouldUseShell = !excludedShellPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    const isSiteLoading = shouldUseShell && configData === null;

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        setLang(savedLang);
        setPrivacyConsent(getPrivacyConsent());

        const osThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('site_theme');
        setIsDarkMode(savedTheme ? savedTheme === 'dark' : osThemeQuery.matches);
    }, []);

    useEffect(() => {
        if (!shouldUseShell || configData !== null) return;

        let isMounted = true;

        async function loadSiteConfig() {
            try {
                const firebaseApi = await import('./firebase');

                firebaseApiRef.current = {
                    initAndTrackVisit: firebaseApi.initAndTrackVisit || defaultFirebaseApi.initAndTrackVisit,
                    trackToolUsage: firebaseApi.trackToolUsage || defaultFirebaseApi.trackToolUsage,
                    trackAdClick: firebaseApi.trackAdClick || defaultFirebaseApi.trackAdClick,
                    trackAdImpression: firebaseApi.trackAdImpression || defaultFirebaseApi.trackAdImpression,
                    getSiteConfig: firebaseApi.getSiteConfig || defaultFirebaseApi.getSiteConfig,
                };

                await firebaseApiRef.current.initAndTrackVisit();
                const [data, campaigns] = await Promise.all([
                    firebaseApiRef.current.getSiteConfig(),
                    fetchPublicCampaigns(),
                ]);

                if (isMounted) {
                    setConfigData({
                        ...(data || {}),
                        adCampaigns: campaigns,
                    });
                }
            } catch {
                console.error('Error fetching site config.');
                if (isMounted) setConfigData({ events: [] });
            }
        }

        loadSiteConfig();

        return () => {
            isMounted = false;
        };
    }, [configData, shouldUseShell]);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [lang, isDarkMode]);

    useEffect(() => {
        if (!configData?.faviconUrl) return;

        let icon = document.querySelector("link[rel='icon']");
        if (!icon) {
            icon = document.createElement('link');
            icon.rel = 'icon';
            document.head.appendChild(icon);
        }

        icon.href = configData.faviconUrl;
    }, [configData?.faviconUrl]);

    useEffect(() => {
        const handleBlur = () => {
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                if (window.hoveredAdId) firebaseApiRef.current.trackAdClick(window.hoveredAdId);
            }
        };

        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, []);

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('site_lang', newLang);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('site_theme', newTheme ? 'dark' : 'light');
    };

    const updatePrivacyConsent = useCallback((nextConsent) => {
        const saved = savePrivacyConsent(nextConsent);
        setPrivacyConsent(saved);
        setPrivacyDraft(saved);
        setShowPrivacySettings(false);
    }, []);

    const openPrivacySettings = useCallback(() => {
        const currentConsent = getPrivacyConsent() || DEFAULT_PRIVACY_CONSENT;
        setPrivacyDraft(currentConsent);
        setPrivacyConsent(null);
        setShowPrivacySettings(true);
    }, []);

    const requestCurrentLocation = useCallback(async () => {
        if (currentLocation) return currentLocation;

        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('متصفحك لا يدعم تحديد الموقع.');
            return null;
        }

        if (navigator.permissions?.query) {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                if (permission.state === 'denied') {
                    setLocationStatus('error');
                    setLocationError('إذن الموقع ممنوع في المتصفح. افتح أيقونة القفل بجانب الرابط، غيّر إذن الموقع إلى سماح، ثم أعد تحميل الصفحة.');
                    return null;
                }
            } catch {
                // Some browsers do not expose geolocation permission state.
            }
        }

        setLocationStatus('loading');
        setLocationError('');

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Riyadh';
                    const label = await resolveLocationLabel(
                        position.coords.latitude,
                        position.coords.longitude,
                        timezoneLabel(timezone),
                    );
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timezone,
                        label,
                    };

                    setCurrentLocation(location);
                    setLocationStatus('granted');
                    resolve(location);
                },
                () => {
                    setLocationStatus('error');
                    setLocationError('لم يتم السماح باستخدام الموقع الحالي.');
                    resolve(null);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 1000 * 60 * 20,
                },
            );
        });
    }, [currentLocation]);

    useEffect(() => {
        if (!shouldUseShell || isSiteLoading || autoLocationRequestRef.current) return;

        autoLocationRequestRef.current = true;
        requestCurrentLocation();
    }, [isSiteLoading, requestCurrentLocation, shouldUseShell]);

    useEffect(() => {
        if (!shouldUseShell || locationStatus === 'idle' || locationStatus === 'loading') return;

        if (locationStatus === 'granted') {
            setLocationNotice({
                type: 'success',
                icon: 'fa-solid fa-location-dot',
                title: 'تم السماح بالموقع',
                message: 'تم تحديث أدوات الساعة والطقس حسب موقعك الحالي بدون حفظ إحداثياتك.',
            });

            const timer = window.setTimeout(() => setLocationNotice(null), 4500);
            return () => window.clearTimeout(timer);
        }

        setLocationNotice({
            type: 'error',
            icon: 'fa-solid fa-location-crosshairs',
            title: 'تعذر استخدام موقعك الحالي',
            message: locationError || 'يمكنك السماح بالموقع من إعدادات المتصفح عند الحاجة.',
        });

        const timer = window.setTimeout(() => setLocationNotice(null), 8000);
        return () => window.clearTimeout(timer);
    }, [locationError, locationStatus, shouldUseShell]);

    useEffect(() => {
        if (!locationNotice) return;

        const hideLocationNotice = () => setLocationNotice(null);
        window.addEventListener('scroll', hideLocationNotice, { passive: true, once: true });
        window.addEventListener('touchmove', hideLocationNotice, { passive: true, once: true });

        return () => {
            window.removeEventListener('scroll', hideLocationNotice);
            window.removeEventListener('touchmove', hideLocationNotice);
        };
    }, [locationNotice]);

    const contextValue = {
        lang,
        isDarkMode,
        configData,
        isSiteLoading,
        firebaseApiRef,
        currentLocation,
        locationStatus,
        locationError,
        requestCurrentLocation,
        privacyConsent,
        updatePrivacyConsent,
    };
    const showPrivacySettingsButton = !isSiteLoading
        && privacyConsent !== null
        && shouldShowPrivacySettingsButton(configData, pathname);

    if (!shouldUseShell) {
        return (
            <SiteContext.Provider value={contextValue}>
                {children}
            </SiteContext.Provider>
        );
    }

    return (
        <SiteContext.Provider value={contextValue}>
            <div className="container site-shell-container">
                {isSiteLoading ? (
                    <PublicShellSkeleton />
                ) : (
                    <Header
                        lang={lang}
                        isDarkMode={isDarkMode}
                        toggleLang={toggleLang}
                        toggleTheme={toggleTheme}
                        config={configData}
                    />
                )}

                {!isSiteLoading && (
                    <main className="site-page-content">
                        {locationNotice && (
                            <div className={`location-permission-toast ${locationNotice.type}`} role="status">
                                <i className={locationNotice.icon}></i>
                                <div>
                                    <strong>{locationNotice.title}</strong>
                                    <p>{locationNotice.message}</p>
                                </div>
                            </div>
                        )}
                        {children}
                    </main>
                )}
            </div>

            {!isSiteLoading && <Footer lang={lang} config={configData} />}
            {!isSiteLoading && privacyConsent === null && (
                <div className="privacy-consent-panel" role="dialog" aria-live="polite" aria-label="إعدادات الخصوصية والكوكيز">
                    <div className="privacy-consent-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div className="privacy-consent-copy">
                        <strong>إعدادات الخصوصية والكوكيز</strong>
                        <p>
                            نستخدم ملفات ضرورية لتشغيل الموقع، ونطلب موافقتك قبل تشغيل التحليلات أو أدوات التسويق. يمكنك التحكم لاحقًا من إعدادات المتصفح أو من هذا الإشعار عند ظهوره.
                        </p>
                        {showPrivacySettings && (
                            <div className="privacy-consent-options">
                                <label>
                                    <input type="checkbox" checked disabled />
                                    <span>ملفات ضرورية لتشغيل الموقع</span>
                                </label>
                                <label>
                                    <input
                                        id="privacy-analytics-option"
                                        type="checkbox"
                                        checked={privacyDraft.analytics}
                                        onChange={(event) => setPrivacyDraft((current) => ({ ...current, analytics: event.target.checked }))}
                                    />
                                    <span>تحليلات لتحسين تجربة الاستخدام</span>
                                </label>
                                <label>
                                    <input
                                        id="privacy-marketing-option"
                                        type="checkbox"
                                        checked={privacyDraft.marketing}
                                        onChange={(event) => setPrivacyDraft((current) => ({ ...current, marketing: event.target.checked }))}
                                    />
                                    <span>إعلانات وقياس تسويقي</span>
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="privacy-consent-actions">
                        <button type="button" className="privacy-accept" onClick={() => updatePrivacyConsent({ analytics: true, marketing: true })}>
                            قبول الكل
                        </button>
                        <button type="button" className="privacy-secondary" onClick={() => {
                            if (!showPrivacySettings) {
                                setShowPrivacySettings(true);
                                return;
                            }
                            updatePrivacyConsent(privacyDraft);
                        }}>
                            {showPrivacySettings ? 'حفظ الاختيارات' : 'تخصيص'}
                        </button>
                        <button type="button" className="privacy-secondary" onClick={() => updatePrivacyConsent(DEFAULT_PRIVACY_CONSENT)}>
                            الضروري فقط
                        </button>
                    </div>
                </div>
            )}
            {showPrivacySettingsButton && (
                <button type="button" className="privacy-settings-button" onClick={openPrivacySettings}>
                    <i className="fa-solid fa-shield-halved"></i>
                    إعدادات الخصوصية
                </button>
            )}
        </SiteContext.Provider>
    );
}
