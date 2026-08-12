'use client';

import { useEffect, useRef, useState } from 'react';
import Toast from '../../components/Toast';
import '../AdminDashboard.css';

export default function ToolManagementShell({
    icon = 'fa-toolbox',
    loadingTitle = 'جاري فتح إدارة الأدوات...',
    title = 'إدارة الأدوات',
    description = 'إدارة مستقلة لكل أداة حتى تبقى إعدادات الموقع العامة نظيفة ومنظمة.',
    children,
}) {
    const [message, setMessage] = useState(null);
    const [firebaseApi, setFirebaseApi] = useState(null);
    const [loadError, setLoadError] = useState('');
    const messageTimerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        import('../../firebase')
            .then(({ getSiteConfig, saveSiteConfigSection }) => {
                if (isMounted) setFirebaseApi({ getSiteConfig, saveSiteConfigSection });
            })
            .catch(() => {
                if (isMounted) setLoadError('تعذر تحميل إعدادات إدارة الأدوات.');
            });

        return () => {
            isMounted = false;
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
    }, []);

    const showMessage = (type, text) => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setMessage({ type, text });
        messageTimerRef.current = window.setTimeout(() => setMessage(null), 4500);
    };

    if (loadError) return <div className="admin-dashboard-error">{loadError}</div>;

    return (
        <>
            <Toast
                message={message?.text || ''}
                type={message?.type || 'info'}
                visible={Boolean(message?.text)}
                onClose={() => setMessage(null)}
            />

            <section className="legacy-ads-hero tools-hero tool-management-hero">
                <div>
                    <h1>
                        <i className={`fa-solid ${icon}`}></i>
                        {title}
                    </h1>
                    <p>{description}</p>
                </div>
            </section>

            {!firebaseApi ? (
                <div className="admin-dashboard-loading admin-content-loading" role="status">
                    <i className={`fa-solid ${icon} fa-beat-fade`}></i>
                    <h3>{loadingTitle}</h3>
                </div>
            ) : (
                typeof children === 'function' ? children({ firebaseApi, showMessage }) : children
            )}
        </>
    );
}
