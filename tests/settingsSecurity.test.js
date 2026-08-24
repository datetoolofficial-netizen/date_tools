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

        expect(rules).toContain('"super_admin", "super-admin", "owner", "admin", "manager", "assistant", "helper", "مساعد"');
        expect(rules).toContain('return isKnownAdminRoleValue(primaryRole)');
        expect(rules).toContain(': adminData().get("adminRole", "")');
        expect(rules).not.toContain('!isAssistantAdmin()');
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

    it('filters public campaigns at the response boundary', () => {
        const source = readProjectFile('app', 'api', 'public-campaigns', 'route.js');

        expect(source).toContain("campaign.imageUrl.startsWith('/api/media/ads/')");
        expect(source).toContain("new URL(value).protocol === 'https:'");
        expect(source).not.toContain("views: getNumberField(fields, 'views')");
        expect(source).not.toContain("clicks: getNumberField(fields, 'clicks')");
    });
});
