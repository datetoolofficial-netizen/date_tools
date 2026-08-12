const PROJECT_ID = 'date-tool-official';
const SETTINGS_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings`;

export function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue || '';
    if ('booleanValue' in value) return Boolean(value.booleanValue);
    if ('integerValue' in value) return Number(value.integerValue || 0);
    if ('doubleValue' in value) return Number(value.doubleValue || 0);
    if ('timestampValue' in value) return value.timestampValue;
    if ('nullValue' in value) return null;
    if ('arrayValue' in value) {
        return (value.arrayValue.values || [])
            .map(decodeFirestoreValue)
            .filter((item) => item !== undefined);
    }
    if ('mapValue' in value) return decodeFirestoreFields(value.mapValue.fields || {});
    return undefined;
}

export function decodeFirestoreFields(fields = {}) {
    return Object.entries(fields).reduce((result, [key, value]) => {
        const decoded = decodeFirestoreValue(value);
        if (decoded !== undefined) result[key] = decoded;
        return result;
    }, {});
}

async function fetchSettingsDocument(documentId, revalidate) {
    const response = await fetch(`${SETTINGS_BASE_URL}/${documentId}`, {
        headers: { Accept: 'application/json' },
        ...(revalidate === 0 ? { cache: 'no-store' } : { next: { revalidate } }),
    });

    if (!response.ok) return null;
    const payload = await response.json();
    return decodeFirestoreFields(payload.fields || {});
}

export async function getPublicSiteConfigFromFirestore({ revalidate = 300 } = {}) {
    try {
        const publicConfig = await fetchSettingsDocument('public', revalidate);
        if (publicConfig) return publicConfig;

        // Temporary migration fallback. Firestore stops exposing main as soon as
        // settings/public exists, so existing deployments remain available.
        return (await fetchSettingsDocument('main', revalidate)) || {};
    } catch {
        return {};
    }
}
