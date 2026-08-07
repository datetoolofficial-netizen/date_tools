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
        weatherForecast: Object.freeze({ publicPath: '/weather-forecast', pagePath: '/weather', sectionId: 'weather-forecast' }),
    }),
});

export const TOOL_SECTION_REDIRECTS = new Map(
    Object.values(TOOL_SECTION_ROUTES)
        .flatMap((routes) => Object.values(routes))
        .map(({ publicPath, pagePath, sectionId }) => [
            publicPath,
            { pathname: pagePath, hash: sectionId },
        ])
);
