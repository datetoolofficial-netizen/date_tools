'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../components/Toast';
import TurnstileField from '../components/TurnstileField';
import { verifyTurnstileChallenge } from '../turnstileClient';
import { evaluateAdvertiserAccess } from '../securityPolicies';
import { CLIENT_PORTAL_VERSION } from './ClientVersion';
import './ClientPortal.css';

export default function ClientLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: 'info' });

        try {
            await verifyTurnstileChallenge(turnstileToken, 'advertiser-login');

            const [{ db, getFirebaseAuth }, { signInWithEmailAndPassword, signOut }, { doc, getDoc, updateDoc, serverTimestamp }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);
            const auth = await getFirebaseAuth();

            const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

            const profileSnap = credential.user.emailVerified
                ? await getDoc(doc(db, 'advertisers', credential.user.uid))
                : null;
            const profile = profileSnap?.exists() ? profileSnap.data() : null;
            const advertiserAccess = evaluateAdvertiserAccess({
                emailVerified: credential.user.emailVerified,
                profile,
            });

            if (advertiserAccess === 'unverified') {
                await signOut(auth);
                setMessage({ text: 'يرجى تأكيد البريد الإلكتروني أولًا، ثم تسجيل الدخول.', type: 'error' });
                setIsLoading(false);
                return;
            }

            if (advertiserAccess === 'missing') {
                await signOut(auth);
                setMessage({ text: 'تم تسجيل الدخول، لكن لا يوجد ملف معلن لهذا الحساب. أنشئ حساب معلن أولًا.', type: 'error' });
                setIsLoading(false);
                return;
            }

            if (advertiserAccess === 'activate') {
                await updateDoc(doc(db, 'advertisers', credential.user.uid), {
                    status: 'active',
                    updatedAt: serverTimestamp(),
                });
            }

            if (advertiserAccess === 'inactive') {
                await signOut(auth);
                setMessage({ text: 'هذا الحساب غير نشط حاليًا. تواصل مع الدعم الفني.', type: 'error' });
                setIsLoading(false);
                return;
            }

            window.location.replace('/client/dashboard');
        } catch (error) {
            setTurnstileResetKey((value) => value + 1);
            const friendly = error.code === 'security/turnstile-failed'
                ? 'تعذر إكمال التحقق الأمني. أعد المحاولة من فضلك.'
                : error.code === 'auth/invalid-credential'
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
                : 'تعذر تسجيل الدخول الآن. حاول مرة أخرى.';
            setMessage({ text: friendly, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div className="client-portal client-auth-page" dir="rtl">
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <div className="client-auth-card">
                <div className="client-auth-icon">
                    <i className="fa-solid fa-bullseye"></i>
                </div>
                <h1>بوابة المعلنين</h1>
                <p>ادخل لمتابعة حملاتك، طلب إعلانات جديدة، وقراءة حالة المراجعة من لوحة واحدة.</p>

                <form onSubmit={handleLogin}>
                    <div className="client-form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" required dir="ltr" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="advertiser@example.com" />
                    </div>

                    <div className="client-form-group">
                        <label>كلمة المرور</label>
                        <input type="password" required dir="ltr" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
                    </div>

                    <div className="client-turnstile-note" hidden>
                        <strong>حماية التسجيل والدخول:</strong> تم تجهيز مكان الحماية، والتفعيل الكامل يحتاج Turnstile Site Key وWorker تحقق من Cloudflare حتى لا تكون الحماية شكلية فقط.
                    </div>

                    <TurnstileField
                        action="advertiser-login"
                        onTokenChange={setTurnstileToken}
                        resetKey={turnstileResetKey}
                    />

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%', marginTop: 14 }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right-to-bracket"></i>}
                        {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/client/register">إنشاء حساب معلن</Link>
                    <Link href="/client/reset-password">نسيت كلمة المرور؟</Link>
                    <Link href="/">العودة للموقع</Link>
                </div>

                <div className="client-sidebar-version" style={{ margin: '18px 0 0' }}>
                    <span>إصدار بوابة المعلنين</span>
                    <strong>v{CLIENT_PORTAL_VERSION}</strong>
                </div>
            </div>
        </div>
    );
}
