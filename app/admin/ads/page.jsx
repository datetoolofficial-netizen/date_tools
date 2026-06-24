'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import '../AdminDashboard.css';

const EMPTY_AD = {
    name: '',
    slot: 'top',
    startAt: '',
    endAt: '',
    googleDriveUrl: '',
    targetUrl: '',
    status: 'draft',
    notes: ''
};

const AD_SLOTS = [
    { value: 'top', label: 'إعلان أعلى الصفحة' },
    { value: 'middle', label: 'الإعلان المميز' },
    { value: 'bottom1', label: 'إعلان أسفل الصفحة 1' },
    { value: 'bottom2', label: 'إعلان أسفل الصفحة 2' }
];

const STATUS_OPTIONS = [
    { value: 'draft', label: 'مسودة' },
    { value: 'active', label: 'نشط' },
    { value: 'paused', label: 'متوقف' },
    { value: 'ended', label: 'منتهي' }
];

function getSlotLabel(slot) {
    return AD_SLOTS.find((item) => item.value === slot)?.label || slot || '-';
}

function getCampaignRuntimeStatus(ad) {
    const now = Date.now();
    const start = ad?.startAt ? new Date(ad.startAt).getTime() : null;
    const end = ad?.endAt ? new Date(ad.endAt).getTime() : null;

    if (ad?.status === 'paused') return 'متوقف يدويًا';
    if (ad?.status === 'draft') return 'مسودة';
    if (end && end < now) return 'منتهي';
    if (start && start > now) return 'مجدول';
    return 'يعرض الآن';
}

function formatDateTime(value) {
    if (!value) return '-';

    try {
        return new Intl.DateTimeFormat('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function AdminNav({ active = 'ads' }) {
    return (
        <ul className="legacy-nav-links">
            <li>
                <Link href="/admin" className={active === 'home' ? 'active' : ''}>
                    <i className="fa-solid fa-house"></i>
                    <span className="nav-text">الرئيسية</span>
                </Link>
            </li>
            <li>
                <Link href="/admin/ads" className={active === 'ads' ? 'active' : ''}>
                    <i className="fa-solid fa-bullhorn"></i>
                    <span className="nav-text">إدارة الإعلانات</span>
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

export default function AdminAdsPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [config, setConfig] = useState(null);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filters, setFilters] = useState({ search: '', slot: 'all', status: 'all' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [adForm, setAdForm] = useState(EMPTY_AD);
    const firebaseApiRef = useRef(null);

    const campaigns = useMemo(() => config?.adCampaigns || [], [config?.adCampaigns]);
    const googleTopSlot = config?.googleAdSlots?.top || {};

    const filteredCampaigns = useMemo(() => {
        return campaigns
            .map((ad, index) => ({ ...ad, originalIndex: index }))
            .filter((ad) => {
                const search = filters.search.trim().toLowerCase();
                const matchesSearch = !search || [ad.name, ad.googleDriveUrl, ad.targetUrl, ad.notes]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(search));
                const matchesSlot = filters.slot === 'all' || ad.slot === filters.slot;
                const matchesStatus = filters.status === 'all' || ad.status === filters.status;

                return matchesSearch && matchesSlot && matchesStatus;
            });
    }, [campaigns, filters]);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminAds() {
            try {
                const [{ auth, getAdminProfile, getSiteConfig, saveSiteConfigSection }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/auth')
                ]);

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut, saveSiteConfigSection };

                if (document.body.classList.contains('dark-mode')) setIsDarkMode(true);

                const savedSidebar = window.localStorage.getItem('admin_sidebar_collapsed');
                if (savedSidebar === 'true') setIsSidebarCollapsed(true);

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

                        const siteConfig = await getSiteConfig();

                        if (!isMounted) return;

                        setAdminName(adminProfile.name || adminProfile.email || 'أيها المدير');
                        setAdminRole(adminProfile.role === 'super_admin' ? 'المدير العام' : 'مدير');
                        setConfig(siteConfig);
                    } catch (error) {
                        console.error('Error loading ads admin page:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة إعدادات الإعلانات.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading Firebase ads modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات إدارة الإعلانات.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadAdminAds();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        window.setTimeout(() => setMessage(null), 4500);
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

    const updateGoogleTopSlot = (field, value) => {
        setConfig((current) => ({
            ...current,
            googleAdSlots: {
                ...(current?.googleAdSlots || {}),
                top: {
                    ...(current?.googleAdSlots?.top || {}),
                    [field]: value
                }
            }
        }));
    };

    const openAdModal = (index = null) => {
        setEditingIndex(index);
        setAdForm(index === null ? EMPTY_AD : { ...EMPTY_AD, ...(campaigns[index] || {}) });
        setIsModalOpen(true);
    };

    const closeAdModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
        setAdForm(EMPTY_AD);
    };

    const saveAdLocally = () => {
        if (!adForm.name.trim()) {
            showMessage('error', 'اكتب اسم الإعلان أولًا.');
            return;
        }

        if (adForm.startAt && adForm.endAt && new Date(adForm.startAt).getTime() > new Date(adForm.endAt).getTime()) {
            showMessage('error', 'تاريخ بداية الإعلان يجب أن يكون قبل تاريخ النهاية.');
            return;
        }

        const cleanAd = {
            ...adForm,
            name: adForm.name.trim(),
            googleDriveUrl: adForm.googleDriveUrl.trim(),
            targetUrl: adForm.targetUrl.trim(),
            notes: adForm.notes.trim()
        };

        setConfig((current) => {
            const nextCampaigns = [...(current?.adCampaigns || [])];
            if (editingIndex === null) nextCampaigns.unshift(cleanAd);
            else nextCampaigns[editingIndex] = cleanAd;
            return { ...current, adCampaigns: nextCampaigns };
        });

        closeAdModal();
        showMessage('success', 'تم تجهيز الإعلان محليًا. اضغط حفظ الإعلانات لتثبيته.');
    };

    const removeCampaign = (index) => {
        setConfig((current) => ({
            ...current,
            adCampaigns: (current?.adCampaigns || []).filter((_, itemIndex) => itemIndex !== index)
        }));
        showMessage('success', 'تم حذف الإعلان محليًا. اضغط حفظ الإعلانات لتثبيت الحذف.');
    };

    const saveAdsSection = async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.saveSiteConfigSection || !config) return;

        setIsSaving(true);
        try {
            await firebaseApi.saveSiteConfigSection({
                googleAdSlots: config.googleAdSlots || {},
                adCampaigns: config.adCampaigns || []
            });
            showMessage('success', 'تم حفظ إعدادات الإعلانات بنجاح.');
        } catch (error) {
            console.error('Error saving ads section:', error);
            showMessage('error', 'تعذر حفظ إعدادات الإعلانات. تحقق من صلاحيات المدير.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-satellite-dish fa-beat-fade"></i>
                <h3>جاري فتح إدارة الإعلانات...</h3>
            </div>
        );
    }

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    return (
        <div className={`legacy-admin-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} dir="rtl">
            <div
                className={`legacy-sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsMobileSidebarOpen(false)}
            ></div>

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

                <AdminNav active="ads" />
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

                {message && (
                    <div className={`legacy-inline-message ${message.type}`}>
                        <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                        {message.text}
                    </div>
                )}

                <section className="legacy-welcome-banner">
                    <div className="welcome-text">
                        <h1>إدارة الإعلانات</h1>
                        <p>صفحة مخصصة للحملات وموضع Google العلوي، بنفس روح لوحة الإعلانات القديمة ومرتبطة بإعدادات الموقع الحالية.</p>
                    </div>
                    <i className="fa-solid fa-rectangle-ad"></i>
                </section>

                <section className="legacy-dashboard-section">
                    <div className="legacy-page-heading">
                        <div>
                            <h3 className="legacy-section-title">
                                <i className="fa-solid fa-list-check"></i>
                                الحملات الإعلانية
                            </h3>
                            <p>أضف إعلانًا، حدد موضعه وفترته، ثم احفظ القسم ليظهر ضمن إعدادات الموقع.</p>
                        </div>
                        <button className="legacy-primary-btn" onClick={() => openAdModal()}>
                            <i className="fa-solid fa-plus"></i>
                            إضافة إعلان
                        </button>
                    </div>

                    <div className="legacy-filter-bar">
                        <div className="legacy-field compact">
                            <label>بحث</label>
                            <input
                                value={filters.search}
                                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                                placeholder="اسم الإعلان أو الرابط"
                            />
                        </div>
                        <div className="legacy-field compact">
                            <label>الموضع</label>
                            <select value={filters.slot} onChange={(event) => setFilters((current) => ({ ...current, slot: event.target.value }))}>
                                <option value="all">كل المواضع</option>
                                {AD_SLOTS.map((slot) => (
                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="legacy-field compact">
                            <label>الحالة</label>
                            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                                <option value="all">كل الحالات</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="legacy-table-card">
                        <table className="legacy-ads-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>اسم الإعلان</th>
                                    <th>الموضع</th>
                                    <th>الفترة</th>
                                    <th>الحالة</th>
                                    <th>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCampaigns.length ? filteredCampaigns.map((ad, index) => (
                                    <tr key={`${ad.name}-${ad.originalIndex}`}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{ad.name || '-'}</strong>
                                            <small>{ad.targetUrl || ad.googleDriveUrl || 'لا يوجد رابط'}</small>
                                        </td>
                                        <td>{getSlotLabel(ad.slot)}</td>
                                        <td>
                                            <span>{formatDateTime(ad.startAt)}</span>
                                            <small>{formatDateTime(ad.endAt)}</small>
                                        </td>
                                        <td>
                                            <span className={`legacy-status-pill ${ad.status || 'draft'}`}>
                                                {getCampaignRuntimeStatus(ad)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="legacy-row-actions">
                                                <button onClick={() => openAdModal(ad.originalIndex)} aria-label="تعديل الإعلان">
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button className="danger" onClick={() => removeCampaign(ad.originalIndex)} aria-label="حذف الإعلان">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="legacy-empty-table">
                                            لا توجد إعلانات مطابقة. ابدأ بإضافة إعلان جديد.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="legacy-dashboard-section">
                    <h3 className="legacy-section-title">
                        <i className="fa-brands fa-google"></i>
                        إعلان Google العلوي
                    </h3>
                    <div className="legacy-google-card">
                        <p>هذا الموضع يستخدم إعدادات Google الحالية للإعلان أعلى الصفحة. لا نلصق JavaScript خام هنا حفاظًا على الأمان.</p>
                        <div className="legacy-form-grid">
                            <div className="legacy-field">
                                <label>Publisher / Client ID</label>
                                <input
                                    value={googleTopSlot.client || ''}
                                    onChange={(event) => updateGoogleTopSlot('client', event.target.value)}
                                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                                />
                            </div>
                            <div className="legacy-field">
                                <label>Ad Slot</label>
                                <input
                                    value={googleTopSlot.slot || ''}
                                    onChange={(event) => updateGoogleTopSlot('slot', event.target.value)}
                                    placeholder="7882868833"
                                />
                            </div>
                            <div className="legacy-field">
                                <label>Ad Format</label>
                                <select
                                    value={googleTopSlot.format || 'auto'}
                                    onChange={(event) => updateGoogleTopSlot('format', event.target.value)}
                                >
                                    <option value="auto">auto</option>
                                    <option value="rectangle">rectangle</option>
                                    <option value="horizontal">horizontal</option>
                                    <option value="vertical">vertical</option>
                                </select>
                            </div>
                            <label className="legacy-check-row">
                                <input
                                    type="checkbox"
                                    checked={googleTopSlot.fullWidthResponsive !== false}
                                    onChange={(event) => updateGoogleTopSlot('fullWidthResponsive', event.target.checked)}
                                />
                                إعلان متجاوب بكامل العرض
                            </label>
                        </div>
                    </div>
                </section>

                <div className="legacy-sticky-save">
                    <button className="legacy-primary-btn wide" onClick={saveAdsSection} disabled={isSaving}>
                        <i className={`fa-solid ${isSaving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
                        {isSaving ? 'جاري الحفظ...' : 'حفظ الإعلانات'}
                    </button>
                </div>

                <footer className="legacy-admin-footer">
                    <div>
                        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong>
                    </div>
                    <div className="legacy-version-badge">
                        <i className="fa-solid fa-bullhorn"></i> إدارة الإعلانات
                    </div>
                </footer>
            </main>

            {isModalOpen && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card">
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{editingIndex === null ? 'إضافة إعلان' : 'تعديل إعلان'}</h3>
                                <p>الحجم المقترح للبانر العلوي 970x250 أو نسخة متجاوبة واضحة وخفيفة.</p>
                            </div>
                            <button onClick={closeAdModal} aria-label="إغلاق">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="legacy-form-grid">
                            <div className="legacy-field">
                                <label>اسم الإعلان</label>
                                <input value={adForm.name} onChange={(event) => setAdForm((current) => ({ ...current, name: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>موضع الإعلان</label>
                                <select value={adForm.slot} onChange={(event) => setAdForm((current) => ({ ...current, slot: event.target.value }))}>
                                    {AD_SLOTS.map((slot) => (
                                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="legacy-field">
                                <label>بداية الإعلان</label>
                                <input type="datetime-local" value={adForm.startAt} onChange={(event) => setAdForm((current) => ({ ...current, startAt: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>نهاية الإعلان</label>
                                <input type="datetime-local" value={adForm.endAt} onChange={(event) => setAdForm((current) => ({ ...current, endAt: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>رابط ملف الإعلان من Google Drive</label>
                                <input value={adForm.googleDriveUrl} onChange={(event) => setAdForm((current) => ({ ...current, googleDriveUrl: event.target.value }))} placeholder="https://drive.google.com/..." />
                            </div>
                            <div className="legacy-field">
                                <label>رابط انتقال العميل</label>
                                <input value={adForm.targetUrl} onChange={(event) => setAdForm((current) => ({ ...current, targetUrl: event.target.value }))} placeholder="https://example.com" />
                            </div>
                            <div className="legacy-field">
                                <label>الحالة</label>
                                <select value={adForm.status} onChange={(event) => setAdForm((current) => ({ ...current, status: event.target.value }))}>
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="legacy-field">
                                <label>ملاحظات</label>
                                <textarea value={adForm.notes} onChange={(event) => setAdForm((current) => ({ ...current, notes: event.target.value }))} rows="4" />
                            </div>
                        </div>

                        <div className="legacy-ad-preview">
                            <i className="fa-solid fa-image"></i>
                            <div>
                                <strong>معاينة الإعلان</strong>
                                <span>{adForm.googleDriveUrl ? 'تم إدخال رابط الملف. تأكد أن الملف قابل للعرض للعميل.' : 'ستظهر المعاينة الفعلية بعد ربط عرض الملفات لاحقًا.'}</span>
                            </div>
                        </div>

                        <div className="legacy-modal-actions">
                            <button className="legacy-secondary-btn" onClick={closeAdModal}>إلغاء</button>
                            <button className="legacy-primary-btn" onClick={saveAdLocally}>
                                <i className="fa-solid fa-check"></i>
                                حفظ الإعلان
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
