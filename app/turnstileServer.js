import 'server-only';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { verifyTurnstileTokenWithConfig } from './turnstileVerification';

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

export async function verifyTurnstileToken({ request, token, action = '' }) {
    const secretKey = await getEnvValue('TURNSTILE_SECRET_KEY');
    const siteKey = await getEnvValue('TURNSTILE_SITE_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY');
    const configuredHostnames = await getEnvValue('TURNSTILE_ALLOWED_HOSTNAMES');

    return verifyTurnstileTokenWithConfig({
        request,
        token,
        action,
        secretKey,
        siteKey,
        configuredHostnames,
    });
}
