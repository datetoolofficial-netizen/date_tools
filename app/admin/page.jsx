'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getToolSettings } from '../toolSettings';
import { useAdminShell } from './AdminShell';
import './AdminDashboard.css';

const TOOL_METRICS = [
    { key: 'ageCalc', labelKey: 'ageCalc', fallback: 'حساب العمر', icon: 'fa-calculator', tone: 'purple' },
    { key: 'dateConverter', labelKey: 'dateConverter', fallback: 'تحويل التواريخ', icon: 'fa-rotate', tone: 'blue' },
    { key: 'durationCalc', labelKey: 'durationCalc', fallback: 'حساب المدة', icon: 'fa-hourglass-half', tone: 'orange' },
    { key: 'clockTools', label: 'أدوات الساعة', icon: 'fa-clock', tone: 'cyan' },
    { key: 'weatherTools', label: 'أدوات الطقس', icon: 'fa-cloud-sun', tone: 'green' },
];

const QUICK_ACTIONS = [
    { href: '/admin/tools', label: 'إعدادات الأداة', detail: 'الهوية والصفحات والروابط', icon: 'fa-screwdriver-wrench', tone: 'blue' },
    { href: '/admin/security', label: 'الأمان', detail: 'الفحص والتقارير والخصوصية', icon: 'fa-shield-halved', tone: 'cyan' },
    { href: '/admin/tool-management', label: 'إدارة الأدوات', detail: 'المحتوى والأسئلة والأحداث', icon: 'fa-toolbox', tone: 'purple' },
    { href: '/admin/ads', label: 'الحملات الإعلانية', detail: 'المراجعة والتفعيل والأداء', icon: 'fa-bullhorn', tone: 'orange' },
    { href: '/admin/support', label: 'التذاكر', detail: 'طلبات العملاء والمتابعة', icon: 'fa-ticket', tone: 'green' },
];

function numberValue(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
    return numberValue(value).toLocaleString('en-US');
}

function formatPercent(part, total) {
    const safeTotal = numberValue(total);
    if (safeTotal <= 0) return '0%';
    return `${((numberValue(part) / safeTotal) * 100).toFixed(1)}%`;
}

function toMillis(value) {
    if (!value) return 0;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    if (typeof value?.toDate === 'function') return value.toDate().getTime();
    if (typeof value === 'object' && Number.isFinite(value.seconds)) return value.seconds * 1000;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatDateTime(value) {
    const timestamp = toMillis(value);
    if (!timestamp) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-SA', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(timestamp));
}

function isEnabled(item) {
    return item?.enabled !== false;
}

function KpiCard({ icon, title, value, note, tone = 'blue' }) {
    return (
        <article className={`admin-overview-kpi tone-${tone}`}>
            <span className="admin-overview-kpi-icon"><i className={`fa-solid ${icon}`} aria-hidden="true"></i></span>
            <div>
                <span>{title}</span>
                <strong dir="ltr">{value}</strong>
                <small>{note}</small>
            </div>
        </article>
    );
}

function PanelHeading({ icon, title, description, action }) {
    return (
        <header className="admin-overview-panel-head">
            <div>
                <span className="admin-overview-panel-icon"><i className={`fa-solid ${icon}`} aria-hidden="true"></i></span>
                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
            {action}
        </header>
    );
}

async function loadOptionalCollection(db, collectionName) {
    try {
        const { collection, getDocs } = await import('firebase/firestore');
        const snapshot = await getDocs(collection(db, collectionName));
        return {
            available: true,
            items: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        };
    } catch {
        return { available: false, items: [] };
    }
}

async function loadOptionalTickets(auth) {
    try {
        if (typeof auth?.authStateReady === 'function') await auth.authStateReady();
        if (!auth?.currentUser) return { available: false, items: [] };
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/admin/support', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.ok === false) return { available: false, items: [] };
        return { available: true, items: Array.isArray(payload.tickets) ? payload.tickets : [] };
    } catch {
        return { available: false, items: [] };
    }
}

export default function AdminDashboardPage() {
    const adminShell = useAdminShell();
    const adminName = adminShell?.adminName || 'أيها المدير';
    const adminRole = adminShell?.adminRole || 'مدير';
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [stats, setStats] = useState({});
    const [siteConfig, setSiteConfig] = useState({});
    const [campaignData, setCampaignData] = useState({ available: false, items: [] });
    const [advertiserData, setAdvertiserData] = useState({ available: false, items: [] });
    const [ticketData, setTicketData] = useState({ available: false, items: [] });
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const loadDashboard = useCallback(async ({ silent = false } = {}) => {
        if (silent) setRefreshing(true);
        else setLoading(true);
        setLoadError('');

        try {
            const { db, getAdminStats, getFirebaseAuth, getSiteConfig } = await import('../firebase');
            const auth = await getFirebaseAuth();
            const [statsResult, configResult, campaignsResult, advertisersResult, ticketsResult] = await Promise.all([
                getAdminStats(),
                getSiteConfig(),
                loadOptionalCollection(db, 'campaigns'),
                loadOptionalCollection(db, 'advertisers'),
                loadOptionalTickets(auth),
            ]);

            setStats(statsResult || {});
            setSiteConfig(configResult || {});
            setCampaignData(campaignsResult);
            setAdvertiserData(advertisersResult);
            setTicketData(ticketsResult);
            setLastRefreshed(new Date());
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
            setLoadError('تعذر تحميل مؤشرات لوحة التحكم. أعد المحاولة بعد لحظات.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const dateToolSettings = getToolSettings(siteConfig, 'date');
    const toolMetrics = useMemo(() => TOOL_METRICS.map((item) => ({
        ...item,
        label: item.label || dateToolSettings.subtools?.[item.labelKey] || item.fallback,
        value: numberValue(stats[item.key]),
    })), [dateToolSettings.subtools, stats]);
    const totalToolUses = toolMetrics.reduce((total, item) => total + item.value, 0);
    const maxToolUses = Math.max(1, ...toolMetrics.map((item) => item.value));

    const campaigns = campaignData.items;
    const campaignSummary = useMemo(() => campaigns.reduce((summary, campaign) => {
        const status = campaign.status || 'قيد المراجعة';
        summary.total += 1;
        summary.views += numberValue(campaign.views);
        summary.clicks += numberValue(campaign.clicks);
        if (status === 'نشط') summary.active += 1;
        else if (['قيد المراجعة', 'تم تعديله'].includes(status)) summary.pending += 1;
        else if (status === 'متوقف مؤقتاً') summary.paused += 1;
        else if (status === 'منتهي') summary.ended += 1;
        return summary;
    }, { total: 0, active: 0, pending: 0, paused: 0, ended: 0, views: 0, clicks: 0 }), [campaigns]);

    const advertisers = advertiserData.items;
    const activeAdvertisers = advertisers.filter((advertiser) => advertiser.status === 'active').length;
    const pendingAdvertisers = Math.max(0, advertisers.length - activeAdvertisers);
    const tickets = ticketData.items;
    const openTickets = tickets.filter((ticket) => ticket.status !== 'مغلقة').length;
    const newTickets = tickets.filter((ticket) => !ticket.status || ticket.status === 'جديدة').length;

    const totalVisits = numberValue(stats.visits);
    const adClicks = numberValue(stats.adClicks);
    const adImpressions = numberValue(stats.adImpressions);
    const adCtr = formatPercent(adClicks, adImpressions);

    const configSummary = useMemo(() => {
        const pages = Array.isArray(siteConfig.internalPages) ? siteConfig.internalPages : [];
        const links = Array.isArray(siteConfig.externalLinks) ? siteConfig.externalLinks : [];
        const socials = Array.isArray(siteConfig.socialLinks) ? siteConfig.socialLinks : [];
        const slots = Object.values(siteConfig.googleAdSlots || {});
        return {
            pages: pages.filter(isEnabled).length,
            links: links.filter(isEnabled).length,
            socials: socials.filter(isEnabled).length,
            googleSlots: slots.filter((slot) => slot?.enabledWhenNoAdvertiser === true).length,
            houseSlots: slots.filter((slot) => slot?.showHouseAd === true).length,
        };
    }, [siteConfig]);

    const recentActivities = useMemo(() => {
        const campaignActivities = campaigns.map((campaign) => ({
            id: `campaign-${campaign.id}`,
            type: 'حملة',
            title: campaign.campaignName || campaign.campaignNumber || 'حملة إعلانية',
            meta: campaign.status || 'قيد المراجعة',
            href: '/admin/ads',
            icon: 'fa-bullhorn',
            tone: 'orange',
            date: campaign.updatedAt || campaign.createdAt,
        }));
        const ticketActivities = tickets.map((ticket) => ({
            id: `ticket-${ticket.id}`,
            type: 'تذكرة',
            title: ticket.subject || ticket.ticketNumber || 'تذكرة دعم',
            meta: ticket.status || 'جديدة',
            href: '/admin/support',
            icon: 'fa-ticket',
            tone: 'green',
            date: ticket.updatedAt || ticket.createdAt,
        }));
        return [...campaignActivities, ...ticketActivities]
            .sort((a, b) => toMillis(b.date) - toMillis(a.date))
            .slice(0, 6);
    }, [campaigns, tickets]);

    if (loading) {
        return (
            <div className="admin-dashboard-loading admin-overview-loading">
                <i className="fa-solid fa-chart-line fa-beat-fade"></i>
                <h3>جاري تجهيز المؤشرات الإحصائية...</h3>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="admin-dashboard-error admin-overview-error">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p>{loadError}</p>
                <button type="button" className="legacy-primary-btn" onClick={() => loadDashboard()}>إعادة المحاولة</button>
            </div>
        );
    }

    return (
        <div className="admin-overview-page" dir="rtl">
            <section className="admin-overview-hero">
                <div className="admin-overview-hero-copy">
                    <span className="admin-overview-eyebrow">نظرة عامة على المنصة</span>
                    <h1>مرحبًا، {adminName}</h1>
                    <p>مؤشرات الزيارات والأدوات والإعلانات والعملاء والدعم في شاشة تشغيل واحدة.</p>
                </div>
                <div className="admin-overview-hero-actions">
                    <span className="admin-overview-role"><i className="fa-solid fa-shield-halved"></i>{adminRole}</span>
                    <button type="button" className="admin-overview-refresh" onClick={() => loadDashboard({ silent: true })} disabled={refreshing}>
                        <i className={`fa-solid fa-rotate ${refreshing ? 'fa-spin' : ''}`}></i>
                        {refreshing ? 'جارٍ التحديث' : 'تحديث البيانات'}
                    </button>
                    <small>{lastRefreshed ? `آخر تحديث: ${formatDateTime(lastRefreshed)}` : 'لم تُحدّث بعد'}</small>
                </div>
            </section>

            <section className="admin-overview-kpi-grid" aria-label="المؤشرات الرئيسية">
                <KpiCard icon="fa-users" title="إجمالي الزيارات" value={formatNumber(totalVisits)} note="زيارات مسجلة للمنصة" tone="blue" />
                <KpiCard icon="fa-wand-magic-sparkles" title="استخدام الأدوات" value={formatNumber(totalToolUses)} note={`${formatPercent(totalToolUses, totalVisits)} من الزيارات`} tone="purple" />
                <KpiCard icon="fa-eye" title="ظهور الإعلانات" value={formatNumber(adImpressions)} note={`${formatPercent(adImpressions, totalVisits)} من الزيارات`} tone="cyan" />
                <KpiCard icon="fa-arrow-pointer" title="نقرات الإعلانات" value={formatNumber(adClicks)} note={`CTR ${adCtr}`} tone="orange" />
                <KpiCard icon="fa-bullhorn" title="الحملات النشطة" value={campaignData.available ? formatNumber(campaignSummary.active) : '—'} note={campaignData.available ? `${campaignSummary.total} حملة إجمالًا` : 'حسب صلاحية الحملات'} tone="green" />
                <KpiCard icon="fa-hourglass" title="بانتظار المراجعة" value={campaignData.available ? formatNumber(campaignSummary.pending) : '—'} note={campaignData.available ? `${campaignSummary.paused} متوقفة مؤقتًا` : 'حسب صلاحية الحملات'} tone="orange" />
                <KpiCard icon="fa-store" title="المعلنون" value={advertiserData.available ? formatNumber(advertisers.length) : '—'} note={advertiserData.available ? `${activeAdvertisers} نشط، ${pendingAdvertisers} قيد التفعيل` : 'حسب صلاحية المعلنين'} tone="purple" />
                <KpiCard icon="fa-ticket" title="تذاكر مفتوحة" value={ticketData.available ? formatNumber(openTickets) : '—'} note={ticketData.available ? `${newTickets} تذكرة جديدة` : 'حسب صلاحية التذاكر'} tone="red" />
            </section>

            <section className="admin-overview-two-column">
                <article className="admin-overview-panel">
                    <PanelHeading icon="fa-chart-simple" title="استخدام الأدوات" description="حجم الاستخدام المسجل لكل مجموعة أدوات." />
                    <div className="admin-overview-usage-list">
                        {toolMetrics.map((tool) => {
                            const share = totalToolUses > 0 ? (tool.value / totalToolUses) * 100 : 0;
                            const width = tool.value > 0 ? Math.max(5, (tool.value / maxToolUses) * 100) : 0;
                            return (
                                <div className="admin-overview-usage-row" key={tool.key}>
                                    <span className={`admin-overview-usage-icon tone-${tool.tone}`}><i className={`fa-solid ${tool.icon}`}></i></span>
                                    <div className="admin-overview-usage-data">
                                        <div><strong>{tool.label}</strong><span>{share.toFixed(1)}%</span></div>
                                        <div className="admin-overview-progress"><span className={`tone-${tool.tone}`} style={{ width: `${width}%` }}></span></div>
                                    </div>
                                    <b dir="ltr">{formatNumber(tool.value)}</b>
                                </div>
                            );
                        })}
                    </div>
                </article>

                <article className="admin-overview-panel">
                    <PanelHeading icon="fa-sliders" title="حالة المحتوى والعرض" description="ملخص العناصر المفعلة حاليًا في واجهة الموقع." />
                    <div className="admin-overview-config-grid">
                        <div><span><i className="fa-solid fa-file-lines"></i>الصفحات المنشورة</span><strong>{formatNumber(configSummary.pages)}</strong></div>
                        <div><span><i className="fa-solid fa-link"></i>الروابط الخارجية</span><strong>{formatNumber(configSummary.links)}</strong></div>
                        <div><span><i className="fa-solid fa-hashtag"></i>قنوات التواصل</span><strong>{formatNumber(configSummary.socials)}</strong></div>
                        <div><span><i className="fa-brands fa-google"></i>مواضع Google</span><strong>{formatNumber(configSummary.googleSlots)}</strong></div>
                        <div><span><i className="fa-solid fa-bullhorn"></i>النصوص التسويقية</span><strong>{formatNumber(configSummary.houseSlots)}</strong></div>
                        <div><span><i className="fa-solid fa-screwdriver-wrench"></i>مجموعات الأدوات</span><strong>3</strong></div>
                    </div>
                    <div className="admin-overview-system-note">
                        <i className="fa-solid fa-circle-check"></i>
                        <div><strong>الإحصاءات متصلة</strong><span>آخر تسجيل في قاعدة البيانات: {formatDateTime(stats.lastUpdated)}</span></div>
                    </div>
                </article>
            </section>

            <section className="admin-overview-panel admin-overview-ads-panel">
                <PanelHeading
                    icon="fa-chart-line"
                    title="أداء الإعلانات والحملات"
                    description="النتائج الإجمالية مع حالة الحملات المسجلة في المنصة."
                    action={<Link href="/admin/ads" className="admin-overview-panel-link">إدارة الحملات <i className="fa-solid fa-arrow-left"></i></Link>}
                />
                <div className="admin-overview-ad-grid">
                    <div className="admin-overview-ad-primary">
                        <span>معدل النقر إلى الظهور</span>
                        <strong dir="ltr">{adCtr}</strong>
                        <small>{formatNumber(adClicks)} نقرة من {formatNumber(adImpressions)} ظهور</small>
                    </div>
                    <div><span>كل الحملات</span><strong>{campaignData.available ? formatNumber(campaignSummary.total) : '—'}</strong></div>
                    <div><span>نشطة</span><strong>{campaignData.available ? formatNumber(campaignSummary.active) : '—'}</strong></div>
                    <div><span>قيد المراجعة</span><strong>{campaignData.available ? formatNumber(campaignSummary.pending) : '—'}</strong></div>
                    <div><span>متوقفة</span><strong>{campaignData.available ? formatNumber(campaignSummary.paused) : '—'}</strong></div>
                    <div><span>مشاهدات الحملات</span><strong>{campaignData.available ? formatNumber(campaignSummary.views) : '—'}</strong></div>
                    <div><span>نقرات الحملات</span><strong>{campaignData.available ? formatNumber(campaignSummary.clicks) : '—'}</strong></div>
                </div>
            </section>

            <section className="admin-overview-two-column admin-overview-bottom-grid">
                <article className="admin-overview-panel">
                    <PanelHeading icon="fa-clock-rotate-left" title="أحدث النشاطات" description="آخر تحديثات الحملات وتذاكر الدعم." />
                    {recentActivities.length > 0 ? (
                        <div className="admin-overview-activity-list">
                            {recentActivities.map((activity) => (
                                <Link href={activity.href} className="admin-overview-activity" key={activity.id}>
                                    <span className={`tone-${activity.tone}`}><i className={`fa-solid ${activity.icon}`}></i></span>
                                    <div><strong>{activity.title}</strong><small>{activity.type} · {activity.meta}</small></div>
                                    <time>{formatDateTime(activity.date)}</time>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="admin-overview-empty"><i className="fa-regular fa-folder-open"></i><span>لا توجد نشاطات حديثة متاحة.</span></div>
                    )}
                </article>

                <article className="admin-overview-panel">
                    <PanelHeading icon="fa-bolt" title="إجراءات سريعة" description="انتقل مباشرة إلى أكثر مهام الإدارة استخدامًا." />
                    <nav className="admin-overview-quick-grid" aria-label="إجراءات الإدارة السريعة">
                        {QUICK_ACTIONS.map((action) => (
                            <Link href={action.href} key={action.href}>
                                <span className={`tone-${action.tone}`}><i className={`fa-solid ${action.icon}`}></i></span>
                                <div><strong>{action.label}</strong><small>{action.detail}</small></div>
                                <i className="fa-solid fa-chevron-left"></i>
                            </Link>
                        ))}
                    </nav>
                </article>
            </section>
        </div>
    );
}
