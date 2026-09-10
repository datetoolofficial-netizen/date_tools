import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    LOCAL_DEMO_ACCOUNT,
    createLocalAdvertiserAccount,
    createLocalAdvertiserCampaign,
    getLocalAdvertiserSession,
    isLocalAdvertiserDemoEnabled,
    listLocalAdvertiserAccounts,
    listLocalAdvertiserCampaigns,
    loginLocalAdvertiser,
    logoutLocalAdvertiser,
    registerLocalAdvertiser,
    updateLocalAdvertiserAccount,
    updateLocalAdvertiserCampaignStatus,
} from '../app/client/localAdvertiserDemo';

function createStorage() {
    const values = new Map();
    return {
        getItem: (key) => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
    };
}

describe('isolated local advertiser demo', () => {
    beforeEach(() => {
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubGlobal('window', {
            location: { hostname: '127.0.0.1' },
            localStorage: createStorage(),
            crypto: globalThis.crypto,
        });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it('seeds and signs in the owner demo account without Firebase', async () => {
        expect(isLocalAdvertiserDemoEnabled()).toBe(true);
        const result = await loginLocalAdvertiser(LOCAL_DEMO_ACCOUNT.email, LOCAL_DEMO_ACCOUNT.password);
        expect(result.profile).toMatchObject({ role: 'owner', status: 'active', isLocalDemo: true });
        expect((await getLocalAdvertiserSession())?.profile.email).toBe(LOCAL_DEMO_ACCOUNT.email);
        expect(await listLocalAdvertiserCampaigns(result.profile)).toHaveLength(1);
    });

    it('creates a separate local account and keeps its campaigns in its organization', async () => {
        const { profile } = await registerLocalAdvertiser({
            storeName: 'متجر جديد',
            contactName: 'مالك جديد',
            email: 'new@local.test',
            phone: '',
            password: 'StrongLocalPassword!',
        });
        const campaign = await createLocalAdvertiserCampaign(profile, {
            campaignNumber: 'LOCAL-2',
            campaignName: 'حملة محلية',
            status: 'قيد المراجعة',
        });

        expect(campaign.advertiserOrganizationId).toBe(profile.organizationId);
        expect(await listLocalAdvertiserCampaigns(profile)).toHaveLength(1);
        await updateLocalAdvertiserCampaignStatus(profile, campaign.id, 'متوقف مؤقتاً');
        expect((await listLocalAdvertiserCampaigns(profile))[0].status).toBe('متوقف مؤقتاً');

        logoutLocalAdvertiser();
        expect(await getLocalAdvertiserSession()).toBeNull();
    });

    it('lists local accounts for the admin screen and safely updates role and status', async () => {
        await loginLocalAdvertiser(LOCAL_DEMO_ACCOUNT.email, LOCAL_DEMO_ACCOUNT.password);
        const [account] = await listLocalAdvertiserAccounts();
        const updated = await updateLocalAdvertiserAccount(account.id, {
            role: 'analyst',
            status: 'suspended',
        });

        expect(updated).toMatchObject({ role: 'analyst', status: 'suspended' });
        expect((await listLocalAdvertiserAccounts())[0]).toMatchObject({ role: 'analyst', status: 'suspended' });
        await expect(updateLocalAdvertiserAccount(account.id, {
            role: 'unknown',
            status: 'active',
        })).rejects.toThrow('invalid_account_update');
    });

    it('creates organization owners and links members by the shared organization number', async () => {
        await loginLocalAdvertiser(LOCAL_DEMO_ACCOUNT.email, LOCAL_DEMO_ACCOUNT.password);
        const [owner] = await listLocalAdvertiserAccounts();
        const member = await createLocalAdvertiserAccount({
            organizationMode: 'existing',
            organizationNumber: owner.organizationNumber,
            storeName: owner.storeName,
            contactName: 'عضو المنظمة',
            email: 'member@local.test',
            password: 'MemberPassword2026!',
            role: 'analyst',
        });
        const newOwner = await createLocalAdvertiserAccount({
            organizationMode: 'new',
            storeName: 'منظمة مستقلة',
            contactName: 'مالك المنظمة',
            email: 'owner2@local.test',
            password: 'OwnerPassword2026!',
        });

        expect(member).toMatchObject({
            organizationId: owner.organizationId,
            organizationNumber: owner.organizationNumber,
            role: 'analyst',
        });
        expect(newOwner.role).toBe('owner');
        expect(newOwner.organizationNumber).not.toBe(owner.organizationNumber);
        await expect(createLocalAdvertiserAccount({
            organizationMode: 'existing',
            organizationNumber: '000000000000',
            email: 'missing@local.test',
            password: 'MissingPassword2026!',
        })).rejects.toThrow('organization_not_found');
    });

    it('does not enable the demo outside development localhost', () => {
        vi.stubEnv('NODE_ENV', 'production');
        expect(isLocalAdvertiserDemoEnabled()).toBe(false);
    });
});
