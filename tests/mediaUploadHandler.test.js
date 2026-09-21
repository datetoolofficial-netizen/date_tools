import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { processAuthorizedMediaUpload } from '../app/api/_lib/mediaUploadHandler';

function fixture(name) {
    return readFileSync(join(process.cwd(), 'tests', 'fixtures', 'upload-security', name));
}

function validPng(width = 16, height = 16) {
    const bytes = new Uint8Array(24);
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    bytes.set([0x49, 0x48, 0x44, 0x52], 12);
    new DataView(bytes.buffer).setUint32(16, width);
    new DataView(bytes.buffer).setUint32(20, height);
    return bytes;
}

function requestWithFile({ bytes = validPng(), name = 'campaign.png', type = 'image/png', category = 'ads' } = {}) {
    const formData = new FormData();
    formData.set('category', category);
    formData.set('file', new File([bytes], name, { type }));
    return new Request('https://test.invalid/api/media/upload', { method: 'POST', body: formData });
}

function adminUploader(role = 'platform_owner') {
    return {
        type: 'admin',
        uid: 'admin-test',
        email: 'admin@example.test',
        profile: {
            active: { booleanValue: true },
            platformRole: { stringValue: role },
        },
    };
}

function advertiserUploader(role = 'campaign_manager') {
    return {
        type: 'advertiser',
        uid: 'advertiser-test',
        email: 'advertiser@example.test',
        profile: {
            status: { stringValue: 'active' },
            role: { stringValue: role },
        },
    };
}

async function runUpload({ request, uploader }) {
    const bucket = { put: vi.fn().mockResolvedValue(undefined) };
    const writeAuditEvent = vi.fn().mockResolvedValue(undefined);
    const response = await processAuthorizedMediaUpload({ request, uploader, bucket, writeAuditEvent });
    return { response, body: await response.json(), bucket, writeAuditEvent };
}

describe('isolated media upload handler', () => {
    it('stores a validated admin image with safe metadata and an audit event', async () => {
        const result = await runUpload({
            request: requestWithFile({ category: 'logo', name: '../../Brand Logo.PNG' }),
            uploader: adminUploader(),
        });

        expect(result.response.status).toBe(200);
        expect(result.body).toMatchObject({ ok: true, contentType: 'image/png', size: 24 });
        expect(result.body.key).toMatch(/^logo\/\d{4}\/\d{2}\/[0-9a-f-]+-brand-logo\.png$/);
        expect(result.body.url).toBe(`/api/media/${result.body.key}`);
        expect(result.bucket.put).toHaveBeenCalledTimes(1);
        expect(result.bucket.put.mock.calls[0][2]).toMatchObject({
            httpMetadata: { contentType: 'image/png' },
            customMetadata: { category: 'logo', uploadedBy: 'admin-test', uploaderType: 'admin' },
        });
        expect(result.writeAuditEvent).toHaveBeenCalledWith(expect.objectContaining({
            action: 'media.uploaded',
            resourceId: result.body.key,
        }));
    });

    it.each([
        ['fake-image.jpg', 'application/octet-stream', 'invalid_image_content'],
        ['active-content.html', 'text/html', 'unsupported_image_type'],
        ['active-content.svg', 'image/svg+xml', 'unsupported_image_type'],
        ['fake-executable.exe', 'application/octet-stream', 'unsupported_image_type'],
    ])('rejects %s before storage or auditing', async (name, type, error) => {
        const result = await runUpload({
            request: requestWithFile({ bytes: fixture(name), name, type }),
            uploader: advertiserUploader(),
        });

        expect(result.response.status).toBe(400);
        expect(result.body).toEqual({ ok: false, error });
        expect(result.bucket.put).not.toHaveBeenCalled();
        expect(result.writeAuditEvent).not.toHaveBeenCalled();
    });

    it('rejects excessive dimensions before storage', async () => {
        const result = await runUpload({
            request: requestWithFile({ bytes: validPng(9000, 1) }),
            uploader: advertiserUploader(),
        });

        expect(result.response.status).toBe(400);
        expect(result.body).toEqual({ ok: false, error: 'invalid_image_dimensions' });
        expect(result.bucket.put).not.toHaveBeenCalled();
    });

    it('limits advertisers to ads and roles that can edit campaigns', async () => {
        const forbiddenRole = await runUpload({
            request: requestWithFile(),
            uploader: advertiserUploader('analyst'),
        });
        expect(forbiddenRole.response.status).toBe(403);
        expect(forbiddenRole.bucket.put).not.toHaveBeenCalled();

        const forbiddenCategory = await runUpload({
            request: requestWithFile({ category: 'logo' }),
            uploader: advertiserUploader('owner'),
        });
        expect(forbiddenCategory.response.status).toBe(403);
        expect(forbiddenCategory.bucket.put).not.toHaveBeenCalled();
    });

    it('allows an authorized advertiser to upload only a valid ad image', async () => {
        const result = await runUpload({
            request: requestWithFile(),
            uploader: advertiserUploader('campaign_editor'),
        });

        expect(result.response.status).toBe(200);
        expect(result.body.key).toMatch(/^ads\//);
        expect(result.bucket.put).toHaveBeenCalledTimes(1);
    });

    it('rejects unknown categories and read-only admin roles', async () => {
        const invalidCategory = await runUpload({
            request: requestWithFile({ category: '../ads' }),
            uploader: adminUploader(),
        });
        expect(invalidCategory.response.status).toBe(400);
        expect(invalidCategory.bucket.put).not.toHaveBeenCalled();

        const readOnlyAdmin = await runUpload({
            request: requestWithFile({ category: 'logo' }),
            uploader: adminUploader('auditor'),
        });
        expect(readOnlyAdmin.response.status).toBe(403);
        expect(readOnlyAdmin.bucket.put).not.toHaveBeenCalled();
    });
});
