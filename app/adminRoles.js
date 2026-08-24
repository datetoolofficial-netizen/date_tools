export const FULL_ADMIN_ROLES = new Set([
    'super_admin',
    'super-admin',
    'owner',
    'admin',
    'manager',
]);

export const ASSISTANT_ADMIN_ROLES = new Set([
    'assistant',
    'helper',
    'مساعد',
]);

export function normalizeAdminRole(value) {
    return String(value || '').trim().toLowerCase();
}

export function isFullAdminRole(value) {
    return FULL_ADMIN_ROLES.has(normalizeAdminRole(value));
}

export function isAssistantAdminRole(value) {
    return ASSISTANT_ADMIN_ROLES.has(normalizeAdminRole(value));
}

export function isKnownAdminRole(value) {
    return isFullAdminRole(value) || isAssistantAdminRole(value);
}

export function resolveKnownAdminRole(...values) {
    for (const value of values) {
        const role = normalizeAdminRole(value);
        if (isKnownAdminRole(role)) return role;
    }

    return '';
}
