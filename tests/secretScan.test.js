import { describe, expect, it } from 'vitest';
import { findSecretMatches } from '../scripts/scan-secrets.mjs';

describe('repository secret scanner', () => {
    it('flags credential-shaped values without printing the value', () => {
        const githubToken = `ghp_${'A'.repeat(36)}`;
        const stripeSecret = `sk_live_${'b'.repeat(24)}`;
        const findings = findSecretMatches('unsafe.txt', `${githubToken}\n${stripeSecret}`);

        expect(findings).toEqual([
            { path: 'unsafe.txt', line: 1, type: 'github-token' },
            { path: 'unsafe.txt', line: 2, type: 'stripe-secret' },
        ]);
        expect(JSON.stringify(findings)).not.toContain(githubToken);
        expect(JSON.stringify(findings)).not.toContain(stripeSecret);
    });

    it('flags a private key body but ignores source-code delimiters and placeholders', () => {
        const header = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');
        const footer = ['-----END', 'PRIVATE KEY-----'].join(' ');
        const realShape = `${header}\\n${'A'.repeat(48)}\\n${footer}`;

        expect(findSecretMatches('secret.env', realShape)).toHaveLength(1);
        expect(findSecretMatches('source.js', `.replace('${header}', '')`)).toEqual([]);
        expect(findSecretMatches('.dev.vars.example', `${header}\\n...\\n${footer}`)).toEqual([]);
    });

    it('allows the documented public Firebase browser key only in its source file', () => {
        const browserKey = `AIzaSy${'A'.repeat(33)}`;
        expect(findSecretMatches('app/firebase.js', browserKey)).toEqual([]);
        expect(findSecretMatches('notes.txt', browserKey)).toEqual([
            { path: 'notes.txt', line: 1, type: 'google-api-key' },
        ]);
    });
});
