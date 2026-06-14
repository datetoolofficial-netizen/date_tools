'use client';
import './AdminSidebar.css';

export default function AdminSidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-logo-area">
                <i className="fa-solid fa-shield-halved"></i>
                <h2>لوحة التحكم</h2>
            </div>
            
            <nav className="admin-nav-menu">
                <div className="nav-group-title">الإعدادات الأساسية</div>
                <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                    <i className="fa-solid fa-palette"></i> <span>بيانات الأداة</span>
                </button>
                <button className={activeTab === 'pages' ? 'active' : ''} onClick={() => setActiveTab('pages')}>
                    <i className="fa-solid fa-file-lines"></i> <span>الصفحات الداخلية</span>
                </button>
                <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>
                    <i className="fa-solid fa-hashtag"></i> <span>السوشيال والحقوق</span>
                </button>
                <button className={activeTab === 'external' ? 'active' : ''} onClick={() => setActiveTab('external')}>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> <span>الروابط الخارجية</span>
                </button>

                <div className="nav-group-title" style={{marginTop: '25px'}}>المحتوى والأداء</div>
                <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
                    <i className="fa-solid fa-calendar-check"></i> <span>الأحداث والمواعيد</span>
                </button>
                <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
                    <i className="fa-solid fa-chart-pie"></i> <span>الإحصائيات والأرباح</span>
                </button>
            </nav>

            <a href="/" className="back-to-site-btn">
                <i className="fa-solid fa-globe"></i> زيارة الموقع
            </a>
        </aside>
    );
}