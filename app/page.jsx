'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Toast from './components/Toast';
import PublicAdSlot from './components/PublicAdSlot';
import { getSafeCurrentUrl } from './privacyConsent';
import { useSiteContext } from './SiteContext';
import {
    buildDateStory,
    buildEventsShareText,
    daysAr,
    getSeasonKey,
    getTodayInfo,
    i18n,
    monthNames,
} from './i18n';
import {
    AgeCalculatorSection,
    DateConversionSection,
    DurationSection,
    EventsSection,
    SeoSections,
    TodayBanner,
} from './components/home/HomeSections';
import { getHijriParts, hijriToGregorian } from './components/home/homeDateUtils';
import { getToolFaqs, getToolSettings } from './toolSettings';

function SkeletonBlock({ className = '' }) {
    return <span className={`skeleton-block ${className}`} aria-hidden="true" />;
}

function HomePageSkeleton() {
    return (
        <div className="home-skeleton" aria-busy="true" aria-label="جاري تحميل الصفحة">
            <div className="skeleton-header-panel">
                <div className="skeleton-brand-row">
                    <SkeletonBlock className="skeleton-logo" />
                    <div className="skeleton-title-stack">
                        <SkeletonBlock className="skeleton-title-line" />
                        <SkeletonBlock className="skeleton-subtitle-line" />
                    </div>
                </div>
                <div className="skeleton-controls">
                    <SkeletonBlock className="skeleton-icon-btn" />
                    <SkeletonBlock className="skeleton-icon-btn" />
                </div>
            </div>

            <div className="skeleton-nav-row">
                <SkeletonBlock className="skeleton-pill is-wide" />
                <SkeletonBlock className="skeleton-pill" />
                <SkeletonBlock className="skeleton-pill" />
            </div>

            <SkeletonBlock className="skeleton-today-banner" />
            <SkeletonBlock className="skeleton-ad-box" />

            <div className="skeleton-events-head">
                <SkeletonBlock className="skeleton-pill" />
                <SkeletonBlock className="skeleton-section-title" />
            </div>
            <div className="skeleton-events-grid">
                <SkeletonBlock className="skeleton-event-card" />
                <SkeletonBlock className="skeleton-event-card" />
            </div>

            <div className="skeleton-tool-card">
                <SkeletonBlock className="skeleton-section-title centered" />
                <div className="skeleton-switch-row">
                    <SkeletonBlock className="skeleton-pill" />
                    <SkeletonBlock className="skeleton-pill" />
                </div>
                <div className="skeleton-input-row">
                    <SkeletonBlock className="skeleton-input" />
                    <SkeletonBlock className="skeleton-input" />
                    <SkeletonBlock className="skeleton-input" />
                </div>
                <SkeletonBlock className="skeleton-action" />
            </div>
        </div>
    );
}

export default function Home() {
    const { lang, configData, isSiteLoading, firebaseApiRef } = useSiteContext();
    const [alertConfig, setAlertConfig] = useState({ show: false, msg: '', type: '' });
    const [ageCalendarMode, setAgeCalendarMode] = useState('gregorian');
    const [conversionCalendarMode, setConversionCalendarMode] = useState('gregorian');
    const [durationCalendarMode, setDurationCalendarMode] = useState('gregorian');

    const [gAgeInput, setGAgeInput] = useState({ d: '', m: '', y: '' });
    const [hAgeInput, setHAgeInput] = useState({ d: '', m: '', y: '' });
    const [gConvInput, setGConvInput] = useState({ d: '', m: '', y: '' });
    const [hConvInput, setHConvInput] = useState({ d: '', m: '', y: '' });
    const [gDiffInput1, setGDiffInput1] = useState({ d: '', m: '', y: '' });
    const [gDiffInput2, setGDiffInput2] = useState({ d: '', m: '', y: '' });
    const [hDiffInput1, setHDiffInput1] = useState({ d: '', m: '', y: '' });
    const [hDiffInput2, setHDiffInput2] = useState({ d: '', m: '', y: '' });

    const [resAgeGreg, setResAgeGreg] = useState(null);
    const [resAgeHijri, setResAgeHijri] = useState(null);
    const [resHijriConv, setResHijriConv] = useState(null);
    const [resGregConv, setResGregConv] = useState(null);
    const [resDiffGreg, setResDiffGreg] = useState(null);
    const [resDiffHijri, setResDiffHijri] = useState(null);

    const [todayInfo, setTodayInfo] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [enteredDateInfo, setEnteredDateInfo] = useState(null);

    const trackedAdImpressionsRef = useRef(new Set());

    useEffect(() => {
        if (!configData || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

        const adNodes = Array.from(document.querySelectorAll('[data-ad-id]'));
        if (adNodes.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const adId = entry.target.getAttribute('data-ad-id');
                if (!adId || trackedAdImpressionsRef.current.has(adId)) return;

                trackedAdImpressionsRef.current.add(adId);
                firebaseApiRef.current.trackAdImpression(adId);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        adNodes.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, [configData, firebaseApiRef]);

    const clearResults = () => {
        setResAgeGreg(null); setResAgeHijri(null); setResHijriConv(null);
        setResGregConv(null); setResDiffGreg(null); setResDiffHijri(null);
        setEnteredDateInfo(null);
    };

    const setToolCalendarMode = (setter, mode) => {
        setter(mode);
        clearResults();
    };

    const showNotification = (messageKey, type = 'error') => {
        setAlertConfig({ show: true, msg: i18n[lang][messageKey] || messageKey, type });
        setTimeout(() => setAlertConfig({ show: false, msg: '', type: '' }), 4500);
    };

    const generateTodayAndEvents = useCallback(() => {
        const today = new Date();
        const hParts = getHijriParts(today);
        const currentDayName = daysAr[today.getDay()];
        
        setTodayInfo(getTodayInfo({
            dayName: currentDayName,
            gregDay: today.getDate(),
            gregMonth: monthNames.ar.greg[today.getMonth()],
            hijriDay: hParts.d,
            hijriMonth: monthNames.ar.hijri[hParts.m - 1],
        }));

        let events = [];
        const maxDays = 60; 

        if (configData && configData.events) {
            configData.events.forEach(evt => {
                if (!evt.active || !evt.date) return;
                
                let targetGregDate;
                const dParts = evt.date.split('-'); 
                let eY = parseInt(dParts[0]), eM = parseInt(dParts[1]), eD = parseInt(dParts[2]);

                if (evt.calendar === 'hijri') {
                    if (evt.repeat === 'yearly') {
                        eY = hParts.y;
                        if (eM < hParts.m || (eM === hParts.m && eD < hParts.d)) eY++;
                    } else if (evt.repeat === 'monthly') {
                        eY = hParts.y; eM = hParts.m;
                        if (eD < hParts.d) { eM++; if (eM > 12) { eM = 1; eY++; } }
                    }
                    targetGregDate = hijriToGregorian(eY, eM, eD);
                } else {
                    eM = eM - 1; 
                    if (evt.repeat === 'yearly') {
                        eY = today.getFullYear();
                        if (new Date(eY, eM, eD) < new Date(today.getFullYear(), today.getMonth(), today.getDate())) eY++;
                    } else if (evt.repeat === 'monthly') {
                        eY = today.getFullYear(); eM = today.getMonth();
                        if (new Date(eY, eM, eD) < new Date(today.getFullYear(), today.getMonth(), today.getDate())) { eM++; if (eM > 11) { eM = 0; eY++; } }
                    }
                    targetGregDate = new Date(eY, eM, eD);
                }

                let diff = Math.ceil((targetGregDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (diff >= 0 && diff <= maxDays) {
                    events.push({ name: evt.name, days: diff, icon: evt.icon, color: evt.color });
                }
            });
        }

        events.sort((a, b) => a.days - b.days);
        setUpcomingEvents(events);
    }, [configData]);

    useEffect(() => {
        if (configData) generateTodayAndEvents();
    }, [configData, generateTodayAndEvents]);

    const handleShareEvents = async () => {
        if (upcomingEvents.length === 0) return;
        
        const labels = i18n[lang] || i18n.ar;
        const shareBody = buildEventsShareText(lang, upcomingEvents, getSafeCurrentUrl());

        if (navigator.share) {
            try { await navigator.share({ title: labels.shareEventsTitle, text: shareBody }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(shareBody);
            showNotification('eventsCopied', 'info');
        }
    };

    const generateDateStory = (gregDate, title, rawResultText) => {
        const dName = daysAr[gregDate.getDay()];
        const m = gregDate.getMonth() + 1;
        const isLeap = new Date(gregDate.getFullYear(), 1, 29).getMonth() === 1;
        const { info, shareText } = buildDateStory(lang, {
            dayName: dName,
            seasonKey: getSeasonKey(m),
            isLeap,
            title,
            rawResultText,
            url: getSafeCurrentUrl(),
        });
        setEnteredDateInfo({ title, info, shareText });
    };

    const handleShareResult = async () => {
        if (!enteredDateInfo) return;
        const labels = i18n[lang] || i18n.ar;
        if (navigator.share) {
            try { await navigator.share({ title: labels.shareResultTitle, text: enteredDateInfo.shareText }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(enteredDateInfo.shareText);
            showNotification('resultCopied', 'info');
        }
    };

    const formatDuration = (years, months, days) => {
        const dict = i18n[lang];
        const formatPart = (val, s, d, p, dp) => {
            if (val === 0) return "";
            if (lang === 'en') return val === 1 ? `1 ${s}` : `${val} ${p}`;
            if (val === 1) return s; if (val === 2) return d;
            if (val >= 3 && val <= 10) return `${val} ${p}`;
            return `${val} ${dp}`;
        };
        const parts = [
            formatPart(years, dict.y1, dict.y2, dict.y3, dict.y4),
            formatPart(months, dict.m1, dict.m2, dict.m3, dict.m4),
            formatPart(days, dict.d1, dict.d2, dict.d3, dict.d4)
        ].filter(p => p !== "");
        return parts.length === 0 ? dict.sameDay : parts.join(dict.and);
    };

    const getExactDifference = (d1, d2) => {
        const start = new Date(Math.min(d1.getTime(), d2.getTime()));
        const end = new Date(Math.max(d1.getTime(), d2.getTime()));
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();
        if (days < 0) { months--; const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); days += prevMonth.getDate(); }
        if (months < 0) { years--; months += 12; }
        return { years, months, days };
    };

    const calculateAgeGreg = () => {
        clearResults();
        const { d, m, y } = gAgeInput;
        if (!d || !m || !y) return showNotification("errSelect");
        const birthDate = new Date(`${y}-${m}-${d}`); const today = new Date();
        if (birthDate > today) return showNotification("errFuture");
        const diff = getExactDifference(birthDate, today);
        const durationStr = formatDuration(diff.years, diff.months, diff.days);
        
        setResAgeGreg(`${i18n[lang].resAge} <br><span style="color:inherit;">${durationStr}</span>`);
        generateDateStory(birthDate, i18n[lang].storyAgeGreg, durationStr);
        firebaseApiRef.current.trackToolUsage('ageCalc');
    };

    const calculateAgeHijri = () => {
        clearResults();
        const { d, m, y } = hAgeInput;
        if (!d || !m || !y) return showNotification("errSelect");
        const bDay = parseInt(d), bMonth = parseInt(m), bYear = parseInt(y);
        const tp = getHijriParts(new Date()); 
        const tDay = tp.d, tMonth = tp.m, tYear = tp.y;
        
        if (bYear > tYear || (bYear === tYear && bMonth > tMonth) || (bYear === tYear && bMonth === tMonth && bDay > tDay)) return showNotification("errFuture");
        
        let years = tYear - bYear, months = tMonth - bMonth, days = tDay - bDay;
        if (days < 0) { months--; days += 30; } 
        if (months < 0) { years--; months += 12; }
        
        const durationStr = formatDuration(years, months, days);
        setResAgeHijri(`${i18n[lang].resAgeH} <br><span style="color:inherit;">${durationStr}</span>`);
        
        const gregEquivalent = hijriToGregorian(bYear, bMonth, bDay);
        generateDateStory(gregEquivalent, i18n[lang].storyAgeHijri, durationStr);
        firebaseApiRef.current.trackToolUsage('ageCalc');
    };

    const convertGregToHijri = () => {
        clearResults();
        const { d, m, y } = gConvInput;
        if (!d || !m || !y) return showNotification("errSelect");
        const gDate = new Date(`${y}-${m}-${String(d).padStart(2, '0')}`);
        const options = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic-umalqura' };
        const locale = lang === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
        const hDate = new Intl.DateTimeFormat(locale, options).format(gDate);
        
        setResHijriConv(`${i18n[lang].resG2H} <br><span style="color:inherit;">${hDate}</span>`);
        generateDateStory(gDate, i18n[lang].storyGregToHijri, hDate);
        firebaseApiRef.current.trackToolUsage('dateConverter');
    };

    const convertHijriToGreg = () => {
        clearResults();
        const { d, m, y } = hConvInput;
        if (!d || !m || !y) return showNotification("errSelect");
        let gDateObj = hijriToGregorian(parseInt(y), parseInt(m), parseInt(d));
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
        const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
        const gDateFormatted = new Intl.DateTimeFormat(locale, options).format(gDateObj);
        const suffix = i18n[lang].gregorianSuffix;
        const finalRes = `${gDateFormatted}${suffix}`;
        
        setResGregConv(`${i18n[lang].resH2G} <br><span style="color:inherit;">${finalRes}</span>`);
        generateDateStory(gDateObj, i18n[lang].storyHijriToGreg, finalRes);
        firebaseApiRef.current.trackToolUsage('dateConverter');
    };

    const calcDiffGreg = () => {
        clearResults();
        const { d: d1, m: m1, y: y1 } = gDiffInput1;
        const { d: d2, m: m2, y: y2 } = gDiffInput2;
        if (!d1 || !m1 || !y1 || !d2 || !m2 || !y2) return showNotification("errSelect");
        const date1 = new Date(`${y1}-${m1}-${d1}`);
        const date2 = new Date(`${y2}-${m2}-${d2}`);
        const diff = getExactDifference(date1, date2);
        const durationStr = formatDuration(diff.years, diff.months, diff.days);
        
        setResDiffGreg(`${i18n[lang].resDiffText} <br><span style="color:inherit;">${durationStr}</span>`);
        setEnteredDateInfo(null);
        firebaseApiRef.current.trackToolUsage('durationCalc');
    };

    const calcDiffHijri = () => {
        clearResults();
        const { d: d1Val, m: m1Val, y: y1Val } = hDiffInput1;
        const { d: dh2Val, m: mh2Val, y: yh2Val } = hDiffInput2;
        if (!d1Val || !m1Val || !y1Val || !dh2Val || !mh2Val || !yh2Val) return showNotification("errSelect");
        
        let y1 = parseInt(y1Val), m1 = parseInt(m1Val), d1 = parseInt(d1Val); 
        let y2 = parseInt(yh2Val), m2 = parseInt(mh2Val), d2 = parseInt(dh2Val);
        
        if (y1 > y2 || (y1 === y2 && m1 > m2) || (y1 === y2 && m1 === m2 && d1 > d2)) { 
            let ty = y1, tm = m1, td = d1; 
            y1 = y2; m1 = m2; d1 = d2; 
            y2 = ty; m2 = tm; d2 = td; 
        }
        
        let years = y2 - y1, months = m2 - m1, days = d2 - d1;
        if (days < 0) { months--; days += 30; } 
        if (months < 0) { years--; months += 12; }
        
        const durationStr = formatDuration(years, months, days);
        setResDiffHijri(`${i18n[lang].resDiffText} <br><span style="color:inherit;">${durationStr}</span>`);
        setEnteredDateInfo(null);
        firebaseApiRef.current.trackToolUsage('durationCalc');
    };

    const makeYears = (start, end) => {
        const years = [];
        for (let year = start; year >= end; year -= 1) years.push(year);
        return years;
    };

    const homeOptions = {
        gregMonths: monthNames[lang].greg.map((label, index) => ({
            label,
            value: String(index + 1).padStart(2, '0'),
        })),
        hijriMonths: monthNames[lang].hijri.map((label, index) => ({
            label,
            value: index + 1,
        })),
        gregAgeYears: makeYears(2026, 1900),
        gregConvYears: makeYears(2026, 1900),
        hijriAgeYears: makeYears(1447, 1300),
    };

    const homeValues = {
        gAgeInput,
        hAgeInput,
        gConvInput,
        hConvInput,
        gDiffInput1,
        gDiffInput2,
        hDiffInput1,
        hDiffInput2,
    };

    const homeSetters = {
        setGAgeInput,
        setHAgeInput,
        setGConvInput,
        setHConvInput,
        setGDiffInput1,
        setGDiffInput2,
        setHDiffInput1,
        setHDiffInput2,
    };

    const homeResults = {
        resAgeGreg,
        resAgeHijri,
        resHijriConv,
        resGregConv,
        resDiffGreg,
        resDiffHijri,
    };

    const homeActions = {
        calculateAgeGreg,
        calculateAgeHijri,
        convertGregToHijri,
        convertHijriToGreg,
        calcDiffGreg,
        calcDiffHijri,
    };

    const isPageLoading = isSiteLoading || configData === null;
    const dateToolSettings = getToolSettings(configData, 'date');
    const dateFaqItems = getToolFaqs(configData, 'date', i18n.ar.seo.faq);

    return (
        <>
            <Toast
                message={alertConfig.msg}
                type={alertConfig.type}
                visible={alertConfig.show}
                onClose={() => setAlertConfig({ show: false, msg: '', type: '' })}
            />

            {isPageLoading ? (
                <HomePageSkeleton />
            ) : (
                <>
                        <div className="tools-hero date-tools-hero">
                            <i className="fa-solid fa-calendar-days"></i>
                            <div>
                                <h2>{dateToolSettings.heroTitle || i18n[lang].pageTitle}</h2>
                                <p>{dateToolSettings.heroDescription || i18n[lang].pageDescription}</p>
                            </div>
                        </div>

                        <TodayBanner lang={lang} todayInfo={todayInfo} />
                        <PublicAdSlot configData={configData} slotName="dateTop" label={i18n[lang].adSpace || 'مساحة إعلانية'} />
                        <EventsSection lang={lang} upcomingEvents={upcomingEvents} onShare={handleShareEvents} />

                        <AgeCalculatorSection
                            labels={i18n[lang]}
                            title={dateToolSettings.subtools?.ageCalc}
                            lang={lang}
                            calendarMode={ageCalendarMode}
                            onCalendarModeChange={(mode) => setToolCalendarMode(setAgeCalendarMode, mode)}
                            options={homeOptions}
                            values={homeValues}
                            setters={homeSetters}
                            results={homeResults}
                            enteredDateInfo={enteredDateInfo}
                            onShareResult={handleShareResult}
                            actions={homeActions}
                        />

                        <PublicAdSlot configData={configData} slotName="dateMiddle" label={i18n[lang].featuredAd || 'إعلان مميز'} />

                        <DateConversionSection
                            labels={i18n[lang]}
                            title={dateToolSettings.subtools?.dateConverter}
                            lang={lang}
                            calendarMode={conversionCalendarMode}
                            onCalendarModeChange={(mode) => setToolCalendarMode(setConversionCalendarMode, mode)}
                            options={homeOptions}
                            values={homeValues}
                            setters={homeSetters}
                            results={homeResults}
                            enteredDateInfo={enteredDateInfo}
                            onShareResult={handleShareResult}
                            actions={homeActions}
                        />

                        <DurationSection
                            labels={i18n[lang]}
                            title={dateToolSettings.subtools?.durationCalc}
                            lang={lang}
                            calendarMode={durationCalendarMode}
                            onCalendarModeChange={(mode) => setToolCalendarMode(setDurationCalendarMode, mode)}
                            options={homeOptions}
                            values={homeValues}
                            setters={homeSetters}
                            results={homeResults}
                            enteredDateInfo={enteredDateInfo}
                            onShareResult={handleShareResult}
                            actions={homeActions}
                        />

                        <PublicAdSlot configData={configData} slotName="dateBottom" label={i18n[lang].adSpace || 'مساحة إعلانية'} />
                        <SeoSections lang={lang} faqs={dateFaqItems} />
                </>
            )}
        </>
    );
}
