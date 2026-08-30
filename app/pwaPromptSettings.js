import { APP_VERSION } from './version';

export const DEFAULT_PWA_UPDATE_PROMPT = {
    enabled: true,
    version: APP_VERSION,
};

export function normalizePwaUpdatePrompt(value = {}) {
    return {
        enabled: value?.enabled !== false,
        version: APP_VERSION,
    };
}
