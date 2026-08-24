'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Toast from '../components/Toast';
import TurnstileField from '../components/TurnstileField';
import { verifyTurnstileChallenge } from '../turnstileClient';
import { evaluateAdminAccess } from '../securityPolicies';
import './AdminLogin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const [turnstileStatus, setTurnstileStatus] = useState({ enabled: null, ready: false, error: '' });

    const handleTurnstileStatusChange = useCallback((status) => {
        setTurnstileStatus(status);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!turnstileStatus.ready) {
            setErrorMsg('يرجى الانتظار لحظات حتى يكتمل التحقق الأمني.');
            return;
        }

        setIsLoading(true);

        try {
            await verifyTurnstileChallenge(turnstileToken, 'admin-login');

            const [{ db, getFirebaseAuth }, { signInWithEmailAndPassword, signOut }, { doc, getDoc }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);
            const auth = await getFirebaseAuth();

            // 1. تسجيل الدخول عبر Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. التحقق أن المستخدم موجود داخل admins/{uid}
            const adminDocRef = doc(db, "admins", user.uid);
            const adminDocSnap = await getDoc(adminDocRef);

            const adminAccess = evaluateAdminAccess(adminDocSnap.exists() ? adminDocSnap.data() : null);

            if (adminAccess === 'missing') {
                await signOut(auth);
                setErrorMsg("عذراً، هذا الحساب لا يمتلك صلاحيات الدخول للوحة الإدارة.");
                return;
            }

            if (adminAccess === 'inactive') {
                await signOut(auth);
                setErrorMsg("تم تعطيل هذا الحساب الإداري.");
                return;
            }

            if (adminAccess === 'unauthorized') {
                await signOut(auth);
                setErrorMsg("الدور الإداري لهذا الحساب غير معتمد.");
                return;
            }

            // 3. الدخول إلى لوحة الإدارة
        window.location.replace('/admin');
        } catch (error) {
            setTurnstileResetKey((value) => value + 1);
            if (
                error.code === 'auth/invalid-credential' ||
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password'
            ) {
                setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMsg("تم حظر الدخول مؤقتاً بسبب محاولات فاشلة كثيرة. يرجى المحاولة لاحقاً.");
            } else if (error.code === 'security/turnstile-failed') {
                if (error.reason === 'expired_or_duplicate') {
                    setErrorMsg('انتهت صلاحية التحقق الأمني وتم تجديده. حاول تسجيل الدخول مرة أخرى.');
                } else if (error.reason === 'verification_unavailable') {
                    setErrorMsg('خدمة التحقق الأمني غير متاحة مؤقتًا. حاول مرة أخرى بعد لحظات.');
                } else if (error.reason === 'configuration_error') {
                    setErrorMsg('تعذر تجهيز خدمة الحماية حاليًا. يرجى المحاولة لاحقًا.');
                } else {
                    setErrorMsg('لم ينجح التحقق الأمني. انتظر تجديده ثم حاول مرة أخرى.');
                }
            } else {
                setErrorMsg("حدث خطأ في الاتصال: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper" dir="rtl">
            <Toast
                message={errorMsg}
                type="error"
                visible={Boolean(errorMsg)}
                onClose={() => setErrorMsg('')}
            />

            <div className="login-container">
                <div className="lock-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div className="login-header">
                    <h1>بوابة الإدارة</h1>
                    <p>الوصول مقتصر على المصرح لهم فقط</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>البريد الإلكتروني للإدارة</label>
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope"></i>
                            <input
                                type="email"
                                required
                                placeholder="admin@example.com"
                                dir="ltr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                dir="ltr"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <TurnstileField
                        action="admin-login"
                        onTokenChange={setTurnstileToken}
                        onStatusChange={handleTurnstileStatusChange}
                        resetKey={turnstileResetKey}
                    />

                    <button type="submit" className="btn-login" disabled={isLoading || !turnstileStatus.ready}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                جاري التحقق...
                            </>
                        ) : !turnstileStatus.ready ? (
                            <>
                                <i className="fa-solid fa-shield-halved"></i>
                                {turnstileStatus.error ? 'جاري إعادة التحقق الأمني...' : 'جاري تجهيز الحماية...'}
                            </>
                        ) : (
                            <>
                                تسجيل الدخول
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            </>
                        )}
                    </button>
                </form>

                <Link href="/" className="back-link">
                    <i className="fa-solid fa-arrow-right"></i>
                    العودة للموقع العام
                </Link>
            </div>
        </div>
    );
}
