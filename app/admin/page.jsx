'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAdminStats } from '../firebase';
import './AdminContent.css';

export default function AdminPage() {
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
     fetch('/api/config')
        .then(async res => {
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

             return res.json();
        })
            .then(data => {
                // التأكد من وجود المصفوفات لتفادي الأخطاء
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

    // دوال مساعدة لإدارة القوائم الديناميكية
    const handleArrayAdd = (key, defaultObj) => {
        setConfig({ ...config, [key]: [...(config[key] || []), defaultObj] });
    };
    const handleArrayUpdate = (key, index, field, value) => {
        const newArr = [...config[key]];
        newArr[index][field] = value;
        setConfig({ ...config, [key]: newArr });
    };
    const handleArrayRemove = (key, index) => {
        setConfig({ ...config, [key]: config[key].filter((_, i) => i !== index) });
    };

    if (!config) return <div className="admin-loading">جاري تحميل بوابة الإدارة... ⏳</div>;
    if (config.hasError) return <div className="admin-error">حدث خطأ في قراءة ملف الإعدادات. تأكد من أن ملف config.json مهيأ بشكل صحيح.</div>;

    return (
        <div className="admin-layout" dir="rtl">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="admin-main">
                <div className="admin-header-bar">
                    <h2>
                        {activeTab === 'general' && '⚙️ البيانات الأساسية للأداة'}
                        {activeTab === 'pages' && '📄 إدارة الصفحات الداخلية'}
                        {activeTab === 'social' && '🌐 السوشيال ميديا والحقوق'}
                        {activeTab === 'external' && '🔗 الروابط الخارجية'}
                        {activeTab === 'events' && '📅 الأحداث والمواعيد المستقبلية'}
                        {activeTab === 'stats' && '📊 الإحصائيات والأرباح'}
                    </h2>
                    {msg.text && (
                        <span className={`admin-msg ${msg.type}`}>{msg.text}</span>
                    )}
                    {activeTab !== 'stats' && (
                        <button className="save-btn" onClick={handleSave}>
                            <i className="fa-solid fa-floppy-disk"></i> حفظ التعديلات
                        </button>
                    )}
                </div>

                <div className="admin-body">
                    {/* ====== 1. قسم الهوية الأساسية ====== */}
                    {activeTab === 'general' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>الهوية البصرية والمعلومات</h3>
                                <p>تحكم في اسم الأداة، الشعار، والوصف التسويقي بكل سهولة.</p>
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
                    )}

                    {/* ====== 2. قسم الصفحات الداخلية ====== */}
                    {activeTab === 'pages' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>الصفحات الداخلية</h3>
                                <p>أضف الصفحات الخاصة بالأداة (مثل: سياسة الخصوصية، من نحن) وحدد مكان ظهورها.</p>
                            </div>
                            
                            {config.internalPages?.map((page, idx) => (
                                <div key={idx} className="dynamic-row">
                                    <input type="text" placeholder="اسم الصفحة (مثال: سياسة الخصوصية)" value={page.title} onChange={e => handleArrayUpdate('internalPages', idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="مسار الصفحة (مثال: privacy)" value={page.slug} onChange={e => handleArrayUpdate('internalPages', idx, 'slug', e.target.value)} />
                                    <select className="location-select" value={page.location} onChange={e => handleArrayUpdate('internalPages', idx, 'location', e.target.value)}>
                                        <option value="header">في الهيدر فقط</option>
                                        <option value="footer">في الفوتر فقط</option>
                                        <option value="both">في الهيدر والفوتر</option>
                                    </select>
                                    <button className="del-btn" onClick={() => handleArrayRemove('internalPages', idx)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('internalPages', { title: '', slug: '', location: 'footer' })}>
                                <i className="fa-solid fa-plus"></i> إضافة صفحة داخلية
                            </button>
                        </div>
                    )}

                    {/* ====== 3. قسم السوشيال ميديا والحقوق ====== */}
                    {activeTab === 'social' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>الحقوق الفكرية (الفوتر)</h3>
                                <p>سيظهر التاريخ الحالي وكلمة "جميع الحقوق محفوظة" تلقائياً، فقط أدخل اسمك أو اسم الأداة.</p>
                            </div>
                            <div className="input-group" style={{ marginBottom: '40px', maxWidth: '500px' }}>
                                <label>صاحب الحقوق</label>
                                <div className="input-with-icon">
                                    <i className="fa-regular fa-copyright"></i>
                                    <input type="text" value={config.copyrightName || ''} onChange={e => setConfig({...config, copyrightName: e.target.value})} placeholder="مثال: شبكة أدواتي أو أدوات التاريخ" />
                                </div>
                                <div className="preview-text">
                                    النتيجة في الموقع: © {new Date().getFullYear()} جميع الحقوق محفوظة لـ {config.copyrightName || 'أدوات التاريخ'}
                                </div>
                            </div>

                            <hr className="admin-divider"/>

                            <div className="section-header">
                                <h3>حسابات التواصل الاجتماعي</h3>
                                <p>أضف روابط حساباتك لتظهر كأيقونات تفاعلية أسفل الموقع.</p>
                            </div>
                            {config.socialLinks?.map((social, idx) => (
                                <div key={idx} className="dynamic-row">
                                    <select className="location-select" style={{flex: '0 0 160px', fontFamily: '"Cairo", "Font Awesome 6 Brands", sans-serif'}} value={social.icon} onChange={e => handleArrayUpdate('socialLinks', idx, 'icon', e.target.value)}>
                                        <option value="fa-twitter">&#xf099; منصة X (تويتر)</option>
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
                    )}

                    {/* ====== 4. قسم الروابط الخارجية ====== */}
                    {activeTab === 'external' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>الروابط الخارجية</h3>
                                <p>أضف روابط لمواقع أخرى أو بوابات خارجية (سيتم فتحها في نافذة جديدة).</p>
                            </div>
                            {config.externalLinks?.map((link, idx) => (
                                <div key={idx} className="dynamic-row">
                                    <input type="text" placeholder="اسم الرابط (مثال: بوابة المعلنين)" value={link.title} onChange={e => handleArrayUpdate('externalLinks', idx, 'title', e.target.value)} />
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
                    )}

                    {/* ====== 5. قسم الأحداث (محتفظ به كالسابق) ====== */}
                    {activeTab === 'events' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>إدارة الأحداث والمواعيد</h3>
                            </div>
                            {config.events?.map((evt, idx) => (
                                <div key={evt.id} className="event-card-ui">
                                    <div className="dynamic-row">
                                        <input type="checkbox" checked={evt.active} onChange={e => handleArrayUpdate('events', idx, 'active', e.target.checked)} title="تفعيل/إيقاف" className="toggle-checkbox" style={{margin:0}} />
                                        <input type="text" placeholder="اسم الحدث" value={evt.name} onChange={e => handleArrayUpdate('events', idx, 'name', e.target.value)} style={{flex: 2}} />
                                        <input type="date" value={evt.date} onChange={e => handleArrayUpdate('events', idx, 'date', e.target.value)} />
                                    </div>
                                    <div className="dynamic-row" style={{marginTop: '10px'}}>
                                        <select className="location-select" value={evt.calendar} onChange={e => handleArrayUpdate('events', idx, 'calendar', e.target.value)}>
                                            <option value="gregorian">ميلادي</option><option value="hijri">هجري</option>
                                        </select>
                                        <select className="location-select" value={evt.repeat} onChange={e => handleArrayUpdate('events', idx, 'repeat', e.target.value)}>
                                            <option value="once">مرة واحدة</option><option value="monthly">شهرياً</option><option value="yearly">سنوياً</option>
                                        </select>
                                        <input type="text" placeholder="أيقونة (fa-star)" value={evt.icon} onChange={e => handleArrayUpdate('events', idx, 'icon', e.target.value)} />
                                        <input type="color" value={evt.color} onChange={e => handleArrayUpdate('events', idx, 'color', e.target.value)} className="color-picker" />
                                        <button className="del-btn" onClick={() => handleArrayRemove('events', idx)}><i className="fa-solid fa-trash"></i> حذف</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => handleArrayAdd('events', { id: Date.now(), name: '', date: '', calendar: 'gregorian', repeat: 'once', icon: 'fa-star', color: '#3b82f6', active: true })}>
                                <i className="fa-solid fa-plus"></i> إضافة حدث جديد
                            </button>
                        </div>
                    )}

                    {/* ====== 6. قسم الإحصائيات ====== */}
                    {activeTab === 'stats' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h3>إحصائيات الأداة الحية</h3>
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
                    )}
                </div>
            </div>
        </div>
    );
}