'use client';

import { useEffect, useRef, useState } from 'react';
import PublicAdSlot from '../components/PublicAdSlot';
import ToolFaqSection from '../components/ToolFaqSection';
import { getSafeCurrentUrl } from '../privacyConsent';
import { useSiteContext } from '../SiteContext';
import { getToolFaqs, getToolSettings, isShareTemplateEnabled, renderShareTemplate } from '../toolSettings';
import { useSectionHashScroll } from '../useSectionHashScroll';

const WEATHER_SECTION_IDS = ['weather-search', 'current-weather', 'outdoor-advice', 'weather-forecast'];

const weatherLabels = {
    0: 'سماء صافية',
    1: 'غالبًا صافية',
    2: 'غائم جزئيًا',
    3: 'غائم',
    45: 'ضباب',
    48: 'ضباب متجمد',
    51: 'رذاذ خفيف',
    53: 'رذاذ متوسط',
    55: 'رذاذ كثيف',
    61: 'مطر خفيف',
    63: 'مطر متوسط',
    65: 'مطر غزير',
    71: 'ثلج خفيف',
    73: 'ثلج متوسط',
    75: 'ثلج كثيف',
    80: 'زخات مطر خفيفة',
    81: 'زخات مطر متوسطة',
    82: 'زخات مطر قوية',
    95: 'عواصف رعدية',
};

const weatherLabelsEn = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Moderate rain',
    65: 'Heavy rain', 71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Light rain showers',
    81: 'Moderate rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorms',
};

const weatherUi = {
    ar: { currentLocation: 'موقعك الحالي', byLocation: 'حسب موقعك', fetchError: 'تعذر جلب الطقس لهذه المدينة. جرب اسمًا آخر.', locationWeatherError: 'تعذر جلب الطقس من موقعك الحالي. جرّب البحث باسم المدينة.', locationError: 'تعذر تحديد موقعك الحالي. تأكد من السماح للموقع من إعدادات المتصفح.', placeholder: 'اكتب اسم المدينة، مثال: الرياض', search: 'جاري البحث...', locationButton: 'عرض طقس موقعي الحالي', feels: 'الإحساس', humidity: 'الرطوبة', wind: 'الرياح', rain: 'توقع المطر', shareWeather: 'مشاركة معلومات الطقس', shareAdvice: 'مشاركة نصيحة اليوم', shareForecast: 'مشاركة توقعات الطقس', ad: 'مساحة إعلانية', rainShort: 'مطر', speed: 'كم/س' },
    en: { currentLocation: 'Your current location', byLocation: 'Based on your location', fetchError: 'Weather could not be loaded for this city. Try another name.', locationWeatherError: 'Weather could not be loaded for your current location. Try searching by city.', locationError: 'Your location could not be determined. Allow location access in your browser settings.', placeholder: 'Enter a city, for example: Riyadh', search: 'Searching...', locationButton: 'Show weather for my current location', feels: 'Feels like', humidity: 'Humidity', wind: 'Wind', rain: 'Rain chance', shareWeather: 'Share weather', shareAdvice: 'Share today’s advice', shareForecast: 'Share forecast', ad: 'Ad space', rainShort: 'rain', speed: 'km/h' },
};

function WeatherCurrentPlaceholder() {
    return (
        <article className="weather-current-card weather-loading-reserve" aria-hidden="true">
            <div className="weather-current-main">
                <div>
                    <span className="skeleton-block weather-skeleton-place"></span>
                    <span className="skeleton-block weather-skeleton-temp"></span>
                    <span className="skeleton-block weather-skeleton-copy"></span>
                </div>
                <i className="fa-solid fa-temperature-half"></i>
            </div>

            <div className="weather-metrics weather-metrics-inline">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                        <span className="skeleton-block weather-skeleton-icon"></span>
                        <span className="skeleton-block weather-skeleton-metric-label"></span>
                        <span className="skeleton-block weather-skeleton-metric-value"></span>
                    </div>
                ))}
            </div>
        </article>
    );
}

function WeatherAdvicePlaceholder() {
    return (
        <article className="tool-widget advice-card weather-loading-reserve" aria-hidden="true">
            <div className="tool-widget-title">
                <i className="fa-solid fa-person-walking"></i>
                <h3><span className="skeleton-block weather-skeleton-heading"></span></h3>
            </div>
            <span className="skeleton-block weather-skeleton-advice"></span>
            <span className="skeleton-block weather-skeleton-advice short"></span>
        </article>
    );
}

function WeatherForecastPlaceholder() {
    return (
        <article className="tool-widget weather-loading-reserve" aria-hidden="true">
            <div className="tool-widget-title">
                <i className="fa-solid fa-calendar-week"></i>
                <h3><span className="skeleton-block weather-skeleton-heading"></span></h3>
            </div>
            <div className="forecast-list">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="forecast-row">
                        <span className="skeleton-block weather-skeleton-row"></span>
                        <strong><span className="skeleton-block weather-skeleton-row small"></span></strong>
                        <small><span className="skeleton-block weather-skeleton-row small"></span></small>
                        <em><span className="skeleton-block weather-skeleton-row tiny"></span></em>
                    </div>
                ))}
            </div>
        </article>
    );
}

function weatherText(code, lang = 'ar') {
    return (lang === 'en' ? weatherLabelsEn : weatherLabels)[code] || (lang === 'en' ? 'Variable weather' : 'حالة جوية متغيرة');
}

function formatForecastDate(day, lang = 'ar') {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ar-SA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(new Date(`${day}T12:00:00`));
}

function getUpcomingForecastDays(daily, lang = 'ar') {
    if (!Array.isArray(daily?.time)) return [];

    return daily.time.slice(1, 6).map((day, index) => {
        const sourceIndex = index + 1;

        return {
            day,
            dateLabel: formatForecastDate(day, lang),
            maxTemperature: Math.round(daily.temperature_2m_max?.[sourceIndex] || 0),
            minTemperature: Math.round(daily.temperature_2m_min?.[sourceIndex] || 0),
            condition: weatherText(daily.weather_code?.[sourceIndex], lang),
            rainChance: daily.precipitation_probability_max?.[sourceIndex] ?? 0,
        };
    });
}

function getOutdoorAdvice(current, daily, lang = 'ar') {
    if (lang === 'en') {
        if (!current) return 'Search for a city to see outdoor advice.';
        if (daily?.uv_index_max?.[0] >= 8) return 'UV is high. Avoid prolonged midday sun exposure.';
        if (current.precipitation > 0 || daily?.precipitation_probability_max?.[0] >= 60) return 'Rain is likely. Take an umbrella or plan an indoor activity.';
        if (current.apparent_temperature >= 35) return 'It feels hot. Drink more water and choose a cooler time.';
        return 'Conditions are generally suitable for going out. Check wind and temperature before leaving.';
    }
    if (!current) return 'ابحث عن مدينة لعرض النصيحة.';
    if (daily?.uv_index_max?.[0] >= 8) return 'مؤشر UV مرتفع، الأفضل تجنب التعرض الطويل للشمس وقت الظهيرة.';
    if (current.precipitation > 0 || daily?.precipitation_probability_max?.[0] >= 60) return 'احتمال أمطار واضح، خذ مظلة أو خطط لنشاط داخلي.';
    if (current.apparent_temperature >= 35) return 'الإحساس الحراري مرتفع، اشرب ماء أكثر واختر وقتًا أبرد.';
    return 'الأجواء مناسبة غالبًا للخروج، مع متابعة الرياح والحرارة قبل الانطلاق.';
}

async function fetchForecast(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        timezone: 'auto',
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset',
        forecast_days: '6',
    });

    const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    return forecastResponse.json();
}

export default function WeatherPage({ children, hideHero = false, initialSectionId = '' }) {
    const {
        configData,
        firebaseApiRef,
        currentLocation,
        locationStatus,
        requestCurrentLocation,
        lang,
    } = useSiteContext();
    const labels = weatherUi[lang] || weatherUi.ar;
    const [query, setQuery] = useState('Riyadh');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [weather, setWeather] = useState(null);
    const loadedLocationKeyRef = useRef('');
    const loadedInitialWeatherRef = useRef(false);

    const loadWeather = async (cityName = query) => {
        const cleanQuery = cityName.trim();
        if (!cleanQuery) return;

        setIsLoading(true);
        setError('');

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=1&language=${lang === 'en' ? 'en' : 'ar'}&format=json`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            const place = geoData.results?.[0];
            if (!place) throw new Error('city_not_found');

            const forecastData = await fetchForecast(place.latitude, place.longitude);

            setWeather({ place, forecast: forecastData });
            firebaseApiRef.current.trackToolUsage('weatherTools');
        } catch {
            setError(labels.fetchError);
        } finally {
            setIsLoading(false);
        }
    };

    const loadWeatherByLocation = async (location) => {
        setIsLoading(true);
        setError('');

        try {
            if (!location) return;

            const forecastData = await fetchForecast(location.latitude, location.longitude);
            const place = {
                name: location.label || labels.currentLocation,
                country: labels.byLocation,
            };

            setQuery(place.name);
            setWeather({ place, forecast: forecastData });
            firebaseApiRef.current.trackToolUsage('weatherTools');
        } catch {
            setError(labels.locationWeatherError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        setError('');

        const location = await requestCurrentLocation({ force: true }) || currentLocation;
        if (!location) {
            setError(labels.locationError);
            return;
        }

        const locationKey = `${location.latitude}:${location.longitude}`;
        loadedLocationKeyRef.current = locationKey;
        await loadWeatherByLocation(location);
    };

    useEffect(() => {
        if (loadedInitialWeatherRef.current) return;
        loadedInitialWeatherRef.current = true;

        async function loadInitialWeather() {
            const location = currentLocation || await requestCurrentLocation();

            if (location) {
                const locationKey = `${location.latitude}:${location.longitude}`;
                loadedLocationKeyRef.current = locationKey;
                await loadWeatherByLocation(location);
                return;
            }

            await loadWeather('Riyadh');
        }

        loadInitialWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!currentLocation) return;

        const locationKey = `${currentLocation.latitude}:${currentLocation.longitude}`;
        if (loadedLocationKeyRef.current === locationKey) return;

        loadedLocationKeyRef.current = locationKey;
        loadWeatherByLocation(currentLocation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation]);

    const current = weather?.forecast?.current;
    const daily = weather?.forecast?.daily;
    const weatherSettings = getToolSettings(configData, 'weather', lang);
    const weatherFaqItems = getToolFaqs(configData, 'weather', lang);
    const shouldReserveWeatherResults = isLoading && !current && !error;
    const cityLabel = weather?.place?.name || query;
    const adviceText = getOutdoorAdvice(current, daily, lang);
    const upcomingForecastDays = getUpcomingForecastDays(daily, lang);
    const forecastText = upcomingForecastDays.map((forecastDay) => (
        `${forecastDay.dateLabel}: ${forecastDay.maxTemperature}° / ${forecastDay.minTemperature}° - ${forecastDay.condition} - ${forecastDay.rainChance}% ${labels.rainShort}`
    )).join('\n');

    const shareWeatherResult = async (templateKey, variables) => {
        if (!isShareTemplateEnabled(weatherSettings, templateKey)) return;

        const text = renderShareTemplate(weatherSettings, templateKey, {
            ...variables,
            url: getSafeCurrentUrl(),
        });
        if (!text) return;

        try {
            if (navigator.share) {
                await navigator.share({ text });
                return;
            }
            await navigator.clipboard?.writeText(text);
        } catch {
            // Closing the native share sheet should not interrupt the weather tool.
        }
    };

    useSectionHashScroll(WEATHER_SECTION_IDS, !isLoading, initialSectionId);

    return (
        <section className="tools-page">
            {!hideHero && <div className="tools-hero weather-hero">
                <i className="fa-solid fa-cloud-sun-rain"></i>
                <div>
                    <h1>{weatherSettings.seo?.h1}</h1>
                    <p>{weatherSettings.seo?.metaDescription}</p>
                </div>
            </div>}

            <PublicAdSlot configData={configData} slotName="weatherTop" label={labels.ad} />

            <form className="weather-search" id="weather-search" onSubmit={(event) => { event.preventDefault(); loadWeather(); }}>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={labels.placeholder}
                    aria-label={labels.placeholder}
                    title={labels.placeholder}
                />
                <div className="weather-search-actions">
                    <button type="submit" className="weather-submit-btn" disabled={isLoading}>
                        <i className={isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'}></i>
                        {isLoading ? labels.search : weatherSettings.subtools?.weatherSearch}
                    </button>
                    <button
                        type="button"
                        className="weather-location-btn"
                        onClick={handleUseCurrentLocation}
                        disabled={isLoading || locationStatus === 'loading'}
                        aria-label={labels.locationButton}
                        title={labels.locationButton}
                    >
                        <i className={locationStatus === 'loading' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-location-crosshairs'}></i>
                    </button>
                </div>
            </form>

            {error && <p className="inline-error">{error}</p>}

            <PublicAdSlot configData={configData} slotName="weatherMiddle" label={labels.ad} />

            {current ? (
                <>
                    <article className="weather-current-card" id="current-weather">
                        <div className="weather-current-main">
                            <div>
                                <span className="muted-text">{weather.place.name}، {weather.place.country}</span>
                                <h3>{Math.round(current.temperature_2m)}°</h3>
                                <p>{weatherText(current.weather_code, lang)} - {labels.feels} {Math.round(current.apparent_temperature)}°</p>
                            </div>
                            <i className="fa-solid fa-temperature-half"></i>
                        </div>

                        <div className="weather-metrics weather-metrics-inline">
                            <div><i className="fa-solid fa-droplet"></i><span>{labels.humidity}</span><strong>{current.relative_humidity_2m}%</strong></div>
                            <div><i className="fa-solid fa-wind"></i><span>{labels.wind}</span><strong>{Math.round(current.wind_speed_10m)} {labels.speed}</strong></div>
                            <div><i className="fa-solid fa-umbrella"></i><span>{labels.rain}</span><strong>{daily?.precipitation_probability_max?.[0] ?? 0}%</strong></div>
                            <div><i className="fa-solid fa-sun"></i><span>UV</span><strong>{Math.round(daily?.uv_index_max?.[0] || 0)}</strong></div>
                        </div>
                        {isShareTemplateEnabled(weatherSettings, 'currentWeatherResult') && (
                            <button className="share-btn" type="button" onClick={() => shareWeatherResult('currentWeatherResult', {
                                city: cityLabel,
                                temperature: `${Math.round(current.temperature_2m)}°`,
                                condition: weatherText(current.weather_code, lang),
                                feelsLike: `${Math.round(current.apparent_temperature)}°`,
                                humidity: `${current.relative_humidity_2m}%`,
                                wind: `${Math.round(current.wind_speed_10m)} ${labels.speed}`,
                                rainChance: `${daily?.precipitation_probability_max?.[0] ?? 0}%`,
                                uv: String(Math.round(daily?.uv_index_max?.[0] || 0)),
                            })}>
                                <i className="fa-solid fa-share-nodes"></i> {labels.shareWeather}
                            </button>
                        )}
                    </article>

                    <article className="tool-widget advice-card" id="outdoor-advice">
                        <div className="tool-widget-title">
                            <i className="fa-solid fa-person-walking"></i>
                            <h3>{weatherSettings.subtools?.outdoorAdvice}</h3>
                        </div>
                        <p>{adviceText}</p>
                        {isShareTemplateEnabled(weatherSettings, 'outdoorAdviceResult') && (
                            <button className="share-btn" type="button" onClick={() => shareWeatherResult('outdoorAdviceResult', {
                                city: cityLabel,
                                advice: adviceText,
                            })}>
                                <i className="fa-solid fa-share-nodes"></i> {labels.shareAdvice}
                            </button>
                        )}
                    </article>
                </>
            ) : shouldReserveWeatherResults ? (
                <>
                    <WeatherCurrentPlaceholder />
                    <WeatherAdvicePlaceholder />
                </>
            ) : null}

            <PublicAdSlot configData={configData} slotName="weatherBottom" label={labels.ad} />

            {upcomingForecastDays.length ? (
                <article className="tool-widget" id="weather-forecast">
                    <div className="tool-widget-title">
                        <i className="fa-solid fa-calendar-week"></i>
                        <h3>{weatherSettings.subtools?.forecast}</h3>
                    </div>
                    <div className="forecast-list">
                        {upcomingForecastDays.map((forecastDay) => (
                            <div key={forecastDay.day} className="forecast-row">
                                <span>{forecastDay.dateLabel}</span>
                                <strong>{forecastDay.maxTemperature}° / {forecastDay.minTemperature}°</strong>
                                <small>{forecastDay.condition}</small>
                                <em>{forecastDay.rainChance}% {labels.rainShort}</em>
                            </div>
                        ))}
                    </div>
                    {isShareTemplateEnabled(weatherSettings, 'forecastResult') && (
                        <button className="share-btn" type="button" onClick={() => shareWeatherResult('forecastResult', {
                            city: cityLabel,
                            forecast: forecastText,
                        })}>
                            <i className="fa-solid fa-share-nodes"></i> {labels.shareForecast}
                        </button>
                    )}
                </article>
            ) : shouldReserveWeatherResults ? (
                <WeatherForecastPlaceholder />
            ) : null}
            {children}
            <ToolFaqSection items={weatherFaqItems} title={lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'} />

        </section>
    );
}
