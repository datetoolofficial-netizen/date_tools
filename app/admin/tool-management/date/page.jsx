'use client';

import { useEffect, useState } from 'react';
import ToolManagementShell from '../ToolManagementShell';

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
        setEvents((current) => [
            ...current,
            {
                ...EMPTY_EVENT,
                id: `event-${Date.now()}`,
            },
        ]);
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
                <div className="tool-management-actions">
                    <button type="button" className="legacy-secondary-btn" onClick={addEvent}>
                        <i className="fa-solid fa-plus"></i>
                        إضافة حدث
                    </button>
                    <button type="button" className="legacy-primary-btn" onClick={saveEvents} disabled={isSaving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {isSaving ? 'جاري الحفظ...' : 'حفظ أحداث التاريخ'}
                    </button>
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
                        <span>تفعيل</span>
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
                        <label className="tools-mini-check icon-only" title="تفعيل الحدث">
                            <input type="checkbox" checked={eventItem.active !== false} onChange={(event) => updateEvent(index, 'active', event.target.checked)} />
                        </label>
                        <div className="tools-event-icon" style={{ background: `${eventItem.color || '#3b82f6'}22`, color: eventItem.color || '#3b82f6' }}>
                            <i className={`fa-solid ${eventItem.icon || 'fa-star'}`}></i>
                        </div>
                        <div className="tools-item-main">
                            <div className="legacy-field">
                                <label>اسم الحدث</label>
                                <input value={eventItem.name || ''} onChange={(event) => updateEvent(index, 'name', event.target.value)} />
                            </div>
                            <div className="legacy-field">
                                <label>التاريخ</label>
                                <input type="date" value={eventItem.date || ''} onChange={(event) => updateEvent(index, 'date', event.target.value)} />
                            </div>
                            <div className="legacy-field">
                                <label>التكرار</label>
                                <select value={eventItem.repeat || 'once'} onChange={(event) => updateEvent(index, 'repeat', event.target.value)}>
                                    <option value="once">مرة واحدة</option>
                                    <option value="monthly">شهريًا</option>
                                    <option value="yearly">سنويًا</option>
                                </select>
                            </div>
                            <div className="legacy-field">
                                <label>الأيقونة</label>
                                <input dir="ltr" value={eventItem.icon || ''} onChange={(event) => updateEvent(index, 'icon', event.target.value)} placeholder="fa-star" />
                            </div>
                        </div>
                        <div className="tools-item-actions">
                            <label className="tools-color-action" title="لون الحدث">
                                <input className="tools-event-color" type="color" value={eventItem.color || '#3b82f6'} onChange={(event) => updateEvent(index, 'color', event.target.value)} />
                                <span>لون</span>
                            </label>
                            <button type="button" className="danger" onClick={() => removeEvent(index)} title="حذف الحدث">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
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
                <DateToolEvents firebaseApi={firebaseApi} showMessage={showMessage} />
            )}
        </ToolManagementShell>
    );
}
