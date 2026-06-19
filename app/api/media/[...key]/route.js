import { getCloudflareContext } from '@opennextjs/cloudflare';

const PUBLIC_CATEGORIES = new Set(['logo', 'favicon', 'ads']);
const SAFE_KEY_PATTERN = /^[a-z0-9][a-z0-9/_\-.]{1,240}$/i;

export const dynamic = 'force-dynamic';

function getKey(params) {
    const keyParts = Array.isArray(params?.key) ? params.key : [];
    const key = keyParts.join('/');

    if (!SAFE_KEY_PATTERN.test(key) || key.includes('..') || key.includes('//')) {
        return '';
    }

    const category = key.split('/')[0];
    if (!PUBLIC_CATEGORIES.has(category)) return '';

    return key;
}

async function getMediaBucket() {
    try {
        const { env } = await getCloudflareContext({ async: true });
        return env?.MEDIA_BUCKET || null;
    } catch {
        return null;
    }
}

export async function GET(_request, { params }) {
    const key = getKey(params);

    if (!key) {
        return Response.json({ ok: false, error: 'invalid_media_key' }, { status: 400 });
    }

    const bucket = await getMediaBucket();
    if (!bucket) {
        return Response.json({ ok: false, error: 'media_storage_not_configured' }, { status: 503 });
    }

    const object = await bucket.get(key);
    if (!object) {
        return Response.json({ ok: false, error: 'media_not_found' }, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', object.httpMetadata?.cacheControl || 'public, max-age=31536000, immutable');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('ETag', object.httpEtag);

    return new Response(object.body, { headers });
}
