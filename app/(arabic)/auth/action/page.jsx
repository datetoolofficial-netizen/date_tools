'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
    getSafeEmailActionContinueUrl,
    normalizeEmailActionMode,
} from '../../../firebaseEmailActions';
import styles from './ActionHandler.module.css';

const INITIAL_STATE = {
    status: 'loading',
    message: 'جاري التحقق من الرابط الآمن...',
};

export default function FirebaseEmailActionPage() {
    const [action, setAction] = useState(INITIAL_STATE);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [busy, setBusy] = useState(false);

    const params = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const query = new URLSearchParams(window.location.search);
        return {
            mode: normalizeEmailActionMode(query.get('mode')),
            oobCode: query.get('oobCode') || '',
            continueUrl: getSafeEmailActionContinueUrl(query.get('continueUrl'), window.location.origin),
        };
    }, []);

    useEffect(() => {
        let active = true;

        const processAction = async () => {
            if (!params?.mode || !params.oobCode) {
                if (active) setAction({ status: 'error', message: 'رابط التحقق غير صالح أو ينقصه رمز العملية.' });
                return;
            }

            try {
                const [{ getFirebaseAuth }, authModule] = await Promise.all([
                    import('../../../firebase'),
                    import('firebase/auth'),
                ]);
                const auth = await getFirebaseAuth();

                if (params.mode === 'verifyEmail') {
                    await authModule.applyActionCode(auth, params.oobCode);
                    if (active) setAction({ status: 'success', message: 'تم توثيق البريد الإلكتروني بنجاح.' });
                    return;
                }

                if (params.mode === 'recoverEmail') {
                    await authModule.checkActionCode(auth, params.oobCode);
                    await authModule.applyActionCode(auth, params.oobCode);
                    if (active) setAction({ status: 'success', message: 'تمت استعادة عنوان البريد السابق بنجاح.' });
                    return;
                }

                await authModule.verifyPasswordResetCode(auth, params.oobCode);
                if (active) setAction({ status: 'password', message: 'أدخل كلمة مرور جديدة للحساب.' });
            } catch (error) {
                console.error('Unable to process Firebase email action:', error?.code || 'unknown');
                if (active) {
                    setAction({
                        status: 'error',
                        message: 'الرابط غير صالح أو انتهت صلاحيته. اطلب رسالة جديدة ثم حاول مرة أخرى.',
                    });
                }
            }
        };

        processAction();
        return () => {
            active = false;
        };
    }, [params]);

    const submitPassword = async (event) => {
        event.preventDefault();
        if (password.length < 10) {
            setAction({ status: 'password', message: 'استخدم كلمة مرور بطول 10 أحرف على الأقل.' });
            return;
        }
        if (password !== passwordConfirmation) {
            setAction({ status: 'password', message: 'كلمتا المرور غير متطابقتين.' });
            return;
        }

        setBusy(true);
        try {
            const [{ getFirebaseAuth }, { confirmPasswordReset }] = await Promise.all([
                import('../../../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();
            await confirmPasswordReset(auth, params.oobCode, password);
            setPassword('');
            setPasswordConfirmation('');
            setAction({ status: 'success', message: 'تم تحديث كلمة المرور بنجاح.' });
        } catch (error) {
            console.error('Unable to confirm Firebase password reset:', error?.code || 'unknown');
            setAction({
                status: 'error',
                message: 'تعذر تحديث كلمة المرور. اطلب رابط استعادة جديدًا ثم حاول مرة أخرى.',
            });
        } finally {
            setBusy(false);
        }
    };

    const destination = params?.continueUrl || (params?.mode === 'verifyEmail' ? '/admin/account' : '/client');

    return (
        <main className={styles.page} dir="rtl">
            <section className={styles.card} aria-live="polite">
                <div className={`${styles.icon} ${styles[action.status] || ''}`} aria-hidden="true">
                    <i className={`fa-solid ${action.status === 'success' ? 'fa-circle-check' : action.status === 'error' ? 'fa-triangle-exclamation' : 'fa-shield-halved'}`}></i>
                </div>
                <h1>أمان الحساب</h1>
                <p>{action.message}</p>

                {action.status === 'password' ? (
                    <form className={styles.form} onSubmit={submitPassword}>
                        <label>
                            <span>كلمة المرور الجديدة</span>
                            <input
                                type="password"
                                autoComplete="new-password"
                                minLength={10}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <span>تأكيد كلمة المرور</span>
                            <input
                                type="password"
                                autoComplete="new-password"
                                minLength={10}
                                value={passwordConfirmation}
                                onChange={(event) => setPasswordConfirmation(event.target.value)}
                                required
                            />
                        </label>
                        <button type="submit" disabled={busy}>
                            {busy ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
                        </button>
                    </form>
                ) : null}

                {action.status === 'success' ? <Link className={styles.primaryLink} href={destination}>متابعة</Link> : null}
                {action.status === 'error' ? <Link className={styles.secondaryLink} href="/">العودة إلى الموقع</Link> : null}
            </section>
        </main>
    );
}
