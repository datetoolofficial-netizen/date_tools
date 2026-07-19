'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import ClientShell from '../ClientShell';
import '../ClientPortal.css';

const STATUS_OPTIONS = ['قيد المراجعة', 'نشط', 'متوقف مؤقتاً', 'مرفوض', 'منتهي', 'تم تعديله'];

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
    const [profile, setProfile] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [filters, setFilters] = useState({ search: '', status: 'all', date: '' });
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => {};

        async function loadClientData() {
            const [{ db, getFirebaseAuth }, { onAuthStateChanged }, { collection, doc, getDoc, getDocs, query, where }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);
            const auth = await getFirebaseAuth();

            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    window.location.replace('/client');
                    return;
                }

                try {
                    const profileSnap = await getDoc(doc(db, 'advertisers', user.uid));
                    if (!profileSnap.exists()) {
                        window.location.replace('/client/register');
                        return;
                    }

                    const nextProfile = { id: user.uid, ...profileSnap.data() };
                    setProfile(nextProfile);

                    const adsQuery = query(collection(db, 'campaigns'), where('advertiserId', '==', user.uid));
                    const adsSnap = await getDocs(adsQuery);
                    const nextCampaigns = adsSnap.docs
                        .map((item) => ({ id: item.id, ...item.data() }))
                        .sort((a, b) => String(b.createdAt?.seconds || b.createdAt || '').localeCompare(String(a.createdAt?.seconds || a.createdAt || '')));

                    setCampaigns(nextCampaigns);
                } catch {
                    console.error('Client campaigns load failed.');
                    setMessage({ text: 'تعذر تحميل بيانات حملاتك الآن.', type: 'error' });
                } finally {
                    setIsLoading(false);
                }
            });
        }

        loadClientData();
        return () => unsubscribe();
    }, []);

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

    const updateCampaignStatus = async (campaignId, status) => {
        try {
            const [{ db }, { doc, updateDoc }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);

            await updateDoc(doc(db, 'campaigns', campaignId), {
                status,
                updatedAt: new Date().toISOString(),
            });

            setCampaigns((current) => current.map((item) => item.id === campaignId ? { ...item, status } : item));
            setMessage({ text: 'تم تحديث حالة الإعلان.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر تحديث الإعلان. القواعد تسمح للمعلن بتغيير الحالة المحددة فقط.', type: 'error' });
        }
    };

    return (
        <ClientShell active="dashboard" title="لوحة المعلن" userProfile={profile}>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <section className="client-welcome">
                <div>
                    <h2>أهلًا بك، {profile?.storeName || 'جاري التحميل'}</h2>
                    <p>تابع حملاتك الإعلانية، حالة المراجعة، الظهور، والنقرات من لوحة واحدة مرتبطة ببيانات الحملات الحالية.</p>
                </div>
                <i className="fa-solid fa-chart-line"></i>
            </section>

            <section className="client-stats-grid">
                <div className="client-stat-card blue">
                    <span className="client-stat-icon"><i className="fa-solid fa-eye"></i></span>
                    <div>
                        <span>إجمالي الظهور</span>
                        <strong>{isLoading ? '...' : formatNumber(stats.views)}</strong>
                    </div>
                </div>
                <div className="client-stat-card green">
                    <span className="client-stat-icon"><i className="fa-solid fa-arrow-pointer"></i></span>
                    <div>
                        <span>إجمالي النقرات</span>
                        <strong>{isLoading ? '...' : formatNumber(stats.clicks)}</strong>
                    </div>
                </div>
                <div className="client-stat-card orange">
                    <span className="client-stat-icon"><i className="fa-solid fa-bullhorn"></i></span>
                    <div>
                        <span>حملات نشطة / CTR</span>
                        <strong>{isLoading ? '...' : `${formatNumber(stats.active)} / ${stats.ctr}`}</strong>
                    </div>
                </div>
            </section>

            <section className="client-panel">
                <div className="client-panel-header">
                    <h2><i className="fa-solid fa-rectangle-ad"></i> حملاتك الإعلانية</h2>
                    <Link className="client-primary-btn" href="/client/create-campaign">
                        <i className="fa-solid fa-plus"></i>
                        طلب إعلان جديد
                    </Link>
                </div>

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
                                            {campaign.status === 'متوقف مؤقتاً' ? (
                                                <button className="client-icon-btn play" type="button" onClick={() => updateCampaignStatus(campaign.id, 'قيد المراجعة')} title="إعادة للمراجعة">
                                                    <i className="fa-solid fa-play"></i>
                                                </button>
                                            ) : (
                                                <button className="client-icon-btn pause" type="button" onClick={() => updateCampaignStatus(campaign.id, 'متوقف مؤقتاً')} title="إيقاف مؤقت">
                                                    <i className="fa-solid fa-pause"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </ClientShell>
    );
}
