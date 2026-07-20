'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './AdminDashboard.css';

const AdminContext = createContext(null);

const NAV_ITEMS = [
    {
        id: 'home',
        href: '/admin',
        label: 'الرئيسية',
        icon: 'fa-house',
        permissionKeys: ['home', 'dashboard', 'admin'],
    },
    {
        id: 'identity',
        href: '/admin/identity',
        label: 'إدارة الهوية',
        icon: 'fa-palette',
        permissionKeys: ['identity', 'brand', 'branding'],
    },
    {
        id: 'integrations',
        href: '/admin/integrations',
        label: 'الربط الخارجي',
        icon: 'fa-plug-circle-bolt',
        permissionKeys: ['integrations', 'external-integrations', 'externalIntegrations'],
    },
    {
        id: 'pagespeed',
        href: '/admin/pagespeed',
        label: 'PageSpeed',
        icon: 'fa-gauge-high',
        permissionKeys: ['pagespeed', 'page-speed', 'performance'],
    },
    {
        id: 'ad-settings',
        href: '/admin/ad-settings',
        label: 'إدارة الإعلانات',
        icon: 'fa-rectangle-ad',
        permissionKeys: ['ad-settings', 'adSettings', 'ads-settings', 'google-ads'],
    },
    {
        id: 'ads',
        href: '/admin/ads',
        label: 'الحملات الإعلانية',
        icon: 'fa-bullhorn',
        permissionKeys: ['ads', 'campaigns', 'ad-campaigns'],
    },
    {
        id: 'tool-management',
        href: '/admin/tool-management',
        label: 'إدارة الأدوات',
        icon: 'fa-toolbox',
        permissionKeys: ['tool-management', 'toolManagement', 'tools-management', 'toolsContent'],
    },
    {
        id: 'tools',
        href: '/admin/tools',
        label: 'إعدادات الأداة',
        icon: 'fa-screwdriver-wrench',
        permissionKeys: ['tools', 'settings', 'site-settings', 'pages'],
    },
    {
        id: 'client',
        href: '/client/dashboard',
        label: 'بوابة المعلنين',
        icon: 'fa-user-tie',
        permissionKeys: ['client', 'advertisers', 'clients'],
        externalToAdmin: true,
    },
    {
        id: 'support',
        href: '/support',
        label: 'الدعم',
        icon: 'fa-headset',
        permissionKeys: ['support', 'tickets'],
        externalToAdmin: true,
    },
];

function normalizeToken(value) {
    return String(value || '')
        .trim()
        .replace(/^\/?admin\/?/, '')
        .replace(/^\//, '')
        .replace(/\//g, '-')
        .toLowerCase();
}

function addPermissionValue(value, result) {
    if (!value) return;

    if (typeof value === 'string') {
        result.add(normalizeToken(value));
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => addPermissionValue(item, result));
        return;
    }

    if (typeof value === 'object') {
        Object.entries(value).forEach(([key, entryValue]) => {
            if (entryValue === true) {
                result.add(normalizeToken(key));
                return;
            }

            if (Array.isArray(entryValue) || typeof entryValue === 'string' || typeof entryValue === 'object') {
                addPermissionValue(entryValue, result);
            }
        });
    }
}

function getPermissionSet(profile = {}) {
    const result = new Set();
    [
        profile.permissions,
        profile.adminPermissions,
        profile.allowedPages,
        profile.allowedAdminPages,
        profile.pagePermissions,
        profile.pageAccess,
        profile.routes,
        profile.access,
    ].forEach((value) => addPermissionValue(value, result));

    return result;
}

function hasFullAdminAccess(profile = {}) {
    const role = normalizeToken(profile.role || profile.adminRole || '');
    return ['super_admin', 'super-admin', 'owner', 'admin', 'manager'].includes(role);
}

function isAssistantProfile(profile = {}) {
    const role = normalizeToken(profile.role || profile.adminRole || '');
    return ['assistant', 'helper', 'مساعد'].includes(role);
}

function canOpenNavItem(item, profile, permissionSet) {
    if (!profile) return false;
    if (hasFullAdminAccess(profile)) return true;

    if (permissionSet.size === 0) {
        return item.id === 'home' || !isAssistantProfile(profile);
    }

    return item.permissionKeys.some((key) => permissionSet.has(normalizeToken(key)));
}

function getActiveNavId(pathname) {
    const currentPath = pathname || '/admin';
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
    const firebaseApiRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminShell() {
            try {
                const [{ getFirebaseAuth, getAdminProfile }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut };

                if (document.body.classList.contains('dark-mode')) {
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

                        if (!profile || profile.active !== true) {
                            await signOut(auth);
                            window.location.replace('/admin_login');
                            return;
                        }

                        if (!isMounted) return;

                        setAdminProfile(profile);
                        setAdminName(profile.name || profile.email || 'أيها المدير');
                        setAdminRole(profile.role === 'super_admin' ? 'المدير العام' : profile.role === 'assistant' ? 'مساعد' : 'مدير');
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
    }, [pathname]);

    const permissionSet = useMemo(() => getPermissionSet(adminProfile || {}), [adminProfile]);
    const activeNavId = getActiveNavId(pathname);
    const allowedNavItems = useMemo(
        () => NAV_ITEMS.filter((item) => canOpenNavItem(item, adminProfile, permissionSet)),
        [adminProfile, permissionSet],
    );
    const activeItem = NAV_ITEMS.find((item) => item.id === activeNavId);
    const isCurrentPageAllowed = !activeItem || canOpenNavItem(activeItem, adminProfile, permissionSet);

    const contextValue = useMemo(() => ({
        adminProfile,
        adminName,
        adminRole,
        permissionSet,
        isCurrentPageAllowed,
    }), [adminProfile, adminName, adminRole, permissionSet, isCurrentPageAllowed]);

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
                </main>
            </div>
        </AdminContext.Provider>
    );
}
