'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import { sanitizeHtml } from '../../sanitizeHtml';
import '../AdminDashboard.css';

const EMPTY_EVENT = {
    id: '',
    name: '',
    date: '',
    calendar: 'gregorian',
    repeat: 'once',
    icon: 'fa-star',
    color: '#3b82f6',
    active: true,
};

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
        events: Array.isArray(config.events) ? config.events : [],
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

    const addEvent = () => {
        setToolsConfig((current) => ({
            ...current,
            events: [
                ...(current.events || []),
                {
                    ...EMPTY_EVENT,
                    id: `event-${Date.now()}`,
                },
            ],
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

    const removePage = (index) => {
        setToolsConfig((current) => {
            const pages = [...(current.internalPages || [])];
            const [removedPage] = pages.splice(index, 1);
            const slug = normalizeSlug(removedPage?.slug);
            const customPages = { ...(current.customPages || {}) };
            if (slug) delete customPages[slug];

            return {
                ...current,
                internalPages: pages,
                customPages,
            };
        });

        if (pageModalIndex === index) closePageModal();
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
                    <a href="#events" className="tools-quick-card color-events">
                        <i className="fa-solid fa-calendar-star"></i>
                        <span>الأحداث</span>
                    </a>
                </div>

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

                <section className="legacy-google-card tools-section-card" id="events">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-events"><i className="fa-solid fa-calendar-star"></i></span>
                            <div>
                                <h2>الأحداث</h2>
                                <p>مواعيد تظهر في الصفحة الرئيسية مع أيقونة ولون لكل حدث.</p>
                            </div>
                        </div>
                        <button type="button" className="legacy-primary-btn" onClick={addEvent}>
                            <i className="fa-solid fa-plus"></i>
                            إضافة حدث
                        </button>
                    </div>

                    <div className="tools-list">
                        {(toolsConfig.events || []).length === 0 && (
                            <div className="tools-empty">لا توجد أحداث بعد.</div>
                        )}

                        {(toolsConfig.events || []).length > 0 && (
                            <div className="tools-table-head">
                                <span>تفعيل</span>
                                <span>أيقونة</span>
                                <span>اسم الحدث</span>
                                <span>التاريخ</span>
                                <span>التكرار</span>
                                <span>كود الأيقونة</span>
                                <span>الإجراءات</span>
                            </div>
                        )}

                        {(toolsConfig.events || []).map((eventItem, index) => (
                            <div className="tools-item-card event" key={`${eventItem.id}-${index}`}>
                                <label className="tools-mini-check icon-only" title="تفعيل الحدث">
                                    <input type="checkbox" checked={eventItem.active !== false} onChange={(event) => updateArrayItem('events', index, 'active', event.target.checked)} />
                                </label>
                                <div className="tools-event-icon" style={{ background: `${eventItem.color || '#3b82f6'}22`, color: eventItem.color || '#3b82f6' }}>
                                    <i className={`fa-solid ${eventItem.icon || 'fa-star'}`}></i>
                                </div>
                                <div className="tools-item-main">
                                    <div className="legacy-field">
                                        <label>اسم الحدث</label>
                                        <input value={eventItem.name || ''} onChange={(event) => updateArrayItem('events', index, 'name', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>التاريخ</label>
                                        <input type="date" value={eventItem.date || ''} onChange={(event) => updateArrayItem('events', index, 'date', event.target.value)} />
                                    </div>
                                    <div className="legacy-field">
                                        <label>التكرار</label>
                                        <select value={eventItem.repeat || 'once'} onChange={(event) => updateArrayItem('events', index, 'repeat', event.target.value)}>
                                            <option value="once">مرة واحدة</option>
                                            <option value="monthly">شهريًا</option>
                                            <option value="yearly">سنويًا</option>
                                        </select>
                                    </div>
                                    <div className="legacy-field">
                                        <label>الأيقونة</label>
                                        <input dir="ltr" value={eventItem.icon || ''} onChange={(event) => updateArrayItem('events', index, 'icon', event.target.value)} placeholder="fa-star" />
                                    </div>
                                </div>
                                <div className="tools-item-actions">
                                    <label className="tools-color-action" title="لون الحدث">
                                        <input className="tools-event-color" type="color" value={eventItem.color || '#3b82f6'} onChange={(event) => updateArrayItem('events', index, 'color', event.target.value)} />
                                        <span>لون</span>
                                    </label>
                                    <button type="button" className="danger" onClick={() => removeArrayItem('events', index)} title="حذف الحدث">
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
                                <textarea
                                    rows={12}
                                    value={selectedPageContent}
                                    onChange={(event) => updatePageContent(selectedPageSlug, event.target.value)}
                                    placeholder="اكتب محتوى الصفحة هنا..."
                                />
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
