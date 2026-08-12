import { getTurnstilePublicConfig, verifyTurnstileToken } from '../../../turnstileServer';

const ALLOWED_ACTIONS = new Set([
    'admin-login',
    'advertiser-login',
    'advertiser-register',
    'advertiser-reset',
]);

export const dynamic = 'force-dynamic';

export async function GET() {
    const config = await getTurnstilePublicConfig();

    return Response.json(config, {
        headers: { 'Cache-Control': 'no-store' },
    });
}

export async function POST(request) {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 4096) {
        return Response.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 4096) {
        return Response.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
    }

    const payload = (() => {
        try {
            return JSON.parse(rawBody);
        } catch {
            return {};
        }
    })();
    const action = String(payload.action || '');
    if (!ALLOWED_ACTIONS.has(action)) {
        return Response.json({ ok: false, error: 'invalid_action' }, { status: 400 });
    }

    const result = await verifyTurnstileToken({
        request,
        token: payload.token,
        action,
    });

    return Response.json(
        { ok: result.success, configured: result.configured, error: result.error || '' },
        {
            status: result.success ? 200 : 403,
            headers: { 'Cache-Control': 'no-store' },
        },
    );
}
