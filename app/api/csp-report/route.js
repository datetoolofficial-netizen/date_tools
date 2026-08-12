export const dynamic = 'force-dynamic';

const SAFE_TEXT_LIMIT = 240;
const MAX_REPORT_BYTES = 16 * 1024;

function stripSensitiveUrl(value) {
    if (!value || typeof value !== 'string') return '';

    try {
        const parsed = new URL(value);
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString().slice(0, SAFE_TEXT_LIMIT);
    } catch {
        return value.replace(/[?#].*$/, '').slice(0, SAFE_TEXT_LIMIT);
    }
}

function safeText(value) {
    return typeof value === 'string' ? value.slice(0, SAFE_TEXT_LIMIT) : '';
}

export async function POST(request) {
    try {
        const contentLength = Number(request.headers.get('content-length') || 0);
        if (contentLength > MAX_REPORT_BYTES) {
            return new Response(null, { status: 413 });
        }

        const text = await request.text();
        if (new TextEncoder().encode(text).byteLength > MAX_REPORT_BYTES) {
            return new Response(null, { status: 413 });
        }
        const payload = text ? JSON.parse(text) : {};
        const report = payload?.['csp-report'] || payload || {};

        console.warn('csp_report_only', {
            documentUri: stripSensitiveUrl(report['document-uri'] || report.documentURL || report.url),
            blockedUri: stripSensitiveUrl(report['blocked-uri'] || report.blockedURL),
            effectiveDirective: safeText(report['effective-directive'] || report.effectiveDirective),
            violatedDirective: safeText(report['violated-directive'] || report.violatedDirective),
            disposition: safeText(report.disposition),
            statusCode: Number(report['status-code'] || report.statusCode || 0) || 0,
        });
    } catch (error) {
        console.warn('csp_report_parse_failed', error instanceof Error ? error.message : 'unknown');
    }

    return new Response(null, {
        status: 204,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

export async function GET() {
    return new Response(null, {
        status: 204,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}
