'use client';
import React, { useState, useEffect } from 'react';

export default function Header({ lang, isDarkMode, toggleLang, toggleTheme }) {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error("Error fetching config:", err));
    }, []);

    // تجميع الروابط المخصصة للهيدر
    const navLinks = [];
    if (config) {
        // الصفحات الداخلية
        if (config.internalPages && Array.isArray(config.internalPages)) {
            config.internalPages.forEach(page => {
                if (page.location === 'header' || page.location === 'both') {
                    navLinks.push({ title: page.title, url: `/${page.slug}`, isExternal: false });
                }
            });
        }
        // الروابط الخارجية
        if (config.externalLinks && Array.isArray(config.externalLinks)) {
            config.externalLinks.forEach(link => {
                if (link.location === 'header' || link.location === 'both') {
                    navLinks.push({ title: link.title, url: link.url, isExternal: true });
                }
            });
        }
    }

    const toolName = config?.toolDisplayName || 'أدوات التاريخ';
    const toolSlogan = config?.toolSlogan || '';

    return (
        <div className="header" style={{ minHeight: '150px', position: 'relative', marginBottom: '30px' }}>
            <div className="top-controls" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <button onClick={toggleTheme} className="control-btn" title={isDarkMode ? 'الوضع المضيء' : 'الوضع الليلي'} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <i className={isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
                </button>
                <button onClick={toggleLang} className="control-btn lang-btn" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {lang === 'ar' ? 'English' : 'عربي'}
                </button>
            </div>
            
            {config?.hasLogo && config?.logoUrl ? (
                <div className="logo-container" style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <a href="/"><img src={config.logoUrl} alt={toolName} style={{ maxHeight: '80px', objectFit: 'contain' }} /></a>
                </div>
            ) : (
                <a href="/" style={{ textDecoration: 'none' }}>
                    <h1 className="tool-title" style={{ color: 'var(--primary)', textAlign: 'center', margin: '0 0 10px 0' }}>{toolName}</h1>
                </a>
            )}
            
            {toolSlogan && <p className="tool-slogan" style={{ textAlign: 'center', color: 'var(--text-sub)', margin: '0 0 20px 0' }}>{toolSlogan}</p>}
            
            <nav className="nav-links" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px', background: 'var(--bg-card)', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-house" style={{marginInlineEnd: '5px'}}></i> {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </a>
                
                {navLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target={link.isExternal ? '_blank' : '_self'} rel={link.isExternal ? 'noopener noreferrer' : ''} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }}>
                        {link.title} {link.isExternal && <i className="fa-solid fa-arrow-up-right-from-square" style={{fontSize: '10px', marginInlineStart: '4px', color: 'var(--text-sub)'}}></i>}
                    </a>
                ))}
            </nav>
        </div>
    );
}