const SITE_HOST = 'date-tool.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const ALLOWED_SITE_HOSTS = new Set([SITE_HOST, `www.${SITE_HOST}`]);

export function normalizeIndexNowUrl(value) {
    try {
        const url = new URL(String(value || ''), SITE_ORIGIN);
        if (!ALLOWED_SITE_HOSTS.has(url.hostname.toLowerCase())) return '';
        url.protocol = 'https:';
        url.hostname = SITE_HOST;
        url.search = '';
        url.hash = '';
        return url.toString();
    } catch {
        return '';
    }
}

export function normalizePagespeedTargetUrl(value) {
    const rawValue = String(value || '').trim();
    const parsed = rawValue ? new URL(rawValue, `${SITE_ORIGIN}/`) : new URL(`${SITE_ORIGIN}/`);

    if (parsed.protocol !== 'https:' || !ALLOWED_SITE_HOSTS.has(parsed.hostname.toLowerCase())) {
        throw new Error('invalid_target_url');
    }

    parsed.hash = '';
    parsed.search = '';
    return parsed.toString();
}
