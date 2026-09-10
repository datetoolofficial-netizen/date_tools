'use client';

import { usePathname } from 'next/navigation';
import ClientShell from './ClientShell';

const AUTH_ROUTES = new Set([
    '/client',
    '/client/register',
    '/client/reset-password',
]);

export default function ClientLayoutShell({ children }) {
    const pathname = usePathname();

    if (AUTH_ROUTES.has(pathname)) return children;

    return <ClientShell>{children}</ClientShell>;
}
