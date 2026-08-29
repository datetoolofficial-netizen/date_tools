import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('HTTP security boundaries', () => {
    it('keeps the core browser security headers and internal noindex policy enabled', () => {
        const middleware = readProjectFile('middleware.js');

        expect(middleware).toContain("['X-Content-Type-Options', 'nosniff']");
        expect(middleware).toContain("['X-Frame-Options', 'DENY']");
        expect(middleware).toContain("['Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload']");
        expect(middleware).toContain("['Referrer-Policy', 'strict-origin-when-cross-origin']");
        expect(middleware).toContain("response.headers.set('Content-Security-Policy-Report-Only'");
        expect(middleware).toContain("response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')");
        expect(middleware).toContain("'/admin'");
        expect(middleware).toContain("'/client'");
        expect(middleware).toContain("'/api'");
    });

    it('does not expose support attachments through the public media categories', () => {
        const mediaValidation = readProjectFile('app', 'api', '_lib', 'mediaValidation.js');
        const publicMediaRoute = readProjectFile('app', 'api', 'media', '[...key]', 'route.js');
        const adminSupportRoute = readProjectFile('app', 'api', 'admin', 'support', 'route.js');

        expect(mediaValidation).not.toMatch(/^\s*['"]support['"],?\s*$/m);
        expect(publicMediaRoute).toContain('getSafeMediaCategory(category)');
        expect(adminSupportRoute).toContain("hasAdminPermission(profile, ['support', 'tickets'])");
        expect(adminSupportRoute).toContain("attachmentKey.startsWith('support/')");
        expect(adminSupportRoute).toContain("'Cache-Control': 'private, no-store, max-age=0'");
    });

    it('keeps media uploads authenticated and validates file contents before R2 writes', () => {
        const uploadRoute = readProjectFile('app', 'api', 'media', 'upload', 'route.js');

        expect(uploadRoute).toContain('verifyFirebaseIdToken');
        expect(uploadRoute).toContain('hasExpectedImageSignature');
        expect(uploadRoute).toContain('MAX_IMAGE_BYTES');
        expect(uploadRoute).toContain('crypto.randomUUID()');
        expect(uploadRoute).toContain("return jsonResponse({ ok: false, error: 'unsupported_image_type' }, 400)");
    });
});
