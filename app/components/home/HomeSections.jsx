'use client';

import { useEffect, useRef } from 'react';
import { getEventDayText, i18n } from '../../i18n';
import { sanitizeHtml } from '../../sanitizeHtml';

export function TodayBanner({ lang, todayInfo }) {
    const [gregorianDate = todayInfo, hijriDate = ''] = String(todayInfo || '')
        .split('|')
        .map((part) => part.trim());

    return (
        <div className="today-info-banner">
            <div className="today-content">
                <i className="fa-regular fa-calendar-check"></i>
                <div className="today-date-parts">
                    <span>{gregorianDate}</span>
                    {hijriDate && <span className="today-date-divider" aria-hidden="true"></span>}
                    {hijriDate && <span>{hijriDate}</span>}
                </div>
            </div>
        </div>
    );
}

export function EventsShareDialog({
    lang = 'ar',
    isOpen,
    events,
    selectedIndexes,
    onToggle,
    onToggleAll,
    onClose,
    onConfirm,
}) {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        previousFocusRef.current = document.activeElement;
        const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
        return () => {
            window.clearTimeout(focusTimer);
            previousFocusRef.current?.focus?.();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const allSelected = events.length > 0 && selectedIndexes.length === events.length;
    const copy = lang === 'en' ? {
        title: 'Choose dates',
        description: 'Select the upcoming dates you want to share.',
        close: 'Close',
        selectAll: 'Select all',
        clearAll: 'Clear all',
        cancel: 'Cancel',
        confirm: 'Share selected',
    } : {
        title: 'اختر المواعيد',
        description: 'حدد المواعيد التي تريد مشاركتها.',
        close: 'إغلاق',
        selectAll: 'تحديد الكل',
        clearAll: 'إلغاء تحديد الكل',
        cancel: 'إلغاء',
        confirm: 'مشاركة المحدد',
    };

    return (
        <div
            className="events-share-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                className="events-share-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="events-share-title"
                aria-describedby="events-share-description"
                onKeyDown={(event) => {
                    if (event.key !== 'Tab') return;
                    const focusable = dialogRef.current?.querySelectorAll(
                        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
                    );
                    if (!focusable?.length) return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }
                }}
            >
                <div className="events-share-dialog-head">
                    <div>
                        <h3 id="events-share-title">{copy.title}</h3>
                        <p id="events-share-description">{copy.description}</p>
                    </div>
                    <button ref={closeButtonRef} type="button" className="events-share-close" onClick={onClose} aria-label={copy.close}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <button type="button" className="events-share-select-all" onClick={onToggleAll}>
                    <i className={`fa-${allSelected ? 'solid' : 'regular'} fa-square-check`}></i>
                    {allSelected ? copy.clearAll : copy.selectAll}
                </button>

                <div className="events-share-options">
                    {events.map((event, index) => {
                        const checked = selectedIndexes.includes(index);
                        return (
                            <label className={`events-share-option${checked ? ' is-selected' : ''}`} key={`${event.name}-${event.days}-${index}`}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggle(index)}
                                />
                                <span className="events-share-option-icon" style={{ color: event.color }}>
                                    <i className={`fa-solid ${event.icon}`}></i>
                                </span>
                                <span className="events-share-option-copy">
                                    <strong>{event.name}</strong>
                                    <small>{getEventDayText(lang, event.days)}</small>
                                </span>
                            </label>
                        );
                    })}
                </div>

                <div className="events-share-actions">
                    <button type="button" className="events-share-cancel" onClick={onClose}>{copy.cancel}</button>
                    <button
                        type="button"
                        className="events-share-confirm"
                        onClick={onConfirm}
                        disabled={selectedIndexes.length === 0}
                    >
                        <i className="fa-solid fa-share-nodes"></i>
                        {copy.confirm}
                    </button>
                </div>
            </section>
        </div>
    );
}

export function EventsSection({ lang, upcomingEvents, onShare, canShare = true }) {
    if (upcomingEvents.length === 0) return null;
    const labels = i18n[lang] || i18n.ar;

    return (
        <div className="events-wrapper">
            <div className="events-header">
                <h3 className="section-header-title">
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> {labels.eventsTitle}
                </h3>
                {canShare && (
                    <button type="button" className="share-events-btn" onClick={onShare}>
                        <i className="fa-solid fa-share-nodes"></i> {labels.shareEvents}
                    </button>
                )}
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
    const safeHtmlContent = sanitizeHtml(htmlContent);
    const hasAdditionalInfo = Boolean(enteredDateInfo?.info?.trim());

    return (
        <div className="result-container">
            <div className="result" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: safeHtmlContent }}></div>
            {enteredDateInfo && (
                <div className="story-card">
                    {hasAdditionalInfo && (
                        <div className="story-content">
                            <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginInlineEnd: '8px' }}></i>
                            <span style={{ fontWeight: 'bold' }}>{labels.dateInfo}</span>
                            <p>{enteredDateInfo.info}</p>
                        </div>
                    )}
                    {enteredDateInfo.canShare !== false && (
                        <button className="share-btn" onClick={onShare}>
                            <i className="fa-solid fa-share-nodes"></i> {labels.shareResult}
                        </button>
                    )}
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
                className="public-tool-field"
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
                className="public-tool-field"
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
                className="public-tool-field"
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
        <div className="card" id="age-calculator">
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
        <div className="card" id="date-converter">
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
        <div className="card" id="date-difference">
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

export function SeoSections({ lang, faqs }) {
    const seo = (i18n[lang] || i18n.ar).seo;
    const faqItems = Array.isArray(faqs) ? faqs : [];

    if (lang === 'en') {
        if (faqItems.length === 0) return null;
        return (
            <div className="seo-sections-wrapper date-guide-sections">
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

    return (
        <div className="seo-sections-wrapper date-guide-sections">
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

            {faqItems.length > 0 && (
                <section className="seo-card faq-card">
                    <h2 className="seo-title">{seo.faqTitle}</h2>
                    {faqItems.map((item) => (
                        <div className="faq-item" key={item.q}>
                            <h4 className="faq-q">{item.q}</h4>
                            <p className="faq-a">{item.a}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
