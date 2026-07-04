'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSiteContext } from '../SiteContext';

const cities = [
    { name: 'الرياض', zone: 'Asia/Riyadh' },
    { name: 'مكة', zone: 'Asia/Riyadh' },
    { name: 'دبي', zone: 'Asia/Dubai' },
    { name: 'القاهرة', zone: 'Africa/Cairo' },
    { name: 'لندن', zone: 'Europe/London' },
    { name: 'نيويورك', zone: 'America/New_York' },
    { name: 'طوكيو', zone: 'Asia/Tokyo' },
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
    const { firebaseApiRef } = useSiteContext();
    const [now, setNow] = useState(() => new Date());
    const [inputTime, setInputTime] = useState('13:30');
    const [sourceFormat, setSourceFormat] = useState('24');
    const [cityZone, setCityZone] = useState('Asia/Riyadh');
    const [fromZone, setFromZone] = useState('Asia/Riyadh');
    const [toZone, setToZone] = useState('Europe/London');

    useEffect(() => {
        firebaseApiRef.current.trackToolUsage('clockTools');
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, [firebaseApiRef]);

    const convertedTime = useMemo(() => {
        const [rawHour, rawMinute] = inputTime.split(':').map(Number);
        if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return 'أدخل وقتًا صحيحًا';

        if (sourceFormat === '24') {
            const hour = rawHour % 24;
            const suffix = hour >= 12 ? 'م' : 'ص';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${String(rawMinute).padStart(2, '0')} ${suffix}`;
        }

        const suffix = rawHour >= 12 ? 'م' : 'ص';
        return `${String(rawHour).padStart(2, '0')}:${String(rawMinute).padStart(2, '0')} بنظام 24 ساعة (${suffix})`;
    }, [inputTime, sourceFormat]);

    const diff = Math.round((getOffsetHours(toZone, now) - getOffsetHours(fromZone, now)) * 10) / 10;
    const selectedCity = cities.find((city) => city.zone === cityZone) || cities[0];

    return (
        <section className="tools-page">
            <div className="tools-hero">
                <i className="fa-solid fa-clock"></i>
                <div>
                    <h2>أدوات الساعة والوقت</h2>
                    <p>تحويل نظام الساعة، معرفة الوقت في المدن، وحساب فرق التوقيت بسرعة.</p>
                </div>
            </div>

            <div className="tool-grid two-columns">
                <article className="tool-widget">
                    <div className="tool-widget-title">
                        <i className="fa-solid fa-repeat"></i>
                        <h3>تحويل الساعة 24 / 12</h3>
                    </div>
                    <div className="segmented-control">
                        <button className={sourceFormat === '24' ? 'active' : ''} onClick={() => setSourceFormat('24')}>24 ساعة</button>
                        <button className={sourceFormat === '12' ? 'active' : ''} onClick={() => setSourceFormat('12')}>12 ساعة</button>
                    </div>
                    <input type="time" value={inputTime} onChange={(event) => setInputTime(event.target.value)} />
                    <div className="tool-result">{convertedTime}</div>
                </article>

                <article className="tool-widget">
                    <div className="tool-widget-title">
                        <i className="fa-solid fa-earth-asia"></i>
                        <h3>الوقت حسب المدينة</h3>
                    </div>
                    <select value={cityZone} onChange={(event) => setCityZone(event.target.value)}>
                        {cities.map((city) => (
                            <option key={city.name} value={city.zone}>{city.name}</option>
                        ))}
                    </select>
                    <div className="big-time">{formatTime(now, cityZone)}</div>
                    <p className="muted-text">الوقت الحالي في {selectedCity.name}</p>
                </article>
            </div>

            <article className="tool-widget">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-code-compare"></i>
                    <h3>فرق التوقيت بين مدينتين</h3>
                </div>
                <div className="tool-grid two-columns compact">
                    <select value={fromZone} onChange={(event) => setFromZone(event.target.value)}>
                        {cities.map((city) => <option key={city.zone + 'from'} value={city.zone}>{city.name}</option>)}
                    </select>
                    <select value={toZone} onChange={(event) => setToZone(event.target.value)}>
                        {cities.map((city) => <option key={city.zone + 'to'} value={city.zone}>{city.name}</option>)}
                    </select>
                </div>
                <div className="tool-result">
                    فرق التوقيت: {diff === 0 ? 'نفس الوقت' : `${Math.abs(diff)} ساعة ${diff > 0 ? 'أمام' : 'خلف'}`}
                </div>
            </article>

            <div className="ideas-strip">
                <span><i className="fa-solid fa-stopwatch"></i> مؤقت وعد تنازلي لاحقًا</span>
                <span><i className="fa-solid fa-bell"></i> منبه بسيط لاحقًا</span>
                <span><i className="fa-solid fa-business-time"></i> أفضل وقت اجتماع لاحقًا</span>
            </div>
        </section>
    );
}
