import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
    Timestamp,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

const projectId = 'demo-date-tools-security';
const host = process.env.FIRESTORE_EMULATOR_HOST?.split(':')[0] || '127.0.0.1';
const port = Number(process.env.FIRESTORE_EMULATOR_HOST?.split(':')[1] || 8080);
let testEnv;

const auth = (uid, email = `${uid}@example.test`) => ({
    email,
    email_verified: true,
});

const adminDocument = (role, overrides = {}) => ({
    name: role,
    email: `${role}@example.test`,
    active: true,
    platformRole: role,
    role,
    permissions: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'owner-admin',
    updatedBy: 'owner-admin',
    ...overrides,
});

const advertiserDocument = ({ uid, organizationId, organizationNumber, role }) => ({
    storeName: `Store ${organizationId}`,
    contactName: uid,
    email: `${uid}@example.test`,
    phone: '',
    status: 'active',
    portalVersion: 'client',
    acceptedTermsAt: '2026-09-13T00:00:00.000Z',
    acceptedTermsVersion: '1',
    acceptedPrivacyVersion: '1',
    organizationId,
    organizationNumber,
    role,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
});

const campaignDocument = ({ uid, organizationId, suffix = 'a' }) => ({
    campaignNumber: `AD-${suffix}`,
    advertiserId: uid,
    advertiserOrganizationId: organizationId,
    createdBy: uid,
    advertiserEmail: `${uid}@example.test`,
    storeName: `Store ${organizationId}`,
    campaignName: `Campaign ${suffix}`,
    targetTool: 'date_tool',
    adLocation: 'dateTop',
    source: 'advertisers',
    targetUrl: 'https://example.test/offer',
    imageUrl: '/api/media/ads/test.png',
    mediaType: 'image',
    startTime: '2026-09-20T09:00',
    endTime: '2026-09-30T18:00',
    notes: '',
    status: 'قيد المراجعة',
    views: 0,
    clicks: 0,
    portalVersion: 'client',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
});

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId,
        firestore: {
            host,
            port,
            rules: readFileSync('firestore.rules', 'utf8'),
        },
    });
});

beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await Promise.all([
            setDoc(doc(db, 'settings/main'), {
                toolDisplayName: 'Date Tools',
                googleAdSlots: {},
                internalPages: [],
                externalIntegrations: {},
            }),
            setDoc(doc(db, 'settings/public'), { toolDisplayName: 'Date Tools' }),
            setDoc(doc(db, 'admins/owner-admin'), adminDocument('platform_owner')),
            setDoc(doc(db, 'admins/mfa-owner'), adminDocument('platform_owner', { mfaRequired: true })),
            setDoc(doc(db, 'admins/super-admin'), adminDocument('super_admin')),
            setDoc(doc(db, 'admins/ads-admin'), adminDocument('ads_manager')),
            setDoc(doc(db, 'admins/assistant-admin'), adminDocument('admin_assistant', {
                permissions: ['ads.settings.update'],
            })),
            setDoc(doc(db, 'advertisers/owner-a'), advertiserDocument({
                uid: 'owner-a', organizationId: 'org-a', organizationNumber: '100000000001', role: 'owner',
            })),
            setDoc(doc(db, 'advertisers/manager-a'), advertiserDocument({
                uid: 'manager-a', organizationId: 'org-a', organizationNumber: '100000000001', role: 'campaign_manager',
            })),
            setDoc(doc(db, 'advertisers/viewer-a'), advertiserDocument({
                uid: 'viewer-a', organizationId: 'org-a', organizationNumber: '100000000001', role: 'viewer',
            })),
            setDoc(doc(db, 'advertisers/owner-b'), advertiserDocument({
                uid: 'owner-b', organizationId: 'org-b', organizationNumber: '100000000002', role: 'owner',
            })),
            setDoc(doc(db, 'campaigns/campaign-a'), campaignDocument({ uid: 'owner-a', organizationId: 'org-a' })),
            setDoc(doc(db, 'campaigns/campaign-b'), campaignDocument({ uid: 'owner-b', organizationId: 'org-b', suffix: 'b' })),
        ]);
    });
});

afterAll(async () => {
    await testEnv?.cleanup();
});

describe('public and default-deny boundaries', () => {
    it('exposes only public settings to signed-out users', async () => {
        const db = testEnv.unauthenticatedContext().firestore();
        await assertSucceeds(getDoc(doc(db, 'settings/public')));
        await assertFails(getDoc(doc(db, 'settings/main')));
        await assertFails(getDoc(doc(db, 'private/unknown')));
    });

    it('denies direct client writes to audit and support collections', async () => {
        const db = testEnv.authenticatedContext('owner-admin', auth('owner-admin')).firestore();
        await assertFails(setDoc(doc(db, 'audit_logs/forged'), { action: 'forged' }));
        await assertFails(setDoc(doc(db, 'support_tickets/forged'), { message: 'forged' }));
        await assertFails(setDoc(doc(db, 'statistics_unique_visitors/forged'), { createdAt: Timestamp.now() }));
        await assertFails(setDoc(doc(db, 'statistics_pwa_installs/forged'), { createdAt: Timestamp.now() }));
        await assertFails(getDoc(doc(db, 'statistics_pwa_installs/forged')));
    });
});

describe('platform administration', () => {
    it('requires a TOTP-authenticated token when an administrator is marked mfaRequired', async () => {
        const passwordOnlyDb = testEnv.authenticatedContext('mfa-owner', auth('mfa-owner')).firestore();
        const totpDb = testEnv.authenticatedContext('mfa-owner', {
            ...auth('mfa-owner'),
            firebase: { sign_in_provider: 'password', sign_in_second_factor: 'enrollment-id' },
        }).firestore();

        await assertFails(getDoc(doc(passwordOnlyDb, 'settings/main')));
        await assertSucceeds(getDoc(doc(totpDb, 'settings/main')));
    });

    it('uses platform_owner as the only ownership role and protects every owner', async () => {
        const ownerDb = testEnv.authenticatedContext('owner-admin', auth('owner-admin')).firestore();
        const superDb = testEnv.authenticatedContext('super-admin', auth('super-admin')).firestore();
        const newOwner = adminDocument('platform_owner', {
            email: 'second-owner@example.test',
            createdBy: 'owner-admin',
            updatedBy: 'owner-admin',
        });

        await assertSucceeds(setDoc(doc(ownerDb, 'admins/second-owner'), newOwner));
        await assertFails(deleteDoc(doc(ownerDb, 'admins/second-owner')));
        await assertFails(deleteDoc(doc(ownerDb, 'admins/owner-admin')));
        await assertFails(setDoc(doc(superDb, 'admins/third-owner'), adminDocument('platform_owner', {
            createdBy: 'super-admin',
            updatedBy: 'super-admin',
        })));
    });

    it('limits scoped administrators and explicit assistant permissions', async () => {
        const adsDb = testEnv.authenticatedContext('ads-admin', auth('ads-admin')).firestore();
        const assistantDb = testEnv.authenticatedContext('assistant-admin', auth('assistant-admin')).firestore();

        await assertSucceeds(updateDoc(doc(adsDb, 'settings/main'), { googleAdSlots: { dateTop: '123' } }));
        await assertFails(updateDoc(doc(adsDb, 'settings/main'), { toolDisplayName: 'Forged name' }));
        await assertSucceeds(updateDoc(doc(assistantDb, 'settings/main'), { googleAdSlots: { dateTop: '456' } }));
        await assertFails(updateDoc(doc(assistantDb, 'settings/main'), { internalPages: ['/forged'] }));
    });
});

describe('advertiser organization isolation', () => {
    it('allows campaign reads inside the organization and denies cross-organization reads', async () => {
        const db = testEnv.authenticatedContext('viewer-a', auth('viewer-a')).firestore();
        await assertSucceeds(getDoc(doc(db, 'campaigns/campaign-a')));
        await assertFails(getDoc(doc(db, 'campaigns/campaign-b')));
    });

    it('allows managers to create campaigns but denies viewers and forged ownership', async () => {
        const managerDb = testEnv.authenticatedContext('manager-a', auth('manager-a')).firestore();
        const viewerDb = testEnv.authenticatedContext('viewer-a', auth('viewer-a')).firestore();
        const valid = campaignDocument({ uid: 'manager-a', organizationId: 'org-a', suffix: 'new' });

        await assertSucceeds(setDoc(doc(managerDb, 'campaigns/new-valid'), valid));
        await assertFails(setDoc(doc(viewerDb, 'campaigns/viewer-forged'), {
            ...campaignDocument({ uid: 'viewer-a', organizationId: 'org-a', suffix: 'viewer' }),
        }));
        await assertFails(setDoc(doc(managerDb, 'campaigns/cross-org'), {
            ...valid,
            advertiserOrganizationId: 'org-b',
        }));
    });

    it('allows profile fields only and prevents self-escalation', async () => {
        const db = testEnv.authenticatedContext('viewer-a', auth('viewer-a')).firestore();
        await assertSucceeds(updateDoc(doc(db, 'advertisers/viewer-a'), {
            contactName: 'Updated viewer',
            updatedAt: Timestamp.now(),
        }));
        await assertFails(updateDoc(doc(db, 'advertisers/viewer-a'), {
            role: 'owner',
            updatedAt: Timestamp.now(),
        }));
        await assertFails(updateDoc(doc(db, 'advertisers/viewer-a'), {
            organizationId: 'org-b',
            updatedAt: Timestamp.now(),
        }));
    });

    it('allows an organization owner to invite only non-owner roles into the same organization', async () => {
        const db = testEnv.authenticatedContext('owner-a', auth('owner-a')).firestore();
        const member = {
            ...advertiserDocument({
                uid: 'new-member', organizationId: 'org-a', organizationNumber: '100000000001', role: 'campaign_manager',
            }),
            email: 'new-member@example.test',
            status: 'pending_email',
            invitedBy: 'owner-a',
        };

        await assertSucceeds(setDoc(doc(db, 'advertisers/new-member'), member));
        await assertFails(setDoc(doc(db, 'advertisers/forged-owner'), { ...member, email: 'forged@example.test', role: 'owner' }));
        await assertFails(setDoc(doc(db, 'advertisers/cross-org-member'), {
            ...member,
            email: 'cross@example.test',
            organizationId: 'org-b',
            organizationNumber: '100000000002',
        }));
    });
});
