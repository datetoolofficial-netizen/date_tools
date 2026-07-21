import { buildManifest } from '../manifestConfig';

export const revalidate = 300;

export async function GET() {
    const payload = await buildManifest();

    return new Response(JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/manifest+json; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
        },
    });
}
