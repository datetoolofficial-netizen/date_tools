'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSiteConfig } from '../firebase';

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

export default function PageClient({ slug }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadPage() {
            try {
                setLoading(true);
                setError('');

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
            <main style={styles.page}>
                <section style={styles.card}>
                    <p style={styles.loading}>جاري تحميل الصفحة...</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main style={styles.page}>
                <section style={styles.card}>
                    <h1 style={styles.title}>حدث خطأ</h1>
                    <p style={styles.text}>{error}</p>
                    <Link href="/" style={styles.button}>
                        العودة للرئيسية
                    </Link>
                </section>
            </main>
        );
    }

    if (!page || page?.isActive === false || page?.enabled === false) {
        return (
            <main style={styles.page}>
                <section style={styles.card}>
                    <h1 style={styles.title}>الصفحة غير موجودة</h1>
                    <p style={styles.text}>
                        لم يتم العثور على الصفحة المطلوبة أو أنها غير مفعّلة.
                    </p>
                    <Link href="/" style={styles.button}>
                        العودة للرئيسية
                    </Link>
                </section>
            </main>
        );
    }

    const title = getPageTitle(page);
    const description = getPageDescription(page);
    const content = getPageContent(page);

    return (
        <main style={styles.page}>
            <article style={styles.article}>
                <header style={styles.header}>
                    <Link href="/" style={styles.homeLink}>
                        الرئيسية
                    </Link>

                    <h1 style={styles.title}>{title}</h1>

                    {description ? (
                        <p style={styles.description}>{description}</p>
                    ) : null}
                </header>

                {content ? (
                    <div
                        style={styles.content}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <p style={styles.text}>لا يوجد محتوى لهذه الصفحة حاليًا.</p>
                )}
            </article>
        </main>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f5f7fb',
        padding: '40px 16px',
        fontFamily: 'Cairo, sans-serif',
    },
    article: {
        maxWidth: '950px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '18px',
        padding: '32px',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        lineHeight: '1.9',
    },
    card: {
        maxWidth: '650px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '18px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        fontFamily: 'Cairo, sans-serif',
    },
    header: {
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '20px',
        marginBottom: '24px',
    },
    homeLink: {
        display: 'inline-block',
        marginBottom: '14px',
        color: '#004877',
        textDecoration: 'none',
        fontWeight: '700',
    },
    title: {
        margin: '0 0 12px',
        color: '#0f172a',
        fontSize: '32px',
        fontWeight: '800',
    },
    description: {
        margin: 0,
        color: '#64748b',
        fontSize: '17px',
    },
    content: {
        color: '#1f2937',
        fontSize: '17px',
    },
    text: {
        color: '#475569',
        fontSize: '17px',
        marginBottom: '24px',
    },
    loading: {
        color: '#475569',
        fontSize: '17px',
        margin: 0,
    },
    button: {
        display: 'inline-block',
        background: '#004877',
        color: '#ffffff',
        padding: '12px 22px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontWeight: '700',
    },
};
