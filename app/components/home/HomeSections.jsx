'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

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

    return (
        <div className="events-wrapper">
            <div className="events-header">
                <h3 className="section-header-title">
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> مواعيد تهمك
                </h3>
                <button className="share-events-btn" onClick={onShare}>
                    <i className="fa-solid fa-share-nodes"></i> مشاركة المواعيد
                </button>
            </div>
            <div className="events-grid">
                {upcomingEvents.map((evt, idx) => (
                    <div className="event-card" key={`${evt.name}-${idx}`} style={{ borderRightColor: evt.color }}>
                        <div className="evt-icon" style={{ backgroundColor: `${evt.color}15`, color: evt.color }}>
                            <i className={`fa-solid ${evt.icon}`}></i>
                        </div>
                        <div className="evt-details">
                            <div className="evt-name">{evt.name}</div>
                            <div className="evt-days">{evt.days === 0 ? 'يصرف/يوافق اليوم!' : `متبقي ${evt.days} يوم`}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ResultCard({ htmlContent, enteredDateInfo, lang, onShare }) {
    return (
        <div className="result-container">
            <div className="result" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            {enteredDateInfo && (
                <div className="story-card">
                    <div className="story-content">
                        <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginInlineEnd: '8px' }}></i>
                        <span style={{ fontWeight: 'bold' }}>{lang === 'ar' ? 'معلومة إضافية:' : 'Date Info:'}</span>
                        <p>{enteredDateInfo.info}</p>
                    </div>
                    <button className="share-btn" onClick={onShare}>
                        <i className="fa-solid fa-share-nodes"></i> {lang === 'ar' ? 'مشاركة النتيجة' : 'Share Result'}
                    </button>
                </div>
            )}
        </div>
    );
}

function DateDropdowns({ values, onChange, dayMax, months, years, labels }) {
    return (
        <div className="date-dropdowns">
            <select value={values.d} onChange={(e) => onChange({ ...values, d: e.target.value })}>
                <option value="">{labels.day}</option>
                {Array.from({ length: dayMax }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
            <select value={values.m} onChange={(e) => onChange({ ...values, m: e.target.value })}>
                <option value="">{labels.month}</option>
                {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                ))}
            </select>
            <select value={values.y} onChange={(e) => onChange({ ...values, y: e.target.value })}>
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

export function AgeCalculatorSection({
    labels,
    lang,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    return (
        <div className="card">
            <h2>{labels.hCalcAge}</h2>
            <div className="split-section">
                <div>
                    <h3>{labels.hGreg}</h3>
                    <label>{labels.lblBirth}</label>
                    <DateDropdowns
                        values={values.gAgeInput}
                        onChange={setters.setGAgeInput}
                        dayMax={31}
                        months={options.gregMonths}
                        years={options.gregAgeYears}
                        labels={labels}
                    />
                    <button className="action-btn" onClick={actions.calculateAgeGreg}>
                        <i className="fa-solid fa-calculator"></i> <span>{labels.btnCalc}</span>
                    </button>
                    <ToolResult value={results.resAgeGreg} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
                <div>
                    <h3>{labels.hHijri}</h3>
                    <label>{labels.lblBirth}</label>
                    <DateDropdowns
                        values={values.hAgeInput}
                        onChange={setters.setHAgeInput}
                        dayMax={30}
                        months={options.hijriMonths}
                        years={options.hijriAgeYears}
                        labels={labels}
                    />
                    <button className="action-btn" onClick={actions.calculateAgeHijri}>
                        <i className="fa-solid fa-calculator"></i> <span>{labels.btnCalc}</span>
                    </button>
                    <ToolResult value={results.resAgeHijri} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
            </div>
        </div>
    );
}

export function DateConversionSection({
    labels,
    lang,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    return (
        <div className="card">
            <h2>{labels.hConv}</h2>
            <div className="split-section">
                <div>
                    <h3>{labels.hG2H}</h3>
                    <label>{labels.lblGreg}</label>
                    <DateDropdowns values={values.gConvInput} onChange={setters.setGConvInput} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} />
                    <button className="action-btn" onClick={actions.convertGregToHijri}>
                        <i className="fa-solid fa-rotate"></i> <span>{labels.btnG2H}</span>
                    </button>
                    <ToolResult value={results.resHijriConv} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
                <div>
                    <h3>{labels.hH2G}</h3>
                    <label>{labels.lblHijri}</label>
                    <DateDropdowns values={values.hConvInput} onChange={setters.setHConvInput} dayMax={30} months={options.hijriMonths} years={options.hijriAgeYears} labels={labels} />
                    <button className="action-btn" onClick={actions.convertHijriToGreg}>
                        <i className="fa-solid fa-rotate"></i> <span>{labels.btnH2G}</span>
                    </button>
                    <ToolResult value={results.resGregConv} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
            </div>
        </div>
    );
}

export function DurationSection({
    labels,
    lang,
    options,
    values,
    setters,
    results,
    enteredDateInfo,
    onShareResult,
    actions,
}) {
    return (
        <div className="card">
            <h2>{labels.hDiff}</h2>
            <div className="split-section">
                <div>
                    <h3>{labels.hDiffGreg}</h3>
                    <label>{labels.lblDate1}</label>
                    <DateDropdowns values={values.gDiffInput1} onChange={setters.setGDiffInput1} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} />
                    <label>{labels.lblDate2}</label>
                    <DateDropdowns values={values.gDiffInput2} onChange={setters.setGDiffInput2} dayMax={31} months={options.gregMonths} years={options.gregConvYears} labels={labels} />
                    <button className="action-btn" onClick={actions.calcDiffGreg}>
                        <i className="fa-solid fa-clock-rotate-left"></i> <span>{labels.btnDiff}</span>
                    </button>
                    <ToolResult value={results.resDiffGreg} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
                <div>
                    <h3>{labels.hDiffHijri}</h3>
                    <label>{labels.lblDate1}</label>
                    <DateDropdowns values={values.hDiffInput1} onChange={setters.setHDiffInput1} dayMax={30} months={options.hijriMonths} years={options.hijriAgeYears} labels={labels} />
                    <label>{labels.lblDate2}</label>
                    <DateDropdowns values={values.hDiffInput2} onChange={setters.setHDiffInput2} dayMax={30} months={options.hijriMonths} years={options.hijriAgeYears} labels={labels} />
                    <button className="action-btn" onClick={actions.calcDiffHijri}>
                        <i className="fa-solid fa-clock-rotate-left"></i> <span>{labels.btnDiff}</span>
                    </button>
                    <ToolResult value={results.resDiffHijri} enteredDateInfo={enteredDateInfo} lang={lang} onShareResult={onShareResult} />
                </div>
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

export function TopAdSlot({ configData, labels }) {
    return (
        <div
            className="ad-placeholder"
            onMouseEnter={() => { window.hoveredAdId = 'google_top'; }}
            onMouseLeave={() => { window.hoveredAdId = null; }}
            data-ad-location="top-banner"
        >
            <AdImage src={configData?.adImages?.top} altText={labels.adBanner1} />
            {!configData?.adImages?.top && (
                <>
                    <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-1147243690926079" data-ad-slot="7882868833" data-ad-format="auto" data-full-width-responsive="true"></ins>
                    <Script id="adsbygoogle-init" strategy="afterInteractive">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
                </>
            )}
        </div>
    );
}

export function FeaturedAdSlot({ configData, labels, onClick }) {
    return (
        <div id="customAdContainer" data-ad-location="middle-banner" onClick={onClick}>
            <Link href="/client" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="ad-placeholder custom-ad-promo">
                    <AdImage src={configData?.adImages?.middle} altText={labels.adPortal} />
                    {!configData?.adImages?.middle && (
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
    return (
        <div className="bottom-banners-grid">
            <div
                className="ad-placeholder"
                onMouseEnter={() => { window.hoveredAdId = 'google_bottom_1'; }}
                onMouseLeave={() => { window.hoveredAdId = null; }}
                data-ad-location="bottom-banner-1"
            >
                <AdImage src={configData?.adImages?.bottom1} altText={labels.adBanner1} />
                {!configData?.adImages?.bottom1 && labels.adBanner1}
            </div>
            <div
                className="ad-placeholder"
                onMouseEnter={() => { window.hoveredAdId = 'google_bottom_2'; }}
                onMouseLeave={() => { window.hoveredAdId = null; }}
                data-ad-location="bottom-banner-2"
            >
                <AdImage src={configData?.adImages?.bottom2} altText={labels.adBanner2} />
                {!configData?.adImages?.bottom2 && labels.adBanner2}
            </div>
        </div>
    );
}

export function SeoSections({ lang }) {
    if (lang !== 'ar') return null;

    return (
        <div className="seo-sections-wrapper">
            <section className="seo-card">
                <h2 className="seo-title"><i className="fa-solid fa-book-open"></i> دليلك لمعرفة أهمية تحويل التواريخ</h2>
                <p className="seo-text">
                    في حياتنا اليومية والعملية، تلعب التواريخ دوراً محورياً في تنظيم التزاماتنا. في المملكة العربية السعودية، تتداخل الاستخدامات بين التقويم الميلادي (المرتبط بالرواتب والأعمال العالمية) والتقويم الهجري (المرتبط بالمناسبات الدينية، الأحوال المدنية، والمعاملات الرسمية).
                </p>
                <p className="seo-text">
                    <strong>لماذا هذه الأداة مفيدة لك؟</strong><br />
                    تتيح لك الأداة التخطيط المسبق لحياتك؛ فمن خلال معرفة عمرك الدقيق تستطيع تحديد مواعيد استحقاقك للخدمات الحكومية (مثل استخراج الهوية، الضمان، أو التقاعد). كما يساعدك تحويل التواريخ في مطابقة العقود الإيجارية والتجارية التي قد تُكتب بتقويم مختلف.
                </p>
            </section>

            <section className="seo-card">
                <h2 className="seo-title"><i className="fa-regular fa-circle-question"></i> الأسئلة الشائعة</h2>
                <div className="faq-item">
                    <h4 className="faq-q">كيف تعمل حاسبة العمر بالهجري والميلادي؟</h4>
                    <p className="faq-a">تقوم الحاسبة بأخذ تاريخ ميلادك، وتقارنه بالتاريخ الحالي. وبناءً على خوارزميات رياضية دقيقة، تستخرج عدد السنوات، ثم الأشهر، والأيام المتبقية لتعطيك عمرك بالتفصيل.</p>
                </div>
                <div className="faq-item">
                    <h4 className="faq-q">هل محول التاريخ الهجري يعتمد على تقويم أم القرى؟</h4>
                    <p className="faq-a">نعم، تم بناء معادلات التحويل في برمجياتنا لتتوافق تماماً مع "تقويم أم القرى" المعتمد رسمياً في المملكة العربية السعودية، لضمان أعلى مستويات الدقة.</p>
                </div>
                <div className="faq-item">
                    <h4 className="faq-q">ما الفرق الأساسي بين السنة الكبيسة والبسيطة؟</h4>
                    <p className="faq-a">السنة الميلادية البسيطة عدد أيامها 365 يوماً، بينما السنة الكبيسة تحدث كل 4 سنوات وعدد أيامها 366 يوماً (يُضاف يوم لشهر فبراير). أداتنا تأخذ هذه التغيرات في الحسبان تلقائياً.</p>
                </div>
            </section>
        </div>
    );
}
