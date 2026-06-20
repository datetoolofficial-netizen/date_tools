'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../components/Toast';
import './ClientPortal.css';

export default function ClientLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: 'info' });

        try {
            const [{ auth, db }, { signInWithEmailAndPassword }, { doc, getDoc }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);

            const credential = await signInWithEmailAndPassword(auth, email, password);
            const profileSnap = await getDoc(doc(db, 'advertisers', credential.user.uid));

            if (!profileSnap.exists()) {
                setMessage({ text: 'تم تسجيل الدخول، لكن لا يوجد ملف معلن لهذا الحساب. أكمل التسجيل أولًا.', type: 'error' });
                setIsLoading(false);
                return;
            }

            window.location.replace('/client/dashboard');
        } catch (error) {
            const friendly = error.code === 'auth/invalid-credential'
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
                : 'تعذر تسجيل الدخول الآن. حاول مرة أخرى.';
            setMessage({ text: friendly, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div className="client-portal client-auth-page" dir="rtl">
            <Toast
                visible={Boolean(message.text)}
                message={message.text}
                type={message.type}
                onClose={() => setMessage({ text: '', type: 'info' })}
            />

            <div className="client-auth-card">
                <div className="client-auth-icon">
                    <i className="fa-solid fa-bullseye"></i>
                </div>
                <h1>بوابة المعلنين</h1>
                <p>ادخل لمتابعة حملاتك وطلب إعلانات جديدة داخل أدوات التاريخ.</p>

                <form onSubmit={handleLogin}>
                    <div className="client-form-group">
                        <label>البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            dir="ltr"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="advertiser@example.com"
                        />
                    </div>

                    <div className="client-form-group">
                        <label>كلمة المرور</label>
                        <input
                            type="password"
                            required
                            dir="ltr"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right-to-bracket"></i>}
                        {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/client/register">إنشاء حساب معلن</Link>
                    <Link href="/client/reset-password">نسيت كلمة المرور؟</Link>
                    <Link href="/">العودة للموقع</Link>
                </div>
            </div>
        </div>
    );
}
