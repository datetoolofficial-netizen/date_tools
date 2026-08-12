'use client';

import { useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function TurnstileField({ action, onTokenChange, resetKey = 0 }) {
    const [config, setConfig] = useState({ enabled: false, siteKey: '' });

    useEffect(() => {
        let active = true;

        fetch('/api/security/turnstile', { cache: 'no-store' })
            .then((response) => response.json())
            .then((result) => {
                if (active && result?.enabled && result?.siteKey) setConfig(result);
            })
            .catch(() => {
                // An unavailable optional challenge must not hide the existing form.
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        onTokenChange?.('');
    }, [onTokenChange, resetKey]);

    if (!config.enabled) return null;

    return (
        <div className="turnstile-field" data-action="turnstile-spin-v1">
            <Turnstile
                key={resetKey}
                siteKey={config.siteKey}
                onSuccess={(token) => onTokenChange?.(token)}
                onExpire={() => onTokenChange?.('')}
                onError={() => onTokenChange?.('')}
                options={{
                    action,
                    theme: 'auto',
                    appearance: 'interaction-only',
                    language: 'ar',
                }}
            />
        </div>
    );
}
