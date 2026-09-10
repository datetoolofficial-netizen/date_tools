import {
    ADMIN_ROLES,
    isKnownAdminRole as isKnownRole,
    normalizeAdminRole,
} from './adminAccess';

export { normalizeAdminRole };

export const FULL_ADMIN_ROLES = new Set([
    ADMIN_ROLES.PLATFORM_OWNER,
    ADMIN_ROLES.SUPER_ADMIN,
    'super-admin',
    'owner',
    'admin',
    'manager',
]);

export const ASSISTANT_ADMIN_ROLES = new Set([
    ADMIN_ROLES.ADMIN_ASSISTANT,
    'assistant',
    'helper',
    'مساعد',
]);

export function isFullAdminRole(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return normalizeAdminRole(normalized) === ADMIN_ROLES.PLATFORM_OWNER
        || normalizeAdminRole(normalized) === ADMIN_ROLES.SUPER_ADMIN;
}

export function isAssistantAdminRole(value) {
    return normalizeAdminRole(value) === ADMIN_ROLES.ADMIN_ASSISTANT;
}

export function isKnownAdminRole(value) {
    return isKnownRole(value);
}

export function resolveKnownAdminRole(...values) {
    for (const value of values) {
        const role = normalizeAdminRole(value);
        if (role) return role;
    }
    return '';
}
