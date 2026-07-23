'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_TOOL_SETTINGS, SHARE_TEMPLATE_DEFINITIONS, normalizeToolSettings } from '../../toolSettings';

function cloneToolSettings(value) {
    return JSON.parse(JSON.stringify(value));
}

function getTemplateSummary(template = '') {
    const cleaned = String(template || '').replace(/\s+/g, ' ').trim();
    return cleaned || 'لا يوجد نص بعد. اكتب نص المشاركة الكامل في المربع أدناه.';
}

export default function ToolContentSettings({ firebaseApi, showMessage, toolKey }) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey];
    const [settings, setSettings] = useState(() => cloneToolSettings(defaults));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
                    <span>نص المشاركة</span>
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
                        <div className="tool-share-template-editor">
                            <div className="tool-share-template-summary">
                                <p>{getTemplateSummary(settings.shareTemplates?.[key])}</p>
                            </div>
                            <label className="legacy-field tool-share-template-full">
                                <span>النص الكامل القابل للتعديل</span>
                                <textarea
                                    rows={6}
                                    value={settings.shareTemplates?.[key] || ''}
                                    onChange={(event) => updateShareTemplate(key, event.target.value)}
                                    placeholder="اكتب نص المشاركة واستخدم المتغيرات مثل {result} و {url}"
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>

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
