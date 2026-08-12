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
});
