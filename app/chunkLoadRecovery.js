import { APP_VERSION } from './version';

const CHUNK_RETRY_PARAM = 'chunk-retry';
const CHUNK_ERROR_PATTERN = /(?:ChunkLoadError|Loading chunk \d+ failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module)/i;

function getErrorText(error) {
    if (!error) return '';

    return [error.name, error.code, error.message, error.cause?.message]
        .filter((value) => typeof value === 'string')
        .join(' ');
}

export function isChunkLoadError(error) {
    return CHUNK_ERROR_PATTERN.test(getErrorText(error));
}

export function getChunkRecoveryUrl(currentUrl, version = APP_VERSION) {
    const url = new URL(currentUrl);
    if (url.searchParams.get(CHUNK_RETRY_PARAM) === version) return null;

    url.searchParams.set(CHUNK_RETRY_PARAM, version);
    return url.toString();
}

export function recoverFromChunkLoadError(error, browserWindow = globalThis.window) {
    if (!browserWindow || !isChunkLoadError(error)) return false;

    const recoveryUrl = getChunkRecoveryUrl(browserWindow.location.href);
    if (!recoveryUrl) return false;

    browserWindow.location.replace(recoveryUrl);
    return true;
}

export function clearChunkRecoveryMarker(browserWindow = globalThis.window) {
    if (!browserWindow) return;

    const url = new URL(browserWindow.location.href);
    if (!url.searchParams.has(CHUNK_RETRY_PARAM)) return;

    url.searchParams.delete(CHUNK_RETRY_PARAM);
    browserWindow.history.replaceState(browserWindow.history.state, '', url.toString());
}
