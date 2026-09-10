import { ADMIN_PERMISSIONS } from '../../../adminAccess';
import { getFirestoreServerAuthorization } from '../../../serverFirestoreAuth';
import { hasAdminPermission, resolveEncodedAdminRole } from '../../_lib/adminPermissions';
import { verifyFirebaseIdToken } from '../../_lib/firebaseIdToken';

const FIREBASE_PROJECT_ID = 'date-tool-official';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const SAFE_TOKEN_PATTERN = /^[a-z0-9._:-]{1,100}$/i;
const SAFE_RESOURCE_PATTERN = /^[a-z0-9._:@/-]{0,180}$/i;
const ALLOWED_DETAIL_KEYS = new Set([
    'changedFields', 'status', 'role', 'source', 'reason', 'organizationId', 'result',
]);
const AUDIT_ACTION_RULES = Object.freeze({
    'settings.updated': {
        resourceType: 'settings',
        permissions: [
            ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE,
            ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE,
            ADMIN_PERMISSIONS.SITE_PRIVACY_UPDATE,
            ADMIN_PERMISSIONS.PWA_RELEASE,
            ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
            ADMIN_PERMISSIONS.CONTENT_PAGES_UPDATE,
            ADMIN_PERMISSIONS.SEO_UPDATE,
            ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
            ADMIN_PERMISSIONS.INTEGRATIONS_UPDATE,
        ],
    },
    'campaign.created': { resourceType: 'campaign', permissions: [ADMIN_PERMISSIONS.CAMPAIGNS_CREATE] },
    'campaign.updated': { resourceType: 'campaign', permissions: [ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE] },
    'campaign.status_updated': {
        resourceType: 'campaign',
        permissions: [ADMIN_PERMISSIONS.CAMPAIGNS_REVIEW, ADMIN_PERMISSIONS.CAMPAIGNS_OPERATE],
    },
    'campaign.deleted': { resourceType: 'campaign', permissions: [ADMIN_PERMISSIONS.CAMPAIGNS_DELETE] },
    'advertiser.created': { resourceType: 'advertiser', permissions: [ADMIN_PERMISSIONS.ADVERTISERS_CREATE] },
    'advertiser.updated': {
        resourceType: 'advertiser',
        permissions: [
            ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
            ADMIN_PERMISSIONS.ADVERTISERS_STATUS,
            ADMIN_PERMISSIONS.ADVERTISERS_ROLES,
        ],
    },
    'admin.invited': { resourceType: 'admin', permissions: [ADMIN_PERMISSIONS.ADMINS_CREATE] },
    'admin.role_updated': { resourceType: 'admin', permissions: [ADMIN_PERMISSIONS.ADMINS_UPDATE_ROLE] },
    'admin.status_updated': { resourceType: 'admin', permissions: [ADMIN_PERMISSIONS.ADMINS_SUSPEND] },
    'admin.account_updated': {
        resourceType: 'admin',
        permissions: [ADMIN_PERMISSIONS.ADMINS_UPDATE_ROLE, ADMIN_PERMISSIONS.ADMINS_SUSPEND],
    },
});

export const dynamic = 'force-dynamic';

function jsonResponse(body, status = 200) {
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function getBearerToken(request) {
    return (request.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i)?.[1] || '';
}

async function getAdminProfile(idToken, uid) {
    const response = await fetch(`${FIRESTORE_BASE}/admins/${encodeURIComponent(uid)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json())?.fields || null;
}

function encodeValue(value) {
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.slice(0, 30).map((item) => ({ stringValue: String(item).slice(0, 120) })) } };
    }
    return { stringValue: String(value ?? '').slice(0, 500) };
}

function cleanDetails(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value)
            .filter(([key]) => ALLOWED_DETAIL_KEYS.has(key))
            .map(([key, entry]) => [key, encodeValue(entry)])
    );
}

export async function POST(request) {
    try {
        const idToken = getBearerToken(request);
        const user = idToken ? await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID) : null;
        if (!user?.localId) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);

        const profile = await getAdminProfile(idToken, user.localId);
        if (!profile?.active?.booleanValue || !resolveEncodedAdminRole(profile)) {
            return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
        }

        const payload = await request.json().catch(() => ({}));
        const action = String(payload.action || '');
        const resourceType = String(payload.resourceType || '');
        const resourceId = String(payload.resourceId || '');
        if (!SAFE_TOKEN_PATTERN.test(action) || !SAFE_TOKEN_PATTERN.test(resourceType) || !SAFE_RESOURCE_PATTERN.test(resourceId)) {
            return jsonResponse({ ok: false, error: 'invalid_audit_event' }, 400);
        }
        const actionRule = AUDIT_ACTION_RULES[action];
        if (!actionRule || actionRule.resourceType !== resourceType) {
            return jsonResponse({ ok: false, error: 'unsupported_audit_event' }, 400);
        }
        if (!hasAdminPermission(profile, actionRule.permissions)) {
            return jsonResponse({ ok: false, error: 'forbidden' }, 403);
        }

        const authorization = await getFirestoreServerAuthorization();
        if (!authorization) return jsonResponse({ ok: false, error: 'audit_storage_unavailable' }, 503);

        const response = await fetch(`${FIRESTORE_BASE}/audit_logs`, {
            method: 'POST',
            headers: { Authorization: authorization, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    action: { stringValue: action },
                    resourceType: { stringValue: resourceType },
                    resourceId: { stringValue: resourceId },
                    actorId: { stringValue: user.localId },
                    actorEmail: { stringValue: String(user.email || '').slice(0, 160) },
                    actorRole: { stringValue: resolveEncodedAdminRole(profile) },
                    occurredAt: { timestampValue: new Date().toISOString() },
                    details: { mapValue: { fields: cleanDetails(payload.details) } },
                },
            }),
        });

        if (!response.ok) throw new Error(`audit_write_failed_${response.status}`);
        return jsonResponse({ ok: true }, 201);
    } catch (error) {
        console.error('Admin audit write failed:', error instanceof Error ? error.message : 'unknown');
        return jsonResponse({ ok: false, error: 'audit_write_failed' }, 500);
    }
}

export async function GET(request) {
    const idToken = getBearerToken(request);
    const user = idToken ? await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID) : null;
    if (!user?.localId) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    const profile = await getAdminProfile(idToken, user.localId);
    if (!hasAdminPermission(profile, [ADMIN_PERMISSIONS.AUDIT_READ])) {
        return jsonResponse({ ok: false, error: 'forbidden' }, 403);
    }
    return jsonResponse({ ok: true });
}
