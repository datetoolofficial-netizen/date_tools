import { getFirestoreServerAuthorization } from '../../serverFirestoreAuth';

const FIREBASE_PROJECT_ID = 'date-tool-official';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

function encodeDetail(value) {
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.slice(0, 30).map((item) => ({ stringValue: String(item).slice(0, 120) })) } };
    }
    return { stringValue: String(value ?? '').slice(0, 500) };
}

export async function writeAdminAuditEvent({ actor, action, resourceType, resourceId = '', details = {} }) {
    const authorization = await getFirestoreServerAuthorization();
    if (!authorization) return false;

    const response = await fetch(`${FIRESTORE_BASE}/audit_logs`, {
        method: 'POST',
        headers: { Authorization: authorization, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fields: {
                action: { stringValue: String(action || '').slice(0, 100) },
                resourceType: { stringValue: String(resourceType || '').slice(0, 80) },
                resourceId: { stringValue: String(resourceId || '').slice(0, 180) },
                actorId: { stringValue: String(actor?.uid || '').slice(0, 180) },
                actorEmail: { stringValue: String(actor?.email || '').slice(0, 160) },
                actorRole: { stringValue: String(actor?.role || '').slice(0, 80) },
                occurredAt: { timestampValue: new Date().toISOString() },
                details: {
                    mapValue: {
                        fields: Object.fromEntries(Object.entries(details).map(([key, value]) => [
                            String(key).slice(0, 80),
                            encodeDetail(value),
                        ])),
                    },
                },
            },
        }),
    });
    return response.ok;
}
