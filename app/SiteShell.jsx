'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import PwaUpdatePrompt from './components/PwaUpdatePrompt';
import { defaultFirebaseApi, SiteContext } from './SiteContext';
import { DEFAULT_PRIVACY_CONSENT, getPrivacyConsent, savePrivacyConsent } from './privacyConsent';
import { getLocalizedSiteConfig } from './localizedConfig';
import { i18n } from './i18n';
import { getToolSettings } from './toolSettings';
import { APP_VERSION } from './version';
import { resolvePrivacyUiState } from './privacyUiState';
import { TOOL_SECTION_ROUTE_ENTRIES } from '../toolSectionRoutes';
import { getArabicToolPath, getToolRouteLanguage, localizeToolPath } from './localizedToolRoutes';

const excludedShellPrefixes = ['/admin', '/admin_login', '/client', '/support'];
const LOCATION_SUCCESS_NOTICE_SEEN_KEY = 'date_tools_location_success_notice_seen';
const LOCATION_ERROR_NOTICE_SEEN_KEY = 'date_tools_location_error_notice_seen';
const SITE_CONFIG_CACHE_KEY = 'date_tools_site_shell_config';
const SITE_CONFIG_CACHE_TTL = 1000 * 60 * 5;
const PRIVACY_PANEL_COLLAPSED_KEY = 'date_tools_privacy_panel_collapsed';

function readCachedSiteConfig() {
    if (typeof window === 'undefined') return null;

    try {
        const raw = sessionStorage.getItem(SITE_CONFIG_CACHE_KEY);
        if (!raw) return null;

        const cached = JSON.parse(raw);
        if (!cached?.timestamp || Date.now() - cached.timestamp > SITE_CONFIG_CACHE_TTL) return null;
        return cached.data || null;
    } catch {
        return null;
    }
}

function writeCachedSiteConfig(data) {
    if (typeof window === 'undefined' || !data) return;

    try {
        sessionStorage.setItem(SITE_CONFIG_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data,
        }));
    } catch {
        // Ignore storage errors; the live fetch still keeps the UI working.
    }
}

function timezoneLabel(timezone, lang = 'ar') {
    const fallback = lang === 'en' ? 'Your current location' : 'موقعك الحالي';
    if (!timezone) return fallback;
    return timezone.split('/').pop()?.replaceAll('_', ' ') || fallback;
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
    const publicPath = getArabicToolPath(pathname) || pathname;
    return pages.includes(normalizePagePath(publicPath));
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

async function fetchPublicSiteConfig() {
    try {
        const response = await fetch('/api/site-config');
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok || !data.config) return {};

        return data.config;
    } catch {
        console.warn('Unable to load public site config.');
        return {};
    }
}

async function sendStatisticEvent(payload) {
    if (getPrivacyConsent()?.analytics !== true) return;

    try {
        await fetch('/api/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            keepalive: true,
        });
    } catch {
        // Statistics should never break the visitor experience.
    }
}

const publicRuntimeApi = {
    initAndTrackVisit: () => sendStatisticEvent({ event: 'visit' }),
    trackToolUsage: (toolName) => sendStatisticEvent({ event: 'tool', toolName }),
    trackAdClick: (adId) => sendStatisticEvent({ event: 'adClick', adId }),
    trackAdImpression: (adId) => sendStatisticEvent({ event: 'adImpression', adId }),
    getSiteConfig: fetchPublicSiteConfig,
};

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

export default function SiteShell({ children, initialConfig = null }) {
    const pathname = usePathname() || '/';
    const router = useRouter();
    const initialRouteLanguageRef = useRef(getToolRouteLanguage(pathname));
    const [lang, setLang] = useState(() => initialRouteLanguageRef.current || 'ar');
    const [themeMode, setThemeMode] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [configData, setConfigData] = useState(() => initialConfig || null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle');
    const [locationError, setLocationError] = useState('');
    const [locationNotice, setLocationNotice] = useState(null);
    const [privacyConsent, setPrivacyConsent] = useState(null);
    const [isPrivacyReady, setIsPrivacyReady] = useState(false);
    const [isPrivacyPanelCollapsed, setIsPrivacyPanelCollapsed] = useState(false);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [privacyDraft, setPrivacyDraft] = useState(DEFAULT_PRIVACY_CONSENT);
    const firebaseApiRef = useRef(defaultFirebaseApi);
    const autoLocationRequestRef = useRef(false);
    const visitTrackedRef = useRef(false);
    const loadedConfigRef = useRef(false);
    const locationRequestRef = useRef(null);

    const shouldUseShell = !excludedShellPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    const isSiteLoading = shouldUseShell && configData === null;
    const localizedConfigData = useMemo(() => getLocalizedSiteConfig(configData || {}, lang), [configData, lang]);
    const labels = i18n[lang] || i18n.ar;

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        if (!initialRouteLanguageRef.current) setLang(savedLang);
        const savedConsent = getPrivacyConsent();
        setPrivacyConsent(savedConsent);
        setIsPrivacyPanelCollapsed(
            !savedConsent && localStorage.getItem(PRIVACY_PANEL_COLLAPSED_KEY) === 'true',
        );
        setIsPrivacyReady(true);

        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
        const syncWithSystemTheme = (event) => {
            setThemeMode(event.matches ? 'dark' : 'light');
        };

        syncWithSystemTheme(systemTheme);
        if (typeof systemTheme.addEventListener === 'function') {
            systemTheme.addEventListener('change', syncWithSystemTheme);
            return () => systemTheme.removeEventListener('change', syncWithSystemTheme);
        }

        systemTheme.addListener?.(syncWithSystemTheme);
        return () => systemTheme.removeListener?.(syncWithSystemTheme);
    }, []);

    useEffect(() => {
        const routeLang = getToolRouteLanguage(pathname);
        if (routeLang) {
            setLang(routeLang);
            localStorage.setItem('site_lang', routeLang);
        }
    }, [pathname]);

    useEffect(() => {
        if (!themeMode) return;

        const dark = themeMode === 'dark';
        setIsDarkMode(dark);
        document.documentElement.dataset.siteTheme = themeMode;
        document.documentElement.style.colorScheme = themeMode;
        document.body.classList.toggle('dark-mode', dark);
        document.body.classList.toggle('light-mode', !dark);

        let themeColor = document.querySelector('meta[name="theme-color"][data-runtime-theme]');
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            themeColor.dataset.runtimeTheme = 'true';
            document.head.appendChild(themeColor);
        }
        themeColor.content = dark ? '#0f172a' : '#f8fafc';
    }, [themeMode]);

    useEffect(() => {
        if (!shouldUseShell || loadedConfigRef.current) return;

        let isMounted = true;
        loadedConfigRef.current = true;
        const cachedConfig = readCachedSiteConfig();
        if (cachedConfig) setConfigData(cachedConfig);

        async function loadSiteConfig() {
            try {
                firebaseApiRef.current = publicRuntimeApi;
                const data = await fetchPublicSiteConfig();
                const nextConfig = {
                    ...(data || {}),
                    adCampaigns: Array.isArray(data?.adCampaigns) ? data.adCampaigns : [],
                };

                if (isMounted) {
                    setConfigData(nextConfig);
                    writeCachedSiteConfig(nextConfig);
                }

                const campaigns = await fetchPublicCampaigns();

                if (isMounted) {
                    setConfigData((currentConfig) => {
                        const updatedConfig = {
                            ...(currentConfig || nextConfig),
                            adCampaigns: campaigns,
                        };

                        writeCachedSiteConfig(updatedConfig);
                        return updatedConfig;
                    });
                }
            } catch {
                console.error('Error fetching site config.');
                if (isMounted && !cachedConfig) setConfigData({ events: [] });
            }
        }

        loadSiteConfig();

        return () => {
            isMounted = false;
        };
    }, [shouldUseShell]);

    useEffect(() => {
        if (!shouldUseShell || privacyConsent?.analytics !== true || visitTrackedRef.current) return;

        visitTrackedRef.current = true;
        firebaseApiRef.current.initAndTrackVisit();
    }, [privacyConsent?.analytics, shouldUseShell]);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    useEffect(() => {
        if (!shouldUseShell || !configData) return;
        const publicPath = getArabicToolPath(pathname) || pathname;
        const standaloneRoute = TOOL_SECTION_ROUTE_ENTRIES.find((route) => route.publicPath === publicPath);
        const toolKey = standaloneRoute?.toolKey || (publicPath.startsWith('/clock') ? 'clock' : publicPath.startsWith('/weather') ? 'weather' : 'date');
        const toolSettings = getToolSettings(configData, toolKey, lang);
        const toolSeo = standaloneRoute
            ? toolSettings?.subtoolSeo?.[standaloneRoute.subtoolKey] || {}
            : toolSettings?.seo || {};
        const title = toolSeo.searchTitle || localizedConfigData.mainSEO?.title || localizedConfigData.toolDisplayName;
        const description = toolSeo.metaDescription || localizedConfigData.mainSEO?.description || localizedConfigData.toolSlogan;
        if (title) document.title = title;
        if (description) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = description;
        }
    }, [configData, lang, localizedConfigData, pathname, shouldUseShell]);

    useEffect(() => {
        const faviconUrl = configData?.faviconUrl || configData?.appIconUrl || configData?.logoUrl || '';
        const appleTouchIconUrl = configData?.appIconUrl || configData?.logoUrl || configData?.faviconUrl || '';
        if (!faviconUrl && !appleTouchIconUrl) return;

        if (faviconUrl) {
            let icon = document.querySelector("link[rel='icon']");
            if (!icon) {
                icon = document.createElement('link');
                icon.rel = 'icon';
                document.head.appendChild(icon);
            }
            icon.href = faviconUrl;
        }

        if (appleTouchIconUrl) {
            let appleIcon = document.querySelector("link[rel='apple-touch-icon']");
            if (!appleIcon) {
                appleIcon = document.createElement('link');
                appleIcon.rel = 'apple-touch-icon';
                document.head.appendChild(appleIcon);
            }
            const versionedIcon = new URL(appleTouchIconUrl, window.location.origin);
            versionedIcon.searchParams.set('v', APP_VERSION);
            appleIcon.href = versionedIcon.toString();
        }
    }, [configData?.faviconUrl, configData?.appIconUrl, configData?.logoUrl]);

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
        localStorage.setItem('site_lang', newLang);
        const targetPath = localizeToolPath(pathname, newLang);
        if (targetPath !== pathname) {
            const suffix = typeof window === 'undefined' ? '' : `${window.location.search}${window.location.hash}`;
            router.push(`${targetPath}${suffix}`);
            return;
        }
        setLang(newLang);
    };

    const toggleTheme = () => {
        const currentTheme = themeMode
            || document.documentElement.dataset.siteTheme
            || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setThemeMode(newTheme);
    };

    const updatePrivacyConsent = useCallback((nextConsent) => {
        const saved = savePrivacyConsent(nextConsent);
        setPrivacyConsent(saved);
        setPrivacyDraft(saved);
        setShowPrivacySettings(false);
        setIsPrivacyPanelCollapsed(false);
        localStorage.removeItem(PRIVACY_PANEL_COLLAPSED_KEY);
    }, []);

    const collapsePrivacyPanel = useCallback(() => {
        if (privacyConsent !== null) {
            setShowPrivacySettings(false);
            return;
        }
        localStorage.setItem(PRIVACY_PANEL_COLLAPSED_KEY, 'true');
        setIsPrivacyPanelCollapsed(true);
    }, [privacyConsent]);

    const expandPrivacyPanel = useCallback(() => {
        localStorage.removeItem(PRIVACY_PANEL_COLLAPSED_KEY);
        setIsPrivacyPanelCollapsed(false);
    }, []);

    const openPrivacySettings = useCallback(() => {
        const currentConsent = getPrivacyConsent() || DEFAULT_PRIVACY_CONSENT;
        setPrivacyDraft(currentConsent);
        setShowPrivacySettings(true);
    }, []);

    useEffect(() => {
        if (privacyConsent === null || shouldShowPrivacySettingsButton(localizedConfigData, pathname)) return;
        setShowPrivacySettings(false);
    }, [localizedConfigData, pathname, privacyConsent]);

    const requestCurrentLocation = useCallback(async (options = {}) => {
        const forceRefresh = Boolean(options.force);
        if (currentLocation && !forceRefresh) return currentLocation;
        if (locationRequestRef.current && !forceRefresh) return locationRequestRef.current;

        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setLocationStatus('error');
            setLocationError(labels.locationUnsupported);
            return null;
        }

        if (navigator.permissions?.query) {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                if (permission.state === 'denied') {
                    setLocationStatus('error');
                    setLocationError(labels.locationDenied);
                    return null;
                }
            } catch {
                // Some browsers do not expose geolocation permission state.
            }
        }

        setLocationStatus('loading');
        setLocationError('');

        const requestPromise = new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Riyadh';
                    const label = await resolveLocationLabel(
                        position.coords.latitude,
                        position.coords.longitude,
                        timezoneLabel(timezone, lang),
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
                    setLocationError(labels.locationNotAllowed);
                    resolve(null);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: forceRefresh ? 0 : 1000 * 60 * 20,
                },
            );
        }).finally(() => {
            locationRequestRef.current = null;
        });

        locationRequestRef.current = requestPromise;
        return requestPromise;
    }, [currentLocation, labels.locationDenied, labels.locationNotAllowed, labels.locationUnsupported, lang]);

    useEffect(() => {
        const publicPath = getArabicToolPath(pathname) || pathname;
        const needsAutomaticLocation = publicPath === '/clock' || publicPath === '/weather';
        if (!shouldUseShell || !needsAutomaticLocation || isSiteLoading || autoLocationRequestRef.current) return;

        autoLocationRequestRef.current = true;
        requestCurrentLocation();
    }, [isSiteLoading, pathname, requestCurrentLocation, shouldUseShell]);

    useEffect(() => {
        if (!shouldUseShell || locationStatus === 'idle' || locationStatus === 'loading') return;
        const seenSuccessNotice = localStorage.getItem(LOCATION_SUCCESS_NOTICE_SEEN_KEY) === 'true';

        if (locationStatus === 'granted') {
            if (seenSuccessNotice) {
                setLocationNotice(null);
                return undefined;
            }

            localStorage.setItem(LOCATION_SUCCESS_NOTICE_SEEN_KEY, 'true');
            setLocationNotice({
                type: 'success',
                icon: 'fa-solid fa-location-dot',
                title: labels.locationGrantedTitle,
                message: labels.locationGrantedMessage,
            });
            const timer = window.setTimeout(() => setLocationNotice(null), 4500);
            return () => window.clearTimeout(timer);
        }

        const seenErrorNotice = localStorage.getItem(LOCATION_ERROR_NOTICE_SEEN_KEY) === 'true';
        if (seenErrorNotice) {
            setLocationNotice(null);
            return undefined;
        }

        localStorage.setItem(LOCATION_ERROR_NOTICE_SEEN_KEY, 'true');

        setLocationNotice({
            type: 'error',
            icon: 'fa-solid fa-location-crosshairs',
            title: labels.locationErrorTitle,
            message: locationError || labels.locationErrorMessage,
        });

        const timer = window.setTimeout(() => setLocationNotice(null), 8000);
        return () => window.clearTimeout(timer);
    }, [labels.locationErrorMessage, labels.locationErrorTitle, labels.locationGrantedMessage, labels.locationGrantedTitle, locationError, locationStatus, shouldUseShell]);

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
        themeMode,
        isDarkMode,
        configData: localizedConfigData,
        isSiteLoading,
        firebaseApiRef,
        currentLocation,
        locationStatus,
        locationError,
        requestCurrentLocation,
        privacyConsent,
        updatePrivacyConsent,
    };
    const privacyUiState = resolvePrivacyUiState({
        isReady: isPrivacyReady,
        consent: privacyConsent,
        isCollapsed: isPrivacyPanelCollapsed,
        isSettingsOpen: showPrivacySettings,
        isConfiguredPage: shouldShowPrivacySettingsButton(localizedConfigData, pathname),
        isLoading: isSiteLoading,
    });
    const showPendingPrivacyButton = privacyUiState.showPendingButton;
    const showPrivacySettingsButton = privacyUiState.showSettingsButton;
    const isPrivacyPanelOpen = privacyUiState.isPanelOpen;

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
                        config={localizedConfigData}
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

            {!isSiteLoading && <Footer lang={lang} config={localizedConfigData} />}
            {!isSiteLoading && (
                <div className="site-action-stack">
                    <PwaUpdatePrompt
                        settings={localizedConfigData?.pwaUpdatePrompt}
                        blocked={isPrivacyPanelOpen}
                        lang={lang}
                    />
                    <PwaInstallPrompt
                        settings={localizedConfigData?.pwaInstallPrompt}
                        iconUrl={localizedConfigData?.appIconUrl || localizedConfigData?.logoUrl || localizedConfigData?.faviconUrl || ''}
                        blocked={isPrivacyPanelOpen}
                        lang={lang}
                    />
                    {isPrivacyPanelOpen && (
                        <div className="privacy-consent-panel" role="dialog" aria-live="polite" aria-label={labels.privacySettingsTitle}>
                            <button type="button" className="privacy-consent-collapse" onClick={collapsePrivacyPanel} aria-label={labels.privacyCollapse}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="privacy-consent-icon">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <div className="privacy-consent-copy">
                                <strong>{labels.privacySettingsTitle}</strong>
                                <p>{labels.privacyDescription}</p>
                                {showPrivacySettings && (
                                    <div className="privacy-consent-options">
                                        <label>
                                            <input type="checkbox" checked disabled />
                                            <span>{labels.privacyEssential}</span>
                                        </label>
                                        <label>
                                            <input
                                                id="privacy-analytics-option"
                                                type="checkbox"
                                                checked={privacyDraft.analytics}
                                                onChange={(event) => setPrivacyDraft((current) => ({ ...current, analytics: event.target.checked }))}
                                            />
                                            <span>{labels.privacyAnalytics}</span>
                                        </label>
                                        <label>
                                            <input
                                                id="privacy-marketing-option"
                                                type="checkbox"
                                                checked={privacyDraft.marketing}
                                                onChange={(event) => setPrivacyDraft((current) => ({ ...current, marketing: event.target.checked }))}
                                            />
                                            <span>{labels.privacyMarketing}</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div className="privacy-consent-actions">
                                <button type="button" className="privacy-accept" onClick={() => updatePrivacyConsent({ analytics: true, marketing: true })}>
                                    {labels.privacyAcceptAll}
                                </button>
                                <button type="button" className="privacy-secondary" onClick={() => {
                                    if (!showPrivacySettings) {
                                        setShowPrivacySettings(true);
                                        return;
                                    }
                                    updatePrivacyConsent(privacyDraft);
                                }}>
                                    {showPrivacySettings ? labels.privacySave : labels.privacyCustomize}
                                </button>
                                <button type="button" className="privacy-secondary" onClick={() => updatePrivacyConsent(DEFAULT_PRIVACY_CONSENT)}>
                                    {labels.privacyEssentialOnly}
                                </button>
                            </div>
                        </div>
                    )}
                    {showPrivacySettingsButton && (
                        <button
                            type="button"
                            className="privacy-settings-button"
                            onClick={showPendingPrivacyButton ? expandPrivacyPanel : openPrivacySettings}
                        >
                            <i className="fa-solid fa-shield-halved"></i>
                            {labels.privacySettingsButton}
                        </button>
                    )}
                </div>
            )}
        </SiteContext.Provider>
    );
}
