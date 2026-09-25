import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    findTotpFactor,
    getMfaErrorMessage,
    hasTotpFactor,
    hasTotpSecondFactorClaim,
    isMfaProtectedAdmin,
    isAdminMfaRequired,
    isValidTotpCode,
    normalizeTotpCode,
} from '../app/firebaseMfa';

describe('Firebase MFA policy helpers', () => {
    it('protects ownership, general administration, and security roles', () => {
        expect(isMfaProtectedAdmin({ platformRole: 'platform_owner' })).toBe(true);
        expect(isMfaProtectedAdmin({ role: 'super_admin' })).toBe(true);
        expect(isMfaProtectedAdmin({ role: 'security_manager' })).toBe(true);
        expect(isMfaProtectedAdmin({ role: 'content_manager' })).toBe(false);
    });

    it('recognizes only TOTP factors', () => {
        const factors = [
            { factorId: 'phone', uid: 'phone-factor' },
            { factorId: 'totp', uid: 'totp-factor' },
        ];

        expect(hasTotpFactor(factors)).toBe(true);
        expect(findTotpFactor(factors)).toEqual(factors[1]);
        expect(findTotpFactor([{ factorId: 'phone' }])).toBeNull();
        expect(hasTotpSecondFactorClaim({ firebase: { sign_in_second_factor: 'enrollment-id' } })).toBe(true);
        expect(hasTotpSecondFactorClaim({ firebase: { sign_in_second_factor: '' } })).toBe(false);
    });

    it('normalizes a six-digit authenticator code', () => {
        expect(normalizeTotpCode(' 12-34 56 ')).toBe('123456');
        expect(normalizeTotpCode('123456789')).toBe('123456');
        expect(isValidTotpCode('123 456')).toBe(true);
        expect(isValidTotpCode('12345')).toBe(false);
        expect(isValidTotpCode('1234567')).toBe(false);
    });

    it('keeps enforcement disabled unless the release flag is explicit', () => {
        const previousValue = process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED;
        delete process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED;
        expect(isAdminMfaRequired()).toBe(false);
        process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED = 'true';
        expect(isAdminMfaRequired()).toBe(true);
        if (previousValue === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED;
        else process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED = previousValue;
    });

    it('wires enrollment and challenge handling into the admin surfaces', () => {
        const loginSource = readFileSync(join(process.cwd(), 'app', 'admin_login', 'page.jsx'), 'utf8');
        const accountSource = readFileSync(join(process.cwd(), 'app', 'admin', 'account', 'page.jsx'), 'utf8');

        expect(loginSource).toContain("auth/multi-factor-auth-required");
        expect(loginSource).toContain('assertionForSignIn');
        expect(loginSource).toContain('TotpMfaPanel');
        expect(accountSource).toContain('TotpMfaPanel');
    });

    it('returns safe Arabic errors without exposing provider details', () => {
        expect(getMfaErrorMessage({ code: 'auth/invalid-verification-code' })).toContain('غير صحيح');
        expect(getMfaErrorMessage({ code: 'auth/operation-not-allowed' })).toContain('Firebase');
        expect(getMfaErrorMessage(new Error('private provider response'))).not.toContain('private');
    });
});
