export async function verifyTurnstileChallenge(token, action) {
    const response = await fetch('/api/security/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
        cache: 'no-store',
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok !== true) {
        const error = new Error('turnstile_failed');
        error.code = 'security/turnstile-failed';
        error.reason = typeof result.error === 'string' ? result.error : 'challenge_failed';
        throw error;
    }

    return result;
}
