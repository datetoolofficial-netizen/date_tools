'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header({ lang, isDarkMode, toggleLang, toggleTheme, config }) {
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

    const toolName = config?.toolDisplayName || 'أدوات التاريخ';
    const toolSlogan = config?.toolSlogan || '';

    return (
        <div className="header" style={{ minHeight: '150px', position: 'relative', marginBottom: '30px' }}>
            <div className="top-controls" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <button
                    onClick={toggleTheme}
                    className="control-btn"
                    title={isDarkMode ? 'الوضع المضيء' : 'الوضع الليلي'}
                    aria-label={isDarkMode ? 'الوضع المضيء' : 'الوضع الليلي'}
                >
                    <i className={isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
                </button>

                <button
                    onClick={toggleLang}
                    className="control-btn lang-btn"
                    title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                    aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                >
                    <i className="fa-solid fa-language"></i>
                </button>
            </div>

            <div className="logo-container" style={{ textAlign: 'center', marginBottom: '15px' }}>
                {config?.hasLogo && config?.logoUrl && (
                    <Link href="/" style={{ display: 'inline-flex', marginBottom: '10px' }}>
                        <Image
                            src={config.logoUrl}
                            alt={toolName}
                            width={180}
                            height={80}
                            unoptimized
                            style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }}
                        />
                    </Link>
                )}

                <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
                    <h1
                        className="tool-title"
                        style={{
                            color: 'var(--primary)',
                            textAlign: 'center',
                            margin: '0 0 10px 0'
                        }}
                    >
                        {toolName}
                    </h1>
                </Link>
            </div>

            {toolSlogan && (
                <p
                    className="tool-slogan"
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-sub)',
                        margin: '0 0 20px 0'
                    }}
                >
                    {toolSlogan}
                </p>
            )}

            <nav
                className="nav-links"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginTop: '20px',
                    background: 'var(--bg-card)',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
            >
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-house" style={{ marginInlineEnd: '5px' }}></i>
                    {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>

                {navLinks.map((link, idx) => (
                    link.isExternal ? (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--text-main)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: '0.2s'
                            }}
                        >
                            {link.title}
                            <i
                                className="fa-solid fa-arrow-up-right-from-square"
                                style={{
                                    fontSize: '10px',
                                    marginInlineStart: '4px',
                                    color: 'var(--text-sub)'
                                }}
                            ></i>
                        </a>
                    ) : (
                        <Link
                            key={idx}
                            href={link.url}
                            style={{
                                color: 'var(--text-main)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: '0.2s'
                            }}
                        >
                            {link.title}
                        </Link>
                    )
                ))}
            </nav>
        </div>
    );
}
