'use client';

const ALLOWED_DETAIL_KEYS = new Set(['status', 'role', 'source']);

function cleanDetails(details = {}) {
    return Object.fromEntries(Object.entries(details)
        .filter(([key]) => ALLOWED_DETAIL_KEYS.has(key))
        .map(([key, value]) => [key, String(value ?? '').slice(0, 120)]));
}

export async function recordAdvertiserAudit({ user, action, resourceType, resourceId, details = {} }) {
    try {
        if (!user?.getIdToken) return false;
        const token = await user.getIdToken();
        const response = await fetch('/api/client/audit', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: String(action || '').slice(0, 100),
                resourceType: String(resourceType || '').slice(0, 80),
                resourceId: String(resourceId || '').slice(0, 180),
                details: cleanDetails(details),
            }),
        });
        return response.ok;
    } catch {
        return false;
    }
}
