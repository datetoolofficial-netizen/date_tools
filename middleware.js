import { NextResponse } from 'next/server';

const RETIRED_PWA_ICON_PATHS = new Set([
    '/pwa-icon-192.png',
    '/pwa-icon-512.png',
    '/pwa-maskable-512.png',
]);

const TOOL_SECTION_REDIRECTS = new Map([
    ['/age-calculator', { pathname: '/', hash: 'age-calculator' }],
    ['/date-converter', { pathname: '/', hash: 'date-converter' }],
    ['/date-difference', { pathname: '/', hash: 'date-difference' }],
    ['/time-converter', { pathname: '/clock', hash: 'time-converter' }],
    ['/timezone-difference', { pathname: '/clock', hash: 'timezone-difference' }],
    ['/weather-search', { pathname: '/weather', hash: 'weather-search' }],
    ['/current-weather', { pathname: '/weather', hash: 'current-weather' }],
    ['/outdoor-advice', { pathname: '/weather', hash: 'outdoor-advice' }],
    ['/weather-forecast', { pathname: '/weather', hash: 'weather-forecast' }],
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

const REPORT_ONLY_CSP = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "media-src 'self' data: blob:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net https://challenges.cloudflare.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com",
    "script-src-elem 'self' 'unsafe-inline' blob: https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net https://challenges.cloudflare.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com",
    "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://oauth2.googleapis.com https://www.googleapis.com https://www.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://api.bigdatacloud.net https://api.open-meteo.com https://geocoding-api.open-meteo.com https://www.clarity.ms https://*.clarity.ms https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.googlesyndication.com",
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://challenges.cloudflare.com",
    'report-uri /api/csp-report',
].join('; ');

function applySecurityHeaders(response) {
    SECURITY_HEADERS.forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    response.headers.set('Content-Security-Policy-Report-Only', REPORT_ONLY_CSP);
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

    if (pathname === '/about') {
        return applySecurityHeaders(new NextResponse('', {
            status: 404,
            headers: {
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
        }));
    }

    if (TOOL_SECTION_REDIRECTS.has(pathname)) {
        const destination = TOOL_SECTION_REDIRECTS.get(pathname);
        const url = request.nextUrl.clone();
        url.pathname = destination.pathname;
        url.search = '';
        url.hash = destination.hash;
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
