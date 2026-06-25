'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './AdminDashboard.css';

const AD_BANNER_METRICS = [
    { id: 'google_top', label: 'إعلان أعلى الصفحة', icon: 'fa-rectangle-ad' },
    { id: 'custom_promo_middle', label: 'الإعلان المميز', icon: 'fa-star' },
    { id: 'google_bottom_1', label: 'إعلان أسفل الصفحة 1', icon: 'fa-panorama' },
    { id: 'google_bottom_2', label: 'إعلان أسفل الصفحة 2', icon: 'fa-panorama' },
];

function getStatValue(stats, key) {
    return Number(stats?.[key] || 0);
}

function formatStatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function formatPercent(part, total) {
    const safeTotal = Number(total || 0);
    if (safeTotal <= 0) return '0%';

    return `${((Number(part || 0) / safeTotal) * 100).toFixed(1)}%`;
}

function StatCard({ icon, title, value, color = 'blue' }) {
    return (
        <div className="legacy-stat-card">
            <div className={`legacy-stat-icon icon-${color}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div className="legacy-stat-info">
                <h3>{title}</h3>
                <p className="value">{value}</p>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [stats, setStats] = useState(null);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const firebaseApiRef = useRef(null);

    const totalVisits = getStatValue(stats, 'visits');
    const totalAdClicks = getStatValue(stats, 'adClicks');
    const totalAdImpressions = getStatValue(stats, 'adImpressions');
    const adCtr = formatPercent(totalAdClicks, totalAdImpressions);
    const adImpressionRate = formatPercent(totalAdImpressions, totalVisits);
    const adBannerStats = AD_BANNER_METRICS.map((banner) => {
        const clicks = getStatValue(stats, `ad_${banner.id}`);
        const impressions = getStatValue(stats, `adImpression_${banner.id}`);

        return {
            ...banner,
            clicks,
            impressions,
            ctr: formatPercent(clicks, impressions),
        };
    });

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadAdminDashboard() {
            try {
                const [{ auth, getAdminProfile, getAdminStats }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                ]);

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut };

                if (document.body.classList.contains('dark-mode')) {
                    setIsDarkMode(true);
                }

                const savedSidebar = window.localStorage.getItem('admin_sidebar_collapsed');
                if (savedSidebar === 'true') {
                    setIsSidebarCollapsed(true);
                }

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

                        const statsData = await getAdminStats();
                        setStats(statsData || {});
                    } catch (error) {
                        console.error('Error loading admin dashboard:', error);
                        if (isMounted) setLoadError('حدث خطأ في قراءة بيانات لوحة التحكم.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading Firebase admin modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل وحدات الإدارة.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadAdminDashboard();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

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
                <i className="fa-solid fa-satellite-dish fa-beat-fade"></i>
                <h3>جاري الاتصال بمركز القيادة...</h3>
            </div>
        );
    }

    if (loadError) {
        return <div className="admin-dashboard-error">{loadError}</div>;
    }

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

                <ul className="legacy-nav-links">
                    <li>
                        <Link href="/admin" className="active">
                            <i className="fa-solid fa-house"></i>
                            <span className="nav-text">الرئيسية</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/identity">
                            <i className="fa-solid fa-palette"></i>
                            <span className="nav-text">إدارة الهوية</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/integrations">
                            <i className="fa-solid fa-plug-circle-bolt"></i>
                            <span className="nav-text">الربط الخارجي</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/ad-settings">
                            <i className="fa-solid fa-rectangle-ad"></i>
                            <span className="nav-text">إدارة الإعلانات</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/ads">
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
                            <i className="fa-solid fa-bullhorn"></i>
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

                <section className="legacy-welcome-banner">
                    <div className="welcome-text">
                        <h1>أهلًا بك، {adminName}</h1>
                        <p>هذه هي الصفحة الرئيسية للوحة الإدارة. أبقينا الهوية كما هي، وربطناها بإحصائيات الأداة والإعلانات الحالية.</p>
                    </div>
                    <i className="fa-solid fa-chart-line"></i>
                </section>

                <section className="legacy-dashboard-section">
                    <h3 className="legacy-section-title">
                        <i className="fa-solid fa-chart-pie"></i>
                        الإحصائيات
                    </h3>

                    {stats ? (
                        <div className="legacy-stats-grid">
                            <StatCard icon="fa-users" title="إجمالي الزيارات" value={formatStatNumber(stats.visits)} color="blue" />
                            <StatCard icon="fa-calculator" title="حساب العمر" value={formatStatNumber(stats.ageCalc)} color="purple" />
                            <StatCard icon="fa-rotate" title="تحويل التواريخ" value={formatStatNumber(stats.dateConverter)} color="green" />
                            <StatCard icon="fa-hourglass-half" title="حساب فترتين" value={formatStatNumber(stats.durationCalc)} color="orange" />
                        </div>
                    ) : (
                        <p className="legacy-loading-text">جاري سحب البيانات من السيرفر...</p>
                    )}
                </section>

                <section className="legacy-dashboard-section">
                    <h3 className="legacy-section-title">
                        <i className="fa-solid fa-chart-line"></i>
                        إحصائيات الإعلانات
                    </h3>

                    {stats ? (
                        <>
                            <div className="legacy-ad-summary-grid">
                                <div className="legacy-ad-summary-card">
                                    <span>نقرات الإعلانات</span>
                                    <strong>{formatStatNumber(totalAdClicks)}</strong>
                                </div>
                                <div className="legacy-ad-summary-card">
                                    <span>مرات الظهور</span>
                                    <strong>{formatStatNumber(totalAdImpressions)}</strong>
                                </div>
                                <div className="legacy-ad-summary-card">
                                    <span>نسبة النقر للظهور</span>
                                    <strong>{adCtr}</strong>
                                </div>
                                <div className="legacy-ad-summary-card">
                                    <span>نسبة الظهور من الزيارات</span>
                                    <strong>{adImpressionRate}</strong>
                                </div>
                            </div>

                            <div className="legacy-banner-grid">
                                {adBannerStats.map((banner) => (
                                    <div className="legacy-banner-card" key={banner.id}>
                                        <div className="legacy-banner-head">
                                            <i className={`fa-solid ${banner.icon}`}></i>
                                            <strong>{banner.label}</strong>
                                        </div>
                                        <div className="legacy-banner-values">
                                            <span>
                                                نقرات
                                                <b>{formatStatNumber(banner.clicks)}</b>
                                            </span>
                                            <span>
                                                ظهور
                                                <b>{formatStatNumber(banner.impressions)}</b>
                                            </span>
                                            <span>
                                                CTR
                                                <b>{banner.ctr}</b>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="legacy-loading-text">جاري سحب بيانات الإعلانات...</p>
                    )}
                </section>

                <footer className="legacy-admin-footer">
                    <div>
                        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong>
                    </div>
                    <div className="legacy-version-badge">
                        <i className="fa-solid fa-code-commit"></i> لوحة الإدارة الرئيسية
                    </div>
                </footer>
            </main>
        </div>
    );
}
