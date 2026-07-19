'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import '../AdminDashboard.css';

const EMPTY_INTEGRATIONS = {
    googleTagId: '',
    googleTagManagerId: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
    microsoftClarityProjectId: '',
    metaPixelId: '',
};

const INTEGRATION_FIELDS = [
    {
        key: 'googleTagId',
        label: 'Google Analytics / Google tag ID',
        icon: 'fa-brands fa-google',
        placeholder: 'G-XXXXXXXXXX أو AW-XXXXXXXXXX',
        help: 'من Google Analytics افتح Admin ثم Data streams ثم اختر Web stream وانسخ Measurement ID الذي يبدأ غالبًا بـ G-. ومن Google Ads يمكن نسخ Conversion ID الذي يبدأ بـ AW-.',
    },
    {
        key: 'googleTagManagerId',
        label: 'Google Tag Manager ID',
        icon: 'fa-solid fa-tags',
        placeholder: 'GTM-XXXXXXX',
        help: 'من Google Tag Manager افتح الحاوية Container. يظهر المعرف أعلى الصفحة بجانب اسم الحاوية ويبدأ بـ GTM-. الصق المعرف فقط بدون كود السكربت.',
    },
    {
        key: 'googleSiteVerification',
        label: 'Google Search Console verification',
        icon: 'fa-solid fa-shield-halved',
        placeholder: 'رمز content من google-site-verification',
        help: 'من Search Console اختر HTML tag كطريقة تحقق، ثم انسخ قيمة content فقط من وسم meta: google-site-verification. لا تلصق وسم meta كاملًا.',
    },
    {
        key: 'bingSiteVerification',
        label: 'Bing Webmaster verification',
        icon: 'fa-brands fa-microsoft',
        placeholder: 'رمز content من msvalidate.01',
        help: 'من Bing Webmaster Tools اختر HTML meta tag، ثم انسخ قيمة content فقط من وسم msvalidate.01. لا تلصق وسم meta كاملًا.',
    },
    {
        key: 'microsoftClarityProjectId',
        label: 'Microsoft Clarity Project ID',
        icon: 'fa-solid fa-chart-simple',
        placeholder: 'مثال: abcdef1234',
        help: 'من Microsoft Clarity افتح المشروع ثم Setup. ستجد كودًا يحتوي رابط clarity.ms/tag/PROJECT_ID. انسخ PROJECT_ID فقط بعد آخر slash.',
    },
    {
        key: 'metaPixelId',
        label: 'Meta Pixel ID',
        icon: 'fa-brands fa-meta',
        placeholder: 'أرقام فقط',
        help: 'من Meta Events Manager افتح Data sources ثم اختر Pixel. انسخ Pixel ID الرقمي فقط، ولا تلصق كود Pixel كاملًا.',
    },
];

function pickIntegrations(config = {}) {
    return {
        ...EMPTY_INTEGRATIONS,
        ...(config.externalIntegrations || {}),
    };
}

function AdminNav({ active = 'integrations' }) {
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
                <Link href="/admin/pagespeed" className={active === 'pagespeed' ? 'active' : ''}>
                    <i className="fa-solid fa-gauge-high"></i>
                    <span className="nav-text">PageSpeed</span>
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
                <Link href="/admin/tool-management">
                    <i className="fa-solid fa-toolbox"></i>
                    <span className="nav-text">إدارة الأدوات</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/tools">
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

export default function AdminIntegrationsPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [integrations, setIntegrations] = useState(EMPTY_INTEGRATIONS);
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadIntegrationsPage() {
            try {
                const [{ getFirebaseAuth, getAdminProfile, getSiteConfig, saveSiteConfigSection }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();

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
                        setIntegrations(pickIntegrations(await getSiteConfig()));
                    } catch (error) {
                        console.error('Error loading integrations:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة إعدادات الربط الخارجي.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading integrations modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات الربط الخارجي.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadIntegrationsPage();

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

    const updateIntegration = (field, value) => {
        setIntegrations((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const saveIntegrations = async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        setSaving(true);
        showMessage('info', 'جاري حفظ إعدادات الربط الخارجي...');

        try {
            const savedPatch = await firebaseApi.saveSiteConfigSection({
                externalIntegrations: integrations,
            });
            setIntegrations(pickIntegrations(savedPatch));
            showMessage('success', 'تم حفظ إعدادات الربط الخارجي بنجاح.');
        } catch (error) {
            console.error('Error saving integrations:', error);
            showMessage('error', 'تعذر حفظ إعدادات الربط الخارجي. تحقق من صلاحيات المدير.');
        } finally {
            setSaving(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-plug-circle-bolt fa-beat-fade"></i>
                <h3>جاري فتح الربط الخارجي...</h3>
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
                <AdminNav active="integrations" />
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

                <section className="legacy-ads-hero legacy-integrations-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-plug-circle-bolt"></i>
                            الربط الخارجي
                        </h1>
                        <p>إدارة معرفات التحليلات والتحقق والتتبع الخارجية من مكان واحد، بدون لصق أكواد JavaScript خام.</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={saveIntegrations} disabled={saving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {saving ? 'جاري الحفظ...' : 'حفظ الربط الخارجي'}
                    </button>
                </section>

                <section className="legacy-google-card integrations-card">
                    <div className="legacy-page-heading">
                        <div>
                            <h2 className="legacy-section-title">
                                <i className="fa-solid fa-shield-halved"></i>
                                تكاملات آمنة ومنظمة
                            </h2>
                            <p>AdSense و Ads.txt موجودان في صفحة إعدادات الإعلانات. هذه الصفحة مخصصة للتحليلات، إدارة الوسوم، والتحقق من ملكية الموقع.</p>
                        </div>
                    </div>

                    <div className="legacy-form-grid integrations-grid">
                        {INTEGRATION_FIELDS.map((field) => (
                            <div className="legacy-field" key={field.key}>
                                <label className="integration-label">
                                    <span>{field.label}</span>
                                    <span className="integration-help" tabIndex={0} aria-label={field.help}>
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        <span>{field.help}</span>
                                    </span>
                                </label>
                                <div className="integration-input-wrap">
                                    <i className={field.icon}></i>
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={integrations[field.key] || ''}
                                        onChange={(event) => updateIntegration(field.key, event.target.value)}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="integrations-safe-note">
                        <i className="fa-solid fa-lock"></i>
                        <div>
                            <strong>ملاحظة أمان</strong>
                            <p>هذه الصفحة تحفظ معرفات فقط. أي مزود جديد سنضيفه لاحقًا كحقل منظم ومتحقق منه بدل السماح بلصق كود خام قد يفتح ثغرات XSS.</p>
                        </div>
                    </div>
                </section>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-plug-circle-bolt"></i> الربط الخارجي</div>
                </footer>
            </main>
        </div>
    );
}
