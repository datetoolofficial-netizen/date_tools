'use client';

import Link from 'next/link';
import ToolManagementShell from './ToolManagementShell';

const toolCards = [
    {
        title: 'أداة التاريخ',
        description: 'إدارة أهم الأحداث والخيارات الخاصة بصفحة التاريخ.',
        href: '/admin/tool-management/date',
        icon: 'fa-calendar-days',
        color: 'color-pages',
        status: 'متاحة الآن',
    },
    {
        title: 'أداة الساعة',
        description: 'ستنتقل إعدادات الساعة المستقلة إلى هنا عند تجهيزها.',
        href: '/clock',
        icon: 'fa-clock',
        color: 'color-links',
        status: 'عرض الأداة',
    },
    {
        title: 'أداة الطقس',
        description: 'ستنتقل إعدادات الطقس المستقلة إلى هنا عند تجهيزها.',
        href: '/weather',
        icon: 'fa-cloud-sun',
        color: 'color-social',
        status: 'عرض الأداة',
    },
];

export default function AdminToolManagementPage() {
    return (
        <ToolManagementShell
            icon="fa-toolbox"
            title="إدارة الأدوات"
            description="اختر الأداة التي تريد إدارتها. كل أداة سيكون لها إعداداتها المستقلة بدل خلطها مع إعدادات الموقع العامة."
        >
            <section className="legacy-google-card tools-section-card tool-management-hub">
                <div className="tools-section-head">
                    <div className="tools-section-title">
                        <h2>الأدوات المتاحة</h2>
                        <p>ابدأ بأداة التاريخ الآن، ثم نضيف إعدادات الساعة والطقس عندما نحدد خياراتهما بدقة.</p>
                    </div>
                </div>

                <div className="tool-management-grid">
                    {toolCards.map((tool) => (
                        <Link className={`tool-management-card ${tool.color}`} href={tool.href} key={tool.title}>
                            <span className="tools-section-icon">
                                <i className={`fa-solid ${tool.icon}`}></i>
                            </span>
                            <div>
                                <h3>{tool.title}</h3>
                                <p>{tool.description}</p>
                            </div>
                            <strong>{tool.status}</strong>
                        </Link>
                    ))}
                </div>
            </section>
        </ToolManagementShell>
    );
}
