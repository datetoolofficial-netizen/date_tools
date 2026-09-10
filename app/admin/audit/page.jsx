'use client';

import { useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';

const ACTION_LABELS = {
    'admin.invited': 'إضافة مدير',
    'admin.role_updated': 'تعديل صلاحية مدير',
    'advertiser.created': 'إضافة معلن',
    'advertiser.updated': 'تعديل معلن',
    'campaign.created': 'إنشاء حملة',
    'campaign.updated': 'تعديل حملة',
    'campaign.status_updated': 'تغيير حالة حملة',
    'campaign.deleted': 'حذف حملة',
    'settings.updated': 'تعديل إعدادات الموقع',
    'support.updated': 'تحديث تذكرة',
    'support.deleted': 'حذف تذكرة',
    'security.cleanup': 'تنظيف أمني',
    'seo.index_submitted': 'إرسال فهرسة',
};

function formatDate(value) {
    const source = typeof value?.toDate === 'function' ? value.toDate() : value;
    const parsed = source ? new Date(source) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'medium' }).format(parsed);
}

export default function AdminAuditPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        async function loadEvents() {
            try {
                const [{ db }, { collection, getDocs, limit, orderBy, query }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/firestore'),
                ]);
                const snapshot = await getDocs(query(collection(db, 'audit_logs'), orderBy('occurredAt', 'desc'), limit(200)));
                if (active) setEvents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
            } catch {
                if (active) setError('تعذر تحميل سجل العمليات. تأكد من الصلاحية والقواعد المنشورة.');
            } finally {
                if (active) setLoading(false);
            }
        }
        loadEvents();
        return () => { active = false; };
    }, []);

    const visibleEvents = useMemo(() => {
        const value = filter.trim().toLowerCase();
        if (!value) return events;
        return events.filter((event) => [event.action, event.actorEmail, event.resourceType, event.resourceId]
            .some((item) => String(item || '').toLowerCase().includes(value)));
    }, [events, filter]);

    return (
        <div className="admin-section-page admin-audit-page">
            <Toast visible={Boolean(error)} message={error} type="error" onClose={() => setError('')} />
            <header className="admin-page-hero"><div><span>المساءلة والشفافية</span><h1>سجل العمليات</h1><p>آخر 200 عملية إدارية مسجلة من الخادم، ولا يمكن تعديلها من الواجهة.</p></div></header>
            <section className="legacy-section-card">
                <div className="legacy-section-heading"><span className="legacy-section-icon"><i className="fa-solid fa-clock-rotate-left"></i></span><div><h2>الأحداث الإدارية</h2><p>ابحث بالبريد أو نوع العملية أو معرف العنصر.</p></div></div>
                <div className="admin-table-toolbar"><label className="legacy-field"><span>بحث في السجل</span><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="مثال: campaign أو البريد الإلكتروني" /></label></div>
                <div className="tools-list tools-managed-table admin-audit-table">
                    <div className="tools-managed-table-head"><span>العملية</span><span>المنفذ</span><span>العنصر</span><span>الدور</span><span>التاريخ</span></div>
                    {loading ? <div className="admin-table-empty">جاري تحميل السجل...</div> : visibleEvents.length === 0 ? <div className="admin-table-empty">لا توجد عمليات مطابقة.</div> : visibleEvents.map((event) => (
                        <div className="tools-item-card tools-managed-table-row" key={event.id}>
                            <div><strong>{ACTION_LABELS[event.action] || event.action}</strong><small dir="ltr">{event.action}</small></div>
                            <div><strong>{event.actorEmail || event.actorId || '-'}</strong><small dir="ltr">{event.actorId || '-'}</small></div>
                            <div><strong>{event.resourceType || '-'}</strong><small dir="ltr">{event.resourceId || '-'}</small></div>
                            <div><span className="admin-role-badge manager">{event.actorRole || '-'}</span></div>
                            <div><small>{formatDate(event.occurredAt)}</small></div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
