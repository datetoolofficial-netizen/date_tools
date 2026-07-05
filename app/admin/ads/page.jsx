'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import '../AdminDashboard.css';

const EMPTY_CAMPAIGN = {
    campaignName: '',
    targetUrl: '',
    imageUrl: '',
    targetTool: 'date_tool',
    adLocation: 'dateTop',
    startTime: '',
    endTime: '',
    status: 'قيد المراجعة',
    notes: ''
};

const MAX_MEDIA_FILE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_MEDIA_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
const SUPPORTED_MEDIA_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'application/octet-stream',
    ''
]);

const STATUS_OPTIONS = [
    'قيد المراجعة',
    'نشط',
    'متوقف مؤقتاً',
    'مرفوض',
    'تم تعديله',
    'منتهي'
];

const TOOL_NAMES = {
    date_tool: 'أداة التاريخ والعمر',
    clock_tool: 'أداة الساعة والوقت',
    weather_tool: 'أداة الطقس'
};

const LOCATION_NAMES = {
    dateTop: 'التاريخ - إعلان أعلى',
    dateMiddle: 'التاريخ - إعلان وسط',
    dateBottom: 'التاريخ - إعلان أسفل',
    clockTop: 'الساعة - إعلان أعلى',
    clockMiddle: 'الساعة - إعلان وسط',
    clockBottom: 'الساعة - إعلان أسفل',
    weatherTop: 'الطقس - إعلان أعلى',
    weatherMiddle: 'الطقس - إعلان وسط',
    weatherBottom: 'الطقس - إعلان أسفل',
    top: 'التاريخ - إعلان أعلى (قديم)',
    middle: 'التاريخ - إعلان وسط (قديم)',
    bottom1: 'التاريخ - إعلان أسفل (قديم 1)',
    bottom2: 'التاريخ - إعلان أسفل (قديم 2)'
};

const CAMPAIGN_LOCATION_OPTIONS = [
    { value: 'dateTop', label: LOCATION_NAMES.dateTop },
    { value: 'dateMiddle', label: LOCATION_NAMES.dateMiddle },
    { value: 'dateBottom', label: LOCATION_NAMES.dateBottom },
    { value: 'clockTop', label: LOCATION_NAMES.clockTop },
    { value: 'clockMiddle', label: LOCATION_NAMES.clockMiddle },
    { value: 'clockBottom', label: LOCATION_NAMES.clockBottom },
    { value: 'weatherTop', label: LOCATION_NAMES.weatherTop },
    { value: 'weatherMiddle', label: LOCATION_NAMES.weatherMiddle },
    { value: 'weatherBottom', label: LOCATION_NAMES.weatherBottom },
];

const STATS_PLACEMENT_OPTIONS = [
    { value: 'all', label: 'كل أماكن العرض' },
    { value: 'dateTop', label: LOCATION_NAMES.dateTop },
    { value: 'dateMiddle', label: LOCATION_NAMES.dateMiddle },
    { value: 'dateBottom', label: LOCATION_NAMES.dateBottom },
    { value: 'clockTop', label: 'الساعة - إعلان أعلى' },
    { value: 'clockMiddle', label: 'الساعة - إعلان وسط' },
    { value: 'clockBottom', label: 'الساعة - إعلان أسفل' },
    { value: 'weatherTop', label: 'الطقس - إعلان أعلى' },
    { value: 'weatherMiddle', label: 'الطقس - إعلان وسط' },
    { value: 'weatherBottom', label: 'الطقس - إعلان أسفل' },
    { value: 'google', label: 'قوقل فقط' },
    { value: 'advertisers', label: 'المعلنين فقط' }
];

const TOOL_FILTER_OPTIONS = [
    { value: 'all', label: 'كل الأدوات' },
    { value: 'date_tool', label: 'أداة التاريخ الشاملة' },
    { value: 'clock_tool', label: 'أداة الساعة والوقت' },
    { value: 'weather_tool', label: 'أداة الطقس' }
];

function getStatusClass(status) {
    if (status === 'نشط') return 'active';
    if (status === 'مرفوض') return 'rejected';
    if (status === 'متوقف مؤقتاً') return 'paused';
    if (status === 'منتهي') return 'ended';
    if (status === 'تم تعديله') return 'modified';
    return 'pending';
}

function getDisplayStatus(campaign) {
    const status = campaign?.status || 'قيد المراجعة';
    if (status === 'تم تعديله') return 'بانتظار المعلن';
    return status;
}

function formatDateTime(value) {
    if (!value) return '---';

    try {
        return new Intl.DateTimeFormat('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function getDurationDays(startTime, endTime) {
    if (!startTime || !endTime) return '---';
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return '---';
    return `${Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))} يوم`;
}

function getCampaignNumber(campaign) {
    return campaign.campaignNumber || campaign.campaignId || campaign.id?.slice(0, 8) || '---';
}

function getCampaignSource(campaign) {
    const source = String(campaign.sourceType || campaign.adProvider || campaign.provider || '').toLowerCase();

    if (source.includes('google')) return 'google';
    if (campaign.googleAdSlot || campaign.googleSlotId) return 'google';
    if (campaign.advertiserId || campaign.advertiserEmail) return 'advertisers';

    return 'admin';
}

function toInputDateTime(value) {
    if (!value) return '';
    if (typeof value === 'string' && value.includes('T')) return value.slice(0, 16);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
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

export default function AdminAdsPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
    const [campaigns, setCampaigns] = useState([]);
    const [filters, setFilters] = useState({ search: '', adder: '', date: '', status: 'all' });
    const [statsFilters, setStatsFilters] = useState({ tool: 'date_tool', date: '', placement: 'all' });
    const [modalMode, setModalMode] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaignForm, setCampaignForm] = useState(EMPTY_CAMPAIGN);
    const [reason, setReason] = useState('');
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const firebaseApiRef = useRef(null);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const search = filters.search.trim().toLowerCase();
            const adder = filters.adder.trim().toLowerCase();
            const date = filters.date;
            const status = filters.status;

            const matchesSearch = !search
                || String(getCampaignNumber(campaign)).toLowerCase().includes(search)
                || String(campaign.campaignName || '').toLowerCase().includes(search);
            const matchesAdder = !adder
                || String(campaign.addedByName || campaign.storeName || campaign.advertiserEmail || '').toLowerCase().includes(adder)
                || String(campaign.addedById || campaign.advertiserId || '').toLowerCase().includes(adder);
            const matchesDate = !date
                || String(campaign.startTime || '').includes(date)
                || String(campaign.endTime || '').includes(date);
            const matchesStatus = status === 'all' || (campaign.status || 'قيد المراجعة') === status;

            return matchesSearch && matchesAdder && matchesDate && matchesStatus;
        });
    }, [campaigns, filters]);

    const statsCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const tool = statsFilters.tool;
            const date = statsFilters.date;
            const placement = statsFilters.placement;
            const source = getCampaignSource(campaign);

            const matchesTool = tool === 'all' || (campaign.targetTool || 'date_tool') === tool;
            const matchesDate = !date
                || String(campaign.startTime || '').includes(date)
                || String(campaign.endTime || '').includes(date);
            const matchesPlacement = placement === 'all'
                || campaign.adLocation === placement
                || source === placement;

            return matchesTool && matchesDate && matchesPlacement;
        });
    }, [campaigns, statsFilters]);

    const totals = useMemo(() => {
        return statsCampaigns.reduce((acc, campaign) => {
            acc.views += Number(campaign.views || 0);
            acc.clicks += Number(campaign.clicks || 0);
            if ((campaign.status || 'قيد المراجعة') === 'قيد المراجعة') acc.pending += 1;
            return acc;
        }, { views: 0, clicks: 0, pending: 0 });
    }, [statsCampaigns]);

    const fetchCampaigns = useCallback(async () => {
        const firebaseApi = firebaseApiRef.current;
        if (!firebaseApi?.db) return;

        setIsLoadingCampaigns(true);
        try {
            const { collection, getDocs } = await import('firebase/firestore');
            const snapshot = await getDocs(collection(firebaseApi.db, 'campaigns'));
            const nextCampaigns = snapshot.docs
                .map((item) => ({ id: item.id, ...item.data() }))
                .sort((a, b) => {
                    const aNumber = Number(a.campaignId || String(a.campaignNumber || '').replace(/\D/g, '')) || 0;
                    const bNumber = Number(b.campaignId || String(b.campaignNumber || '').replace(/\D/g, '')) || 0;
                    return bNumber - aNumber;
                });
            setCampaigns(nextCampaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            showMessage('error', 'تعذر جلب الإعلانات من قاعدة البيانات.');
        } finally {
            setIsLoadingCampaigns(false);
        }
    }, []);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminAds() {
            try {
                const [{ auth, db, getAdminProfile }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/auth')
                ]);

                if (!isMounted) return;

                firebaseApiRef.current = { auth, db, signOut };

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
                        await fetchCampaigns();
                    } catch (error) {
                        console.error('Error loading ads admin page:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة حملات الإعلانات.');
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
    }, [fetchCampaigns]);

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

    const openCreateModal = (campaign = null) => {
        setSelectedCampaign(campaign);
        setCampaignForm(campaign ? {
            campaignName: campaign.campaignName || '',
            targetUrl: campaign.targetUrl || '',
            imageUrl: campaign.imageUrl || '',
            targetTool: campaign.targetTool || 'date_tool',
            adLocation: campaign.adLocation || 'dateTop',
            startTime: toInputDateTime(campaign.startTime),
            endTime: toInputDateTime(campaign.endTime),
            status: campaign.status || 'قيد المراجعة',
            notes: campaign.notes || campaign.editReason || ''
        } : EMPTY_CAMPAIGN);
        setModalMode(campaign ? 'edit' : 'create');
    };

    const openCopyModal = (campaign) => {
        setSelectedCampaign(null);
        setCampaignForm({
            ...EMPTY_CAMPAIGN,
            campaignName: `${campaign.campaignName || 'إعلان'} (نسخة)`,
            targetUrl: campaign.targetUrl || '',
            imageUrl: campaign.imageUrl || '',
            targetTool: campaign.targetTool || 'date_tool',
            adLocation: campaign.adLocation || 'dateTop',
            startTime: toInputDateTime(campaign.startTime),
            endTime: toInputDateTime(campaign.endTime)
        });
        setModalMode('create');
    };

    const openReasonModal = (campaign, nextStatus) => {
        setSelectedCampaign(campaign);
        setReason('');
        setModalMode(nextStatus === 'مرفوض' ? 'reject' : 'pause');
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedCampaign(null);
        setCampaignForm(EMPTY_CAMPAIGN);
        setReason('');
        setIsUploadingMedia(false);
    };

    const validateMediaFileBeforeUpload = (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        if (file.size <= 0 || file.size > MAX_MEDIA_FILE_BYTES) {
            return 'حجم الصورة غير مقبول. الحد الأقصى 5MB.';
        }

        if (!SUPPORTED_MEDIA_EXTENSIONS.has(extension)) {
            return 'نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP أو GIF.';
        }

        if (file.type && !SUPPORTED_MEDIA_TYPES.has(file.type)) {
            return 'نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP أو GIF.';
        }

        return '';
    };

    const uploadCampaignMedia = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        const validationError = validateMediaFileBeforeUpload(file);
        if (validationError) {
            showMessage('error', validationError);
            return;
        }

        const currentUser = firebaseApiRef.current?.auth?.currentUser;
        if (!currentUser) {
            showMessage('error', 'انتهت جلسة الدخول. سجّل الدخول مرة أخرى.');
            return;
        }

        setIsUploadingMedia(true);
        showMessage('success', 'جاري رفع صورة الإعلان إلى R2...');

        try {
            const token = await currentUser.getIdToken();
            const formData = new FormData();
            formData.append('category', 'ads');
            formData.append('file', file);

            const response = await fetch('/api/media/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'upload_failed');
            }

            setCampaignForm((current) => ({ ...current, imageUrl: result.url }));
            showMessage('success', 'تم رفع الصورة إلى R2 وربطها بالإعلان.');
        } catch (error) {
            console.error('Campaign media upload error:', error);
            const messages = {
                unauthorized: 'لا تملك صلاحية رفع الصور. تأكد من أن حسابك الإداري مفعّل.',
                media_storage_not_configured: 'تخزين الصور غير مفعل أو غير مربوط.',
                invalid_category: 'نوع مساحة الرفع غير معروف.',
                missing_file: 'لم يتم اختيار ملف للرفع.',
                invalid_file_size: 'حجم الصورة غير مقبول. الحد الأقصى 5MB.',
                unsupported_image_type: 'نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WEBP أو GIF.',
                upload_failed: 'تعذر رفع الصورة بسبب خطأ غير متوقع.'
            };
            showMessage('error', messages[error.message] || 'تعذر رفع صورة الإعلان.');
        } finally {
            setIsUploadingMedia(false);
        }
    };

    const saveCampaign = async () => {
        if (!campaignForm.campaignName.trim() || !campaignForm.targetUrl.trim() || !campaignForm.imageUrl.trim()) {
            showMessage('error', 'اسم الإعلان والرابط والمرفق مطلوبة.');
            return;
        }

        if (campaignForm.startTime && campaignForm.endTime && new Date(campaignForm.endTime) <= new Date(campaignForm.startTime)) {
            showMessage('error', 'وقت نهاية الإعلان يجب أن يكون بعد وقت البداية.');
            return;
        }

        try {
            const { addDoc, collection, doc, serverTimestamp, updateDoc } = await import('firebase/firestore');
            const firebaseApi = firebaseApiRef.current;
            const payload = {
                campaignName: campaignForm.campaignName.trim(),
                targetUrl: campaignForm.targetUrl.trim(),
                imageUrl: campaignForm.imageUrl.trim(),
                mediaType: campaignForm.imageUrl.includes('.mp4') ? 'video' : 'image',
                targetTool: campaignForm.targetTool,
                adLocation: campaignForm.adLocation,
                startTime: campaignForm.startTime,
                endTime: campaignForm.endTime,
                status: campaignForm.status,
                notes: campaignForm.notes.trim(),
                updatedAt: serverTimestamp()
            };

            if (modalMode === 'edit' && selectedCampaign?.id) {
                await updateDoc(doc(firebaseApi.db, 'campaigns', selectedCampaign.id), {
                    ...payload,
                    editReason: campaignForm.notes.trim(),
                    status: campaignForm.status === selectedCampaign.status ? 'تم تعديله' : campaignForm.status
                });
                showMessage('success', 'تم تعديل الإعلان بنجاح.');
            } else {
                const campaignNumber = `AD-${Date.now().toString().slice(-8)}`;
                await addDoc(collection(firebaseApi.db, 'campaigns'), {
                    ...payload,
                    campaignNumber,
                    views: 0,
                    clicks: 0,
                    addedByType: adminRole,
                    addedByName: adminName,
                    addedById: firebaseApi.auth?.currentUser?.uid || '',
                    createdAt: serverTimestamp()
                });
                showMessage('success', `تمت إضافة الإعلان رقم ${campaignNumber} وهو بانتظار المراجعة.`);
            }

            closeModal();
            await fetchCampaigns();
        } catch (error) {
            console.error('Error saving campaign:', error);
            showMessage('error', 'تعذر حفظ الإعلان. تحقق من صلاحيات المدير.');
        }
    };

    const updateCampaignStatus = async (campaign, status, extra = {}) => {
        try {
            const { doc, serverTimestamp, updateDoc } = await import('firebase/firestore');
            const firebaseApi = firebaseApiRef.current;
            await updateDoc(doc(firebaseApi.db, 'campaigns', campaign.id), {
                status,
                ...extra,
                updatedAt: serverTimestamp()
            });
            showMessage('success', `تم تغيير حالة الإعلان إلى: ${status}`);
            closeModal();
            await fetchCampaigns();
        } catch (error) {
            console.error('Error updating campaign status:', error);
            showMessage('error', 'تعذر تحديث حالة الإعلان.');
        }
    };

    const deleteCampaign = async (campaign) => {
        if (!window.confirm('هل تريد حذف هذا الإعلان نهائيًا؟')) return;

        try {
            const { deleteDoc, doc } = await import('firebase/firestore');
            await deleteDoc(doc(firebaseApiRef.current.db, 'campaigns', campaign.id));
            showMessage('success', 'تم حذف الإعلان.');
            await fetchCampaigns();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            showMessage('error', 'تعذر حذف الإعلان.');
        }
    };

    const submitReason = () => {
        if (!reason.trim()) {
            showMessage('error', 'اكتب السبب أولًا.');
            return;
        }

        const status = modalMode === 'reject' ? 'مرفوض' : 'متوقف مؤقتاً';
        const key = modalMode === 'reject' ? 'rejectReason' : 'pauseReason';
        updateCampaignStatus(selectedCampaign, status, { [key]: reason.trim() });
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

                <section className="legacy-ads-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-bullhorn"></i>
                            إدارة الحملات الإعلانية
                        </h1>
                        <p>متابعة الطلبات، الإحصائيات، وحالة الإعلانات المخصصة</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={() => openCreateModal()}>
                        <i className="fa-solid fa-plus"></i>
                        إضافة إعلان جديد
                    </button>
                </section>

                <section className="legacy-ad-kpis">
                    <div><span>إجمالي الحملات</span><strong>{statsCampaigns.length}</strong></div>
                    <div><span>قيد المراجعة</span><strong>{totals.pending}</strong></div>
                    <div><span>الزيارات</span><strong>{totals.views.toLocaleString('en-US')}</strong></div>
                    <div><span>النقرات</span><strong>{totals.clicks.toLocaleString('en-US')}</strong></div>
                </section>

                <section className="legacy-stats-filter-bar">
                    <div className="legacy-field compact">
                        <label>الأداة</label>
                        <select value={statsFilters.tool} onChange={(event) => setStatsFilters((current) => ({ ...current, tool: event.target.value }))}>
                            {TOOL_FILTER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="legacy-field compact">
                        <label>التاريخ</label>
                        <input type="date" value={statsFilters.date} onChange={(event) => setStatsFilters((current) => ({ ...current, date: event.target.value }))} />
                    </div>
                    <div className="legacy-field compact">
                        <label>مكان العرض / المصدر</label>
                        <select value={statsFilters.placement} onChange={(event) => setStatsFilters((current) => ({ ...current, placement: event.target.value }))}>
                            {STATS_PLACEMENT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="legacy-filter-bar old-ads-filters">
                    <div className="legacy-field compact">
                        <label>بحث برقم الإعلان أو اسم الحملة</label>
                        <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="أدخل رقم الإعلان أو الاسم..." />
                    </div>
                    <div className="legacy-field compact">
                        <label>اسم أو رقم مضيف الإعلان</label>
                        <input value={filters.adder} onChange={(event) => setFilters((current) => ({ ...current, adder: event.target.value }))} placeholder="ابحث هنا..." />
                    </div>
                    <div className="legacy-field compact">
                        <label>تاريخ البدء أو الانتهاء</label>
                        <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
                    </div>
                    <div className="legacy-field compact">
                        <label>حالة الإعلان</label>
                        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                            <option value="all">جميع الحالات</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="legacy-table-card old-ads-table-card">
                    <table className="legacy-ads-table old-ads-table">
                        <thead>
                            <tr>
                                <th>جهة وتفاصيل الإعلان</th>
                                <th>تاريخ ووقت العرض</th>
                                <th>المدة</th>
                                <th>الزيارات (أثناء العرض)</th>
                                <th>النقرات</th>
                                <th>الحالة</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingCampaigns ? (
                                <tr>
                                    <td colSpan="7" className="legacy-empty-table">
                                        <i className="fa-solid fa-spinner fa-spin"></i> جاري جلب البيانات...
                                    </td>
                                </tr>
                            ) : filteredCampaigns.length ? filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td className="legacy-ad-details-cell">
                                        <strong>{campaign.campaignName || 'إعلان بدون اسم'}</strong>
                                        <small>رقم: {getCampaignNumber(campaign)} | {TOOL_NAMES[campaign.targetTool] || 'أداة التاريخ والعمر'} - {LOCATION_NAMES[campaign.adLocation] || 'غير محدد'}</small>
                                        <div className="legacy-ad-links">
                                            {campaign.imageUrl && <a href={campaign.imageUrl} target="_blank" rel="noreferrer"><i className="fa-solid fa-image"></i> المرفق</a>}
                                            {campaign.targetUrl && <a href={campaign.targetUrl} target="_blank" rel="noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i> الرابط</a>}
                                        </div>
                                    </td>
                                    <td>
                                        <span>{formatDateTime(campaign.startTime)}</span>
                                        <small>{formatDateTime(campaign.endTime)}</small>
                                    </td>
                                    <td>{getDurationDays(campaign.startTime, campaign.endTime)}</td>
                                    <td>{Number(campaign.views || 0).toLocaleString('en-US')}</td>
                                    <td>{Number(campaign.clicks || 0).toLocaleString('en-US')}</td>
                                    <td>
                                        <span className={`legacy-status-pill ${getStatusClass(campaign.status)}`}>
                                            {getDisplayStatus(campaign)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="legacy-row-actions old-action-btns">
                                            <button title="التفاصيل السريعة" onClick={() => { setSelectedCampaign(campaign); setModalMode('view'); }}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            {(campaign.status === 'قيد المراجعة' || !campaign.status) && (
                                                <>
                                                    <button className="approve" title="قبول ونشر مباشر" onClick={() => updateCampaignStatus(campaign, 'نشط')}>
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                    <button title="تعديل الإعلان" onClick={() => openCreateModal(campaign)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button className="danger" title="رفض الإعلان" onClick={() => openReasonModal(campaign, 'مرفوض')}>
                                                        <i className="fa-solid fa-ban"></i>
                                                    </button>
                                                </>
                                            )}
                                            {campaign.status === 'نشط' && (
                                                <>
                                                    <button className="pause" title="إيقاف مؤقت" onClick={() => openReasonModal(campaign, 'متوقف مؤقتاً')}>
                                                        <i className="fa-solid fa-pause"></i>
                                                    </button>
                                                    <button title="تعديل الإعلان" onClick={() => openCreateModal(campaign)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                </>
                                            )}
                                            {campaign.status === 'متوقف مؤقتاً' && (
                                                <>
                                                    <button className="approve" title="استئناف ونشر" onClick={() => updateCampaignStatus(campaign, 'نشط')}>
                                                        <i className="fa-solid fa-play"></i>
                                                    </button>
                                                    <button title="تعديل الإعلان" onClick={() => openCreateModal(campaign)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                </>
                                            )}
                                            {(campaign.status === 'مرفوض' || campaign.status === 'تم تعديله' || campaign.status === 'منتهي') && (
                                                <button title="تعديل الإعلان" onClick={() => openCreateModal(campaign)}>
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                            )}
                                            <button title="نسخ كإعلان جديد" onClick={() => openCopyModal(campaign)}>
                                                <i className="fa-solid fa-copy"></i>
                                            </button>
                                            <button className="danger" title="حذف الإعلان" onClick={() => deleteCampaign(campaign)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="legacy-empty-table">لا توجد إعلانات مطابقة لمعايير البحث.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-bullhorn"></i> إدارة الإعلانات</div>
                </footer>
            </main>

            {(modalMode === 'create' || modalMode === 'edit') && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card">
                        <div className="legacy-modal-head">
                            <div>
                                <h3><i className="fa-solid fa-copy"></i> {modalMode === 'edit' ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h3>
                                <p>رقم الإعلان يُنشأ تلقائيًا، والحالة الافتراضية تكون قيد المراجعة.</p>
                            </div>
                            <button onClick={closeModal} aria-label="إغلاق"><i className="fa-solid fa-xmark"></i></button>
                        </div>

                        <div className="legacy-form-grid">
                            <div className="legacy-field">
                                <label>اسم الحملة</label>
                                <input value={campaignForm.campaignName} onChange={(event) => setCampaignForm((current) => ({ ...current, campaignName: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>رابط التوجيه</label>
                                <input dir="ltr" value={campaignForm.targetUrl} onChange={(event) => setCampaignForm((current) => ({ ...current, targetUrl: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>صورة الإعلان من R2</label>
                                <div className="legacy-upload-row">
                                    <input dir="ltr" value={campaignForm.imageUrl} onChange={(event) => setCampaignForm((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="/api/media/ads/..." />
                                    <label className={`legacy-upload-btn ${isUploadingMedia ? 'disabled' : ''}`}>
                                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadCampaignMedia} disabled={isUploadingMedia} />
                                        <i className={`fa-solid ${isUploadingMedia ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
                                        {isUploadingMedia ? 'يرفع...' : 'رفع صورة'}
                                    </label>
                                </div>
                                <span className="legacy-field-hint">سيتم رفع الصورة إلى Cloudflare R2 وحفظ رابطها هنا.</span>
                            </div>
                            <div className="legacy-field">
                                <label>مكان العرض</label>
                                <select value={campaignForm.adLocation} onChange={(event) => setCampaignForm((current) => ({ ...current, adLocation: event.target.value }))}>
                                    {CAMPAIGN_LOCATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                            </div>
                            <div className="legacy-field">
                                <label>تاريخ ووقت البداية</label>
                                <input type="datetime-local" value={campaignForm.startTime} onChange={(event) => setCampaignForm((current) => ({ ...current, startTime: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>تاريخ ووقت النهاية</label>
                                <input type="datetime-local" value={campaignForm.endTime} onChange={(event) => setCampaignForm((current) => ({ ...current, endTime: event.target.value }))} />
                            </div>
                            <div className="legacy-field">
                                <label>الحالة</label>
                                <select value={campaignForm.status} onChange={(event) => setCampaignForm((current) => ({ ...current, status: event.target.value }))}>
                                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                            <div className="legacy-field">
                                <label>سبب التعديل / ملاحظات</label>
                                <textarea rows="4" value={campaignForm.notes} onChange={(event) => setCampaignForm((current) => ({ ...current, notes: event.target.value }))} />
                            </div>
                        </div>

                        <div className="legacy-modal-actions">
                            <button className="legacy-secondary-btn" onClick={closeModal}>إلغاء</button>
                            <button className="legacy-primary-btn" onClick={saveCampaign}><i className="fa-solid fa-check"></i> حفظ الإعلان</button>
                        </div>
                    </div>
                </div>
            )}

            {(modalMode === 'reject' || modalMode === 'pause') && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card small">
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{modalMode === 'reject' ? 'رفض الإعلان' : 'إيقاف الإعلان مؤقتًا'}</h3>
                                <p>{selectedCampaign?.campaignName}</p>
                            </div>
                            <button onClick={closeModal} aria-label="إغلاق"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="legacy-field">
                            <label>السبب</label>
                            <textarea rows="5" value={reason} onChange={(event) => setReason(event.target.value)} />
                        </div>
                        <div className="legacy-modal-actions">
                            <button className="legacy-secondary-btn" onClick={closeModal}>إلغاء</button>
                            <button className="legacy-primary-btn" onClick={submitReason}>تأكيد</button>
                        </div>
                    </div>
                </div>
            )}

            {modalMode === 'view' && selectedCampaign && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card small">
                        <div className="legacy-modal-head">
                            <div>
                                <h3><i className="fa-solid fa-circle-info"></i> تفاصيل الإعلان</h3>
                                <p>رقم الإعلان: {getCampaignNumber(selectedCampaign)}</p>
                            </div>
                            <button onClick={closeModal} aria-label="إغلاق"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="legacy-details-list">
                            <div><strong>مضاف بواسطة:</strong> {selectedCampaign.addedByName || selectedCampaign.storeName || selectedCampaign.advertiserEmail || '---'}</div>
                            <div><strong>مكان العرض:</strong> {LOCATION_NAMES[selectedCampaign.adLocation] || 'غير محدد'}</div>
                            <div><strong>رابط التوجيه:</strong> <a href={selectedCampaign.targetUrl || '#'} target="_blank" rel="noreferrer">{selectedCampaign.targetUrl || 'لا يوجد'}</a></div>
                            <div><strong>الإحصائيات:</strong> {selectedCampaign.clicks || 0} نقرة / {selectedCampaign.views || 0} مشاهدة</div>
                            {selectedCampaign.rejectReason && <div><strong>سبب الرفض:</strong> {selectedCampaign.rejectReason}</div>}
                            {selectedCampaign.pauseReason && <div><strong>سبب الإيقاف:</strong> {selectedCampaign.pauseReason}</div>}
                            {selectedCampaign.editReason && <div><strong>سبب التعديل:</strong> {selectedCampaign.editReason}</div>}
                        </div>
                        {selectedCampaign.imageUrl && (
                            <div className="legacy-ad-preview">
                                <i className="fa-solid fa-image"></i>
                                <div>
                                    <strong>الوسائط المرفقة</strong>
                                    <a href={selectedCampaign.imageUrl} target="_blank" rel="noreferrer">{selectedCampaign.imageUrl}</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
