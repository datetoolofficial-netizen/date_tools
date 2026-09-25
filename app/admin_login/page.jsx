'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Toast from '../components/Toast';
import TurnstileField from '../components/TurnstileField';
import TotpMfaPanel from '../components/admin/TotpMfaPanel';
import { verifyTurnstileChallenge } from '../turnstileClient';
import { evaluateAdminAccess } from '../securityPolicies';
import {
    findTotpFactor,
    getMfaErrorMessage,
    hasTotpFactor,
    isAdminMfaRequired,
    isMfaProtectedAdmin,
    isValidTotpCode,
    normalizeTotpCode,
} from '../firebaseMfa';
import { clearChunkRecoveryMarker, isChunkLoadError, recoverFromChunkLoadError } from '../chunkLoadRecovery';
import {
    getFirebaseNetworkErrorMessage,
    isFirebaseNetworkError,
    runFirebaseAuthRequestWithRetry,
} from '../firebaseAuthRetry';

const ADMIN_EMAIL_LINK_STORAGE_KEY = 'admin_email_for_sign_in';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const [turnstileStatus, setTurnstileStatus] = useState({ enabled: null, ready: false, error: '' });
    const [mfaResolver, setMfaResolver] = useState(null);
    const [mfaCode, setMfaCode] = useState('');
    const [mfaEnrollmentUser, setMfaEnrollmentUser] = useState(null);
    const [emailLinkUrl, setEmailLinkUrl] = useState('');
    const [emailLinkSent, setEmailLinkSent] = useState(false);
    const emailLinkHandledRef = useRef(false);

    const handleTurnstileStatusChange = useCallback((status) => {
        setTurnstileStatus(status);
    }, []);

    const authorizeAdmin = useCallback(async (user, auth, signOut) => {
        try {
            const [{ db }, { doc, getDoc }, { multiFactor }] = await Promise.all([
                import('../firebase'),
                import('firebase/firestore'),
                import('firebase/auth'),
            ]);
            const adminDocRef = doc(db, "admins", user.uid);
            const adminDocSnap = await getDoc(adminDocRef);
            const profile = adminDocSnap.exists() ? adminDocSnap.data() : null;
            const adminAccess = evaluateAdminAccess(profile);

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

            if (
                isAdminMfaRequired()
                && isMfaProtectedAdmin(profile)
                && !hasTotpFactor(multiFactor(user).enrolledFactors)
            ) {
                setMfaEnrollmentUser(user);
                return;
            }

            window.location.replace('/admin');
        } catch (error) {
            console.error('Admin authorization failed:', error?.code || 'unknown');
            setErrorMsg('حدث خطأ في التحقق من صلاحيات الحساب الإداري.');
        }
    }, []);

    const beginMfaChallenge = useCallback(async (auth, error) => {
        const { getMultiFactorResolver } = await import('firebase/auth');
        const resolver = getMultiFactorResolver(auth, error);
        if (!findTotpFactor(resolver.hints)) {
            throw Object.assign(new Error('unsupported_second_factor'), { code: 'auth/unsupported-second-factor' });
        }
        setPassword('');
        setMfaCode('');
        setMfaResolver(resolver);
    }, []);

    const completeEmailLinkSignIn = useCallback(async (emailAddress, link) => {
        const normalizedEmail = String(emailAddress || '').trim().toLowerCase();
        if (!normalizedEmail) {
            setErrorMsg('أدخل البريد الذي أُرسل إليه رابط الدخول لإكمال التحقق.');
            return;
        }

        setErrorMsg('');
        setIsLoading(true);
        try {
            const [{ getFirebaseAuth }, { signInWithEmailLink, signOut }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();
            try {
                const credential = await signInWithEmailLink(auth, normalizedEmail, link);
                window.localStorage.removeItem(ADMIN_EMAIL_LINK_STORAGE_KEY);
                setEmailLinkUrl('');
                await authorizeAdmin(credential.user, auth, signOut);
            } catch (error) {
                if (error?.code === 'auth/multi-factor-auth-required') {
                    window.localStorage.removeItem(ADMIN_EMAIL_LINK_STORAGE_KEY);
                    await beginMfaChallenge(auth, error);
                    return;
                }
                throw error;
            }
        } catch (error) {
            console.error('Admin email link sign-in failed:', error?.code || 'unknown');
            if (isFirebaseNetworkError(error)) {
                setErrorMsg(getFirebaseNetworkErrorMessage(window.navigator.onLine));
            } else if (error?.code === 'auth/invalid-action-code' || error?.code === 'auth/expired-action-code') {
                setErrorMsg('رابط الدخول غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.');
            } else if (error?.code === 'auth/invalid-email') {
                setErrorMsg('البريد لا يطابق البريد الذي أُرسل إليه رابط الدخول.');
            } else {
                setErrorMsg('تعذر إكمال الدخول عبر البريد. اطلب رابطًا جديدًا ثم حاول مرة أخرى.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [authorizeAdmin, beginMfaChallenge]);

    useEffect(() => {
        if (emailLinkHandledRef.current) return;
        emailLinkHandledRef.current = true;

        const inspectEmailLink = async () => {
            try {
                const [{ getFirebaseAuth }, { isSignInWithEmailLink }] = await Promise.all([
                    import('../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();
                if (!isSignInWithEmailLink(auth, window.location.href)) return;

                const link = window.location.href;
                const storedEmail = window.localStorage.getItem(ADMIN_EMAIL_LINK_STORAGE_KEY) || '';
                setEmailLinkUrl(link);
                if (storedEmail) {
                    setEmail(storedEmail);
                    await completeEmailLinkSignIn(storedEmail, link);
                }
            } catch (error) {
                console.error('Unable to inspect administrator email link:', error?.code || 'unknown');
                setErrorMsg('تعذر التحقق من رابط الدخول عبر البريد. افتح أحدث رسالة وحاول مرة أخرى.');
            }
        };

        inspectEmailLink();
    }, [completeEmailLinkSignIn]);

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

            const [{ getFirebaseAuth }, { signInWithEmailAndPassword, signOut }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            clearChunkRecoveryMarker();
            const auth = await getFirebaseAuth();

            try {
                const userCredential = await runFirebaseAuthRequestWithRetry(
                    () => signInWithEmailAndPassword(auth, email, password),
                );
                await authorizeAdmin(userCredential.user, auth, signOut);
            } catch (error) {
                if (error?.code === 'auth/multi-factor-auth-required') {
                    await beginMfaChallenge(auth, error);
                    return;
                }
                throw error;
            }
        } catch (error) {
            setTurnstileResetKey((value) => value + 1);
            if (recoverFromChunkLoadError(error)) {
                return;
            } else if (isChunkLoadError(error)) {
                setErrorMsg('تعذر تحميل ملفات الإصدار الحالي. أغلق هذا التبويب وافتح صفحة تسجيل الدخول من جديد.');
            } else if (isFirebaseNetworkError(error)) {
                setErrorMsg(getFirebaseNetworkErrorMessage(window.navigator.onLine));
            } else if (
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

    const requestEmailSignInLink = async () => {
        setErrorMsg('');
        setEmailLinkSent(false);
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setErrorMsg('أدخل بريد حساب الإدارة أولًا.');
            return;
        }
        if (!turnstileStatus.ready) {
            setErrorMsg('يرجى الانتظار حتى يكتمل التحقق الأمني.');
            return;
        }

        setIsLoading(true);
        try {
            await verifyTurnstileChallenge(turnstileToken, 'admin-login');
            const [{ getFirebaseAuth }, { sendSignInLinkToEmail }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();
            await sendSignInLinkToEmail(auth, normalizedEmail, {
                url: `${window.location.origin}/admin_login`,
                handleCodeInApp: true,
            });
            window.localStorage.setItem(ADMIN_EMAIL_LINK_STORAGE_KEY, normalizedEmail);
            setEmailLinkSent(true);
            setTurnstileResetKey((value) => value + 1);
        } catch (error) {
            setTurnstileResetKey((value) => value + 1);
            console.error('Unable to send administrator email sign-in link:', error?.code || 'unknown');
            if (error?.code === 'auth/operation-not-allowed') {
                setErrorMsg('الدخول عبر رابط البريد غير مفعّل بعد في Firebase Authentication.');
            } else if (error?.code === 'auth/too-many-requests') {
                setErrorMsg('أُرسلت طلبات كثيرة خلال وقت قصير. انتظر قليلًا ثم حاول مجددًا.');
            } else if (isFirebaseNetworkError(error)) {
                setErrorMsg(getFirebaseNetworkErrorMessage(window.navigator.onLine));
            } else {
                setErrorMsg('تعذر إرسال رابط الدخول. تحقق من البريد ثم حاول مرة أخرى.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMfaChallenge = async (event) => {
        event.preventDefault();
        setErrorMsg('');

        if (!mfaResolver || !isValidTotpCode(mfaCode)) {
            setErrorMsg('أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة.');
            return;
        }

        setIsLoading(true);
        try {
            const [{ getFirebaseAuth }, { signOut, TotpMultiFactorGenerator }] = await Promise.all([
                import('../firebase'),
                import('firebase/auth'),
            ]);
            const factor = findTotpFactor(mfaResolver.hints);
            if (!factor) throw new Error('totp_factor_missing');

            const assertion = TotpMultiFactorGenerator.assertionForSignIn(
                factor.uid,
                normalizeTotpCode(mfaCode),
            );
            const userCredential = await mfaResolver.resolveSignIn(assertion);
            const auth = await getFirebaseAuth();
            setMfaResolver(null);
            setMfaCode('');
            await authorizeAdmin(userCredential.user, auth, signOut);
        } catch (error) {
            console.error('Admin MFA challenge failed:', error?.code || 'unknown');
            setErrorMsg(getMfaErrorMessage(error));
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
                    <h1>{mfaEnrollmentUser ? 'حماية حساب الإدارة' : mfaResolver ? 'التحقق بخطوتين' : emailLinkUrl ? 'إكمال الدخول بالبريد' : 'بوابة الإدارة'}</h1>
                    <p>{mfaEnrollmentUser
                        ? 'أكمل ربط تطبيق المصادقة قبل فتح لوحة الإدارة'
                        : mfaResolver
                            ? 'أدخل الرمز المؤقت من تطبيق المصادقة'
                            : emailLinkUrl
                                ? 'أكد البريد الذي استلم رابط الدخول الآمن'
                            : 'الوصول مقتصر على المصرح لهم فقط'}</p>
                </div>

                {mfaEnrollmentUser ? (
                    <TotpMfaPanel
                        user={mfaEnrollmentUser}
                        required
                        onComplete={async () => {
                            const [{ getFirebaseAuth }, { signOut }] = await Promise.all([
                                import('../firebase'),
                                import('firebase/auth'),
                            ]);
                            await signOut(await getFirebaseAuth());
                            window.location.replace('/admin_login?mfa=verify');
                        }}
                    />
                ) : mfaResolver ? (
                    <form onSubmit={handleMfaChallenge}>
                        <div className="form-group">
                            <label htmlFor="admin-mfa-code">رمز تطبيق المصادقة</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    id="admin-mfa-code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    placeholder="000000"
                                    dir="ltr"
                                    value={mfaCode}
                                    maxLength={6}
                                    required
                                    autoFocus
                                    onChange={(event) => setMfaCode(normalizeTotpCode(event.target.value))}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-login" disabled={isLoading || !isValidTotpCode(mfaCode)}>
                            {isLoading ? 'جاري التحقق...' : 'تحقق وادخل'}
                            <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-shield-halved'}`}></i>
                        </button>
                        <button
                            type="button"
                            className="btn-login btn-login-secondary"
                            disabled={isLoading}
                            onClick={() => {
                                setMfaResolver(null);
                                setMfaCode('');
                                setTurnstileResetKey((value) => value + 1);
                            }}
                        >
                            العودة لإدخال كلمة المرور
                        </button>
                    </form>
                ) : emailLinkUrl ? (
                    <form onSubmit={(event) => { event.preventDefault(); completeEmailLinkSignIn(email, emailLinkUrl); }}>
                        <div className="form-group">
                            <label htmlFor="admin-email-link-address">البريد الذي استلم الرابط</label>
                            <div className="input-wrapper">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    id="admin-email-link-address"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    dir="ltr"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? 'جاري إكمال الدخول...' : 'إكمال الدخول بالبريد'}
                            <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-envelope-circle-check'}`}></i>
                        </button>
                    </form>
                ) : (
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="admin-email">البريد الإلكتروني للإدارة</label>
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope"></i>
                            <input
                                id="admin-email"
                                type="email"
                                required
                                autoComplete="username"
                                placeholder="admin@example.com"
                                dir="ltr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="admin-password">كلمة المرور</label>
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                id="admin-password"
                                type="password"
                                required
                                autoComplete="current-password"
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
                    <div className="login-method-divider"><span>أو</span></div>
                    <button
                        type="button"
                        className="btn-login btn-login-secondary"
                        disabled={isLoading || !turnstileStatus.ready}
                        onClick={requestEmailSignInLink}
                    >
                        إرسال رابط دخول إلى البريد
                        <i className="fa-regular fa-envelope"></i>
                    </button>
                    {emailLinkSent ? (
                        <p className="email-link-success" role="status">أُرسل رابط دخول لمرة واحدة. افتح أحدث رسالة من الجهاز نفسه، ثم أكمل رمز Authenticator إن طُلب.</p>
                    ) : null}
                </form>
                )}

                {!mfaEnrollmentUser ? <Link href="/" className="back-link">
                    <i className="fa-solid fa-arrow-right"></i>
                    العودة للموقع العام
                </Link> : null}
            </div>
        </div>
    );
}
