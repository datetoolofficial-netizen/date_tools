'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import '../AdminDashboard.css';

const AD_SLOTS = [
    { id: 'top', label: 'إعلان أعلى الصفحة', hint: 'تحت خانة اليوم مباشرة' },
    { id: 'middle', label: 'الإعلان المميز', hint: 'منتصف الصفحة قبل الأدوات' },
    { id: 'bottom1', label: 'إعلان أسفل الصفحة 1', hint: 'أسفل الصفحة - الموضع الأول' },
    { id: 'bottom2', label: 'إعلان أسفل الصفحة 2', hint: 'أسفل الصفحة - الموضع الثاني' },
];

const EMPTY_SLOT = {
    client: '',
    slot: '',
    format: 'auto',
    fullWidthResponsive: true,
    enabledWhenNoAdvertiser: false,
    htmlSnippet: '',
};

const EMPTY_INTEGRATIONS = {
    googleAdsenseClient: '',
    adsenseSnippet: '',
    adsTxtSnippet: '',
};

function parseAdsenseSnippet(snippet = '') {
    const text = String(snippet || '');
    const client = text.match(/data-ad-client=["']([^"']+)["']|client=([^"'\s&]+)/i);
    const slot = text.match(/data-ad-slot=["']([^"']+)["']/i);
    const format = text.match(/data-ad-format=["']([^"']+)["']/i);
    const responsive = text.match(/data-full-width-responsive=["']([^"']+)["']/i);

    return {
        client: (client?.[1] || client?.[2] || '').trim(),
        slot: (slot?.[1] || '').trim(),
        format: (format?.[1] || 'auto').trim() || 'auto',
        fullWidthResponsive: String(responsive?.[1] || 'true').toLowerCase() !== 'false',
    };
}

function pickAdSettings(config = {}) {
    const googleAdSlots = AD_SLOTS.reduce((slots, item) => {
        slots[item.id] = {
            ...EMPTY_SLOT,
            ...(config.googleAdSlots?.[item.id] || {}),
        };
        return slots;
    }, {});

    return {
        googleAdSlots,
        externalIntegrations: {
            ...EMPTY_INTEGRATIONS,
            ...(config.externalIntegrations || {}),
        },
    };
}

function AdminNav({ active = 'ad-settings' }) {
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

export default function AdminAdSettingsPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(pickAdSettings());
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdSettings() {
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
                        setSettings(pickAdSettings(await getSiteConfig()));
                    } catch (error) {
                        console.error('Error loading ad settings:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة إعدادات الإعلانات.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading ad settings modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات إعدادات الإعلانات.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadAdSettings();

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

    const updateSlot = (slotId, field, value) => {
        setSettings((current) => ({
            ...current,
            googleAdSlots: {
                ...current.googleAdSlots,
                [slotId]: {
                    ...current.googleAdSlots[slotId],
                    [field]: value,
                },
            },
        }));
    };

    const updateSnippet = (slotId, snippet) => {
        const parsed = parseAdsenseSnippet(snippet);
        setSettings((current) => ({
            ...current,
            googleAdSlots: {
                ...current.googleAdSlots,
                [slotId]: {
                    ...current.googleAdSlots[slotId],
                    htmlSnippet: snippet,
                    ...(parsed.client ? { client: parsed.client } : {}),
                    ...(parsed.slot ? { slot: parsed.slot } : {}),
                    format: parsed.format,
                    fullWidthResponsive: parsed.fullWidthResponsive,
                },
            },
        }));
    };

    const updateIntegration = (field, value) => {
        setSettings((current) => ({
            ...current,
            externalIntegrations: {
                ...current.externalIntegrations,
                [field]: value,
            },
        }));
    };

    const applyAdsenseSnippet = (snippet) => {
        const parsed = parseAdsenseSnippet(snippet);
        setSettings((current) => ({
            ...current,
            externalIntegrations: {
                ...current.externalIntegrations,
                adsenseSnippet: snippet,
                ...(parsed.client ? { googleAdsenseClient: parsed.client } : {}),
            },
        }));
    };

    const saveAdSettings = async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        setSaving(true);
        showMessage('info', 'جاري حفظ إعدادات الإعلانات...');

        try {
            const patch = {
                googleAdSlots: settings.googleAdSlots,
                externalIntegrations: settings.externalIntegrations,
            };
            const savedPatch = await firebaseApi.saveSiteConfigSection(patch);
            setSettings(pickAdSettings(savedPatch));
            showMessage('success', 'تم حفظ إعدادات مواضع الإعلانات بنجاح.');
        } catch (error) {
            console.error('Error saving ad settings:', error);
            showMessage('error', 'تعذر حفظ إعدادات الإعلانات. تحقق من صلاحيات المدير.');
        } finally {
            setSaving(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-rectangle-ad fa-beat-fade"></i>
                <h3>جاري فتح إدارة الإعلانات...</h3>
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
                <AdminNav active="ad-settings" />
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

                <section className="legacy-ads-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-rectangle-ad"></i>
                            إدارة الإعلانات
                        </h1>
                        <p>إعدادات مواضع العرض وGoogle AdSense وAds.txt مستقلة عن جدول الحملات.</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={saveAdSettings} disabled={saving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                    </button>
                </section>

                <section className="legacy-table-card ad-settings-table-card">
                    <table className="legacy-ads-table ad-settings-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>موضع الإعلان</th>
                                <th>تفعيل Google عند عدم وجود معلنين</th>
                                <th>إعدادات كود Google</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AD_SLOTS.map((slotItem, index) => {
                                const slot = settings.googleAdSlots[slotItem.id] || EMPTY_SLOT;

                                return (
                                    <tr key={slotItem.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{slotItem.label}</strong>
                                            <small>{slotItem.hint}</small>
                                        </td>
                                        <td>
                                            <label className="legacy-check-row compact-check">
                                                <input
                                                    type="checkbox"
                                                    checked={slot.enabledWhenNoAdvertiser}
                                                    onChange={(event) => updateSlot(slotItem.id, 'enabledWhenNoAdvertiser', event.target.checked)}
                                                />
                                                <span>يعرض Google عند غياب إعلان معلن نشط لهذا الموضع</span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="ad-slot-settings-grid">
                                                <input
                                                    type="text"
                                                    dir="ltr"
                                                    value={slot.client || ''}
                                                    onChange={(event) => updateSlot(slotItem.id, 'client', event.target.value)}
                                                    placeholder="ca-pub-0000000000000000"
                                                />
                                                <input
                                                    type="text"
                                                    dir="ltr"
                                                    value={slot.slot || ''}
                                                    onChange={(event) => updateSlot(slotItem.id, 'slot', event.target.value)}
                                                    placeholder="Ad Slot"
                                                />
                                                <select
                                                    value={slot.format || 'auto'}
                                                    onChange={(event) => updateSlot(slotItem.id, 'format', event.target.value)}
                                                >
                                                    <option value="auto">auto</option>
                                                    <option value="horizontal">horizontal</option>
                                                    <option value="rectangle">rectangle</option>
                                                    <option value="vertical">vertical</option>
                                                </select>
                                                <label className="legacy-check-row compact-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={slot.fullWidthResponsive !== false}
                                                        onChange={(event) => updateSlot(slotItem.id, 'fullWidthResponsive', event.target.checked)}
                                                    />
                                                    <span>full-width responsive</span>
                                                </label>
                                                <textarea
                                                    dir="ltr"
                                                    rows={4}
                                                    value={slot.htmlSnippet || ''}
                                                    onChange={(event) => updateSnippet(slotItem.id, event.target.value)}
                                                    placeholder="الصق كود وحدة الإعلان من Google هنا لاستخراج Publisher و Ad Slot تلقائيًا"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                <section className="legacy-google-card ad-integrations-card">
                    <div className="legacy-page-heading">
                        <div>
                            <h2 className="legacy-section-title">
                                <i className="fa-solid fa-code"></i>
                                مقتطفات AdSense و Ads.txt
                            </h2>
                            <p>هذه الإعدادات خاصة بالتعريف العام والتحقق، ولا تضيف حملات ولا تعدل جدول الحملات.</p>
                        </div>
                    </div>

                    <div className="legacy-form-grid">
                        <div className="legacy-field">
                            <label>Google AdSense publisher ID</label>
                            <input
                                type="text"
                                dir="ltr"
                                value={settings.externalIntegrations.googleAdsenseClient || ''}
                                onChange={(event) => updateIntegration('googleAdsenseClient', event.target.value)}
                                placeholder="ca-pub-0000000000000000"
                            />
                        </div>
                        <div className="legacy-field">
                            <label>رابط ملف Ads.txt الحالي</label>
                            <input type="text" dir="ltr" value="https://date-tool.com/ads.txt" readOnly />
                        </div>
                        <div className="legacy-field full-span">
                            <label>مقتطف رمز AdSense</label>
                            <textarea
                                dir="ltr"
                                rows={6}
                                value={settings.externalIntegrations.adsenseSnippet || ''}
                                onChange={(event) => applyAdsenseSnippet(event.target.value)}
                                placeholder="<script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-...&quot; crossorigin=&quot;anonymous&quot;></script>"
                            />
                            <span className="legacy-field-hint">لأسباب أمنية لا ننفذ JavaScript الخام من قاعدة البيانات، بل نستخرج منه القيم المنظمة ونستخدمها بأمان.</span>
                        </div>
                        <div className="legacy-field full-span">
                            <label>مقتطف Ads.txt</label>
                            <textarea
                                dir="ltr"
                                rows={5}
                                value={settings.externalIntegrations.adsTxtSnippet || ''}
                                onChange={(event) => updateIntegration('adsTxtSnippet', event.target.value)}
                                placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                            />
                            <span className="legacy-field-hint">سيظهر هذا المحتوى في `/ads.txt` بعد الحفظ والنشر الحالي يدعم قراءته مباشرة من قاعدة البيانات.</span>
                        </div>
                    </div>
                </section>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-rectangle-ad"></i> إدارة الإعلانات</div>
                </footer>
            </main>
        </div>
    );
}
