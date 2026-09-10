import {
    ADMIN_PERMISSIONS,
    ADMIN_ROLES,
    expandAdminPermissions,
    getRolePermissions,
    normalizeAdminPermission,
    normalizeAdminRole,
} from '../../adminAccess';

function readTokens(field) {
    if (!field) return [];
    if (field.stringValue) return [field.stringValue];
    if (field.arrayValue?.values) return field.arrayValue.values.flatMap(readTokens);
    if (field.mapValue?.fields) {
        return Object.entries(field.mapValue.fields)
            .filter(([, value]) => value?.booleanValue === true)
            .map(([key]) => key);
    }
    return [];
}

export function isActiveAdminProfile(fields) {
    return fields?.active?.booleanValue === true;
}

export function resolveEncodedAdminRole(fields = {}) {
    return normalizeAdminRole(fields?.platformRole?.stringValue)
        || normalizeAdminRole(fields?.role?.stringValue)
        || normalizeAdminRole(fields?.adminRole?.stringValue);
}

function getEncodedPermissions(fields = {}) {
    return new Set([
        ...readTokens(fields?.permissions),
        ...readTokens(fields?.adminPermissions),
        ...readTokens(fields?.allowedPages),
        ...readTokens(fields?.allowedAdminPages),
        ...readTokens(fields?.pagePermissions),
        ...readTokens(fields?.pageAccess),
    ].map(normalizeAdminPermission).filter(Boolean));
}

export function hasAdminPermission(fields, permissionKeys = [], { fullOnly = false } = {}) {
    if (!isActiveAdminProfile(fields)) return false;

    const role = resolveEncodedAdminRole(fields);
    if (!role) return false;
    if (fullOnly) return role === ADMIN_ROLES.PLATFORM_OWNER;

    const requested = permissionKeys.map(normalizeAdminPermission).filter(Boolean);
    if (requested.length === 0) return false;
    const allowed = new Set(expandAdminPermissions([
        ...getRolePermissions(role),
        ...getEncodedPermissions(fields),
    ]));
    return requested.some((permission) => allowed.has(permission));
}

export function isPlatformOwnerProfile(fields) {
    return isActiveAdminProfile(fields)
        && resolveEncodedAdminRole(fields) === ADMIN_ROLES.PLATFORM_OWNER
        && hasAdminPermission(fields, [ADMIN_PERMISSIONS.PLATFORM_OWNERSHIP_MANAGE]);
}
