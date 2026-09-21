import { verifyFirebaseIdToken } from '../../_lib/firebaseIdToken';
import { writeAdminAuditEvent } from '../../_lib/writeAdminAudit';

const FIREBASE_PROJECT_ID = 'date-tool-official';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const MAX_BODY_BYTES = 4096;
const ACTION_RESOURCES = new Map([
    ['advertiser.registered', 'advertiser'],
    ['advertiser.activated', 'advertiser'],
    ['campaign.created', 'campaign'],
    ['campaign.status_updated', 'campaign'],
    ['team.member_updated', 'advertiser'],
    ['team.member_invited', 'advertiser'],
    ['media.uploaded', 'media'],
]);
const ALLOWED_DETAIL_KEYS = new Set(['status', 'role', 'source']);
const SAFE_RESOURCE_ID = /^[a-zA-Z0-9_./:-]{1,180}$/;

export const dynamic = 'force-dynamic';

function jsonResponse(body, status = 200) {
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function getBearerToken(request) {
    return (request.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i)?.[1] || '';
}

async function getAdvertiserProfile(idToken, uid) {
    const response = await fetch(`${FIRESTORE_BASE}/advertisers/${encodeURIComponent(uid)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json())?.fields || null;
}

function cleanDetails(details = {}) {
    return Object.fromEntries(Object.entries(details)
        .filter(([key]) => ALLOWED_DETAIL_KEYS.has(key))
        .map(([key, value]) => [key, String(value ?? '').slice(0, 120)]));
}

export async function POST(request) {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) return jsonResponse({ ok: false, error: 'payload_too_large' }, 413);

    const idToken = getBearerToken(request);
    const user = idToken ? await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID) : null;
    if (!user?.localId) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);

    const profile = await getAdvertiserProfile(idToken, user.localId);
    const status = profile?.status?.stringValue || '';
    if (!['pending_email', 'active'].includes(status)) {
        return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    const payload = await request.json().catch(() => ({}));
    const action = String(payload.action || '');
    const expectedResourceType = ACTION_RESOURCES.get(action);
    const resourceType = String(payload.resourceType || '');
    const resourceId = String(payload.resourceId || '');
    if (!expectedResourceType || resourceType !== expectedResourceType || !SAFE_RESOURCE_ID.test(resourceId)) {
        return jsonResponse({ ok: false, error: 'invalid_audit_event' }, 400);
    }

    const stored = await writeAdminAuditEvent({
        actor: {
            uid: user.localId,
            email: user.email || profile?.email?.stringValue || '',
            role: profile?.role?.stringValue || 'owner',
        },
        action,
        resourceType,
        resourceId,
        details: cleanDetails(payload.details),
    });

    return stored
        ? jsonResponse({ ok: true })
        : jsonResponse({ ok: false, error: 'audit_storage_unavailable' }, 503);
}
