'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import '../AdminDashboard.css';

const MAX_MEDIA_FILE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_MEDIA_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'ico']);
const SUPPORTED_MEDIA_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'application/octet-stream',
    '',
]);

const IDENTITY_FIELDS = [
    'toolDisplayName',
    'toolSlogan',
    'contactEmail',
    'hasLogo',
    'logoUrl',
    'faviconUrl',
    'copyrightName',
    'copyrightText',
];

const EMPTY_IDENTITY = {
    toolDisplayName: '',
    toolSlogan: '',
    contactEmail: '',
    hasLogo: false,
    logoUrl: '',
    faviconUrl: '',
    copyrightName: '',
    copyrightText: '',
};

function pickIdentity(config = {}) {
    return IDENTITY_FIELDS.reduce((patch, field) => {
        patch[field] = field === 'hasLogo' ? Boolean(config[field]) : (config[field] || '');
        return patch;
    }, {});
}

function AdminNav({ active = 'identity' }) {
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
                <Link href="/admin/ads" className={active === 'ads' ? 'active' : ''}>
                    <i className="fa-solid fa-bullhorn"></i>
                    <span className="nav-text">إدارة الإعلانات</span>
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

export default function AdminIdentityPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [identity, setIdentity] = useState(EMPTY_IDENTITY);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadingTarget, setUploadingTarget] = useState('');
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadIdentityPage() {
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

                        const siteConfig = await getSiteConfig();
                        setIdentity({ ...EMPTY_IDENTITY, ...pickIdentity(siteConfig) });
                    } catch (error) {
                        console.error('Error loading identity page:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة بيانات الهوية البصرية.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading Firebase identity modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات إدارة الهوية.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadIdentityPage();

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

    const setField = (field, value) => {
        setIdentity((current) => ({ ...current, [field]: value }));
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

    const validateMediaFileBeforeUpload = (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        if (file.size <= 0 || file.size > MAX_MEDIA_FILE_BYTES) return 'invalid_file_size';
        if (!SUPPORTED_MEDIA_EXTENSIONS.has(extension)) return 'unsupported_image_type';
        if (file.type && !SUPPORTED_MEDIA_TYPES.has(file.type)) return 'unsupported_image_type';

        return '';
    };

    const getUploadMessage = (errorCode, label) => {
        const messages = {
            not_authenticated: 'انتهت جلسة الدخول. سجّل الدخول مرة أخرى ثم أعد المحاولة.',
            unauthorized: 'لا تملك صلاحية رفع الصور. تأكد من أن حسابك الإداري مفعّل.',
            media_storage_not_configured: 'تخزين الصور غير مفعل أو غير مربوط باسم MEDIA_BUCKET.',
            invalid_category: 'نوع مساحة الرفع غير معروف.',
            missing_file: 'لم يتم اختيار ملف للرفع.',
            invalid_file_size: 'حجم الصورة غير مقبول. الحد الأقصى 5MB.',
            unsupported_image_type: 'نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP أو GIF أو ICO. لا يتم قبول SVG لأسباب أمنية.',
            upload_failed: 'تعذر رفع الصورة بسبب خطأ غير متوقع.',
        };

        return messages[errorCode] || `تعذر رفع ${label}.`;
    };

    const uploadMediaFile = async (file, category) => {
        const currentUser = firebaseApiRef.current?.auth?.currentUser;
        if (!currentUser) throw new Error('not_authenticated');

        const token = await currentUser.getIdToken();
        const formData = new FormData();
        formData.append('category', category);
        formData.append('file', file);

        const response = await fetch('/api/media/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) throw new Error(result.error || 'upload_failed');

        return result.url;
    };

    const handleMediaUpload = async (event, category, field, label) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        const validationError = validateMediaFileBeforeUpload(file);
        if (validationError) {
            showMessage('error', getUploadMessage(validationError, label));
            return;
        }

        setUploadingTarget(field);
        showMessage('success', `جاري رفع ${label} إلى R2...`);

        try {
            const url = await uploadMediaFile(file, category);
            setIdentity((current) => ({
                ...current,
                [field]: url,
                ...(field === 'logoUrl' ? { hasLogo: true } : {}),
            }));
            showMessage('success', `تم رفع ${label}. اضغط حفظ الهوية لتثبيت الرابط.`);
        } catch (error) {
            console.error('Identity media upload error:', error);
            showMessage('error', getUploadMessage(error.message, label));
        } finally {
            setUploadingTarget('');
        }
    };

    const saveIdentity = async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        setSaving(true);
        showMessage('success', 'جاري حفظ الهوية البصرية...');

        try {
            const patch = pickIdentity(identity);
            const savedPatch = await firebaseApi.saveSiteConfigSection(patch);
            setIdentity((current) => ({ ...current, ...pickIdentity(savedPatch) }));
            showMessage('success', 'تم حفظ الهوية البصرية بنجاح.');
        } catch (error) {
            console.error('Error saving identity:', error);
            showMessage('error', 'تعذر حفظ الهوية. تحقق من صلاحيات المدير.');
        } finally {
            setSaving(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-palette fa-beat-fade"></i>
                <h3>جاري فتح إدارة الهوية...</h3>
            </div>
        );
    }

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    const copyrightPreview = `© ${new Date().getFullYear()} ${identity.copyrightText || 'جميع الحقوق محفوظة'}${identity.copyrightName ? ` لـ ${identity.copyrightName}` : ''}`;

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
                <AdminNav active="identity" />
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

                <section className="legacy-ads-hero legacy-identity-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-palette"></i>
                            إدارة الهوية البصرية
                        </h1>
                        <p>اسم الأداة، الشعار، أيقونة المتصفح، وحقوق الموقع بنفس أسلوب الإدارة القديمة</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={saveIdentity} disabled={saving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {saving ? 'جاري الحفظ...' : 'حفظ الهوية'}
                    </button>
                </section>

                <section className="legacy-identity-layout">
                    <div className="legacy-google-card legacy-identity-card">
                        <div className="legacy-page-heading">
                            <div>
                                <h2 className="legacy-section-title">
                                    <i className="fa-solid fa-fingerprint"></i>
                                    بيانات العلامة
                                </h2>
                                <p>هذا القسم يحفظ حقول الهوية فقط، ولا يغيّر إعدادات الإعلانات أو الصفحات.</p>
                            </div>
                        </div>

                        <div className="legacy-form-grid">
                            <div className="legacy-field">
                                <label>عنوان الأداة</label>
                                <input
                                    type="text"
                                    value={identity.toolDisplayName}
                                    onChange={(event) => setField('toolDisplayName', event.target.value)}
                                    placeholder="مثال: أدوات التاريخ الشاملة"
                                />
                            </div>

                            <div className="legacy-field">
                                <label>الوصف القصير</label>
                                <input
                                    type="text"
                                    value={identity.toolSlogan}
                                    onChange={(event) => setField('toolSlogan', event.target.value)}
                                    placeholder="مثال: احسب عمرك وحول التواريخ بدقة"
                                />
                            </div>

                            <div className="legacy-field">
                                <label>إيميل التواصل</label>
                                <input
                                    type="email"
                                    dir="ltr"
                                    value={identity.contactEmail}
                                    onChange={(event) => setField('contactEmail', event.target.value)}
                                    placeholder="contact@example.com"
                                />
                                <span className="legacy-field-hint">يستخدم أيضًا كقيمة لمتغير صفحات قاعدة البيانات: {'{{contactEmail}}'}</span>
                            </div>

                            <div className="legacy-field">
                                <label>إظهار اللوقو</label>
                                <label className="legacy-switch-row">
                                    <input
                                        type="checkbox"
                                        checked={identity.hasLogo}
                                        onChange={(event) => setField('hasLogo', event.target.checked)}
                                    />
                                    <span>إظهار أو إخفاء اللوقو فقط بدون إخفاء اسم الأداة</span>
                                </label>
                            </div>

                            <div className="legacy-field">
                                <label>رابط اللوقو</label>
                                <label className={`legacy-media-picker ${uploadingTarget === 'logoUrl' ? 'is-uploading' : ''}`}>
                                    <span className="legacy-media-picker-preview">
                                        {identity.logoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={identity.logoUrl} alt="معاينة اللوقو" />
                                        ) : (
                                            <i className="fa-regular fa-image"></i>
                                        )}
                                    </span>
                                    <span className="legacy-media-picker-text">
                                        <strong>{uploadingTarget === 'logoUrl' ? 'جاري رفع اللوقو...' : 'اختر أو استبدل اللوقو'}</strong>
                                        <small dir="ltr">{identity.logoUrl || '/api/media/logo/...'}</small>
                                    </span>
                                    <span className="legacy-media-picker-action">
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </span>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp,.gif,.ico,image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
                                        disabled={uploadingTarget === 'logoUrl'}
                                        onChange={(event) => handleMediaUpload(event, 'logo', 'logoUrl', 'اللوقو')}
                                    />
                                </label>
                                <span className="legacy-field-hint">يفضل لوقو PNG أو WEBP بخلفية شفافة.</span>
                            </div>

                            <div className="legacy-field">
                                <label>رابط أيقونة المتصفح favicon</label>
                                <label className={`legacy-media-picker ${uploadingTarget === 'faviconUrl' ? 'is-uploading' : ''}`}>
                                    <span className="legacy-media-picker-preview small">
                                        {identity.faviconUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={identity.faviconUrl} alt="معاينة favicon" />
                                        ) : (
                                            <i className="fa-regular fa-image"></i>
                                        )}
                                    </span>
                                    <span className="legacy-media-picker-text">
                                        <strong>{uploadingTarget === 'faviconUrl' ? 'جاري رفع الأيقونة...' : 'اختر أو استبدل أيقونة المتصفح'}</strong>
                                        <small dir="ltr">{identity.faviconUrl || '/api/media/favicon/...'}</small>
                                    </span>
                                    <span className="legacy-media-picker-action">
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </span>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp,.gif,.ico,image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
                                        disabled={uploadingTarget === 'faviconUrl'}
                                        onChange={(event) => handleMediaUpload(event, 'favicon', 'faviconUrl', 'أيقونة المتصفح')}
                                    />
                                </label>
                                <span className="legacy-field-hint">يدعم ICO أو PNG، والحفظ النهائي يتم بزر حفظ الهوية.</span>
                            </div>

                            <div className="legacy-field">
                                <label>صاحب الحقوق</label>
                                <input
                                    type="text"
                                    value={identity.copyrightName}
                                    onChange={(event) => setField('copyrightName', event.target.value)}
                                    placeholder="مثال: أدوات التاريخ"
                                />
                            </div>

                            <div className="legacy-field">
                                <label>نص الحقوق</label>
                                <input
                                    type="text"
                                    value={identity.copyrightText}
                                    onChange={(event) => setField('copyrightText', event.target.value)}
                                    placeholder="مثال: جميع الحقوق محفوظة"
                                />
                            </div>
                        </div>
                    </div>

                    <aside className="legacy-google-card legacy-identity-preview-card">
                        <div className="legacy-preview-top">
                            <div className="legacy-logo-preview">
                                {identity.hasLogo && identity.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={identity.logoUrl} alt="معاينة اللوقو" />
                                ) : (
                                    <i className="fa-solid fa-calendar-days"></i>
                                )}
                            </div>
                            <div>
                                <h3>{identity.toolDisplayName || 'أدوات التاريخ الشاملة'}</h3>
                                <p>{identity.toolSlogan || 'احسب عمرك وحول التواريخ بدقة'}</p>
                            </div>
                        </div>

                        <div className="legacy-preview-row">
                            <span>إيميل التواصل</span>
                            <strong dir="ltr">{identity.contactEmail || 'غير محدد'}</strong>
                        </div>

                        <div className="legacy-preview-row">
                            <span>أيقونة المتصفح</span>
                            <div className="legacy-favicon-preview">
                                {identity.faviconUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={identity.faviconUrl} alt="معاينة favicon" />
                                ) : (
                                    <i className="fa-regular fa-image"></i>
                                )}
                            </div>
                        </div>

                        <div className="legacy-rights-preview">
                            <i className="fa-regular fa-copyright"></i>
                            <span>{copyrightPreview}</span>
                        </div>
                    </aside>
                </section>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-palette"></i> إدارة الهوية</div>
                </footer>
            </main>
        </div>
    );
}
