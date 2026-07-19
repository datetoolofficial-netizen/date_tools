'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const FONT_AWESOME_ID = 'date-tools-fontawesome';
const FONT_AWESOME_HREF = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
const FONT_AWESOME_ROUTES = ['/admin', '/admin_login', '/client', '/support'];

export default function FontAwesomeLoader() {
    const pathname = usePathname() || '/';

    useEffect(() => {
        const shouldLoadFontAwesome = FONT_AWESOME_ROUTES.some((prefix) => (
            pathname === prefix || pathname.startsWith(`${prefix}/`)
        ));

        if (!shouldLoadFontAwesome) return;
        if (document.getElementById(FONT_AWESOME_ID)) return;

        const link = document.createElement('link');
        link.id = FONT_AWESOME_ID;
        link.rel = 'stylesheet';
        link.href = FONT_AWESOME_HREF;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }, [pathname]);

    return null;
}
