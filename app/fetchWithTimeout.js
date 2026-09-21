export const FETCH_TIMEOUT_ERROR_CODE = 'request_timeout';

export async function fetchWithTimeout(input, init = {}, options = {}) {
    const timeoutMs = Math.max(1, Number(options.timeoutMs) || 10_000);
    const fetchImpl = options.fetchImpl || fetch;
    const controller = new AbortController();
    const signal = init.signal && typeof AbortSignal.any === 'function'
        ? AbortSignal.any([init.signal, controller.signal])
        : controller.signal;
    const timer = setTimeout(() => controller.abort(FETCH_TIMEOUT_ERROR_CODE), timeoutMs);

    try {
        return await fetchImpl(input, { ...init, signal });
    } catch (error) {
        if (controller.signal.aborted) {
            const timeoutError = new Error(FETCH_TIMEOUT_ERROR_CODE);
            timeoutError.code = FETCH_TIMEOUT_ERROR_CODE;
            throw timeoutError;
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

export async function fetchJsonWithTimeout(input, init = {}, options = {}) {
    const response = await fetchWithTimeout(input, init, options);
    if (!response.ok) {
        const error = new Error(`http_${response.status}`);
        error.code = 'upstream_http_error';
        error.status = response.status;
        throw error;
    }

    try {
        return await response.json();
    } catch {
        const error = new Error('invalid_json_response');
        error.code = 'invalid_json_response';
        throw error;
    }
}
