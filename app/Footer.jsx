'use client';
import React, { useState, useEffect } from 'react';

export default function Footer({ lang }) {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error("Error fetching config:", err));
    }, []);

    const footerLinks = [];
    if (config) {
        // الصفحات الداخلية
        if (config.internalPages && Array.isArray(config.internalPages)) {
            config.internalPages.forEach(page => {
                if (page.location === 'footer' || page.location === 'both') {
                    footerLinks.push({ title: page.title, url: `/${page.slug}`, isExternal: false });
                }
            });
        }
        // الروابط الخارجية
        if (config.externalLinks && Array.isArray(config.externalLinks)) {
            config.externalLinks.forEach(link => {
                if (link.location === 'footer' || link.location === 'both') {
                    footerLinks.push({ title: link.title, url: link.url, isExternal: true });
                }
            });
        }
    }

    const currentYear = new Date().getFullYear();
    const copyrightText = config?.copyrightText || 'جميع الحقوق محفوظة';
    const copyrightName = config?.copyrightName ? `لـ ${config.copyrightName}` : '';

    return (
        <footer className="footer" style={{ padding: '30px 20px', textAlign: 'center', marginTop: '50px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
            
            {/* روابط الفوتر */}
            {footerLinks.length > 0 && (
                <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {footerLinks.map((link, idx) => (
                        <a key={idx} href={link.url} target={link.isExternal ? '_blank' : '_self'} rel={link.isExternal ? 'noopener noreferrer' : ''} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                            {link.title} {link.isExternal && <i className="fa-solid fa-arrow-up-right-from-square" style={{fontSize: '10px', marginInlineStart: '4px', color: 'var(--text-sub)'}}></i>}
                        </a>
                    ))}
                </nav>
            )}

            {/* أيقونات السوشيال ميديا */}
            {config?.socialLinks && config.socialLinks.length > 0 && (
                <div className="social-icons" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                    {config.socialLinks.map((social, idx) => (
                        <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-sub)', fontSize: '22px', transition: '0.3s' }}>
                            <i className={`fa-brands ${social.icon}`}></i>
                        </a>
                    ))}
                </div>
            )}

            {/* نص الحقوق */}
            <p style={{ color: 'var(--text-sub)', fontSize: '14px', margin: '0' }}>
                © {currentYear} {copyrightText} {copyrightName}
            </p>
        </footer>
    );
}