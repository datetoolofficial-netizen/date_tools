import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (...parts) => readFileSync(join(process.cwd(), ...parts), 'utf8');

describe('administrator MFA enforcement coverage', () => {
    it('keeps enrollment secrets local and supports a TOTP challenge', () => {
        const panel = readProjectFile('app', 'components', 'admin', 'TotpMfaPanel.jsx');
        const login = readProjectFile('app', 'admin_login', 'page.jsx');

        expect(panel).toContain("import('qrcode')");
        expect(panel).toContain('generateQrCodeUrl');
        expect(panel).toContain('sendEmailVerification');
        expect(panel).toContain('user.reload()');
        expect(panel).toContain('multiFactor(user).unenroll');
        expect(panel).toContain('نعم، إيقاف العامل الثاني');
        expect(panel).toContain('handleCodeInApp: false');
        expect(panel).not.toMatch(/chart\.googleapis|api\.qrserver|quickchart/i);
        expect(login).toContain('auth/multi-factor-auth-required');
        expect(login).toContain('assertionForSignIn');
        expect(login).toContain('sendSignInLinkToEmail');
        expect(login).toContain('signInWithEmailLink');
        expect(login).toContain('isSignInWithEmailLink');
        expect(login).toContain('handleCodeInApp: true');
    });

    it('guards every sensitive server route behind the MFA policy switch', () => {
        const routeFiles = [
            ['app', 'api', 'admin', 'audit', 'route.js'],
            ['app', 'api', 'admin', 'cleanup', 'route.js'],
            ['app', 'api', 'admin', 'indexnow', 'route.js'],
            ['app', 'api', 'admin', 'support', 'route.js'],
            ['app', 'api', 'media', 'upload', 'route.js'],
            ['app', 'api', 'pagespeed', 'route.js'],
        ];

        for (const routeFile of routeFiles) {
            expect(readProjectFile(...routeFile), routeFile.join('/')).toContain('adminMfaRequirementSatisfied');
        }
    });

    it('lets Firestore require a second-factor claim per administrator account', () => {
        const rules = readProjectFile('firestore.rules');

        expect(rules).toContain('adminMfaRequirementSatisfied()');
        expect(rules).toContain('mfaRequired');
        expect(rules).toContain('sign_in_second_factor');
        expect(rules).toContain('get("sign_in_second_factor", "") != ""');
    });
});
