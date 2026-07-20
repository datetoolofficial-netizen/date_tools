import { NextResponse } from 'next/server';

const RETIRED_PWA_ICON_PATHS = new Set([
    '/pwa-icon-192.png',
    '/pwa-icon-512.png',
    '/pwa-maskable-512.png',
]);

export function middleware(request) {
    const host = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    if (host.toLowerCase() === 'www.date-tool.com') {
        const url = request.nextUrl.clone();
        url.hostname = 'date-tool.com';
        return NextResponse.redirect(url, 308);
    }

    if (RETIRED_PWA_ICON_PATHS.has(pathname)) {
        return new NextResponse('', {
            status: 410,
            headers: {
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    }

    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return response;
}

export const config = {
    matcher: '/:path*',
};
