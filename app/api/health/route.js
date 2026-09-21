import { APP_VERSION } from '../../version';

export const dynamic = 'force-dynamic';

export async function GET() {
    return Response.json(
        {
            status: 'ok',
            service: 'date-tools-web',
            version: APP_VERSION,
            checkedAt: new Date().toISOString(),
        },
        {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            },
        },
    );
}
