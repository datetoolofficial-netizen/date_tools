'use client';

import { useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function TurnstileField({ action, onTokenChange, onStatusChange, resetKey = 0 }) {
    const [config, setConfig] = useState({ loaded: false, enabled: false, siteKey: '' });

    useEffect(() => {
        let active = true;

        onStatusChange?.({ enabled: null, ready: false, error: '' });

        fetch('/api/security/turnstile', { cache: 'no-store' })
            .then((response) => {
                if (!response.ok) throw new Error('turnstile_config_unavailable');
                return response.json();
            })
            .then((result) => {
                if (!active) return;

                if (result?.enabled && result?.siteKey) {
                    setConfig({ loaded: true, enabled: true, siteKey: result.siteKey });
                    onStatusChange?.({ enabled: true, ready: false, error: '' });
                    return;
                }

                const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
                setConfig({ loaded: true, enabled: false, siteKey: '' });
                onStatusChange?.({
                    enabled: false,
                    ready: isLocal,
                    error: isLocal ? '' : 'not_configured',
                });
            })
            .catch(() => {
                if (!active) return;
                setConfig({ loaded: true, enabled: false, siteKey: '' });
                onStatusChange?.({ enabled: null, ready: false, error: 'config_unavailable' });
            });

        return () => {
            active = false;
        };
    }, [onStatusChange]);

    useEffect(() => {
        onTokenChange?.('');
        if (config.enabled) onStatusChange?.({ enabled: true, ready: false, error: '' });
    }, [config.enabled, onStatusChange, onTokenChange, resetKey]);

    if (!config.loaded || !config.enabled) return null;

    return (
        <div className="turnstile-field" data-action="turnstile-spin-v1">
            <Turnstile
                key={resetKey}
                siteKey={config.siteKey}
                onSuccess={(token) => {
                    onTokenChange?.(token);
                    onStatusChange?.({ enabled: true, ready: true, error: '' });
                }}
                onExpire={() => {
                    onTokenChange?.('');
                    onStatusChange?.({ enabled: true, ready: false, error: 'expired' });
                }}
                onError={() => {
                    onTokenChange?.('');
                    onStatusChange?.({ enabled: true, ready: false, error: 'challenge_error' });
                }}
                onTimeout={() => {
                    onTokenChange?.('');
                    onStatusChange?.({ enabled: true, ready: false, error: 'timeout' });
                }}
                onUnsupported={() => {
                    onTokenChange?.('');
                    onStatusChange?.({ enabled: true, ready: false, error: 'unsupported_browser' });
                }}
                options={{
                    action,
                    theme: 'auto',
                    appearance: 'interaction-only',
                    language: 'ar',
                    execution: 'render',
                    retry: 'auto',
                    retryInterval: 5000,
                    refreshExpired: 'auto',
                    refreshTimeout: 'auto',
                }}
            />
        </div>
    );
}
