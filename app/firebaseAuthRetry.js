const FIREBASE_NETWORK_ERROR_CODE = 'auth/network-request-failed';

function wait(delayMs) {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function createFirebaseNetworkTimeoutError() {
    return Object.assign(new Error('Firebase authentication request timed out.'), {
        code: FIREBASE_NETWORK_ERROR_CODE,
        reason: 'timeout',
    });
}

async function runWithTimeout(operation, timeoutMs) {
    let timeoutId;

    try {
        return await Promise.race([
            Promise.resolve().then(operation),
            new Promise((_, reject) => {
                timeoutId = setTimeout(() => reject(createFirebaseNetworkTimeoutError()), timeoutMs);
            }),
        ]);
    } finally {
        clearTimeout(timeoutId);
    }
}

export function isFirebaseNetworkError(error) {
    return error?.code === FIREBASE_NETWORK_ERROR_CODE;
}

export async function runFirebaseAuthRequestWithRetry(operation, options = {}) {
    const attempts = Math.max(1, Number(options.attempts) || 2);
    const retryDelayMs = Math.max(0, Number(options.retryDelayMs) || 600);
    const operationTimeoutMs = Math.max(1, Number(options.operationTimeoutMs) || 10000);
    const sleep = options.sleep || wait;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await runWithTimeout(operation, operationTimeoutMs);
        } catch (error) {
            if (!isFirebaseNetworkError(error) || attempt === attempts) throw error;
            await sleep(retryDelayMs * attempt);
        }
    }

    throw new Error('Firebase authentication retry ended unexpectedly.');
}

export function getFirebaseNetworkErrorMessage(isOnline = true) {
    return isOnline
        ? 'تعذر الوصول إلى خدمة تسجيل الدخول مؤقتًا. تحقق من أن VPN أو مانع الإعلانات لا يحجب خدمات Google، ثم حاول مرة أخرى.'
        : 'لا يوجد اتصال بالإنترنت حاليًا. أعد الاتصال ثم حاول تسجيل الدخول مرة أخرى.';
}
