import { describe, expect, it } from 'vitest';
import { normalizeToolSettings, serializeToolSettings } from '../app/toolSettings';

describe('tool SEO settings', () => {
    it('preserves the duration calculator share image through normalization and serialization', () => {
        const shareImageUrl = '/api/media/seo-share/2026/08/duration-card.webp';
        const settings = {
            date: {
                subtoolSeo: {
                    durationCalc: { shareImageUrl },
                },
            },
        };

        const normalized = normalizeToolSettings(settings);
        const serialized = serializeToolSettings(settings);

        expect(normalized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(shareImageUrl);
        expect(serialized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(shareImageUrl);
        expect(normalized.date.subtoolSeo.ageCalc.shareImageUrl).toBe('');
    });
});
