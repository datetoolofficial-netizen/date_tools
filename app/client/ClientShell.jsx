'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CLIENT_PORTAL_VERSION } from './ClientVersion';
import {
    ADVERTISER_PERMISSIONS,
    formatOrganizationNumber,
    getAdvertiserRoleLabel,
    hasAdvertiserPermission,
    resolveOrganizationNumber,
} from '../advertiserAccess';
import { evaluateAdvertiserAccess } from '../securityPolicies';
import { getLocalAdvertiserSession, isLocalAdvertiserDemoEnabled, logoutLocalAdvertiser } from './localAdvertiserDemo';

const ClientPortalContext = createContext(null);

const navItems = [
    { href: '/client/dashboard', icon: 'fa-chart-line', label: 'التقارير والحملات', permission: ADVERTISER_PERMISSIONS.CAMPAIGNS_READ },
    { href: '/client/create-campaign', icon: 'fa-bullhorn', label: 'طلب إعلان', permission: ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE },
    { href: '/client/team', icon: 'fa-users-gear', label: 'فريق المنظمة', permission: ADVERTISER_PERMISSIONS.TEAM_READ },
    { href: '/support', icon: 'fa-headset', label: 'الدعم الفني' },
    { href: '/', icon: 'fa-arrow-up-right-from-square', label: 'عرض الموقع' },
];

const pageDetails = {
    '/client/dashboard': {
        title: 'التقارير والحملات',
        description: 'مؤشرات أداء الإعلانات وإدارة الحملات',
    },
    '/client/create-campaign': {
        title: 'طلب إعلان جديد',
        description: 'إرسال مادة إعلانية وجدولتها للمراجعة',
    },
    '/client/team': {
        title: 'فريق المنظمة',
        description: 'إدارة أعضاء المنظمة وأدوارهم',
    },
};

function accessErrorMessage(access) {
    if (access === 'unverified') return 'يجب تأكيد البريد الإلكتروني قبل دخول بوابة المعلنين.';
    if (access === 'inactive') return 'حساب المعلن غير نشط حاليًا. تواصل مع الدعم الفني.';
    if (access === 'unauthorized') return 'دور هذا الحساب غير معروف. تواصل مع الدعم الفني.';
    return 'لا يوجد ملف معلن صالح لهذا الحساب.';
}

export function useClientPortal() {
    const context = useContext(ClientPortalContext);
    if (!context) throw new Error('useClientPortal must be used inside ClientShell.');
    return context;
}

export default function ClientShell({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isDark, setIsDark] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        setIsDark(window.localStorage.getItem('client-theme') === 'dark');
        setIsSidebarCollapsed(window.localStorage.getItem('client-sidebar-collapsed') === 'true');
    }, []);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadClientSession() {
            try {
                if (isLocalAdvertiserDemoEnabled()) {
                    const session = await getLocalAdvertiserSession();
                    if (!session) {
                        router.replace('/client');
                        return;
                    }
                    if (!isMounted) return;
                    setCurrentUser(session.user);
                    setProfile(session.profile);
                    setIsCheckingAuth(false);
                    return;
                }

                const [{ db, getFirebaseAuth }, { onAuthStateChanged, signOut }, { doc, getDoc, serverTimestamp, updateDoc }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                    import('firebase/firestore'),
                ]);
                const auth = await getFirebaseAuth();

                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        router.replace('/client');
                        return;
                    }

                    try {
                        const profileRef = doc(db, 'advertisers', user.uid);
                        const profileSnap = await getDoc(profileRef);
                        let nextProfile = profileSnap.exists() ? { id: user.uid, ...profileSnap.data() } : null;
                        const access = evaluateAdvertiserAccess({ emailVerified: user.emailVerified, profile: nextProfile });

                        if (access === 'activate') {
                            await updateDoc(profileRef, { status: 'active', updatedAt: serverTimestamp() });
                            nextProfile = { ...nextProfile, status: 'active' };
                        } else if (access !== 'allowed') {
                            await signOut(auth);
                            if (isMounted) setLoadError(accessErrorMessage(access));
                            return;
                        }

                        if (!isMounted) return;
                        setCurrentUser(user);
                        setProfile(nextProfile);
                    } catch (error) {
                        console.error('Client portal session load failed:', error);
                        if (isMounted) setLoadError('تعذر التحقق من حساب المعلن الآن. أعد المحاولة بعد لحظات.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Client portal modules load failed:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل بوابة المعلنين. أعد المحاولة بعد لحظات.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadClientSession();
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isMobileOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsMobileOpen(false);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [isMobileOpen]);

    const toggleTheme = () => {
        setIsDark((current) => {
            const next = !current;
            window.localStorage.setItem('client-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((current) => {
            const next = !current;
            window.localStorage.setItem('client-sidebar-collapsed', String(next));
            return next;
        });
    };

    const logout = async () => {
        if (isLocalAdvertiserDemoEnabled()) {
            logoutLocalAdvertiser();
            router.replace('/client');
            return;
        }

        try {
            const [{ getFirebaseAuth }, { signOut }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();
            await signOut(auth);
        } finally {
            router.replace('/client');
        }
    };

    const page = pageDetails[pathname] || { title: 'بوابة المعلنين', description: 'إدارة حسابك الإعلاني' };
    const organizationNumber = profile ? formatOrganizationNumber(resolveOrganizationNumber(profile)) : '';
    const allowedNavItems = navItems.filter((item) => !item.permission || hasAdvertiserPermission(profile, item.permission));
    const contextValue = useMemo(() => ({
        profile,
        currentUser,
        isCheckingAuth,
        isLocalDemo: Boolean(profile?.isLocalDemo),
    }), [profile, currentUser, isCheckingAuth]);

    return (
        <ClientPortalContext.Provider value={contextValue}>
            <div className={`client-portal client-workspace ${isDark ? 'dark' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} dir="rtl">
                <div className="client-shell">
                    <button type="button" className={`client-sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={() => setIsMobileOpen(false)} aria-label="إغلاق القائمة" />

                    <aside className={`client-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                        <div className="client-sidebar-brand">
                            <span className="client-brand-mark"><i className="fa-solid fa-bullseye"></i></span>
                            <h2 className="client-brand-copy">بوابة المعلنين</h2>
                            <button type="button" className="client-mobile-close" onClick={() => setIsMobileOpen(false)} aria-label="إغلاق القائمة">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <button type="button" className="client-sidebar-collapse" onClick={toggleSidebar} aria-label="تصغير القائمة">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>

                        <nav aria-label="قائمة بوابة المعلنين">
                            <ul className="client-side-nav">
                                {allowedNavItems.map((item) => (
                                    <li key={item.href}>
                                        <Link className={pathname === item.href ? 'active' : ''} href={item.href}>
                                            <i className={`fa-solid ${item.icon}`}></i>
                                            <span className="client-nav-text">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <main className="client-main">
                        <header className="client-topbar">
                            <div className="client-topbar-user">
                                <button type="button" className="client-mobile-menu" onClick={() => setIsMobileOpen(true)} aria-label="فتح القائمة">
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                                <span className="client-avatar"><i className="fa-solid fa-user-tie"></i></span>
                                <div className="client-user-copy">
                                    <strong>{profile?.contactName || profile?.storeName || 'حساب المعلن'}</strong>
                                    <small>{profile ? getAdvertiserRoleLabel(profile) : 'جاري التحقق'}</small>
                                </div>
                                {profile?.isLocalDemo && <span className="client-local-badge">محلي</span>}
                            </div>
                            <div className="client-topbar-controls">
                                <button type="button" className="client-icon-btn" onClick={toggleTheme} title="تبديل المظهر" aria-label="تبديل المظهر">
                                    <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                                </button>
                                <button type="button" className="client-logout-btn" onClick={logout} title="تسجيل الخروج">
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                    <span>خروج</span>
                                </button>
                            </div>
                        </header>

                        <div className="client-content">
                            {loadError ? (
                                <div className="client-state-card error" role="alert">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <h2>تعذر فتح البوابة</h2>
                                    <p>{loadError}</p>
                                    <Link className="client-primary-btn" href="/client">العودة لتسجيل الدخول</Link>
                                </div>
                            ) : isCheckingAuth ? (
                                <div className="client-state-card" aria-live="polite">
                                    <i className="fa-solid fa-chart-line fa-beat-fade"></i>
                                    <h2>جاري تجهيز مساحة المعلن</h2>
                                    <p>نتحقق من الحساب والصلاحيات مرة واحدة.</p>
                                </div>
                            ) : (
                                <div className="client-page">
                                    <section className="client-page-hero">
                                        <div>
                                            <span className="client-page-eyebrow">مساحة المعلن</span>
                                            <h1>{pathname === '/client/dashboard' && profile?.storeName ? `أهلًا بك، ${profile.storeName}` : page.title}</h1>
                                            <p>{page.description}</p>
                                        </div>
                                        <div className="client-page-hero-meta">
                                            <span><i className="fa-solid fa-id-badge"></i>{profile ? getAdvertiserRoleLabel(profile) : 'حساب معلن'}</span>
                                            {organizationNumber && <small dir="ltr">ORG {organizationNumber}</small>}
                                        </div>
                                    </section>
                                    {children}
                                </div>
                            )}
                        </div>

                        <footer className="client-footer">
                            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة المعلنين</strong></span>
                            <span className="client-version-badge"><i className="fa-solid fa-bullseye"></i> client v{CLIENT_PORTAL_VERSION}</span>
                        </footer>
                    </main>
                </div>
            </div>
        </ClientPortalContext.Provider>
    );
}
