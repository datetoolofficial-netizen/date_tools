export const TOOL_SECTION_ROUTES = Object.freeze({
    date: Object.freeze({
        ageCalc: Object.freeze({ publicPath: '/age-calculator', pagePath: '/', sectionId: 'age-calculator' }),
        dateConverter: Object.freeze({ publicPath: '/date-converter', pagePath: '/', sectionId: 'date-converter' }),
        durationCalc: Object.freeze({ publicPath: '/date-difference', pagePath: '/', sectionId: 'date-difference' }),
    }),
    clock: Object.freeze({
        timeConverter: Object.freeze({ publicPath: '/time-converter', pagePath: '/clock', sectionId: 'time-converter' }),
        timezoneDiff: Object.freeze({ publicPath: '/timezone-difference', pagePath: '/clock', sectionId: 'timezone-difference' }),
    }),
    weather: Object.freeze({
        weatherSearch: Object.freeze({ publicPath: '/weather-search', pagePath: '/weather', sectionId: 'weather-search' }),
        currentWeather: Object.freeze({ publicPath: '/current-weather', pagePath: '/weather', sectionId: 'current-weather' }),
        outdoorAdvice: Object.freeze({ publicPath: '/outdoor-advice', pagePath: '/weather', sectionId: 'outdoor-advice' }),
        forecast: Object.freeze({ publicPath: '/weather-forecast', pagePath: '/weather', sectionId: 'weather-forecast' }),
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
