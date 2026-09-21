import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { recordAdvertiserAudit } from '../app/advertiserAudit';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('sensitive operation audit coverage', () => {
    it('records advertiser activity through a verified server endpoint with allowlisted fields', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }));
        vi.stubGlobal('fetch', fetchMock);
        const user = { getIdToken: vi.fn().mockResolvedValue('test-id-token') };

        await expect(recordAdvertiserAudit({
            user,
            action: 'campaign.status_updated',
            resourceType: 'campaign',
            resourceId: 'campaign-1',
            details: { status: 'paused', secret: 'must-not-leave-browser' },
        })).resolves.toBe(true);

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('/api/client/audit');
        expect(init.headers.Authorization).toBe('Bearer test-id-token');
        expect(JSON.parse(init.body)).toEqual({
            action: 'campaign.status_updated',
            resourceType: 'campaign',
            resourceId: 'campaign-1',
            details: { status: 'paused' },
        });
    });

    it('verifies advertiser identity and restricts event shapes on the server', () => {
        const route = readProjectFile('app', 'api', 'client', 'audit', 'route.js');

        expect(route).toContain('verifyFirebaseIdToken');
        expect(route).toContain('getAdvertiserProfile');
        expect(route).toContain('ACTION_RESOURCES');
        expect(route).toContain('SAFE_RESOURCE_ID');
        expect(route).toContain('writeAdminAuditEvent');
        expect(route).not.toContain('password');
        expect(route).not.toContain('turnstileToken');
    });

    it.each([
        ['app/firebase.js', 'recordAdminAudit'],
        ['app/admin/ads/page.jsx', 'recordAdminAudit'],
        ['app/admin/advertisers/page.jsx', 'recordAdminAudit'],
        ['app/admin/team/page.jsx', 'recordAdminAudit'],
        ['app/client/page.jsx', 'recordAdvertiserAudit'],
        ['app/client/register/page.jsx', 'recordAdvertiserAudit'],
        ['app/client/ClientShell.jsx', 'recordAdvertiserAudit'],
        ['app/client/dashboard/page.jsx', 'recordAdvertiserAudit'],
        ['app/client/create-campaign/page.jsx', 'recordAdvertiserAudit'],
        ['app/client/team/page.jsx', 'recordAdvertiserAudit'],
        ['app/api/media/upload/route.js', 'writeAdminAuditEvent'],
        ['app/api/admin/support/route.js', 'writeAdminAuditEvent'],
        ['app/api/admin/cleanup/route.js', 'writeAdminAuditEvent'],
        ['app/api/admin/indexnow/route.js', 'writeAdminAuditEvent'],
    ])('keeps %s mutations connected to %s', (path, auditFunction) => {
        expect(readProjectFile(...path.split('/'))).toContain(auditFunction);
    });

    it('keeps audit records immutable to Firebase clients', () => {
        const rules = readProjectFile('firestore.rules');
        expect(rules).toMatch(/match \/audit_logs\/\{eventId\}[\s\S]*allow create, update, delete: if false;/);
    });
});
