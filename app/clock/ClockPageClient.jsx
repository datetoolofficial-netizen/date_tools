'use client';

import { useEffect, useMemo, useState } from 'react';
import PublicAdSlot from '../components/PublicAdSlot';
import ToolFaqSection from '../components/ToolFaqSection';
import { getSafeCurrentUrl } from '../privacyConsent';
import { useSiteContext } from '../SiteContext';
import { getToolFaqs, getToolSettings, isShareTemplateEnabled, renderShareTemplate } from '../toolSettings';
import { useSectionHashScroll } from '../useSectionHashScroll';

const CLOCK_SECTION_IDS = ['time-converter', 'timezone-difference'];

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

const englishDefaultFromCity = { ...defaultFromCity, query: 'Riyadh', label: 'Riyadh', resolvedQuery: 'Riyadh' };
const englishDefaultToCity = { ...defaultToCity, query: 'London', label: 'London', resolvedQuery: 'London' };

function formatTime(date, zone, hour12 = false, includeSeconds = true, lang = 'ar') {
    const options = {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12,
    };

    if (includeSeconds) {
        options.second = '2-digit';
    }

    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ar-SA', options).format(date);
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

async function searchCityTimezone(query, lang = 'ar') {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) throw new Error('empty_city');

    const params = new URLSearchParams({
        name: cleanQuery,
        count: '1',
        language: lang === 'en' ? 'en' : 'ar',
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

async function resolveCityInput(city, lang = 'ar') {
    const cleanQuery = String(city.query || '').trim();
    if (city.zone && city.resolvedQuery === cleanQuery) return city;
    return searchCityTimezone(cleanQuery, lang);
}

function formatHourDifference(diff, lang = 'ar') {
    const absDiff = Math.abs(diff);
    if (lang === 'en') return `${absDiff} ${absDiff === 1 ? 'hour' : 'hours'}`;
    if (absDiff === 1) return 'ساعة واحدة';
    if (absDiff === 2) return 'ساعتين';
    if (Number.isInteger(absDiff)) return `${absDiff} ساعات`;
    return `${absDiff} ساعة`;
}

function getDifferenceText(diff, lang = 'ar') {
    if (diff === 0) return lang === 'en' ? 'Same time' : 'نفس التوقيت';

    return formatHourDifference(diff, lang);
}

const clockLabels = {
    ar: { currentLocation: 'موقعك الحالي', invalidTime: 'أدخل وقتًا صحيحًا', searchError: 'تعذر العثور على إحدى المدينتين. جرّب كتابة اسم المدينة بالعربية أو الإنجليزية.', currentTime: 'الساعة الآن في', hour: 'الساعة', minute: 'الدقيقة', hour24: 'الساعة بنظام 24', convert: 'تحويل', share: 'مشاركة النتيجة', firstCity: 'المدينة الأولى', secondCity: 'المدينة الثانية', firstExample: 'مثال: الرياض', secondExample: 'مثال: لندن', searchFirst: 'ابحث عن المدينة الأولى', searchSecond: 'ابحث عن المدينة الثانية', calculate: 'احسب', calculating: 'جاري الحساب...', difference: 'فرق التوقيت', now: 'الساعة الآن', ad: 'مساحة إعلانية', hours: 'ساعة' },
    en: { currentLocation: 'Your current location', invalidTime: 'Enter a valid time', searchError: 'We could not find one of the cities. Try an Arabic or English city name.', currentTime: 'Current time in', hour: 'Hour', minute: 'Minute', hour24: 'Hour in 24-hour format', convert: 'Convert', share: 'Share result', firstCity: 'First city', secondCity: 'Second city', firstExample: 'Example: Riyadh', secondExample: 'Example: London', searchFirst: 'Search for the first city', searchSecond: 'Search for the second city', calculate: 'Calculate', calculating: 'Calculating...', difference: 'Time difference', now: 'current time', ad: 'Ad space', hours: 'hours' },
};

export default function ClockPage({ children, hideHero = false, initialSectionId = '', standaloneSectionId = '' }) {
    const {
        configData,
        firebaseApiRef,
        currentLocation,
        lang,
    } = useSiteContext();
    const labels = clockLabels[lang] || clockLabels.ar;
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
    const activeStandaloneSection = CLOCK_SECTION_IDS.includes(standaloneSectionId) ? standaloneSectionId : '';
    const isStandalone = Boolean(activeStandaloneSection);

    useEffect(() => {
        firebaseApiRef.current.trackToolUsage('clockTools');
        let timer;
        const minuteDelay = 60000 - (Date.now() % 60000) + 25;
        const minuteStart = window.setTimeout(() => {
            setNow(new Date());
            timer = window.setInterval(() => setNow(new Date()), 60000);
        }, minuteDelay);

        return () => {
            window.clearTimeout(minuteStart);
            if (timer) window.clearInterval(timer);
        };
    }, [firebaseApiRef]);

    useSectionHashScroll(CLOCK_SECTION_IDS, true, initialSectionId);

    useEffect(() => {
        if (currentLocation) return;
        setFromCity((current) => {
            if (lang === 'en' && current.resolvedQuery === defaultFromCity.resolvedQuery) return englishDefaultFromCity;
            if (lang === 'ar' && current.resolvedQuery === englishDefaultFromCity.resolvedQuery) return defaultFromCity;
            return current;
        });
        setToCity((current) => {
            if (lang === 'en' && current.resolvedQuery === defaultToCity.resolvedQuery) return englishDefaultToCity;
            if (lang === 'ar' && current.resolvedQuery === englishDefaultToCity.resolvedQuery) return defaultToCity;
            return current;
        });
        setLocationLabel((current) => {
            if (lang === 'en' && current === defaultFromCity.label) return englishDefaultFromCity.label;
            if (lang === 'ar' && current === englishDefaultFromCity.label) return defaultFromCity.label;
            return current;
        });
        setTimezoneDiff(null);
    }, [currentLocation, lang]);

    useEffect(() => {
        if (!currentLocation) return;
        const label = currentLocation.label || labels.currentLocation;

        setCityZone(currentLocation.timezone);
        setFromCity({
            query: label,
            label,
            zone: currentLocation.timezone,
            resolvedQuery: label,
        });
        setLocationLabel(label);
        setTimezoneDiff(null);
    }, [currentLocation, labels.currentLocation]);

    const previewTime = useMemo(() => {
        const rawHour = Number(inputHour);
        const rawMinute = Number(inputMinute);
        if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return labels.invalidTime;

        const hour = rawHour % 24;
        const suffix = hour >= 12 ? (lang === 'en' ? 'PM' : 'م') : (lang === 'en' ? 'AM' : 'ص');
        const hour12 = hour % 12 || 12;
        return `${hour12}:${String(rawMinute).padStart(2, '0')} ${suffix}`;
    }, [inputHour, inputMinute, labels.invalidTime, lang]);

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
                resolveCityInput(fromCity, lang),
                resolveCityInput(toCity, lang),
            ]);
            const diff = Math.round((getOffsetHours(nextToCity.zone, now) - getOffsetHours(nextFromCity.zone, now)) * 10) / 10;

            setFromCity(nextFromCity);
            setToCity(nextToCity);
            setTimezoneDiff({
                diff,
                text: getDifferenceText(diff, lang),
                fromCity: nextFromCity,
                toCity: nextToCity,
            });
            firebaseApiRef.current.trackToolUsage('clockTools');
        } catch {
            setTimezoneSearchError(labels.searchError);
        } finally {
            setTimezoneSearchStatus('idle');
        }
    };

    const hourOptions = [
        ...Array.from({ length: 11 }, (_, index) => String(index + 13)),
        '00',
    ];
    const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
    const clockSettings = getToolSettings(configData, 'clock', lang);
    const clockFaqItems = getToolFaqs(configData, 'clock', lang);
    const canShareTimeConverter = isShareTemplateEnabled(clockSettings, 'timeConverterResult');
    const canShareTimezoneDiff = isShareTemplateEnabled(clockSettings, 'timezoneDiffResult');
    const currentInputTime = `${String(inputHour).padStart(2, '0')}:${String(inputMinute).padStart(2, '0')}`;
    const timeConverterShareText = convertedTime ? renderShareTemplate(clockSettings, 'timeConverterResult', {
        input: currentInputTime,
        inputHour,
        inputMinute,
        result: convertedTime,
        url: getSafeCurrentUrl(),
    }) : '';
    const timezoneShareText = timezoneDiff ? renderShareTemplate(clockSettings, 'timezoneDiffResult', {
        fromCity: timezoneDiff.fromCity.label,
        toCity: timezoneDiff.toCity.label,
        difference: timezoneDiff.text,
        fromTime: formatTime(now, timezoneDiff.fromCity.zone, clockHour12, false, lang),
        toTime: formatTime(now, timezoneDiff.toCity.zone, clockHour12, false, lang),
        url: getSafeCurrentUrl(),
    }) : '';

    return (
        <section className="tools-page">
            {!hideHero && <div className="tools-hero clock-hero">
                <i className="fa-solid fa-clock"></i>
                <div>
                    <h1>{clockSettings.seo?.h1}</h1>
                    <p>{clockSettings.seo?.metaDescription}</p>
                </div>
            </div>}

            {!isStandalone && <div className="today-info-banner clock-now-banner">
                <div className="today-content">
                    <button
                        className="clock-format-toggle"
                        type="button"
                        onClick={() => setClockHour12((current) => !current)}
                        aria-label={clockHour12 ? '24-hour clock' : '12-hour clock'}
                    >
                        <span>{clockHour12 ? '12' : '24'}</span>
                        <small>{labels.hours}</small>
                    </button>
                    <span className="clock-now-label">
                        <i className="fa-regular fa-clock"></i>
                        <span>{labels.currentTime} {locationLabel}</span>
                    </span>
                    <strong>{formatTime(now, cityZone, clockHour12, false, lang)}</strong>
                </div>
            </div>}

            <PublicAdSlot configData={configData} slotName="clockTop" label={labels.ad} />

            {(!isStandalone || activeStandaloneSection === 'time-converter') && <article className="tool-widget time-converter-card" id="time-converter">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-repeat"></i>
                    <h3>{clockSettings.subtools?.timeConverter}</h3>
                </div>
                <div className="time-select-grid clock-tool-panel">
                    <div className="time-select-fields">
                        <label>
                            <span>{labels.hour}</span>
                            <select
                                value={inputHour}
                                onChange={(event) => { setInputHour(event.target.value); setConvertedTime(''); }}
                                aria-label={labels.hour24}
                                title={labels.hour24}
                            >
                                {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                            </select>
                        </label>
                        <label>
                            <span>{labels.minute}</span>
                            <select
                                value={inputMinute}
                                onChange={(event) => { setInputMinute(event.target.value); setConvertedTime(''); }}
                                aria-label={labels.minute}
                                title={labels.minute}
                            >
                                {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                            </select>
                        </label>
                    </div>
                    <button className="action-btn" type="button" onClick={calculateTimeConversion}>
                        <i className="fa-solid fa-clock"></i> <span>{labels.convert}</span>
                    </button>
                    {convertedTime && (
                        <>
                            <div className="tool-result clock-tool-result">{convertedTime}</div>
                            {canShareTimeConverter && (
                                <button className="share-btn clock-result-share" type="button" onClick={() => shareClockResult(timeConverterShareText)}>
                                    <i className="fa-solid fa-share-nodes"></i> {labels.share}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </article>}

            {!isStandalone && <PublicAdSlot configData={configData} slotName="clockMiddle" label={labels.ad} />}

            {(!isStandalone || activeStandaloneSection === 'timezone-difference') && <article className="tool-widget timezone-diff-card" id="timezone-difference">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-code-compare"></i>
                    <h3>{clockSettings.subtools?.timezoneDiff}</h3>
                </div>
                <div className="timezone-search-grid clock-tool-panel">
                    <div className="timezone-search-fields">
                        <label className="timezone-search-field">
                            <span>{labels.firstCity}</span>
                            <input
                                value={fromCity.query}
                                onChange={(event) => updateCityQuery(setFromCity, event.target.value)}
                                placeholder={labels.firstExample}
                                aria-label={labels.searchFirst}
                                title={labels.searchFirst}
                            />
                        </label>
                        <label className="timezone-search-field">
                            <span>{labels.secondCity}</span>
                            <input
                                value={toCity.query}
                                onChange={(event) => updateCityQuery(setToCity, event.target.value)}
                                placeholder={labels.secondExample}
                                aria-label={labels.searchSecond}
                                title={labels.searchSecond}
                            />
                        </label>
                    </div>
                    <button className="action-btn" type="button" onClick={calculateTimezoneDiff} disabled={timezoneSearchStatus === 'loading'}>
                        <i className={timezoneSearchStatus === 'loading' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-code-compare'}></i>
                        <span>{timezoneSearchStatus === 'loading' ? labels.calculating : labels.calculate}</span>
                    </button>
                    {timezoneSearchError && <p className="inline-error">{timezoneSearchError}</p>}
                    {timezoneDiff && (
                        <>
                            <div className="tool-result timezone-result">
                                <strong>{labels.difference}: {timezoneDiff.text}</strong>
                                <span>{timezoneDiff.fromCity.label}: {labels.now} {formatTime(now, timezoneDiff.fromCity.zone, clockHour12, false, lang)}</span>
                                <span>{timezoneDiff.toCity.label}: {labels.now} {formatTime(now, timezoneDiff.toCity.zone, clockHour12, false, lang)}</span>
                            </div>
                            {canShareTimezoneDiff && (
                                <button className="share-btn clock-result-share" type="button" onClick={() => shareClockResult(timezoneShareText)}>
                                    <i className="fa-solid fa-share-nodes"></i> {labels.share}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </article>}

            <PublicAdSlot configData={configData} slotName="clockBottom" label={labels.ad} />
            {children}
            {!isStandalone && <ToolFaqSection items={clockFaqItems} title={lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'} />}

        </section>
    );
}
