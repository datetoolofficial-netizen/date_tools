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
    const {
        firebaseApiRef,
        currentLocation,
        locationStatus,
        locationError,
        requestCurrentLocation,
    } = useSiteContext();
    const [now, setNow] = useState(() => new Date());
    const [inputTime, setInputTime] = useState('13:30');
    const [cityZone, setCityZone] = useState('Asia/Riyadh');
    const [fromZone, setFromZone] = useState('Asia/Riyadh');
    const [toZone, setToZone] = useState('Europe/London');
    const [locationLabel, setLocationLabel] = useState('الرياض');
    const [showLocationNotice, setShowLocationNotice] = useState(false);

    useEffect(() => {
        firebaseApiRef.current.trackToolUsage('clockTools');
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, [firebaseApiRef]);

    useEffect(() => {
        setShowLocationNotice(locationStatus !== 'granted');
    }, [locationStatus]);

    useEffect(() => {
        if (!currentLocation) return;
        setCityZone(currentLocation.timezone);
        setFromZone(currentLocation.timezone);
        setLocationLabel(currentLocation.label || 'موقعك الحالي');
    }, [currentLocation]);

    const convertedTime = useMemo(() => {
        const [rawHour, rawMinute] = inputTime.split(':').map(Number);
        if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return 'أدخل وقتًا صحيحًا';

        const hour = rawHour % 24;
        const suffix = hour >= 12 ? 'م' : 'ص';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${String(rawMinute).padStart(2, '0')} ${suffix}`;
    }, [inputTime]);

    const handleUseCurrentLocation = async () => {
        const location = await requestCurrentLocation();
        if (!location?.timezone) return;

        setCityZone(location.timezone);
        setFromZone(location.timezone);
        setLocationLabel(location.label || 'موقعك الحالي');
        setShowLocationNotice(false);
    };

    const diff = Math.round((getOffsetHours(toZone, now) - getOffsetHours(fromZone, now)) * 10) / 10;

    return (
        <section className="tools-page">
            {showLocationNotice && (
                <div className="location-permission-toast" role="status">
                    <i className="fa-solid fa-location-crosshairs"></i>
                    <div>
                        <strong>اعرض وقت مدينتك الحالية</strong>
                        <p>اضغط موافقة، ثم وافق من نافذة المتصفح لعرض وقت مدينتك بدون حفظ موقعك.</p>
                        {locationError && <small>{locationError}</small>}
                    </div>
                    <button type="button" onClick={handleUseCurrentLocation} disabled={locationStatus === 'loading'}>
                        {locationStatus === 'loading' ? 'جاري التحقق...' : 'موافقة'}
                    </button>
                </div>
            )}

            <div className="tools-hero clock-hero">
                <i className="fa-solid fa-clock"></i>
                <div>
                    <h2>أدوات الساعة والوقت</h2>
                    <p>تحويل نظام الساعة، معرفة الوقت الحالي، وحساب فرق التوقيت بسرعة.</p>
                </div>
            </div>

            <div className="today-info-banner clock-now-banner">
                <div className="today-content">
                    <i className="fa-regular fa-clock"></i>
                    <span>الساعة الآن في {locationLabel}</span>
                    <strong>{formatTime(now, cityZone)}</strong>
                </div>
            </div>

            <article className="tool-widget time-converter-card">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-repeat"></i>
                    <h3>تحويل الساعة من 24 إلى 12</h3>
                </div>
                <input
                    className="time-converter-input"
                    type="time"
                    value={inputTime}
                    onChange={(event) => setInputTime(event.target.value)}
                    aria-label="الوقت بنظام 24 ساعة"
                />
                <div className="tool-result">{convertedTime}</div>
            </article>

            <article className="tool-widget">
                <div className="tool-widget-title">
                    <i className="fa-solid fa-code-compare"></i>
                    <h3>فرق التوقيت بين مدينتين</h3>
                </div>
                <div className="tool-grid two-columns compact">
                    <select value={fromZone} onChange={(event) => setFromZone(event.target.value)}>
                        {cities.map((city) => <option key={`${city.name}-${city.zone}-from`} value={city.zone}>{city.name}</option>)}
                        {currentLocation?.timezone && (
                            <option value={currentLocation.timezone}>{currentLocation.label || 'موقعك الحالي'}</option>
                        )}
                    </select>
                    <select value={toZone} onChange={(event) => setToZone(event.target.value)}>
                        {cities.map((city) => <option key={`${city.name}-${city.zone}-to`} value={city.zone}>{city.name}</option>)}
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
