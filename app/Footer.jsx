'use client';

import Link from 'next/link';
import { APP_VERSION } from './version';

export default function Footer({ lang, config }) {
    const footerLinks = [];
    const seenLinks = new Set();

    const addFooterLink = (link) => {
        const key = `${link.url}|${link.title}`;
        if (!link.title || !link.url || seenLinks.has(key)) return;

        seenLinks.add(key);
        footerLinks.push(link);
    };

    if (config) {
        if (Array.isArray(config.internalPages)) {
            config.internalPages.forEach((page) => {
                if (page.location === 'footer' || page.location === 'both') {
                    addFooterLink({
                        title: page.title,
                        url: `/${page.slug}`,
                        isExternal: false
                    });
                }
            });
        }

        if (Array.isArray(config.externalLinks)) {
            config.externalLinks.forEach((link) => {
                if (link.location === 'footer' || link.location === 'both') {
                    addFooterLink({
                        title: link.title,
                        url: link.url,
                        isExternal: true
                    });
                }
            });
        }
    }

    const currentYear = new Date().getFullYear();
    const copyrightText = config?.copyrightText || 'جميع الحقوق محفوظة';
    const copyrightName = config?.copyrightName ? `لـ ${config.copyrightName}` : '';

    return (
        <footer className="footer site-footer">
            <div className="footer-inner">
                {footerLinks.length > 0 && (
                    <nav className="footer-links" aria-label={lang === 'en' ? 'Footer links' : 'روابط الفوتر'}>
                        {footerLinks.map((link, idx) => (
                            link.isExternal ? (
                                <a key={`${link.url}-${idx}`} href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.title}
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            ) : (
                                <Link key={`${link.url}-${idx}`} href={link.url}>
                                    {link.title}
                                </Link>
                            )
                        ))}
                    </nav>
                )}

                {Array.isArray(config?.socialLinks) && config.socialLinks.length > 0 && (
                    <div className="footer-social" aria-label={lang === 'en' ? 'Social links' : 'روابط التواصل'}>
                        {config.socialLinks.map((social, idx) => (
                            <a
                                key={`${social.url}-${idx}`}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={social.color ? { color: social.color } : undefined}
                            >
                                <i className={`fa-brands ${social.icon}`}></i>
                            </a>
                        ))}
                    </div>
                )}

                <div className="footer-meta">
                    <p>© {currentYear} {copyrightText} {copyrightName}</p>
                    <span className="footer-version">v{APP_VERSION}</span>
                </div>
            </div>
        </footer>
    );
}
