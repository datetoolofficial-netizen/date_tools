import { pickPublicSiteConfig } from '../../publicSiteConfig';
import { getPublicSiteConfigFromFirestore } from '../../firestorePublicConfig';

export const revalidate = 300;

function jsonResponse(body, status = 200, cacheControl = 'public, s-maxage=300, stale-while-revalidate=86400') {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': cacheControl,
        },
    });
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const includeContent = url.searchParams.get('include') === 'pages';
        const storedConfig = await getPublicSiteConfigFromFirestore({ revalidate: 300 });
        const config = pickPublicSiteConfig(storedConfig, includeContent);

        return jsonResponse({ ok: true, config });
    } catch {
        return jsonResponse({ ok: false, config: {} }, 500, 'no-store');
    }
}
