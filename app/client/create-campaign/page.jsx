'use client';

import { useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import ClientShell from '../ClientShell';
import '../ClientPortal.css';

const AD_LOCATION_OPTIONS = [
    { value: 'top', label: 'إعلان أعلى الصفحة' },
    { value: 'middle', label: 'الإعلان المميز' },
    { value: 'bottom1', label: 'إعلان أسفل الصفحة 1' },
    { value: 'bottom2', label: 'إعلان أسفل الصفحة 2' },
];

const initialForm = {
    campaignName: '',
    targetUrl: '',
    imageUrl: '',
    adLocation: 'top',
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
    const [isUploading, setIsUploading] = useState(false);
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
                if (!profileSnap.exists()) {
                    window.location.replace('/client/register');
                    return;
                }

                setProfile({ id: user.uid, ...profileSnap.data() });
            });
        }

        init();
        return () => unsubscribe();
    }, []);

    const durationText = useMemo(() => getDurationText(form.startTime, form.endTime), [form.startTime, form.endTime]);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const uploadCampaignMedia = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ text: 'ارفع صورة إعلان فقط بصيغة PNG أو JPG أو WEBP أو GIF.', type: 'error' });
            return;
        }

        setIsUploading(true);
        setMessage({ text: '', type: 'info' });

        try {
            const body = new FormData();
            body.append('file', file);
            body.append('category', 'ads');

            const response = await fetch('/api/media/upload', { method: 'POST', body });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) throw new Error(result.error || 'upload_failed');

            updateField('imageUrl', result.url);
            setMessage({ text: 'تم رفع صورة الإعلان إلى R2 وربطها بالطلب.', type: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ text: 'تعذر رفع الصورة. تأكد من تسجيل الدخول وحاول مرة أخرى.', type: 'error' });
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
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
                targetTool: 'date_tool',
                adLocation: form.adLocation,
                source: 'advertisers',
                targetUrl: form.targetUrl.trim(),
                imageUrl: form.imageUrl.trim(),
                mediaType: 'image',
                startTime: form.startTime,
                endTime: form.endTime,
                notes: form.notes.trim(),
                status: 'قيد المراجعة',
                views: 0,
                clicks: 0,
                portalVersion: 'client',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setMessage({ text: `تم إرسال حملتك للمراجعة. رقم الإعلان: ${campaignNumber}`, type: 'success' });
            setForm(initialForm);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'تعذر إرسال الحملة. تأكد من البيانات والصلاحيات وحاول مجددًا.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ClientShell active="campaign" title="طلب إعلان جديد" userProfile={profile}>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <section className="client-panel">
                <div className="client-panel-header">
                    <h2><i className="fa-solid fa-bullhorn"></i> إضافة حملة إعلانية</h2>
                </div>

                <div className="client-advice">
                    المقاس المفضل: صورة واضحة وخفيفة، نص قصير، رابط مباشر، وتباين جيد. كل الطلبات تذهب إلى الإدارة بحالة "قيد المراجعة" قبل العرض.
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>اسم الحملة</label>
                            <input required value={form.campaignName} onChange={(event) => updateField('campaignName', event.target.value)} placeholder="مثال: عرض نهاية الأسبوع" />
                        </div>
                        <div className="client-form-group">
                            <label>رابط الوجهة</label>
                            <input required type="url" dir="ltr" value={form.targetUrl} onChange={(event) => updateField('targetUrl', event.target.value)} placeholder="https://example.com/offer" />
                        </div>
                    </div>

                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>الأداة</label>
                            <input value="أداة التاريخ الشاملة" disabled />
                        </div>
                        <div className="client-form-group">
                            <label>مكان العرض المطلوب</label>
                            <select value={form.adLocation} onChange={(event) => updateField('adLocation', event.target.value)}>
                                {AD_LOCATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
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
                        <label>صورة الإعلان</label>
                        <label className="client-upload-card">
                            <span
                                className="client-upload-preview"
                                style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})` } : undefined}
                                aria-label={form.imageUrl ? 'معاينة الإعلان' : undefined}
                            >
                                {!form.imageUrl && <i className="fa-solid fa-image"></i>}
                            </span>
                            <span>
                                <strong>{isUploading ? 'جاري رفع الصورة...' : 'اختر صورة الإعلان'}</strong>
                                <small dir="ltr">{form.imageUrl || 'PNG / JPG / WEBP / GIF'}</small>
                            </span>
                            <span className="client-upload-action">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            </span>
                            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={isUploading} onChange={uploadCampaignMedia} />
                        </label>
                    </div>

                    <div className="client-form-group">
                        <label>ملاحظات للمدير</label>
                        <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} placeholder="أي تعليمات عن الجمهور، الرسالة، أو العرض المطلوب..." />
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading || isUploading || !form.imageUrl} style={{ width: '100%' }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-rocket"></i>}
                        {isLoading ? 'جاري إرسال الطلب...' : 'إرسال الإعلان للمراجعة'}
                    </button>
                </form>
            </section>
        </ClientShell>
    );
}
