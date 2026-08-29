import { describe, expect, it } from 'vitest';
import { getToolSettings, normalizeToolSettings, serializeToolSettings } from '../app/toolSettings';

describe('tool SEO settings', () => {
    it('preserves page and subtool share images across date, clock, and weather settings', () => {
        const datePageImageUrl = '/api/media/seo-share/2026/08/date-page.webp';
        const clockPageImageUrl = '/api/media/seo-share/2026/08/clock-page.webp';
        const weatherPageImageUrl = '/api/media/seo-share/2026/08/weather-page.webp';
        const durationImageUrl = '/api/media/seo-share/2026/08/duration-card.webp';
        const clockImageUrl = '/api/media/seo-share/2026/08/time-converter-card.webp';
        const weatherImageUrl = '/api/media/seo-share/2026/08/weather-search-card.webp';
        const settings = {
            date: {
                seo: { shareImageUrl: datePageImageUrl },
                subtoolSeo: {
                    durationCalc: { shareImageUrl: durationImageUrl },
                },
            },
            clock: {
                seo: { shareImageUrl: clockPageImageUrl },
                subtoolSeo: {
                    timeConverter: { shareImageUrl: clockImageUrl },
                },
            },
            weather: {
                seo: { shareImageUrl: weatherPageImageUrl },
                subtoolSeo: {
                    weatherSearch: { shareImageUrl: weatherImageUrl },
                },
            },
        };

        const normalized = normalizeToolSettings(settings);
        const serialized = serializeToolSettings(settings);

        expect(normalized.date.seo.shareImageUrl).toBe(datePageImageUrl);
        expect(serialized.date.seo.shareImageUrl).toBe(datePageImageUrl);
        expect(normalized.clock.seo.shareImageUrl).toBe(clockPageImageUrl);
        expect(serialized.clock.seo.shareImageUrl).toBe(clockPageImageUrl);
        expect(normalized.weather.seo.shareImageUrl).toBe(weatherPageImageUrl);
        expect(serialized.weather.seo.shareImageUrl).toBe(weatherPageImageUrl);
        expect(normalized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(durationImageUrl);
        expect(serialized.date.subtoolSeo.durationCalc.shareImageUrl).toBe(durationImageUrl);
        expect(normalized.clock.subtoolSeo.timeConverter.shareImageUrl).toBe(clockImageUrl);
        expect(serialized.clock.subtoolSeo.timeConverter.shareImageUrl).toBe(clockImageUrl);
        expect(normalized.weather.subtoolSeo.weatherSearch.shareImageUrl).toBe(weatherImageUrl);
        expect(serialized.weather.subtoolSeo.weatherSearch.shareImageUrl).toBe(weatherImageUrl);
        expect(normalized.date.subtoolSeo.ageCalc.shareImageUrl).toBe('');
    });

    it('keeps Arabic and English SEO separate while sharing canonical and images', () => {
        const config = {
            toolSettings: {
                date: {
                    seo: {
                        searchTitle: 'عنوان عربي',
                        canonical: '/',
                        shareImageUrl: '/api/media/seo-share/card.webp',
                    },
                    localizations: {
                        en: {
                            seo: { searchTitle: 'English title', h1: 'English heading' },
                            faqs: [{ q: 'English question?', a: 'English answer.' }],
                        },
                    },
                    faqs: [{ q: 'سؤال عربي؟', a: 'إجابة عربية.' }],
                },
            },
        };

        const arabic = getToolSettings(config, 'date', 'ar');
        const english = getToolSettings(config, 'date', 'en');

        expect(arabic.seo.searchTitle).toBe('عنوان عربي');
        expect(english.seo.searchTitle).toBe('English title');
        expect(english.seo.h1).toBe('English heading');
        expect(english.seo.canonical).toBe('/');
        expect(english.seo.shareImageUrl).toBe('/api/media/seo-share/card.webp');
        expect(arabic.faqs[0].q).toBe('سؤال عربي؟');
        expect(english.faqs[0].q).toBe('English question?');
        expect(serializeToolSettings(config.toolSettings).date.localizations.en.seo.searchTitle).toBe('English title');
        expect(serializeToolSettings(config.toolSettings).date.localizations.en.faqs[0].a).toBe('English answer.');
    });
});
