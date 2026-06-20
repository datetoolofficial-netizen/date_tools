'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/client/dashboard', icon: 'fa-chart-line', label: 'لوحة التحكم', key: 'dashboard' },
    { href: '/client/create-campaign', icon: 'fa-bullhorn', label: 'طلب إعلان', key: 'campaign' },
    { href: '/support', icon: 'fa-headset', label: 'الدعم الفني', key: 'support' },
    { href: '/', icon: 'fa-house', label: 'الموقع العام', key: 'home' },
];

export default function ClientShell({ active = 'dashboard', title = 'بوابة المعلنين', userProfile, children }) {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('client-theme');
        if (storedTheme === 'dark') setIsDark(true);
    }, []);

    const toggleTheme = () => {
        setIsDark((current) => {
            const next = !current;
            window.localStorage.setItem('client-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const logout = async () => {
        try {
            const [{ auth }, { signOut }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);

            await signOut(auth);
            router.replace('/client');
        } catch {
            router.replace('/client');
        }
    };

    return (
        <div className={`client-portal ${isDark ? 'dark' : ''}`} dir="rtl">
            <div className="client-shell">
                <aside className="client-sidebar">
                    <div className="client-sidebar-brand">
                        <i className="fa-solid fa-bullseye"></i>
                        <div>
                            <strong>بوابة المعلنين</strong>
                            <span>إدارة إعلانات Date Tool</span>
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
                            <button type="button" onClick={logout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span>تسجيل الخروج</span>
                            </button>
                        </li>
                    </ul>
                </aside>

                <main className="client-main">
                    <header className="client-topbar">
                        <h1>{title}</h1>
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
