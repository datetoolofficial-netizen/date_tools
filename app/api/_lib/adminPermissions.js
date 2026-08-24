import { isAssistantAdminRole, isFullAdminRole, resolveKnownAdminRole } from '../../adminRoles';

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

export function hasAdminPermission(fields, permissionKeys = [], { fullOnly = false } = {}) {
    if (!isActiveAdminProfile(fields)) return false;

    const role = resolveKnownAdminRole(
        fields?.role?.stringValue,
        fields?.adminRole?.stringValue,
    );
    if (isFullAdminRole(role)) return true;
    if (!isAssistantAdminRole(role)) return false;
    if (fullOnly) return false;

    const allowed = new Set([
        ...readTokens(fields?.permissions),
        ...readTokens(fields?.adminPermissions),
        ...readTokens(fields?.allowedPages),
        ...readTokens(fields?.allowedAdminPages),
        ...readTokens(fields?.pagePermissions),
        ...readTokens(fields?.pageAccess),
    ].map((value) => String(value).trim().toLowerCase()));

    return permissionKeys.some((key) => allowed.has(String(key).trim().toLowerCase()));
}
