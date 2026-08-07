'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_TOOL_SETTINGS, SHARE_TEMPLATE_DEFINITIONS, normalizeToolSettings } from '../../toolSettings';
import { TOOL_SECTION_ROUTES } from '../../../toolSectionRoutes';

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
    const preview = renderSharePreview(template);
    return preview || 'لا يوجد نص بعد. اكتب نص المشاركة الكامل في المربع أدناه.';
}

function getSharePlaceLabel(label = '') {
    return String(label || '')
        .replace(/^مشاركة\s+/, '')
        .replace(/^نتيجة\s+/, '')
        .trim() || 'نص مشاركة';
}

function getSearchPreviewUrl(canonical = '/') {
    return `https://date-tool.com${canonical === '/' ? '' : canonical}`;
}

export default function ToolContentSettings({ firebaseApi, showMessage, toolKey }) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey];
    const [settings, setSettings] = useState(() => cloneToolSettings(defaults));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [shareModal, setShareModal] = useState(null);
    const [faqModal, setFaqModal] = useState(null);

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

    const updateSubtool = (key, value) => {
        setSettings((current) => ({
            ...current,
            subtools: {
                ...(current.subtools || {}),
                [key]: value,
            },
        }));
    };

    const updateSeo = (field, value) => {
        setSettings((current) => ({
            ...current,
            seo: {
                ...(current.seo || {}),
                [field]: value,
            },
        }));
    };

    const updateSubtoolSeo = (subtoolKey, field, value) => {
        setSettings((current) => ({
            ...current,
            subtoolSeo: {
                ...(current.subtoolSeo || {}),
                [subtoolKey]: {
                    ...(current.subtoolSeo?.[subtoolKey] || {}),
                    [field]: value,
                },
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

    const updateShareEnabled = (key, value) => {
        setSettings((current) => ({
            ...current,
            shareEnabled: {
                ...(current.shareEnabled || {}),
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
        const nextIndex = (settings.faqs || []).length;
        setSettings((current) => ({
            ...current,
            faqs: [...(current.faqs || []), { q: '', a: '', active: true }],
        }));
        setFaqModal({ mode: 'edit', index: nextIndex });
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
            const lastModified = new Date().toISOString().slice(0, 10);
            const settingsWithModifiedDate = {
                ...settings,
                seo: { ...(settings.seo || {}), lastModified },
                subtoolSeo: Object.fromEntries(
                    Object.entries(settings.subtoolSeo || {}).map(([key, value]) => [
                        key,
                        { ...value, lastModified },
                    ])
                ),
            };
            const normalized = normalizeToolSettings({
                ...(config.toolSettings || {}),
                [toolKey]: settingsWithModifiedDate,
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
            <div className="tool-seo-admin">
                <div className="tools-section-head compact-head">
                    <div className="tools-section-title">
                        <h2>SEO وظهور الأداة في البحث</h2>
                        <p>هذه الحقول تتحكم في عنوان نتائج البحث والوصف والعنوان الرئيسي والكلمات المستهدفة دون تغيير ألوان أو مقاسات الصفحة.</p>
                    </div>
                </div>

                <SeoFields
                    seo={settings.seo}
                    onChange={updateSeo}
                    previewLabel={settings.seo?.h1 || defaults.seo?.h1}
                />

                {Object.entries(defaults.subtoolSeo || {}).map(([subtoolKey]) => (
                    <div className="tool-subtool-seo" key={subtoolKey}>
                        <h3>{settings.subtools?.[subtoolKey] || defaults.subtools?.[subtoolKey]}</h3>
                        <SeoFields
                            seo={settings.subtoolSeo?.[subtoolKey]}
                            onChange={(field, value) => updateSubtoolSeo(subtoolKey, field, value)}
                            previewLabel={settings.subtools?.[subtoolKey] || defaults.subtools?.[subtoolKey]}
                            publicPath={TOOL_SECTION_ROUTES[toolKey]?.[subtoolKey]?.publicPath}
                        />
                    </div>
                ))}
            </div>

            <div className="tools-list tool-subtools-list">
                <div className="tools-table-head">
                    <span>اسم مختصر</span>
                    <span>الاسم المعروض</span>
                </div>
                {Object.entries(defaults.subtools || {}).map(([key, fallback]) => (
                    <div className="tools-item-card compact" key={key}>
                        <strong>{fallback}</strong>
                        <div className="legacy-field">
                            <label>الاسم المعروض</label>
                            <input value={settings.subtools?.[key] || ''} onChange={(event) => updateSubtool(key, event.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="tools-list tool-share-templates-list">
                <div className="tools-table-head">
                    <span>مكان المشاركة</span>
                    <span>النص الحالي</span>
                    <span>الإجراءات</span>
                </div>
                {Object.entries(SHARE_TEMPLATE_DEFINITIONS[toolKey] || {}).map(([key, definition]) => (
                    <div className="tools-item-card compact tool-share-template-row" key={key}>
                        <div className="tool-share-key">
                            <strong>{getSharePlaceLabel(definition.label)}</strong>
                            <small>{settings.shareEnabled?.[key] === false ? 'زر المشاركة متوقف' : 'زر المشاركة مفعل'}</small>
                        </div>
                        <div className="tool-share-current-text" title={getTemplateSummary(settings.shareTemplates?.[key])}>
                            {getTemplateSummary(settings.shareTemplates?.[key])}
                        </div>
                        <div className="tools-item-actions tool-share-actions">
                            <button
                                type="button"
                                className={settings.shareEnabled?.[key] === false ? 'danger' : 'approve'}
                                onClick={() => updateShareEnabled(key, settings.shareEnabled?.[key] === false)}
                                title={settings.shareEnabled?.[key] === false ? 'تفعيل زر المشاركة' : 'إيقاف زر المشاركة'}
                            >
                                <i className={`fa-solid ${settings.shareEnabled?.[key] === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                            </button>
                            <button
                                type="button"
                                title="تعديل نص المشاركة"
                                onClick={() => setShareModal({ mode: 'edit', key, definition })}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                                type="button"
                                title="عرض نص المشاركة"
                                onClick={() => setShareModal({ mode: 'view', key, definition })}
                            >
                                <i className="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {shareModal && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card tool-share-modal">
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{shareModal.mode === 'edit' ? 'تعديل نص المشاركة' : 'معاينة نص المشاركة'}</h3>
                                <p>{getSharePlaceLabel(shareModal.definition.label)}</p>
                            </div>
                            <button type="button" onClick={() => setShareModal(null)} aria-label="إغلاق">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="tool-template-vars in-modal">
                            {Object.entries(shareModal.definition.variables || {}).map(([variable, description]) => (
                                <span key={variable} title={description}>
                                    <code>{`{${variable}}`}</code>
                                    <small>{description}</small>
                                </span>
                            ))}
                        </div>

                        {shareModal.mode === 'edit' && (
                            <label className="legacy-field tool-share-template-full">
                                <span>النص الكامل القابل للتعديل</span>
                                <textarea
                                    rows={8}
                                    value={settings.shareTemplates?.[shareModal.key] || ''}
                                    onChange={(event) => updateShareTemplate(shareModal.key, event.target.value)}
                                    placeholder="اكتب نص المشاركة واستخدم المتغيرات مثل {result} و {url}"
                                />
                            </label>
                        )}

                        <div className="tool-share-template-full">
                            <span>المعاينة بنتائج افتراضية</span>
                            <div className="tool-share-template-summary full-preview">
                                <p>{getTemplateSummary(settings.shareTemplates?.[shareModal.key])}</p>
                            </div>
                        </div>

                        <div className="legacy-modal-actions">
                            <button type="button" className="legacy-primary-btn" onClick={() => setShareModal(null)}>
                                <i className="fa-solid fa-check"></i>
                                تم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="tool-faq-admin">
                <div className="tools-section-head compact-head faq-head">
                    <div className="tools-section-title">
                        <h2>الأسئلة الشائعة</h2>
                        <p>يظهر قسم الأسئلة الشائعة في صفحة الأداة فقط عند إضافة سؤال وإجابة مكتملين هنا.</p>
                    </div>
                </div>

                <div className="tools-list tool-faq-list">
                    {(settings.faqs || []).length > 0 && (
                        <div className="tools-table-head">
                            <span>السؤال</span>
                            <span>الإجابة</span>
                            <span>الإجراءات</span>
                        </div>
                    )}
                    {(settings.faqs || []).length === 0 && (
                        <div className="tools-empty">لا توجد أسئلة شائعة بعد، لذلك لن يظهر القسم في صفحة الأداة.</div>
                    )}

                    {(settings.faqs || []).map((faq, index) => (
                        <div className="tools-item-card tool-faq-row" key={`${faq.q}-${index}`}>
                            <strong className="tool-faq-question">{faq.q || 'سؤال جديد غير مكتمل'}</strong>
                            <p className="tool-faq-answer">{faq.a || 'لم تُكتب الإجابة بعد.'}</p>
                            <div className="tools-item-actions">
                                <button
                                    type="button"
                                    className={faq.active === false ? 'danger' : 'approve'}
                                    onClick={() => updateFaq(index, 'active', faq.active === false)}
                                    title={faq.active === false ? 'تفعيل السؤال' : 'إيقاف السؤال'}
                                >
                                    <i className={`fa-solid ${faq.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                </button>
                                <button type="button" onClick={() => setFaqModal({ mode: 'edit', index })} title="تعديل السؤال والإجابة">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button type="button" onClick={() => setFaqModal({ mode: 'view', index })} title="معاينة الإجابة">
                                    <i className="fa-solid fa-eye"></i>
                                </button>
                                <button type="button" className="danger" onClick={() => removeFaq(index)} title="حذف السؤال">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tool-management-actions tool-table-footer-actions">
                    <button type="button" className="legacy-secondary-btn" onClick={addFaq}>
                        <i className="fa-solid fa-plus"></i>
                        إضافة سؤال
                    </button>
                    <button type="button" className="legacy-primary-btn" onClick={saveSettings} disabled={isSaving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {isSaving ? 'جاري الحفظ...' : 'حفظ الأسئلة'}
                    </button>
                </div>
            </div>

            {faqModal && settings.faqs?.[faqModal.index] && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="legacy-modal-card tool-faq-modal">
                        <div className="legacy-modal-head">
                            <div>
                                <h3>{faqModal.mode === 'edit' ? 'تعديل السؤال' : 'معاينة السؤال والإجابة'}</h3>
                                <p>{settings.faqs[faqModal.index].active === false ? 'السؤال متوقف حاليًا' : 'السؤال مفعّل وسيظهر بعد الحفظ'}</p>
                            </div>
                            <button type="button" onClick={() => setFaqModal(null)} aria-label="إغلاق">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {faqModal.mode === 'edit' ? (
                            <div className="legacy-form-grid tool-faq-modal-fields">
                                <label className="legacy-field full-width">
                                    <span>السؤال</span>
                                    <input value={settings.faqs[faqModal.index].q || ''} onChange={(event) => updateFaq(faqModal.index, 'q', event.target.value)} />
                                </label>
                                <label className="legacy-field full-width">
                                    <span>الإجابة</span>
                                    <textarea rows={7} value={settings.faqs[faqModal.index].a || ''} onChange={(event) => updateFaq(faqModal.index, 'a', event.target.value)} />
                                </label>
                            </div>
                        ) : (
                            <div className="tool-faq-preview">
                                <strong>{settings.faqs[faqModal.index].q || 'سؤال غير مكتمل'}</strong>
                                <p>{settings.faqs[faqModal.index].a || 'لم تُكتب الإجابة بعد.'}</p>
                            </div>
                        )}

                        <div className="legacy-modal-actions">
                            <button type="button" className="legacy-primary-btn" onClick={() => setFaqModal(null)}>
                                <i className="fa-solid fa-check"></i>
                                تم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="tool-floating-action-dock" aria-label="إجراءات إدارة الأداة">
                <Link href="/admin/tool-management" className="tool-floating-action tool-floating-back">
                    <i className="fa-solid fa-arrow-right"></i>
                    رجوع
                </Link>
                <button type="button" className="tool-floating-action tool-floating-save" onClick={saveSettings} disabled={isSaving}>
                    <i className="fa-solid fa-floppy-disk"></i>
                    {isSaving ? 'يحفظ...' : 'حفظ'}
                </button>
            </div>
        </section>
    );
}

function SeoFields({ seo = {}, onChange, previewLabel = '', publicPath = '' }) {
    const searchTitle = seo.searchTitle || previewLabel;
    const description = seo.metaDescription || '';
    const canonical = seo.canonical || publicPath || '/';

    return (
        <div className="tool-seo-fields-layout">
            <div className="legacy-form-grid tool-seo-fields">
                <label className="legacy-field full-width">
                    <span>عنوان نتائج البحث</span>
                    <input value={seo.searchTitle || ''} onChange={(event) => onChange('searchTitle', event.target.value)} maxLength={65} />
                    <small>{String(seo.searchTitle || '').length}/65</small>
                </label>
                <label className="legacy-field full-width">
                    <span>وصف نتائج البحث</span>
                    <textarea rows={3} value={seo.metaDescription || ''} onChange={(event) => onChange('metaDescription', event.target.value)} maxLength={170} />
                    <small>{String(seo.metaDescription || '').length}/170</small>
                </label>
                <label className="legacy-field">
                    <span>عنوان H1 الرئيسي</span>
                    <input value={seo.h1 || ''} onChange={(event) => onChange('h1', event.target.value)} />
                </label>
                <label className="legacy-field">
                    <span>العبارة الرئيسية</span>
                    <input value={seo.primaryKeyword || ''} onChange={(event) => onChange('primaryKeyword', event.target.value)} />
                </label>
                <label className="legacy-field full-width">
                    <span>العبارات المساندة</span>
                    <input value={seo.supportingKeywords || ''} onChange={(event) => onChange('supportingKeywords', event.target.value)} placeholder="افصل بينها بفاصلة" />
                </label>
                <label className="legacy-field full-width">
                    <span>الرابط الأساسي Canonical</span>
                    <input dir="ltr" value={canonical} onChange={(event) => onChange('canonical', event.target.value)} placeholder={publicPath || '/clock'} />
                </label>
            </div>

            <aside className="tool-search-preview" aria-label="معاينة نتيجة البحث">
                <div className="tool-search-preview-url">
                    <small>{getSearchPreviewUrl(canonical)}</small>
                    {publicPath && (
                        <Link href={publicPath} target="_blank" rel="noopener noreferrer" aria-label="فتح رابط الأداة">
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                    )}
                </div>
                <strong>{searchTitle || 'عنوان نتيجة البحث'}</strong>
                <p>{description || 'سيظهر وصف الصفحة هنا كما يمكن أن يراه المستخدم في نتائج البحث.'}</p>
                <span>H1: {seo.h1 || previewLabel}</span>
            </aside>
        </div>
    );
}
