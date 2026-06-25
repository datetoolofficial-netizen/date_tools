export const dynamic = 'force-dynamic';

const FIRESTORE_DOC_URL = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

function getStringField(fields = {}, key) {
    return fields?.[key]?.stringValue || '';
}

function getMapField(fields = {}, key) {
    return fields?.[key]?.mapValue?.fields || {};
}

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
        const response = await fetch(FIRESTORE_DOC_URL, {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        });

        if (response.ok) {
            const payload = await response.json();
            const integrations = getMapField(payload.fields, 'externalIntegrations');
            body = cleanAdsTxt(getStringField(integrations, 'adsTxtSnippet'));

            if (!body) {
                const publisher = getStringField(integrations, 'googleAdsenseClient').replace(/^ca-/, '');
                if (/^pub-\d{12,20}$/i.test(publisher)) {
                    body = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`;
                }
            }
        }
    } catch (error) {
        body = '';
    }

    return new Response(`${body}\n`, {
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=300',
        },
    });
}
