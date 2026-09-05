const SAFE_TEXT_LIMIT = 240;

export function stripSensitiveUrl(value) {
    if (!value || typeof value !== 'string') return '';

    try {
        const parsed = new URL(value);
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString().slice(0, SAFE_TEXT_LIMIT);
    } catch {
        const queryIndex = value.indexOf('?');
        const hashIndex = value.indexOf('#');
        const indexes = [queryIndex, hashIndex].filter((index) => index >= 0);
        const endIndex = indexes.length > 0 ? Math.min(...indexes) : value.length;
        return value.slice(0, endIndex).slice(0, SAFE_TEXT_LIMIT);
    }
}
