'use client';

import { useEffect, useMemo, useState } from 'react';
import PublicAdSlot from '../components/PublicAdSlot';
import ToolFaqSection from '../components/ToolFaqSection';
import { useSiteContext } from '../SiteContext';
import { getToolFaqs, getToolSettings } from '../toolSettings';

const cities = [
    { name: 'الرياض', zone: 'Asia/Riyadh' },
    { name: 'مكة', zone: 'Asia/Riyadh' },
    { name: 'دبي', zone: 'Asia/Dubai' },
    { name: 'القاهرة', zone: 'Africa/Cairo' },
    { name: 'لندن', zone: 'Europe/London' },
    { name: 'نيويورك', zone: 'America/New_York' },
    { name: 'طوكيو', zone: 'Asia/Tokyo' },
];

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

function formatTime(date, zone, hour12 = false) {
    return new Intl.DateTimeFormat('ar-SA', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12,
    }).format(date);
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
    const [fromZone, setFromZone] = useState('Asia/Riyadh');
    const [toZone, setToZone] = useState('Europe/London');
    const [locationLabel, setLocationLabel] = useState('الرياض');
    const [clockHour12, setClockHour12] = useState(false);
    const [timezoneDiff, setTimezoneDiff] = useState('');

    useEffect(() => {
        firebaseApiRef.current.trackToolUsage('clockTools');
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, [firebaseApiRef]);

    useEffect(() => {
        if (!currentLocation) return;
        setCityZone(currentLocation.timezone);
        setFromZone(currentLocation.timezone);
        setLocationLabel(currentLocation.label || 'موقعك الحالي');
        setTimezoneDiff('');
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

    const calculateTimezoneDiff = () => {
        const diff = Math.round((getOffsetHours(toZone, now) - getOffsetHours(fromZone, now)) * 10) / 10;
        setTimezoneDiff(diff === 0 ? 'نفس الوقت' : `${Math.abs(diff)} ساعة ${diff > 0 ? 'أمام' : 'خلف'}`);
        firebaseApiRef.current.trackToolUsage('clockTools');
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
                <div className="time-select-grid">
                    <label>
                        <span>الساعة</span>
                        <select value={inputHour} onChange={(event) => { setInputHour(event.target.value); setConvertedTime(''); }}>
                            {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                        </select>
                    </label>
                    <label>
                        <span>الدقيقة</span>
                        <select value={inputMinute} onChange={(event) => { setInputMinute(event.target.value); setConvertedTime(''); }}>
                            {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                        </select>
                    </label>
                </div>
                <button className="action-btn" type="button" onClick={calculateTimeConversion}>
                    <i className="fa-solid fa-clock"></i> <span>تحويل</span>
                </button>
                {convertedTime && <div className="tool-result">{convertedTime}</div>}
            </article>

            <PublicAdSlot configData={configData} slotName="clockMiddle" label="إعلان وسط الساعة" />

            <article className="tool-widget">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-code-compare"></i>
                    <h3>{clockSettings.subtools?.timezoneDiff}</h3>
                </div>
                <div className="tool-grid two-columns compact">
                    <select value={fromZone} onChange={(event) => { setFromZone(event.target.value); setTimezoneDiff(''); }}>
                        {cities.map((city) => <option key={`${city.name}-${city.zone}-from`} value={city.zone}>{city.name}</option>)}
                        {currentLocation?.timezone && (
                            <option value={currentLocation.timezone}>{currentLocation.label || 'موقعك الحالي'}</option>
                        )}
                    </select>
                    <select value={toZone} onChange={(event) => { setToZone(event.target.value); setTimezoneDiff(''); }}>
                        {cities.map((city) => <option key={`${city.name}-${city.zone}-to`} value={city.zone}>{city.name}</option>)}
                    </select>
                </div>
                <button className="action-btn" type="button" onClick={calculateTimezoneDiff}>
                    <i className="fa-solid fa-code-compare"></i> <span>احسب</span>
                </button>
                {timezoneDiff && <div className="tool-result">فرق التوقيت: {timezoneDiff}</div>}
            </article>

            <PublicAdSlot configData={configData} slotName="clockBottom" label="إعلان أسفل الساعة" />
            <ToolFaqSection items={clockFaqItems} />

        </section>
    );
}
