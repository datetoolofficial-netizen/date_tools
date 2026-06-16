'use client';
import { useState, useEffect } from 'react';
import { getAdminStats, auth } from '../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import './AdminPage.css';

export default function AdminPage() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userRole, setUserRole] = useState('مدير عام'); 

    useEffect(() => {
        // التحقق من حالة تسجيل الدخول أولاً
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // المستخدم مسجل دخوله، ننهي حالة التحقق ونجلب البيانات
                setIsCheckingAuth(false);
                
                if (document.body.classList.contains('dark-mode')) {
                    setIsDarkMode(true);
                }

                fetch('/api/config')
                    .then(async res => {
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return res.json();
                    })
                    .then(data => {
                        if (!data.events) data.events = [];
                        if (!data.externalLinks) data.externalLinks = [];
                        if (!data.internalPages) data.internalPages = [];
                        if (!data.socialLinks) data.socialLinks = [];
                        setConfig(data);
                    })
                    .catch(err => {
                        console.error("Error fetching config:", err);
                        setConfig({ hasError: true });
                    });

                getAdminStats().then(data => setStats(data)).catch(() => setStats({}));
            } else {
                // المستخدم غير مسجل دخوله، تحويله لصفحة تسجيل الدخول
            window.location.replace('/admin_login');            }
        });

        // تنظيم المراقب عند تفريغ المكون
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        setMsg({ text: 'جاري الحفظ...', type: 'info' });
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                setMsg({ text: '✅ تم الحفظ بنجاح!', type: 'success' });
            } else {
                setMsg({ text: '❌ حدث خطأ أثناء الحفظ.', type: 'error' });
            }
        } catch (err) {
            setMsg({ text: '❌ حدث خطأ في الاتصال بالسيرفر.', type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // سيقوم onAuthStateChanged بالتقاط التغيير وتحويل المستخدم تلقائياً
        } catch (error) {
            console.error("خطأ في تسجيل الخروج:", error);
        }
    };

    const handleArrayAdd = (key, defaultObj) => setConfig({ ...config, [key]: [...(config[key] || []), defaultObj] });
    const handleArrayUpdate = (key, index, field, value) => {
        const newArr = [...config[key]];
        newArr[index][field] = value;
        setConfig({ ...config, [key]: newArr });
    };
    const handleArrayRemove = (key, index) => setConfig({ ...config, [key]: config[key].filter((_, i) => i !== index) });

    // شاشات التحميل والخطأ
    if (isCheckingAuth) return <div className="admin-loading">جاري التحقق من الصلاحيات... 🔒</div>;
    if (!config) return <div className="admin-loading">جاري تحميل بوابة الإدارة... ⏳</div>;
    if (config.hasError) return <div className="admin-error">حدث خطأ في قراءة ملف الإعدادات. تأكد من أن ملف config.json مهيأ بشكل صحيح.</div>;

    return (
        <div className="admin-flat-layout" dir="rtl">
            {/* ====== الناف بار العلوي ====== */}
            <nav className="admin-top-navbar">
                <div className="navbar-brand">
                    <i className="fa-solid fa-shield-halved"></i>
                    <h2>لوحة التحكم المركزية</h2>
                </div>
                <div className="navbar-actions">
                    <span className="role-badge">
                        <i className="fa-solid fa-user-shield"></i> {userRole}
                    </span>
                    <button className="icon-btn theme-toggle" onClick={toggleTheme} title="تغيير السمة">
                        <i className={`fa-solid fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> خروج
                    </button>
                </div>
            </nav>

            <div className="admin-main-container">
                {/* شريط الإجراءات الثابت */}
                <div className="admin-action-bar">
                    <div className="action-info">
                        <h2>إعدادات الأداة الشاملة</h2>
                        <p>قم بتعديل كافة الخيارات من مكان واحد واضغط على حفظ.</p>
                    </div>
                    <div className="action-buttons">
                        {msg.text && <span className={`admin-msg ${msg.type}`}>{msg.text}</span>}
                        <button className="save-btn-main" onClick={handleSave}>
                            <i className="fa-solid fa-floppy-disk"></i> حفظ كافة التعديلات
                        </button>
                    </div>
                </div>

                <div className="admin-sections-wrapper">
                    
                    {/* ====== 1. قسم الإحصائيات ====== */}
                    <div className="admin-section-card">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-chart-pie"></i> الإحصائيات والأرباح</h3>
                        </div>
                        {stats ? (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <i className="fa-solid fa-users"></i>
                                    <h4>إجمالي الزيارات</h4>
                                    <span>{stats.visits || 0}</span>
                                </div>
                                <div className="stat-card">
                                    <i className="fa-solid fa-calculator"></i>
                                    <h4>حساب العمر</h4>
                                    <span>{stats.ageCalc || 0} مرة</span>
                                </div>
                                <div className="stat-card">
                                    <i className="fa-solid fa-rotate"></i>
                                    <h4>تحويل التواريخ</h4>
                                    <span>{stats.dateConverter || 0} مرة</span>
                                </div>
                                <div className="stat-card highlight-stat">
                                    <i className="fa-solid fa-mouse-pointer"></i>
                                    <h4>نقرات الإعلانات</h4>
                                    <span>{stats.adClicks || 0} نقرة</span>
                                </div>
                            </div>
                        ) : (
                            <p className="loading-text">جاري سحب البيانات من السيرفر...</p>
                        )}
                    </div>

                    {/* ====== 2. قسم الهوية الأساسية ====== */}
                    <div className="admin-section-card" id="general">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-palette"></i> الهوية البصرية والمعلومات</h3>
                        </div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>عنوان الأداة (اسم الموقع)</label>
                                <div className="input-with-icon">
                                    <i className="fa-solid fa-heading"></i>
                                    <input type="text" value={config.toolDisplayName || ''} onChange={e => setConfig({...config, toolDisplayName: e.target.value})} placeholder="مثال: أدوات التاريخ الشاملة" />
                                </div>
                            </div>
                            
                            <div className="input-group">
                                <label>السلوقن (الوصف القصير)</label>
                                <div className="input-with-icon">
                                    <i className="fa-solid fa-quote-right"></i>
                                    <input type="text" value={config.toolSlogan || ''} onChange={e => setConfig({...config, toolSlogan: e.target.value})} placeholder="مثال: دليلك الشامل للمواعيد" />
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label className="toggle-label">
                                    <input type="checkbox" checked={config.hasLogo || false} onChange={e => setConfig({...config, hasLogo: e.target.checked})} className="toggle-checkbox" />
                                    <span>استخدام صورة الشعار (Logo) بدلاً من النص</span>
                                </label>
                            </div>

                            {config.hasLogo && (
                                <div className="input-group full-width">
                                    <label>مسار الصورة (Logo URL)</label>
                                    <div className="input-with-icon">
                                        <i className="fa-regular fa-image"></i>
                                        <input type="text" value={config.logoUrl || ''} onChange={e => setConfig({...config, logoUrl: e.target.value})} placeholder="مثال: /logo.png" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ====== 3. قسم الصفحات الداخلية ====== */}
                    <div className="admin-section-card" id="pages">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-file-lines"></i> الصفحات الداخلية</h3>
                        </div>
                        <div className="dynamic-list-container">
                            {config.internalPages?.map((page, idx) => (
                                <div key={idx} className="admin-row dynamic-row">
                                    <input type="text" placeholder="اسم الصفحة" value={page.title} onChange={e => handleArrayUpdate('internalPages', idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="مسار الصفحة (slug)" value={page.slug} onChange={e => handleArrayUpdate('internalPages', idx, 'slug', e.target.value)} />
                                    <select className="location-select" value={page.location} onChange={e => handleArrayUpdate('internalPages', idx, 'location', e.target.value)}>
                                        <option value="header">في الهيدر فقط</option>
                                        <option value="footer">في الفوتر فقط</option>
                                        <option value="both">الهيدر والفوتر</option>
                                    </select>
                                    <button className="del-btn" onClick={() => handleArrayRemove('internalPages', idx)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('internalPages', { title: '', slug: '', location: 'footer' })}>
                                <i className="fa-solid fa-plus"></i> إضافة صفحة داخلية
                            </button>
                        </div>
                    </div>

                    {/* ====== 4. قسم السوشيال ميديا والحقوق ====== */}
                    <div className="admin-section-card" id="social">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-hashtag"></i> السوشيال ميديا والحقوق</h3>
                        </div>
                        
                        <div className="input-group" style={{ marginBottom: '30px', maxWidth: '500px' }}>
                            <label>صاحب الحقوق (الفوتر)</label>
                            <div className="input-with-icon">
                                <i className="fa-regular fa-copyright"></i>
                                <input type="text" value={config.copyrightName || ''} onChange={e => setConfig({...config, copyrightName: e.target.value})} placeholder="مثال: أدوات التاريخ" />
                            </div>
                            <div className="preview-text" style={{marginTop:'8px', fontSize:'12px', color:'var(--text-sub)'}}>
                                النتيجة: © {new Date().getFullYear()} جميع الحقوق محفوظة لـ {config.copyrightName || 'أدوات التاريخ'}
                            </div>
                        </div>

                        <hr className="admin-divider"/>

                        <label style={{display:'block', marginBottom:'15px', fontWeight:'bold'}}>حسابات التواصل الاجتماعي:</label>
                        <div className="dynamic-list-container">
                            {config.socialLinks?.map((social, idx) => (
                                <div key={idx} className="admin-row dynamic-row">
                                    <select className="location-select" style={{flex: '0 0 160px', fontFamily: '"Cairo", "Font Awesome 6 Brands", sans-serif'}} value={social.icon} onChange={e => handleArrayUpdate('socialLinks', idx, 'icon', e.target.value)}>
                                        <option value="fa-twitter">&#xf099; منصة X</option>
                                        <option value="fa-snapchat">&#xf2ab; سناب شات</option>
                                        <option value="fa-instagram">&#xf16d; انستقرام</option>
                                        <option value="fa-tiktok">&#xe07b; تيك توك</option>
                                        <option value="fa-youtube">&#xf167; يوتيوب</option>
                                        <option value="fa-whatsapp">&#xf232; واتساب</option>
                                    </select>
                                    <input type="text" placeholder="الرابط (URL)" value={social.url} onChange={e => handleArrayUpdate('socialLinks', idx, 'url', e.target.value)} />
                                    <button className="del-btn" onClick={() => handleArrayRemove('socialLinks', idx)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('socialLinks', { icon: 'fa-twitter', url: '' })}>
                                <i className="fa-solid fa-plus"></i> إضافة حساب تواصل
                            </button>
                        </div>
                    </div>

                    {/* ====== 5. قسم الروابط الخارجية ====== */}
                    <div className="admin-section-card" id="external">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-arrow-up-right-from-square"></i> الروابط الخارجية</h3>
                        </div>
                        <div className="dynamic-list-container">
                            {config.externalLinks?.map((link, idx) => (
                                <div key={idx} className="admin-row dynamic-row">
                                    <input type="text" placeholder="اسم الرابط" value={link.title} onChange={e => handleArrayUpdate('externalLinks', idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="الرابط (https://...)" value={link.url} onChange={e => handleArrayUpdate('externalLinks', idx, 'url', e.target.value)} />
                                    <select className="location-select" value={link.location} onChange={e => handleArrayUpdate('externalLinks', idx, 'location', e.target.value)}>
                                        <option value="header">الهيدر فقط</option>
                                        <option value="footer">الفوتر فقط</option>
                                        <option value="both">الهيدر والفوتر</option>
                                    </select>
                                    <button className="del-btn" onClick={() => handleArrayRemove('externalLinks', idx)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('externalLinks', { title: '', url: '', location: 'header' })}>
                                <i className="fa-solid fa-plus"></i> إضافة رابط خارجي
                            </button>
                        </div>
                    </div>

                    {/* ====== 6. قسم الأحداث ====== */}
                    <div className="admin-section-card" id="events">
                        <div className="section-header">
                            <h3><i className="fa-solid fa-calendar-check"></i> الأحداث والمواعيد</h3>
                        </div>
                        <div className="dynamic-list-container">
                            {config.events?.map((evt, idx) => (
                                <div key={evt.id} className="admin-event-card">
                                    <div className="admin-row dynamic-row" style={{marginBottom: '10px'}}>
                                        <input type="checkbox" checked={evt.active} onChange={e => handleArrayUpdate('events', idx, 'active', e.target.checked)} title="تفعيل/إيقاف" className="toggle-checkbox" style={{width:'auto', margin:0}} />
                                        <input type="text" placeholder="اسم الحدث" value={evt.name} onChange={e => handleArrayUpdate('events', idx, 'name', e.target.value)} style={{flex: 2}} />
                                        <input type="date" value={evt.date} onChange={e => handleArrayUpdate('events', idx, 'date', e.target.value)} />
                                    </div>
                                    <div className="admin-row dynamic-row">
                                        <select className="location-select" value={evt.calendar} onChange={e => handleArrayUpdate('events', idx, 'calendar', e.target.value)}>
                                            <option value="gregorian">ميلادي</option>
                                            <option value="hijri">هجري</option>
                                        </select>
                                        <select className="location-select" value={evt.repeat} onChange={e => handleArrayUpdate('events', idx, 'repeat', e.target.value)}>
                                            <option value="once">مرة واحدة</option>
                                            <option value="monthly">شهرياً</option>
                                            <option value="yearly">سنوياً</option>
                                        </select>
                                        <input type="text" placeholder="أيقونة (fa-star)" value={evt.icon} onChange={e => handleArrayUpdate('events', idx, 'icon', e.target.value)} />
                                        <input type="color" value={evt.color} onChange={e => handleArrayUpdate('events', idx, 'color', e.target.value)} style={{height:'40px', padding:'0'}} />
                                        <button className="del-btn" onClick={() => handleArrayRemove('events', idx)}><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('events', { id: Date.now(), name: '', date: '', calendar: 'gregorian', repeat: 'once', icon: 'fa-star', color: '#3b82f6', active: true })}>
                                <i className="fa-solid fa-plus"></i> إضافة حدث جديد
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}