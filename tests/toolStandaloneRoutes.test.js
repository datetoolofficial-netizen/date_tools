import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    getToolSectionRouteBySlug,
    TOOL_SECTION_ROUTE_ENTRIES,
} from '../toolSectionRoutes';
import { DEFAULT_TOOL_SETTINGS } from '../app/toolSettings';
import {
    getArabicToolPath,
    getToolLanguageAlternates,
    getToolRouteLanguage,
    localizeToolPath,
} from '../app/localizedToolRoutes';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('standalone tool routes', () => {
    it('keeps nine stable public URLs mapped to their single tool sections', () => {
        const expectedTargets = {
            '/age-calculator': ['date', 'ageCalc', 'age-calculator'],
            '/date-converter': ['date', 'dateConverter', 'date-converter'],
            '/date-difference': ['date', 'durationCalc', 'date-difference'],
            '/time-converter': ['clock', 'timeConverter', 'time-converter'],
            '/timezone-difference': ['clock', 'timezoneDiff', 'timezone-difference'],
            '/weather-search': ['weather', 'weatherSearch', 'weather-search'],
            '/current-weather': ['weather', 'currentWeather', 'current-weather'],
            '/outdoor-advice': ['weather', 'outdoorAdvice', 'outdoor-advice'],
            '/weather-forecast': ['weather', 'forecast', 'weather-forecast'],
        };

        expect(TOOL_SECTION_ROUTE_ENTRIES).toHaveLength(9);
        Object.entries(expectedTargets).forEach(([publicPath, [toolKey, subtoolKey, sectionId]]) => {
            expect(getToolSectionRouteBySlug(publicPath)).toMatchObject({
                publicPath,
                toolKey,
                subtoolKey,
                sectionId,
            });
        });
    });

    it('preserves independent SEO records and canonical URLs in admin', () => {
        expect(DEFAULT_TOOL_SETTINGS.date.subtoolSeo.ageCalc.canonical).toBe('/age-calculator');
        expect(DEFAULT_TOOL_SETTINGS.clock.subtoolSeo.timeConverter.canonical).toBe('/time-converter');
        expect(DEFAULT_TOOL_SETTINGS.weather.subtoolSeo.currentWeather.canonical).toBe('/current-weather');

        const adminSource = readProjectFile('app', 'admin', 'tool-management', 'ToolContentSettings.jsx');
        expect(adminSource).toContain('Object.entries(defaults.subtoolSeo || {})');
        expect(adminSource).toContain('publicPath={TOOL_SECTION_ROUTES[toolKey]?.[subtoolKey]?.publicPath}');
    });

    it('renders each route as an indexable standalone tool instead of redirecting it', () => {
        const slugPage = readProjectFile('app', '[slug]', 'page.jsx');
        const middleware = readProjectFile('middleware.js');
        const siteShell = readProjectFile('app', 'SiteShell.jsx');

        expect(slugPage).toContain('getToolSectionRouteBySlug(slug)');
        expect(slugPage).toContain('buildManagedToolMetadata(toolRoute.toolKey, toolRoute.subtoolKey)');
        expect(slugPage).toContain('standaloneSectionId={toolRoute.sectionId}');
        expect(slugPage).toContain('buildManagedToolJsonLd(page)');
        expect(slugPage).toContain('<HomePageClient hideHero standaloneSectionId={toolRoute.sectionId} />');
        expect(slugPage).toContain('<ToolSeoContent tool="date" subtool={toolRoute.subtoolKey} />');
        expect(middleware).not.toContain('LEGACY_TOOL_SECTION_REDIRECTS');
        expect(middleware).not.toContain('legacyToolRoute');
        expect(siteShell).toContain('TOOL_SECTION_ROUTE_ENTRIES.find((route) => route.publicPath === publicPath)');
        expect(siteShell).toContain('toolSettings?.subtoolSeo?.[standaloneRoute.subtoolKey]');
    });

    it('limits family clients to the selected tool in standalone mode', () => {
        const dateClient = readProjectFile('app', 'HomePageClient.jsx');
        const clockClient = readProjectFile('app', 'clock', 'ClockPageClient.jsx');
        const weatherClient = readProjectFile('app', 'weather', 'WeatherPageClient.jsx');

        expect(dateClient).toContain("activeStandaloneSection === 'age-calculator'");
        expect(dateClient).toContain("activeStandaloneSection === 'date-converter'");
        expect(dateClient).toContain("activeStandaloneSection === 'date-difference'");
        expect(clockClient).toContain("activeStandaloneSection === 'time-converter'");
        expect(clockClient).toContain("activeStandaloneSection === 'timezone-difference'");
        expect(weatherClient).toContain("activeStandaloneSection === 'current-weather'");
        expect(weatherClient).toContain("activeStandaloneSection === 'outdoor-advice'");
        expect(weatherClient).toContain("activeStandaloneSection === 'weather-forecast'");
    });

    it('returns all standalone pages to sitemap with localized unique content', () => {
        const sitemap = readProjectFile('app', 'sitemap.js');
        const seoContent = readProjectFile('app', 'components', 'ToolSeoContent.jsx');

        expect(sitemap).toContain('const subtools = TOOL_SECTION_ROUTE_ENTRIES.map');
        expect(sitemap).toContain('return [...mainTools, ...subtools].flatMap');
        expect(sitemap).toContain("{ ...entry, path: paths.en, alternates: { languages } }");
        expect(seoContent).toContain('const subtoolContent =');
        expect(seoContent).toContain('subtoolContent[currentLang]?.[tool]?.[subtool]');
        expect(seoContent).toContain('كيف تستخدم حاسبة العمر؟');
        expect(seoContent).toContain('How to Use the Age Calculator');
        expect(seoContent).not.toContain('tool-related-links');
    });

    it('adds direct localized sibling links only to standalone tool pages', () => {
        const seoContent = readProjectFile('app', 'components', 'ToolSeoContent.jsx');

        expect(seoContent).toContain(".filter(([key]) => key !== subtool)");
        expect(seoContent).toContain('href: localizeToolPath(route.publicPath, currentLang)');
        expect(seoContent).toContain("title: 'أدوات مشابهة'");
        expect(seoContent).toContain("title: 'Similar Tools'");
        expect(seoContent).toContain('settings?.subtoolSeo?.[key]?.metaDescription');
        expect(seoContent).toContain('relatedTools.length > 0');
    });

    it('maps every tool page to a stable English counterpart', () => {
        expect(localizeToolPath('/', 'en')).toBe('/en');
        expect(localizeToolPath('/clock', 'en')).toBe('/en/clock');
        expect(localizeToolPath('/age-calculator', 'en')).toBe('/en/age-calculator');
        expect(localizeToolPath('/en/current-weather', 'ar')).toBe('/current-weather');
        expect(getArabicToolPath('/en/timezone-difference')).toBe('/timezone-difference');
        expect(getToolRouteLanguage('/en/weather')).toBe('en');
        expect(getToolRouteLanguage('/weather')).toBe('ar');
        expect(getToolRouteLanguage('/en/privacy')).toBe('');
        expect(getToolLanguageAlternates('/date-converter')).toEqual({
            ar: '/date-converter',
            en: '/en/date-converter',
        });
    });

    it('renders English family and standalone pages with localized metadata', () => {
        const englishFamily = readProjectFile('app', 'en', 'page.jsx');
        const englishStandalone = readProjectFile('app', 'en', '[slug]', 'page.jsx');
        const englishRenderer = readProjectFile('app', 'en', 'EnglishToolPage.jsx');
        const seoServer = readProjectFile('app', 'toolSeoServer.js');
        const siteShell = readProjectFile('app', 'SiteShell.jsx');

        expect(englishFamily).toContain("buildManagedToolMetadata('date', '', 'en')");
        expect(englishStandalone).toContain("buildManagedToolMetadata(route.toolKey, route.subtoolKey, 'en')");
        expect(englishStandalone).toContain('sectionId={route.sectionId}');
        expect(englishRenderer).toContain("getManagedToolPage(toolKey, subtoolKey, 'en')");
        expect(seoServer).toContain("'en-US': page.alternatePaths.en");
        expect(seoServer).toContain("'x-default': page.alternatePaths.ar");
        expect(siteShell).toContain('router.push(`${targetPath}${suffix}`)');
    });
});
