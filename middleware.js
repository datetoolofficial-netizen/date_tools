import { NextResponse } from 'next/server';

const RETIRED_PWA_ICON_PATHS = new Set([
    '/pwa-icon-192.png',
    '/pwa-icon-512.png',
    '/pwa-maskable-512.png',
]);

const INTERNAL_NO_INDEX_PREFIXES = [
    '/admin',
    '/admin_login',
    '/client',
    '/support',
    '/api',
];

const SECURITY_HEADERS = [
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'DENY'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=(), browsing-topics=()'],
    ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'],
    ['Cross-Origin-Opener-Policy', 'same-origin-allow-popups'],
    ['Origin-Agent-Cluster', '?1'],
    ['X-Permitted-Cross-Domain-Policies', 'none'],
    ['X-DNS-Prefetch-Control', 'on'],
];

function applySecurityHeaders(response) {
    SECURITY_HEADERS.forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

function isInternalPath(pathname) {
    return INTERNAL_NO_INDEX_PREFIXES.some((prefix) => (
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    ));
}

export function middleware(request) {
    const host = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    if (host.toLowerCase() === 'www.date-tool.com') {
        const url = request.nextUrl.clone();
        url.hostname = 'date-tool.com';
        return applySecurityHeaders(NextResponse.redirect(url, 308));
    }

    if (RETIRED_PWA_ICON_PATHS.has(pathname)) {
        return applySecurityHeaders(new NextResponse('', {
            status: 410,
            headers: {
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
        }));
    }

    const response = applySecurityHeaders(NextResponse.next());

    if (isInternalPath(pathname)) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }

    return response;
}

export const config = {
    matcher: '/:path*',
};
