export const ADVERTISER_ROLES = Object.freeze({
    OWNER: 'owner',
    ORGANIZATION_ADMIN: 'organization_admin',
    CAMPAIGN_MANAGER: 'campaign_manager',
    CAMPAIGN_EDITOR: 'campaign_editor',
    ANALYST: 'analyst',
    BILLING_MANAGER: 'billing_manager',
    VIEWER: 'viewer',
});

export const ADVERTISER_PERMISSIONS = Object.freeze({
    PROFILE_UPDATE: 'profile.update',
    TEAM_READ: 'team.read',
    TEAM_MANAGE: 'team.manage',
    CAMPAIGNS_READ: 'campaigns.read',
    CAMPAIGNS_CREATE: 'campaigns.create',
    CAMPAIGNS_UPDATE: 'campaigns.update',
    CAMPAIGNS_SUBMIT: 'campaigns.submit',
    CAMPAIGNS_PAUSE: 'campaigns.pause',
    REPORTS_READ: 'reports.read',
    REPORTS_EXPORT: 'reports.export',
    BILLING_READ: 'billing.read',
    BILLING_MANAGE: 'billing.manage',
    ORGANIZATION_TRANSFER: 'organization.transfer',
    ORGANIZATION_CLOSE: 'organization.close',
});

const ROLE_PERMISSIONS = Object.freeze({
    [ADVERTISER_ROLES.OWNER]: Object.freeze(Object.values(ADVERTISER_PERMISSIONS)),
    [ADVERTISER_ROLES.ORGANIZATION_ADMIN]: Object.freeze([
        ADVERTISER_PERMISSIONS.PROFILE_UPDATE,
        ADVERTISER_PERMISSIONS.TEAM_READ,
        ADVERTISER_PERMISSIONS.TEAM_MANAGE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_SUBMIT,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_PAUSE,
        ADVERTISER_PERMISSIONS.REPORTS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_EXPORT,
        ADVERTISER_PERMISSIONS.BILLING_READ,
    ]),
    [ADVERTISER_ROLES.CAMPAIGN_MANAGER]: Object.freeze([
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_SUBMIT,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_PAUSE,
        ADVERTISER_PERMISSIONS.REPORTS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_EXPORT,
    ]),
    [ADVERTISER_ROLES.CAMPAIGN_EDITOR]: Object.freeze([
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_CREATE,
        ADVERTISER_PERMISSIONS.CAMPAIGNS_UPDATE,
    ]),
    [ADVERTISER_ROLES.ANALYST]: Object.freeze([
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_EXPORT,
    ]),
    [ADVERTISER_ROLES.BILLING_MANAGER]: Object.freeze([
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_READ,
        ADVERTISER_PERMISSIONS.BILLING_READ,
        ADVERTISER_PERMISSIONS.BILLING_MANAGE,
    ]),
    [ADVERTISER_ROLES.VIEWER]: Object.freeze([
        ADVERTISER_PERMISSIONS.CAMPAIGNS_READ,
        ADVERTISER_PERMISSIONS.REPORTS_READ,
    ]),
});

const ROLE_LABELS = Object.freeze({
    [ADVERTISER_ROLES.OWNER]: 'مالك حساب المعلن',
    [ADVERTISER_ROLES.ORGANIZATION_ADMIN]: 'مدير المنظمة',
    [ADVERTISER_ROLES.CAMPAIGN_MANAGER]: 'مدير الحملات',
    [ADVERTISER_ROLES.CAMPAIGN_EDITOR]: 'محرر الحملات',
    [ADVERTISER_ROLES.ANALYST]: 'محلل تقارير',
    [ADVERTISER_ROLES.BILLING_MANAGER]: 'مسؤول الفوترة',
    [ADVERTISER_ROLES.VIEWER]: 'مشاهد',
});

export function normalizeAdvertiserRole(value) {
    const role = String(value || '').trim().toLowerCase();
    return ROLE_PERMISSIONS[role] ? role : '';
}

export function resolveAdvertiserRole(profile) {
    if (!profile) return '';

    // Existing advertiser records predate roles and are account owners.
    return normalizeAdvertiserRole(profile.role) || ADVERTISER_ROLES.OWNER;
}

export function getAdvertiserRoleLabel(profile) {
    return ROLE_LABELS[resolveAdvertiserRole(profile)] || 'حساب معلن';
}

export function getAdvertiserPermissions(profile) {
    if (!profile || profile.status !== 'active') return [];
    return [...(ROLE_PERMISSIONS[resolveAdvertiserRole(profile)] || [])];
}

export function hasAdvertiserPermission(profile, permission) {
    return getAdvertiserPermissions(profile).includes(permission);
}

export function normalizeOrganizationNumber(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 12);
}

export function createOrganizationNumber(seed) {
    const source = String(seed || '').trim() || 'date-tools-organization';
    let first = 2166136261;
    let second = 2246822519;

    for (let index = 0; index < source.length; index += 1) {
        const code = source.charCodeAt(index);
        first = Math.imul(first ^ code, 16777619);
        second = Math.imul(second ^ (code + index), 3266489917);
    }

    return `${String(first >>> 0).padStart(10, '0')}${String((second >>> 0) % 100).padStart(2, '0')}`;
}

export function resolveOrganizationNumber(profile = {}) {
    const stored = normalizeOrganizationNumber(profile.organizationNumber);
    if (stored.length === 12) return stored;
    return createOrganizationNumber(profile.organizationId || profile.uid || profile.id);
}

export function formatOrganizationNumber(value) {
    const normalized = normalizeOrganizationNumber(value);
    return normalized.length === 12 ? normalized.replace(/(\d{4})(?=\d)/g, '$1 ') : normalized;
}

export function buildAdvertiserRegistrationProfile({
    uid,
    storeName,
    contactName,
    email,
    phone = '',
    portalVersion,
    organizationId,
    organizationNumber,
    role,
    status = 'pending_email',
}) {
    const cleanUid = String(uid || '').trim();
    const cleanOrganizationId = String(organizationId || cleanUid).trim();
    const cleanRole = normalizeAdvertiserRole(role) || ADVERTISER_ROLES.OWNER;

    return {
        organizationId: cleanOrganizationId,
        organizationNumber: normalizeOrganizationNumber(organizationNumber) || createOrganizationNumber(cleanOrganizationId),
        role: cleanRole,
        storeName: String(storeName || '').trim().slice(0, 120),
        contactName: String(contactName || '').trim().slice(0, 120),
        email: String(email || '').trim().toLowerCase().slice(0, 160),
        phone: String(phone || '').trim().slice(0, 40),
        status,
        portalVersion: String(portalVersion || '').trim().slice(0, 40),
        acceptedTermsAt: new Date().toISOString(),
        acceptedTermsVersion: '2026-09-06',
        acceptedPrivacyVersion: '2026-09-06',
    };
}
