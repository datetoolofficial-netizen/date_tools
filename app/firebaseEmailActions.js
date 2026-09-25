export const FIREBASE_EMAIL_ACTION_MODES = new Set([
    'verifyEmail',
    'resetPassword',
    'recoverEmail',
]);

export function getSafeEmailActionContinueUrl(value, origin) {
    if (!value || !origin) return '';

    try {
        const target = new URL(value, origin);
        const allowedOrigin = new URL(origin).origin;
        return target.origin === allowedOrigin ? target.href : '';
    } catch {
        return '';
    }
}

export function normalizeEmailActionMode(value) {
    const mode = String(value || '');
    return FIREBASE_EMAIL_ACTION_MODES.has(mode) ? mode : '';
}
