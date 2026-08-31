export const TOOL_SECTION_ROUTES = Object.freeze({
    date: Object.freeze({
        ageCalc: Object.freeze({ legacyPath: '/age-calculator', publicPath: '/age-calculator', pagePath: '/', sectionId: 'age-calculator' }),
        dateConverter: Object.freeze({ legacyPath: '/date-converter', publicPath: '/date-converter', pagePath: '/', sectionId: 'date-converter' }),
        durationCalc: Object.freeze({ legacyPath: '/date-difference', publicPath: '/date-difference', pagePath: '/', sectionId: 'date-difference' }),
    }),
    clock: Object.freeze({
        timeConverter: Object.freeze({ legacyPath: '/time-converter', publicPath: '/time-converter', pagePath: '/clock', sectionId: 'time-converter' }),
        timezoneDiff: Object.freeze({ legacyPath: '/timezone-difference', publicPath: '/timezone-difference', pagePath: '/clock', sectionId: 'timezone-difference' }),
    }),
    weather: Object.freeze({
        weatherSearch: Object.freeze({ legacyPath: '/weather-search', publicPath: '/weather-search', pagePath: '/weather', sectionId: 'weather-search' }),
        currentWeather: Object.freeze({ legacyPath: '/current-weather', publicPath: '/current-weather', pagePath: '/weather', sectionId: 'current-weather' }),
        outdoorAdvice: Object.freeze({ legacyPath: '/outdoor-advice', publicPath: '/outdoor-advice', pagePath: '/weather', sectionId: 'outdoor-advice' }),
        forecast: Object.freeze({ legacyPath: '/weather-forecast', publicPath: '/weather-forecast', pagePath: '/weather', sectionId: 'weather-forecast' }),
    }),
});

export const TOOL_SECTION_ROUTE_ENTRIES = Object.freeze(
    Object.entries(TOOL_SECTION_ROUTES).flatMap(([toolKey, routes]) => (
        Object.entries(routes).map(([subtoolKey, route]) => Object.freeze({
            toolKey,
            subtoolKey,
            ...route,
        }))
    ))
);

export function getToolSectionRouteBySlug(slug = '') {
    const publicPath = `/${String(slug).trim().replace(/^\/+|\/+$/g, '')}`;
    return TOOL_SECTION_ROUTE_ENTRIES.find((route) => route.publicPath === publicPath) || null;
}
