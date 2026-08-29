import { APP_VERSION } from './version';

export const DEFAULT_PWA_UPDATE_PROMPT = {
    enabled: false,
    version: APP_VERSION,
};

export function normalizePwaUpdatePrompt(value = {}) {
    const version = String(value?.version || APP_VERSION)
        .trim()
        .replace(/[^0-9A-Za-z._-]/g, '')
        .slice(0, 32);

    return {
        enabled: value?.enabled === true,
        version: version || APP_VERSION,
    };
}
