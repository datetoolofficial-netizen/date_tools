'use client';

import { useEffect, useRef, useState } from 'react';
import PublicAdSlot from '../components/PublicAdSlot';
import ToolFaqSection from '../components/ToolFaqSection';
import { useSiteContext } from '../SiteContext';
import { getToolFaqs, getToolSettings } from '../toolSettings';

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

const weatherFaq = [
    {
        q: 'من أين تأتي بيانات الطقس في الأداة؟',
        a: 'تعتمد الأداة على بيانات طقس مباشرة من خدمة Open-Meteo، وتعرض الحرارة الحالية، الإحساس الحراري، الرطوبة، الرياح، الأمطار، ومؤشر UV عند توفرها.',
    },
    {
        q: 'هل يمكن عرض طقس موقعي الحالي تلقائيًا؟',
        a: 'نعم، إذا وافقت من المتصفح على مشاركة الموقع، تستخدم الأداة إحداثياتك الحالية لعرض الطقس الأقرب لك دون حفظ موقعك في قاعدة البيانات.',
    },
    {
        q: 'لماذا قد تختلف درجة الحرارة عن تطبيقات أخرى؟',
        a: 'قد تختلف النتائج قليلًا حسب مصدر البيانات، وقت التحديث، والمحطة أو النموذج الجوي الأقرب للمدينة أو الإحداثيات المستخدمة.',
    },
];

function weatherText(code) {
    return weatherLabels[code] || 'حالة جوية متغيرة';
}

function getOutdoorAdvice(current, daily) {
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
        forecast_days: '5',
    });

    const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    return forecastResponse.json();
}

export default function WeatherPage() {
    const {
        configData,
        firebaseApiRef,
        currentLocation,
        locationStatus,
        requestCurrentLocation,
    } = useSiteContext();
    const [query, setQuery] = useState('Riyadh');
    const [isLoading, setIsLoading] = useState(false);
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
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=1&language=ar&format=json`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            const place = geoData.results?.[0];
            if (!place) throw new Error('city_not_found');

            const forecastData = await fetchForecast(place.latitude, place.longitude);

            setWeather({ place, forecast: forecastData });
            firebaseApiRef.current.trackToolUsage('weatherTools');
        } catch {
            setError('تعذر جلب الطقس لهذه المدينة. جرب اسمًا آخر.');
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
                name: location.label || 'موقعك الحالي',
                country: 'حسب موقعك',
            };

            setQuery(place.name);
            setWeather({ place, forecast: forecastData });
            firebaseApiRef.current.trackToolUsage('weatherTools');
        } catch {
            setError('تعذر جلب الطقس من موقعك الحالي. جرّب البحث باسم المدينة.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        setError('');

        const location = await requestCurrentLocation({ force: true }) || currentLocation;
        if (!location) {
            setError('تعذر تحديد موقعك الحالي. تأكد من السماح للموقع من إعدادات المتصفح.');
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
    const weatherSettings = getToolSettings(configData, 'weather');
    const weatherFaqItems = getToolFaqs(configData, 'weather', weatherFaq);

    return (
        <section className="tools-page">
            <div className="tools-hero weather-hero">
                <i className="fa-solid fa-cloud-sun-rain"></i>
                <div>
                    <h2>{weatherSettings.heroTitle}</h2>
                    <p>{weatherSettings.heroDescription}</p>
                </div>
            </div>

            <PublicAdSlot configData={configData} slotName="weatherTop" label="إعلان أعلى الطقس" />

            <form className="weather-search" onSubmit={(event) => { event.preventDefault(); loadWeather(); }}>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="اكتب اسم المدينة، مثال: الرياض"
                />
                <div className="weather-search-actions">
                    <button type="submit" className="weather-submit-btn" disabled={isLoading}>
                        <i className={isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'}></i>
                        {isLoading ? 'جاري البحث...' : weatherSettings.subtools?.weatherSearch}
                    </button>
                    <button
                        type="button"
                        className="weather-location-btn"
                        onClick={handleUseCurrentLocation}
                        disabled={isLoading || locationStatus === 'loading'}
                        aria-label="عرض طقس موقعي الحالي"
                        title="عرض طقس موقعي الحالي"
                    >
                        <i className={locationStatus === 'loading' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-location-crosshairs'}></i>
                    </button>
                </div>
            </form>

            {error && <p className="inline-error">{error}</p>}

            <PublicAdSlot configData={configData} slotName="weatherMiddle" label="إعلان وسط الطقس" />

            {current && (
                <>
                    <article className="weather-current-card">
                        <div className="weather-current-main">
                            <div>
                                <span className="muted-text">{weather.place.name}، {weather.place.country}</span>
                                <h3>{Math.round(current.temperature_2m)}°</h3>
                                <p>{weatherText(current.weather_code)} - الإحساس {Math.round(current.apparent_temperature)}°</p>
                            </div>
                            <i className="fa-solid fa-temperature-half"></i>
                        </div>

                        <div className="weather-metrics weather-metrics-inline">
                            <div><i className="fa-solid fa-droplet"></i><span>الرطوبة</span><strong>{current.relative_humidity_2m}%</strong></div>
                            <div><i className="fa-solid fa-wind"></i><span>الرياح</span><strong>{Math.round(current.wind_speed_10m)} كم/س</strong></div>
                            <div><i className="fa-solid fa-umbrella"></i><span>توقع المطر</span><strong>{daily?.precipitation_probability_max?.[0] ?? 0}%</strong></div>
                            <div><i className="fa-solid fa-sun"></i><span>UV</span><strong>{Math.round(daily?.uv_index_max?.[0] || 0)}</strong></div>
                        </div>
                    </article>

                    <article className="tool-widget advice-card">
                        <div className="tool-widget-title">
                            <i className="fa-solid fa-person-walking"></i>
                            <h3>{weatherSettings.subtools?.outdoorAdvice}</h3>
                        </div>
                        <p>{getOutdoorAdvice(current, daily)}</p>
                    </article>
                </>
            )}

            <PublicAdSlot configData={configData} slotName="weatherBottom" label="إعلان أسفل الطقس" />

            {daily?.time && (
                <article className="tool-widget">
                    <div className="tool-widget-title">
                        <i className="fa-solid fa-calendar-week"></i>
                        <h3>{weatherSettings.subtools?.forecast}</h3>
                    </div>
                    <div className="forecast-list">
                        {daily.time.map((day, index) => (
                            <div key={day} className="forecast-row">
                                <span>{new Intl.DateTimeFormat('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(day))}</span>
                                <strong>{Math.round(daily.temperature_2m_max[index])}° / {Math.round(daily.temperature_2m_min[index])}°</strong>
                                <small>{weatherText(daily.weather_code[index])}</small>
                                <em>{daily.precipitation_probability_max[index] ?? 0}% مطر</em>
                            </div>
                        ))}
                    </div>
                </article>
            )}
            <ToolFaqSection items={weatherFaqItems} />

        </section>
    );
}
