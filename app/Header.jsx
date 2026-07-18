'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { i18n } from './i18n';

export default function Header({ lang, isDarkMode, toggleLang, toggleTheme, config }) {
    const navRef = useRef(null);
    const pathname = usePathname() || '/';
    const [hasNavOverflow, setHasNavOverflow] = useState(false);
    const navLinks = [];

    if (config) {
        if (Array.isArray(config.internalPages)) {
            config.internalPages.forEach((page) => {
                if (page.location === 'header' || page.location === 'both') {
                    navLinks.push({
                        title: page.title,
                        url: `/${page.slug}`,
                        isExternal: false
                    });
                }
            });
        }

        if (Array.isArray(config.externalLinks)) {
            config.externalLinks.forEach((link) => {
                if (link.location === 'header' || link.location === 'both') {
                    navLinks.push({
                        title: link.title,
                        url: link.url,
                        isExternal: true
                    });
                }
            });
        }
    }

    const labels = i18n[lang] || i18n.ar;
    const toolName = config?.toolDisplayName || labels.toolNameFallback;
    const toolSlogan = config?.toolSlogan || '';
    const primaryToolLinks = [
        { href: '/', label: labels.navHome, icon: 'fa-solid fa-calendar-days' },
        { href: '/clock', label: labels.navClock, icon: 'fa-solid fa-clock' },
        { href: '/weather', label: labels.navWeather, icon: 'fa-solid fa-cloud-sun' },
    ];

    const scrollNav = (direction) => {
        if (!navRef.current) return;
        const dirMultiplier = typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? -1 : 1;
        navRef.current.scrollBy({
            left: direction * dirMultiplier * 220,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const updateNavOverflow = () => {
            const nav = navRef.current;
            if (!nav) return;
            setHasNavOverflow(nav.scrollWidth > nav.clientWidth + 4);
        };

        updateNavOverflow();
        const timer = window.setTimeout(updateNavOverflow, 80);
        window.addEventListener('resize', updateNavOverflow);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('resize', updateNavOverflow);
        };
    }, [lang, navLinks.length]);

    return (
        <header className="header site-header">
            <div className="site-header-panel">
                <div className="site-brand">
                    {config?.hasLogo && config?.logoUrl && (
                        <Link href="/" className="site-logo-link" aria-label={toolName}>
                            <Image
                                src={config.logoUrl}
                                alt={toolName}
                                width={96}
                                height={96}
                                unoptimized
                                className="site-logo-img"
                            />
                        </Link>
                    )}

                    <Link href="/" className="site-brand-text">
                        <h1 className="tool-title">{toolName}</h1>
                        {toolSlogan && <p className="tool-slogan">{toolSlogan}</p>}
                    </Link>
                </div>

                <div className="top-controls">
                    <button
                        onClick={toggleLang}
                        className="control-btn lang-btn"
                        title={lang === 'ar' ? labels.switchToEnglish : labels.switchToArabic}
                        aria-label={lang === 'ar' ? labels.switchToEnglish : labels.switchToArabic}
                    >
                        <i className="fa-solid fa-language"></i>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="control-btn"
                        title={isDarkMode ? labels.lightMode : labels.darkMode}
                        aria-label={isDarkMode ? labels.lightMode : labels.darkMode}
                    >
                        <i className={isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
                    </button>
                </div>
            </div>

            <div className={`site-nav-shell${hasNavOverflow ? ' has-overflow' : ''}`}>
                {hasNavOverflow && (
                    <button
                        type="button"
                        className="nav-scroll-btn"
                        onClick={() => scrollNav(-1)}
                        aria-label={lang === 'ar' ? labels.scrollRight : labels.scrollLeft}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                )}

                <nav className="nav-links" ref={navRef} aria-label={labels.siteLinks}>
                    {primaryToolLinks.map((link) => {
                        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                        return (
                            <Link key={link.href} href={link.href} prefetch className={`nav-link${isActive ? ' active' : ''}`}>
                                <i className={link.icon}></i>
                                {link.label}
                            </Link>
                        );
                    })}

                    {navLinks.map((link, idx) => (
                        link.isExternal ? (
                            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="nav-link">
                                {link.title}
                                <i className="fa-solid fa-arrow-up-right-from-square external-icon"></i>
                            </a>
                        ) : (
                            <Link key={idx} href={link.url} prefetch className="nav-link">
                                {link.title}
                            </Link>
                        )
                    ))}
                </nav>

                {hasNavOverflow && (
                    <button
                        type="button"
                        className="nav-scroll-btn"
                        onClick={() => scrollNav(1)}
                        aria-label={lang === 'ar' ? labels.scrollLeft : labels.scrollRight}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                )}
            </div>
        </header>
    );
}
