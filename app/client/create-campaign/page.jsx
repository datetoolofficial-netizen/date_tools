'use client';

import { useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import ClientShell from '../ClientShell';
import '../ClientPortal.css';

const initialForm = {
    campaignName: '',
    targetUrl: '',
    imageUrl: '',
    startTime: '',
    endTime: '',
    notes: '',
};

function getDurationText(startTime, endTime) {
    if (!startTime || !endTime) return '';
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) return 'error';

    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const parts = [];

    if (days) parts.push(`${days} يوم`);
    if (hours) parts.push(`${hours} ساعة`);

    return parts.join(' و ') || 'ساعة واحدة';
}

export default function CreateCampaignPage() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        let unsubscribe = () => {};

        async function init() {
            const [{ auth, db }, { onAuthStateChanged }, { doc, getDoc }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);

            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    window.location.replace('/client');
                    return;
                }

                setCurrentUser(user);
                const profileSnap = await getDoc(doc(db, 'advertisers', user.uid));
                if (profileSnap.exists()) setProfile({ id: user.uid, ...profileSnap.data() });
            });
        }

        init();
        return () => unsubscribe();
    }, []);

    const durationText = useMemo(() => getDurationText(form.startTime, form.endTime), [form.startTime, form.endTime]);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!currentUser) {
            setMessage({ text: 'يجب تسجيل الدخول قبل إرسال حملة.', type: 'error' });
            return;
        }

        if (durationText === 'error') {
            setMessage({ text: 'وقت نهاية الإعلان يجب أن يكون بعد وقت البداية.', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const [{ db }, { addDoc, collection, serverTimestamp }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            const campaignNumber = `AD-${Date.now().toString().slice(-8)}`;

            await addDoc(collection(db, 'campaigns'), {
                campaignNumber,
                advertiserId: currentUser.uid,
                advertiserEmail: currentUser.email || profile?.email || '',
                storeName: profile?.storeName || '',
                campaignName: form.campaignName.trim(),
                targetUrl: form.targetUrl.trim(),
                imageUrl: form.imageUrl.trim(),
                startTime: form.startTime,
                endTime: form.endTime,
                notes: form.notes.trim(),
                status: 'قيد المراجعة',
                views: 0,
                clicks: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setMessage({ text: `تم إرسال حملتك للمراجعة. رقم الإعلان: ${campaignNumber}`, type: 'success' });
            setForm(initialForm);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'تعذر إرسال الحملة. تأكد من البيانات وحاول مجددًا.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ClientShell active="campaign" title="طلب إعلان جديد" userProfile={profile}>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <section className="client-panel">
                <div className="client-panel-header">
                    <h2>إضافة حملة إعلانية</h2>
                </div>

                <div className="client-advice">
                    المقاس المفضل للبنرات: 728×90 أو 1200×250 حسب الموضع. استخدم صورة واضحة وخفيفة، ونصًا قصيرًا، ورابطًا مباشرًا صالحًا للفتح.
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>اسم الحملة</label>
                            <input required value={form.campaignName} onChange={(event) => updateField('campaignName', event.target.value)} placeholder="مثال: عروض نهاية الأسبوع" />
                        </div>
                        <div className="client-form-group">
                            <label>رابط الوجهة</label>
                            <input required type="url" dir="ltr" value={form.targetUrl} onChange={(event) => updateField('targetUrl', event.target.value)} placeholder="https://example.com/offer" />
                        </div>
                    </div>

                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>وقت وتاريخ بداية الإعلان</label>
                            <input required type="datetime-local" value={form.startTime} onChange={(event) => updateField('startTime', event.target.value)} />
                        </div>
                        <div className="client-form-group">
                            <label>وقت وتاريخ نهاية الإعلان</label>
                            <input required type="datetime-local" value={form.endTime} onChange={(event) => updateField('endTime', event.target.value)} />
                        </div>
                    </div>

                    {durationText && (
                        <div className={`client-duration-box ${durationText === 'error' ? 'error' : ''}`}>
                            <i className="fa-solid fa-stopwatch"></i>
                            {durationText === 'error' ? 'وقت النهاية غير صحيح.' : `إجمالي مدة الإعلان: ${durationText}`}
                        </div>
                    )}

                    <div className="client-form-group">
                        <label>رابط صورة البانر أو ملف Google Drive</label>
                        <input required type="url" dir="ltr" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="https://drive.google.com/..." />
                        <span className="client-hint">لاحقًا سنربط رفع ملفات خاص وآمن. حاليًا ضع رابطًا يستطيع فريق الإدارة فتحه للمراجعة.</span>
                    </div>

                    <div className="client-form-group">
                        <label>ملاحظات للمدير</label>
                        <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} placeholder="أي تعليمات عن مكان الظهور، الجمهور، أو العرض المطلوب..." />
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-rocket"></i>}
                        {isLoading ? 'جاري إرسال الطلب...' : 'إرسال الإعلان للمراجعة'}
                    </button>
                </form>
            </section>
        </ClientShell>
    );
}
