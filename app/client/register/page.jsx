'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../../components/Toast';
import { CLIENT_PORTAL_VERSION } from '../ClientVersion';
import '../ClientPortal.css';

const initialForm = {
    storeName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    acceptedTerms: false,
};

export default function ClientRegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (form.password.length < 8) {
            setMessage({ text: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.', type: 'error' });
            return;
        }

        if (!form.acceptedTerms) {
            setMessage({ text: 'يجب الموافقة على الشروط وسياسة الخصوصية قبل إنشاء الحساب.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: 'info' });

        try {
            const [{ auth, db }, { createUserWithEmailAndPassword, updateProfile }, { doc, setDoc, serverTimestamp }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);

            const cleanEmail = form.email.trim().toLowerCase();
            const credential = await createUserWithEmailAndPassword(auth, cleanEmail, form.password);

            await updateProfile(credential.user, { displayName: form.storeName.trim() });
            await setDoc(doc(db, 'advertisers', credential.user.uid), {
                storeName: form.storeName.trim(),
                contactName: form.contactName.trim(),
                email: cleanEmail,
                phone: form.phone.trim(),
                status: 'active',
                portalVersion: CLIENT_PORTAL_VERSION,
                acceptedTermsAt: new Date().toISOString(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setMessage({ text: 'تم إنشاء الحساب بنجاح. سيتم تحويلك إلى لوحة المعلن.', type: 'success' });
            window.setTimeout(() => window.location.replace('/client/dashboard'), 900);
        } catch (error) {
            const friendly = error.code === 'auth/email-already-in-use'
                ? 'هذا البريد مستخدم مسبقًا.'
                : 'تعذر إنشاء الحساب الآن. تأكد من البيانات وحاول مجددًا.';
            setMessage({ text: friendly, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div className="client-portal client-auth-page" dir="rtl">
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <div className="client-auth-card">
                <div className="client-auth-icon">
                    <i className="fa-solid fa-store"></i>
                </div>
                <h1>إنشاء حساب معلن</h1>
                <p>أنشئ حسابك لإرسال الحملات ومتابعة نتائجها وحالات المراجعة داخل بوابة واحدة.</p>

                <form onSubmit={handleRegister}>
                    <div className="client-form-row">
                        <div className="client-form-group">
                            <label>اسم المتجر أو الجهة</label>
                            <input required value={form.storeName} onChange={(event) => updateField('storeName', event.target.value)} />
                        </div>
                        <div className="client-form-group">
                            <label>اسم المسؤول</label>
                            <input required value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} />
                        </div>
                    </div>

                    <div className="client-form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" required dir="ltr" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                    </div>

                    <div className="client-form-group">
                        <label>رقم التواصل</label>
                        <input type="tel" dir="ltr" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+966..." />
                    </div>

                    <div className="client-form-group">
                        <label>كلمة المرور</label>
                        <input type="password" required dir="ltr" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
                        <span className="client-hint">استخدم 8 أحرف على الأقل، ويفضل خلط حروف وأرقام ورموز.</span>
                    </div>

                    <label className="client-check-row">
                        <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => updateField('acceptedTerms', event.target.checked)} />
                        <span>
                            أوافق على <Link href="/terms">الشروط والأحكام</Link> و<Link href="/privacy">سياسة الخصوصية</Link>.
                        </span>
                    </label>

                    <div className="client-turnstile-note">
                        <strong>ملاحظة أمنية:</strong> تفعيل Turnstile الحقيقي يحتاج إنشاء Widget وسر تحقق في Cloudflare، ثم ربط الإرسال عبر الخادم.
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%', marginTop: 14 }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-user-plus"></i>}
                        {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/client">لديك حساب؟ تسجيل الدخول</Link>
                    <Link href="/support">تحتاج مساعدة؟</Link>
                </div>
            </div>
        </div>
    );
}
