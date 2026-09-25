import { NextResponse } from 'next/server';
import { adminMfaRequirementSatisfied, hasAdminPermission, resolveEncodedAdminRole } from '../../_lib/adminPermissions';
import { ADMIN_PERMISSIONS } from '../../../adminAccess';
import { verifyFirebaseIdToken } from '../../_lib/firebaseIdToken';
import { writeAdminAuditEvent } from '../../_lib/writeAdminAudit';
import { normalizeIndexNowUrl } from '../../_lib/urlPolicies';

const FIREBASE_PROJECT_ID = 'date-tool-official';
const SITE_HOST = 'date-tool.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_KEY = 'd7a98f24b63e4c91a5f27038c4e16b92';
const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

async function getAdminProfile(idToken, uid) {
    const documentName = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/admins/${uid}`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });

    if (!response.ok) return null;
    const profile = await response.json();
    return profile?.fields || null;
}

async function requireActiveAdmin(request) {
    const authorization = request.headers.get('authorization') || '';
    const [, idToken] = authorization.match(/^Bearer\s+(.+)$/i) || [];
    if (!idToken) return null;

    const user = await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID);
    if (!user?.localId) return null;
    const profile = await getAdminProfile(idToken, user.localId);
    if (!hasAdminPermission(profile, [ADMIN_PERMISSIONS.SEO_SUBMIT_INDEX])) return null;
    if (!adminMfaRequirementSatisfied(profile, user)) return null;
    return {
        uid: user.localId,
        email: user.email || '',
        role: resolveEncodedAdminRole(profile),
    };
}

export async function POST(request) {
    const admin = await requireActiveAdmin(request);
    if (!admin) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const urlList = Array.from(new Set(
        (Array.isArray(payload.urls) ? payload.urls : [])
            .slice(0, 100)
            .map(normalizeIndexNowUrl)
            .filter(Boolean)
    ));

    if (urlList.length === 0) {
        return NextResponse.json({ ok: false, error: 'no_valid_urls' }, { status: 400 });
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            host: SITE_HOST,
            key: INDEXNOW_KEY,
            keyLocation: INDEXNOW_KEY_LOCATION,
            urlList,
        }),
    });

    if (!response.ok) {
        return NextResponse.json(
            { ok: false, error: 'indexnow_rejected', status: response.status },
            { status: 502 }
        );
    }

    await writeAdminAuditEvent({
        actor: admin,
        action: 'seo.indexnow_submitted',
        resourceType: 'seo_submission',
        resourceId: SITE_HOST,
        details: { result: `submitted:${urlList.length}` },
    });

    return NextResponse.json({ ok: true, submitted: urlList.length });
}
