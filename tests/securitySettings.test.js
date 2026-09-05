import { describe, expect, it } from 'vitest';
import {
    getPrivacyPageChoices,
    normalizeSecurityPagePath,
    pickSecuritySettings,
} from '../app/admin/securitySettings';

describe('admin security settings', () => {
    it('normalizes privacy paths without queries or fragments', () => {
        expect(normalizeSecurityPagePath('clock/?source=test#result')).toBe('/clock');
        expect(normalizeSecurityPagePath('/')).toBe('/');
    });

    it('includes core pages and bilingual managed page names', () => {
        const choices = getPrivacyPageChoices([
            { slug: 'privacy', title: 'سياسة الخصوصية' },
            { slug: 'custom', title: 'مخصص', titleEn: 'Custom' },
        ]);

        expect(choices).toContainEqual({ path: '/privacy', title: 'سياسة الخصوصية', titleEn: 'Privacy Policy' });
        expect(choices).toContainEqual({ path: '/custom', title: 'مخصص', titleEn: 'Custom' });
    });

    it('keeps only privacy and page-name data needed by the security screen', () => {
        expect(pickSecuritySettings({
            privacySettingsButton: { enabled: true, pages: ['clock/'] },
            internalPages: [{ slug: 'privacy', title: 'الخصوصية' }],
            firebaseSecret: 'must-not-copy',
        })).toEqual({
            privacySettingsButton: { enabled: true, pages: ['/clock'] },
            internalPages: [{ slug: 'privacy', title: 'الخصوصية' }],
        });
    });
});
