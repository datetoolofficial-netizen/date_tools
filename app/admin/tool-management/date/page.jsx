'use client';

import { useEffect, useState } from 'react';
import ToolManagementShell from '../ToolManagementShell';
import ToolContentSettings from '../ToolContentSettings';

const EMPTY_EVENT = {
    id: '',
    name: '',
    date: '',
    calendar: 'gregorian',
    repeat: 'once',
    icon: 'fa-star',
    color: '#3b82f6',
    active: true,
};

function DateToolEvents({ firebaseApi, showMessage }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [eventModal, setEventModal] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadEvents() {
            if (!firebaseApi?.getSiteConfig) return;

            try {
                setIsLoading(true);
                const config = await firebaseApi.getSiteConfig();
                if (isMounted) setEvents(Array.isArray(config.events) ? config.events : []);
            } catch (error) {
                console.error('Error loading date tool events:', error);
                if (isMounted) showMessage('error', 'تعذر تحميل أحداث أداة التاريخ.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadEvents();

        return () => {
            isMounted = false;
        };
    }, [firebaseApi, showMessage]);

    const updateEvent = (index, field, value) => {
        setEvents((current) => {
            const nextEvents = [...current];
            nextEvents[index] = {
                ...(nextEvents[index] || {}),
                [field]: value,
            };
            return nextEvents;
        });
    };

    const addEvent = () => {
        setEventModal({
            index: -1,
            draft: { ...EMPTY_EVENT, id: `event-${Date.now()}` },
        });
    };

    const editEvent = (index) => {
        setEventModal({ index, draft: { ...events[index] } });
    };

    const updateEventDraft = (field, value) => {
        setEventModal((current) => ({
            ...current,
            draft: { ...current.draft, [field]: value },
        }));
    };

    const applyEventDraft = () => {
        if (!eventModal?.draft?.name?.trim() || !eventModal?.draft?.date) {
            showMessage('error', 'أدخل اسم الحدث وتاريخه قبل الحفظ.');
            return;
        }

        setEvents((current) => {
            if (eventModal.index < 0) return [...current, eventModal.draft];
            return current.map((item, index) => (index === eventModal.index ? eventModal.draft : item));
        });
        setEventModal(null);
    };

    const removeEvent = (index) => {
        setEvents((current) => current.filter((_, itemIndex) => itemIndex !== index));
    };

    const saveEvents = async () => {
        if (!firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        try {
            setIsSaving(true);
            showMessage('info', 'جاري حفظ أحداث أداة التاريخ...');
            const savedPatch = await firebaseApi.saveSiteConfigSection({ events });
            setEvents(Array.isArray(savedPatch.events) ? savedPatch.events : events);
            showMessage('success', 'تم حفظ أحداث أداة التاريخ بنجاح.');
        } catch (error) {
            console.error('Error saving date tool events:', error);
            showMessage('error', 'تعذر حفظ أحداث أداة التاريخ. تحقق من صلاحيات المدير.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="legacy-google-card tools-section-card date-tool-events" id="date-events">
            <div className="tools-section-head">
                <div className="tools-section-title">
                    <h2>أهم الأحداث</h2>
                    <p>هذه الأحداث تخص صفحة أداة التاريخ فقط، وتظهر في واجهة التاريخ مع اللون والأيقونة المحددين لكل حدث.</p>
                </div>
            </div>

            <div className="tools-list">
                {isLoading && (
                    <div className="tools-empty">جاري تحميل أحداث أداة التاريخ...</div>
                )}

                {!isLoading && events.length === 0 && (
                    <div className="tools-empty">لا توجد أحداث لأداة التاريخ بعد.</div>
                )}

                {!isLoading && events.length > 0 && (
                    <div className="tools-table-head">
                        <span>أيقونة</span>
                        <span>اسم الحدث</span>
                        <span>التاريخ</span>
                        <span>التكرار</span>
                        <span>كود الأيقونة</span>
                        <span>الإجراءات</span>
                    </div>
                )}

                {!isLoading && events.map((eventItem, index) => (
                    <div className="tools-item-card event" key={`${eventItem.id || eventItem.name}-${index}`}>
                        <div className="tools-event-icon" style={{ background: `${eventItem.color || '#3b82f6'}22`, color: eventItem.color || '#3b82f6' }}>
                            <i className={`fa-solid ${eventItem.icon || 'fa-star'}`}></i>
                        </div>
                        <strong className="tools-event-name">{eventItem.name || 'بدون اسم'}</strong>
                        <span className="tools-event-value tools-event-value-ltr">{eventItem.date || '-'}</span>
                        <span className="tools-event-value">
                            {eventItem.repeat === 'monthly' ? 'شهريًا' : eventItem.repeat === 'yearly' ? 'سنويًا' : 'مرة واحدة'}
                        </span>
                        <code className="tools-event-code">{eventItem.icon || 'fa-star'}</code>
                        <div className="tools-item-actions">
                            <button
                                type="button"
                                className={eventItem.active === false ? 'danger' : 'approve'}
                                onClick={() => updateEvent(index, 'active', eventItem.active === false)}
                                title={eventItem.active === false ? 'تفعيل الحدث' : 'إيقاف الحدث'}
                            >
                                <i className={`fa-solid ${eventItem.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                            </button>
                            <button type="button" className="edit" onClick={() => editEvent(index)} title="تعديل الحدث">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button type="button" className="danger" onClick={() => removeEvent(index)} title="حذف الحدث">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tool-management-actions tool-table-footer-actions">
                <button type="button" className="legacy-secondary-btn" onClick={addEvent}>
                    <i className="fa-solid fa-plus"></i>
                    إضافة حدث
                </button>
                <button type="button" className="legacy-primary-btn" onClick={saveEvents} disabled={isSaving}>
                    <i className="fa-solid fa-floppy-disk"></i>
                    {isSaving ? 'جاري الحفظ...' : 'حفظ أحداث التاريخ'}
                </button>
            </div>

            {eventModal && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
                    <div className="legacy-modal-card date-event-modal">
                        <div className="legacy-modal-head date-event-modal-head">
                            <div>
                                <h3 id="event-modal-title">{eventModal.index < 0 ? 'إضافة حدث' : 'تعديل الحدث'}</h3>
                                <p>أدخل بيانات الحدث ثم احفظه ليظهر في جدول العرض.</p>
                            </div>
                            <button type="button" className="legacy-icon-btn" onClick={() => setEventModal(null)} aria-label="إغلاق">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="legacy-form-grid date-event-modal-grid">
                            <label className="legacy-field">
                                <span>اسم الحدث</span>
                                <input value={eventModal.draft.name || ''} onChange={(event) => updateEventDraft('name', event.target.value)} />
                            </label>
                            <label className="legacy-field">
                                <span>التاريخ</span>
                                <input type="date" value={eventModal.draft.date || ''} onChange={(event) => updateEventDraft('date', event.target.value)} />
                            </label>
                            <label className="legacy-field">
                                <span>التكرار</span>
                                <select value={eventModal.draft.repeat || 'once'} onChange={(event) => updateEventDraft('repeat', event.target.value)}>
                                    <option value="once">مرة واحدة</option>
                                    <option value="monthly">شهريًا</option>
                                    <option value="yearly">سنويًا</option>
                                </select>
                            </label>
                            <label className="legacy-field">
                                <span>كود الأيقونة</span>
                                <input dir="ltr" value={eventModal.draft.icon || ''} onChange={(event) => updateEventDraft('icon', event.target.value)} placeholder="fa-star" />
                            </label>
                            <label className="legacy-field date-event-color-field">
                                <span>لون الحدث</span>
                                <input type="color" value={eventModal.draft.color || '#3b82f6'} onChange={(event) => updateEventDraft('color', event.target.value)} />
                            </label>
                        </div>
                        <div className="legacy-modal-actions">
                            <button type="button" className="legacy-secondary-btn" onClick={() => setEventModal(null)}>إلغاء</button>
                            <button type="button" className="legacy-primary-btn" onClick={applyEventDraft}>
                                <i className="fa-solid fa-floppy-disk"></i>
                                حفظ الحدث
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default function AdminDateToolPage() {
    return (
        <ToolManagementShell
            active="tool-management"
            icon="fa-calendar-days"
            loadingTitle="جاري فتح إدارة أداة التاريخ..."
            title="إدارة أداة التاريخ"
            description="إعدادات خاصة بصفحة التاريخ فقط. نقلنا أهم الأحداث هنا حتى تكون كل أداة مستقلة عن إعدادات الموقع العامة."
        >
            {({ firebaseApi, showMessage }) => (
                <>
                    <ToolContentSettings firebaseApi={firebaseApi} showMessage={showMessage} toolKey="date" />
                    <DateToolEvents firebaseApi={firebaseApi} showMessage={showMessage} />
                </>
            )}
        </ToolManagementShell>
    );
}
