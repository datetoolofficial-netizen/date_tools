'use client';

import { useState } from 'react';
import { normalizeIdentityTranslations } from '../../localizedConfig';
import { normalizePwaUpdatePrompt } from '../../pwaPromptSettings';
import { APP_VERSION } from '../../version';
import AdminEnableToggle from '../AdminEnableToggle';

export const IDENTITY_FIELDS = [
    'toolDisplayName',
    'toolSlogan',
    'contactEmail',
    'hasLogo',
    'logoUrl',
    'faviconUrl',
    'appIconUrl',
    'pwaShortcutDateIconUrl',
    'pwaShortcutClockIconUrl',
    'pwaShortcutWeatherIconUrl',
    'copyrightName',
    'copyrightText',
];

export const EMPTY_IDENTITY = {
    toolDisplayName: '',
    toolSlogan: '',
    contactEmail: '',
    hasLogo: false,
    logoUrl: '',
    faviconUrl: '',
    appIconUrl: '',
    pwaShortcutDateIconUrl: '',
    pwaShortcutClockIconUrl: '',
    pwaShortcutWeatherIconUrl: '',
    copyrightName: '',
    copyrightText: '',
    mainSEO: {},
    identityTranslations: normalizeIdentityTranslations(),
    pwaInstallPrompt: {
        enabled: true,
        text: 'ثبّت الأداة على جهازك لاستخدام أسرع',
        buttonText: 'ثبّت الأداة',
        manualInstructions: 'على iPhone وiPad: افتح قائمة المشاركة ثم اختر إضافة إلى الشاشة الرئيسية.',
    },
    pwaUpdatePrompt: normalizePwaUpdatePrompt(),
};

export function normalizePwaInstallPrompt(value = {}) {
    return {
        enabled: value?.enabled !== false,
        text: String(value?.text || 'ثبّت الأداة على جهازك لاستخدام أسرع'),
        buttonText: String(value?.buttonText || 'ثبّت الأداة'),
        manualInstructions: String(value?.manualInstructions || 'على iPhone وiPad: افتح قائمة المشاركة ثم اختر إضافة إلى الشاشة الرئيسية.'),
    };
}

export function pickIdentity(config = {}) {
    const identityPatch = IDENTITY_FIELDS.reduce((patch, field) => {
        patch[field] = field === 'hasLogo' ? Boolean(config[field]) : (config[field] || '');
        return patch;
    }, {});

    return {
        ...identityPatch,
        mainSEO: config.mainSEO || {},
        identityTranslations: normalizeIdentityTranslations(config.identityTranslations),
        pwaInstallPrompt: normalizePwaInstallPrompt(config.pwaInstallPrompt || {}),
        pwaUpdatePrompt: normalizePwaUpdatePrompt(config.pwaUpdatePrompt),
    };
}

export default function IdentitySettingsSections({
    identity,
    uploadingTarget,
    onFieldChange,
    onPwaInstallPromptChange,
    onMediaUpload,
}) {
    const [contentLanguage, setContentLanguage] = useState('ar');
    const englishIdentity = normalizeIdentityTranslations(identity.identityTranslations).en;
    const isEnglish = contentLanguage === 'en';
    const displayedIdentity = isEnglish ? { ...identity, ...englishIdentity } : identity;
    const displayedPwaPrompt = isEnglish
        ? { ...(identity.pwaInstallPrompt || {}), ...(englishIdentity.pwaInstallPrompt || {}) }
        : identity.pwaInstallPrompt;
    const updateTextField = (field, value) => {
        if (!isEnglish) return onFieldChange(field, value);
        return onFieldChange('identityTranslations', {
            ...normalizeIdentityTranslations(identity.identityTranslations),
            en: { ...englishIdentity, [field]: value },
        });
    };
    const updatePwaTextField = (field, value) => {
        if (!isEnglish) return onPwaInstallPromptChange(field, value);
        return onFieldChange('identityTranslations', {
            ...normalizeIdentityTranslations(identity.identityTranslations),
            en: {
                ...englishIdentity,
                pwaInstallPrompt: { ...englishIdentity.pwaInstallPrompt, [field]: value },
            },
        });
    };
    const copyrightPreview = `© ${new Date().getFullYear()} ${displayedIdentity.copyrightText || (isEnglish ? 'All rights reserved' : 'جميع الحقوق محفوظة')}${displayedIdentity.copyrightName ? ` ${isEnglish ? 'for' : 'لـ'} ${displayedIdentity.copyrightName}` : ''}`;
    const pwaPreviewIcon = identity.appIconUrl || identity.logoUrl || identity.faviconUrl || '';
    const pwaShortcutItems = [
        { key: 'date', label: 'اختصار التاريخ', field: 'pwaShortcutDateIconUrl', category: 'pwa-shortcut-date' },
        { key: 'clock', label: 'اختصار الساعة', field: 'pwaShortcutClockIconUrl', category: 'pwa-shortcut-clock' },
        { key: 'weather', label: 'اختصار الطقس', field: 'pwaShortcutWeatherIconUrl', category: 'pwa-shortcut-weather' },
    ];

    return (
        <>
            <div className="admin-content-language-toolbar" aria-label="لغة محتوى الهوية">
                <div>
                    <strong>لغة بيانات الهوية</strong>
                    <small>اختر اللغة التي تريد تعبئة نصوصها. الصور والبريد مشتركة بين اللغتين.</small>
                </div>
                <div className="admin-language-segmented" role="group" aria-label="اختيار لغة بيانات الهوية">
                    <button type="button" className={contentLanguage === 'ar' ? 'active' : ''} onClick={() => setContentLanguage('ar')}>العربية</button>
                    <button type="button" className={contentLanguage === 'en' ? 'active' : ''} onClick={() => setContentLanguage('en')}>English</button>
                </div>
            </div>
            <section className="legacy-google-card tools-section-card identity-basic-settings-card" id="identity-basic-settings">
                <div className="tools-section-head">
                    <div className="tools-section-title">
                        <span className="tools-section-icon color-identity"><i className="fa-solid fa-fingerprint"></i></span>
                        <div>
                            <h2>التعديل الأساسي للأداة</h2>
                            <p>عدّل اسم الأداة، السلوغن، البريد، الشعار، الأيقونات، وحقوق الموقع من مكان واحد.</p>
                        </div>
                    </div>
                </div>

                <div className="legacy-identity-layout">
                    <div className="legacy-identity-card">
                        <div className="identity-card-note">
                            <span className="identity-card-note-icon"><i className="fa-solid fa-fingerprint"></i></span>
                            <div>
                                <h3>بيانات العلامة</h3>
                                <p>هذا القسم يحفظ حقول الهوية فقط، ولا يغيّر إعدادات الإعلانات أو الصفحات.</p>
                            </div>
                        </div>

                        <div className="legacy-form-grid">
                            <div className="legacy-field">
                                <label>عنوان الأداة</label>
                                <input
                                    type="text"
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedIdentity.toolDisplayName || ''}
                                    onChange={(event) => updateTextField('toolDisplayName', event.target.value)}
                                    placeholder={isEnglish ? 'Example: Comprehensive Date Tools' : 'مثال: أدوات التاريخ الشاملة'}
                                />
                            </div>

                            <div className="legacy-field">
                                <label>الوصف القصير</label>
                                <input
                                    type="text"
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedIdentity.toolSlogan || ''}
                                    onChange={(event) => updateTextField('toolSlogan', event.target.value)}
                                    placeholder={isEnglish ? 'Example: Calculate age and convert dates accurately' : 'مثال: احسب عمرك وحول التواريخ بدقة'}
                                />
                            </div>

                            <div className="legacy-field">
                                <label>إيميل التواصل</label>
                                <input
                                    type="email"
                                    dir="ltr"
                                    value={identity.contactEmail}
                                    onChange={(event) => onFieldChange('contactEmail', event.target.value)}
                                    placeholder="contact@example.com"
                                />
                                <span className="legacy-field-hint">يستخدم أيضًا كقيمة لمتغير صفحات قاعدة البيانات: {'{{contactEmail}}'}</span>
                            </div>

                            <div className="legacy-field">
                                <label>إظهار الشعار</label>
                                <div className="legacy-switch-row admin-toggle-row">
                                    <AdminEnableToggle
                                        enabled={identity.hasLogo}
                                        onChange={(enabled) => onFieldChange('hasLogo', enabled)}
                                        enabledLabel="إخفاء الشعار"
                                        disabledLabel="إظهار الشعار"
                                    />
                                    <span>إظهار أو إخفاء الشعار فقط بدون إخفاء اسم الأداة</span>
                                </div>
                            </div>

                            <IdentityMediaField
                                label="الشعار"
                                field="logoUrl"
                                category="logo"
                                uploadLabel="الشعار"
                                value={identity.logoUrl}
                                uploadingTarget={uploadingTarget}
                                onMediaUpload={onMediaUpload}
                                hint="يفضل شعار PNG أو WEBP بخلفية شفافة."
                            />

                            <IdentityMediaField
                                label="رابط أيقونة المتصفح favicon"
                                field="faviconUrl"
                                category="favicon"
                                uploadLabel="أيقونة المتصفح"
                                value={identity.faviconUrl}
                                uploadingTarget={uploadingTarget}
                                onMediaUpload={onMediaUpload}
                                hint="يدعم ICO أو PNG، والحفظ النهائي يتم بزر حفظ إعدادات الأداة."
                                small
                            />

                            <div className="legacy-field">
                                <label>صاحب الحقوق</label>
                                <input
                                    type="text"
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedIdentity.copyrightName || ''}
                                    onChange={(event) => updateTextField('copyrightName', event.target.value)}
                                    placeholder={isEnglish ? 'Example: Date Tools' : 'مثال: أدوات التاريخ'}
                                />
                            </div>

                            <div className="legacy-field">
                                <label>نص الحقوق</label>
                                <input
                                    type="text"
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedIdentity.copyrightText || ''}
                                    onChange={(event) => updateTextField('copyrightText', event.target.value)}
                                    placeholder={isEnglish ? 'Example: All rights reserved' : 'مثال: جميع الحقوق محفوظة'}
                                />
                            </div>
                        </div>
                    </div>

                    <aside className="legacy-identity-preview-card">
                        <div className="legacy-preview-top">
                            <div className="legacy-logo-preview">
                                {identity.hasLogo && identity.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={identity.logoUrl} alt="معاينة الشعار" />
                                ) : (
                                    <i className="fa-solid fa-calendar-days"></i>
                                )}
                            </div>
                            <div>
                                <span className="legacy-preview-label">معاينة الهوية</span>
                                <h3>{displayedIdentity.toolDisplayName || (isEnglish ? 'Comprehensive Date Tools' : 'أدوات التاريخ الشاملة')}</h3>
                                <p>{displayedIdentity.toolSlogan || (isEnglish ? 'Calculate age and convert dates accurately' : 'احسب عمرك وحول التواريخ بدقة')}</p>
                            </div>
                        </div>

                        <div className="legacy-preview-row">
                            <span>إيميل التواصل</span>
                            <strong dir="ltr">{identity.contactEmail || 'غير محدد'}</strong>
                        </div>

                        <div className="legacy-preview-row">
                            <span>أيقونة المتصفح</span>
                            <div className="legacy-favicon-preview">
                                {identity.faviconUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={identity.faviconUrl} alt="معاينة أيقونة المتصفح" />
                                ) : (
                                    <i className="fa-regular fa-image"></i>
                                )}
                            </div>
                        </div>

                        <div className="legacy-rights-preview">
                            <i className="fa-regular fa-copyright"></i>
                            <span>{copyrightPreview}</span>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="legacy-google-card tools-section-card identity-pwa-settings-card" id="pwa-install-settings">
                <div className="tools-section-head">
                    <div className="tools-section-title">
                        <span className="tools-section-icon color-pwa"><i className="fa-solid fa-mobile-screen-button"></i></span>
                        <div>
                            <h2>هوية التطبيق والتثبيت</h2>
                            <p>كل ما يخص تثبيت الموقع كتطبيق: الأيقونة، اسم التطبيق، اختصارات الضغط المطوّل، وزر التثبيت.</p>
                        </div>
                    </div>
                </div>

                <div className="admin-content-language-toolbar section-language-toolbar" aria-label="لغة محتوى التثبيت">
                    <div>
                        <strong>لغة نصوص التثبيت</strong>
                        <small>اختر اللغة التي تريد تعبئة رسالة التثبيت وتعليماتها.</small>
                    </div>
                    <div className="admin-language-segmented" role="group" aria-label="اختيار لغة نصوص التثبيت">
                        <button type="button" className={contentLanguage === 'ar' ? 'active' : ''} onClick={() => setContentLanguage('ar')}>العربية</button>
                        <button type="button" className={contentLanguage === 'en' ? 'active' : ''} onClick={() => setContentLanguage('en')}>English</button>
                    </div>
                </div>

                <div className="identity-pwa-grid">
                    <div className="identity-pwa-controls">
                        <IdentityMediaField
                            label="أيقونة التطبيق المثبّت"
                            field="appIconUrl"
                            category="app-icon"
                            uploadLabel="أيقونة التطبيق"
                            value={identity.appIconUrl}
                            fallbackValue={identity.logoUrl || identity.faviconUrl}
                            uploadingTarget={uploadingTarget}
                            onMediaUpload={onMediaUpload}
                            hint="تظهر في نافذة التثبيت وأيقونة التطبيق على الجوال والكمبيوتر. الأفضل صورة مربعة 512×512."
                            small
                        />

                        <div className="ad-settings-switch house compact-switch admin-toggle-card">
                            <span className="ad-settings-switch-icon"><i className="fa-solid fa-download"></i></span>
                            <span className="ad-settings-switch-copy">
                                <strong>إظهار زر تثبيت الأداة</strong>
                                <small>يعرض تنبيه التثبيت عندما يدعم المتصفح تثبيت الموقع كتطبيق.</small>
                            </span>
                            <AdminEnableToggle
                                enabled={identity.pwaInstallPrompt?.enabled !== false}
                                onChange={(enabled) => onPwaInstallPromptChange('enabled', enabled)}
                                enabledLabel="إيقاف تنبيه التثبيت"
                                disabledLabel="تشغيل تنبيه التثبيت"
                            />
                        </div>

                        <div className="pwa-update-admin-controls">
                            <div className="ad-settings-switch house compact-switch admin-toggle-card">
                                <span className="ad-settings-switch-icon"><i className="fa-solid fa-arrows-rotate"></i></span>
                                <span className="ad-settings-switch-copy">
                                    <strong>إعلان تحديث للتطبيقات المثبّتة</strong>
                                    <small>يفحص آخر نسخة تلقائيًا داخل التطبيق المثبّت فقط. عطّل المفتاح مؤقتًا عند الحاجة لإيقاف الإشعارات.</small>
                                </span>
                                <AdminEnableToggle
                                    enabled={identity.pwaUpdatePrompt?.enabled === true}
                                    onChange={(enabled) => onFieldChange('pwaUpdatePrompt', normalizePwaUpdatePrompt({
                                        ...(identity.pwaUpdatePrompt || {}),
                                        enabled,
                                    }))}
                                    enabledLabel="إيقاف إشعارات التحديث"
                                    disabledLabel="تشغيل إشعارات التحديث"
                                />
                            </div>
                            <div className="legacy-field pwa-update-version-field">
                                <span>رقم التحديث المعلن</span>
                                <output dir="ltr" aria-label="آخر إصدار للتطبيق">{APP_VERSION}</output>
                                <small>يُقرأ تلقائيًا من آخر نسخة منشورة ويُقارن بالنسخة التي تعمل على جهاز المستخدم.</small>
                            </div>
                        </div>

                        <div className="legacy-form-grid two-columns no-top-margin">
                            <div className="legacy-field">
                                <label>نص رسالة التثبيت</label>
                                <input
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedPwaPrompt?.text || ''}
                                    onChange={(event) => updatePwaTextField('text', event.target.value)}
                                    placeholder={isEnglish ? 'Example: Install the app for faster access' : 'مثال: ثبّت الأداة على جهازك لاستخدام أسرع'}
                                />
                            </div>
                            <div className="legacy-field">
                                <label>نص زر التثبيت</label>
                                <input
                                    dir={isEnglish ? 'ltr' : 'rtl'}
                                    value={displayedPwaPrompt?.buttonText || ''}
                                    onChange={(event) => updatePwaTextField('buttonText', event.target.value)}
                                    placeholder={isEnglish ? 'Example: Install' : 'مثال: ثبّت الأداة'}
                                />
                            </div>
                        </div>

                        <div className="legacy-field pwa-manual-install-field">
                            <label>تعليمات التثبيت للأجهزة دون زر تثبيت مباشر</label>
                            <textarea
                                rows={3}
                                dir={isEnglish ? 'ltr' : 'rtl'}
                                value={displayedPwaPrompt?.manualInstructions || ''}
                                onChange={(event) => updatePwaTextField('manualInstructions', event.target.value)}
                                placeholder={isEnglish
                                    ? 'Example: On iPhone, open Share and choose Add to Home Screen.'
                                    : 'مثال: على iPhone افتح قائمة المشاركة ثم اختر إضافة إلى الشاشة الرئيسية.'}
                            />
                            <span className="legacy-field-hint">تظهر هذه التعليمات فقط عندما لا يوفر النظام زر تثبيت مباشر، مثل Safari على iPhone وiPad.</span>
                        </div>

                        <div className="pwa-shortcut-admin-list">
                            {pwaShortcutItems.map((item) => {
                                const iconValue = identity[item.field] || '';
                                return (
                                    <div className="pwa-shortcut-admin-row" key={item.key}>
                                        <div className="pwa-shortcut-admin-preview">
                                            {iconValue ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={iconValue} alt={item.label} />
                                            ) : (
                                                <i className="fa-regular fa-image"></i>
                                            )}
                                        </div>
                                        <div>
                                            <strong>{item.label}</strong>
                                            <small>{iconValue ? 'تم رفع الأيقونة' : 'لم ترفع أيقونة بعد'}</small>
                                        </div>
                                        <label className={`pwa-shortcut-upload ${uploadingTarget === item.field ? 'is-uploading' : ''}`}>
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                            <span>{uploadingTarget === item.field ? 'رفع...' : 'استبدال'}</span>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.webp,.ico,image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                                                disabled={uploadingTarget === item.field}
                                                onChange={(event) => onMediaUpload(event, item.category, item.field, item.label)}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="identity-pwa-preview-card">
                        <div className="identity-pwa-phone">
                            <div className="identity-pwa-app-icon">
                                {pwaPreviewIcon ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={pwaPreviewIcon} alt="أيقونة التطبيق" />
                                ) : (
                                    <i className="fa-solid fa-mobile-screen-button"></i>
                                )}
                            </div>
                            <span className="identity-pwa-phone-label">معاينة التثبيت</span>
                            <strong>{displayedIdentity.toolDisplayName || (isEnglish ? 'Comprehensive Date Tools' : 'أدوات التاريخ الشاملة')}</strong>
                            <p>{displayedIdentity.toolSlogan || (isEnglish ? 'All tools at your fingertips' : 'كل الأدوات بين يديك')}</p>
                            <button type="button">
                                <i className="fa-solid fa-mobile-screen-button"></i>
                                {displayedPwaPrompt?.buttonText || (isEnglish ? 'Install' : 'ثبّت الأداة')}
                            </button>
                        </div>

                        <div className="identity-pwa-shortcuts-preview">
                            <strong>اختصارات الضغط المطوّل</strong>
                            {pwaShortcutItems.map((item) => {
                                const iconValue = identity[item.field] || '';
                                return (
                                    <div className="identity-pwa-shortcut" key={item.key}>
                                        <span>
                                            {iconValue ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={iconValue} alt={item.label} />
                                            ) : (
                                                <i className="fa-regular fa-image"></i>
                                            )}
                                        </span>
                                        <small>{item.label.replace('اختصار ', '')}</small>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

function IdentityMediaField({
    label,
    field,
    category,
    uploadLabel,
    value,
    fallbackValue = '',
    uploadingTarget,
    onMediaUpload,
    hint,
    small = false,
}) {
    const previewValue = value || fallbackValue;
    const isUploading = uploadingTarget === field;

    return (
        <div className="legacy-field">
            <label>{label}</label>
            <label className={`legacy-media-picker legacy-media-tile ${isUploading ? 'is-uploading' : ''}`} title={isUploading ? `جاري رفع ${uploadLabel}` : `استبدال ${uploadLabel}`}>
                <span className={`legacy-media-picker-preview ${small ? 'small' : ''}`}>
                    {previewValue ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewValue} alt={`معاينة ${uploadLabel}`} />
                    ) : (
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                    )}
                </span>
                <span className="legacy-media-picker-overlay">
                    <i className={isUploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-camera-rotate'}></i>
                    <strong>{isUploading ? 'جاري الرفع...' : 'استبدال'}</strong>
                </span>
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif,.ico,image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon"
                    disabled={isUploading}
                    onChange={(event) => onMediaUpload(event, category, field, uploadLabel)}
                />
            </label>
            {hint && <span className="legacy-field-hint">{hint}</span>}
        </div>
    );
}
