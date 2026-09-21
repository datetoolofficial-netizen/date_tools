import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    getAllowedImageInfo,
    getImageDimensions,
    getSafeMediaCategory,
    hasExpectedImageSignature,
    MAX_IMAGE_DIMENSION,
    MAX_IMAGE_BYTES,
    validateImageUpload,
} from '../app/api/_lib/mediaValidation';

function fixture(name) {
    return new Uint8Array(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'upload-security', name)));
}

describe('R2 media validation', () => {
    it('limits uploads to known buckets and size', () => {
        expect(getSafeMediaCategory('ads')).toBe('ads');
        expect(getSafeMediaCategory('seo-share')).toBe('seo-share');
        expect(getSafeMediaCategory('../support')).toBe('');
        expect(MAX_IMAGE_BYTES).toBe(5 * 1024 * 1024);
    });

    it('allows approved image formats and validates magic bytes', () => {
        expect(getAllowedImageInfo({ name: 'photo.png', type: 'image/png' })).toEqual({
            extension: 'png', contentType: 'image/png',
        });
        const png = validPngHeader(1, 1);
        expect(hasExpectedImageSignature(png, 'image/png')).toBe(true);
        expect(hasExpectedImageSignature(new Uint8Array(12), 'image/png')).toBe(false);
    });

    it('rejects unsupported content types', () => {
        expect(getAllowedImageInfo({ name: 'payload.svg', type: 'image/svg+xml' })).toBeNull();
    });

    it.each([
        ['fake-image.jpg', 'application/octet-stream', 'invalid_image_content'],
        ['active-content.html', 'text/html', 'unsupported_image_type'],
        ['active-content.svg', 'image/svg+xml', 'unsupported_image_type'],
        ['fake-executable.exe', 'application/octet-stream', 'unsupported_image_type'],
    ])('rejects the harmless security fixture %s before storage', (name, type, error) => {
        const bytes = fixture(name);
        expect(validateImageUpload({ name, type, size: bytes.byteLength }, bytes)).toEqual({ ok: false, error });
    });

    it('returns validated bytes metadata only for a genuine supported signature', () => {
        const bytes = validPngHeader(320, 180);
        expect(validateImageUpload({ name: 'safe.png', type: 'image/png', size: bytes.byteLength }, bytes)).toEqual({
            ok: true,
            imageInfo: { extension: 'png', contentType: 'image/png' },
            dimensions: { width: 320, height: 180 },
        });
    });

    it('rejects missing, zero, and excessive image dimensions', () => {
        const signatureOnly = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
        expect(validateImageUpload({ name: 'short.png', type: 'image/png', size: signatureOnly.byteLength }, signatureOnly))
            .toEqual({ ok: false, error: 'invalid_image_dimensions' });

        const tooWide = validPngHeader(MAX_IMAGE_DIMENSION + 1, 1);
        expect(validateImageUpload({ name: 'wide.png', type: 'image/png', size: tooWide.byteLength }, tooWide))
            .toEqual({ ok: false, error: 'invalid_image_dimensions' });
        expect(getImageDimensions(validPngHeader(0, 10), 'image/png')).toEqual({ width: 0, height: 10 });
    });

    it('reads dimensions from every allowed image family', () => {
        const gif = new Uint8Array(10);
        gif.set(new TextEncoder().encode('GIF89a'), 0);
        new DataView(gif.buffer).setUint16(6, 40, true);
        new DataView(gif.buffer).setUint16(8, 30, true);
        expect(getImageDimensions(gif, 'image/gif')).toEqual({ width: 40, height: 30 });

        const ico = new Uint8Array([0, 0, 1, 0, 1, 0, 32, 24]);
        expect(getImageDimensions(ico, 'image/x-icon')).toEqual({ width: 32, height: 24 });

        const jpeg = new Uint8Array(21);
        jpeg.set([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x10, 0x00, 0x20], 0);
        expect(getImageDimensions(jpeg, 'image/jpeg')).toEqual({ width: 32, height: 16 });

        const webp = new Uint8Array(30);
        webp.set(new TextEncoder().encode('RIFF'), 0);
        webp.set(new TextEncoder().encode('WEBP'), 8);
        webp.set(new TextEncoder().encode('VP8X'), 12);
        webp.set([63, 0, 0], 24);
        webp.set([31, 0, 0], 27);
        expect(getImageDimensions(webp, 'image/webp')).toEqual({ width: 64, height: 32 });
    });

    it('rejects empty and oversized files before inspecting their content', () => {
        expect(validateImageUpload({ name: 'empty.png', type: 'image/png', size: 0 }, new Uint8Array()))
            .toEqual({ ok: false, error: 'invalid_file_size' });
        expect(validateImageUpload(
            { name: 'large.png', type: 'image/png', size: MAX_IMAGE_BYTES + 1 },
            validPngHeader(1, 1)
        )).toEqual({ ok: false, error: 'invalid_file_size' });
    });
});

function validPngHeader(width, height) {
    const bytes = new Uint8Array(24);
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    bytes.set([0x49, 0x48, 0x44, 0x52], 12);
    new DataView(bytes.buffer).setUint32(16, width);
    new DataView(bytes.buffer).setUint32(20, height);
    return bytes;
}
