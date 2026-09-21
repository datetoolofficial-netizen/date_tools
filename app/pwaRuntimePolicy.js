export const PWA_RUNTIME_MODE = 'online-only';

export function getPwaConnectionMessage(lang = 'ar') {
    return lang === 'en'
        ? 'An internet connection is required to open tools and load updates.'
        : 'يلزم اتصال بالإنترنت لفتح الأدوات وتحميل التحديثات.';
}
