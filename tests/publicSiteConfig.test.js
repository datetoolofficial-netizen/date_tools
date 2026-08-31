import { describe, expect, it } from 'vitest';
import { pickPublicSiteConfig } from '../app/publicSiteConfig';
import { getLocalizedSiteConfig } from '../app/localizedConfig';
import { normalizePwaUpdatePrompt } from '../app/pwaPromptSettings';

describe('public settings projection', () => {
    it('keeps public integrations and removes executable snippets', () => {
        const projected = pickPublicSiteConfig({
            toolDisplayName: 'Tools',
            googleAdSlots: {
                dateTop: {
                    client: 'ca-pub-123456789012',
                    slot: '1234567890',
                    format: 'auto',
                    enabledWhenNoAdvertiser: true,
                    htmlSnippet: '<script>unsafe</script>',
                    privateToken: 'secret',
                },
            },
            externalIntegrations: {
                googleTagId: 'G-TEST',
                adsTxtSnippet: 'pub-id',
                adsenseSnippet: '<script>unsafe</script>',
                privateToken: 'secret',
            },
        });

        expect(projected.toolDisplayName).toBe('Tools');
        expect(projected.externalIntegrations.googleTagId).toBe('G-TEST');
        expect(projected.externalIntegrations.adsTxtSnippet).toBe('pub-id');
        expect(projected.externalIntegrations).not.toHaveProperty('adsenseSnippet');
        expect(projected.externalIntegrations).not.toHaveProperty('privateToken');
        expect(projected.googleAdSlots.dateTop).toMatchObject({
            client: 'ca-pub-123456789012',
            slot: '1234567890',
            format: 'auto',
            enabledWhenNoAdvertiser: true,
        });
        expect(projected.googleAdSlots.dateTop).not.toHaveProperty('htmlSnippet');
        expect(projected.googleAdSlots.dateTop).not.toHaveProperty('privateToken');
    });

    it('drops private top-level fields and private nested values', () => {
        const projected = pickPublicSiteConfig({
            toolDisplayName: 'Tools',
            adminEmail: 'owner@example.com',
            adminRole: 'super_admin',
            serviceAccount: { privateKey: 'secret' },
            adCampaigns: [{ advertiserEmail: 'private@example.com' }],
            externalIntegrations: {
                googleTagId: 'G-TEST',
                privateToken: 'secret',
                apiSecret: 'secret',
            },
            internalPages: [{
                title: 'Privacy',
                slug: 'privacy',
                content: '<p>Public content</p>',
                privateNotes: 'internal only',
            }],
        });

        expect(projected).not.toHaveProperty('adminEmail');
        expect(projected).not.toHaveProperty('adminRole');
        expect(projected).not.toHaveProperty('serviceAccount');
        expect(projected.adCampaigns).toEqual([]);
        expect(projected.externalIntegrations).not.toHaveProperty('privateToken');
        expect(projected.externalIntegrations).not.toHaveProperty('apiSecret');
        expect(projected.internalPages[0]).not.toHaveProperty('content');
        expect(projected.internalPages[0]).not.toHaveProperty('privateNotes');
    });

    it('includes managed page content only when explicitly requested', () => {
        const config = {
            internalPages: [{
                title: 'Privacy',
                slug: 'privacy',
                content: '<p>Public content</p>',
                privateNotes: 'internal only',
            }],
            customPages: {
                privacy: { title: 'Privacy', content: '<p>Public content</p>' },
            },
            pages: {
                legacy: { title: 'Legacy', content: '<p>Legacy content</p>' },
            },
        };

        const metadataProjection = pickPublicSiteConfig(config);
        const contentProjection = pickPublicSiteConfig(config, true);

        expect(metadataProjection).not.toHaveProperty('customPages');
        expect(metadataProjection).not.toHaveProperty('pages');
        expect(metadataProjection.internalPages[0]).not.toHaveProperty('content');
        expect(contentProjection.internalPages[0]).toMatchObject({
            title: 'Privacy',
            slug: 'privacy',
            content: '<p>Public content</p>',
        });
        expect(contentProjection.internalPages[0]).not.toHaveProperty('privateNotes');
        expect(contentProjection.customPages.privacy.content).toBe('<p>Public content</p>');
    });

    it('publishes only supported identity translations and selects English safely', () => {
        const projected = pickPublicSiteConfig({
            toolDisplayName: 'أدوات التاريخ',
            identityTranslations: {
                en: {
                    toolDisplayName: 'Date Tools',
                    toolSlogan: 'Calculate and convert dates',
                    privateToken: 'must-not-leak',
                },
            },
        });

        expect(projected.identityTranslations.en.toolDisplayName).toBe('Date Tools');
        expect(projected.identityTranslations.en).not.toHaveProperty('privateToken');
        expect(getLocalizedSiteConfig(projected, 'en').toolDisplayName).toBe('Date Tools');
        expect(getLocalizedSiteConfig(projected, 'ar').toolDisplayName).toBe('أدوات التاريخ');
    });

    it('localizes identity, install instructions, and managed navigation names', () => {
        const projected = pickPublicSiteConfig({
            toolDisplayName: 'الأدوات الشاملة',
            toolSlogan: 'كل الأدوات بين يديك',
            identityTranslations: {},
            internalPages: [
                { title: 'سياسة الخصوصية', titleEn: 'Privacy Policy', slug: 'privacy', enabled: true },
                { title: 'جدول الأشهر', titleEn: 'جدول الأشهر', slug: 'month-names', enabled: true },
            ],
            externalLinks: [{ title: 'الدعم', titleEn: 'Support', url: 'https://example.com' }],
            pwaInstallPrompt: { text: 'تثبيت', buttonText: 'ثبّت' },
        });
        const english = getLocalizedSiteConfig(projected, 'en');

        expect(english.toolDisplayName).toBe('Comprehensive Tools');
        expect(english.toolSlogan).toBe('All tools at your fingertips');
        expect(english.internalPages[0].title).toBe('Privacy Policy');
        expect(english.internalPages[1].title).toBe('Months Table');
        expect(english.externalLinks[0].title).toBe('Support');
        expect(english.pwaInstallPrompt.manualInstructions).toContain('Add to Home Screen');
        expect(projected.internalPages[0].enabled).toBe(true);
    });

    it('publishes only the safe PWA update announcement fields', () => {
        const projected = pickPublicSiteConfig({
            pwaUpdatePrompt: {
                enabled: true,
                version: '0.3.38<script>',
                privateToken: 'must-not-leak',
            },
        });

        expect(projected.pwaUpdatePrompt).toEqual({ enabled: true, version: '0.3.47', schemaVersion: 2 });
        expect(projected.pwaUpdatePrompt).not.toHaveProperty('privateToken');
        expect(normalizePwaUpdatePrompt({ enabled: false, version: '' }).enabled).toBe(true);
        expect(normalizePwaUpdatePrompt({ enabled: false, schemaVersion: 2 }).enabled).toBe(false);
        expect(normalizePwaUpdatePrompt({ enabled: true, version: 'stale-version' }).version).toBe('0.3.47');
    });
});
