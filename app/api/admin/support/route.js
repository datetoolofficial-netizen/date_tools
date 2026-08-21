import { getCloudflareContext } from '@opennextjs/cloudflare';
import { hasAdminPermission } from '../../_lib/adminPermissions';
import { verifyFirebaseIdToken } from '../../_lib/firebaseIdToken';

const FIREBASE_PROJECT_ID = 'date-tool-official';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const MAX_LISTED_TICKETS = 500;
const PAGE_SIZE = 100;
const VALID_STATUSES = new Set(['جديدة', 'قيد المتابعة', 'بانتظار العميل', 'مغلقة']);

export const dynamic = 'force-dynamic';

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: { 'Cache-Control': 'no-store' },
    });
}

function getBearerToken(request) {
    const authorization = request.headers.get('authorization') || '';
    return authorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
}

async function getAdminProfile(idToken, uid) {
    const response = await fetch(`${FIRESTORE_BASE}/admins/${encodeURIComponent(uid)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });

    if (!response.ok) return null;
    const profile = await response.json();
    return profile?.fields || null;
}

async function requireActiveAdmin(request) {
    const idToken = getBearerToken(request);
    if (!idToken) return null;

    const user = await verifyFirebaseIdToken(idToken, FIREBASE_PROJECT_ID);
    if (!user?.localId) return null;
    const profile = await getAdminProfile(idToken, user.localId);
    if (!hasAdminPermission(profile, ['support', 'tickets'])) return null;

    return {
        idToken,
        uid: user.localId,
        email: String(user.email || '').slice(0, 160),
    };
}

function decodeFirestoreValue(value = {}) {
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('booleanValue' in value) return value.booleanValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('nullValue' in value) return null;
    return '';
}

function decodeTicket(document = {}) {
    const fields = Object.fromEntries(
        Object.entries(document.fields || {}).map(([key, value]) => [key, decodeFirestoreValue(value)])
    );

    return {
        id: String(document.name || '').split('/').pop() || '',
        ...fields,
    };
}

function isSafeDocumentId(value) {
    return /^[A-Za-z0-9_-]{1,180}$/.test(String(value || ''));
}

function cleanNote(value) {
    return String(value || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        .trim()
        .slice(0, 1200);
}

async function getTicketDocument(idToken, ticketId) {
    const response = await fetch(`${FIRESTORE_BASE}/support_tickets/${encodeURIComponent(ticketId)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`ticket_read_failed_${response.status}`);
    return response.json();
}

async function listTickets(idToken) {
    const tickets = [];
    let pageToken = '';

    do {
        const url = new URL(`${FIRESTORE_BASE}/support_tickets`);
        url.searchParams.set('pageSize', String(PAGE_SIZE));
        url.searchParams.set('orderBy', 'createdAt desc');
        if (pageToken) url.searchParams.set('pageToken', pageToken);

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${idToken}` },
            cache: 'no-store',
        });

        if (!response.ok) throw new Error(`ticket_list_failed_${response.status}`);
        const data = await response.json();
        tickets.push(...(data.documents || []).map(decodeTicket));
        pageToken = data.nextPageToken || '';
    } while (pageToken && tickets.length < MAX_LISTED_TICKETS);

    return tickets.slice(0, MAX_LISTED_TICKETS);
}

async function getCloudflareEnv() {
    try {
        const { env } = await getCloudflareContext({ async: true });
        return env || {};
    } catch {
        return {};
    }
}

async function getMediaBucket() {
    const env = await getCloudflareEnv();
    return env?.MEDIA_BUCKET || null;
}

export async function GET(request) {
    try {
        const admin = await requireActiveAdmin(request);
        if (!admin) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);

        const url = new URL(request.url);
        const attachmentTicketId = url.searchParams.get('attachment');

        if (!attachmentTicketId) {
            return jsonResponse({ ok: true, tickets: await listTickets(admin.idToken) });
        }

        if (!isSafeDocumentId(attachmentTicketId)) {
            return jsonResponse({ ok: false, error: 'invalid_ticket_id' }, 400);
        }

        const ticketDocument = await getTicketDocument(admin.idToken, attachmentTicketId);
        if (!ticketDocument) return jsonResponse({ ok: false, error: 'ticket_not_found' }, 404);

        const ticket = decodeTicket(ticketDocument);
        const attachmentKey = String(ticket.attachmentKey || '');
        if (!attachmentKey.startsWith('support/')) {
            return jsonResponse({ ok: false, error: 'attachment_not_found' }, 404);
        }

        const bucket = await getMediaBucket();
        if (!bucket) return jsonResponse({ ok: false, error: 'media_storage_not_configured' }, 503);

        const object = await bucket.get(attachmentKey);
        if (!object) return jsonResponse({ ok: false, error: 'attachment_not_found' }, 404);

        const headers = new Headers({
            'Cache-Control': 'private, no-store, max-age=0',
            'Content-Type': String(ticket.attachmentContentType || 'application/octet-stream'),
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(String(ticket.attachmentName || 'attachment'))}`,
            'X-Content-Type-Options': 'nosniff',
        });
        object.writeHttpMetadata?.(headers);
        headers.set('Cache-Control', 'private, no-store, max-age=0');
        headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(String(ticket.attachmentName || 'attachment'))}`);
        headers.set('X-Content-Type-Options', 'nosniff');

        return new Response(object.body, { headers });
    } catch (error) {
        console.error('admin support GET failed:', error instanceof Error ? error.message : 'unknown');
        return jsonResponse({ ok: false, error: 'support_read_failed' }, 500);
    }
}

export async function PATCH(request) {
    try {
        const admin = await requireActiveAdmin(request);
        if (!admin) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);

        const payload = await request.json().catch(() => ({}));
        const ticketId = String(payload.id || '');
        const status = String(payload.status || '');
        const adminNote = cleanNote(payload.adminNote);

        if (!isSafeDocumentId(ticketId) || !VALID_STATUSES.has(status)) {
            return jsonResponse({ ok: false, error: 'invalid_ticket_update' }, 400);
        }

        const url = new URL(`${FIRESTORE_BASE}/support_tickets/${encodeURIComponent(ticketId)}`);
        ['status', 'adminNote', 'updatedAt', 'updatedBy'].forEach((field) => {
            url.searchParams.append('updateMask.fieldPaths', field);
        });

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${admin.idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: {
                    status: { stringValue: status },
                    adminNote: { stringValue: adminNote },
                    updatedAt: { timestampValue: new Date().toISOString() },
                    updatedBy: { stringValue: admin.email || admin.uid },
                },
            }),
        });

        if (!response.ok) throw new Error(`ticket_update_failed_${response.status}`);
        return jsonResponse({ ok: true, ticket: decodeTicket(await response.json()) });
    } catch (error) {
        console.error('admin support PATCH failed:', error instanceof Error ? error.message : 'unknown');
        return jsonResponse({ ok: false, error: 'support_update_failed' }, 500);
    }
}

export async function DELETE(request) {
    try {
        const admin = await requireActiveAdmin(request);
        if (!admin) return jsonResponse({ ok: false, error: 'unauthorized' }, 401);

        const payload = await request.json().catch(() => ({}));
        const ticketId = String(payload.id || '');
        if (!isSafeDocumentId(ticketId)) {
            return jsonResponse({ ok: false, error: 'invalid_ticket_id' }, 400);
        }

        const ticketDocument = await getTicketDocument(admin.idToken, ticketId);
        if (!ticketDocument) return jsonResponse({ ok: false, error: 'ticket_not_found' }, 404);

        const ticket = decodeTicket(ticketDocument);
        const attachmentKey = String(ticket.attachmentKey || '');

        if (attachmentKey) {
            if (!attachmentKey.startsWith('support/')) {
                return jsonResponse({ ok: false, error: 'invalid_attachment_key' }, 400);
            }

            const bucket = await getMediaBucket();
            if (!bucket) return jsonResponse({ ok: false, error: 'media_storage_not_configured' }, 503);
            await bucket.delete(attachmentKey);
        }

        const response = await fetch(`${FIRESTORE_BASE}/support_tickets/${encodeURIComponent(ticketId)}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${admin.idToken}` },
        });

        if (!response.ok && response.status !== 404) {
            throw new Error(`ticket_delete_failed_${response.status}`);
        }

        return jsonResponse({ ok: true });
    } catch (error) {
        console.error('admin support DELETE failed:', error instanceof Error ? error.message : 'unknown');
        return jsonResponse({ ok: false, error: 'support_delete_failed' }, 500);
    }
}
