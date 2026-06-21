'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '../sanitizeHtml';

function normalizeSlug(value = '') {
    return String(value)
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

function findPageInList(pages, slug) {
    const currentSlug = normalizeSlug(slug);

    return pages.find((page) => {
        const pageSlug = normalizeSlug(
            page?.slug ||
            page?.path ||
            page?.url ||
            page?.link ||
            ''
        );

        return pageSlug === currentSlug;
    });
}

function findPageBySlug(config, slug) {
    if (!config) return null;

    const currentSlug = normalizeSlug(slug);
    const customPages = config.customPages || {};
    const pages = config.pages || {};
    const internalPage = Array.isArray(config.internalPages)
        ? findPageInList(config.internalPages, currentSlug)
        : null;

    if (!currentSlug) return null;

    if (customPages && !Array.isArray(customPages) && customPages[currentSlug]) {
        return {
            ...(internalPage || {}),
            ...customPages[currentSlug],
            slug: currentSlug,
            title: customPages[currentSlug].title || internalPage?.title,
        };
    }

    if (pages && !Array.isArray(pages) && pages[currentSlug]) {
        return {
            ...pages[currentSlug],
            slug: currentSlug,
        };
    }

    if (Array.isArray(customPages)) {
        const customPage = findPageInList(customPages, currentSlug);
        if (customPage) return customPage;
    }

    if (internalPage) return internalPage;

    if (Array.isArray(pages)) {
        return findPageInList(pages, currentSlug);
    }

    return null;
}

function getPageTitle(page) {
    return (
        page?.title ||
        page?.pageTitle ||
        page?.name ||
        page?.label ||
        'صفحة'
    );
}

function getPageDescription(page) {
    return (
        page?.description ||
        page?.seoDescription ||
        page?.summary ||
        ''
    );
}

function getPageContent(page) {
    return (
        page?.content ||
        page?.html ||
        page?.body ||
        page?.text ||
        ''
    );
}

function applyConfigVariables(content, config) {
    const replacements = {
        contactEmail: config?.contactEmail || '',
    };

    return String(content || '').replace(/\{\{\s*(contactEmail)\s*\}\}/g, (_, key) => replacements[key]);
}

function PageFrame({ lang, title, children, align = 'right' }) {
    return (
        <div className="container">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" className="control-btn" style={{ textDecoration: 'none', width: 'auto', padding: '0 15px' }}>
                    <i className="fa-solid fa-arrow-right"></i> {lang === 'ar' ? 'العودة' : 'Back'}
                </Link>
                <h1>{title}</h1>
                <div style={{ width: '80px' }}></div>
            </div>

            <div className="card" style={{ lineHeight: '1.8', textAlign: align }}>
                {children}
            </div>
        </div>
    );
}

export default function PageClient({ slug }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lang, setLang] = useState('ar');

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        setLang(savedLang);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

        const savedTheme = localStorage.getItem('site_theme');
        const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadPage() {
            try {
                setLoading(true);
                setError('');

                const { getSiteConfig } = await import('../firebase');
                const siteConfig = await getSiteConfig();

                if (isMounted) {
                    setConfig(siteConfig || {});
                }
            } catch (err) {
                console.error('خطأ في قراءة صفحة slug من Firestore:', err);

                if (isMounted) {
                    setError('تعذر تحميل الصفحة. يرجى المحاولة لاحقًا.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const page = useMemo(() => {
        return findPageBySlug(config, slug);
    }, [config, slug]);

    if (loading) {
        return (
            <div className="container">
                <div className="card" style={{ lineHeight: '1.8', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-sub)', margin: 0 }}>جاري تحميل الصفحة...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'حدث خطأ' : 'Error'} align="center">
                <p style={{ color: 'var(--text-sub)' }}>{error}</p>
            </PageFrame>
        );
    }

    if (!page || page?.isActive === false || page?.enabled === false) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'} align="center">
                <p style={{ color: 'var(--text-sub)' }}>
                    {lang === 'ar'
                        ? 'لم يتم العثور على الصفحة المطلوبة أو أنها غير مفعلة.'
                        : 'The requested page was not found or is not enabled.'}
                </p>
            </PageFrame>
        );
    }

    const title = getPageTitle(page);
    const description = getPageDescription(page);
    const content = sanitizeHtml(applyConfigVariables(getPageContent(page), config));
    const align = lang === 'ar' ? 'right' : 'left';

    return (
        <PageFrame lang={lang} title={title} align={align}>
            {description ? (
                <p style={{ color: 'var(--text-sub)', marginBottom: '25px' }}>{description}</p>
            ) : null}

            {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
                <p style={{ color: 'var(--text-sub)' }}>
                    {lang === 'ar'
                        ? 'لا يوجد محتوى لهذه الصفحة حاليًا.'
                        : 'This page does not have content yet.'}
                </p>
            )}
        </PageFrame>
    );
}
