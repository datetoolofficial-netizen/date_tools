'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import { useClientPortal } from '../ClientShell';
import {
    ADVERTISER_PERMISSIONS,
    formatOrganizationNumber,
    hasAdvertiserPermission,
    resolveOrganizationNumber,
} from '../../advertiserAccess';
import { listLocalAdvertiserCampaigns, updateLocalAdvertiserCampaignStatus } from '../localAdvertiserDemo';

const STATUS_OPTIONS = ['مسودة', 'قيد المراجعة', 'نشط', 'متوقف مؤقتاً', 'مرفوض', 'منتهي', 'تم تعديله'];

function getStatusClass(status) {
    if (status === 'نشط' || status === 'مقبول') return 'active';
    if (status === 'متوقف مؤقتاً') return 'paused';
    if (status === 'مرفوض') return 'rejected';
    if (status === 'منتهي') return 'ended';
    return 'pending';
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function formatDate(value) {
    if (!value) return '-';

    try {
        return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    } catch {
        return '-';
    }
}

export default function ClientDashboardPage() {
    const { profile, currentUser, isLocalDemo } = useClientPortal();
    const [campaigns, setCampaigns] = useState([]);
    const [filters, setFilters] = useState({ search: '', status: 'all', date: '' });
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadClientData() {
            if (!profile || !currentUser) return;

            if (isLocalDemo) {
                setCampaigns(await listLocalAdvertiserCampaigns(profile));
                setIsLoading(false);
                return;
            }

            try {
                const [{ db }, { collection, getDocs, query, where }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
                ]);
                const organizationId = profile.organizationId || currentUser.uid;
                const [organizationCampaigns, legacyOwnCampaigns] = await Promise.all([
                    getDocs(query(collection(db, 'campaigns'), where('advertiserOrganizationId', '==', organizationId))),
                    getDocs(query(collection(db, 'campaigns'), where('advertiserId', '==', currentUser.uid))),
                ]);
                const campaignDocuments = new Map();
                [...organizationCampaigns.docs, ...legacyOwnCampaigns.docs].forEach((item) => {
                    campaignDocuments.set(item.id, { id: item.id, ...item.data() });
                });
                const nextCampaigns = Array.from(campaignDocuments.values())
                    .sort((a, b) => String(b.createdAt?.seconds || b.createdAt || '').localeCompare(String(a.createdAt?.seconds || a.createdAt || '')));

                setCampaigns(nextCampaigns);
            } catch {
                console.error('Client campaigns load failed.');
                setMessage({ text: 'تعذر تحميل بيانات حملاتك الآن.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadClientData();
    }, [currentUser, isLocalDemo, profile]);

    const filteredCampaigns = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const name = String(campaign.campaignName || '').toLowerCase();
            const id = String(campaign.campaignNumber || campaign.campaignId || campaign.id || '').toLowerCase();
            const status = campaign.status || 'قيد المراجعة';
            const dateMatch = !filters.date
                || String(campaign.startTime || '').startsWith(filters.date)
                || String(campaign.endTime || '').startsWith(filters.date);

            return (!search || name.includes(search) || id.includes(search))
                && (filters.status === 'all' || status === filters.status)
                && dateMatch;
        });
    }, [campaigns, filters]);

    const stats = useMemo(() => {
        const views = campaigns.reduce((sum, item) => sum + Number(item.views || item.impressions || 0), 0);
        const clicks = campaigns.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
        const active = campaigns.filter((item) => item.status === 'نشط').length;
        const ctr = views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '0%';

        return { views, clicks, active, ctr };
    }, [campaigns]);

    const canCreateCampaign = hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE);
    const canUpdateCampaign = hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_PAUSE);
    const organizationNumber = profile ? resolveOrganizationNumber(profile) : '';

    const copyOrganizationNumber = async () => {
        try {
            await navigator.clipboard.writeText(organizationNumber);
            setMessage({ text: 'تم نسخ رقم المنظمة.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر نسخ الرقم تلقائيًا. حدده وانسخه يدويًا.', type: 'error' });
        }
    };

    const updateCampaignStatus = async (campaignId, status) => {
        try {
            if (isLocalDemo) {
                await updateLocalAdvertiserCampaignStatus(profile, campaignId, status);
                setCampaigns((current) => current.map((item) => item.id === campaignId ? { ...item, status } : item));
                setMessage({ text: 'تم تحديث حالة الإعلان داخل التجربة المحلية.', type: 'success' });
                return;
            }

            const [{ db }, { doc, serverTimestamp, updateDoc }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);

            await updateDoc(doc(db, 'campaigns', campaignId), {
                status,
                updatedAt: serverTimestamp(),
            });

            setCampaigns((current) => current.map((item) => item.id === campaignId ? { ...item, status } : item));
            setMessage({ text: 'تم تحديث حالة الإعلان.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر تحديث الإعلان. القواعد تسمح للمعلن بتغيير الحالة المحددة فقط.', type: 'error' });
        }
    };

    return (
        <>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <section className="client-stats-grid">
                <article className="client-stat-card tone-teal">
                    <span className="client-stat-icon"><i className="fa-solid fa-eye"></i></span>
                    <div>
                        <span>إجمالي الظهور</span>
                        <strong>{isLoading ? '...' : formatNumber(stats.views)}</strong>
                        <small>مرات ظهور الإعلانات</small>
                    </div>
                </article>
                <article className="client-stat-card tone-green">
                    <span className="client-stat-icon"><i className="fa-solid fa-arrow-pointer"></i></span>
                    <div>
                        <span>إجمالي النقرات</span>
                        <strong>{isLoading ? '...' : formatNumber(stats.clicks)}</strong>
                        <small>تفاعل الزوار مع الحملات</small>
                    </div>
                </article>
                <article className="client-stat-card tone-orange">
                    <span className="client-stat-icon"><i className="fa-solid fa-bullhorn"></i></span>
                    <div>
                        <span>الحملات النشطة</span>
                        <strong>{isLoading ? '...' : formatNumber(stats.active)}</strong>
                        <small>من {formatNumber(campaigns.length)} حملة</small>
                    </div>
                </article>
                <article className="client-stat-card tone-cyan">
                    <span className="client-stat-icon"><i className="fa-solid fa-chart-pie"></i></span>
                    <div>
                        <span>معدل النقر CTR</span>
                        <strong>{isLoading ? '...' : stats.ctr}</strong>
                        <small>النقرات مقارنة بالظهور</small>
                    </div>
                </article>
            </section>

            {profile && (
                <section className="client-organization-card" aria-label="بيانات المنظمة">
                    <span className="client-organization-icon"><i className="fa-solid fa-building-user"></i></span>
                    <div>
                        <small>رقم المنظمة الموحد</small>
                        <strong dir="ltr">{formatOrganizationNumber(organizationNumber)}</strong>
                        <p>يستخدمه مدير المنصة لربط أعضاء المنظمة بالحساب نفسه، ولا يمنح الرقم وحده صلاحية الدخول.</p>
                    </div>
                    <button type="button" className="client-secondary-btn" onClick={copyOrganizationNumber}>
                        <i className="fa-regular fa-copy"></i>
                        نسخ الرقم
                    </button>
                </section>
            )}

            <section className="client-panel">
                <header className="client-panel-header">
                    <div>
                        <span className="client-panel-icon"><i className="fa-solid fa-rectangle-ad"></i></span>
                        <div>
                            <h2>حملاتك الإعلانية</h2>
                            <p>استعرض الأداء والحالة، وابحث في جميع الحملات المرتبطة بالمنظمة.</p>
                        </div>
                    </div>
                    {canCreateCampaign ? (
                        <Link className="client-primary-btn" href="/client/create-campaign">
                            <i className="fa-solid fa-plus"></i>
                            طلب إعلان جديد
                        </Link>
                    ) : (
                        <span className="client-readonly-badge"><i className="fa-solid fa-lock"></i> عرض فقط</span>
                    )}
                </header>

                <div className="client-filters">
                    <div className="client-form-group">
                        <label>بحث</label>
                        <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="اسم الحملة أو رقم الإعلان" />
                    </div>
                    <div className="client-form-group">
                        <label>الحالة</label>
                        <select
                            value={filters.status}
                            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                            aria-label="تصفية حالة الحملات"
                            title="تصفية حالة الحملات"
                        >
                            <option value="all">كل الحالات</option>
                            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="client-form-group">
                        <label>تاريخ البداية أو النهاية</label>
                        <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
                    </div>
                </div>

                <div className="client-table-wrap">
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>الإعلان</th>
                                <th>الأوقات</th>
                                <th>النتائج</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="client-empty">
                                        {isLoading ? 'جاري تحميل الحملات...' : 'لا توجد حملات مطابقة.'}
                                    </td>
                                </tr>
                            ) : filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td>
                                        <strong>{campaign.campaignName || 'حملة بدون اسم'}</strong>
                                        <small>رقم الإعلان: {campaign.campaignNumber || campaign.campaignId || campaign.id.slice(0, 8)}</small>
                                        {campaign.imageUrl && <small><a href={campaign.imageUrl} target="_blank" rel="noopener noreferrer">عرض المرفق</a></small>}
                                    </td>
                                    <td>
                                        <small>من: {formatDate(campaign.startTime)}</small>
                                        <small>إلى: {formatDate(campaign.endTime)}</small>
                                    </td>
                                    <td>
                                        <small>الظهور: {formatNumber(campaign.views || campaign.impressions)}</small>
                                        <small>النقرات: {formatNumber(campaign.clicks)}</small>
                                    </td>
                                    <td>
                                        <span className={`client-status ${getStatusClass(campaign.status)}`}>
                                            {campaign.status || 'قيد المراجعة'}
                                        </span>
                                        {campaign.rejectReason && <small>{campaign.rejectReason}</small>}
                                        {campaign.pauseReason && <small>{campaign.pauseReason}</small>}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {campaign.targetUrl && (
                                                <a className="client-icon-btn view" href={campaign.targetUrl} target="_blank" rel="noopener noreferrer" title="فتح الرابط">
                                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                </a>
                                            )}
                                            {canUpdateCampaign && (campaign.status === 'مسودة' ? (
                                                <button className="client-icon-btn play" type="button" onClick={() => updateCampaignStatus(campaign.id, 'قيد المراجعة')} title="إرسال للمراجعة">
                                                    <i className="fa-solid fa-paper-plane"></i>
                                                </button>
                                            ) : campaign.status === 'متوقف مؤقتاً' ? (
                                                <button className="client-icon-btn play" type="button" onClick={() => updateCampaignStatus(campaign.id, 'قيد المراجعة')} title="إعادة للمراجعة">
                                                    <i className="fa-solid fa-play"></i>
                                                </button>
                                            ) : (
                                                <button className="client-icon-btn pause" type="button" onClick={() => updateCampaignStatus(campaign.id, 'متوقف مؤقتاً')} title="إيقاف مؤقت">
                                                    <i className="fa-solid fa-pause"></i>
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
