'use client';

import Link from 'next/link';
import { multiFactor } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import TotpMfaPanel from '../../components/admin/TotpMfaPanel';
import { getAdminRoleLabel } from '../../adminAccess';
import { hasTotpFactor, hasTotpSecondFactorClaim } from '../../firebaseMfa';
import { assertProductionMutationAllowed } from '../../localMutationSafety';
import { useAdminShell } from '../AdminShell';

const PROVIDER_LABELS = {
    password: 'البريد وكلمة المرور',
    'google.com': 'حساب Google',
    phone: 'رقم الهاتف',
};

function toDate(value) {
    if (!value) return null;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
    const date = toDate(value);
    if (!date) return 'غير مسجل';
    return new Intl.DateTimeFormat('ar-SA', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function AccountDetail({ icon, label, value, ltr = false, tone = '' }) {
    return (
        <div className={`admin-account-detail ${tone ? `is-${tone}` : ''}`}>
            <span className="admin-account-detail-icon"><i className={`fa-solid ${icon}`}></i></span>
            <div>
                <small>{label}</small>
                <strong dir={ltr ? 'ltr' : undefined}>{value}</strong>
            </div>
        </div>
    );
}

function SectionHeading({ icon, title, description }) {
    return (
        <header className="legacy-section-heading">
            <span className="legacy-section-icon"><i className={`fa-solid ${icon}`}></i></span>
            <div><h2>{title}</h2><p>{description}</p></div>
        </header>
    );
}

export default function AdminAccountPage() {
    const { adminProfile, authUser, permissions = [] } = useAdminShell() || {};
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [confirmPasswordReset, setConfirmPasswordReset] = useState(false);
    const [sendingPasswordReset, setSendingPasswordReset] = useState(false);
    const [sessionUsedMfa, setSessionUsedMfa] = useState(false);
    const [totpEnrolled, setTotpEnrolled] = useState(() => (
        Boolean(authUser && hasTotpFactor(multiFactor(authUser).enrolledFactors))
    ));

    const providers = useMemo(() => {
        const labels = (authUser?.providerData || [])
            .map((provider) => PROVIDER_LABELS[provider.providerId] || provider.providerId)
            .filter(Boolean);
        return [...new Set(labels)].join('، ') || 'غير مسجل';
    }, [authUser]);

    useEffect(() => {
        setTotpEnrolled(Boolean(authUser && hasTotpFactor(multiFactor(authUser).enrolledFactors)));
    }, [authUser]);

    const refreshSessionStatus = useCallback(async () => {
        if (!authUser) return;
        try {
            const token = await authUser.getIdTokenResult();
            setSessionUsedMfa(hasTotpSecondFactorClaim(token.claims));
        } catch {
            setSessionUsedMfa(false);
        }
    }, [authUser]);

    useEffect(() => {
        refreshSessionStatus();
    }, [refreshSessionStatus]);

    const sendPasswordReset = async () => {
        if (!authUser?.email) {
            setMessage({ text: 'لا يوجد بريد إلكتروني مرتبط بهذا الحساب.', type: 'error' });
            return;
        }

        setSendingPasswordReset(true);
        try {
            assertProductionMutationAllowed();
            const [{ getFirebaseAuth }, { sendPasswordResetEmail }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();
            await sendPasswordResetEmail(auth, authUser.email, {
                url: `${window.location.origin}/admin/account`,
                handleCodeInApp: false,
            });
            setConfirmPasswordReset(false);
            setMessage({ text: 'أُرسل رابط تغيير كلمة المرور إلى بريد الحساب.', type: 'success' });
        } catch (error) {
            console.error('Unable to send account password reset:', error?.code || 'unknown');
            setMessage({ text: 'تعذر إرسال رابط تغيير كلمة المرور. حاول مرة أخرى لاحقًا.', type: 'error' });
        } finally {
            setSendingPasswordReset(false);
        }
    };

    const roleLabel = getAdminRoleLabel(adminProfile || {});
    const accountName = adminProfile?.name || authUser?.displayName || 'حساب إداري';
    const accountEmail = authUser?.email || adminProfile?.email || 'غير مسجل';
    const accountCreatedAt = authUser?.metadata?.creationTime || adminProfile?.createdAt;
    const lastSignInAt = authUser?.metadata?.lastSignInTime;

    return (
        <div className="admin-section-page admin-account-settings-page">
            <Toast
                visible={Boolean(message.text)}
                message={message.text}
                type={message.type}
                onClose={() => setMessage({ text: '', type: 'info' })}
            />

            <header className="admin-page-hero admin-account-hero">
                <div>
                    <span>الملف الشخصي وأمان الدخول</span>
                    <h1>إعدادات الحساب</h1>
                    <p>بيانات حسابك الإداري وحالة التوثيق والمصادقة الثنائية ووسائل إدارة الدخول.</p>
                </div>
                <div className="admin-account-hero-identity">
                    <span><i className="fa-solid fa-user-shield"></i></span>
                    <div><strong>{accountName}</strong><small>{roleLabel}</small></div>
                </div>
            </header>

            <section className="legacy-section-card">
                <SectionHeading
                    icon="fa-address-card"
                    title="بيانات الحساب"
                    description="معلومات الهوية والصلاحيات المرتبطة بجلسة الإدارة الحالية."
                />
                <div className="admin-account-details-grid">
                    <AccountDetail icon="fa-user" label="الاسم" value={accountName} />
                    <AccountDetail icon="fa-envelope" label="البريد الإلكتروني" value={accountEmail} ltr />
                    <AccountDetail icon="fa-user-tag" label="الدور الإداري" value={roleLabel} />
                    <AccountDetail icon="fa-circle-check" label="حالة الحساب" value={adminProfile?.active ? 'نشط' : 'غير نشط'} tone={adminProfile?.active ? 'success' : 'danger'} />
                    <AccountDetail icon="fa-list-check" label="الصلاحيات الفعالة" value={`${permissions.length} صلاحية`} />
                    <AccountDetail icon="fa-fingerprint" label="معرف الحساب" value={authUser?.uid || adminProfile?.id || 'غير مسجل'} ltr />
                    <AccountDetail icon="fa-calendar-plus" label="تاريخ إنشاء الحساب" value={formatDate(accountCreatedAt)} />
                    <AccountDetail icon="fa-clock-rotate-left" label="آخر تسجيل دخول" value={formatDate(lastSignInAt)} />
                    <AccountDetail icon="fa-right-to-bracket" label="طريقة الدخول" value={providers} />
                    <AccountDetail icon="fa-pen-to-square" label="آخر تحديث للملف" value={formatDate(adminProfile?.updatedAt)} />
                </div>
            </section>

            <section className="legacy-section-card">
                <SectionHeading
                    icon="fa-shield-halved"
                    title="حالة حماية الحساب"
                    description="ملخص سريع قبل إدارة المصادقة الثنائية أو اختبار جلسة دخول جديدة."
                />
                <div className="admin-account-security-grid">
                    <AccountDetail icon="fa-envelope-circle-check" label="توثيق البريد" value={authUser?.emailVerified ? 'موثّق' : 'غير موثّق'} tone={authUser?.emailVerified ? 'success' : 'warning'} />
                    <AccountDetail icon="fa-mobile-screen-button" label="Authenticator" value={totpEnrolled ? 'مفعّل' : 'غير مفعّل'} tone={totpEnrolled ? 'success' : 'warning'} />
                    <AccountDetail icon="fa-key" label="الجلسة الحالية" value={sessionUsedMfa ? 'دخلت بالعامل الثاني' : 'لم تُختبر بالعامل الثاني بعد'} tone={sessionUsedMfa ? 'success' : 'warning'} />
                </div>
                {!sessionUsedMfa && totpEnrolled ? (
                    <div className="admin-account-note is-warning">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <p><strong>اختبار الدخول ما زال مطلوبًا.</strong> سجّل الخروج ثم ادخل بكلمة المرور ورمز Authenticator قبل فرض المصادقة الثنائية على الأدوار الحساسة.</p>
                    </div>
                ) : null}
            </section>

            <section className="legacy-section-card">
                <SectionHeading
                    icon="fa-mobile-screen-button"
                    title="المصادقة الثنائية"
                    description="حماية الحساب بتطبيق Authenticator. لا يُرسل المفتاح أو رمز QR إلى أي خدمة خارجية."
                />
                <TotpMfaPanel
                    user={authUser}
                    onComplete={async () => {
                        setTotpEnrolled(true);
                        await refreshSessionStatus();
                        setMessage({ text: 'تم تفعيل المصادقة الثنائية. بقي اختبار تسجيل دخول جديد قبل فرضها على الأدوار الحساسة.', type: 'success' });
                    }}
                    onDisabled={async ({ signedOut }) => {
                        setTotpEnrolled(false);
                        if (signedOut) {
                            window.location.replace('/admin_login?mfa=removed');
                            return;
                        }
                        await refreshSessionStatus();
                        setMessage({ text: 'تم إيقاف المصادقة الثنائية. يمكنك إعادة تفعيلها من هذه الصفحة.', type: 'warning' });
                    }}
                />
            </section>

            <section className="legacy-section-card">
                <SectionHeading
                    icon="fa-key"
                    title="كلمة المرور والاسترداد"
                    description="يرسل Firebase رابطًا مؤقتًا إلى البريد الموثق، ولا تعرض المنصة كلمة المرور أو تحفظها."
                />
                <div className="admin-account-password-row">
                    <div>
                        <strong>تغيير كلمة المرور</strong>
                        <p>استخدم الرابط المرسل إلى بريد الحساب، ثم سجّل الدخول مجددًا عند اكتمال التغيير.</p>
                    </div>
                    {!confirmPasswordReset ? (
                        <button type="button" className="legacy-secondary-btn" onClick={() => setConfirmPasswordReset(true)}>
                            <i className="fa-solid fa-envelope"></i> إرسال رابط التغيير
                        </button>
                    ) : (
                        <div className="admin-account-confirm-actions" role="group" aria-label="تأكيد إرسال رابط تغيير كلمة المرور">
                            <button type="button" className="legacy-primary-btn" onClick={sendPasswordReset} disabled={sendingPasswordReset}>
                                <i className={`fa-solid ${sendingPasswordReset ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                                {sendingPasswordReset ? 'جاري الإرسال...' : 'تأكيد الإرسال'}
                            </button>
                            <button type="button" className="legacy-secondary-btn" onClick={() => setConfirmPasswordReset(false)} disabled={sendingPasswordReset}>إلغاء</button>
                        </div>
                    )}
                </div>
                <div className="admin-account-note">
                    <i className="fa-solid fa-circle-info"></i>
                    <p>يمكن إيقاف Authenticator بخطوة تأكيد واضحة ثم إعادة تفعيله من هذه الصفحة. عند فقد الجهاز استخدم حساب Google المالك المحمي وFirebase Console وفق خطة الاسترداد.</p>
                </div>
                <Link className="admin-account-security-link" href="/admin/security">
                    <i className="fa-solid fa-shield"></i> الانتقال إلى أمان المنصة وتقاريرها
                </Link>
            </section>
        </div>
    );
}
