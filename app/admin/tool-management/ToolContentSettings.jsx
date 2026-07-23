'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_TOOL_SETTINGS, SHARE_TEMPLATE_DEFINITIONS, normalizeToolSettings } from '../../toolSettings';

const SHARE_PREVIEW_VALUES = {
    title: 'مواعيدي القادمة',
    events: 'الراتب: متبقي 5 أيام\nحساب المواطن: متبقي 12 يوم',
    toolTitle: 'احسب عمرك بدقة',
    inputLabel: 'التاريخ المستخدم',
    input: '23 يوليو 2017',
    result: '9 سنوات',
    inputHour: '13',
    inputMinute: '30',
    fromCity: 'الرياض',
    toCity: 'لندن',
    difference: 'ساعتين',
    fromTime: '13:30',
    toTime: '11:30',
    city: 'الرياض',
    temperature: '32°',
    condition: 'سماء صافية',
    feelsLike: '34°',
    humidity: '22%',
    wind: '14 كم/س',
    rainChance: '0%',
    uv: '6',
    advice: 'الأجواء مناسبة للخروج مع تجنب شمس الظهيرة.',
    forecast: 'اليوم: 32° / 24° - صافي\nغدًا: 31° / 23° - غائم جزئيًا',
    url: 'https://date-tool.com',
};

function cloneToolSettings(value) {
    return JSON.parse(JSON.stringify(value));
}

function renderSharePreview(template = '') {
    return String(template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
        const value = SHARE_PREVIEW_VALUES[key];
        return value === undefined || value === null ? `{${key}}` : String(value);
    }).trim();
}

function getTemplateSummary(template = '') {
    const cleaned = String(template || '').replace(/\s+/g, ' ').trim();
    return cleaned || 'لا يوجد نص بعد. اضغط القلم لإضافة نص المشاركة.';
}

export default function ToolContentSettings({ firebaseApi, showMessage, toolKey }) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey];
    const [settings, setSettings] = useState(() => cloneToolSettings(defaults));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [shareModal, setShareModal] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSettings() {
            if (!firebaseApi?.getSiteConfig) return;

            try {
                setIsLoading(true);
                const config = await firebaseApi.getSiteConfig();
                const normalized = normalizeToolSettings(config.toolSettings || {});
                if (isMounted) setSettings(cloneToolSettings(normalized[toolKey] || defaults));
            } catch (error) {
                console.error('Error loading tool settings:', error);
                if (isMounted) showMessage('error', 'تعذر تحميل إعدادات الأداة.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadSettings();

        return () => {
            isMounted = false;
        };
    }, [defaults, firebaseApi, showMessage, toolKey]);

    const updateField = (field, value) => {
        setSettings((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const updateSubtool = (key, value) => {
        setSettings((current) => ({
            ...current,
            subtools: {
                ...(current.subtools || {}),
                [key]: value,
            },
        }));
    };

    const updateShareTemplate = (key, value) => {
        setSettings((current) => ({
            ...current,
            shareTemplates: {
                ...(current.shareTemplates || {}),
                [key]: value,
            },
        }));
    };

    const openShareModal = (mode, key) => {
        setShareModal({ mode, key });
    };

    const closeShareModal = () => {
        setShareModal(null);
    };

    const updateFaq = (index, field, value) => {
        setSettings((current) => {
            const faqs = [...(current.faqs || [])];
            faqs[index] = {
                ...(faqs[index] || {}),
                [field]: value,
            };
            return { ...current, faqs };
        });
    };

    const addFaq = () => {
        setSettings((current) => ({
            ...current,
            faqs: [...(current.faqs || []), { q: '', a: '' }],
        }));
    };

    const removeFaq = (index) => {
        setSettings((current) => ({
            ...current,
            faqs: (current.faqs || []).filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const saveSettings = async () => {
        if (!firebaseApi?.getSiteConfig || !firebaseApi?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة Firebase بعد.');
            return;
        }

        try {
            setIsSaving(true);
            showMessage('info', 'جاري حفظ إعدادات الأداة...');
            const config = await firebaseApi.getSiteConfig();
            const normalized = normalizeToolSettings({
                ...(config.toolSettings || {}),
                [toolKey]: settings,
            });
            const savedPatch = await firebaseApi.saveSiteConfigSection({ toolSettings: normalized });
            const savedSettings = normalizeToolSettings(savedPatch.toolSettings || normalized);
            setSettings(cloneToolSettings(savedSettings[toolKey] || defaults));
            showMessage('success', 'تم حفظ إعدادات الأداة بنجاح.');
        } catch (error) {
            console.error('Error saving tool settings:', error);
            showMessage('error', 'تعذر حفظ إعدادات الأداة. تحقق من صلاحيات المدير.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <section className="legacy-google-card tools-section-card">
                <div className="tools-empty">جاري تحميل إعدادات الأداة...</div>
            </section>
        );
    }

    const activeShareDefinition = shareModal ? SHARE_TEMPLATE_DEFINITIONS[toolKey]?.[shareModal.key] : null;
    const activeShareTemplate = shareModal ? settings.shareTemplates?.[shareModal.key] || '' : '';
    const activeSharePreview = renderSharePreview(activeShareTemplate);

    return (
        <section className="legacy-google-card tools-section-card tool-content-settings">
            <div className="tools-section-head">
                <div className="tools-section-title">
                    <h2>نصوص الأداة</h2>
                    <p>عدّل عنوان السكشن التعريفي، السلوغن، أسماء الأدوات الفرعية، والأسئلة الإضافية لهذه الأداة.</p>
                </div>
                <button type="button" className="legacy-primary-btn" onClick={saveSettings} disabled={isSaving}>
                    <i className="fa-solid fa-floppy-disk"></i>
                    {isSaving ? 'جاري الحفظ...' : 'حفظ نصوص الأداة'}
                </button>
            </div>

            <div className="legacy-form-grid tool-content-grid">
                <label className="legacy-field">
                    <span>اسم الأداة في الإدارة</span>
                    <input value={settings.label || ''} onChange={(event) => updateField('label', event.target.value)} />
                </label>
                <label className="legacy-field">
                    <span>عنوان السكشن التعريفي</span>
                    <input value={settings.heroTitle || ''} onChange={(event) => updateField('heroTitle', event.target.value)} />
                </label>
                <label className="legacy-field full-width">
                    <span>نص السلوغن / الوصف</span>
                    <textarea rows={3} value={settings.heroDescription || ''} onChange={(event) => updateField('heroDescription', event.target.value)} />
                </label>
            </div>

            <div className="tools-list tool-subtools-list">
                <div className="tools-table-head">
                    <span>معرف الأداة</span>
                    <span>الاسم المعروض</span>
                </div>
                {Object.entries(defaults.subtools || {}).map(([key, fallback]) => (
                    <div className="tools-item-card compact" key={key}>
                        <strong dir="ltr">{key}</strong>
                        <div className="legacy-field">
                            <label>{fallback}</label>
                            <input value={settings.subtools?.[key] || ''} onChange={(event) => updateSubtool(key, event.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="tools-list tool-share-templates-list">
                <div className="tools-table-head">
                    <span>معرف المشاركة</span>
                    <span>المتغيرات المتاحة</span>
                    <span>ملخص النص</span>
                    <span>الإجراءات</span>
                </div>
                {Object.entries(SHARE_TEMPLATE_DEFINITIONS[toolKey] || {}).map(([key, definition]) => (
                    <div className="tools-item-card compact tool-share-template-row" key={key}>
                        <div className="tool-share-key">
                            <strong dir="ltr">{key}</strong>
                            <small>{definition.label}</small>
                        </div>
                        <div className="tool-template-vars">
                            {Object.entries(definition.variables || {}).map(([variable, description]) => (
                                <span key={variable} title={description}>
                                    <code>{`{${variable}}`}</code>
                                    <small>{description}</small>
                                </span>
                            ))}
                        </div>
                        <div className="tool-share-template-summary">
                            <p>{getTemplateSummary(settings.shareTemplates?.[key])}</p>
                        </div>
                        <div className="tools-item-actions tool-share-actions">
                            <button type="button" onClick={() => openShareModal('edit', key)} title="تعديل نص المشاركة">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button type="button" onClick={() => openShareModal('preview', key)} title="معاينة الرسالة بقيم افتراضية">
                                <i className="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {shareModal && activeShareDefinition && (
                <div className="legacy-modal-backdrop" onClick={closeShareModal}>
                    <div className="legacy-modal-card tool-share-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{shareModal.mode === 'edit' ? 'تعديل نص المشاركة' : 'معاينة رسالة المشاركة'}</h3>
                                <p>{activeShareDefinition.label}</p>
                            </div>
                            <button type="button" onClick={closeShareModal} aria-label="إغلاق النافذة">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {shareModal.mode === 'edit' ? (
                            <>
                                <label className="legacy-field tool-share-modal-editor">
                                    <span>نص المشاركة</span>
                                    <textarea
                                        rows={10}
                                        value={activeShareTemplate}
                                        onChange={(event) => updateShareTemplate(shareModal.key, event.target.value)}
                                        placeholder="اكتب نص المشاركة واستخدم المتغيرات مثل {result} و {url}"
                                    />
                                </label>
                                <div className="tool-template-vars tool-template-vars-modal">
                                    {Object.entries(activeShareDefinition.variables || {}).map(([variable, description]) => (
                                        <span key={variable} title={description}>
                                            <code>{`{${variable}}`}</code>
                                            <small>{description}</small>
                                        </span>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="tool-share-preview-box">
                                <span>معاينة بقيم افتراضية</span>
                                <pre>{activeSharePreview || 'لا يوجد نص للمعاينة بعد.'}</pre>
                            </div>
                        )}

                        <div className="legacy-modal-actions">
                            {shareModal.mode === 'edit' && (
                                <button type="button" className="legacy-secondary-btn" onClick={() => openShareModal('preview', shareModal.key)}>
                                    <i className="fa-solid fa-eye"></i>
                                    معاينة الرسالة
                                </button>
                            )}
                            <button type="button" className="legacy-primary-btn" onClick={closeShareModal}>
                                {shareModal.mode === 'edit' ? 'تم' : 'إغلاق'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="tool-faq-admin">
                <div className="tools-section-head compact-head">
                    <div className="tools-section-title">
                        <h2>أسئلة إضافية</h2>
                        <p>تظهر هذه الأسئلة أسفل الأسئلة الافتراضية في صفحة الأداة.</p>
                    </div>
                    <button type="button" className="legacy-secondary-btn" onClick={addFaq}>
                        <i className="fa-solid fa-plus"></i>
                        إضافة سؤال
                    </button>
                </div>

                <div className="tools-list tool-faq-list">
                    {(settings.faqs || []).length === 0 && (
                        <div className="tools-empty">لا توجد أسئلة إضافية بعد.</div>
                    )}

                    {(settings.faqs || []).map((faq, index) => (
                        <div className="tools-item-card tool-faq-row" key={`${faq.q}-${index}`}>
                            <div className="legacy-field">
                                <label>السؤال</label>
                                <input value={faq.q || ''} onChange={(event) => updateFaq(index, 'q', event.target.value)} />
                            </div>
                            <div className="legacy-field">
                                <label>الإجابة</label>
                                <textarea rows={3} value={faq.a || ''} onChange={(event) => updateFaq(index, 'a', event.target.value)} />
                            </div>
                            <div className="tools-item-actions">
                                <button type="button" className="danger" onClick={() => removeFaq(index)} title="حذف السؤال">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
