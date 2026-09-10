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

    it('reserves owner-only operations for the platform owner', () => {
        const owner = { active: bool(true), platformRole: text('platform_owner'), role: text('super_admin') };
        const superAdmin = { active: bool(true), role: text('super_admin') };
        expect(hasAdminPermission(owner, ['platform.ownership.manage'])).toBe(true);
        expect(hasAdminPermission(owner, [], { fullOnly: true })).toBe(true);
        expect(hasAdminPermission(superAdmin, ['platform.ownership.manage'])).toBe(false);
        expect(hasAdminPermission(superAdmin, [], { fullOnly: true })).toBe(false);
    });

    it('limits specialist roles to their operational scope', () => {
        const support = { active: bool(true), platformRole: text('support_agent') };
        expect(hasAdminPermission(support, ['support.read'])).toBe(true);
        expect(hasAdminPermission(support, ['support.status'])).toBe(true);
        expect(hasAdminPermission(support, ['support.delete'])).toBe(false);
        expect(hasAdminPermission(support, ['campaigns.update'])).toBe(false);
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
