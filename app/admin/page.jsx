'use client';
import { useState, useEffect } from 'react';
import { getAdminStats } from '../firebase';

export default function AdminPage() {
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('settings'); // settings, events, stats
    const [msg, setMsg] = useState('');

    useEffect(() => {
        // جلب الإعدادات مع معالجة الأخطاء لمنع التعليق
        fetch('/api/config')
            .then(res => {
                if (!res.ok) throw new Error('فشل الاتصال بملف الإعدادات');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                if (!data.events) data.events = [];
                setConfig(data);
            })
            .catch(err => {
                console.error("Error:", err);
                setConfig({ hasError: true, errorMsg: 'لم يتم العثور على الإعدادات. تأكد من حل مشكلة المسار (الخطأ البرتقالي).' });
            });

        // جلب الإحصائيات
        getAdminStats()
            .then(data => setStats(data))
            .catch(() => setStats({}));
    }, []);

    const handleSave = async () => {
        setMsg('جاري الحفظ...');
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        if (res.ok) setMsg('✅ تم الحفظ بنجاح!');
        else setMsg('❌ حدث خطأ.');
        setTimeout(() => setMsg(''), 3000);
    };

    // إدارة الروابط
    const addLink = () => setConfig({ ...config, externalLinks: [...(config.externalLinks || []), { title: '', url: '', location: 'header' }] });
    const updateLink = (idx, key, val) => { const newLinks = [...config.externalLinks]; newLinks[idx][key] = val; setConfig({ ...config, externalLinks: newLinks }); };
    const removeLink = (idx) => setConfig({ ...config, externalLinks: config.externalLinks.filter((_, i) => i !== idx) });

    // إدارة الأحداث
    const addEvent = () => {
        const newEvents = [...(config.events || []), { id: Date.now(), name: '', date: '', calendar: 'gregorian', repeat: 'once', icon: 'fa-star', color: '#3b82f6', active: true }];
        setConfig({ ...config, events: newEvents });
    };
    const updateEvent = (idx, key, val) => { const newEvents = [...config.events]; newEvents[idx][key] = val; setConfig({ ...config, events: newEvents }); };
    const removeEvent = (idx) => setConfig({ ...config, events: config.events.filter((_, i) => i !== idx) });

    if (!config) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: 'bold' }}>جاري تحميل لوحة التحكم... ⏳</div>;
    
    // واجهة الخطأ في حال فشل القراءة
    if (config.hasError) return (
        <div style={{ padding: '50px', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
            <h2>عذراً، حدث خطأ!</h2>
            <p>{config.errorMsg}</p>
        </div>
    );

    return (
        <div className="admin-layout" dir="rtl">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>⚙️ الإدارة</h2>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><i className="fa-solid fa-sliders"></i> الإعدادات العامة</button>
                    <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}><i className="fa-regular fa-calendar-plus"></i> الأحداث والمواعيد</button>
                    <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}><i className="fa-solid fa-chart-line"></i> الإحصائيات</button>
                    <a href="/" className="back-home"><i className="fa-solid fa-arrow-right-from-bracket"></i> العودة للموقع</a>
                </nav>
            </div>

            <div className="admin-content">
                <div className="admin-header-bar">
                    <h2>{activeTab === 'settings' ? 'الإعدادات العامة والروابط' : activeTab === 'events' ? 'إدارة المواعيد والأحداث' : 'إحصائيات الأداة والأرباح'}</h2>
                    {msg && <span className="admin-msg" style={{ background: '#10b98120', color: '#10b981', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}>{msg}</span>}
                    {(activeTab === 'settings' || activeTab === 'events') && (
                        <button className="save-btn" onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i> حفظ التعديلات</button>
                    )}
                </div>

                <div className="admin-body">
                    {/* ===== قسم الإعدادات العامة ===== */}
                    {activeTab === 'settings' && (
                        <div className="admin-section">
                            <div className="input-group">
                                <label>اسم الأداة:</label>
                                <input type="text" value={config.toolDisplayName || ''} onChange={e => setConfig({...config, toolDisplayName: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>وصف الأداة (Slogan):</label>
                                <input type="text" value={config.toolSlogan || ''} onChange={e => setConfig({...config, toolSlogan: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>نص حقوق الفوتر:</label>
                                <input type="text" value={config.copyrightText || ''} placeholder="مثال: جميع الحقوق محفوظة لـ أدوات التاريخ" onChange={e => setConfig({...config, copyrightText: e.target.value})} />
                            </div>
                            <div className="input-group checkbox-group">
                                <label><input type="checkbox" checked={config.hasLogo || false} onChange={e => setConfig({...config, hasLogo: e.target.checked})} /> تفعيل الشعار (اللوجو)</label>
                                {config.hasLogo && <input type="text" placeholder="رابط الشعار (مثال: /logo.png)" value={config.logoUrl || ''} onChange={e => setConfig({...config, logoUrl: e.target.value})} />}
                            </div>

                            <hr className="admin-divider"/>
                            <h3>🔗 إدارة الصفحات والروابط الخارجية</h3>
                            {config.externalLinks?.map((link, idx) => (
                                <div key={idx} className="admin-row" style={{marginBottom: '15px'}}>
                                    <input type="text" placeholder="الاسم (مثال: من نحن)" value={link.title} onChange={e => updateLink(idx, 'title', e.target.value)} />
                                    <input type="text" placeholder="الرابط (URL)" value={link.url} onChange={e => updateLink(idx, 'url', e.target.value)} />
                                    <select value={link.location} onChange={e => updateLink(idx, 'location', e.target.value)}>
                                        <option value="header">الهيدر</option><option value="footer">الفوتر</option><option value="both">كلاهما</option>
                                    </select>
                                    <button className="del-btn" onClick={() => removeLink(idx)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={addLink}>+ إضافة رابط</button>
                        </div>
                    )}

                    {/* ===== قسم الأحداث ===== */}
                    {activeTab === 'events' && (
                        <div className="admin-section">
                            <p style={{color: 'var(--text-sub)', marginBottom: '20px'}}>الأحداث المضافة هنا ستظهر تلقائياً للزوار إذا كان متبقي عليها 60 يوماً أو أقل.</p>
                            {config.events?.map((evt, idx) => (
                                <div key={evt.id} className="admin-event-card">
                                    <div className="admin-row">
                                        <input type="checkbox" checked={evt.active} onChange={e => updateEvent(idx, 'active', e.target.checked)} title="تفعيل/إيقاف" style={{transform: 'scale(1.5)', cursor:'pointer', flex: 'none', width: '20px', marginInlineEnd: '10px'}} />
                                        <input type="text" placeholder="اسم الحدث" value={evt.name} onChange={e => updateEvent(idx, 'name', e.target.value)} style={{flex: 2}} />
                                        <input type="date" value={evt.date} onChange={e => updateEvent(idx, 'date', e.target.value)} />
                                    </div>
                                    <div className="admin-row" style={{marginTop: '10px'}}>
                                        <select value={evt.calendar} onChange={e => updateEvent(idx, 'calendar', e.target.value)}>
                                            <option value="gregorian">ميلادي</option><option value="hijri">هجري</option>
                                        </select>
                                        <select value={evt.repeat} onChange={e => updateEvent(idx, 'repeat', e.target.value)}>
                                            <option value="once">مرة واحدة</option><option value="monthly">شهرياً</option><option value="yearly">سنوياً</option>
                                        </select>
                                        <input type="text" placeholder="كود الأيقونة (fa-star)" value={evt.icon} onChange={e => updateEvent(idx, 'icon', e.target.value)} />
                                        <input type="color" value={evt.color} onChange={e => updateEvent(idx, 'color', e.target.value)} style={{padding:0, height:'40px', width:'40px', flex: 'none'}}/>
                                        <button className="del-btn" onClick={() => removeEvent(idx)}><i className="fa-solid fa-trash"></i> حذف</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={addEvent}>+ إضافة حدث جديد</button>
                        </div>
                    )}

                    {/* ===== قسم الإحصائيات ===== */}
                    {activeTab === 'stats' && (
                        <div className="admin-section">
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
                                        <span>{stats.ageCalc || 0} استخدام</span>
                                    </div>
                                    <div className="stat-card">
                                        <i className="fa-solid fa-rotate"></i>
                                        <h4>تحويل التواريخ</h4>
                                        <span>{stats.dateConverter || 0} استخدام</span>
                                    </div>
                                    <div className="stat-card">
                                        <i className="fa-solid fa-mouse-pointer" style={{color: '#f59e0b'}}></i>
                                        <h4>نقرات الإعلانات</h4>
                                        <span style={{color: '#f59e0b'}}>{stats.adClicks || 0} نقرة</span>
                                    </div>
                                </div>
                            ) : (
                                <p style={{textAlign: 'center', fontWeight: 'bold'}}>جاري سحب البيانات من السيرفر...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}