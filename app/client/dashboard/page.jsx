'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import ClientShell from '../ClientShell';
import '../ClientPortal.css';

function getStatusClass(status) {
    if (status === 'نشط' || status === 'مقبول') return 'active';
    if (status === 'متوقف مؤقتاً') return 'paused';
    if (status === 'مرفوض') return 'rejected';
    if (status === 'منتهي') return 'ended';
    return 'pending';
}

function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function ClientDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [filters, setFilters] = useState({ search: '', status: 'all', date: '' });
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(true);

    const loadClientData = async () => {
        const [{ auth, db }, { onAuthStateChanged }, { collection, doc, getDoc, getDocs, query, where }] = await Promise.all([
            import('../../firebase'),
            import('firebase/auth'),
            import('firebase/firestore'),
        ]);

        return onAuthStateChanged(auth, async (user) => {
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

                setProfile({ id: user.uid, ...profileSnap.data() });

                const adsQuery = query(collection(db, 'campaigns'), where('advertiserId', '==', user.uid));
                const adsSnap = await getDocs(adsQuery);
                const nextCampaigns = adsSnap.docs
                    .map((item) => ({ id: item.id, ...item.data() }))
                    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

                setCampaigns(nextCampaigns);
            } catch (error) {
                console.error(error);
                setMessage({ text: 'تعذر تحميل بيانات حملاتك الآن.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        });
    };

    useEffect(() => {
        let unsubscribe = () => {};
        loadClientData().then((fn) => {
            unsubscribe = fn;
        });

        return () => unsubscribe();
    }, []);

    const filteredCampaigns = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const name = String(campaign.campaignName || '').toLowerCase();
            const id = String(campaign.campaignNumber || campaign.campaignId || '').toLowerCase();
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
        const views = campaigns.reduce((sum, item) => sum + Number(item.views || 0), 0);
        const clicks = campaigns.reduce((sum, item) => sum + Number(item.clicks || 0), 0);
        const ctr = views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '0%';

        return { views, clicks, ctr };
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
            setMessage({ text: 'تعذر تحديث الإعلان. تأكد من صلاحية الحساب.', type: 'error' });
        }
    };

    return (
        <ClientShell active="dashboard" title="لوحة المعلن" userProfile={profile}>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <section className="client-welcome">
                <div>
                    <h2>أهلاً بك، {profile?.storeName || 'جاري التحميل'} 👋</h2>
                    <p>تابع حملاتك الإعلانية، نسب النقر، وحالات المراجعة من مكان واحد.</p>
                </div>
                <i className="fa-solid fa-chart-line" style={{ fontSize: 48, opacity: 0.35 }}></i>
            </section>

            <section className="client-stats-grid">
                <div className="client-stat-card blue">
                    <span>إجمالي الظهور</span>
                    <strong>{isLoading ? '...' : stats.views.toLocaleString()}</strong>
                </div>
                <div className="client-stat-card green">
                    <span>إجمالي النقرات</span>
                    <strong>{isLoading ? '...' : stats.clicks.toLocaleString()}</strong>
                </div>
                <div className="client-stat-card orange">
                    <span>متوسط CTR</span>
                    <strong>{isLoading ? '...' : stats.ctr}</strong>
                </div>
            </section>

            <section className="client-panel">
                <div className="client-panel-header">
                    <h2>حملاتك الإعلانية</h2>
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
                        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                            <option value="all">كل الحالات</option>
                            <option value="قيد المراجعة">قيد المراجعة</option>
                            <option value="نشط">نشط</option>
                            <option value="متوقف مؤقتاً">متوقف مؤقتاً</option>
                            <option value="مرفوض">مرفوض</option>
                            <option value="منتهي">منتهي</option>
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
                                        {campaign.imageUrl && <small><a href={campaign.imageUrl} target="_blank" rel="noopener noreferrer">عرض البانر</a></small>}
                                    </td>
                                    <td>
                                        <small>من: {formatDate(campaign.startTime)}</small>
                                        <small>إلى: {formatDate(campaign.endTime)}</small>
                                    </td>
                                    <td>
                                        <small>الظهور: {Number(campaign.views || 0).toLocaleString()}</small>
                                        <small>النقرات: {Number(campaign.clicks || 0).toLocaleString()}</small>
                                    </td>
                                    <td>
                                        <span className={`client-status ${getStatusClass(campaign.status)}`}>
                                            {campaign.status || 'قيد المراجعة'}
                                        </span>
                                        {campaign.rejectReason && <small>{campaign.rejectReason}</small>}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <a className="client-icon-btn" href={campaign.targetUrl || '#'} target="_blank" rel="noopener noreferrer" title="فتح الرابط">
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                            </a>
                                            {campaign.status === 'متوقف مؤقتاً' ? (
                                                <button className="client-icon-btn" type="button" onClick={() => updateCampaignStatus(campaign.id, 'قيد المراجعة')} title="إعادة للمراجعة">
                                                    <i className="fa-solid fa-play"></i>
                                                </button>
                                            ) : (
                                                <button className="client-icon-btn" type="button" onClick={() => updateCampaignStatus(campaign.id, 'متوقف مؤقتاً')} title="إيقاف مؤقت">
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
