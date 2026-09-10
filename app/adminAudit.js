'use client';

const ALLOWED_DETAIL_KEYS = new Set([
    'changedFields', 'status', 'role', 'source', 'reason', 'organizationId', 'result',
]);

function cleanDetails(details = {}) {
    return Object.fromEntries(
        Object.entries(details)
            .filter(([key]) => ALLOWED_DETAIL_KEYS.has(key))
            .map(([key, value]) => [key, Array.isArray(value)
                ? value.map((item) => String(item).slice(0, 120)).slice(0, 30)
                : String(value ?? '').slice(0, 500)])
    );
}

export async function recordAdminAudit({ action, resourceType, resourceId = '', details = {} }) {
    try {
        const [{ getFirebaseAuth }, { getIdToken }] = await Promise.all([
            import('./firebase'),
            import('firebase/auth'),
        ]);
        const auth = await getFirebaseAuth();
        if (!auth.currentUser) return false;
        const token = await getIdToken(auth.currentUser);
        const response = await fetch('/api/admin/audit', {
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
