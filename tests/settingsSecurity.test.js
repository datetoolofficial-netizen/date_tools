import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('settings security boundaries', () => {
    it('reads public settings without falling back to the private document', () => {
        const source = readProjectFile('app', 'firestorePublicConfig.js');

        expect(source).toContain("fetchSettingsDocument('public'");
        expect(source).not.toContain("fetchSettingsDocument('main'");
    });

    it('keeps partial saves limited to the submitted section', () => {
        const source = readProjectFile('app', 'firebase.js');
        const start = source.indexOf('export async function saveSiteConfigSection');
        const end = source.indexOf('export async function', start + 1);
        const sectionSave = source.slice(start, end === -1 ? source.length : end);

        expect(sectionSave).toContain('const cleanPatch = { ...sectionPatch }');
        expect(sectionSave).not.toMatch(/adCampaigns\s*:\s*deleteField\(\)/);
        expect(sectionSave).not.toMatch(/adImages\s*:\s*deleteField\(\)/);
        expect(sectionSave).not.toMatch(/pages\s*:\s*deleteField\(\)/);
        expect(sectionSave).toContain('delete cleanPatch.adCampaigns');
    });

    it('fails closed for unknown admin roles and section permissions', () => {
        const rules = readProjectFile('firestore.rules');

        expect(rules).toContain('"platform_owner", "super_admin", "super-admin", "owner", "admin", "manager"');
        expect(rules).toContain('let platformRole = adminData().get("platformRole", "")');
        expect(rules).toContain('let resolvedRole = isKnownAdminRoleValue(platformRole)');
        expect(rules).toContain(': adminData().get("adminRole", "")');
        expect(rules).toContain('roleHasAdminPermission(adminRole(), permission)');
        expect(rules).toContain('affectedKeys().hasAny(["name", "platformRole", "role", "permissions"])');
        expect(rules).toContain('affectedKeys().hasAny(["active"])');
        expect(rules).toContain('request.resource.data.role == request.resource.data.platformRole');
        expect(rules).not.toContain('commonSettingsFields');
        expect(rules).toContain('changed.hasOnly(["toolSettings", "events"])');
        expect(rules).toContain('allow read: if documentId == "public" || isActiveAdmin();');
    });

    it('does not initialize App Check with a hardcoded interactive key', () => {
        const source = readProjectFile('app', 'firebase.js');

        expect(source).toContain('NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY');
        expect(source).toContain('if (!appCheckSiteKey) return null;');
        expect(source).not.toContain('6LcGrIwsAAAAAP5f-fzzMMmHVZzqtpC2OhslCe_3');
    });

    it('does not use regular expressions as an HTML sanitizer fallback', () => {
        const source = readProjectFile('app', 'sanitizeHtml.js');

        expect(source).toContain("typeof DOMParser === 'undefined') return ''");
        expect(source).not.toContain('.replace(/<script');
        expect(source).not.toContain('javascript:/gi');
    });

    it('filters public campaigns at the response boundary', () => {
        const source = readProjectFile('app', 'api', 'public-campaigns', 'route.js');

        expect(source).toContain("campaign.imageUrl.startsWith('/api/media/ads/')");
        expect(source).toContain("new URL(value).protocol === 'https:'");
        expect(source).not.toContain("views: getNumberField(fields, 'views')");
        expect(source).not.toContain("clicks: getNumberField(fields, 'clicks')");
    });

    it('binds audit events and advertiser uploads to action permissions', () => {
        const auditRoute = readProjectFile('app', 'api', 'admin', 'audit', 'route.js');
        const uploadRoute = readProjectFile('app', 'api', 'media', 'upload', 'route.js');

        expect(auditRoute).toContain('const AUDIT_ACTION_RULES = Object.freeze({');
        expect(auditRoute).toContain('actionRule.resourceType !== resourceType');
        expect(auditRoute).toContain('hasAdminPermission(profile, actionRule.permissions)');
        expect(uploadRoute).toContain("['owner', 'organization_admin', 'campaign_manager', 'campaign_editor'].includes(role)");
        expect(uploadRoute).toContain('!canAdvertiserUploadAds(uploader.profile)');
    });
});
