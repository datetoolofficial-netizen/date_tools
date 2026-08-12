import { describe, expect, it } from 'vitest';
import { pickPublicSiteConfig } from '../app/publicSiteConfig';

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
});
