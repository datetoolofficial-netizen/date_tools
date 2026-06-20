'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../components/Toast';
import '../client/ClientPortal.css';

const initialForm = {
    senderName: '',
    senderEmail: '',
    subject: '',
    message: '',
    attachmentNote: '',
    website: '',
};

export default function SupportPage() {
    const [form, setForm] = useState(initialForm);
    const [notice, setNotice] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (form.message.trim().length < 10) {
            setNotice({ text: 'اكتب وصفًا أوضح للمشكلة، 10 أحرف على الأقل.', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'support_failed');
            }

            setNotice({ text: `تم استلام طلبك. رقم التذكرة: ${result.ticketNumber}`, type: 'success' });
            setForm(initialForm);
        } catch {
            setNotice({ text: 'تعذر إرسال طلب الدعم الآن. حاول لاحقًا.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="client-portal client-auth-page" dir="rtl">
            <Toast visible={Boolean(notice.text)} message={notice.text} type={notice.type} onClose={() => setNotice({ text: '', type: 'info' })} />

            <section className="client-support-card">
                <div style={{ textAlign: 'center', fontSize: 44, color: 'var(--client-primary)' }}>
                    <i className="fa-solid fa-headset"></i>
                </div>
                <h1 style={{ textAlign: 'center', margin: '8px 0 0' }}>الدعم الفني</h1>
                <p style={{ textAlign: 'center', color: 'var(--client-muted)', marginTop: 8 }}>
                    صف المشكلة بدقة وسنراجعها من لوحة الإدارة.
                </p>

                <div className="client-support-note">
                    في حال وجود خطأ ظاهر، اكتب نص الرسالة أو ضع رابط صورة في حقل الملاحظات. مرفقات الصور الخاصة ستُربط لاحقًا بتخزين خاص وليس عبر مسار R2 العام.
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={form.website}
                        onChange={(event) => updateField('website', event.target.value)}
                        tabIndex="-1"
                        autoComplete="off"
                        style={{ display: 'none' }}
                    />

                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>الاسم أو الجهة</label>
                            <input required value={form.senderName} onChange={(event) => updateField('senderName', event.target.value)} />
                        </div>
                        <div className="client-form-group">
                            <label>البريد الإلكتروني</label>
                            <input required type="email" dir="ltr" value={form.senderEmail} onChange={(event) => updateField('senderEmail', event.target.value)} />
                        </div>
                    </div>

                    <div className="client-form-group">
                        <label>عنوان الطلب</label>
                        <input required value={form.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="مثال: مشكلة في رفع إعلان" />
                    </div>

                    <div className="client-form-group">
                        <label>وصف المشكلة / الاستفسار</label>
                        <textarea required value={form.message} onChange={(event) => updateField('message', event.target.value)} />
                    </div>

                    <div className="client-form-group">
                        <label>رابط صورة أو ملاحظة مرفق اختياري</label>
                        <input value={form.attachmentNote} onChange={(event) => updateField('attachmentNote', event.target.value)} placeholder="رابط لقطة شاشة أو وصف للمرفق" />
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                        {isLoading ? 'جاري إرسال الطلب...' : 'إرسال طلب الدعم'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/">العودة للموقع</Link>
                    <Link href="/client">بوابة المعلنين</Link>
                </div>
            </section>
        </div>
    );
}
