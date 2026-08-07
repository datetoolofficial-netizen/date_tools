import { NextResponse } from 'next/server';

const FIREBASE_WEB_API_KEY = 'AIzaSyAgdxyNBFrwJuAnoVq6OmZKZZvRknFyVQ8';
const FIREBASE_PROJECT_ID = 'date-tool-official';
const SITE_HOST = 'date-tool.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_KEY = 'd7a98f24b63e4c91a5f27038c4e16b92';
const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

async function lookupFirebaseUser(idToken) {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.users?.[0] || null;
}

async function isActiveAdmin(idToken, uid) {
    const documentName = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/admins/${uid}`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });

    if (!response.ok) return false;
    const profile = await response.json();
    return profile?.fields?.active?.booleanValue === true;
}

async function requireActiveAdmin(request) {
    const authorization = request.headers.get('authorization') || '';
    const [, idToken] = authorization.match(/^Bearer\s+(.+)$/i) || [];
    if (!idToken) return false;

    const user = await lookupFirebaseUser(idToken);
    if (!user?.localId) return false;
    return isActiveAdmin(idToken, user.localId);
}

function normalizeUrl(value) {
    try {
        const url = new URL(String(value || ''), SITE_ORIGIN);
        if (url.hostname !== SITE_HOST && url.hostname !== `www.${SITE_HOST}`) return '';
        url.protocol = 'https:';
        url.hostname = SITE_HOST;
        url.search = '';
        url.hash = '';
        return url.toString();
    } catch {
        return '';
    }
}

export async function POST(request) {
    if (!(await requireActiveAdmin(request))) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const urlList = Array.from(new Set(
        (Array.isArray(payload.urls) ? payload.urls : [])
            .slice(0, 100)
            .map(normalizeUrl)
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

    return NextResponse.json({ ok: true, submitted: urlList.length });
}
