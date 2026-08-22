import { describe, expect, it } from 'vitest';
import {
    getAllowedImageInfo,
    getSafeMediaCategory,
    hasExpectedImageSignature,
    MAX_IMAGE_BYTES,
} from '../app/api/_lib/mediaValidation';

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
        const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
        expect(hasExpectedImageSignature(png, 'image/png')).toBe(true);
        expect(hasExpectedImageSignature(new Uint8Array(12), 'image/png')).toBe(false);
    });

    it('rejects unsupported content types', () => {
        expect(getAllowedImageInfo({ name: 'payload.svg', type: 'image/svg+xml' })).toBeNull();
    });
});
