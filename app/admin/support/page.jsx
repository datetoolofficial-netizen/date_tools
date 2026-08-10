'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const STATUS_OPTIONS = ['جديدة', 'قيد المتابعة', 'بانتظار العميل', 'مغلقة'];

function formatDate(value) {
    if (!value) return 'غير محدد';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'غير محدد';

    return new Intl.DateTimeFormat('ar-SA', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function formatFileSize(value) {
    const bytes = Number(value || 0);
    if (!Number.isFinite(bytes) || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
}

function getStatusClass(status) {
    if (status === 'مغلقة') return 'closed';
    if (status === 'بانتظار العميل') return 'waiting';
    if (status === 'قيد المتابعة') return 'in-progress';
    return 'new';
}

function getErrorMessage(error) {
    const code = error instanceof Error ? error.message : String(error || '');
    if (code === 'unauthorized') return 'انتهت جلسة الإدارة أو لا تملك صلاحية التذاكر.';
    if (code === 'media_storage_not_configured') return 'تعذر الوصول إلى مخزن المرفقات حاليًا.';
    if (code === 'attachment_not_found') return 'المرفق غير موجود أو حُذف سابقًا.';
    return 'تعذر إكمال العملية. حاول مرة أخرى.';
}

async function getAdminToken() {
    const { getFirebaseAuth } = await import('../../firebase');
    const auth = await getFirebaseAuth();
    if (typeof auth.authStateReady === 'function') await auth.authStateReady();
    if (!auth.currentUser) throw new Error('unauthorized');
    return auth.currentUser.getIdToken();
}

async function callSupportApi(path = '', options = {}) {
    const token = await getAdminToken();
    const response = await fetch(`/api/admin/support${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    if (options.expectBlob) {
        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || 'attachment_download_failed');
        }
        return response.blob();
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
        throw new Error(payload.error || 'support_request_failed');
    }
    return payload;
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('الكل');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusDraft, setStatusDraft] = useState('جديدة');
    const [noteDraft, setNoteDraft] = useState('');
    const [message, setMessage] = useState(null);

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setMessage(null);

        try {
            const payload = await callSupportApi();
            setTickets(Array.isArray(payload.tickets) ? payload.tickets : []);
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error) });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const counters = useMemo(() => ({
        all: tickets.length,
        new: tickets.filter((ticket) => !ticket.status || ticket.status === 'جديدة').length,
        active: tickets.filter((ticket) => ['قيد المتابعة', 'بانتظار العميل'].includes(ticket.status)).length,
        closed: tickets.filter((ticket) => ticket.status === 'مغلقة').length,
    }), [tickets]);

    const filteredTickets = useMemo(() => {
        const needle = search.trim().toLowerCase();
        return tickets.filter((ticket) => {
            const statusMatches = statusFilter === 'الكل'
                || (statusFilter === 'جديدة' && !ticket.status)
                || ticket.status === statusFilter;
            if (!statusMatches) return false;
            if (!needle) return true;

            return [ticket.ticketNumber, ticket.senderName, ticket.senderEmail, ticket.subject, ticket.message]
                .some((value) => String(value || '').toLowerCase().includes(needle));
        });
    }, [search, statusFilter, tickets]);

    const openTicket = (ticket) => {
        setSelectedTicket(ticket);
        setStatusDraft(ticket.status || 'جديدة');
        setNoteDraft(ticket.adminNote || '');
        setMessage(null);
    };

    const closeTicket = () => {
        if (busyId) return;
        setSelectedTicket(null);
    };

    const saveTicket = async () => {
        if (!selectedTicket?.id) return;
        setBusyId(selectedTicket.id);
        setMessage(null);

        try {
            const payload = await callSupportApi('', {
                method: 'PATCH',
                body: JSON.stringify({
                    id: selectedTicket.id,
                    status: statusDraft,
                    adminNote: noteDraft,
                }),
            });
            const updated = payload.ticket;
            setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket));
            setSelectedTicket(updated);
            setStatusDraft(updated.status || 'جديدة');
            setNoteDraft(updated.adminNote || '');
            setMessage({ type: 'success', text: 'تم حفظ حالة التذكرة والملاحظة الداخلية.' });
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error) });
        } finally {
            setBusyId('');
        }
    };

    const deleteTicket = async (ticket) => {
        if (!ticket?.id) return;
        setBusyId(ticket.id);
        setMessage(null);

        try {
            await callSupportApi('', {
                method: 'DELETE',
                body: JSON.stringify({ id: ticket.id }),
            });
            setTickets((current) => current.filter((item) => item.id !== ticket.id));
            if (selectedTicket?.id === ticket.id) setSelectedTicket(null);
            setMessage({ type: 'success', text: 'تم حذف التذكرة ومرفقها الخاص إن وجد.' });
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error) });
        } finally {
            setBusyId('');
        }
    };

    const downloadAttachment = async (ticket) => {
        if (!ticket?.id || !ticket.attachmentKey) return;
        setBusyId(ticket.id);
        setMessage(null);

        try {
            const blob = await callSupportApi(`?attachment=${encodeURIComponent(ticket.id)}`, { expectBlob: true });
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = ticket.attachmentName || 'attachment';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error) });
        } finally {
            setBusyId('');
        }
    };

    return (
        <div className="legacy-admin-shell admin-support-page" dir="rtl">
            <main className="legacy-main-wrapper">
                <section className="legacy-ads-hero admin-support-hero">
                    <div>
                        <h1><i className="fa-solid fa-headset"></i> إدارة التذاكر</h1>
                        <p>متابعة رسائل العملاء، المرفقات، وحالة كل طلب دعم من مكان واحد.</p>
                    </div>
                </section>

                {message && (
                    <div className={`legacy-inline-message ${message.type}`} role="status">
                        <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                        {message.text}
                    </div>
                )}

                <section className="admin-support-kpis" aria-label="إحصاءات التذاكر">
                    <div><span>إجمالي التذاكر</span><strong>{counters.all}</strong></div>
                    <div><span>جديدة</span><strong>{counters.new}</strong></div>
                    <div><span>قيد المعالجة</span><strong>{counters.active}</strong></div>
                    <div><span>مغلقة</span><strong>{counters.closed}</strong></div>
                </section>

                <section className="legacy-google-card tools-section-card admin-support-section">
                    <div className="tools-section-head">
                        <div className="tools-section-title">
                            <span className="tools-section-icon color-support"><i className="fa-solid fa-ticket"></i></span>
                            <div>
                                <h2>تذاكر العملاء</h2>
                                <p>اعرض تفاصيل الرسالة، حدّث حالتها، ونزّل المرفق الخاص عند الحاجة.</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-support-toolbar">
                        <label className="legacy-field">
                            <span>البحث</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="رقم التذكرة، الاسم، البريد أو العنوان"
                            />
                        </label>
                        <label className="legacy-field">
                            <span>الحالة</span>
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="الكل">جميع الحالات</option>
                                {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </label>
                        <button type="button" className="legacy-secondary-btn admin-support-refresh" onClick={loadTickets} disabled={loading}>
                            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
                            تحديث
                        </button>
                    </div>

                    {loading ? (
                        <p className="legacy-loading-text">جارٍ تحميل التذاكر...</p>
                    ) : filteredTickets.length === 0 ? (
                        <div className="tools-empty">لا توجد تذاكر مطابقة حاليًا.</div>
                    ) : (
                        <div className="tools-list admin-support-table">
                            <div className="tools-table-head admin-support-table-head">
                                <span>رقم التذكرة</span>
                                <span>العميل</span>
                                <span>العنوان</span>
                                <span>الحالة</span>
                                <span>تاريخ الإرسال</span>
                                <span>الإجراءات</span>
                            </div>

                            {filteredTickets.map((ticket) => (
                                <div className="tools-item-card compact admin-support-table-row" key={ticket.id}>
                                    <div className="tools-item-main">
                                        <code className="tools-table-value tools-table-value-ltr">{ticket.ticketNumber || ticket.id}</code>
                                        <div className="admin-support-customer">
                                            <strong>{ticket.senderName || 'بدون اسم'}</strong>
                                            <small dir="ltr">{ticket.senderEmail || '-'}</small>
                                        </div>
                                        <strong className="tools-table-value" title={ticket.subject || ''}>{ticket.subject || 'بدون عنوان'}</strong>
                                        <span className={`admin-support-status ${getStatusClass(ticket.status)}`}>{ticket.status || 'جديدة'}</span>
                                        <time className="tools-table-value" dateTime={ticket.createdAt || ''}>{formatDate(ticket.createdAt)}</time>
                                    </div>
                                    <div className="tools-item-actions">
                                        <button type="button" onClick={() => openTicket(ticket)} title="عرض التذكرة">
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                        {ticket.attachmentKey && (
                                            <button type="button" onClick={() => downloadAttachment(ticket)} disabled={busyId === ticket.id} title="تنزيل المرفق">
                                                <i className="fa-solid fa-paperclip"></i>
                                            </button>
                                        )}
                                        <button type="button" className="danger" onClick={() => deleteTicket(ticket)} disabled={busyId === ticket.id} title="حذف التذكرة">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {selectedTicket && (
                    <div className="legacy-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="support-ticket-title" onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeTicket();
                    }}>
                        <div className="legacy-modal-card admin-support-modal">
                            <div className="legacy-modal-head">
                                <div>
                                    <h3 id="support-ticket-title">{selectedTicket.subject || 'تفاصيل التذكرة'}</h3>
                                    <p>{selectedTicket.ticketNumber || selectedTicket.id}</p>
                                </div>
                                <button type="button" className="legacy-icon-btn" onClick={closeTicket} aria-label="إغلاق">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <div className="admin-support-details">
                                <div><span>الاسم</span><strong>{selectedTicket.senderName || '-'}</strong></div>
                                <div><span>البريد الإلكتروني</span><a dir="ltr" href={`mailto:${selectedTicket.senderEmail || ''}`}>{selectedTicket.senderEmail || '-'}</a></div>
                                <div><span>تاريخ الإرسال</span><strong>{formatDate(selectedTicket.createdAt)}</strong></div>
                                <div><span>المصدر</span><strong>{selectedTicket.source === 'support_page' ? 'نموذج التواصل' : selectedTicket.source || '-'}</strong></div>
                            </div>

                            <section className="admin-support-message-block">
                                <h4>نص الرسالة</h4>
                                <p>{selectedTicket.message || 'لا يوجد نص.'}</p>
                            </section>

                            {selectedTicket.attachmentKey && (
                                <button type="button" className="legacy-secondary-btn admin-support-attachment" onClick={() => downloadAttachment(selectedTicket)} disabled={busyId === selectedTicket.id}>
                                    <i className="fa-solid fa-paperclip"></i>
                                    <span>تنزيل {selectedTicket.attachmentName || 'المرفق'}</span>
                                    <small>{formatFileSize(selectedTicket.attachmentSize)}</small>
                                </button>
                            )}

                            <div className="legacy-form-grid admin-support-edit-grid">
                                <label className="legacy-field">
                                    <span>حالة التذكرة</span>
                                    <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
                                        {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </label>
                                <label className="legacy-field full-width">
                                    <span>ملاحظة داخلية</span>
                                    <textarea
                                        value={noteDraft}
                                        onChange={(event) => setNoteDraft(event.target.value)}
                                        placeholder="ملاحظة خاصة بالإدارة لا تظهر للعميل"
                                        rows="4"
                                    ></textarea>
                                </label>
                            </div>

                            <div className="legacy-modal-actions admin-support-modal-actions">
                                <button type="button" className="legacy-primary-btn" onClick={saveTicket} disabled={busyId === selectedTicket.id}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    حفظ التحديث
                                </button>
                                <a className="legacy-secondary-btn" href={`mailto:${selectedTicket.senderEmail || ''}?subject=${encodeURIComponent(`رد على التذكرة ${selectedTicket.ticketNumber || ''}: ${selectedTicket.subject || ''}`)}`}>
                                    <i className="fa-solid fa-reply"></i>
                                    الرد بالبريد
                                </a>
                                <button type="button" className="legacy-secondary-btn" onClick={closeTicket}>إغلاق</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
