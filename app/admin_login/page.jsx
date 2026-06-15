'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase'; // تأكد من المسار الصحيح لملف إعدادات فايربيس الخاص بك
import './AdminLogin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // حالة لتحديث صورة الكابتشا
    const [captchaUrl, setCaptchaUrl] = useState('/api/captcha');

    const refreshCaptcha = () => {
        setCaptchaUrl(`/api/captcha?${Date.now()}`);
        setCaptchaCode('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!captchaCode) {
            setErrorMsg("يرجى إدخال رمز الكابتشا.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. التحقق من الكابتشا عبر السيرفر أولاً
            const verifyRes = await fetch('/api/verify-captcha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: captchaCode })
            });
            
            const result = await verifyRes.json();
            
            if (!result.success) {
                setErrorMsg(result.message);
                refreshCaptcha();
                setIsLoading(false);
                return;
            }

            // 2. تسجيل الدخول عبر Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. التحقق الأمني من صلاحيات الإدارة في Firestore
            const adminDocRef = doc(db, "admins", user.uid);
            const adminDocSnap = await getDoc(adminDocRef);

            if (adminDocSnap.exists()) {
                // توجيه المستخدم لصفحة لوحة التحكم بعد النجاح
                window.location.href = '/admin'; // قم بتعديل هذا المسار ليطابق مسار لوحة التحكم لديك
            } else {
                await signOut(auth);
                setErrorMsg("عذراً، هذا الحساب لا يمتلك صلاحيات الدخول للوحة الإدارة.");
                refreshCaptcha();
            }

        } catch (error) {
            refreshCaptcha();
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
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
                        <i className="fa-solid fa-circle-exclamation"></i> <span>{errorMsg}</span>
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

                    <div className="captcha-container">
                        <img 
                            src={captchaUrl} 
                            alt="كابتشا" 
                            className="captcha-img"
                            onClick={refreshCaptcha} 
                            title="اضغط لتغيير الصورة"
                        />
                        <button type="button" onClick={refreshCaptcha} className="captcha-refresh-btn">
                            <i className="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>

                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="أدخل الرمز الموجود في الصورة" 
                            required 
                            className="captcha-input"
                            dir="ltr"
                            value={captchaCode}
                            onChange={(e) => setCaptchaCode(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> جاري التحقق...</>
                        ) : (
                            <>تسجيل الدخول <i className="fa-solid fa-arrow-right-to-bracket"></i></>
                        )}
                    </button>
                </form>

                <a href="/" className="back-link">
                    <i className="fa-solid fa-arrow-right"></i> العودة للموقع العام
                </a>
            </div>
        </div>
    );
}