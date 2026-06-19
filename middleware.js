import { NextResponse } from 'next/server';

export function middleware(request) {
    const host = request.headers.get('host') || '';

    if (host.toLowerCase() === 'www.date-tool.com') {
        const url = request.nextUrl.clone();
        url.hostname = 'date-tool.com';
        return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
