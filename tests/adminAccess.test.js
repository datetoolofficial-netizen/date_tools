import { describe, expect, it } from 'vitest';
import {
    ADMIN_PERMISSIONS,
    ADMIN_ROLES,
    getAdminRoleLabel,
    getRolePermissions,
    hasAdminPermission,
    isPlatformOwner,
    resolveAdminRole,
} from '../app/adminAccess';

describe('administration role model', () => {
    it('prefers the staged platformRole without breaking the legacy role', () => {
        const profile = { active: true, platformRole: 'platform_owner', role: 'super_admin' };
        expect(resolveAdminRole(profile)).toBe(ADMIN_ROLES.PLATFORM_OWNER);
        expect(getAdminRoleLabel(profile)).toBe('مالك المنصة');
        expect(isPlatformOwner(profile)).toBe(true);
    });

    it('maps legacy full roles to super admin rather than platform owner', () => {
        expect(resolveAdminRole({ role: 'owner' })).toBe(ADMIN_ROLES.SUPER_ADMIN);
        expect(resolveAdminRole({ role: 'manager' })).toBe(ADMIN_ROLES.SUPER_ADMIN);
        expect(isPlatformOwner('owner')).toBe(false);
    });

    it('grants destructive administration only to the platform owner', () => {
        const owner = { active: true, platformRole: ADMIN_ROLES.PLATFORM_OWNER };
        const superAdmin = { active: true, platformRole: ADMIN_ROLES.SUPER_ADMIN };
        expect(hasAdminPermission(owner, ADMIN_PERMISSIONS.ADMINS_DELETE)).toBe(true);
        expect(hasAdminPermission(superAdmin, ADMIN_PERMISSIONS.ADMINS_DELETE)).toBe(false);
        expect(hasAdminPermission(superAdmin, ADMIN_PERMISSIONS.ADMINS_UPDATE_ROLE)).toBe(true);
    });

    it('allows explicit assistant actions without granting a whole section', () => {
        const assistant = {
            active: true,
            platformRole: ADMIN_ROLES.ADMIN_ASSISTANT,
            permissions: [ADMIN_PERMISSIONS.SUPPORT_READ],
        };
        expect(hasAdminPermission(assistant, ADMIN_PERMISSIONS.SUPPORT_READ)).toBe(true);
        expect(hasAdminPermission(assistant, ADMIN_PERMISSIONS.SUPPORT_STATUS)).toBe(false);
    });

    it('implies read access when an assistant receives a write action', () => {
        const assistant = {
            active: true,
            platformRole: ADMIN_ROLES.ADMIN_ASSISTANT,
            permissions: [ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE],
        };
        expect(hasAdminPermission(assistant, ADMIN_PERMISSIONS.CAMPAIGNS_READ)).toBe(true);
        expect(hasAdminPermission(assistant, ADMIN_PERMISSIONS.CAMPAIGNS_DELETE)).toBe(false);
    });

    it('keeps auditors read-only', () => {
        const permissions = getRolePermissions(ADMIN_ROLES.AUDITOR);
        expect(permissions).toContain(ADMIN_PERMISSIONS.AUDIT_READ);
        expect(permissions).toContain(ADMIN_PERMISSIONS.CAMPAIGNS_READ);
        expect(permissions).not.toContain(ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE);
        expect(permissions).not.toContain(ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE);
    });
});
