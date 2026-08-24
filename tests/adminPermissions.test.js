import { describe, expect, it } from 'vitest';
import { hasAdminPermission, isActiveAdminProfile } from '../app/api/_lib/adminPermissions';

const bool = (value) => ({ booleanValue: value });
const text = (value) => ({ stringValue: value });

describe('admin permissions', () => {
    it('denies inactive administrators', () => {
        const profile = { active: bool(false), role: text('manager') };
        expect(isActiveAdminProfile(profile)).toBe(false);
        expect(hasAdminPermission(profile, ['support'])).toBe(false);
    });

    it('allows full administrators without a page list', () => {
        const profile = { active: bool(true), role: text('manager') };
        expect(hasAdminPermission(profile, ['support'])).toBe(true);
    });

    it('uses a supported adminRole when a legacy role field also exists', () => {
        const profile = {
            active: bool(true),
            role: text('legacy'),
            adminRole: text('super_admin'),
        };
        expect(hasAdminPermission(profile, ['support'])).toBe(true);
    });

    it('denies active profiles with missing or unknown roles', () => {
        expect(hasAdminPermission({ active: bool(true) }, ['support'])).toBe(false);
        expect(hasAdminPermission({ active: bool(true), role: text('editor') }, ['support'])).toBe(false);
    });

    it('limits assistants to their explicit permissions', () => {
        const profile = {
            active: bool(true),
            role: text('assistant'),
            permissions: { arrayValue: { values: [text('support')] } },
        };
        expect(hasAdminPermission(profile, ['support', 'tickets'])).toBe(true);
        expect(hasAdminPermission(profile, ['ads'])).toBe(false);
        expect(hasAdminPermission(profile, ['support'], { fullOnly: true })).toBe(false);
    });

    it('denies assistants without an explicit permission', () => {
        const profile = { active: bool(true), role: text('assistant') };
        expect(hasAdminPermission(profile, ['support'])).toBe(false);
    });
});
