import { describe, expect, it } from 'vitest';
import { normalizeToolSettings, serializeToolSettings } from '../app/toolSettings';

describe('tool SEO settings', () => {
    it('preserves subtool share images across date, clock, and weather settings', () => {
        const durationImageUrl = '/api/media/seo-share/2026/08/duration-card.webp';
        const clockImageUrl = '/api/media/seo-share/2026/08/time-converter-card.webp';
        const weatherImageUrl = '/api/media/seo-share/2026/08/weather-search-card.webp';
        const settings = {
            date: {
                subtoolSeo: {
                    durationCalc: { shareImageUrl: durationImageUrl },
                },
            },
            clock: {
                subtoolSeo: {
                    timeConverter: { shareImageUrl: clockImageUrl },
                },
            },
            weather: {
                subtoolSeo: {
                    weatherSearch: { shareImageUrl: weatherImageUrl },
                },
            },
        };

        const normalized = normalizeToolSettings(settings);
        const serialized = serializeToolSettings(settings);

        expect(normalized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(durationImageUrl);
        expect(serialized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(durationImageUrl);
        expect(normalized.clock.subtoolSeo.timeConverter.shareImageUrl).toBe(clockImageUrl);
        expect(serialized.clock.subtoolSeo.timeConverter.shareImageUrl).toBe(clockImageUrl);
        expect(normalized.weather.subtoolSeo.weatherSearch.shareImageUrl).toBe(weatherImageUrl);
        expect(serialized.weather.subtoolSeo.weatherSearch.shareImageUrl).toBe(weatherImageUrl);
        expect(normalized.date.subtoolSeo.ageCalc.shareImageUrl).toBe('');
    });
});
