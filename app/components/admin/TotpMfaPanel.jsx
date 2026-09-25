'use client';

import { useEffect, useMemo, useState } from 'react';
import { multiFactor } from 'firebase/auth';
import Image from 'next/image';
import {
    findTotpFactor,
    getMfaErrorMessage,
    hasTotpFactor,
    isValidTotpCode,
    normalizeTotpCode,
} from '../../firebaseMfa';
import styles from './TotpMfaPanel.module.css';

export default function TotpMfaPanel({ user, onComplete, onDisabled, required = false }) {
    const [secret, setSecret] = useState(null);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [busy, setBusy] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [enrolled, setEnrolled] = useState(false);
    const [emailVerified, setEmailVerified] = useState(Boolean(user?.emailVerified));
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);
    const [confirmDisable, setConfirmDisable] = useState(false);

    const enrolledFactors = useMemo(() => {
        if (!user) return [];
        return multiFactor(user).enrolledFactors || [];
    }, [user]);

    useEffect(() => {
        setEnrolled(hasTotpFactor(enrolledFactors));
    }, [enrolledFactors]);

    useEffect(() => {
        setEmailVerified(Boolean(user?.emailVerified));
    }, [user?.emailVerified]);

    useEffect(() => () => {
        setSecret(null);
        setQrDataUrl('');
        setVerificationCode('');
    }, []);

    const beginEnrollment = async () => {
        setErrorMessage('');

        if (!emailVerified) {
            setErrorMessage(getMfaErrorMessage({ code: 'auth/unverified-email' }));
            return;
        }

        setBusy(true);
        try {
            const [{ multiFactor, TotpMultiFactorGenerator }, qrCodeModule] = await Promise.all([
                import('firebase/auth'),
                import('qrcode'),
            ]);
            const session = await multiFactor(user).getSession();
            const generatedSecret = await TotpMultiFactorGenerator.generateSecret(session);
            const uri = generatedSecret.generateQrCodeUrl(user.email || user.uid, 'date-tool.com');
            const toDataUrl = qrCodeModule.toDataURL || qrCodeModule.default?.toDataURL;
            if (!toDataUrl) throw new Error('qr_encoder_unavailable');
            const dataUrl = await toDataUrl(uri, {
                errorCorrectionLevel: 'M',
                margin: 1,
                width: 220,
            });

            setSecret(generatedSecret);
            setQrDataUrl(dataUrl);
            setVerificationCode('');
        } catch (error) {
            console.error('Unable to start TOTP enrollment:', error?.code || 'unknown');
            setErrorMessage(getMfaErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    const sendVerificationMessage = async () => {
        setErrorMessage('');
        setBusy(true);
        try {
            const { sendEmailVerification } = await import('firebase/auth');
            await sendEmailVerification(user, {
                url: `${window.location.origin}/admin/account`,
                handleCodeInApp: false,
            });
            setVerificationEmailSent(true);
        } catch (error) {
            console.error('Unable to send administrator email verification:', error?.code || 'unknown');
            setErrorMessage(getMfaErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    const refreshEmailVerification = async () => {
        setErrorMessage('');
        setBusy(true);
        try {
            await user.reload();
            const verified = Boolean(user.emailVerified);
            setEmailVerified(verified);
            if (!verified) {
                setErrorMessage('لم يكتمل توثيق البريد بعد. افتح رابط التوثيق من البريد ثم أعد التحقق.');
            }
        } catch (error) {
            console.error('Unable to refresh administrator email verification:', error?.code || 'unknown');
            setErrorMessage(getMfaErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    const finishEnrollment = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!secret || !isValidTotpCode(verificationCode)) {
            setErrorMessage('أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة.');
            return;
        }

        setBusy(true);
        try {
            const { multiFactor, TotpMultiFactorGenerator } = await import('firebase/auth');
            const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
                secret,
                normalizeTotpCode(verificationCode),
            );
            await multiFactor(user).enroll(assertion, 'تطبيق المصادقة');
            await user.getIdToken(true);

            setSecret(null);
            setQrDataUrl('');
            setVerificationCode('');
            setEnrolled(true);
            await onComplete?.();
        } catch (error) {
            console.error('Unable to finish TOTP enrollment:', error?.code || 'unknown');
            setErrorMessage(getMfaErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    const disableEnrollment = async () => {
        setErrorMessage('');
        const factor = findTotpFactor(multiFactor(user).enrolledFactors);
        if (!factor) {
            setEnrolled(false);
            setConfirmDisable(false);
            return;
        }

        setBusy(true);
        try {
            await multiFactor(user).unenroll(factor.uid);
            await user.getIdToken(true);
            setEnrolled(false);
            setConfirmDisable(false);
            await onDisabled?.({ signedOut: false });
        } catch (error) {
            if (error?.code === 'auth/user-token-expired') {
                setEnrolled(false);
                setConfirmDisable(false);
                await onDisabled?.({ signedOut: true });
                return;
            }
            console.error('Unable to disable TOTP enrollment:', error?.code || 'unknown');
            setErrorMessage(getMfaErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.panel}>
                <p className={styles.error}>تعذر قراءة جلسة الحساب الحالية. أعد تسجيل الدخول ثم حاول مرة أخرى.</p>
            </div>
        );
    }

    if (enrolled) {
        return (
            <div className={styles.panel}>
                <div className={styles.status}>
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <div>
                        <strong>المصادقة الثنائية عبر تطبيق Authenticator مفعّلة</strong>
                        <small>سيُطلب رمز مؤقت بعد كلمة المرور في كل جلسة دخول جديدة.</small>
                    </div>
                </div>
                {!confirmDisable ? (
                    <div className={styles.actions}>
                        <button type="button" className={styles.danger} onClick={() => setConfirmDisable(true)}>
                            إيقاف المصادقة الثنائية
                        </button>
                    </div>
                ) : (
                    <div className={styles.disableConfirmation} role="alert">
                        <div>
                            <strong>هل تريد إيقاف Authenticator؟</strong>
                            <p>سيعود الحساب إلى عامل دخول واحد حتى تعيد التفعيل. قد يسجل Firebase خروجك لإتمام التغيير بأمان.</p>
                        </div>
                        <div className={styles.actions}>
                            <button type="button" className={styles.danger} onClick={disableEnrollment} disabled={busy}>
                                {busy ? 'جاري الإيقاف...' : 'نعم، إيقاف العامل الثاني'}
                            </button>
                            <button type="button" className={styles.secondary} onClick={() => setConfirmDisable(false)} disabled={busy}>إلغاء</button>
                        </div>
                    </div>
                )}
                {errorMessage ? <p className={styles.error} role="alert">{errorMessage}</p> : null}
                <p className={styles.warning}>لا توقف الوسيلة إلا بعد التأكد من البريد وطرق الاسترداد. يمكنك إعادة تفعيلها لاحقًا من الصفحة نفسها.</p>
            </div>
        );
    }

    return (
        <div className={styles.panel}>
            <div className={styles.status}>
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <div>
                    <strong>{required ? 'يجب حماية هذا الحساب بعامل ثانٍ' : 'المصادقة الثنائية غير مفعّلة لهذا الحساب'}</strong>
                    <small>يُنشأ السر ويُعرض داخل هذه الجلسة فقط، ولا يُرسل إلى خادم QR خارجي.</small>
                </div>
            </div>

            {!emailVerified ? (
                <div className={styles.verification}>
                    <p>وثّق بريد حساب الإدارة قبل إنشاء مفتاح Authenticator. لا تعرض المنصة عنوان البريد أو رابط التوثيق داخل الصفحة.</p>
                    <div className={styles.actions}>
                        <button type="button" className={styles.primary} onClick={sendVerificationMessage} disabled={busy}>
                            {busy ? 'جاري الإرسال...' : 'إرسال رسالة توثيق البريد'}
                        </button>
                        <button type="button" className={styles.secondary} onClick={refreshEmailVerification} disabled={busy}>
                            تحققت من البريد
                        </button>
                    </div>
                    {verificationEmailSent ? (
                        <p className={styles.success} role="status">أُرسلت رسالة التوثيق. افتح الرابط من بريدك ثم عد واضغط «تحققت من البريد».</p>
                    ) : null}
                </div>
            ) : !secret ? (
                <div className={styles.actions}>
                    <button type="button" className={styles.primary} onClick={beginEnrollment} disabled={busy}>
                        <i className={`fa-solid ${busy ? 'fa-spinner fa-spin' : 'fa-qrcode'}`} aria-hidden="true"></i>{' '}
                        {busy ? 'جاري إنشاء الرمز...' : 'بدء إعداد تطبيق المصادقة'}
                    </button>
                </div>
            ) : (
                <form className={styles.setup} onSubmit={finishEnrollment}>
                    <Image
                        className={styles.qr}
                        src={qrDataUrl}
                        width={220}
                        height={220}
                        unoptimized
                        alt="رمز QR لإضافة حساب date-tool.com إلى تطبيق المصادقة"
                    />
                    <div className={styles.steps}>
                        <ol>
                            <li>افتح تطبيق Authenticator على جهاز موثوق.</li>
                            <li>امسح رمز QR، أو أدخل المفتاح يدويًا.</li>
                            <li>أدخل الرمز الحالي المكوّن من 6 أرقام لإكمال الربط.</li>
                        </ol>
                        <div className={styles.secret}>
                            <span>المفتاح اليدوي</span>
                            <code dir="ltr">{secret.secretKey}</code>
                        </div>
                        <label className={styles.codeField}>
                            <span>رمز تطبيق المصادقة</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={verificationCode}
                                onChange={(event) => setVerificationCode(normalizeTotpCode(event.target.value))}
                                maxLength={6}
                                required
                                dir="ltr"
                                aria-label="رمز تطبيق المصادقة"
                            />
                        </label>
                        <div className={styles.actions}>
                            <button type="submit" className={styles.primary} disabled={busy || !isValidTotpCode(verificationCode)}>
                                {busy ? 'جاري التحقق...' : 'تفعيل المصادقة الثنائية'}
                            </button>
                            <button
                                type="button"
                                className={styles.secondary}
                                disabled={busy}
                                onClick={() => {
                                    setSecret(null);
                                    setQrDataUrl('');
                                    setVerificationCode('');
                                    setErrorMessage('');
                                }}
                            >
                                إلغاء هذا الرمز
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {errorMessage ? <p className={styles.error} role="alert">{errorMessage}</p> : null}
            <p className={styles.warning}>Firebase لا ينشئ رموز استعادة تلقائيًا لـTOTP؛ يبقى حساب Google المالك المحمي وFirebase Console مسار الاسترداد الإداري عند فقد الجهاز.</p>
        </div>
    );
}
