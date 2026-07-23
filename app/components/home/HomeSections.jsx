'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getEventDayText, i18n } from '../../i18n';

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{12,20}$/i;
const ADSENSE_SLOT_PATTERN = /^\d{4,20}$/;

function clean(value = '') {
    return String(value || '').trim();
}

function getGoogleAdSlot(configData, slotName) {
    const slotConfig = configData?.googleAdSlots?.[slotName] || {};
    const client = clean(slotConfig.client || configData?.externalIntegrations?.googleAdsenseClient).toLowerCase();
    const slot = clean(slotConfig.slot);

    if (!ADSENSE_CLIENT_PATTERN.test(client) || !ADSENSE_SLOT_PATTERN.test(slot)) {
        return null;
    }

    return {
        client,
        slot,
        format: clean(slotConfig.format) || 'auto',
        fullWidthResponsive: slotConfig.fullWidthResponsive !== false,
        enabledWhenNoAdvertiser: slotConfig.enabledWhenNoAdvertiser === true,
    };
}

export function TodayBanner({ lang, todayInfo }) {
    if (lang !== 'ar') return null;

    return (
        <div className="today-info-banner">
            <div className="today-content">
                <i className="fa-regular fa-calendar-check"></i>
                <span>{todayInfo}</span>
            </div>
        </div>
    );
}

export function EventsSection({ lang, upcomingEvents, onShare }) {
    if (lang !== 'ar' || upcomingEvents.length === 0) return null;
    const labels = i18n[lang] || i18n.ar;

    return (
        <div className="events-wrapper">
            <div className="events-header">
                <h3 className="section-header-title">
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> {labels.eventsTitle}
                </h3>
                <button className="share-events-btn" onClick={onShare}>
                    <i className="fa-solid fa-share-nodes"></i> {labels.shareEvents}
                </button>
            </div>
            <div className="events-grid">
                {upcomingEvents.map((evt, idx) => (
                    <div className="event-card" key={`${evt.name}-${idx}`} style={{ '--event-color': evt.color }}>
                        <div className="evt-icon" style={{ backgroundColor: `${evt.color}15`, color: evt.color }}>
                            <i className={`fa-solid ${evt.icon}`}></i>
                        </div>
                        <div className="evt-details">
                            <div className="evt-name">{evt.name}</div>
                            <div className="evt-days">{getEventDayText(lang, evt.days)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ResultCard({ htmlContent, enteredDateInfo, lang, onShare }) {
    const labels = i18n[lang] || i18n.ar;

    return (
        <div className="result-container">
            <div className="result" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            {enteredDateInfo && (
                <div className="story-card">
                    <div className="story-content">
                        <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginInlineEnd: '8px' }}></i>
                        <span style={{ fontWeight: 'bold' }}>{labels.dateInfo}</span>
                        <p>{enteredDateInfo.info}</p>
                    </div>
                    <button className="share-btn" onClick={onShare}>
                        <i className="fa-solid fa-share-nodes"></i> {enteredDateInfo.shareButtonLabel || labels.shareResult}
                    </button>
                </div>
            )}
        </div>
    );
}

function DateDropdowns({ values, onChange, dayMax, months, years, labels, defaultValues }) {
    const fillMissingDate = () => {
        if (!defaultValues) return;

        const nextValues = {
            d: values.d || defaultValues.d,
            m: values.m || defaultValues.m,
            y: values.y || defaultValues.y,
        };

        if (nextValues.d !== values.d || nextValues.m !== values.m || nextValues.y !== values.y) {
            onChange(nextValues);
        }
    };

    return (
        <div className="date-dropdowns" onFocusCapture={fillMissingDate} onPointerDownCapture={fillMissingDate}>
            <select
                value={values.d}
                onChange={(e) => onChange({ ...values, d: e.target.value })}
                aria-label={labels.day}
                title={labels.day}
            >
                <option value="">{labels.day}</option>
                {Array.from({ length: dayMax }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
            <select
                value={values.m}
                onChange={(e) => onChange({ ...values, m: e.target.value })}
                aria-label={labels.month}
                title={labels.month}
            >
                <option value="">{labels.month}</option>
                {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                ))}
            </select>
            <select
                value={values.y}
                onChange={(e) => onChange({ ...values, y: e.target.value })}
                aria-label={labels.year}
                title={labels.year}
            >
                <option value="">{labels.year}</option>
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
}

function ToolResult({ value, enteredDateInfo, lang, onShareResult }) {
    if (!value) return null;

    return (
        <ResultCard
            htmlContent={value}
            enteredDateInfo={enteredDateInfo}
            lang={lang}
            onShare={onShareResult}
        />
    );
}

function CalendarModeSwitch({ labels, value, onChange }) {
    const options = [
        { value: 'gregorian', label: labels.modeGregorian },
        { value: 'hijri', label: labels.modeHijri },
    ];

    return (
        <div className="calendar-mode-switch" role="tablist" aria-label={labels.calendarMode}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="tab"
                    data-mode={option.value}
                    aria-selected={value === option.value}
                    className={`calendar-mode-btn ${value === option.value ? 'active' : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export function AgeCalculatorSection({
    labels,
    title,
    lang,
    calendarMode,
    onCalendarModeChange,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    const isGregorian = calendarMode === 'gregorian';
    const result = isGregorian ? results.resAgeGreg : results.resAgeHijri;

    return (
        <div className="card">
            <h2>{title || labels.hCalcAge}</h2>
            <div className="tool-mode-card">
                <CalendarModeSwitch labels={labels} value={calendarMode} onChange={onCalendarModeChange} />
                {isGregorian ? (
                    <>
                    <label>{labels.lblBirth}</label>
                    <DateDropdowns
                        values={values.gAgeInput}
                        onChange={setters.setGAgeInput}
                        dayMax={31}
                        months={options.gregMonths}
                        years={options.gregAgeYears}
                        labels={labels}
                        defaultValues={options.todayGregorian}
                    />
                    <button className="action-btn" onClick={actions.calculateAgeGreg}>
                        <i className="fa-solid fa-calculator"></i> <span>{labels.btnCalc}</span>
                    </button>
                    </>
                ) : (
                    <>
                    <label>{labels.lblBirth}</label>
                    <DateDropdowns
                        values={values.hAgeInput}
                        onChange={setters.setHAgeInput}
                        dayMax={30}
                        months={options.hijriMonths}
                        years={options.hijriAgeYears}
                        labels={labels}
                        defaultValues={options.todayHijri}
                    />
                    <button className="action-btn" onClick={actions.calculateAgeHijri}>
                        <i className="fa-solid fa-calculator"></i> <span>{labels.btnCalc}</span>
                    </button>
                    </>
                )}
                <ToolResult value={result} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
            </div>
        </div>
    );
}

export function DateConversionSection({
    labels,
    title,
    lang,
    calendarMode,
    onCalendarModeChange,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    const isGregorian = calendarMode === 'gregorian';
    const result = isGregorian ? results.resHijriConv : results.resGregConv;

    return (
        <div className="card">
            <h2>{title || labels.hConv}</h2>
            <div className="tool-mode-card">
                <CalendarModeSwitch labels={labels} value={calendarMode} onChange={onCalendarModeChange} />
                {isGregorian ? (
                    <>
                    <label>{labels.lblGreg}</label>
                    <DateDropdowns values={values.gConvInput} onChange={setters.setGConvInput} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} defaultValues={options.todayGregorian} />
                    <button className="action-btn" onClick={actions.convertGregToHijri}>
                        <i className="fa-solid fa-rotate"></i> <span>{labels.btnG2H}</span>
                    </button>
                    </>
                ) : (
                    <>
                    <label>{labels.lblHijri}</label>
                    <DateDropdowns values={values.hConvInput} onChange={setters.setHConvInput} dayMax={30} months={options.hijriMonths} years={options.hijriToolYears} labels={labels} defaultValues={options.todayHijri} />
                    <button className="action-btn" onClick={actions.convertHijriToGreg}>
                        <i className="fa-solid fa-rotate"></i> <span>{labels.btnH2G}</span>
                    </button>
                    </>
                )}
                <ToolResult value={result} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
            </div>
        </div>
    );
}

export function DurationSection({
    labels,
    title,
    lang,
    calendarMode,
    onCalendarModeChange,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    const isGregorian = calendarMode === 'gregorian';
    const result = isGregorian ? results.resDiffGreg : results.resDiffHijri;

    return (
        <div className="card">
            <h2>{title || labels.hDiff}</h2>
            <div className="tool-mode-card">
                <CalendarModeSwitch labels={labels} value={calendarMode} onChange={onCalendarModeChange} />
                {isGregorian ? (
                    <>
                    <label>{labels.lblDate1}</label>
                    <DateDropdowns values={values.gDiffInput1} onChange={setters.setGDiffInput1} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} defaultValues={options.todayGregorian} />
                    <label>{labels.lblDate2}</label>
                    <DateDropdowns values={values.gDiffInput2} onChange={setters.setGDiffInput2} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} defaultValues={options.todayGregorian} />
                    <button className="action-btn" onClick={actions.calcDiffGreg}>
                        <i className="fa-solid fa-clock-rotate-left"></i> <span>{labels.btnDiff}</span>
                    </button>
                    </>
                ) : (
                    <>
                    <label>{labels.lblDate1}</label>
                    <DateDropdowns values={values.hDiffInput1} onChange={setters.setHDiffInput1} dayMax={30} months={options.hijriMonths} years={options.hijriToolYears} labels={labels} defaultValues={options.todayHijri} />
                    <label>{labels.lblDate2}</label>
                    <DateDropdowns values={values.hDiffInput2} onChange={setters.setHDiffInput2} dayMax={30} months={options.hijriMonths} years={options.hijriToolYears} labels={labels} defaultValues={options.todayHijri} />
                    <button className="action-btn" onClick={actions.calcDiffHijri}>
                        <i className="fa-solid fa-clock-rotate-left"></i> <span>{labels.btnDiff}</span>
                    </button>
                    </>
                )}
                <ToolResult value={result} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
            </div>
        </div>
    );
}

export function AdImage({ src, altText }) {
    if (!src) return null;

    return (
        <Image
            src={src}
            alt={altText}
            width={728}
            height={180}
            unoptimized
            style={{
                maxWidth: '100%',
                width: 'auto',
                maxHeight: '180px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
            }}
        />
    );
}

function GoogleAdsenseUnit({ ad, scriptId }) {
    if (!ad) return null;

    const encodedClient = encodeURIComponent(ad.client);

    return (
        <>
            <Script
                id={`${scriptId}-loader`}
                strategy="afterInteractive"
                async
                crossOrigin="anonymous"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodedClient}`}
            />
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ad.client}
                data-ad-slot={ad.slot}
                data-ad-format={ad.format}
                data-full-width-responsive={String(ad.fullWidthResponsive)}
            ></ins>
            <Script id={scriptId} strategy="afterInteractive">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
        </>
    );
}

export function TopAdSlot({ configData, labels }) {
    const googleTopAd = getGoogleAdSlot(configData, 'top');

    return (
        <div
            className="ad-placeholder"
            onMouseEnter={() => { window.hoveredAdId = 'google_top'; }}
            onMouseLeave={() => { window.hoveredAdId = null; }}
            data-ad-location="top-banner"
            data-ad-id="google_top"
        >
            <AdImage src={configData?.adImages?.top} altText={labels.adBanner1} />
            {!configData?.adImages?.top && googleTopAd?.enabledWhenNoAdvertiser && (
                <GoogleAdsenseUnit ad={googleTopAd} scriptId="adsbygoogle-top-init" />
            )}
            {!configData?.adImages?.top && !googleTopAd?.enabledWhenNoAdvertiser && labels.adBanner1}
        </div>
    );
}

export function FeaturedAdSlot({ configData, labels, onClick }) {
    const googleMiddleAd = getGoogleAdSlot(configData, 'middle');

    return (
        <div id="customAdContainer" data-ad-location="middle-banner" data-ad-id="custom_promo_middle" onClick={onClick}>
            <Link href="/client" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="ad-placeholder custom-ad-promo">
                    <AdImage src={configData?.adImages?.middle} altText={labels.adPortal} />
                    {!configData?.adImages?.middle && googleMiddleAd?.enabledWhenNoAdvertiser && (
                        <GoogleAdsenseUnit ad={googleMiddleAd} scriptId="adsbygoogle-middle-init" />
                    )}
                    {!configData?.adImages?.middle && !googleMiddleAd?.enabledWhenNoAdvertiser && (
                        <>
                            <i className="fa-solid fa-star"></i> <span>{labels.adPortal}</span> <i className="fa-solid fa-star"></i>
                        </>
                    )}
                </div>
            </Link>
        </div>
    );
}

export function BottomAdSlots({ configData, labels }) {
    const googleBottom1Ad = getGoogleAdSlot(configData, 'bottom1');
    const googleBottom2Ad = getGoogleAdSlot(configData, 'bottom2');

    return (
        <div className="bottom-banners-grid">
            <div
                className="ad-placeholder"
                onMouseEnter={() => { window.hoveredAdId = 'google_bottom_1'; }}
                onMouseLeave={() => { window.hoveredAdId = null; }}
                data-ad-location="bottom-banner-1"
                data-ad-id="google_bottom_1"
            >
                <AdImage src={configData?.adImages?.bottom1} altText={labels.adBanner1} />
                {!configData?.adImages?.bottom1 && googleBottom1Ad?.enabledWhenNoAdvertiser && (
                    <GoogleAdsenseUnit ad={googleBottom1Ad} scriptId="adsbygoogle-bottom-1-init" />
                )}
                {!configData?.adImages?.bottom1 && !googleBottom1Ad?.enabledWhenNoAdvertiser && labels.adBanner1}
            </div>
            <div
                className="ad-placeholder"
                onMouseEnter={() => { window.hoveredAdId = 'google_bottom_2'; }}
                onMouseLeave={() => { window.hoveredAdId = null; }}
                data-ad-location="bottom-banner-2"
                data-ad-id="google_bottom_2"
            >
                <AdImage src={configData?.adImages?.bottom2} altText={labels.adBanner2} />
                {!configData?.adImages?.bottom2 && googleBottom2Ad?.enabledWhenNoAdvertiser && (
                    <GoogleAdsenseUnit ad={googleBottom2Ad} scriptId="adsbygoogle-bottom-2-init" />
                )}
                {!configData?.adImages?.bottom2 && !googleBottom2Ad?.enabledWhenNoAdvertiser && labels.adBanner2}
            </div>
        </div>
    );
}

export function SeoSections({ lang, faqs }) {
    if (lang !== 'ar') return null;
    const seo = i18n.ar.seo;
    const faqItems = Array.isArray(faqs) && faqs.length > 0 ? faqs : seo.faq;

    return (
        <div className="seo-sections-wrapper">
            <section className="seo-card">
                <h2 className="seo-title"><i className="fa-solid fa-book-open"></i> {seo.guideTitle}</h2>
                <p className="seo-text">
                    {seo.guideIntro}
                </p>
                <p className="seo-text">
                    <strong>{seo.guideQuestion}</strong><br />
                    {seo.guideAnswer}
                </p>
            </section>

            <section className="seo-card faq-card">
                <h2 className="seo-title">{seo.faqTitle}</h2>
                {faqItems.map((item) => (
                    <div className="faq-item" key={item.q}>
                        <h4 className="faq-q">{item.q}</h4>
                        <p className="faq-a">{item.a}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
