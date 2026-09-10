import { describe, expect, it } from 'vitest';
import {
    ADVERTISER_PERMISSIONS,
    ADVERTISER_ROLES,
    buildAdvertiserRegistrationProfile,
    createOrganizationNumber,
    formatOrganizationNumber,
    getAdvertiserPermissions,
    hasAdvertiserPermission,
    normalizeOrganizationNumber,
    resolveOrganizationNumber,
    resolveAdvertiserRole,
} from '../app/advertiserAccess';

describe('advertiser roles and permissions', () => {
    it('gives the account owner every advertiser permission', () => {
        const profile = { status: 'active', role: ADVERTISER_ROLES.OWNER };
        expect(getAdvertiserPermissions(profile)).toEqual(expect.arrayContaining(Object.values(ADVERTISER_PERMISSIONS)));
    });

    it('limits campaign managers to campaign and report work', () => {
        const profile = { status: 'active', role: ADVERTISER_ROLES.CAMPAIGN_MANAGER };
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE)).toBe(true);
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE)).toBe(true);
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.TEAM_MANAGE)).toBe(false);
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.PROFILE_UPDATE)).toBe(false);
    });

    it('keeps analysts read-only and rejects inactive accounts', () => {
        const analyst = { status: 'active', role: ADVERTISER_ROLES.ANALYST };
        expect(hasAdvertiserPermission(analyst, ADVERTISER_PERMISSIONS.CAMPAIGNS_READ)).toBe(true);
        expect(hasAdvertiserPermission(analyst, ADVERTISER_PERMISSIONS.REPORTS_READ)).toBe(true);
        expect(hasAdvertiserPermission(analyst, ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE)).toBe(false);
        expect(getAdvertiserPermissions({ ...analyst, status: 'suspended' })).toEqual([]);
    });

    it('lets organization admins manage members without transferring ownership', () => {
        const profile = { status: 'active', role: ADVERTISER_ROLES.ORGANIZATION_ADMIN };
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.TEAM_MANAGE)).toBe(true);
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_SUBMIT)).toBe(true);
        expect(hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.ORGANIZATION_TRANSFER)).toBe(false);
    });

    it('keeps campaign editors in draft scope and viewers read-only', () => {
        const editor = { status: 'active', role: ADVERTISER_ROLES.CAMPAIGN_EDITOR };
        const viewer = { status: 'active', role: ADVERTISER_ROLES.VIEWER };
        expect(hasAdvertiserPermission(editor, ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE)).toBe(true);
        expect(hasAdvertiserPermission(editor, ADVERTISER_PERMISSIONS.CAMPAIGNS_SUBMIT)).toBe(false);
        expect(hasAdvertiserPermission(viewer, ADVERTISER_PERMISSIONS.CAMPAIGNS_READ)).toBe(true);
        expect(hasAdvertiserPermission(viewer, ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE)).toBe(false);
    });

    it('treats legacy advertiser profiles as owners without changing stored data', () => {
        expect(resolveAdvertiserRole({ status: 'active' })).toBe(ADVERTISER_ROLES.OWNER);
    });

    it('builds a bounded owner profile for a new organization', () => {
        const profile = buildAdvertiserRegistrationProfile({
            uid: ' uid-1 ',
            storeName: ' Store ',
            contactName: ' Owner ',
            email: 'OWNER@EXAMPLE.COM ',
            phone: ' +966500000000 ',
            portalVersion: 'client-1',
        });

        expect(profile).toMatchObject({
            organizationId: 'uid-1',
            organizationNumber: createOrganizationNumber('uid-1'),
            role: ADVERTISER_ROLES.OWNER,
            storeName: 'Store',
            contactName: 'Owner',
            email: 'owner@example.com',
            phone: '+966500000000',
            status: 'pending_email',
            acceptedTermsVersion: '2026-09-06',
            acceptedPrivacyVersion: '2026-09-06',
        });
    });

    it('creates one stable twelve-digit number for every organization', () => {
        const number = createOrganizationNumber('organization-1');
        expect(number).toMatch(/^\d{12}$/);
        expect(createOrganizationNumber('organization-1')).toBe(number);
        expect(resolveOrganizationNumber({ organizationId: 'organization-1' })).toBe(number);
        expect(normalizeOrganizationNumber('1234-5678 9012')).toBe('123456789012');
        expect(formatOrganizationNumber('123456789012')).toBe('1234 5678 9012');
    });
});
