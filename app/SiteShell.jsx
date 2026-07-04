'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { defaultFirebaseApi, SiteContext } from './SiteContext';

const excludedShellPrefixes = ['/admin', '/admin_login', '/client', '/support'];

export default function SiteShell({ children }) {
    const pathname = usePathname() || '/';
    const [lang, setLang] = useState('ar');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [configData, setConfigData] = useState(null);
    const firebaseApiRef = useRef(defaultFirebaseApi);

    const shouldUseShell = !excludedShellPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    const isSiteLoading = shouldUseShell && configData === null;

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        setLang(savedLang);

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
                const data = await firebaseApiRef.current.getSiteConfig();
                if (isMounted) setConfigData(data || {});
            } catch (error) {
                console.error('Error fetching site config:', error);
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

    const contextValue = {
        lang,
        isDarkMode,
        configData,
        isSiteLoading,
        firebaseApiRef,
    };

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
                {!isSiteLoading && (
                    <Header
                        lang={lang}
                        isDarkMode={isDarkMode}
                        toggleLang={toggleLang}
                        toggleTheme={toggleTheme}
                        config={configData}
                    />
                )}

                <main className="site-page-content">
                    {children}
                </main>
            </div>

            {!isSiteLoading && <Footer lang={lang} config={configData} />}
        </SiteContext.Provider>
    );
}
