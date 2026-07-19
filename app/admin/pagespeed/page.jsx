'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import '../AdminDashboard.css';

const PAGE_TARGETS = [
    { label: 'الرئيسية / أداة التاريخ', value: 'https://date-tool.com/' },
    { label: 'أداة الساعة', value: 'https://date-tool.com/clock' },
    { label: 'أداة الطقس', value: 'https://date-tool.com/weather' },
    { label: 'اتصل بنا', value: 'https://date-tool.com/contact' },
    { label: 'الشروط', value: 'https://date-tool.com/terms' },
    { label: 'الخصوصية', value: 'https://date-tool.com/privacy' },
];

const SCORE_ITEMS = [
    { key: 'performance', label: 'الأداء', icon: 'fa-gauge-high' },
    { key: 'accessibility', label: 'سهولة الوصول', icon: 'fa-universal-access' },
    { key: 'bestPractices', label: 'أفضل الممارسات', icon: 'fa-shield-halved' },
    { key: 'seo', label: 'SEO', icon: 'fa-magnifying-glass-chart' },
];

const METRIC_LABELS = {
    'first-contentful-paint': 'FCP',
    'largest-contentful-paint': 'LCP',
    'total-blocking-time': 'TBT',
    'cumulative-layout-shift': 'CLS',
    'speed-index': 'Speed Index',
    interactive: 'TTI',
    'interaction-to-next-paint': 'INP',
};

const FIELD_METRIC_LABELS = {
    FIRST_CONTENTFUL_PAINT_MS: 'FCP',
    LARGEST_CONTENTFUL_PAINT_MS: 'LCP',
    CUMULATIVE_LAYOUT_SHIFT_SCORE: 'CLS',
    INTERACTION_TO_NEXT_PAINT: 'INP',
    EXPERIMENTAL_TIME_TO_FIRST_BYTE: 'TTFB',
};

function scoreClass(score) {
    if (typeof score !== 'number') return 'unknown';
    if (score >= 90) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
}

function formatScore(score) {
    return typeof score === 'number' ? score.toLocaleString('en-US') : '--';
}

function formatDate(value) {
    if (!value) return '---';

    try {
        return new Intl.DateTimeFormat('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function getFieldStatusLabel(value) {
    if (value === 'FAST') return 'جيد';
    if (value === 'AVERAGE') return 'متوسط';
    if (value === 'SLOW') return 'بطيء';
    return 'لا توجد بيانات كافية';
}

function AdminNav({ active = 'pagespeed' }) {
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
                <Link href="/admin/pagespeed" className={active === 'pagespeed' ? 'active' : ''}>
                    <i className="fa-solid fa-gauge-high"></i>
                    <span className="nav-text">PageSpeed</span>
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
                <Link href="/admin/tool-management" className={active === 'tool-management' ? 'active' : ''}>
                    <i className="fa-solid fa-toolbox"></i>
                    <span className="nav-text">إدارة الأدوات</span>
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

function ScoreCard({ item, score }) {
    const status = scoreClass(score);

    return (
        <div className={`pagespeed-score-card ${status}`}>
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
            <strong>{formatScore(score)}</strong>
        </div>
    );
}

function MetricCard({ metric }) {
    return (
        <div className={`pagespeed-metric-card ${scoreClass(metric.score)}`}>
            <span>{METRIC_LABELS[metric.id] || metric.title}</span>
            <strong dir="ltr">{metric.displayValue || '---'}</strong>
            <small>Score {formatScore(metric.score)}</small>
        </div>
    );
}

function FieldDataBlock({ title, fieldData }) {
    const metrics = Object.entries(fieldData?.metrics || {});

    return (
        <div className="pagespeed-field-card">
            <div>
                <strong>{title}</strong>
                <span className={`pagespeed-field-status ${String(fieldData?.overallCategory || 'none').toLowerCase()}`}>
                    {getFieldStatusLabel(fieldData?.overallCategory)}
                </span>
            </div>
            {fieldData?.id ? <small dir="ltr">{fieldData.id}</small> : null}
            <div className="pagespeed-field-metrics">
                {metrics.length ? metrics.map(([key, metric]) => (
                    <span key={key}>
                        <b>{FIELD_METRIC_LABELS[key] || key}</b>
                        <em>{metric.percentile ?? '--'}</em>
                    </span>
                )) : <p>لا توجد بيانات ميدانية كافية لهذه الصفحة بعد.</p>}
            </div>
        </div>
    );
}

function OpportunitiesTable({ opportunities }) {
    if (!opportunities?.length) {
        return (
            <div className="pagespeed-empty-note">
                لا توجد عناصر حرجة ظاهرة في ملخص الفحص الحالي.
            </div>
        );
    }

    return (
        <div className="legacy-table-card pagespeed-table-card">
            <table className="legacy-ads-table pagespeed-audits-table">
                <thead>
                    <tr>
                        <th>الملاحظة</th>
                        <th>القيمة</th>
                        <th>الدرجة</th>
                        <th>الأثر</th>
                    </tr>
                </thead>
                <tbody>
                    {opportunities.map((audit) => (
                        <tr key={audit.id}>
                            <td>
                                <strong>{audit.title}</strong>
                                <small>{audit.description}</small>
                            </td>
                            <td dir="ltr">{audit.displayValue || '---'}</td>
                            <td>{formatScore(audit.score)}</td>
                            <td>
                                {audit.savingsMs ? `${audit.savingsMs.toLocaleString('en-US')}ms` : null}
                                {audit.savingsBytes ? `${audit.savingsBytes.toLocaleString('en-US')} bytes` : null}
                                {!audit.savingsMs && !audit.savingsBytes ? 'تحسين عام' : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ReportPanel({ report, strategy }) {
    const title = strategy === 'mobile' ? 'تقرير الجوال' : 'تقرير الكمبيوتر';
    const icon = strategy === 'mobile' ? 'fa-mobile-screen-button' : 'fa-desktop';

    if (!report) {
        return (
            <section className="legacy-google-card pagespeed-report-card is-empty">
                <div className="pagespeed-report-title">
                    <i className={`fa-solid ${icon}`}></i>
                    <h2>{title}</h2>
                </div>
                <p>اضغط زر الفحص لقراءة تقرير PageSpeed لهذه الاستراتيجية.</p>
            </section>
        );
    }

    return (
        <section className="legacy-google-card pagespeed-report-card">
            <div className="pagespeed-report-title">
                <i className={`fa-solid ${icon}`}></i>
                <div>
                    <h2>{title}</h2>
                    <p>
                        آخر فحص: {formatDate(report.fetchTime || report.analysisUTCTimestamp)}
                        {report.cached ? ' - من الكاش المؤقت' : ''}
                    </p>
                </div>
            </div>

            <div className="pagespeed-score-grid">
                {SCORE_ITEMS.map((item) => (
                    <ScoreCard key={item.key} item={item} score={report.scores?.[item.key]} />
                ))}
            </div>

            <div className="pagespeed-metrics-grid">
                {Object.values(report.metrics || {}).map((metric) => (
                    <MetricCard key={metric.id} metric={metric} />
                ))}
            </div>

            {report.warnings?.length ? (
                <div className="pagespeed-warning">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <div>
                        <strong>تنبيهات الفحص</strong>
                        {report.warnings.map((warning, index) => (
                            <p key={`${warning}-${index}`}>{warning}</p>
                        ))}
                    </div>
                </div>
            ) : null}

            <div className="pagespeed-field-grid">
                <FieldDataBlock title="بيانات الصفحة من المستخدمين" fieldData={report.fieldData?.page} />
                <FieldDataBlock title="بيانات الدومين من المستخدمين" fieldData={report.fieldData?.origin} />
            </div>

            <div className="legacy-page-heading pagespeed-opportunities-head">
                <div>
                    <h2 className="legacy-section-title">
                        <i className="fa-solid fa-list-check"></i>
                        أهم ملاحظات التحسين
                    </h2>
                    <p>هذه خلاصة مختصرة من Lighthouse، مرتبة حسب الأثر التقريبي حتى لا تصبح الصفحة مزدحمة.</p>
                </div>
            </div>
            <OpportunitiesTable opportunities={report.opportunities} />
        </section>
    );
}

export default function AdminPagespeedPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [adminName, setAdminName] = useState('أيها المدير');
    const [adminRole, setAdminRole] = useState('مدير');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(null);
    const [targetUrl, setTargetUrl] = useState(PAGE_TARGETS[0].value);
    const [reports, setReports] = useState({ mobile: null, desktop: null });
    const [runningStrategy, setRunningStrategy] = useState('');
    const firebaseApiRef = useRef(null);
    const currentUserRef = useRef(null);
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let unsubscribe = () => {};
        let isMounted = true;

        async function loadPagespeedPage() {
            try {
                const [{ getFirebaseAuth, getAdminProfile }, { onAuthStateChanged, signOut }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();

                if (!isMounted) return;

                firebaseApiRef.current = { auth, signOut };

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

                        currentUserRef.current = user;
                        setAdminName(adminProfile.name || adminProfile.email || 'أيها المدير');
                        setAdminRole(adminProfile.role === 'super_admin' ? 'المدير العام' : 'مدير');
                    } catch (error) {
                        console.error('Error loading PageSpeed page:', error);
                        if (isMounted) setLoadError('حدث خطأ في التحقق من صلاحيات صفحة PageSpeed.');
                    } finally {
                        if (isMounted) setIsCheckingAuth(false);
                    }
                });
            } catch (error) {
                console.error('Error loading PageSpeed modules:', error);
                if (isMounted) {
                    setLoadError('تعذر تحميل صفحة PageSpeed.');
                    setIsCheckingAuth(false);
                }
            }
        }

        loadPagespeedPage();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => () => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    }, []);

    const showMessage = useCallback((type, text) => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setMessage({ type, text });
        messageTimerRef.current = window.setTimeout(() => setMessage(null), 4500);
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
            if (firebaseApi?.signOut && firebaseApi?.auth) await firebaseApi.signOut(firebaseApi.auth);
        } finally {
            window.location.replace('/admin_login');
        }
    };

    const requestReport = useCallback(async (strategy) => {
        const currentUser = currentUserRef.current;
        if (!currentUser) throw new Error('admin_session_missing');

        const token = await currentUser.getIdToken();
        const params = new URLSearchParams({ strategy, url: targetUrl });
        const response = await fetch(`/api/pagespeed?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
            throw new Error(data.message || 'تعذر جلب تقرير PageSpeed الآن.');
        }

        setReports((current) => ({
            ...current,
            [strategy]: data,
        }));

        return data;
    }, [targetUrl]);

    const runSingleReport = async (strategy) => {
        setRunningStrategy(strategy);
        showMessage('info', strategy === 'mobile' ? 'جاري فحص نسخة الجوال...' : 'جاري فحص نسخة الكمبيوتر...');

        try {
            await requestReport(strategy);
            showMessage('success', 'تم تحديث تقرير PageSpeed بنجاح.');
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'تعذر جلب تقرير PageSpeed.');
        } finally {
            setRunningStrategy('');
        }
    };

    const runAllReports = async () => {
        setRunningStrategy('all');
        showMessage('info', 'جاري فحص الجوال والكمبيوتر...');

        try {
            await Promise.all([
                requestReport('mobile'),
                requestReport('desktop'),
            ]);
            showMessage('success', 'تم تحديث تقارير PageSpeed للجوال والكمبيوتر.');
        } catch (error) {
            showMessage('error', error instanceof Error ? error.message : 'تعذر جلب كل تقارير PageSpeed.');
        } finally {
            setRunningStrategy('');
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-gauge-high fa-beat-fade"></i>
                <h3>جاري فتح PageSpeed...</h3>
            </div>
        );
    }

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    const isRunning = Boolean(runningStrategy);

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
                <AdminNav active="pagespeed" />
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

                <Toast
                    message={message?.text || ''}
                    type={message?.type || 'info'}
                    visible={Boolean(message?.text)}
                    onClose={() => setMessage(null)}
                />

                <section className="legacy-ads-hero pagespeed-hero">
                    <div>
                        <h1>
                            <i className="fa-solid fa-gauge-high"></i>
                            PageSpeed API
                        </h1>
                        <p>قراءة منظمة لتقارير Google PageSpeed Insights للجوال والكمبيوتر من داخل لوحة الإدارة.</p>
                    </div>
                    <button className="legacy-primary-btn" onClick={runAllReports} disabled={isRunning}>
                        <i className="fa-solid fa-rotate"></i>
                        {runningStrategy === 'all' ? 'جاري الفحص...' : 'فحص الجوال والكمبيوتر'}
                    </button>
                </section>

                <section className="legacy-google-card pagespeed-control-card">
                    <div className="legacy-page-heading">
                        <div>
                            <h2 className="legacy-section-title">
                                <i className="fa-solid fa-link"></i>
                                الصفحة المراد فحصها
                            </h2>
                            <p>الفحص محصور على صفحات `date-tool.com` فقط، ويتم حذف أي query string قبل إرسال الرابط إلى Google.</p>
                        </div>
                    </div>

                    <div className="pagespeed-controls">
                        <label className="legacy-field">
                            <span>اختر الصفحة</span>
                            <select value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)}>
                                {PAGE_TARGETS.map((target) => (
                                    <option value={target.value} key={target.value}>{target.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="legacy-field">
                            <span>الرابط النهائي</span>
                            <input
                                type="url"
                                dir="ltr"
                                value={targetUrl}
                                onChange={(event) => setTargetUrl(event.target.value)}
                                placeholder="https://date-tool.com/"
                            />
                        </label>

                        <div className="pagespeed-actions">
                            <button className="legacy-secondary-btn" onClick={() => runSingleReport('mobile')} disabled={isRunning}>
                                <i className="fa-solid fa-mobile-screen-button"></i>
                                {runningStrategy === 'mobile' ? 'يفحص...' : 'فحص الجوال'}
                            </button>
                            <button className="legacy-secondary-btn" onClick={() => runSingleReport('desktop')} disabled={isRunning}>
                                <i className="fa-solid fa-desktop"></i>
                                {runningStrategy === 'desktop' ? 'يفحص...' : 'فحص الكمبيوتر'}
                            </button>
                        </div>
                    </div>

                    <div className="integrations-safe-note pagespeed-safe-note">
                        <i className="fa-solid fa-lock"></i>
                        <div>
                            <strong>ملاحظة تشغيل</strong>
                            <p>إذا ظهرت رسالة كوتا Google، أضف سر Cloudflare باسم <span dir="ltr">PAGESPEED_API_KEY</span>. المفتاح يبقى في الخادم ولا يظهر في المتصفح.</p>
                        </div>
                    </div>
                </section>

                <div className="pagespeed-report-grid">
                    <ReportPanel strategy="mobile" report={reports.mobile} />
                    <ReportPanel strategy="desktop" report={reports.desktop} />
                </div>

                <footer className="legacy-admin-footer">
                    <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong>بوابة الإدارة</strong></div>
                    <div className="legacy-version-badge"><i className="fa-solid fa-gauge-high"></i> PageSpeed</div>
                </footer>
            </main>
        </div>
    );
}
