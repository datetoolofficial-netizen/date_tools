import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_PROJECT_ID = 'date-tool-official';
const TOKEN_TTL_SECONDS = 55 * 60;
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const ACTIVE_STATUSES = new Set(['نشط', 'ظ†ط´ط·']);
const ALLOWED_SLOTS = new Set([
    'dateTop',
    'dateMiddle',
    'dateBottom',
    'clockTop',
    'clockMiddle',
    'clockBottom',
    'weatherTop',
    'weatherMiddle',
    'weatherBottom',
]);

export const dynamic = 'force-dynamic';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

async function getEnvValue(...keys) {
    for (const key of keys) {
        if (process.env[key]) return process.env[key];
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        for (const key of keys) {
            if (typeof env?.[key] === 'string' && env[key]) return env[key];
        }
    } catch {
        // Local builds may not have a Cloudflare request context.
    }

    return '';
}

async function getServiceAccount() {
    const json = await getEnvValue('FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_SERVICE_ACCOUNT_JSON');

    if (json) {
        try {
            const parsed = JSON.parse(json);
            return {
                projectId: parsed.project_id || DEFAULT_PROJECT_ID,
                clientEmail: parsed.client_email || '',
                privateKey: parsed.private_key || '',
            };
        } catch {
            // Fall back to split service account secrets.
        }
    }

    return {
        projectId: (await getEnvValue('FIREBASE_PROJECT_ID', 'GOOGLE_CLOUD_PROJECT')) || DEFAULT_PROJECT_ID,
        clientEmail: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL'),
        privateKey: await getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY'),
    };
}

function normalizePrivateKey(privateKey) {
    return privateKey.replace(/\\n/g, '\n').trim();
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncodeText(value) {
    return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function pemToArrayBuffer(pem) {
    const base64 = normalizePrivateKey(pem)
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
}

async function signJwt(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const unsignedToken = [
        base64UrlEncodeText(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        base64UrlEncodeText(JSON.stringify({
            iss: serviceAccount.clientEmail,
            scope: TOKEN_SCOPE,
            aud: TOKEN_AUDIENCE,
            iat: now,
            exp: now + TOKEN_TTL_SECONDS,
        })),
    ].join('.');

    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(serviceAccount.privateKey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsignedToken));

    return `${unsignedToken}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

async function getAccessToken(serviceAccount) {
    if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

    const response = await fetch(TOKEN_AUDIENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: await signJwt(serviceAccount),
        }),
    });

    if (!response.ok) throw new Error(`token_failed_${response.status}`);

    const tokenData = await response.json();
    cachedToken = tokenData.access_token;
    cachedTokenExpiresAt = Date.now() + Math.max(1, (tokenData.expires_in || TOKEN_TTL_SECONDS) - 60) * 1000;
    return cachedToken;
}

function getStringField(fields, key) {
    return String(fields?.[key]?.stringValue || '').trim();
}

function getNumberField(fields, key) {
    const raw = fields?.[key]?.integerValue || fields?.[key]?.doubleValue || fields?.[key]?.stringValue || 0;
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
}

function isCampaignActive(campaign) {
    const now = Date.now();
    const start = campaign.startTime ? new Date(campaign.startTime).getTime() : 0;
    const end = campaign.endTime ? new Date(campaign.endTime).getTime() : Number.POSITIVE_INFINITY;

    if (!ACTIVE_STATUSES.has(campaign.status)) return false;
    if (!ALLOWED_SLOTS.has(campaign.adLocation)) return false;
    if (!campaign.imageUrl || !campaign.targetUrl) return false;
    if (Number.isFinite(start) && now < start) return false;
    if (Number.isFinite(end) && now > end) return false;

    return true;
}

function documentToCampaign(document) {
    const fields = document.fields || {};
    const id = String(document.name || '').split('/').pop() || '';

    return {
        id,
        campaignNumber: getStringField(fields, 'campaignNumber') || id.slice(0, 8),
        campaignName: getStringField(fields, 'campaignName'),
        targetUrl: getStringField(fields, 'targetUrl'),
        imageUrl: getStringField(fields, 'imageUrl'),
        targetTool: getStringField(fields, 'targetTool'),
        adLocation: getStringField(fields, 'adLocation'),
        startTime: getStringField(fields, 'startTime'),
        endTime: getStringField(fields, 'endTime'),
        status: getStringField(fields, 'status'),
        views: getNumberField(fields, 'views'),
        clicks: getNumberField(fields, 'clicks'),
    };
}

async function fetchCampaignDocuments(serviceAccount) {
    const token = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.projectId || DEFAULT_PROJECT_ID;
    const databaseName = `projects/${projectId}/databases/(default)`;
    const response = await fetch(`https://firestore.googleapis.com/v1/${databaseName}/documents/campaigns?pageSize=100`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error(`firestore_failed_${response.status}`);

    const data = await response.json();
    return Array.isArray(data.documents) ? data.documents : [];
}

export async function GET() {
    try {
        const serviceAccount = await getServiceAccount();
        if (!serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
            return jsonResponse({ ok: false, error: 'public_campaigns_not_configured', campaigns: [] }, 503);
        }

        const campaigns = (await fetchCampaignDocuments(serviceAccount))
            .map(documentToCampaign)
            .filter(isCampaignActive)
            .sort((first, second) => String(first.campaignNumber).localeCompare(String(second.campaignNumber)))
            .slice(0, 50);

        return jsonResponse({ ok: true, campaigns });
    } catch (error) {
        console.error('public campaigns endpoint error:', error);
        return jsonResponse({ ok: false, error: 'public_campaigns_failed', campaigns: [] }, 500);
    }
}
