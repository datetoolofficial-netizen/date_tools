import { NextResponse } from 'next/server';

export function middleware(request) {
    const host = request.headers.get('host') || '';

    if (host.toLowerCase() === 'www.date-tool.com') {
        const url = request.nextUrl.clone();
        url.hostname = 'date-tool.com';
        return NextResponse.redirect(url, 308);
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
