'use client';

import {
    ADVERTISER_PERMISSIONS,
    ADVERTISER_ROLES,
    buildAdvertiserRegistrationProfile,
    hasAdvertiserPermission,
    normalizeAdvertiserRole,
    normalizeOrganizationNumber,
    resolveOrganizationNumber,
} from '../advertiserAccess';
import { CLIENT_PORTAL_VERSION } from './ClientVersion';

const STORAGE_KEY = 'date_tools_local_advertiser_demo_v1';
const SESSION_KEY = 'date_tools_local_advertiser_session_v1';
const DEMO_UID = 'local-demo-advertiser-owner';

export const LOCAL_DEMO_ACCOUNT = Object.freeze({
    email: 'demo.advertiser@local.test',
    password: 'LocalDemo2026!',
});

export function isLocalAdvertiserDemoEnabled() {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

async function digest(value) {
    const bytes = new TextEncoder().encode(String(value || ''));
    const result = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(result), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readStore() {
    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '') || null;
    } catch {
        return null;
    }
}

function writeStore(store) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function nowIso() {
    return new Date().toISOString();
}

async function ensureStore() {
    const existing = readStore();
    if (existing?.accounts && Array.isArray(existing.campaigns)) {
        Object.values(existing.accounts).forEach((account) => {
            const profile = account.profile || {};
            profile.organizationId = profile.organizationId || profile.uid || profile.id;
            profile.organizationNumber = resolveOrganizationNumber(profile);
            account.profile = profile;
        });
        existing.version = 2;
        writeStore(existing);
        return existing;
    }

    const profile = {
        id: DEMO_UID,
        uid: DEMO_UID,
        ...buildAdvertiserRegistrationProfile({
            uid: DEMO_UID,
            storeName: 'متجر المعلن التجريبي',
            contactName: 'مسؤول الحساب التجريبي',
            email: LOCAL_DEMO_ACCOUNT.email,
            portalVersion: CLIENT_PORTAL_VERSION,
        }),
        status: 'active',
        emailVerified: true,
        isLocalDemo: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };
    const store = {
        version: 2,
        accounts: {
            [DEMO_UID]: {
                passwordDigest: await digest(LOCAL_DEMO_ACCOUNT.password),
                profile,
            },
        },
        campaigns: [
            {
                id: 'local-demo-campaign-1',
                campaignNumber: 'DEMO-1001',
                advertiserId: DEMO_UID,
                advertiserOrganizationId: DEMO_UID,
                createdBy: DEMO_UID,
                advertiserEmail: LOCAL_DEMO_ACCOUNT.email,
                storeName: profile.storeName,
                campaignName: 'حملة تجريبية للوحة المعلن',
                targetTool: 'date_tool',
                adLocation: 'dateTop',
                source: 'advertisers',
                targetUrl: 'https://date-tool.com/',
                imageUrl: '',
                mediaType: 'image',
                startTime: '2026-09-01T09:00',
                endTime: '2026-09-30T23:00',
                notes: 'بيانات محلية للتجربة فقط.',
                status: 'قيد المراجعة',
                views: 1280,
                clicks: 74,
                portalVersion: 'client',
                createdAt: nowIso(),
                updatedAt: nowIso(),
            },
        ],
    };

    writeStore(store);
    return store;
}

function createLocalUser(profile) {
    return {
        uid: profile.uid || profile.id,
        email: profile.email,
        emailVerified: true,
        getIdToken: async () => '',
    };
}

export async function loginLocalAdvertiser(email, password) {
    if (!isLocalAdvertiserDemoEnabled()) throw new Error('local_demo_disabled');
    const store = await ensureStore();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const passwordDigest = await digest(password);
    const match = Object.values(store.accounts).find((account) => (
        account.profile.email === cleanEmail && account.passwordDigest === passwordDigest
    ));

    if (!match) {
        const error = new Error('invalid_local_credentials');
        error.code = 'auth/invalid-credential';
        throw error;
    }

    window.localStorage.setItem(SESSION_KEY, match.profile.id);
    return { user: createLocalUser(match.profile), profile: match.profile };
}

export async function registerLocalAdvertiser(form) {
    if (!isLocalAdvertiserDemoEnabled()) throw new Error('local_demo_disabled');
    const store = await ensureStore();
    const cleanEmail = String(form.email || '').trim().toLowerCase();
    const alreadyExists = Object.values(store.accounts).some((account) => account.profile.email === cleanEmail);
    if (alreadyExists) {
        const error = new Error('email_already_in_use');
        error.code = 'auth/email-already-in-use';
        throw error;
    }

    const uid = `local-${window.crypto.randomUUID()}`;
    const profile = {
        id: uid,
        uid,
        ...buildAdvertiserRegistrationProfile({
            uid,
            storeName: form.storeName,
            contactName: form.contactName,
            email: cleanEmail,
            phone: form.phone,
            portalVersion: CLIENT_PORTAL_VERSION,
        }),
        status: 'active',
        emailVerified: true,
        isLocalDemo: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };

    store.accounts[uid] = { passwordDigest: await digest(form.password), profile };
    writeStore(store);
    window.localStorage.setItem(SESSION_KEY, uid);
    return { user: createLocalUser(profile), profile };
}

export async function getLocalAdvertiserSession() {
    if (!isLocalAdvertiserDemoEnabled()) return null;
    const store = await ensureStore();
    const uid = window.localStorage.getItem(SESSION_KEY) || '';
    const profile = store.accounts[uid]?.profile;
    return profile ? { user: createLocalUser(profile), profile } : null;
}

export function logoutLocalAdvertiser() {
    if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_KEY);
}

export async function listLocalAdvertiserAccounts() {
    if (!isLocalAdvertiserDemoEnabled()) return [];
    const store = await ensureStore();
    return Object.values(store.accounts)
        .map((account) => ({ ...account.profile }))
        .sort((a, b) => String(a.storeName || a.email || '').localeCompare(String(b.storeName || b.email || ''), 'ar'));
}

export async function createLocalAdvertiserAccount(form = {}) {
    if (!isLocalAdvertiserDemoEnabled()) throw new Error('local_demo_disabled');
    const store = await ensureStore();
    const cleanEmail = String(form.email || '').trim().toLowerCase();
    const cleanPassword = String(form.password || '');
    if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('invalid_email');
    if (cleanPassword.length < 8) throw new Error('weak_password');
    if (Object.values(store.accounts).some((account) => account.profile.email === cleanEmail)) {
        throw new Error('email_already_in_use');
    }

    const requestedNumber = normalizeOrganizationNumber(form.organizationNumber);
    const linkedAccount = requestedNumber
        ? Object.values(store.accounts).find((account) => resolveOrganizationNumber(account.profile) === requestedNumber)
        : null;
    if (form.organizationMode === 'existing' && !linkedAccount) throw new Error('organization_not_found');

    const uid = `local-${window.crypto.randomUUID()}`;
    const organizationId = linkedAccount?.profile.organizationId || uid;
    const organizationNumber = linkedAccount
        ? resolveOrganizationNumber(linkedAccount.profile)
        : resolveOrganizationNumber({ organizationId });
    const role = linkedAccount
        ? (normalizeAdvertiserRole(form.role) || ADVERTISER_ROLES.CAMPAIGN_MANAGER)
        : ADVERTISER_ROLES.OWNER;
    const profile = {
        id: uid,
        uid,
        ...buildAdvertiserRegistrationProfile({
            uid,
            storeName: form.storeName,
            contactName: form.contactName,
            email: cleanEmail,
            phone: form.phone,
            portalVersion: CLIENT_PORTAL_VERSION,
            organizationId,
            organizationNumber,
            role,
            status: 'active',
        }),
        emailVerified: true,
        isLocalDemo: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };

    store.accounts[uid] = { passwordDigest: await digest(cleanPassword), profile };
    writeStore(store);
    return { ...profile };
}

export async function updateLocalAdvertiserAccount(id, updates = {}) {
    if (!isLocalAdvertiserDemoEnabled()) throw new Error('local_demo_disabled');
    const allowedRoles = new Set(Object.values(ADVERTISER_ROLES));
    const allowedStatuses = new Set(['pending_email', 'active', 'suspended', 'closed']);
    if (!allowedRoles.has(updates.role) || !allowedStatuses.has(updates.status)) {
        throw new Error('invalid_account_update');
    }

    const store = await ensureStore();
    const account = store.accounts[id];
    if (!account) throw new Error('advertiser_not_found');
    const requestedNumber = normalizeOrganizationNumber(updates.organizationNumber)
        || resolveOrganizationNumber(account.profile);
    const organizationAccount = Object.values(store.accounts).find((item) => (
        resolveOrganizationNumber(item.profile) === requestedNumber
    ));
    if (!organizationAccount) throw new Error('organization_not_found');

    account.profile = {
        ...account.profile,
        role: updates.role,
        status: updates.status,
        organizationId: organizationAccount.profile.organizationId,
        organizationNumber: requestedNumber,
        updatedAt: nowIso(),
    };
    writeStore(store);
    return { ...account.profile };
}

export async function listLocalAdvertiserCampaigns(profile) {
    const store = await ensureStore();
    if (!hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_READ)) return [];
    return store.campaigns.filter((campaign) => (
        campaign.advertiserOrganizationId === profile.organizationId
        || campaign.advertiserId === profile.id
    ));
}

export async function createLocalAdvertiserCampaign(profile, payload) {
    if (!hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE)) {
        throw new Error('permission_denied');
    }
    const store = await ensureStore();
    const id = `local-campaign-${window.crypto.randomUUID()}`;
    const campaign = {
        ...payload,
        id,
        advertiserId: profile.id,
        advertiserOrganizationId: profile.organizationId,
        createdBy: profile.id,
        advertiserEmail: profile.email,
        storeName: profile.storeName,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };
    store.campaigns.push(campaign);
    writeStore(store);
    return campaign;
}

export async function updateLocalAdvertiserCampaignStatus(profile, campaignId, status) {
    if (!hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE)) {
        throw new Error('permission_denied');
    }
    const store = await ensureStore();
    const index = store.campaigns.findIndex((campaign) => (
        campaign.id === campaignId
        && (campaign.advertiserOrganizationId === profile.organizationId || campaign.advertiserId === profile.id)
    ));
    if (index < 0) throw new Error('campaign_not_found');
    store.campaigns[index] = { ...store.campaigns[index], status, updatedAt: nowIso() };
    writeStore(store);
    return store.campaigns[index];
}

export function readLocalCampaignImage(file, maxBytes = 750 * 1024) {
    if (!file || !/^image\/(?:png|jpeg|webp|gif)$/i.test(file.type) || file.size > maxBytes) {
        throw new Error('invalid_local_demo_image');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('local_demo_image_failed'));
        reader.readAsDataURL(file);
    });
}
