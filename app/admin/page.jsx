'use client';

import { useState, useEffect, useRef } from 'react';
import Toast from '../components/Toast';
import { sanitizeHtml } from '../sanitizeHtml';
import './AdminPage.css';

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

export default function AdminPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userRole, setUserRole] = useState('مدير');
    const [savingSection, setSavingSection] = useState('');
    const [pageModalIndex, setPageModalIndex] = useState(null);
    const [isPageModalEditing, setIsPageModalEditing] = useState(false);
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminData() {
            try {
                const [{ auth, getAdminProfile, getAdminStats, getSiteConfig, saveSiteConfig }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                ]);

                if (!isMounted) return;

                firebaseApiRef.current = {
                    auth,
                    getAdminStats,
                    getSiteConfig,
                    getAdminProfile,
                    signOut,
                    saveSiteConfig,
                };

                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        window.location.replace('/admin_login');
                        return;
                    }

                    try {
                        if (document.body.classList.contains('dark-mode')) {
                            setIsDarkMode(true);
                        }

                        const adminProfile = await getAdminProfile(user.uid);

                        if (!adminProfile || adminProfile.active !== true) {
                            await signOut(auth);
                            window.location.replace('/admin_login');
                            return;
                        }

                        setUserRole(
                            adminProfile.role === 'super_admin'
                                ? 'مدير عام'
                                : adminProfile.role || 'مدير'
                        );

                        const siteConfig = await getSiteConfig();
                        setConfig(siteConfig);

                        const statsData = await getAdminStats();
                        setStats(statsData || {});
                    } catch (error) {
                        console.error('Error loading admin data:', error);
                        setConfig({ hasError: true });
                    } finally {
                        setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading Firebase admin modules:', error);
                if (isMounted) {
                    setConfig({ hasError: true });
                    setIsCheckingAuth(false);
                }
            }
        }

        loadAdminData();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const showMessage = (text, type = 'info') => {
        if (messageTimerRef.current) {
            clearTimeout(messageTimerRef.current);
        }

        setMsg({ text, type });
        messageTimerRef.current = setTimeout(() => setMsg({ text: '', type: '' }), 4500);
    };

    useEffect(() => () => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    }, []);

    const saveSection = async (sectionName = 'الإعدادات') => {
        const firebaseApi = firebaseApiRef.current;

        if (!firebaseApi?.saveSiteConfig) {
            showMessage('❌ لم تكتمل تهيئة Firebase بعد.', 'error');
            return;
        }

        const slugValidation = validatePageSlugs(config?.internalPages || []);
        if (!slugValidation.isValid) {
            showMessage(slugValidation.message, 'error');
            return;
        }

        setSavingSection(sectionName);
        showMessage(`جاري حفظ ${sectionName}...`, 'info');

        try {
            const savedConfig = await firebaseApi.saveSiteConfig(config);
            setConfig(savedConfig);
            showMessage(`✅ تم حفظ ${sectionName} بنجاح.`, 'success');
        } catch (error) {
            console.error('Error saving section:', error);
            showMessage(`❌ حدث خطأ أثناء حفظ ${sectionName}.`, 'error');
        } finally {
            setSavingSection('');
        }
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = async () => {
        const firebaseApi = firebaseApiRef.current;

        try {
            if (firebaseApi?.signOut && firebaseApi?.auth) {
                await firebaseApi.signOut(firebaseApi.auth);
            }

            window.location.replace('/admin_login');
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
        }
    };

    const uploadMediaFile = async (file, category) => {
        const firebaseApi = firebaseApiRef.current;
        const currentUser = firebaseApi?.auth?.currentUser;

        if (!currentUser) {
            throw new Error('not_authenticated');
        }

        const token = await currentUser.getIdToken();
        const formData = new FormData();
        formData.append('category', category);
        formData.append('file', file);

        const response = await fetch('/api/media/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
            throw new Error(result.error || 'upload_failed');
        }

        return result.url;
    };

    const getMediaUploadErrorMessage = (errorCode, label) => {
        const messages = {
            not_authenticated: 'انتهت جلسة الدخول. سجّل الدخول مرة أخرى ثم أعد المحاولة.',
            unauthorized: 'لا تملك صلاحية رفع الصور. تأكد من أن حسابك الإداري مفعّل.',
            media_storage_not_configured: 'تخزين الصور غير مفعل أو غير مربوط. تأكد من binding باسم MEDIA_BUCKET.',
            invalid_category: 'نوع مساحة الرفع غير معروف. حدّث الصفحة ثم أعد المحاولة.',
            missing_file: 'لم يتم اختيار ملف للرفع.',
            invalid_file_size: 'حجم الصورة غير مقبول. الحد الأقصى 5MB.',
            unsupported_image_type: 'نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP أو GIF أو ICO. لا يتم قبول SVG لأسباب أمنية.',
            upload_failed: 'تعذر رفع الصورة بسبب خطأ غير متوقع.',
        };

        return messages[errorCode] || `تعذر رفع ${label}.`;
    };

    const validateMediaFileBeforeUpload = (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        if (file.size <= 0 || file.size > MAX_MEDIA_FILE_BYTES) {
            return 'invalid_file_size';
        }

        if (!SUPPORTED_MEDIA_EXTENSIONS.has(extension)) {
            return 'unsupported_image_type';
        }

        if (file.type && !SUPPORTED_MEDIA_TYPES.has(file.type)) {
            return 'unsupported_image_type';
        }

        return '';
    };

    const handleMediaUpload = async (event, category, applyUrl, label) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        const validationError = validateMediaFileBeforeUpload(file);
        if (validationError) {
            showMessage(getMediaUploadErrorMessage(validationError, label), 'error');
            return;
        }

        showMessage(`جاري رفع ${label}...`, 'info');

        try {
            const url = await uploadMediaFile(file, category);
            applyUrl(url);
            showMessage(`✅ تم رفع ${label}. اضغط حفظ القسم لتثبيت الرابط.`, 'success');
        } catch (error) {
            console.error('Media upload error:', error);
            showMessage(getMediaUploadErrorMessage(error.message, label), 'error');
        }
    };

    const handleArrayAdd = (key, defaultObj) => {
        setConfig({
            ...config,
            [key]: [...(config[key] || []), defaultObj]
        });
    };

    const handleArrayUpdate = (key, index, field, value) => {
        const newArr = [...(config[key] || [])];
        newArr[index] = {
            ...newArr[index],
            [field]: value
        };
        setConfig({
            ...config,
            [key]: newArr
        });
    };

    const handleArrayRemove = (key, index) => {
        setConfig({
            ...config,
            [key]: (config[key] || []).filter((_, i) => i !== index)
        });
    };

    const handleAdImageChange = (slot, value) => {
        setConfig({
            ...config,
            adImages: {
                ...(config.adImages || {}),
                [slot]: value
            }
        });
    };

    const normalizeSlug = (value) => {
        return String(value || '')
            .trim()
            .replace(/^\/+/, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_ء-ي]/g, '');
    };

    const validatePageSlugs = (pages = []) => {
        const seen = new Set();

        for (const page of pages) {
            const slug = normalizeSlug(page?.slug);

            if (!slug) {
                return {
                    isValid: false,
                    message: '❌ يوجد مسار صفحة فارغ. الرجاء إدخال slug قبل الحفظ.'
                };
            }

            if (seen.has(slug)) {
                return {
                    isValid: false,
                    message: `❌ المسار "${slug}" مكرر. لا يمكن حفظ صفحتين بنفس slug.`
                };
            }

            seen.add(slug);
        }

        return { isValid: true, message: '' };
    };

    const createUniqueSlug = (baseSlug, pages = []) => {
        const usedSlugs = new Set(pages.map((page) => normalizeSlug(page?.slug)).filter(Boolean));
        const base = normalizeSlug(baseSlug) || 'page';
        let candidate = base;
        let counter = 2;

        while (usedSlugs.has(candidate)) {
            candidate = `${base}-${counter}`;
            counter += 1;
        }

        return candidate;
    };

    const handlePageAdd = () => {
        const newSlug = createUniqueSlug('page', config.internalPages || []);

        setConfig({
            ...config,
            internalPages: [
                ...(config.internalPages || []),
                {
                    title: 'صفحة جديدة',
                    slug: newSlug,
                    location: 'footer'
                }
            ],
            customPages: {
                ...(config.customPages || {}),
                [newSlug]: {
                    title: 'صفحة جديدة',
                    content: '<p>اكتب محتوى الصفحة هنا...</p>'
                }
            }
        });
    };

    const handlePageUpdate = (index, field, value) => {
        const pagesArr = [...(config.internalPages || [])];
        const oldPage = pagesArr[index] || {};
        const oldSlug = normalizeSlug(oldPage.slug);
        const customPages = { ...(config.customPages || {}) };

        const newValue = field === 'slug' ? normalizeSlug(value) : value;
        if (field === 'slug') {
            const duplicateIndex = pagesArr.findIndex((page, pageIndex) => (
                pageIndex !== index && normalizeSlug(page?.slug) === newValue
            ));

            if (newValue && duplicateIndex !== -1) {
                showMessage(`❌ المسار "${newValue}" مستخدم في صفحة أخرى.`, 'error');
                return;
            }
        }

        const updatedPage = {
            ...oldPage,
            [field]: newValue
        };

        pagesArr[index] = updatedPage;
        const newSlug = normalizeSlug(updatedPage.slug);

        if (field === 'title') {
            customPages[newSlug] = {
                ...(customPages[newSlug] || {}),
                title: newValue,
                content: customPages[newSlug]?.content || ''
            };
        }

        if (field === 'slug' && oldSlug && oldSlug !== newSlug) {
            customPages[newSlug] = {
                ...(customPages[oldSlug] || {}),
                title: updatedPage.title || customPages[oldSlug]?.title || '',
                content: customPages[oldSlug]?.content || ''
            };
            delete customPages[oldSlug];
        }

        if (newSlug && !customPages[newSlug]) {
            customPages[newSlug] = {
                title: updatedPage.title || '',
                content: ''
            };
        }

        setConfig({
            ...config,
            internalPages: pagesArr,
            customPages
        });
    };

    const handlePageContentUpdate = (slug, content) => {
        const safeSlug = normalizeSlug(slug);
        const pageTitle =
            config.customPages?.[safeSlug]?.title ||
            (config.internalPages || []).find((page) => normalizeSlug(page.slug) === safeSlug)?.title ||
            '';

        setConfig({
            ...config,
            customPages: {
                ...(config.customPages || {}),
                [safeSlug]: {
                    ...(config.customPages?.[safeSlug] || {}),
                    title: pageTitle,
                    content
                }
            }
        });
    };

    const handlePageRemove = (index) => {
        const pagesArr = [...(config.internalPages || [])];
        const pageToRemove = pagesArr[index];
        const slug = normalizeSlug(pageToRemove?.slug);

        pagesArr.splice(index, 1);

        const customPages = { ...(config.customPages || {}) };
        if (slug) {
            delete customPages[slug];
        }

        setConfig({
            ...config,
            internalPages: pagesArr,
            customPages
        });

        if (pageModalIndex === index) {
            closePageModal();
        }
    };

    const openPageModal = (index, editMode = false) => {
        setPageModalIndex(index);
        setIsPageModalEditing(editMode);
    };

    const closePageModal = () => {
        setPageModalIndex(null);
        setIsPageModalEditing(false);
    };

    const SectionSaveButton = ({ label }) => (
        <button
            type="button"
            className="section-save-btn"
            onClick={() => saveSection(label)}
            disabled={savingSection === label}
        >
            <i className={savingSection === label ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'}></i>
            {savingSection === label ? 'جاري الحفظ...' : 'حفظ القسم'}
        </button>
    );

    const selectedPage = pageModalIndex !== null ? (config?.internalPages || [])[pageModalIndex] : null;
    const selectedPageSlug = normalizeSlug(selectedPage?.slug);
    const selectedPageTitle =
        config?.customPages?.[selectedPageSlug]?.title ||
        selectedPage?.title ||
        'صفحة بدون عنوان';
    const selectedPageContent = config?.customPages?.[selectedPageSlug]?.content || '';

    if (isCheckingAuth) {
        return <div className="admin-loading">جاري التحقق من الصلاحيات... 🔒</div>;
    }

    if (!config) {
        return <div className="admin-loading">جاري تحميل بوابة الإدارة... ⏳</div>;
    }

    if (config.hasError) {
        return (
            <div className="admin-error">
                حدث خطأ في قراءة إعدادات Firestore. تأكد من وجود المستند settings/main ومن صلاحيات القراءة.
            </div>
        );
    }

    return (
        <div className="admin-flat-layout" dir="rtl">
            <nav className="admin-top-navbar">
                <div className="navbar-brand">
                    <i className="fa-solid fa-shield-halved"></i>
                    <h2>لوحة التحكم المركزية</h2>
                </div>

                <div className="navbar-actions">
                    <span className="role-badge">
                        <i className="fa-solid fa-user-shield"></i> {userRole}
                    </span>

                    <button className="icon-btn theme-toggle" onClick={toggleTheme} title="تغيير السمة">
                        <i className={`fa-solid fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
                    </button>

                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> خروج
                    </button>
                </div>
            </nav>

            <div className="admin-main-container">
                <Toast
                    message={msg.text}
                    type={msg.type}
                    visible={Boolean(msg.text)}
                    onClose={() => setMsg({ text: '', type: '' })}
                />

                <section className="admin-section-card stats-top-section">
                    <div className="section-header compact-header">
                        <div>
                            <h3>
                                <i className="fa-solid fa-chart-pie"></i> الإحصائيات
                            </h3>
                            <p className="section-hint">نظرة سريعة على استخدام الأداة.</p>
                        </div>
                    </div>

                    {stats ? (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <i className="fa-solid fa-users"></i>
                                <h4>إجمالي الزيارات</h4>
                                <span>{stats.visits || 0}</span>
                            </div>

                            <div className="stat-card">
                                <i className="fa-solid fa-calculator"></i>
                                <h4>حساب العمر</h4>
                                <span>{stats.ageCalc || 0}</span>
                            </div>

                            <div className="stat-card">
                                <i className="fa-solid fa-rotate"></i>
                                <h4>تحويل التواريخ</h4>
                                <span>{stats.dateConverter || 0}</span>
                            </div>

                            <div className="stat-card highlight-stat">
                                <i className="fa-solid fa-mouse-pointer"></i>
                                <h4>نقرات الإعلانات</h4>
                                <span>{stats.adClicks || 0}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="loading-text">جاري سحب البيانات من السيرفر...</p>
                    )}
                </section>

                <div className="admin-page-title-card">
                    <div>
                        <h1>إعدادات الأداة الشاملة</h1>
                        <p>كل قسم له زر حفظ مستقل. عند الحفظ يتم تحديث Firestore مباشرة.</p>
                    </div>
                </div>

                <div className="admin-sections-wrapper">
                    <section className="admin-section-card" id="general">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-solid fa-palette"></i> الهوية البصرية والمعلومات
                                </h3>
                                <p className="section-hint">اسم الموقع، الوصف المختصر، والشعار.</p>
                            </div>
                            <SectionSaveButton label="الهوية" />
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>عنوان الأداة</label>
                                <div className="input-with-icon">
                                    <i className="fa-solid fa-heading"></i>
                                    <input
                                        type="text"
                                        value={config.toolDisplayName || ''}
                                        onChange={(e) => setConfig({ ...config, toolDisplayName: e.target.value })}
                                        placeholder="مثال: أدوات التاريخ الشاملة"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>الوصف القصير</label>
                                <div className="input-with-icon">
                                    <i className="fa-solid fa-quote-right"></i>
                                    <input
                                        type="text"
                                        value={config.toolSlogan || ''}
                                        onChange={(e) => setConfig({ ...config, toolSlogan: e.target.value })}
                                        placeholder="مثال: دليلك الشامل للمواعيد"
                                    />
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={config.hasLogo || false}
                                        onChange={(e) => setConfig({ ...config, hasLogo: e.target.checked })}
                                        className="toggle-checkbox"
                                    />
                                    <span>استخدام صورة الشعار بدل النص</span>
                                </label>
                            </div>

                            {config.hasLogo && (
                                <div className="input-group full-width">
                                    <label>رابط الشعار</label>
                                    <div className="input-with-icon">
                                        <i className="fa-regular fa-image"></i>
                                        <input
                                            type="text"
                                            value={config.logoUrl || ''}
                                            onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                                            placeholder="مثال: /logo.png"
                                            dir="ltr"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp,.gif,.ico,image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
                                        onChange={(e) => handleMediaUpload(
                                            e,
                                            'logo',
                                            (url) => setConfig({ ...config, hasLogo: true, logoUrl: url }),
                                            'الشعار'
                                        )}
                                    />
                                </div>
                            )}

                            <div className="input-group full-width">
                                <label>رابط أيقونة المتصفح favicon</label>
                                <div className="input-with-icon">
                                    <i className="fa-regular fa-image"></i>
                                    <input
                                        type="text"
                                        value={config.faviconUrl || ''}
                                        onChange={(e) => setConfig({ ...config, faviconUrl: e.target.value })}
                                        placeholder="مثال: /api/media/favicon/..."
                                        dir="ltr"
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.webp,.gif,.ico,image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
                                    onChange={(e) => handleMediaUpload(
                                        e,
                                        'favicon',
                                        (url) => setConfig({ ...config, faviconUrl: url }),
                                        'أيقونة المتصفح'
                                    )}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="admin-section-card" id="media">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-regular fa-images"></i> صور الإعلانات
                                </h3>
                                <p className="section-hint">روابط أو رفع صور للمواضع الحالية. إدارة طلبات الإعلانات ستضاف لاحقًا كنظام منفصل.</p>
                            </div>
                            <SectionSaveButton label="صور الإعلانات" />
                        </div>

                        <div className="form-grid">
                            {[
                                ['top', 'إعلان أعلى الصفحة'],
                                ['middle', 'إعلان منتصف الصفحة'],
                                ['bottom1', 'إعلان أسفل الصفحة 1'],
                                ['bottom2', 'إعلان أسفل الصفحة 2'],
                            ].map(([slot, label]) => (
                                <div className="input-group full-width" key={slot}>
                                    <label>{label}</label>
                                    <div className="input-with-icon">
                                        <i className="fa-regular fa-image"></i>
                                        <input
                                            type="text"
                                            value={config.adImages?.[slot] || ''}
                                            onChange={(e) => handleAdImageChange(slot, e.target.value)}
                                            placeholder="مثال: /api/media/ads/..."
                                            dir="ltr"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
                                        onChange={(e) => handleMediaUpload(
                                            e,
                                            'ads',
                                            (url) => handleAdImageChange(slot, url),
                                            label
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="admin-section-card" id="pages">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-solid fa-file-lines"></i> الصفحات الداخلية
                                </h3>
                                <p className="section-hint">إدارة الصفحات، مكان ظهورها، ومعاينة محتواها.</p>
                            </div>
                            <SectionSaveButton label="الصفحات" />
                        </div>

                        <div className="dynamic-list-container">
                            {(config.internalPages || []).length === 0 && (
                                <div className="empty-state">
                                    لا توجد صفحات داخلية حاليًا. اضغط على زر إضافة صفحة.
                                </div>
                            )}

                            {(config.internalPages || []).map((page, idx) => {
                                const safeSlug = normalizeSlug(page.slug);

                                return (
                                    <div key={idx} className="admin-list-card page-list-card">
                                        <div className="admin-row page-row">
                                            <input
                                                type="text"
                                                placeholder="اسم الصفحة"
                                                value={page.title || ''}
                                                onChange={(e) => handlePageUpdate(idx, 'title', e.target.value)}
                                            />

                                            <input
                                                type="text"
                                                placeholder="المسار مثل about"
                                                value={page.slug || ''}
                                                onChange={(e) => handlePageUpdate(idx, 'slug', e.target.value)}
                                                dir="ltr"
                                            />

                                            <select
                                                className="location-select"
                                                value={page.location || 'footer'}
                                                onChange={(e) => handlePageUpdate(idx, 'location', e.target.value)}
                                            >
                                                <option value="header">الهيدر فقط</option>
                                                <option value="footer">الفوتر فقط</option>
                                                <option value="both">الهيدر والفوتر</option>
                                            </select>

                                            <div className="row-actions">
                                                <button
                                                    type="button"
                                                    className="preview-btn"
                                                    onClick={() => openPageModal(idx)}
                                                    title="عرض المحتوى"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="del-btn"
                                                    onClick={() => handlePageRemove(idx)}
                                                    title="حذف الصفحة"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="page-path-preview">
                                            الرابط: <span>/{safeSlug || 'page'}</span>
                                        </div>
                                    </div>
                                );
                            })}

                            <button className="add-btn" onClick={handlePageAdd}>
                                <i className="fa-solid fa-plus"></i> إضافة صفحة داخلية
                            </button>
                        </div>
                    </section>

                    <section className="admin-section-card" id="social">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-solid fa-hashtag"></i> السوشيال ميديا والحقوق
                                </h3>
                                <p className="section-hint">حقوق الفوتر وروابط الحسابات الاجتماعية.</p>
                            </div>
                            <SectionSaveButton label="السوشيال والحقوق" />
                        </div>

                        <div className="input-group admin-narrow-field">
                            <label>صاحب الحقوق</label>
                            <div className="input-with-icon">
                                <i className="fa-regular fa-copyright"></i>
                                <input
                                    type="text"
                                    value={config.copyrightName || ''}
                                    onChange={(e) => setConfig({ ...config, copyrightName: e.target.value })}
                                    placeholder="مثال: أدوات التاريخ"
                                />
                            </div>
                            <div className="preview-text">
                                © {new Date().getFullYear()} جميع الحقوق محفوظة لـ {config.copyrightName || 'أدوات التاريخ'}
                            </div>
                        </div>

                        <hr className="admin-divider" />

                        <div className="dynamic-list-container">
                            {(config.socialLinks || []).map((social, idx) => (
                                <div key={idx} className="admin-row dynamic-row">
                                    <select
                                        className="location-select brands-select"
                                        value={social.icon || 'fa-twitter'}
                                        onChange={(e) => handleArrayUpdate('socialLinks', idx, 'icon', e.target.value)}
                                    >
                                        <option value="fa-twitter">منصة X</option>
                                        <option value="fa-snapchat">سناب شات</option>
                                        <option value="fa-instagram">انستقرام</option>
                                        <option value="fa-tiktok">تيك توك</option>
                                        <option value="fa-youtube">يوتيوب</option>
                                        <option value="fa-whatsapp">واتساب</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="الرابط"
                                        value={social.url || ''}
                                        onChange={(e) => handleArrayUpdate('socialLinks', idx, 'url', e.target.value)}
                                        dir="ltr"
                                    />

                                    <button className="del-btn" onClick={() => handleArrayRemove('socialLinks', idx)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ))}

                            <button
                                className="add-btn"
                                onClick={() => handleArrayAdd('socialLinks', { icon: 'fa-twitter', url: '' })}
                            >
                                <i className="fa-solid fa-plus"></i> إضافة حساب تواصل
                            </button>
                        </div>
                    </section>

                    <section className="admin-section-card" id="external">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i> الروابط الخارجية
                                </h3>
                                <p className="section-hint">روابط تظهر في الهيدر أو الفوتر وتفتح خارج الموقع.</p>
                            </div>
                            <SectionSaveButton label="الروابط الخارجية" />
                        </div>

                        <div className="dynamic-list-container">
                            {(config.externalLinks || []).map((link, idx) => (
                                <div key={idx} className="admin-row dynamic-row">
                                    <input
                                        type="text"
                                        placeholder="اسم الرابط"
                                        value={link.title || ''}
                                        onChange={(e) => handleArrayUpdate('externalLinks', idx, 'title', e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={link.url || ''}
                                        onChange={(e) => handleArrayUpdate('externalLinks', idx, 'url', e.target.value)}
                                        dir="ltr"
                                    />

                                    <select
                                        className="location-select"
                                        value={link.location || 'header'}
                                        onChange={(e) => handleArrayUpdate('externalLinks', idx, 'location', e.target.value)}
                                    >
                                        <option value="header">الهيدر فقط</option>
                                        <option value="footer">الفوتر فقط</option>
                                        <option value="both">الهيدر والفوتر</option>
                                    </select>

                                    <button className="del-btn" onClick={() => handleArrayRemove('externalLinks', idx)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ))}

                            <button
                                className="add-btn"
                                onClick={() => handleArrayAdd('externalLinks', { title: '', url: '', location: 'header' })}
                            >
                                <i className="fa-solid fa-plus"></i> إضافة رابط خارجي
                            </button>
                        </div>
                    </section>

                    <section className="admin-section-card" id="events">
                        <div className="section-header section-header-with-action">
                            <div>
                                <h3>
                                    <i className="fa-solid fa-calendar-check"></i> الأحداث والمواعيد
                                </h3>
                                <p className="section-hint">إدارة المواعيد التي تظهر في الصفحة الرئيسية.</p>
                            </div>
                            <SectionSaveButton label="الأحداث" />
                        </div>

                        <div className="dynamic-list-container">
                            {(config.events || []).map((evt, idx) => (
                                <div key={evt.id || idx} className="admin-list-card event-list-card">
                                    <div className="admin-row dynamic-row">
                                        <input
                                            type="checkbox"
                                            checked={evt.active || false}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'active', e.target.checked)}
                                            title="تفعيل/إيقاف"
                                            className="toggle-checkbox compact-checkbox"
                                        />

                                        <input
                                            type="text"
                                            placeholder="اسم الحدث"
                                            value={evt.name || ''}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'name', e.target.value)}
                                        />

                                        <input
                                            type="date"
                                            value={evt.date || ''}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'date', e.target.value)}
                                        />
                                    </div>

                                    <div className="admin-row dynamic-row">
                                        <select
                                            className="location-select"
                                            value={evt.calendar || 'gregorian'}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'calendar', e.target.value)}
                                        >
                                            <option value="gregorian">ميلادي</option>
                                            <option value="hijri">هجري</option>
                                        </select>

                                        <select
                                            className="location-select"
                                            value={evt.repeat || 'once'}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'repeat', e.target.value)}
                                        >
                                            <option value="once">مرة واحدة</option>
                                            <option value="monthly">شهريًا</option>
                                            <option value="yearly">سنويًا</option>
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="أيقونة مثل fa-star"
                                            value={evt.icon || ''}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'icon', e.target.value)}
                                            dir="ltr"
                                        />

                                        <input
                                            type="color"
                                            value={evt.color || '#3b82f6'}
                                            onChange={(e) => handleArrayUpdate('events', idx, 'color', e.target.value)}
                                            className="event-color-input"
                                        />

                                        <button className="del-btn" onClick={() => handleArrayRemove('events', idx)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="add-btn"
                                onClick={() => handleArrayAdd('events', {
                                    id: Date.now(),
                                    name: '',
                                    date: '',
                                    calendar: 'gregorian',
                                    repeat: 'once',
                                    icon: 'fa-star',
                                    color: '#3b82f6',
                                    active: true
                                })}
                            >
                                <i className="fa-solid fa-plus"></i> إضافة حدث جديد
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {selectedPage && (
                <div className="admin-modal-backdrop" onClick={closePageModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h3>{selectedPageTitle}</h3>
                                <p>/{selectedPageSlug}</p>
                            </div>
                            <button className="modal-close-btn" onClick={closePageModal}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="admin-modal-body">
                            {isPageModalEditing ? (
                                <div className="input-group full-width">
                                    <label>تعديل محتوى الصفحة</label>
                                    <textarea
                                        className="page-content-editor"
                                        value={selectedPageContent}
                                        onChange={(e) => handlePageContentUpdate(selectedPageSlug, e.target.value)}
                                        placeholder="اكتب محتوى الصفحة هنا..."
                                    />
                                </div>
                            ) : (
                                <div className="page-content-preview">
                                    {selectedPageContent ? (
                                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPageContent) }} />
                                    ) : (
                                        <p className="muted-text">لا يوجد محتوى لهذه الصفحة بعد.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="admin-modal-actions">
                            <a href={`/${selectedPageSlug}`} target="_blank" rel="noopener noreferrer" className="secondary-action-btn">
                                <i className="fa-solid fa-up-right-from-square"></i> فتح الصفحة
                            </a>

                            <button
                                type="button"
                                className="secondary-action-btn"
                                onClick={() => setIsPageModalEditing(!isPageModalEditing)}
                            >
                                <i className={isPageModalEditing ? 'fa-solid fa-eye' : 'fa-solid fa-pen-to-square'}></i>
                                {isPageModalEditing ? 'معاينة' : 'تعديل'}
                            </button>

                            <button type="button" className="section-save-btn" onClick={() => saveSection('الصفحات')}>
                                <i className="fa-solid fa-floppy-disk"></i> حفظ الصفحات
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
