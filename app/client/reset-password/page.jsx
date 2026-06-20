'use client';

import Link from 'next/link';
import { useState } from 'react';
import Toast from '../../components/Toast';
import '../ClientPortal.css';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const [{ auth }, { sendPasswordResetEmail }] = await Promise.all([
                import('../../firebase'),
                import('firebase/auth'),
            ]);

            await sendPasswordResetEmail(auth, email);
            setMessage({ text: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر إرسال رابط الاستعادة. تأكد من البريد وحاول مجددًا.', type: 'error' });
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
                <p>أدخل بريد حسابك وسنرسل لك رابطًا آمنًا لإعادة التعيين.</p>

                <form onSubmit={handleReset}>
                    <div className="client-form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" required dir="ltr" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>

                    <button type="submit" className="client-primary-btn" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </button>
                </form>

                <div className="client-auth-links">
                    <Link href="/client">العودة لتسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
}
