'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import { sanitizeHtml } from '../../sanitizeHtml';
import '../AdminDashboard.css';

const SOCIAL_PRESETS = [
    { label: 'X / Twitter', icon: 'fa-x-twitter', color: '#111827' },
    { label: 'Snapchat', icon: 'fa-snapchat', color: '#facc15' },
    { label: 'Instagram', icon: 'fa-instagram', color: '#e1306c' },
    { label: 'TikTok', icon: 'fa-tiktok', color: '#111827' },
    { label: 'YouTube', icon: 'fa-youtube', color: '#ef4444' },
    { label: 'LinkedIn', icon: 'fa-linkedin', color: '#0a66c2' },
];

const EMPTY_SOCIAL = {
    icon: 'fa-x-twitter',
    url: '',
    color: '#111827',
};

const EMPTY_EXTERNAL_LINK = {
    title: '',
    url: '',
    location: 'footer',
};

function pickToolsConfig(config = {}) {
    return {
        internalPages: Array.isArray(config.internalPages) ? config.internalPages : [],
        customPages: config.customPages || {},
        socialLinks: Array.isArray(config.socialLinks) ? config.socialLinks : [],
        externalLinks: Array.isArray(config.externalLinks) ? config.externalLinks : [],
        privacySettingsButton: {
            enabled: config.privacySettingsButton?.enabled === true,
            pages: Array.isArray(config.privacySettingsButton?.pages) ? config.privacySettingsButton.pages : [],
        },
        pwaInstallPrompt: {
            enabled: config.pwaInstallPrompt?.enabled !== false,
            text: config.pwaInstallPrompt?.text || 'ثبّت الأداة على جهازك لاستخدام أسرع',
            buttonText: config.pwaInstallPrompt?.buttonText || 'ثبّت الأداة',
        },
    };
}

function normalizeSlug(value) {
    return String(value || '')
        .trim()
        .replace(/^\/+/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_ء-ي]/g, '');
}

function createUniqueSlug(baseSlug, pages = []) {
    const usedSlugs = new Set(pages.map((page) => normalizeSlug(page?.slug)).filter(Boolean));
    const base = normalizeSlug(baseSlug) || 'page';
    let candidate = base;
    let counter = 2;

    while (usedSlugs.has(candidate)) {
        candidate = `${base}-${counter}`;
        counter += 1;
    }

    return candidate;
}

function validatePageSlugs(pages = []) {
    const seen = new Set();

    for (const page of pages) {
        const slug = normalizeSlug(page?.slug);

        if (!slug) return { isValid: false, message: 'يوجد مسار صفحة فارغ. الرجاء إدخال slug قبل الحفظ.' };
        if (seen.has(slug)) return { isValid: false, message: `المسار "${slug}" مكرر. لا يمكن حفظ صفحتين بنفس slug.` };

        seen.add(slug);
    }

    return { isValid: true, message: '' };
}

function normalizePagePath(value) {
    const cleanValue = String(value || '/').trim();
    if (!cleanValue || cleanValue === '/') return '/';
    const withoutQuery = cleanValue.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

function getPrivacyPageChoices(pages = []) {
    const choices = [
        { path: '/', title: 'التاريخ' },
        { path: '/clock', title: 'الساعة' },
        { path: '/weather', title: 'الطقس' },
    ];

    pages.forEach((page) => {
        const slug = normalizeSlug(page?.slug);
        if (!slug) return;
        const path = normalizePagePath(slug);
        if (!choices.some((choice) => choice.path === path)) {
            choices.push({
                path,
                title: page?.title || path,
            });
        }
    });

    return choices;
}

function AdminNav({ active = 'tools' }) {
    return (
        <ul className="legacy-nav-links">
            <li>
                <Link href="/admin" className={active === 'home' ? 'active' : ''}>
                    <i className="fa-solid fa-house"></i>
                    <span className="nav-text">الرئيسية</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/identity" className={active === 'identity' ? 'active' : ''}>
                    <i className="fa-solid fa-palette"></i>
                    <span className="nav-text">إدارة الهوية</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/integrations" className={active === 'integrations' ? 'active' : ''}>
                    <i className="fa-solid fa-plug-circle-bolt"></i>
                    <span className="nav-text">الربط الخارجي</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/ad-settings" className={active === 'ad-settings' ? 'active' : ''}>
                    <i className="fa-solid fa-rectangle-ad"></i>
                    <span className="nav-text">إدارة الإعلانات</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/ads" className={active === 'ads' ? 'active' : ''}>
                    <i className="fa-solid fa-bullhorn"></i>
                    <span className="nav-text">الحملات الإعلانية</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/tool-management" className={active === 'tool-management' ? 'active' : ''}>
                    <i className="fa-solid fa-toolbox"></i>
                    <span className="nav-text">إدارة الأدوات</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/tools" className={active === 'tools' ? 'active' : ''}>
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                    <span className="nav-text">إعدادات الأداة</span>
                </Link>
            </li>
            <li>
                <Link href="/client/dashboard">
                    <i className="fa-solid fa-user-tie"></i>
                    <span className="nav-text">بوابة المعلنين</span>
                </Link>
            </li>
            <li>
                <Link href="/support">
                    <i className="fa-solid fa-headset"></i>
                    <span className="nav-text">الدعم</span>
                </Link>
            </li>
        </ul>
    );
}

function PageHtmlEditor({ value, onChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;
        const safeValue = sanitizeHtml(value || '');
        if (editor.innerHTML !== safeValue) editor.innerHTML = safeValue;
    }, [value]);

    const updateFromEditor = () => {
        const editor = editorRef.current;
        if (!editor) return;
        onChange(sanitizeHtml(editor.innerHTML));
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const html = event.clipboardData.getData('text/html');
        const text = event.clipboardData.getData('text/plain');
        const safeContent = html
            ? sanitizeHtml(html)
            : sanitizeHtml(String(text || '').split(/\n{2,}/).map((part) => `<p>${part.replace(/\n/g, '<br>')}</p>`).join(''));

        document.execCommand('insertHTML', false, safeContent);
        updateFromEditor();
    };

    return (
        <div
            ref={editorRef}
            className="tools-rich-editor"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            onInput={updateFromEditor}
            onPaste={handlePaste}
            data-placeholder="اكتب محتوى الصفحة هنا أو الصق نصًا منسقًا من Google Docs..."
        />
    );
}

export default function AdminToolsPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toolsConfig, setToolsConfig] = useState(pickToolsConfig());
    const [pageModalIndex, setPageModalIndex] = useState(null);
    const [isPageModalEditing, setIsPageModalEditing] = useState(false);
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadToolsPage() {
            try {
                const [{ auth, getAdminProfile, getSiteConfig, saveSiteConfigSection }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/auth'),
                ]);

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut, saveSiteConfigSection };

                if (document.body.classList.contains('dark-mode')) setIsDarkMode(true);
                if (window.localStorage.getItem('admin_sidebar_collapsed') === 'true') setIsSidebarCollapsed(true);

                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        window.location.replace('/admin_login');
                        return;
                    }

                    try {
                        const adminProfile = await getAdminProfile(user.uid);
                        if (!adminProfile || adminProfile.active !== true) {
                            await signOut(auth);
                            window.location.replace('/admin_login');
                            return;
                        }

                        if (!isMounted) return;

                        setAdminName(adminProfile.name || adminProfile.email || 'أيها المدير');
                        setAdminRole(adminProfile.role === 'super_admin' ? 'المدير العام' : 'مدير');
                        setToolsConfig(pickToolsConfig(await getSiteConfig()));
                    } catch (error) {
                        console.error('Error loading tools page:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة إعدادات الأداة.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading tools modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات إعدادات الأداة.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadToolsPage();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => () => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    }, []);

    const showMessage = (type, text) => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setMessage({ type, text });
        messageTimerRef.current = window.setTimeout(() => setMessage(null), 4500);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((current) => {
            const next = !current;
            window.localStorage.setItem('admin_sidebar_collapsed', String(next));
            return next;
        });
    };

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        setIsDarkMode((current) => !current);
    };

    const handleLogout = async () => {
        const firebaseApi = firebaseApiRef.current;
        try {
            if (firebaseApi?.signOut && firebaseApi?.auth) await firebaseApi.signOut(firebaseApi.auth);
        } finally {
            window.location.replace('/admin_login');
        }
    };

    const saveTools = async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        const slugValidation = validatePageSlugs(toolsConfig.internalPages || []);
        if (!slugValidation.isValid) {
            showMessage('error', slugValidation.message);
            return;
        }

        setSaving(true);
        showMessage('info', 'جاري حفظ إعدادات الأداة...');

        try {
            const savedPatch = await firebaseApi.saveSiteConfigSection(toolsConfig);
            setToolsConfig(pickToolsConfig(savedPatch));
            showMessage('success', 'تم حفظ إعدادات الأداة بنجاح.');
        } catch (error) {
            console.error('Error saving tools:', error);
            showMessage('error', 'تعذر حفظ إعدادات الأداة. تحقق من صلاحيات المدير.');
        } finally {
            setSaving(false);
        }
    };

    const cleanupFirebaseData = async () => {
        const firebaseApi = firebaseApiRef.current;
        const currentUser = firebaseApi?.auth?.currentUser;

        if (!currentUser) {
            showMessage('error', 'انتهت جلسة المدير. سجّل الدخول مرة أخرى قبل التنظيف.');
            return;
        }

        const confirmed = window.confirm('سيتم حذف بيانات Firestore القديمة غير المستخدمة فقط: صفحة من نحن المحذوفة، الحملات القديمة، صور الإعلانات القديمة، pages، وحقل toolSlogan المكرر. هل تريد المتابعة؟');
        if (!confirmed) return;

        setSaving(true);
        showMessage('info', 'جاري تنظيف بيانات Firebase القديمة...');

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/admin/cleanup', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'cleanup_failed');
            }

            setToolsConfig((current) => {
                const customPages = { ...(current.customPages || {}) };
                delete customPages.about;
                return { ...current, customPages };
            });
            showMessage('success', 'تم تنظيف بيانات Firebase القديمة بنجاح.');
        } catch (error) {
            console.error('Firebase cleanup failed:', error);
            showMessage('error', 'تعذر تنظيف Firebase. تحقق من صلاحية المدير وإعداد سر Firebase Service Account.');
        } finally {
            setSaving(false);
        }
    };

    const updateArrayItem = (key, index, field, value) => {
        setToolsConfig((current) => {
            const nextItems = [...(current[key] || [])];
            nextItems[index] = {
                ...(nextItems[index] || {}),
                [field]: value,
            };

            return {
                ...current,
                [key]: nextItems,
            };
        });
    };

    const removeArrayItem = (key, index) => {
        setToolsConfig((current) => ({
            ...current,
            [key]: (current[key] || []).filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const updatePrivacySettingsButton = (field, value) => {
        setToolsConfig((current) => ({
            ...current,
            privacySettingsButton: {
                ...(current.privacySettingsButton || { enabled: false, pages: [] }),
                [field]: value,
            },
        }));
    };

    const updatePwaInstallPrompt = (field, value) => {
        setToolsConfig((current) => ({
            ...current,
            pwaInstallPrompt: {
                ...(current.pwaInstallPrompt || { enabled: true, text: '', buttonText: '' }),
                [field]: value,
            },
        }));
    };

    const togglePrivacySettingsPage = (path) => {
        const safePath = normalizePagePath(path);
        setToolsConfig((current) => {
            const settings = current.privacySettingsButton || { enabled: false, pages: [] };
            const pages = Array.isArray(settings.pages) ? settings.pages.map(normalizePagePath) : [];
            const nextPages = pages.includes(safePath)
                ? pages.filter((pagePath) => pagePath !== safePath)
                : [...pages, safePath];

            return {
                ...current,
                privacySettingsButton: {
                    ...settings,
                    pages: nextPages,
                },
            };
        });
    };

    const addExternalLink = () => {
        setToolsConfig((current) => ({
            ...current,
            externalLinks: [...(current.externalLinks || []), EMPTY_EXTERNAL_LINK],
        }));
    };

    const addSocialLink = () => {
        setToolsConfig((current) => ({
            ...current,
            socialLinks: [...(current.socialLinks || []), EMPTY_SOCIAL],
        }));
    };

    const addPage = () => {
        setToolsConfig((current) => {
            const slug = createUniqueSlug('page', current.internalPages || []);

            return {
                ...current,
                internalPages: [
                    ...(current.internalPages || []),
                    {
                        title: 'صفحة جديدة',
                        slug,
                        location: 'footer',
                    },
                ],
                customPages: {
                    ...(current.customPages || {}),
                    [slug]: {
                        title: 'صفحة جديدة',
                        content: '<p>اكتب محتوى الصفحة هنا...</p>',
                    },
                },
            };
        });
    };

    const updatePage = (index, field, value) => {
        setToolsConfig((current) => {
            const pages = [...(current.internalPages || [])];
            const oldPage = pages[index] || {};
            const oldSlug = normalizeSlug(oldPage.slug);
            const customPages = { ...(current.customPages || {}) };
            const nextValue = field === 'slug' ? normalizeSlug(value) : value;

            if (field === 'slug') {
                const duplicateIndex = pages.findIndex((page, pageIndex) => (
                    pageIndex !== index && normalizeSlug(page?.slug) === nextValue
                ));
                if (nextValue && duplicateIndex !== -1) {
                    showMessage('error', `المسار "${nextValue}" مستخدم في صفحة أخرى.`);
                    return current;
                }
            }

            const nextPage = {
                ...oldPage,
                [field]: nextValue,
            };
            pages[index] = nextPage;

            const nextSlug = normalizeSlug(nextPage.slug);
            if (field === 'slug' && oldSlug && oldSlug !== nextSlug) {
                customPages[nextSlug] = {
                    ...(customPages[oldSlug] || {}),
                    title: nextPage.title || customPages[oldSlug]?.title || '',
                    content: customPages[oldSlug]?.content || '',
                };
                delete customPages[oldSlug];
            }

            if (field === 'title' && nextSlug) {
                customPages[nextSlug] = {
                    ...(customPages[nextSlug] || {}),
                    title: nextValue,
                    content: customPages[nextSlug]?.content || '',
                };
            }

            if (nextSlug && !customPages[nextSlug]) {
                customPages[nextSlug] = {
                    title: nextPage.title || '',
                    content: '',
                };
            }

            return {
                ...current,
                internalPages: pages,
                customPages,
            };
        });
    };

    const removePage = async (index) => {
        const firebaseApi = firebaseApiRef.current;
        const pages = [...(toolsConfig.internalPages || [])];
        const [removedPage] = pages.splice(index, 1);
        const slug = normalizeSlug(removedPage?.slug);
        const customPages = { ...(toolsConfig.customPages || {}) };
        if (slug) delete customPages[slug];

        const nextConfig = {
            ...toolsConfig,
            internalPages: pages,
            customPages,
        };

        setToolsConfig(nextConfig);
        if (pageModalIndex === index) closePageModal();

        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد. احفظ الإعدادات بعد اكتمال التحميل.');
            return;
        }

        try {
            setSaving(true);
            showMessage('info', 'جاري حذف الصفحة من قاعدة البيانات...');
            await firebaseApi.saveSiteConfigSection({
                internalPages: pages,
                customPages: slug
                    ? { ...customPages, [slug]: { __delete: true } }
                    : customPages,
            });
            showMessage('success', 'تم حذف الصفحة من Firebase بنجاح.');
        } catch (error) {
            console.error('Error deleting page:', error);
            showMessage('error', 'تعذر حذف الصفحة من Firebase. تمت إعادة تحميل القائمة المحلية.');
            setToolsConfig(toolsConfig);
        } finally {
            setSaving(false);
        }
    };

    const updatePageContent = (slug, content) => {
        const safeSlug = normalizeSlug(slug);
        if (!safeSlug) return;

        setToolsConfig((current) => ({
            ...current,
            customPages: {
                ...(current.customPages || {}),
                [safeSlug]: {
                    ...(current.customPages?.[safeSlug] || {}),
                    title:
                        current.customPages?.[safeSlug]?.title ||
                        (current.internalPages || []).find((page) => normalizeSlug(page.slug) === safeSlug)?.title ||
                        '',
                    content,
                },
            },
        }));
    };

    const openPageModal = (index, editMode = false) => {
        setPageModalIndex(index);
        setIsPageModalEditing(editMode);
    };

    const closePageModal = () => {
        setPageModalIndex(null);
        setIsPageModalEditing(false);
    };

    const selectedPage = pageModalIndex !== null ? (toolsConfig.internalPages || [])[pageModalIndex] : null;
    const selectedPageSlug = normalizeSlug(selectedPage?.slug);
    const selectedPageTitle = toolsConfig.customPages?.[selectedPageSlug]?.title || selectedPage?.title || 'صفحة';
    const selectedPageContent = toolsConfig.customPages?.[selectedPageSlug]?.content || '';
    const privacyPageChoices = getPrivacyPageChoices(toolsConfig.internalPages || []);
    const selectedPrivacyPages = new Set((toolsConfig.privacySettingsButton?.pages || []).map(normalizePagePath));

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-screwdriver-wrench fa-beat-fade"></i>
                <h3>جاري فتح إعدادات الأداة...</h3>
            </div>
        );
    }

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    return (
        <div className={`legacy-admin-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} dir="rtl">
            <div className={`legacy-sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>

            <aside className={`legacy-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="legacy-sidebar-header">
                    <div className="legacy-sidebar-logo">
                        <i className="fa-solid fa-layer-group"></i>
                        <h2>بوابة الإدارة</h2>
                    </div>
                    <button className="legacy-toggle-sidebar-btn" onClick={toggleSidebar} aria-label="تصغير القائمة">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <AdminNav active="tools" />
            </aside>

            <main className="legacy-main-wrapper">
                <nav className="legacy-top-nav">
                    <div className="legacy-nav-right">
                        <button className="legacy-hamburger-btn" onClick={() => setIsMobileSidebarOpen(true)} aria-label="فتح القائمة">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div className="legacy-admin-profile">
                            <div className="legacy-admin-avatar">
                                <i className="fa-solid fa-user-tie"></i>
                            </div>
                            <div className="legacy-admin-info">
                                <h2>{adminName}</h2>
                                <p>{adminRole}</p>
                            </div>
                        </div>
                    </div>

                    <div className="legacy-nav-controls">
                        <button className="legacy-theme-toggle" onClick={toggleDarkMode} aria-label="تبديل المظهر">
                            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                        </button>
                        <button className="legacy-logout-btn" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            <span>خروج</span>
                        </button>
                    </div>
                </nav>

                <Toast
                    message={message?.text || ''}
                    type={message?.type || 'info'}
                    visible={Boolean(message?.text)}
                    onClose={() => setMessage(null)}
                />

                <section className="legacy-ads-hero tools-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            إعدادات الأداة
                        </h1>
                        <p>صفحة خفيفة لإدارة الروابط والصفحات والسوشيال ميديا والأحداث فقط.</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={saveTools} disabled={saving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الأداة'}
                    </button>
                </section>

                <div className="tools-quick-grid">
                    <a href="#pages" className="tools-quick-card color-pages">
                        <i className="fa-solid fa-file-lines"></i>
                        <span>الصفحات</span>
                    </a>
                    <a href="#links" className="tools-quick-card color-links">
                        <i className="fa-solid fa-link"></i>
                        <span>الروابط</span>
                    </a>
                    <a href="#social" className="tools-quick-card color-social">
                        <i className="fa-solid fa-hashtag"></i>
                        <span>السوشيال</span>
                    </a>
                    <button type="button" className="tools-quick-card color-cleanup" onClick={cleanupFirebaseData} disabled={saving}>
                        <i className="fa-solid fa-broom"></i>
                        <span>تنظيف Firebase</span>
                    </button>
                </div>

                <section className="legacy-google-card tools-section-card tools-privacy-settings-card" id="privacy-settings-button">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-privacy"><i className="fa-solid fa-shield-halved"></i></span>
                            <div>
                                <h2>تفعيل زر إعدادات الخصوصية</h2>
                                <p>تحكم في ظهور الزر العائم الذي يسمح للزائر بالعودة إلى إعدادات الخصوصية والكوكيز.</p>
                            </div>
                        </div>
                    </div>

                    <div className="privacy-admin-controls">
                        <label className="privacy-admin-toggle">
                            <input
                                type="checkbox"
                                checked={toolsConfig.privacySettingsButton?.enabled === true}
                                onChange={(event) => updatePrivacySettingsButton('enabled', event.target.checked)}
                            />
                            <span>
                                <strong>إظهار زر إعدادات الخصوصية</strong>
                                <small>بعد موافقة الزائر، يظهر الزر فقط في الصفحات المختارة أدناه.</small>
                            </span>
                        </label>

                        <div className="privacy-admin-pages">
                            {privacyPageChoices.map((page) => (
                                <label className="privacy-admin-page" key={page.path}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPrivacyPages.has(normalizePagePath(page.path))}
                                        onChange={() => togglePrivacySettingsPage(page.path)}
                                    />
                                    <span>{page.title}</span>
                                    <code dir="ltr">{page.path}</code>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="legacy-google-card tools-section-card tools-pwa-settings-card" id="pwa-install-settings">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-pwa"><i className="fa-solid fa-mobile-screen-button"></i></span>
                            <div>
                                <h2>زر تثبيت الأداة</h2>
                                <p>تحكم في ظهور زر تثبيت الموقع كتطبيق ونص الرسالة والزر.</p>
                            </div>
                        </div>
                    </div>

                    <div className="privacy-admin-controls">
                        <label className="privacy-admin-toggle">
                            <input
                                type="checkbox"
                                checked={toolsConfig.pwaInstallPrompt?.enabled !== false}
                                onChange={(event) => updatePwaInstallPrompt('enabled', event.target.checked)}
                            />
                            <span>
                                <strong>إظهار زر تثبيت الأداة</strong>
                                <small>يظهر فقط عندما يدعم المتصفح تثبيت الموقع كتطبيق، ولا يظهر بعد تثبيت الأداة أو إخفائه من الزائر.</small>
                            </span>
                        </label>

                        <div className="legacy-form-grid two-columns">
                            <div className="legacy-field">
                                <label>نص رسالة التثبيت</label>
                                <input
                                    value={toolsConfig.pwaInstallPrompt?.text || ''}
                                    onChange={(event) => updatePwaInstallPrompt('text', event.target.value)}
                                    placeholder="مثال: ثبّت الأداة على جهازك لاستخدام أسرع"
                                />
                            </div>
                            <div className="legacy-field">
                                <label>نص زر التثبيت</label>
                                <input
                                    value={toolsConfig.pwaInstallPrompt?.buttonText || ''}
                                    onChange={(event) => updatePwaInstallPrompt('buttonText', event.target.value)}
                                    placeholder="مثال: ثبّت الأداة"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="legacy-google-card tools-section-card" id="pages">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-pages"><i className="fa-solid fa-file-lines"></i></span>
                            <div>
                                <h2>الصفحات</h2>
                                <p>أنشئ صفحات بسيطة تظهر في الهيدر أو الفوتر أو كلاهما.</p>
                            </div>
                        </div>
                        <button type="button" className="legacy-primary-btn" onClick={addPage}>
                            <i className="fa-solid fa-plus"></i>
                            إضافة صفحة
                        </button>
                    </div>

                    <div className="tools-list">
                        {(toolsConfig.internalPages || []).length === 0 && (
                            <div className="tools-empty">لا توجد صفحات بعد.</div>
                        )}

                        {(toolsConfig.internalPages || []).length > 0 && (
                            <div className="tools-table-head">
                                <span>عنوان الصفحة</span>
                                <span>المسار</span>
                                <span>مكان الظهور</span>
                                <span>الإجراءات</span>
                            </div>
                        )}

                        {(toolsConfig.internalPages || []).map((page, index) => (
                            <div className="tools-item-card" key={`${page.slug}-${index}`}>
                                <div className="tools-item-main">
                                    <div className="legacy-field">
                                        <label>عنوان الصفحة</label>
                                        <input value={page.title || ''} onChange={(event) => updatePage(index, 'title', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>المسار</label>
                                        <input dir="ltr" value={page.slug || ''} onChange={(event) => updatePage(index, 'slug', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>مكان الظهور</label>
                                        <select value={page.location || 'footer'} onChange={(event) => updatePage(index, 'location', event.target.value)}>
                                            <option value="header">الهيدر فقط</option>
                                            <option value="footer">الفوتر فقط</option>
                                            <option value="both">الهيدر والفوتر</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="tools-item-actions">
                                    <button type="button" onClick={() => openPageModal(index)} title="معاينة الصفحة">
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                    <button type="button" onClick={() => openPageModal(index, true)} title="تعديل المحتوى">
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button type="button" className="danger" onClick={() => removePage(index)} title="حذف الصفحة">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="legacy-google-card tools-section-card" id="links">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-links"><i className="fa-solid fa-link"></i></span>
                            <div>
                                <h2>الروابط</h2>
                                <p>روابط خارجية بسيطة تظهر في الهيدر أو الفوتر.</p>
                            </div>
                        </div>
                        <button type="button" className="legacy-primary-btn" onClick={addExternalLink}>
                            <i className="fa-solid fa-plus"></i>
                            إضافة رابط
                        </button>
                    </div>

                    <div className="tools-list">
                        {(toolsConfig.externalLinks || []).length === 0 && (
                            <div className="tools-empty">لا توجد روابط خارجية بعد.</div>
                        )}

                        {(toolsConfig.externalLinks || []).length > 0 && (
                            <div className="tools-table-head">
                                <span>اسم الرابط</span>
                                <span>الرابط</span>
                                <span>مكان الظهور</span>
                                <span>الإجراءات</span>
                            </div>
                        )}

                        {(toolsConfig.externalLinks || []).map((link, index) => (
                            <div className="tools-item-card compact" key={`${link.url}-${index}`}>
                                <div className="tools-item-main">
                                    <div className="legacy-field">
                                        <label>اسم الرابط</label>
                                        <input value={link.title || ''} onChange={(event) => updateArrayItem('externalLinks', index, 'title', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>الرابط</label>
                                        <input dir="ltr" type="url" value={link.url || ''} onChange={(event) => updateArrayItem('externalLinks', index, 'url', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>مكان الظهور</label>
                                        <select value={link.location || 'footer'} onChange={(event) => updateArrayItem('externalLinks', index, 'location', event.target.value)}>
                                            <option value="header">الهيدر فقط</option>
                                            <option value="footer">الفوتر فقط</option>
                                            <option value="both">الهيدر والفوتر</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="tools-item-actions">
                                    <a className="tools-row-action" href={link.url || '#'} target="_blank" rel="noopener noreferrer" title="فتح الرابط">
                                        <i className="fa-solid fa-up-right-from-square"></i>
                                    </a>
                                    <button type="button" className="danger" onClick={() => removeArrayItem('externalLinks', index)} title="حذف الرابط">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="legacy-google-card tools-section-card" id="social">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-social"><i className="fa-solid fa-hashtag"></i></span>
                            <div>
                                <h2>السوشيال ميديا</h2>
                                <p>روابط التواصل مع ألوان أيقونات مرحة وواضحة.</p>
                            </div>
                        </div>
                        <button type="button" className="legacy-primary-btn" onClick={addSocialLink}>
                            <i className="fa-solid fa-plus"></i>
                            إضافة حساب
                        </button>
                    </div>

                    <div className="tools-social-grid">
                        {(toolsConfig.socialLinks || []).length === 0 && (
                            <div className="tools-empty">لا توجد حسابات سوشيال بعد.</div>
                        )}

                        {(toolsConfig.socialLinks || []).length > 0 && (
                            <div className="tools-table-head">
                                <span>الأيقونة</span>
                                <span>المنصة</span>
                                <span>الرابط</span>
                                <span>اللون</span>
                                <span>الإجراءات</span>
                            </div>
                        )}

                        {(toolsConfig.socialLinks || []).map((social, index) => (
                            <div className="tools-social-card" key={`${social.url}-${index}`}>
                                <div className="tools-social-preview" style={{ color: social.color || '#3b82f6' }}>
                                    <i className={`fa-brands ${social.icon || 'fa-x-twitter'}`}></i>
                                </div>
                                <div className="legacy-field">
                                    <label>المنصة</label>
                                    <select
                                        value={social.icon || 'fa-x-twitter'}
                                        onChange={(event) => {
                                            const preset = SOCIAL_PRESETS.find((item) => item.icon === event.target.value);
                                            updateArrayItem('socialLinks', index, 'icon', event.target.value);
                                            if (preset) updateArrayItem('socialLinks', index, 'color', preset.color);
                                        }}
                                    >
                                        {SOCIAL_PRESETS.map((preset) => (
                                            <option value={preset.icon} key={preset.icon}>{preset.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="legacy-field">
                                    <label>الرابط</label>
                                    <input dir="ltr" type="url" value={social.url || ''} onChange={(event) => updateArrayItem('socialLinks', index, 'url', event.target.value)} />
                                </div>
                                <div className="tools-color-row">
                                    <input type="color" value={social.color || '#3b82f6'} onChange={(event) => updateArrayItem('socialLinks', index, 'color', event.target.value)} />
                                    <a className="tools-row-action" href={social.url || '#'} target="_blank" rel="noopener noreferrer" title="فتح الحساب">
                                        <i className="fa-solid fa-up-right-from-square"></i>
                                    </a>
                                    <button type="button" className="danger" onClick={() => removeArrayItem('socialLinks', index)} title="حذف الحساب">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-screwdriver-wrench"></i> إعدادات الأداة</div>
                </footer>
            </main>

            {selectedPage && (
                <div className="legacy-modal-backdrop" onClick={closePageModal}>
                    <div className="legacy-modal-card tools-page-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{selectedPageTitle}</h3>
                                <p>/{selectedPageSlug}</p>
                            </div>
                            <button type="button" onClick={closePageModal} aria-label="إغلاق النافذة">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {isPageModalEditing ? (
                            <div className="legacy-field">
                                <label>محتوى الصفحة</label>
                                <PageHtmlEditor
                                    value={selectedPageContent}
                                    onChange={(content) => updatePageContent(selectedPageSlug, content)}
                                />
                                <span className="legacy-field-hint">يمكنك لصق نص منسق من Google Docs أو محرر نصوص، وسيتم تنظيف HTML تلقائيًا قبل الحفظ.</span>
                            </div>
                        ) : (
                            <div className="tools-page-preview">
                                {selectedPageContent ? (
                                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPageContent) }} />
                                ) : (
                                    <p>لا يوجد محتوى لهذه الصفحة بعد.</p>
                                )}
                            </div>
                        )}

                        <div className="legacy-modal-actions">
                            <a href={`/${selectedPageSlug}`} target="_blank" rel="noopener noreferrer" className="legacy-secondary-btn">
                                <i className="fa-solid fa-up-right-from-square"></i>
                                فتح الصفحة
                            </a>
                            <button type="button" className="legacy-secondary-btn" onClick={() => setIsPageModalEditing((current) => !current)}>
                                <i className={isPageModalEditing ? 'fa-solid fa-eye' : 'fa-solid fa-pen-to-square'}></i>
                                {isPageModalEditing ? 'معاينة' : 'تعديل'}
                            </button>
                            <button type="button" className="legacy-primary-btn" onClick={saveTools} disabled={saving}>
                                <i className="fa-solid fa-floppy-disk"></i>
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
