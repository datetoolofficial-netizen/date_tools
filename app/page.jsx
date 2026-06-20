'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Toast from './components/Toast';
import Header from './Header';
import Footer from './Footer';
import {
    AgeCalculatorSection,
    BottomAdSlots,
    DateConversionSection,
    DurationSection,
    EventsSection,
    FeaturedAdSlot,
    SeoSections,
    TodayBanner,
    TopAdSlot,
} from './components/home/HomeSections';
import { daysAr, getHijriParts, hijriToGregorian, i18n, monthNames } from './components/home/homeDateUtils';

export default function Home() {
    const [lang, setLang] = useState('ar');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ show: false, msg: '', type: '' });
    const [configData, setConfigData] = useState(null);

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

    const firebaseApiRef = useRef({
        initAndTrackVisit: async () => {},
        trackToolUsage: async () => {},
        trackAdClick: async () => {},
        getSiteConfig: async () => null,
    });

    useEffect(() => {
        let isMounted = true;

        const savedLang = localStorage.getItem('site_lang') || 'ar';
        setLang(savedLang);
        
        const osThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('site_theme');
        setIsDarkMode(savedTheme ? savedTheme === 'dark' : osThemeQuery.matches);

        async function loadFirebaseData() {
            try {
                // مهم: نستورد Firebase داخل المتصفح فقط حتى لا يتم تشغيله داخل Cloudflare Worker أثناء SSR
                const firebaseApi = await import('./firebase');

                firebaseApiRef.current = {
                    initAndTrackVisit: firebaseApi.initAndTrackVisit || (async () => {}),
                    trackToolUsage: firebaseApi.trackToolUsage || (async () => {}),
                    trackAdClick: firebaseApi.trackAdClick || (async () => {}),
                    getSiteConfig: firebaseApi.getSiteConfig || (async () => null),
                };

                await firebaseApiRef.current.initAndTrackVisit();

                const data = await firebaseApiRef.current.getSiteConfig();
                if (isMounted) setConfigData(data || {});
            } catch (error) {
                console.error("Error fetching site config:", error);
                if (isMounted) setConfigData({ events: [] });
            }
        }

        loadFirebaseData();

        // مراقب نقرات الإعلانات (خدعة الـ iframe focus)
        const handleBlur = () => {
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                if (window.hoveredAdId) firebaseApiRef.current.trackAdClick(window.hoveredAdId);
            }
        };

        window.addEventListener('blur', handleBlur);

        return () => {
            isMounted = false;
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    useEffect(() => {
        if (!configData?.faviconUrl) return;

        let icon = document.querySelector("link[rel='icon']");
        if (!icon) {
            icon = document.createElement('link');
            icon.rel = 'icon';
            document.head.appendChild(icon);
        }

        icon.href = configData.faviconUrl;
    }, [configData?.faviconUrl]);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        if (isDarkMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, [lang, isDarkMode]);

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('site_lang', newLang);
        clearResults();
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('site_theme', newTheme ? 'dark' : 'light');
    };

    const clearResults = () => {
        setResAgeGreg(null); setResAgeHijri(null); setResHijriConv(null);
        setResGregConv(null); setResDiffGreg(null); setResDiffHijri(null);
        setEnteredDateInfo(null);
    }

    const showNotification = (messageKey, type = 'error') => {
        setAlertConfig({ show: true, msg: i18n[lang][messageKey] || messageKey, type });
        setTimeout(() => setAlertConfig({ show: false, msg: '', type: '' }), 4500);
    };

    const generateTodayAndEvents = useCallback(() => {
        const today = new Date();
        const hParts = getHijriParts(today);
        const currentDayName = daysAr[today.getDay()];
        
        setTodayInfo(`اليوم ${currentDayName}، ${today.getDate()} ${monthNames['ar'].greg[today.getMonth()]} م | ${hParts.d} ${monthNames['ar'].hijri[hParts.m - 1]} هـ`);

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
        
        let shareBody = `📅 *أهم المواعيد القادمة*\n`;
        shareBody += `————————————————\n`;
        
        upcomingEvents.forEach(evt => {
            const daysText = evt.days === 0 ? '🕒 يصرف/يوافق اليوم!' : `⏳ متبقي: ${evt.days} يوم`;
            shareBody += `🔹 *${evt.name}*\n${daysText}\n\n`;
        });
        
        shareBody += `————————————————\n🔗 تابع المواعيد بدقة عبر أدوات التاريخ:\n${window.location.href}`;

        if (navigator.share) {
            try { await navigator.share({ title: 'المواعيد القادمة', text: shareBody }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(shareBody);
            showNotification('تم نسخ القائمة كرسالة نصية!', 'info');
        }
    };

    const generateDateStory = (gregDate, title, rawResultText) => {
        const dName = daysAr[gregDate.getDay()];
        const m = gregDate.getMonth() + 1;
        let season = '';
        if(m >= 3 && m <= 5) season = 'الربيع 🌸';
        else if(m >= 6 && m <= 8) season = 'الصيف ☀️';
        else if(m >= 9 && m <= 11) season = 'الخريف 🍂';
        else season = 'الشتاء ❄️';

        const isLeap = new Date(gregDate.getFullYear(), 1, 29).getMonth() === 1 ? 'نعم' : 'لا';
        const info = `يوافق يوم ${dName} • فصل ${season} • سنة كبيسة: ${isLeap}`;
        
        const shareText = `*أدوات التاريخ الشاملة* 📅\n\n📌 ${title}\nالنتيجة: ${rawResultText}\n\n💡 هل تعلم؟\nهذا التاريخ يوافق يوم ${dName} وكان في فصل ${season}.\n\n🔗 جرب الأداة بنفسك:\n${window.location.href}`;
        setEnteredDateInfo({ title, info, shareText });
    };

    const handleShareResult = async () => {
        if (!enteredDateInfo) return;
        if (navigator.share) {
            try { await navigator.share({ title: 'نتيجة أدوات التاريخ', text: enteredDateInfo.shareText }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(enteredDateInfo.shareText);
            showNotification('تم نسخ النتيجة للمشاركة!', 'info');
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
        generateDateStory(birthDate, 'حساب العمر (ميلادي)', durationStr);
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
        generateDateStory(gregEquivalent, 'حساب العمر (هجري)', durationStr);
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
        generateDateStory(gDate, 'تحويل ميلادي إلى هجري', hDate);
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
        const suffix = lang === 'ar' ? ' م' : '';
        const finalRes = `${gDateFormatted}${suffix}`;
        
        setResGregConv(`${i18n[lang].resH2G} <br><span style="color:inherit;">${finalRes}</span>`);
        generateDateStory(gDateObj, 'تحويل هجري إلى ميلادي', finalRes);
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

    return (
        <>
            <Toast
                message={alertConfig.msg}
                type={alertConfig.type}
                visible={alertConfig.show}
                onClose={() => setAlertConfig({ show: false, msg: '', type: '' })}
            />

            <div className="container">
                <Header
                    lang={lang}
                    isDarkMode={isDarkMode}
                    toggleLang={toggleLang}
                    toggleTheme={toggleTheme}
                    config={configData}
                />

                <TodayBanner lang={lang} todayInfo={todayInfo} />
                <TopAdSlot configData={configData} labels={i18n[lang]} />
                <EventsSection lang={lang} upcomingEvents={upcomingEvents} onShare={handleShareEvents} />

                <AgeCalculatorSection
                    labels={i18n[lang]}
                    lang={lang}
                    options={homeOptions}
                    values={homeValues}
                    setters={homeSetters}
                    results={homeResults}
                    enteredDateInfo={enteredDateInfo}
                    onShareResult={handleShareResult}
                    actions={homeActions}
                />

                <FeaturedAdSlot
                    configData={configData}
                    labels={i18n[lang]}
                    onClick={() => firebaseApiRef.current.trackAdClick('custom_promo_middle')}
                />

                <DateConversionSection
                    labels={i18n[lang]}
                    lang={lang}
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
                    lang={lang}
                    options={homeOptions}
                    values={homeValues}
                    setters={homeSetters}
                    results={homeResults}
                    enteredDateInfo={enteredDateInfo}
                    onShareResult={handleShareResult}
                    actions={homeActions}
                />

                <BottomAdSlots configData={configData} labels={i18n[lang]} />
                <SeoSections lang={lang} />
            </div>
            <Footer lang={lang} config={configData} />
        </>
    );
}
