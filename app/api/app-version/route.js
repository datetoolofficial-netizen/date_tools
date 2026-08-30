import { APP_VERSION, APP_VERSION_DATE } from '../../version';

export const dynamic = 'force-dynamic';

export async function GET() {
    return Response.json(
        {
            version: APP_VERSION,
            publishedAt: APP_VERSION_DATE,
        },
        {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                Pragma: 'no-cache',
                Expires: '0',
            },
        },
    );
}
