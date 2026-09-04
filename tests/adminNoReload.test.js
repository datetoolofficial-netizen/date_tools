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

    it('keeps tool settings second in remaining legacy navigation definitions', () => {
        const navigationFiles = [
            ['app', 'admin', 'AdminShell.jsx'],
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

    it('keeps rebuilt admin pages inside the shared shell without duplicate navigation', () => {
        const adminShell = readFileSync(join(process.cwd(), 'app', 'admin', 'AdminShell.jsx'), 'utf8');
        const contentPages = [
            ['app', 'admin', 'page.jsx'],
            ['app', 'admin', 'ad-settings', 'page.jsx'],
        ];

        expect(adminShell).toContain("href: '/admin/ad-settings'");

        contentPages.forEach((segments) => {
            const file = join(process.cwd(), ...segments);
            const source = readFileSync(file, 'utf8');

            expect(source, file).not.toContain('legacy-sidebar');
            expect(source, file).not.toContain('legacy-top-nav');
            expect(source, file).not.toContain('legacy-main-wrapper');
        });
    });

    it('keeps backup and restore as paid-plan reminders without executable operations', () => {
        const toolsPage = readFileSync(join(process.cwd(), 'app', 'admin', 'tools', 'page.jsx'), 'utf8');
        const reminderSection = toolsPage.match(/<section className="legacy-google-card tools-section-card tools-backup-reminder"[\s\S]*?<\/section>/)?.[0] || '';

        expect(reminderSection).toContain('نسخ احتياطي');
        expect(reminderSection).toContain('استعادة');
        expect(reminderSection).toContain('يجب الاشتراك في الخطة المدفوعة');
        expect(reminderSection).not.toMatch(/fetch\(|saveSiteConfigSection|firebaseApiRef|router\./);
    });

    it('keeps the installed-app update notice controlled by a versioned admin setting', () => {
        const identitySections = readFileSync(join(process.cwd(), 'app', 'admin', 'tools', 'IdentitySettingsSections.jsx'), 'utf8');
        const updatePrompt = readFileSync(join(process.cwd(), 'app', 'components', 'PwaUpdatePrompt.jsx'), 'utf8');

        expect(identitySections).toContain('pwaUpdatePrompt');
        expect(identitySections).toContain('إعلان تحديث للتطبيقات المثبّتة');
        expect(identitySections).toContain('{APP_VERSION}');
        expect(identitySections).not.toContain("version: event.target.value");
        expect(updatePrompt).toContain('(display-mode: standalone)');
        expect(updatePrompt).toContain('UPDATE_SEEN_KEY');
    });

    it('edits bilingual FAQs, events, and share templates without translating the admin frame', () => {
        const toolContent = readFileSync(join(process.cwd(), 'app', 'admin', 'tool-management', 'ToolContentSettings.jsx'), 'utf8');
        const dateEvents = readFileSync(join(process.cwd(), 'app', 'admin', 'tool-management', 'date', 'page.jsx'), 'utf8');
        const toolsPage = readFileSync(join(process.cwd(), 'app', 'admin', 'tools', 'page.jsx'), 'utf8');
        const publicPage = readFileSync(join(process.cwd(), 'app', '[slug]', 'PageClient.jsx'), 'utf8');

        expect(toolContent).toContain('السؤال بالعربية');
        expect(toolContent).toContain('Question in English');
        expect(toolContent).toContain('نص المشاركة بالعربية');
        expect(toolContent).toContain('Share text in English');
        expect(toolContent).toContain('inputLanguage={contentLanguage}');
        expect(toolContent).not.toContain("searchTitle: 'Search result title'");
        expect(dateEvents).toContain('اسم الحدث بالعربية');
        expect(dateEvents).toContain('Event name in English');
        expect(dateEvents).toContain('nameEn');
        expect(toolsPage).toContain('لغة محتوى الصفحة');
        expect(toolsPage).toContain("language === 'en' ? 'contentEn' : 'content'");
        expect(publicPage).toContain('page?.contentEn');
        expect(publicPage).toContain('useSiteContext()');
    });

    it('relocalizes calculated date and clock results when the public language changes', () => {
        const homePage = readFileSync(join(process.cwd(), 'app', 'HomePageClient.jsx'), 'utf8');
        const clockPage = readFileSync(join(process.cwd(), 'app', 'clock', 'ClockPageClient.jsx'), 'utf8');

        expect(homePage).toContain('relocalizeResultRef.current()');
        expect(homePage).toContain("actions[activeResultRef.current]?.({ relocalize: true })");
        expect(clockPage).toContain('setConvertedTime((current) => current ? previewTime : current)');
        expect(clockPage).toContain('getDifferenceText(timezoneDiff.diff, lang)');
    });
});
