'use client';

import { useEffect, useRef, useState } from 'react';
import { useSiteContext } from '../SiteContext';

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
        firebaseApiRef,
        currentLocation,
    } = useSiteContext();
    const [query, setQuery] = useState('Riyadh');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [weather, setWeather] = useState(null);
    const loadedLocationKeyRef = useRef('');

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

    useEffect(() => {
        loadWeather('Riyadh');
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

    return (
        <section className="tools-page">
            <div className="tools-hero weather-hero">
                <i className="fa-solid fa-cloud-sun-rain"></i>
                <div>
                    <h2>أدوات الطقس</h2>
                    <p>اعرف طقس مدينتك، مؤشر الحرارة المحسوسة، الرطوبة، الرياح وUV بسرعة.</p>
                </div>
            </div>

            <form className="weather-search" onSubmit={(event) => { event.preventDefault(); loadWeather(); }}>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="اكتب اسم المدينة، مثال: الرياض"
                />
                <button type="submit" disabled={isLoading}>
                    <i className={isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'}></i>
                    {isLoading ? 'جاري البحث...' : 'عرض الطقس'}
                </button>
            </form>

            {error && <p className="inline-error">{error}</p>}

            {current && (
                <>
                    <article className="weather-current-card">
                        <div>
                            <span className="muted-text">{weather.place.name}، {weather.place.country}</span>
                            <h3>{Math.round(current.temperature_2m)}°</h3>
                            <p>{weatherText(current.weather_code)} - الإحساس {Math.round(current.apparent_temperature)}°</p>
                        </div>
                        <i className="fa-solid fa-temperature-half"></i>
                    </article>

                    <div className="weather-metrics">
                        <div><i className="fa-solid fa-droplet"></i><span>الرطوبة</span><strong>{current.relative_humidity_2m}%</strong></div>
                        <div><i className="fa-solid fa-wind"></i><span>الرياح</span><strong>{Math.round(current.wind_speed_10m)} كم/س</strong></div>
                        <div><i className="fa-solid fa-umbrella"></i><span>الأمطار</span><strong>{current.precipitation} مم</strong></div>
                        <div><i className="fa-solid fa-sun"></i><span>UV</span><strong>{Math.round(daily?.uv_index_max?.[0] || 0)}</strong></div>
                    </div>

                    <article className="tool-widget advice-card">
                        <div className="tool-widget-title">
                            <i className="fa-solid fa-person-walking"></i>
                            <h3>نصيحة الخروج اليوم</h3>
                        </div>
                        <p>{getOutdoorAdvice(current, daily)}</p>
                    </article>
                </>
            )}

            {daily?.time && (
                <article className="tool-widget">
                    <div className="tool-widget-title">
                        <i className="fa-solid fa-calendar-week"></i>
                        <h3>توقعات 5 أيام</h3>
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
        </section>
    );
}
