import { getPublicSiteConfigFromFirestore } from '../firestorePublicConfig';

export const dynamic = 'force-dynamic';

function cleanAdsTxt(value = '') {
    return String(value || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !/[<>]/.test(line))
        .slice(0, 60)
        .join('\n');
}

export async function GET() {
    let body = '';

    try {
        const config = await getPublicSiteConfigFromFirestore({ revalidate: 0 });
        const integrations = config.externalIntegrations || {};
        body = cleanAdsTxt(integrations.adsTxtSnippet);

        if (!body) {
            const publisher = String(integrations.googleAdsenseClient || '').replace(/^ca-/, '');
            if (/^pub-\d{12,20}$/i.test(publisher)) {
                body = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`;
            }
        }
    } catch {
        body = '';
    }

    return new Response(`${body}\n`, {
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=300',
        },
    });
}
