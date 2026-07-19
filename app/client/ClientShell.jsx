'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CLIENT_PORTAL_VERSION } from './ClientVersion';

const navItems = [
    { href: '/client/dashboard', icon: 'fa-chart-line', label: 'لوحة التحكم', key: 'dashboard' },
    { href: '/client/create-campaign', icon: 'fa-bullhorn', label: 'طلب إعلان', key: 'campaign' },
    { href: '/support', icon: 'fa-headset', label: 'الدعم الفني', key: 'support' },
    { href: '/', icon: 'fa-house', label: 'الموقع العام', key: 'home' },
];

export default function ClientShell({ active = 'dashboard', title = 'بوابة المعلنين', userProfile, children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('client-theme');
        setIsDark(storedTheme === 'dark');
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleTheme = () => {
        setIsDark((current) => {
            const next = !current;
            window.localStorage.setItem('client-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const logout = async () => {
        try {
            const [{ getFirebaseAuth }, { signOut }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();

            await signOut(auth);
            router.replace('/client');
        } catch {
            router.replace('/client');
        }
    };

    return (
        <div className={`client-portal ${isDark ? 'dark' : ''}`} dir="rtl">
            <div className="client-shell">
                <button
                    type="button"
                    className="client-mobile-menu"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="فتح القائمة"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <button
                    type="button"
                    className={`client-sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="إغلاق القائمة"
                />

                <aside className={`client-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                    <div className="client-sidebar-brand">
                        <i className="fa-solid fa-layer-group"></i>
                        <div>
                            <strong>بوابة المعلنين</strong>
                            <span>إدارة حملات Date Tool</span>
                        </div>
                    </div>

                    <ul className="client-side-nav">
                        {navItems.map((item) => (
                            <li key={item.key}>
                                <Link className={active === item.key ? 'active' : ''} href={item.href}>
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button type="button" onClick={logout} className="danger-link">
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span>تسجيل الخروج</span>
                            </button>
                        </li>
                    </ul>

                    <div className="client-sidebar-version">
                        <span>إصدار البوابة</span>
                        <strong>v{CLIENT_PORTAL_VERSION}</strong>
                    </div>
                </aside>

                <main className="client-main">
                    <header className="client-topbar">
                        <div className="client-topbar-title">
                            <h1>{title}</h1>
                            <span>إدارة الإعلانات والطلبات من مكان واحد</span>
                        </div>
                        <div className="client-topbar-user">
                            <button type="button" className="client-icon-btn" onClick={toggleTheme} title="تبديل المظهر">
                                <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                            </button>
                            <div className="client-avatar">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <div>
                                <strong>{userProfile?.storeName || 'معلن'}</strong>
                                <small>{userProfile?.email || 'حساب معلن'}</small>
                            </div>
                        </div>
                    </header>

                    <div className="client-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
