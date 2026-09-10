'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    ADMIN_PERMISSIONS,
    getAdminPermissions,
    getAdminRoleLabel,
    hasAdminPermission,
    resolveAdminRole,
} from '../adminAccess';
import { ADMIN_VERSION } from '../version';

const AdminContext = createContext(null);

const NAV_ITEMS = [
    {
        id: 'home',
        href: '/admin',
        label: 'الرئيسية',
        icon: 'fa-house',
        permission: ADMIN_PERMISSIONS.DASHBOARD_READ,
    },
    {
        id: 'tools',
        href: '/admin/tools',
        label: 'إعدادات الأداة',
        icon: 'fa-screwdriver-wrench',
        permission: ADMIN_PERMISSIONS.SITE_SETTINGS_READ,
    },
    {
        id: 'security',
        href: '/admin/security',
        label: 'الأمان',
        icon: 'fa-shield-halved',
        permission: ADMIN_PERMISSIONS.SECURITY_READ,
    },
    {
        id: 'integrations',
        href: '/admin/integrations',
        label: 'الربط الخارجي',
        icon: 'fa-plug-circle-bolt',
        permission: ADMIN_PERMISSIONS.INTEGRATIONS_READ,
    },
    {
        id: 'pagespeed',
        href: '/admin/pagespeed',
        label: 'PageSpeed',
        icon: 'fa-gauge-high',
        permission: ADMIN_PERMISSIONS.PERFORMANCE_READ,
    },
    {
        id: 'ad-settings',
        href: '/admin/ad-settings',
        label: 'إدارة الإعلانات',
        icon: 'fa-rectangle-ad',
        permission: ADMIN_PERMISSIONS.ADS_SETTINGS_READ,
    },
    {
        id: 'ads',
        href: '/admin/ads',
        label: 'الحملات الإعلانية',
        icon: 'fa-bullhorn',
        permission: ADMIN_PERMISSIONS.CAMPAIGNS_READ,
    },
    {
        id: 'tool-management',
        href: '/admin/tool-management',
        label: 'إدارة الأدوات',
        icon: 'fa-toolbox',
        permission: ADMIN_PERMISSIONS.CONTENT_TOOLS_READ,
    },
    {
        id: 'accounts',
        href: '/admin/accounts',
        label: 'الحسابات',
        icon: 'fa-users-gear',
        permission: ADMIN_PERMISSIONS.ADVERTISERS_READ,
    },
    {
        id: 'admin-team',
        href: '/admin/team',
        label: 'فريق الإدارة',
        icon: 'fa-user-shield',
        permission: ADMIN_PERMISSIONS.ADMINS_READ,
    },
    {
        id: 'audit',
        href: '/admin/audit',
        label: 'سجل العمليات',
        icon: 'fa-clock-rotate-left',
        permission: ADMIN_PERMISSIONS.AUDIT_READ,
    },
    {
        id: 'client',
        href: '/client/dashboard',
        label: 'بوابة المعلنين',
        icon: 'fa-user-tie',
        permission: ADMIN_PERMISSIONS.ADVERTISERS_READ,
        externalToAdmin: true,
    },
    {
        id: 'support',
        href: '/admin/support',
        label: 'التذاكر',
        icon: 'fa-ticket',
        permission: ADMIN_PERMISSIONS.SUPPORT_READ,
    },
];

function canOpenNavItem(item, profile) {
    return Boolean(item?.permission && hasAdminPermission(profile, item.permission));
}

function getActiveNavId(pathname) {
    const currentPath = pathname || '/admin';
    if (currentPath === '/admin/advertisers') return 'accounts';
    const matched = NAV_ITEMS
        .filter((item) => !item.externalToAdmin)
        .filter((item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`))
        .sort((a, b) => b.href.length - a.href.length)[0];

    return matched?.id || 'home';
}

function AdminPageGuard({ children, allowed }) {
    if (allowed) return children;

    return (
        <div className="admin-access-state" role="status">
            <span className="admin-access-state-icon">
                <i className="fa-solid fa-shield-halved fa-beat-fade"></i>
            </span>
            <h2>جاري التحقق من صلاحية الصفحة</h2>
            <p>هذه الصفحة تحتاج صلاحية مخصصة. إن كان حسابك مساعدًا، اطلب من المدير تفعيلها لك.</p>
        </div>
    );
}

export function useAdminShell() {
    return useContext(AdminContext);
}

export default function AdminShell({ children }) {
    const pathname = usePathname();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminProfile, setAdminProfile] = useState(null);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [pendingDeleteButton, setPendingDeleteButton] = useState(null);
    const firebaseApiRef = useRef(null);
    const approvedDeleteButtonsRef = useRef(new WeakSet());

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminShell() {
            try {
                const [{ getFirebaseAuth, getAdminProfile, syncPublicSiteConfig }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut };

                if (
                    document.documentElement.dataset.siteTheme === 'dark'
                    || document.body.classList.contains('dark-mode')
                ) {
                    setIsDarkMode(true);
                }

                if (window.localStorage.getItem('admin_sidebar_collapsed') === 'true') {
                    setIsSidebarCollapsed(true);
                }

                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        window.location.replace('/admin_login');
                        return;
                    }

                    try {
                        const profile = await getAdminProfile(user.uid);

                        if (
                            !profile
                            || profile.active !== true
                            || !resolveAdminRole(profile)
                        ) {
                            await signOut(auth);
                            window.location.replace('/admin_login');
                            return;
                        }

                        if (!isMounted) return;

                        setAdminProfile(profile);
                        setAdminName(profile.name || profile.email || 'أيها المدير');
                        setAdminRole(getAdminRoleLabel(profile));
                        if (hasAdminPermission(profile, ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE)) {
                            syncPublicSiteConfig().catch(() => {
                                console.error('Unable to synchronize the public site settings.');
                            });
                        }
                    } catch (error) {
                        console.error('Error loading admin shell:', error);
                        if (isMounted) setLoadError('حدث خطأ في التحقق من صلاحيات لوحة الإدارة.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading admin shell modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات لوحة الإدارة.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadAdminShell();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        setIsMobileSidebarOpen(false);
        setPendingDeleteButton(null);
    }, [pathname]);

    useEffect(() => {
        const previousDocumentOverflowX = document.documentElement.style.overflowX;
        const previousBodyOverflowX = document.body.style.overflowX;

        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';

        return () => {
            document.documentElement.style.overflowX = previousDocumentOverflowX;
            document.body.style.overflowX = previousBodyOverflowX;
        };
    }, []);

    useEffect(() => {
        if (!isMobileSidebarOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsMobileSidebarOpen(false);
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [isMobileSidebarOpen]);

    useEffect(() => {
        const interceptDelete = (event) => {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest('button');
            if (!button || !button.closest('.legacy-admin-shell')) return;
            if (button.closest('.admin-delete-confirm')) return;

            const isDeleteButton = button.querySelector('.fa-trash') || button.dataset.confirmDelete === 'true';
            if (!isDeleteButton) return;

            if (approvedDeleteButtonsRef.current.has(button)) {
                approvedDeleteButtonsRef.current.delete(button);
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            setPendingDeleteButton(button);
        };

        document.addEventListener('click', interceptDelete, true);
        return () => document.removeEventListener('click', interceptDelete, true);
    }, []);

    const confirmDelete = () => {
        if (!pendingDeleteButton) return;
        const button = pendingDeleteButton;
        if (!button.isConnected) {
            setPendingDeleteButton(null);
            return;
        }
        approvedDeleteButtonsRef.current.add(button);
        button.click();
        setPendingDeleteButton(null);
    };

    const permissions = useMemo(() => getAdminPermissions(adminProfile || {}), [adminProfile]);
    const activeNavId = getActiveNavId(pathname);
    const allowedNavItems = useMemo(
        () => NAV_ITEMS.filter((item) => canOpenNavItem(item, adminProfile)),
        [adminProfile],
    );
    const activeItem = NAV_ITEMS.find((item) => item.id === activeNavId);
    const isCurrentPageAllowed = !activeItem || canOpenNavItem(activeItem, adminProfile);

    const contextValue = useMemo(() => ({
        adminProfile,
        adminName,
        adminRole,
        permissions,
        can: (permission) => hasAdminPermission(adminProfile, permission),
        isCurrentPageAllowed,
    }), [adminProfile, adminName, adminRole, permissions, isCurrentPageAllowed]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((current) => {
            const next = !current;
            window.localStorage.setItem('admin_sidebar_collapsed', String(next));
            return next;
        });
    };

    const toggleDarkMode = () => {
        setIsDarkMode((current) => {
            const nextDarkMode = !current;
            const nextTheme = nextDarkMode ? 'dark' : 'light';
            document.documentElement.dataset.siteTheme = nextTheme;
            document.documentElement.style.colorScheme = nextTheme;
            document.body.classList.toggle('dark-mode', nextDarkMode);
            document.body.classList.toggle('light-mode', !nextDarkMode);
            window.localStorage.setItem('site_theme', nextTheme);
            return nextDarkMode;
        });
    };

    const handleLogout = async () => {
        const firebaseApi = firebaseApiRef.current;

        try {
            if (firebaseApi?.signOut && firebaseApi?.auth) {
                await firebaseApi.signOut(firebaseApi.auth);
            }
        } finally {
            window.location.replace('/admin_login');
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-shield-halved fa-beat-fade"></i>
                <h3>جاري التحقق من صلاحية الدخول...</h3>
            </div>
        );
    }

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    return (
        <AdminContext.Provider value={contextValue}>
            <div className={`legacy-admin-shell admin-persistent-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} dir="rtl">
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
                        <button
                            type="button"
                            className="legacy-mobile-sidebar-close"
                            onClick={() => setIsMobileSidebarOpen(false)}
                            aria-label="إغلاق القائمة"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <button className="legacy-toggle-sidebar-btn" onClick={toggleSidebar} aria-label="تصغير القائمة">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                    <ul className="legacy-nav-links">
                        {allowedNavItems.map((item) => (
                            <li key={item.id}>
                                <Link href={item.href} className={activeNavId === item.id ? 'active' : ''}>
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span className="nav-text">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="legacy-main-wrapper admin-persistent-main">
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

                    <div className="admin-persistent-content">
                        <AdminPageGuard allowed={isCurrentPageAllowed}>
                            {children}
                        </AdminPageGuard>
                    </div>

                    <footer className="legacy-admin-footer admin-shell-footer">
                        <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                        <div className="legacy-version-badge"><i className="fa-solid fa-shield-halved"></i> admin v{ADMIN_VERSION}</div>
                    </footer>
                </main>

                {pendingDeleteButton && (
                    <div className="legacy-modal-backdrop admin-delete-confirm" role="dialog" aria-modal="true" aria-labelledby="admin-delete-confirm-title">
                        <div className="legacy-modal-card small admin-delete-confirm-card">
                            <div className="admin-delete-confirm-icon"><i className="fa-solid fa-trash"></i></div>
                            <h3 id="admin-delete-confirm-title">تأكيد الحذف</h3>
                            <p>هل تريد حذف هذا العنصر نهائيًا؟ يمكنك استخدام زر إيقاف التفعيل بدل الحذف عندما يكون متاحًا.</p>
                            <div className="legacy-modal-actions admin-delete-confirm-actions">
                                <button type="button" className="legacy-primary-btn danger" onClick={confirmDelete}>
                                    <i className="fa-solid fa-trash"></i>
                                    حذف
                                </button>
                                <button type="button" className="legacy-secondary-btn" onClick={() => setPendingDeleteButton(null)}>
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminContext.Provider>
    );
}
