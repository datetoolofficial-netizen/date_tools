const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export const LOCAL_MUTATION_ERROR_CODE = 'local_production_mutation_blocked';
export const LOCAL_MUTATION_MESSAGE = 'بيئة الإدارة المحلية للقراءة والاختبار فقط؛ لم تُرسل أي تغييرات إلى بيانات الإنتاج.';

export function normalizeHostname(value = '') {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (raw.startsWith('[')) return raw.slice(1, raw.indexOf(']'));
    return raw.split(':')[0];
}

export function isLoopbackHostname(value = '') {
    return LOOPBACK_HOSTS.has(normalizeHostname(value));
}

export function isLocalBrowserRuntime() {
    return typeof window !== 'undefined' && isLoopbackHostname(window.location.hostname);
}

export function assertProductionMutationAllowed() {
    if (!isLocalBrowserRuntime()) return;

    const error = new Error(LOCAL_MUTATION_MESSAGE);
    error.code = LOCAL_MUTATION_ERROR_CODE;
    throw error;
}

export function isLocalMutationRequest(request) {
    const forwardedHost = String(request?.headers?.get?.('x-forwarded-host') || '').split(',')[0].trim();
    const host = forwardedHost || request?.headers?.get?.('host') || request?.nextUrl?.hostname || '';
    return isLoopbackHostname(host);
}

export function isSameOriginMutationRequest(request) {
    const origin = request?.headers?.get?.('origin') || '';
    const fetchSite = request?.headers?.get?.('sec-fetch-site') || '';

    if (!origin) return !fetchSite || fetchSite === 'same-origin';
    if (origin === 'null') return false;

    try {
        return new URL(origin).origin === new URL(request.url).origin;
    } catch {
        return false;
    }
}
