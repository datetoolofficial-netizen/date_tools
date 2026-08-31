import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    LEGACY_TOOL_SECTION_REDIRECTS,
    TOOL_SECTION_ROUTE_ENTRIES,
} from '../toolSectionRoutes';
import { DEFAULT_TOOL_SETTINGS } from '../app/toolSettings';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('tool route consolidation', () => {
    it('keeps the nine public SEO paths while targeting sections on three parent pages', () => {
        const expectedTargets = {
            '/age-calculator': ['/', 'age-calculator'],
            '/date-converter': ['/', 'date-converter'],
            '/date-difference': ['/', 'date-difference'],
            '/time-converter': ['/clock', 'time-converter'],
            '/timezone-difference': ['/clock', 'timezone-difference'],
            '/weather-search': ['/weather', 'weather-search'],
            '/current-weather': ['/weather', 'current-weather'],
            '/outdoor-advice': ['/weather', 'outdoor-advice'],
            '/weather-forecast': ['/weather', 'weather-forecast'],
        };

        expect(TOOL_SECTION_ROUTE_ENTRIES).toHaveLength(9);
        Object.entries(expectedTargets).forEach(([publicPath, [pagePath, sectionId]]) => {
            expect(LEGACY_TOOL_SECTION_REDIRECTS[publicPath]).toMatchObject({
                publicPath,
                legacyPath: publicPath,
                pagePath,
                sectionId,
            });
        });
    });

    it('preserves subtool SEO fields and their original canonical paths', () => {
        expect(DEFAULT_TOOL_SETTINGS.date.subtoolSeo.ageCalc.canonical).toBe('/age-calculator');
        expect(DEFAULT_TOOL_SETTINGS.clock.subtoolSeo.timeConverter.canonical).toBe('/time-converter');
        expect(DEFAULT_TOOL_SETTINGS.weather.subtoolSeo.currentWeather.canonical).toBe('/current-weather');

        const adminSource = readProjectFile('app', 'admin', 'tool-management', 'ToolContentSettings.jsx');
        expect(adminSource).toContain('Object.entries(defaults.subtoolSeo || {})');
        expect(adminSource).toContain('publicPath={TOOL_SECTION_ROUTES[toolKey]?.[subtoolKey]?.publicPath}');
    });

    it('removes standalone rendering, sitemap entries, and the related-tools section', () => {
        const slugPage = readProjectFile('app', '[slug]', 'page.jsx');
        const sitemap = readProjectFile('app', 'sitemap.js');
        const seoContent = readProjectFile('app', 'components', 'ToolSeoContent.jsx');

        expect(slugPage).not.toContain('getToolSectionRouteBySlug');
        expect(slugPage).not.toContain('initialSectionId={toolRoute.sectionId}');
        expect(sitemap).not.toContain('const subtools =');
        expect(sitemap).not.toContain('TOOL_SECTION_ROUTE_ENTRIES');
        expect(seoContent).not.toContain('أدوات مرتبطة');
        expect(seoContent).not.toContain('Related tools');
        expect(seoContent).not.toContain('tool-related-links');
    });

    it('implements permanent redirects that carry the target section hash', () => {
        const middleware = readProjectFile('middleware.js');

        expect(middleware).toContain('LEGACY_TOOL_SECTION_REDIRECTS[pathname]');
        expect(middleware).toContain('url.pathname = legacyToolRoute.pagePath');
        expect(middleware).toContain('url.hash = legacyToolRoute.sectionId');
        expect(middleware).toContain('NextResponse.redirect(url, 308)');
    });
});
