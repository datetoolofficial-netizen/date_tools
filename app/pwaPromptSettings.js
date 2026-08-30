import { APP_VERSION } from './version';

export const DEFAULT_PWA_UPDATE_PROMPT = {
    enabled: true,
    version: APP_VERSION,
    schemaVersion: 2,
};

export function normalizePwaUpdatePrompt(value = {}) {
    return {
        enabled: value?.schemaVersion === 2 ? value?.enabled !== false : true,
        version: APP_VERSION,
        schemaVersion: 2,
    };
}
