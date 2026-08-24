import 'server-only';

import { getCloudflareContext } from '@opennextjs/cloudflare';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const DEFAULT_HOSTNAMES = new Set([
    'date-tool.com',
    'www.date-tool.com',
    'localhost',
    '127.0.0.1',
]);

async function getCloudflareEnv() {
    try {
        const { env } = await getCloudflareContext({ async: true });
        return env || {};
    } catch {
        return {};
    }
}

async function getEnvValue(...keys) {
    const env = await getCloudflareEnv();

    for (const key of keys) {
        const value = process.env[key] || env?.[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
    }

    return '';
}

export async function getTurnstilePublicConfig() {
    const siteKey = await getEnvValue('TURNSTILE_SITE_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY');
    const secretKey = await getEnvValue('TURNSTILE_SECRET_KEY');

    return {
        enabled: Boolean(siteKey && secretKey),
        siteKey: siteKey && secretKey ? siteKey : '',
    };
}

function getAllowedHostnames(configuredHostnames = '') {
    const allowed = new Set(DEFAULT_HOSTNAMES);

    configuredHostnames
        .split(',')
        .map((hostname) => hostname.trim().toLowerCase())
        .filter(Boolean)
        .forEach((hostname) => allowed.add(hostname));

    return allowed;
}

function classifySiteverifyFailure(errorCodes) {
    const codes = Array.isArray(errorCodes) ? errorCodes : [];

    if (codes.includes('timeout-or-duplicate')) return 'expired_or_duplicate';
    if (codes.includes('internal-error')) return 'verification_unavailable';
    if (codes.some((code) => [
        'missing-input-secret',
        'invalid-input-secret',
        'invalid-widget-id',
        'invalid-parsed-secret',
    ].includes(code))) return 'configuration_error';

    return 'challenge_failed';
}

export async function verifyTurnstileToken({ request, token, action = '' }) {
    const secretKey = await getEnvValue('TURNSTILE_SECRET_KEY');
    const siteKey = await getEnvValue('TURNSTILE_SITE_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY');

    if (!secretKey || !siteKey) {
        const requestHostname = new URL(request.url).hostname.toLowerCase();
        const isLocalRequest = requestHostname === 'localhost' || requestHostname === '127.0.0.1';
        return {
            success: isLocalRequest,
            configured: false,
            error: isLocalRequest ? '' : 'not_configured',
        };
    }

    if (!token || typeof token !== 'string' || token.length > 2048) {
        return { success: false, configured: true, error: 'missing_token' };
    }

    const formData = new FormData();
    formData.set('secret', secretKey);
    formData.set('response', token);

    const remoteIp = request.headers.get('cf-connecting-ip') || '';
    if (remoteIp) formData.set('remoteip', remoteIp);
    formData.set('idempotency_key', crypto.randomUUID());

    let response;
    try {
        response = await fetch(SITEVERIFY_URL, {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(8000),
        });
    } catch {
        return { success: false, configured: true, error: 'verification_unavailable' };
    }

    if (!response.ok) {
        return { success: false, configured: true, error: 'verification_unavailable' };
    }

    const result = await response.json().catch(() => ({}));
    const configuredHostnames = await getEnvValue('TURNSTILE_ALLOWED_HOSTNAMES');
    const hostname = String(result.hostname || '').toLowerCase();
    const hostnameAllowed = hostname && getAllowedHostnames(configuredHostnames).has(hostname);
    const actionMatches = !action || result.action === action;

    return {
        success: result.success === true && hostnameAllowed && actionMatches,
        configured: true,
        error: result.success !== true
            ? classifySiteverifyFailure(result['error-codes'])
            : !hostnameAllowed
                ? 'hostname_mismatch'
                : !actionMatches
                    ? 'action_mismatch'
                    : '',
    };
}
