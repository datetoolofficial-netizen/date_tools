export const ADMIN_ROLES = Object.freeze({
    PLATFORM_OWNER: 'platform_owner',
    SUPER_ADMIN: 'super_admin',
    OPERATIONS_MANAGER: 'operations_manager',
    CONTENT_MANAGER: 'content_manager',
    ADS_MANAGER: 'ads_manager',
    ACCOUNTS_MANAGER: 'accounts_manager',
    SECURITY_MANAGER: 'security_manager',
    SUPPORT_AGENT: 'support_agent',
    PERFORMANCE_ANALYST: 'performance_analyst',
    AUDITOR: 'auditor',
    ADMIN_ASSISTANT: 'admin_assistant',
});

export const ADMIN_PERMISSIONS = Object.freeze({
    DASHBOARD_READ: 'dashboard.read',
    SITE_IDENTITY_READ: 'site.identity.read',
    SITE_IDENTITY_UPDATE: 'site.identity.update',
    SITE_SETTINGS_READ: 'site.settings.read',
    SITE_SETTINGS_UPDATE: 'site.settings.update',
    SITE_PRIVACY_READ: 'site.privacy.read',
    SITE_PRIVACY_UPDATE: 'site.privacy.update',
    PWA_SETTINGS_READ: 'pwa.settings.read',
    PWA_RELEASE: 'pwa.release',
    CONTENT_TOOLS_READ: 'content.tools.read',
    CONTENT_TOOLS_UPDATE: 'content.tools.update',
    CONTENT_PAGES_READ: 'content.pages.read',
    CONTENT_PAGES_CREATE: 'content.pages.create',
    CONTENT_PAGES_UPDATE: 'content.pages.update',
    CONTENT_PAGES_PUBLISH: 'content.pages.publish',
    CONTENT_PAGES_ARCHIVE: 'content.pages.archive',
    SEO_READ: 'seo.read',
    SEO_UPDATE: 'seo.update',
    SEO_SUBMIT_INDEX: 'seo.submit_index',
    ADS_SETTINGS_READ: 'ads.settings.read',
    ADS_SETTINGS_UPDATE: 'ads.settings.update',
    CAMPAIGNS_READ: 'campaigns.read',
    CAMPAIGNS_CREATE: 'campaigns.create',
    CAMPAIGNS_UPDATE: 'campaigns.update',
    CAMPAIGNS_REVIEW: 'campaigns.review',
    CAMPAIGNS_OPERATE: 'campaigns.operate',
    CAMPAIGNS_DELETE: 'campaigns.delete',
    ADVERTISERS_READ: 'advertisers.read',
    ADVERTISERS_CREATE: 'advertisers.create',
    ADVERTISERS_UPDATE: 'advertisers.update',
    ADVERTISERS_STATUS: 'advertisers.status',
    ADVERTISERS_ROLES: 'advertisers.roles',
    ADVERTISERS_DELETE: 'advertisers.delete',
    SUPPORT_READ: 'support.read',
    SUPPORT_REPLY: 'support.reply',
    SUPPORT_STATUS: 'support.status',
    SUPPORT_DELETE: 'support.delete',
    ANALYTICS_READ: 'analytics.read',
    ANALYTICS_EXPORT: 'analytics.export',
    PERFORMANCE_READ: 'performance.read',
    PERFORMANCE_RUN: 'performance.run',
    INTEGRATIONS_READ: 'integrations.read',
    INTEGRATIONS_UPDATE: 'integrations.update',
    INTEGRATIONS_TEST: 'integrations.test',
    SECURITY_READ: 'security.read',
    SECURITY_OPERATE: 'security.operate',
    ADMINS_READ: 'admins.read',
    ADMINS_CREATE: 'admins.create',
    ADMINS_UPDATE_ROLE: 'admins.update_role',
    ADMINS_SUSPEND: 'admins.suspend',
    ADMINS_DELETE: 'admins.delete',
    AUDIT_READ: 'audit.read',
    AUDIT_EXPORT: 'audit.export',
    PLATFORM_OWNERSHIP_MANAGE: 'platform.ownership.manage',
});

const ALL_PERMISSIONS = Object.freeze(Object.values(ADMIN_PERMISSIONS));

const CONTENT_PERMISSIONS = [
    ADMIN_PERMISSIONS.DASHBOARD_READ,
    ADMIN_PERMISSIONS.SITE_IDENTITY_READ,
    ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE,
    ADMIN_PERMISSIONS.SITE_SETTINGS_READ,
    ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE,
    ADMIN_PERMISSIONS.SITE_PRIVACY_READ,
    ADMIN_PERMISSIONS.SITE_PRIVACY_UPDATE,
    ADMIN_PERMISSIONS.PWA_SETTINGS_READ,
    ADMIN_PERMISSIONS.PWA_RELEASE,
    ADMIN_PERMISSIONS.CONTENT_TOOLS_READ,
    ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
    ADMIN_PERMISSIONS.CONTENT_PAGES_READ,
    ADMIN_PERMISSIONS.CONTENT_PAGES_CREATE,
    ADMIN_PERMISSIONS.CONTENT_PAGES_UPDATE,
    ADMIN_PERMISSIONS.CONTENT_PAGES_PUBLISH,
    ADMIN_PERMISSIONS.CONTENT_PAGES_ARCHIVE,
    ADMIN_PERMISSIONS.SEO_READ,
    ADMIN_PERMISSIONS.SEO_UPDATE,
    ADMIN_PERMISSIONS.SEO_SUBMIT_INDEX,
];

const ROLE_PERMISSIONS = Object.freeze({
    [ADMIN_ROLES.PLATFORM_OWNER]: ALL_PERMISSIONS,
    [ADMIN_ROLES.SUPER_ADMIN]: ALL_PERMISSIONS.filter((permission) => (
        permission !== ADMIN_PERMISSIONS.PLATFORM_OWNERSHIP_MANAGE
        && permission !== ADMIN_PERMISSIONS.ADMINS_DELETE
    )),
    [ADMIN_ROLES.OPERATIONS_MANAGER]: [
        ...CONTENT_PERMISSIONS,
        ADMIN_PERMISSIONS.ADS_SETTINGS_READ,
        ADMIN_PERMISSIONS.CAMPAIGNS_READ,
        ADMIN_PERMISSIONS.CAMPAIGNS_REVIEW,
        ADMIN_PERMISSIONS.CAMPAIGNS_OPERATE,
        ADMIN_PERMISSIONS.ADVERTISERS_READ,
        ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
        ADMIN_PERMISSIONS.ADVERTISERS_STATUS,
        ADMIN_PERMISSIONS.SUPPORT_READ,
        ADMIN_PERMISSIONS.SUPPORT_REPLY,
        ADMIN_PERMISSIONS.SUPPORT_STATUS,
        ADMIN_PERMISSIONS.ANALYTICS_READ,
        ADMIN_PERMISSIONS.PERFORMANCE_READ,
        ADMIN_PERMISSIONS.PERFORMANCE_RUN,
    ],
    [ADMIN_ROLES.CONTENT_MANAGER]: CONTENT_PERMISSIONS,
    [ADMIN_ROLES.ADS_MANAGER]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.ADS_SETTINGS_READ,
        ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
        ADMIN_PERMISSIONS.CAMPAIGNS_READ,
        ADMIN_PERMISSIONS.CAMPAIGNS_CREATE,
        ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE,
        ADMIN_PERMISSIONS.CAMPAIGNS_REVIEW,
        ADMIN_PERMISSIONS.CAMPAIGNS_OPERATE,
        ADMIN_PERMISSIONS.ANALYTICS_READ,
        ADMIN_PERMISSIONS.ANALYTICS_EXPORT,
    ],
    [ADMIN_ROLES.ACCOUNTS_MANAGER]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.ADVERTISERS_READ,
        ADMIN_PERMISSIONS.ADVERTISERS_CREATE,
        ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
        ADMIN_PERMISSIONS.ADVERTISERS_STATUS,
        ADMIN_PERMISSIONS.ADVERTISERS_ROLES,
        ADMIN_PERMISSIONS.SUPPORT_READ,
        ADMIN_PERMISSIONS.SUPPORT_REPLY,
        ADMIN_PERMISSIONS.SUPPORT_STATUS,
    ],
    [ADMIN_ROLES.SECURITY_MANAGER]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.SITE_PRIVACY_READ,
        ADMIN_PERMISSIONS.SITE_PRIVACY_UPDATE,
        ADMIN_PERMISSIONS.INTEGRATIONS_READ,
        ADMIN_PERMISSIONS.SECURITY_READ,
        ADMIN_PERMISSIONS.SECURITY_OPERATE,
        ADMIN_PERMISSIONS.AUDIT_READ,
        ADMIN_PERMISSIONS.AUDIT_EXPORT,
    ],
    [ADMIN_ROLES.SUPPORT_AGENT]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.ADVERTISERS_READ,
        ADMIN_PERMISSIONS.SUPPORT_READ,
        ADMIN_PERMISSIONS.SUPPORT_REPLY,
        ADMIN_PERMISSIONS.SUPPORT_STATUS,
    ],
    [ADMIN_ROLES.PERFORMANCE_ANALYST]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.ANALYTICS_READ,
        ADMIN_PERMISSIONS.ANALYTICS_EXPORT,
        ADMIN_PERMISSIONS.PERFORMANCE_READ,
        ADMIN_PERMISSIONS.PERFORMANCE_RUN,
        ADMIN_PERMISSIONS.CAMPAIGNS_READ,
    ],
    [ADMIN_ROLES.AUDITOR]: [
        ADMIN_PERMISSIONS.DASHBOARD_READ,
        ADMIN_PERMISSIONS.SITE_IDENTITY_READ,
        ADMIN_PERMISSIONS.SITE_SETTINGS_READ,
        ADMIN_PERMISSIONS.SITE_PRIVACY_READ,
        ADMIN_PERMISSIONS.PWA_SETTINGS_READ,
        ADMIN_PERMISSIONS.CONTENT_TOOLS_READ,
        ADMIN_PERMISSIONS.CONTENT_PAGES_READ,
        ADMIN_PERMISSIONS.SEO_READ,
        ADMIN_PERMISSIONS.ADS_SETTINGS_READ,
        ADMIN_PERMISSIONS.CAMPAIGNS_READ,
        ADMIN_PERMISSIONS.ADVERTISERS_READ,
        ADMIN_PERMISSIONS.SUPPORT_READ,
        ADMIN_PERMISSIONS.ANALYTICS_READ,
        ADMIN_PERMISSIONS.PERFORMANCE_READ,
        ADMIN_PERMISSIONS.INTEGRATIONS_READ,
        ADMIN_PERMISSIONS.SECURITY_READ,
        ADMIN_PERMISSIONS.ADMINS_READ,
        ADMIN_PERMISSIONS.AUDIT_READ,
    ],
    [ADMIN_ROLES.ADMIN_ASSISTANT]: [],
});

const LEGACY_ROLE_ALIASES = Object.freeze({
    'super-admin': ADMIN_ROLES.SUPER_ADMIN,
    owner: ADMIN_ROLES.SUPER_ADMIN,
    admin: ADMIN_ROLES.SUPER_ADMIN,
    manager: ADMIN_ROLES.SUPER_ADMIN,
    assistant: ADMIN_ROLES.ADMIN_ASSISTANT,
    helper: ADMIN_ROLES.ADMIN_ASSISTANT,
    'مساعد': ADMIN_ROLES.ADMIN_ASSISTANT,
});

const ROLE_LABELS = Object.freeze({
    [ADMIN_ROLES.PLATFORM_OWNER]: 'مالك المنصة',
    [ADMIN_ROLES.SUPER_ADMIN]: 'المدير العام',
    [ADMIN_ROLES.OPERATIONS_MANAGER]: 'مدير التشغيل',
    [ADMIN_ROLES.CONTENT_MANAGER]: 'مدير المحتوى وSEO',
    [ADMIN_ROLES.ADS_MANAGER]: 'مدير الإعلانات',
    [ADMIN_ROLES.ACCOUNTS_MANAGER]: 'مدير حسابات المعلنين',
    [ADMIN_ROLES.SECURITY_MANAGER]: 'مسؤول الأمن',
    [ADMIN_ROLES.SUPPORT_AGENT]: 'موظف الدعم',
    [ADMIN_ROLES.PERFORMANCE_ANALYST]: 'محلل الأداء',
    [ADMIN_ROLES.AUDITOR]: 'مدقق بصلاحية القراءة',
    [ADMIN_ROLES.ADMIN_ASSISTANT]: 'مساعد الإدارة',
});

const PERMISSION_ALIASES = Object.freeze({
    home: ADMIN_PERMISSIONS.DASHBOARD_READ,
    dashboard: ADMIN_PERMISSIONS.DASHBOARD_READ,
    admin: ADMIN_PERMISSIONS.DASHBOARD_READ,
    identity: ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE,
    brand: ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE,
    branding: ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE,
    tools: ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE,
    settings: ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE,
    'site-settings': ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE,
    pages: ADMIN_PERMISSIONS.CONTENT_PAGES_UPDATE,
    'tool-management': ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
    toolmanagement: ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
    'tools-management': ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
    toolscontent: ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE,
    ads: ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE,
    campaigns: ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE,
    'ad-campaigns': ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE,
    'ad-settings': ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
    adsettings: ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
    'ads-settings': ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
    'google-ads': ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE,
    accounts: ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
    client: ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
    advertisers: ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
    clients: ADMIN_PERMISSIONS.ADVERTISERS_UPDATE,
    support: ADMIN_PERMISSIONS.SUPPORT_STATUS,
    tickets: ADMIN_PERMISSIONS.SUPPORT_STATUS,
    security: ADMIN_PERMISSIONS.SECURITY_READ,
    protection: ADMIN_PERMISSIONS.SECURITY_READ,
    privacy: ADMIN_PERMISSIONS.SITE_PRIVACY_UPDATE,
    integrations: ADMIN_PERMISSIONS.INTEGRATIONS_UPDATE,
    'external-integrations': ADMIN_PERMISSIONS.INTEGRATIONS_UPDATE,
    externalintegrations: ADMIN_PERMISSIONS.INTEGRATIONS_UPDATE,
    pagespeed: ADMIN_PERMISSIONS.PERFORMANCE_RUN,
    'page-speed': ADMIN_PERMISSIONS.PERFORMANCE_RUN,
    performance: ADMIN_PERMISSIONS.PERFORMANCE_RUN,
});

const PERMISSION_IMPLICATIONS = Object.freeze({
    [ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE]: [ADMIN_PERMISSIONS.SITE_IDENTITY_READ],
    [ADMIN_PERMISSIONS.SITE_SETTINGS_UPDATE]: [ADMIN_PERMISSIONS.SITE_SETTINGS_READ],
    [ADMIN_PERMISSIONS.SITE_PRIVACY_UPDATE]: [ADMIN_PERMISSIONS.SITE_PRIVACY_READ],
    [ADMIN_PERMISSIONS.PWA_RELEASE]: [ADMIN_PERMISSIONS.PWA_SETTINGS_READ],
    [ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE]: [ADMIN_PERMISSIONS.CONTENT_TOOLS_READ],
    [ADMIN_PERMISSIONS.CONTENT_PAGES_CREATE]: [ADMIN_PERMISSIONS.CONTENT_PAGES_READ],
    [ADMIN_PERMISSIONS.CONTENT_PAGES_UPDATE]: [ADMIN_PERMISSIONS.CONTENT_PAGES_READ],
    [ADMIN_PERMISSIONS.CONTENT_PAGES_PUBLISH]: [ADMIN_PERMISSIONS.CONTENT_PAGES_READ],
    [ADMIN_PERMISSIONS.CONTENT_PAGES_ARCHIVE]: [ADMIN_PERMISSIONS.CONTENT_PAGES_READ],
    [ADMIN_PERMISSIONS.SEO_UPDATE]: [ADMIN_PERMISSIONS.SEO_READ],
    [ADMIN_PERMISSIONS.SEO_SUBMIT_INDEX]: [ADMIN_PERMISSIONS.SEO_READ],
    [ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE]: [ADMIN_PERMISSIONS.ADS_SETTINGS_READ],
    [ADMIN_PERMISSIONS.CAMPAIGNS_CREATE]: [ADMIN_PERMISSIONS.CAMPAIGNS_READ],
    [ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE]: [ADMIN_PERMISSIONS.CAMPAIGNS_READ],
    [ADMIN_PERMISSIONS.CAMPAIGNS_REVIEW]: [ADMIN_PERMISSIONS.CAMPAIGNS_READ],
    [ADMIN_PERMISSIONS.CAMPAIGNS_OPERATE]: [ADMIN_PERMISSIONS.CAMPAIGNS_READ],
    [ADMIN_PERMISSIONS.CAMPAIGNS_DELETE]: [ADMIN_PERMISSIONS.CAMPAIGNS_READ],
    [ADMIN_PERMISSIONS.ADVERTISERS_CREATE]: [ADMIN_PERMISSIONS.ADVERTISERS_READ],
    [ADMIN_PERMISSIONS.ADVERTISERS_UPDATE]: [ADMIN_PERMISSIONS.ADVERTISERS_READ],
    [ADMIN_PERMISSIONS.ADVERTISERS_STATUS]: [ADMIN_PERMISSIONS.ADVERTISERS_READ],
    [ADMIN_PERMISSIONS.ADVERTISERS_ROLES]: [ADMIN_PERMISSIONS.ADVERTISERS_READ],
    [ADMIN_PERMISSIONS.ADVERTISERS_DELETE]: [ADMIN_PERMISSIONS.ADVERTISERS_READ],
    [ADMIN_PERMISSIONS.SUPPORT_REPLY]: [ADMIN_PERMISSIONS.SUPPORT_READ],
    [ADMIN_PERMISSIONS.SUPPORT_STATUS]: [ADMIN_PERMISSIONS.SUPPORT_READ],
    [ADMIN_PERMISSIONS.SUPPORT_DELETE]: [ADMIN_PERMISSIONS.SUPPORT_READ],
    [ADMIN_PERMISSIONS.ANALYTICS_EXPORT]: [ADMIN_PERMISSIONS.ANALYTICS_READ],
    [ADMIN_PERMISSIONS.PERFORMANCE_RUN]: [ADMIN_PERMISSIONS.PERFORMANCE_READ],
    [ADMIN_PERMISSIONS.INTEGRATIONS_UPDATE]: [ADMIN_PERMISSIONS.INTEGRATIONS_READ],
    [ADMIN_PERMISSIONS.INTEGRATIONS_TEST]: [ADMIN_PERMISSIONS.INTEGRATIONS_READ],
    [ADMIN_PERMISSIONS.SECURITY_OPERATE]: [ADMIN_PERMISSIONS.SECURITY_READ],
    [ADMIN_PERMISSIONS.ADMINS_CREATE]: [ADMIN_PERMISSIONS.ADMINS_READ],
    [ADMIN_PERMISSIONS.ADMINS_UPDATE_ROLE]: [ADMIN_PERMISSIONS.ADMINS_READ],
    [ADMIN_PERMISSIONS.ADMINS_SUSPEND]: [ADMIN_PERMISSIONS.ADMINS_READ],
    [ADMIN_PERMISSIONS.ADMINS_DELETE]: [ADMIN_PERMISSIONS.ADMINS_READ],
    [ADMIN_PERMISSIONS.AUDIT_EXPORT]: [ADMIN_PERMISSIONS.AUDIT_READ],
});

export const ADMIN_ROLE_OPTIONS = Object.freeze(Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })));

export function normalizeAdminToken(value) {
    return String(value || '').trim().toLowerCase();
}

export function normalizeAdminRole(value) {
    const role = normalizeAdminToken(value);
    if (ROLE_PERMISSIONS[role]) return role;
    return LEGACY_ROLE_ALIASES[role] || '';
}

export function resolveAdminRole(profile = {}) {
    return normalizeAdminRole(profile.platformRole)
        || normalizeAdminRole(profile.role)
        || normalizeAdminRole(profile.adminRole);
}

export function getAdminRoleLabel(profileOrRole) {
    const role = typeof profileOrRole === 'object'
        ? resolveAdminRole(profileOrRole)
        : normalizeAdminRole(profileOrRole);
    return ROLE_LABELS[role] || 'حساب إداري';
}

export function getRolePermissions(role) {
    return expandAdminPermissions(ROLE_PERMISSIONS[normalizeAdminRole(role)] || []);
}

export function normalizeAdminPermission(value) {
    const permission = normalizeAdminToken(value);
    if (ALL_PERMISSIONS.includes(permission)) return permission;
    return PERMISSION_ALIASES[permission] || '';
}

function addPermissionValue(value, result) {
    if (!value) return;
    if (typeof value === 'string') {
        const permission = normalizeAdminPermission(value);
        if (permission) result.add(permission);
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item) => addPermissionValue(item, result));
        return;
    }
    if (typeof value === 'object') {
        Object.entries(value).forEach(([key, enabled]) => {
            if (enabled === true) addPermissionValue(key, result);
        });
    }
}

export function getExplicitAdminPermissions(profile = {}) {
    const result = new Set();
    [
        profile.permissions,
        profile.adminPermissions,
        profile.allowedPages,
        profile.allowedAdminPages,
        profile.pagePermissions,
        profile.pageAccess,
    ].forEach((value) => addPermissionValue(value, result));
    return expandAdminPermissions([...result]);
}

export function expandAdminPermissions(permissions = []) {
    const expanded = new Set(permissions.map(normalizeAdminPermission).filter(Boolean));
    let changed = true;
    while (changed) {
        changed = false;
        [...expanded].forEach((permission) => {
            (PERMISSION_IMPLICATIONS[permission] || []).forEach((implied) => {
                if (!expanded.has(implied)) {
                    expanded.add(implied);
                    changed = true;
                }
            });
        });
    }
    return [...expanded];
}

export function getAdminPermissions(profile = {}) {
    if (!profile || profile.active !== true) return [];
    const role = resolveAdminRole(profile);
    const permissions = new Set(getRolePermissions(role));
    getExplicitAdminPermissions(profile).forEach((permission) => permissions.add(permission));
    return [...permissions];
}

export function hasAdminPermission(profile, permission, aliases = []) {
    if (!profile || profile.active !== true) return false;
    const requested = [permission, ...aliases]
        .map(normalizeAdminPermission)
        .filter(Boolean);
    if (requested.length === 0) return false;
    const allowed = new Set(getAdminPermissions(profile));
    return requested.some((item) => allowed.has(item));
}

export function isPlatformOwner(profileOrRole) {
    const role = typeof profileOrRole === 'object'
        ? resolveAdminRole(profileOrRole)
        : normalizeAdminRole(profileOrRole);
    return role === ADMIN_ROLES.PLATFORM_OWNER;
}

export function isKnownAdminRole(value) {
    return Boolean(normalizeAdminRole(value));
}
