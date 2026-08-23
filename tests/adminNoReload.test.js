import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function collectSourceFiles(directory) {
    return readdirSync(directory).flatMap((entry) => {
        const fullPath = join(directory, entry);
        if (statSync(fullPath).isDirectory()) return collectSourceFiles(fullPath);
        return /\.(js|jsx)$/.test(entry) ? [fullPath] : [];
    });
}

describe('admin save and upload flows', () => {
    it('do not hard-refresh admin pages after saving or uploading', () => {
        const files = collectSourceFiles(join(process.cwd(), 'app', 'admin'));
        const forbiddenReloads = /(?:router\.refresh|location\.reload|window\.location\.href|document\.location)/;

        for (const file of files) {
            expect(readFileSync(file, 'utf8'), file).not.toMatch(forbiddenReloads);
        }
    });

    it('keeps identity consolidated in tool settings without the retired link preview UI', () => {
        const adminShell = readFileSync(join(process.cwd(), 'app', 'admin', 'AdminShell.jsx'), 'utf8');
        const identityPage = readFileSync(join(process.cwd(), 'app', 'admin', 'identity', 'page.jsx'), 'utf8');
        const identitySections = readFileSync(join(process.cwd(), 'app', 'admin', 'tools', 'IdentitySettingsSections.jsx'), 'utf8');
        const toolContent = readFileSync(join(process.cwd(), 'app', 'admin', 'tool-management', 'ToolContentSettings.jsx'), 'utf8');

        expect(adminShell).not.toContain("href: '/admin/identity'");
        expect(identityPage).toContain("redirect('/admin/tools#identity-basic-settings')");
        expect(identitySections).not.toContain('link-preview');
        expect(identitySections).not.toContain('linkPreview');
        expect(toolContent).not.toContain('tool-subtools-list');
    });

    it('keeps tool settings second in every remaining admin navigation definition', () => {
        const navigationFiles = [
            ['app', 'admin', 'AdminShell.jsx'],
            ['app', 'admin', 'page.jsx'],
            ['app', 'admin', 'ad-settings', 'page.jsx'],
            ['app', 'admin', 'ads', 'page.jsx'],
            ['app', 'admin', 'integrations', 'page.jsx'],
            ['app', 'admin', 'pagespeed', 'page.jsx'],
            ['app', 'admin', 'tools', 'page.jsx'],
        ];

        navigationFiles.forEach((segments) => {
            const file = join(process.cwd(), ...segments);
            const source = readFileSync(file, 'utf8');
            const toolsIndex = source.indexOf('/admin/tools');
            const integrationsIndex = source.indexOf('/admin/integrations');

            expect(toolsIndex, file).toBeGreaterThan(-1);
            expect(integrationsIndex, file).toBeGreaterThan(toolsIndex);
            expect(source, file).not.toContain('/admin/identity');
        });
    });
});
