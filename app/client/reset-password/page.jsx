'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../../components/Toast';
import TurnstileField from '../../components/TurnstileField';
import { verifyTurnstileChallenge } from '../../turnstileClient';
import '../ClientPortal.css';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);

    const handleReset = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: 'info' });

        try {
            await verifyTurnstileChallenge(turnstileToken, 'advertiser-reset');

            const [{ getFirebaseAuth }, { sendPasswordResetEmail }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
            ]);
            const auth = await getFirebaseAuth();

            await sendPasswordResetEmail(auth, email.trim());
            setMessage({ text: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك إن كان الحساب موجودًا.', type: 'success' });
        } catch (error) {
            setTurnstileResetKey((value) => value + 1);
            setMessage({
                text: error.code === 'security/turnstile-failed'
                    ? 'تعذر إكمال التحقق الأمني. أعد المحاولة من فضلك.'
                    : 'تعذر إرسال رابط الاستعادة. تأكد من البريد وحاول مجددًا.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="client-portal client-auth-page" dir="rtl">
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />

            <div className="client-auth-card">
                <div className="client-auth-icon">
                    <i className="fa-solid fa-key"></i>
                </div>
                <h1>استعادة كلمة المرور</h1>
                <p>أدخل بريد حسابك، وسنرسل رابطًا آمنًا لإعادة تعيين كلمة المرور.</p>

                <form onSubmit={handleReset}>
                    <div className="client-form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" required dir="ltr" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>

                    <div className="client-turnstile-note" hidden>
                        ستتم إضافة تحقق Turnstile هنا عند توفير بيانات Cloudflare الخاصة به.
                    </div>

                    <TurnstileField
                        action="advertiser-reset"
                        onTokenChange={setTurnstileToken}
                        resetKey={turnstileResetKey}
                    />

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%', marginTop: 14 }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/client">العودة لتسجيل الدخول</Link>
                    <Link href="/">الموقع العام</Link>
                </div>
            </div>
        </div>
    );
}
