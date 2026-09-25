import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('administrator account settings', () => {
    it('keeps account settings available at the bottom of the shared sidebar', () => {
        const shell = readProjectFile('app', 'admin', 'AdminShell.jsx');

        expect(shell).toContain("href: '/admin/account'");
        expect(shell).toContain("label: 'إعدادات الحساب'");
        expect(shell).toContain("placement: 'bottom'");
        expect(shell).toContain('legacy-nav-links-bottom');
        expect(shell).toContain('if (item?.alwaysAvailable) return Boolean(profile?.active)');
    });

    it('collects profile, recovery, and MFA controls on the account page', () => {
        const accountPage = readProjectFile('app', 'admin', 'account', 'page.jsx');
        const securityPage = readProjectFile('app', 'admin', 'security', 'page.jsx');
        const mfaPanel = readProjectFile('app', 'components', 'admin', 'TotpMfaPanel.jsx');

        expect(accountPage).toContain('بيانات الحساب');
        expect(accountPage).toContain('حالة حماية الحساب');
        expect(accountPage).toContain('TotpMfaPanel');
        expect(accountPage).toContain('sendPasswordResetEmail');
        expect(accountPage).toContain('assertProductionMutationAllowed');
        expect(accountPage).toContain('hasTotpSecondFactorClaim');
        expect(accountPage).toContain('onDisabled');
        expect(securityPage).not.toContain('TotpMfaPanel');
        expect(securityPage).toContain('href="/admin/account"');
        expect(mfaPanel).toContain("/admin/account");
    });
});
