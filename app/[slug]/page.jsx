'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSiteConfig } from '../firebase';
import Header from '../Header';
import Footer from '../Footer';

export default function DynamicPage() {
    const params = useParams();
    const slug = params?.slug;

    const [config, setConfig] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [lang, setLang] = useState('ar');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        const savedTheme = localStorage.getItem('site_theme');

        setLang(savedLang);
        setIsDarkMode(savedTheme === 'dark');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        const loadPage = async () => {
            try {
                const siteConfig = await getSiteConfig();
                setConfig(siteConfig);

                const customPages = siteConfig.customPages || {};
                const pages = siteConfig.pages || {};

                const foundPage =
                    customPages[slug] ||
                    pages[slug] ||
                    null;

                setPageData(foundPage);
            } catch (error) {
                console.error('Error loading dynamic page:', error);
                setPageData(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            loadPage();
        }
    }, [slug]);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('site_lang', newLang);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('site_theme', newTheme ? 'dark' : 'light');

        if (newTheme) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="card">
                    <p>جاري تحميل الصفحة...</p>
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="container">
                <Header
                    lang={lang}
                    isDarkMode={isDarkMode}
                    toggleLang={toggleLang}
                    toggleTheme={toggleTheme}
                    config={config}
                />

                <div className="card" style={{ textAlign: 'center' }}>
                    <h1>الصفحة غير موجودة</h1>
                    <p>لم يتم العثور على محتوى لهذه الصفحة.</p>
                    <a href="/" className="action-btn" style={{ display: 'inline-block', marginTop: '20px' }}>
                        العودة للرئيسية
                    </a>
                </div>

                <Footer lang={lang} config={config} />
            </div>
        );
    }

    const title = pageData.title || 'صفحة';
    const content = pageData.content || '';

    return (
        <div className="container">
            <Header
                lang={lang}
                isDarkMode={isDarkMode}
                toggleLang={toggleLang}
                toggleTheme={toggleTheme}
                config={config}
            />

            <article className="card">
                <h1 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
                    {title}
                </h1>

                <div
                    className="page-content"
                    style={{
                        lineHeight: '2',
                        color: 'var(--text-main)',
                        fontSize: '16px'
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>

            <Footer lang={lang} config={config} />
        </div>
    );
}