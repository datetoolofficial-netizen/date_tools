import { pickPublicSiteConfig } from '../../publicSiteConfig';

const FIRESTORE_SETTINGS_URL = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

export const revalidate = 300;

function jsonResponse(body, status = 200, cacheControl = 'public, s-maxage=300, stale-while-revalidate=86400') {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': cacheControl,
        },
    });
}

function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue || '';
    if ('booleanValue' in value) return Boolean(value.booleanValue);
    if ('integerValue' in value) return Number(value.integerValue || 0);
    if ('doubleValue' in value) return Number(value.doubleValue || 0);
    if ('nullValue' in value) return null;
    if ('arrayValue' in value) {
        return (value.arrayValue.values || [])
            .map(decodeFirestoreValue)
            .filter((item) => item !== undefined);
    }
    if ('mapValue' in value) {
        return decodeFirestoreFields(value.mapValue.fields || {});
    }

    return undefined;
}

function decodeFirestoreFields(fields = {}) {
    return Object.entries(fields).reduce((result, [key, value]) => {
        const decodedValue = decodeFirestoreValue(value);
        if (decodedValue !== undefined) result[key] = decodedValue;
        return result;
    }, {});
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const includeContent = url.searchParams.get('include') === 'pages';
        const response = await fetch(FIRESTORE_SETTINGS_URL, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            return jsonResponse({ ok: false, config: {} }, response.status, 'no-store');
        }

        const payload = await response.json();
        const config = pickPublicSiteConfig(decodeFirestoreFields(payload.fields || {}), includeContent);

        return jsonResponse({ ok: true, config });
    } catch {
        return jsonResponse({ ok: false, config: {} }, 500, 'no-store');
    }
}
