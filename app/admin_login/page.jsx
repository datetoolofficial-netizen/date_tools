'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import './AdminLogin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            // 1. تسجيل الدخول عبر Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. التحقق أن المستخدم موجود داخل admins/{uid}
            const adminDocRef = doc(db, "admins", user.uid);
            const adminDocSnap = await getDoc(adminDocRef);

            if (!adminDocSnap.exists()) {
                await signOut(auth);
                setErrorMsg("عذراً، هذا الحساب لا يمتلك صلاحيات الدخول للوحة الإدارة.");
                return;
            }

            const adminData = adminDocSnap.data();

            if (adminData.active !== true) {
                await signOut(auth);
                setErrorMsg("تم تعطيل هذا الحساب الإداري.");
                return;
            }

            // 3. الدخول إلى لوحة الإدارة
        window.location.replace('/admin');
        } catch (error) {
            if (
                error.code === 'auth/invalid-credential' ||
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password'
            ) {
                setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMsg("تم حظر الدخول مؤقتاً بسبب محاولات فاشلة كثيرة. يرجى المحاولة لاحقاً.");
            } else {
                setErrorMsg("حدث خطأ في الاتصال: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper" dir="rtl">
            <div className="login-container">
                <div className="lock-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div className="login-header">
                    <h1>بوابة الإدارة</h1>
                    <p>الوصول مقتصر على المصرح لهم فقط</p>
                </div>

                {errorMsg && (
                    <div className="error-message">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>{errorMsg}</span>
                    </div>
                )}

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

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                جاري التحقق...
                            </>
                        ) : (
                            <>
                                تسجيل الدخول
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            </>
                        )}
                    </button>
                </form>

                <a href="/" className="back-link">
                    <i className="fa-solid fa-arrow-right"></i>
                    العودة للموقع العام
                </a>
            </div>
        </div>
    );
}