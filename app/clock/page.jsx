'use client';

import { useEffect, useMemo, useState } from 'react';
import PublicAdSlot from '../components/PublicAdSlot';
import ToolFaqSection from '../components/ToolFaqSection';
import { useSiteContext } from '../SiteContext';
import { getToolFaqs, getToolSettings } from '../toolSettings';

const defaultFromCity = {
    query: 'الرياض',
    label: 'الرياض',
    zone: 'Asia/Riyadh',
    resolvedQuery: 'الرياض',
};

const defaultToCity = {
    query: 'لندن',
    label: 'لندن',
    zone: 'Europe/London',
    resolvedQuery: 'لندن',
};

const clockFaq = [
    {
        q: 'كيف أحول الوقت من نظام 24 ساعة إلى 12 ساعة؟',
        a: 'اختر الساعة والدقيقة بنظام 24 ساعة، ثم اضغط تحويل. ستعرض الأداة الوقت بصيغة 12 ساعة مع تحديد الفترة صباحًا أو مساءً.',
    },
    {
        q: 'هل تعتمد الساعة الحالية على موقعي الحقيقي؟',
        a: 'نعم، عند السماح للموقع بقراءة موقعك من المتصفح يتم استخدام المنطقة الزمنية المناسبة لموقعك الحالي دون حفظ إحداثياتك في قاعدة البيانات.',
    },
    {
        q: 'كيف يتم حساب فرق التوقيت بين مدينتين؟',
        a: 'تقارن الأداة فرق UTC لكل مدينة في اللحظة الحالية، ثم تعرض الفرق بالساعات مع مراعاة المنطقة الزمنية للمدن المختارة.',
    },
];

function formatTime(date, zone, hour12 = false, includeSeconds = true) {
    const options = {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12,
    };

    if (includeSeconds) {
        options.second = '2-digit';
    }

    return new Intl.DateTimeFormat('ar-SA', options).format(date);
}

function getOffsetHours(zone, date) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset',
        hour: '2-digit',
    }).formatToParts(date);

    const offset = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT+0';
    const match = offset.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
    if (!match) return 0;

    const hours = Number(match[1]);
    const minutes = Number(match[2] || 0) / 60;
    return hours + (hours >= 0 ? minutes : -minutes);
}

function getCityLabel(place) {
    return [place.name, place.admin1, place.country].filter(Boolean).join('، ');
}

async function searchCityTimezone(query) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) throw new Error('empty_city');

    const params = new URLSearchParams({
        name: cleanQuery,
        count: '1',
        language: 'ar',
        format: 'json',
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    const data = await response.json();
    const place = data.results?.[0];

    if (!response.ok || !place?.timezone) throw new Error('city_not_found');

    return {
        query: cleanQuery,
        resolvedQuery: cleanQuery,
        label: cleanQuery,
        resolvedLabel: getCityLabel(place),
        zone: place.timezone,
    };
}

async function resolveCityInput(city) {
    const cleanQuery = String(city.query || '').trim();
    if (city.zone && city.resolvedQuery === cleanQuery) return city;
    return searchCityTimezone(cleanQuery);
}

function formatHourDifference(diff) {
    const absDiff = Math.abs(diff);
    if (absDiff === 1) return 'ساعة واحدة';
    if (absDiff === 2) return 'ساعتين';
    if (Number.isInteger(absDiff)) return `${absDiff} ساعات`;
    return `${absDiff} ساعة`;
}

function getDifferenceText(diff) {
    if (diff === 0) return 'نفس التوقيت';

    return formatHourDifference(diff);
}

export default function ClockPage() {
    const {
        configData,
        firebaseApiRef,
        currentLocation,
    } = useSiteContext();
    const [now, setNow] = useState(() => new Date());
    const [inputHour, setInputHour] = useState('13');
    const [inputMinute, setInputMinute] = useState('30');
    const [convertedTime, setConvertedTime] = useState('');
    const [cityZone, setCityZone] = useState('Asia/Riyadh');
    const [fromCity, setFromCity] = useState(defaultFromCity);
    const [toCity, setToCity] = useState(defaultToCity);
    const [locationLabel, setLocationLabel] = useState(defaultFromCity.label);
    const [clockHour12, setClockHour12] = useState(false);
    const [timezoneDiff, setTimezoneDiff] = useState(null);
    const [timezoneSearchStatus, setTimezoneSearchStatus] = useState('idle');
    const [timezoneSearchError, setTimezoneSearchError] = useState('');

    useEffect(() => {
        firebaseApiRef.current.trackToolUsage('clockTools');
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, [firebaseApiRef]);

    useEffect(() => {
        if (!currentLocation) return;
        const label = currentLocation.label || 'موقعك الحالي';

        setCityZone(currentLocation.timezone);
        setFromCity({
            query: label,
            label,
            zone: currentLocation.timezone,
            resolvedQuery: label,
        });
        setLocationLabel(label);
        setTimezoneDiff(null);
    }, [currentLocation]);

    const previewTime = useMemo(() => {
        const rawHour = Number(inputHour);
        const rawMinute = Number(inputMinute);
        if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return 'أدخل وقتًا صحيحًا';

        const hour = rawHour % 24;
        const suffix = hour >= 12 ? 'م' : 'ص';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${String(rawMinute).padStart(2, '0')} ${suffix}`;
    }, [inputHour, inputMinute]);

    const calculateTimeConversion = () => {
        setConvertedTime(previewTime);
        firebaseApiRef.current.trackToolUsage('clockTools');
    };

    const shareClockResult = async (text) => {
        if (!text) return;

        try {
            if (navigator.share) {
                await navigator.share({ text });
                return;
            }

            await navigator.clipboard?.writeText(text);
        } catch {
            // Sharing may be cancelled by the user; no need to interrupt the tool.
        }
    };

    const updateCityQuery = (setter, value) => {
        setter((current) => ({
            ...current,
            query: value,
            label: '',
            zone: '',
            resolvedQuery: '',
        }));
        setTimezoneDiff(null);
        setTimezoneSearchError('');
    };

    const calculateTimezoneDiff = async () => {
        setTimezoneSearchStatus('loading');
        setTimezoneSearchError('');
        setTimezoneDiff(null);

        try {
            const [nextFromCity, nextToCity] = await Promise.all([
                resolveCityInput(fromCity),
                resolveCityInput(toCity),
            ]);
            const diff = Math.round((getOffsetHours(nextToCity.zone, now) - getOffsetHours(nextFromCity.zone, now)) * 10) / 10;

            setFromCity(nextFromCity);
            setToCity(nextToCity);
            setTimezoneDiff({
                diff,
                text: getDifferenceText(diff),
                fromCity: nextFromCity,
                toCity: nextToCity,
            });
            firebaseApiRef.current.trackToolUsage('clockTools');
        } catch {
            setTimezoneSearchError('تعذر العثور على إحدى المدينتين. جرّب كتابة اسم المدينة بالعربية أو الإنجليزية.');
        } finally {
            setTimezoneSearchStatus('idle');
        }
    };

    const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
    const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
    const clockSettings = getToolSettings(configData, 'clock');
    const clockFaqItems = getToolFaqs(configData, 'clock', clockFaq);

    return (
        <section className="tools-page">
            <div className="tools-hero clock-hero">
                <i className="fa-solid fa-clock"></i>
                <div>
                    <h2>{clockSettings.heroTitle}</h2>
                    <p>{clockSettings.heroDescription}</p>
                </div>
            </div>

            <div className="today-info-banner clock-now-banner">
                <div className="today-content">
                    <button
                        className="clock-format-toggle"
                        type="button"
                        onClick={() => setClockHour12((current) => !current)}
                        aria-label={clockHour12 ? 'عرض الساعة بنظام 24' : 'عرض الساعة بنظام 12'}
                    >
                        <span>{clockHour12 ? '12' : '24'}</span>
                        <small>{clockHour12 ? 'ساعة' : 'ساعة'}</small>
                    </button>
                    <span className="clock-now-label">
                        <i className="fa-regular fa-clock"></i>
                        <span>الساعة الآن في {locationLabel}</span>
                    </span>
                    <strong>{formatTime(now, cityZone, clockHour12)}</strong>
                </div>
            </div>

            <PublicAdSlot configData={configData} slotName="clockTop" label="إعلان أعلى الساعة" />

            <article className="tool-widget time-converter-card">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-repeat"></i>
                    <h3>{clockSettings.subtools?.timeConverter}</h3>
                </div>
                <div className="time-select-grid clock-tool-panel">
                    <div className="time-select-fields">
                        <label>
                            <span>الساعة</span>
                            <select
                                value={inputHour}
                                onChange={(event) => { setInputHour(event.target.value); setConvertedTime(''); }}
                                aria-label="الساعة بنظام 24"
                                title="الساعة بنظام 24"
                            >
                                {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                            </select>
                        </label>
                        <label>
                            <span>الدقيقة</span>
                            <select
                                value={inputMinute}
                                onChange={(event) => { setInputMinute(event.target.value); setConvertedTime(''); }}
                                aria-label="الدقيقة"
                                title="الدقيقة"
                            >
                                {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                            </select>
                        </label>
                    </div>
                    <button className="action-btn" type="button" onClick={calculateTimeConversion}>
                        <i className="fa-solid fa-clock"></i> <span>تحويل</span>
                    </button>
                    {convertedTime && (
                        <>
                            <div className="tool-result clock-tool-result">{convertedTime}</div>
                            <button className="share-btn clock-result-share" type="button" onClick={() => shareClockResult(`الوقت بنظام 12 ساعة: ${convertedTime}`)}>
                                <i className="fa-solid fa-share-nodes"></i> مشاركة النتيجة
                            </button>
                        </>
                    )}
                </div>
            </article>

            <PublicAdSlot configData={configData} slotName="clockMiddle" label="إعلان وسط الساعة" />

            <article className="tool-widget timezone-diff-card">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-code-compare"></i>
                    <h3>{clockSettings.subtools?.timezoneDiff}</h3>
                </div>
                <div className="timezone-search-grid clock-tool-panel">
                    <div className="timezone-search-fields">
                        <label className="timezone-search-field">
                            <span>المدينة الأولى</span>
                            <input
                                value={fromCity.query}
                                onChange={(event) => updateCityQuery(setFromCity, event.target.value)}
                                placeholder="مثال: الرياض"
                                aria-label="ابحث عن المدينة الأولى"
                                title="ابحث عن المدينة الأولى"
                            />
                        </label>
                        <label className="timezone-search-field">
                            <span>المدينة الثانية</span>
                            <input
                                value={toCity.query}
                                onChange={(event) => updateCityQuery(setToCity, event.target.value)}
                                placeholder="مثال: لندن"
                                aria-label="ابحث عن المدينة الثانية"
                                title="ابحث عن المدينة الثانية"
                            />
                        </label>
                    </div>
                    <button className="action-btn" type="button" onClick={calculateTimezoneDiff} disabled={timezoneSearchStatus === 'loading'}>
                        <i className={timezoneSearchStatus === 'loading' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-code-compare'}></i>
                        <span>{timezoneSearchStatus === 'loading' ? 'جاري الحساب...' : 'احسب'}</span>
                    </button>
                    {timezoneSearchError && <p className="inline-error">{timezoneSearchError}</p>}
                    {timezoneDiff && (
                        <>
                            <div className="tool-result timezone-result">
                                <strong>فرق التوقيت: {timezoneDiff.text}</strong>
                                <span>{timezoneDiff.fromCity.label}: الساعة الآن {formatTime(now, timezoneDiff.fromCity.zone, clockHour12, false)}</span>
                                <span>{timezoneDiff.toCity.label}: الساعة الآن {formatTime(now, timezoneDiff.toCity.zone, clockHour12, false)}</span>
                            </div>
                            <button className="share-btn clock-result-share" type="button" onClick={() => shareClockResult(`فرق التوقيت: ${timezoneDiff.text}`)}>
                                <i className="fa-solid fa-share-nodes"></i> مشاركة النتيجة
                            </button>
                        </>
                    )}
                </div>
            </article>

            <PublicAdSlot configData={configData} slotName="clockBottom" label="إعلان أسفل الساعة" />
            <ToolFaqSection items={clockFaqItems} />

        </section>
    );
}
