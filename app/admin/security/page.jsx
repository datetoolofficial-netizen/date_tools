'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Toast from '../../components/Toast';
import { APP_VERSION, APP_VERSION_DATE } from '../../version';
import AdminEnableToggle from '../AdminEnableToggle';
import {
    getPrivacyPageChoices,
    normalizeSecurityPagePath,
    pickSecuritySettings,
} from '../securitySettings';

const REQUIRED_HEADERS = [
    ['x-content-type-options', 'منع تخمين نوع المحتوى'],
    ['x-frame-options', 'منع تضمين الموقع داخل إطار'],
    ['referrer-policy', 'تقليل بيانات الإحالة'],
    ['permissions-policy', 'تقييد صلاحيات المتصفح'],
    ['strict-transport-security', 'إجبار الاتصال المشفر'],
    ['cross-origin-opener-policy', 'عزل نافذة الموقع'],
    ['x-permitted-cross-domain-policies', 'منع سياسات النطاق القديمة'],
];

const EXTERNAL_REPORTS = [
    {
        title: 'CodeQL',
        detail: 'يفحص JavaScript وTypeScript وملفات GitHub Actions بعد كل دفع وطلب دمج وأسبوعيًا.',
        state: 'معدّ آليًا',
        icon: 'fa-code',
        tone: 'blue',
        href: 'https://github.com/datetoolofficial-netizen/date_tools/security/code-scanning',
    },
    {
        title: 'Dependabot',
        detail: 'ينبّه عند وجود اعتماد برمجي يحمل ثغرة معروفة ويعرض الحزمة والإصدار المتأثر.',
        state: 'تقارير الاعتماديات',
        icon: 'fa-boxes-stacked',
        tone: 'purple',
        href: 'https://github.com/datetoolofficial-netizen/date_tools/security/dependabot',
    },
    {
        title: 'Secret Scanning',
        detail: 'يراقب المستودع بحثًا عن أسرار ومفاتيح، ثم يحتاج كل تنبيه إلى مراجعة سياقه وقيوده.',
        state: 'مفعّل في GitHub',
        icon: 'fa-key',
        tone: 'orange',
        href: 'https://github.com/datetoolofficial-netizen/date_tools/security/secret-scanning',
    },
    {
        title: 'Cloudflare Security',
        detail: 'يعرض طلبات WAF والحظر وسجلات Worker وتقارير CSP التي لا تُخزّن داخل لوحة الموقع.',
        state: 'تقارير الحافة',
        icon: 'fa-cloud',
        tone: 'cyan',
        href: 'https://dash.cloudflare.com/',
    },
    {
        title: 'Firebase App Check',
        detail: 'يعرض نسب الطلبات الموثقة والقديمة ومجهولة المصدر قبل اتخاذ قرار فرض الحماية.',
        state: 'Monitoring',
        icon: 'fa-fire-flame-curved',
        tone: 'orange',
        href: 'https://console.firebase.google.com/project/date-tool-official/appcheck/products',
    },
    {
        title: 'GitHub Security Advisories',
        detail: 'قناة خاصة لاستلام بلاغات الثغرات ومناقشتها دون نشر التفاصيل في Issues العامة.',
        state: 'إبلاغ خاص',
        icon: 'fa-user-shield',
        tone: 'green',
        href: 'https://github.com/datetoolofficial-netizen/date_tools/security/advisories',
    },
];

const PROTECTION_AREAS = [
    {
        title: 'الجلسات وصلاحيات الإدارة',
        detail: 'Firebase Authentication مع أدوار مدير كامل ومساعد وصلاحية مستقلة لكل صفحة إدارية.',
        state: 'مطبّق',
        tone: 'success',
        icon: 'fa-user-lock',
    },
    {
        title: 'قواعد Firestore',
        detail: 'الإعدادات الخاصة محصورة بالإدارة، والواجهة العامة تقرأ إسقاط settings/public المحدود فقط.',
        state: 'منشورة',
        tone: 'success',
        icon: 'fa-database',
    },
    {
        title: 'مفتاح Firebase Web',
        detail: 'مفتاح عميل عام مقيّد بنطاقات الموقع وثماني واجهات Firebase لازمة بدل اعتباره سرًا.',
        state: 'مقيّد',
        tone: 'success',
        icon: 'fa-key',
    },
    {
        title: 'رفع الملفات إلى R2',
        detail: 'يتحقق الخادم من الجلسة والنوع الحقيقي والحجم والامتداد والمجلد المسموح قبل التخزين.',
        state: 'محمي خادميًا',
        tone: 'success',
        icon: 'fa-file-circle-check',
    },
    {
        title: 'CSP ورؤوس المتصفح',
        detail: 'الرؤوس مفروضة، بينما CSP في Report-Only حتى تنتهي مراقبة المصادر دون كسر الخدمات.',
        state: 'مراقبة',
        tone: 'warning',
        icon: 'fa-file-shield',
    },
    {
        title: 'App Check',
        detail: 'العميل مهيأ، لكن Firestore يبقى Monitoring إلى أن تنخفض الطلبات مجهولة المصدر.',
        state: 'ينتظر التقارير',
        tone: 'warning',
        icon: 'fa-fingerprint',
    },
    {
        title: 'Cloudflare WAF وRate Limiting',
        detail: 'الحظر والسجلات وسياسات المعدل تُراجع من Cloudflare لأنها إعدادات حافة وليست إعدادات قاعدة بيانات.',
        state: 'خارجي',
        tone: 'external',
        icon: 'fa-cloud-bolt',
    },
    {
        title: 'النسخ الاحتياطي',
        detail: 'الأزرار تذكيرية فقط حتى تتوفر خطة Firebase التي تدعم النسخ والاستعادة المجدولة.',
        state: 'يتطلب خطة',
        tone: 'external',
        icon: 'fa-cloud-arrow-up',
    },
];

function statusTone(ok, warning = false) {
    if (warning) return 'warning';
    return ok ? 'success' : 'danger';
}

function SecurityStatusCard({ icon, title, value, detail, tone }) {
    return (
        <article className={`security-status-card is-${tone}`}>
            <span><i className={`fa-solid ${icon}`} aria-hidden="true"></i></span>
            <div>
                <small>{title}</small>
                <strong>{value}</strong>
                <p>{detail}</p>
            </div>
        </article>
    );
}

function SectionHeading({ icon, title, description }) {
    return (
        <header className="security-section-heading">
            <span><i className={`fa-solid ${icon}`} aria-hidden="true"></i></span>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </header>
    );
}

export default function AdminSecurityPage() {
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cleaning, setCleaning] = useState(false);
    const [message, setMessage] = useState(null);
    const [language, setLanguage] = useState('ar');
    const [settings, setSettings] = useState(pickSecuritySettings());
    const [checks, setChecks] = useState({
        headers: { passed: 0, total: REQUIRED_HEADERS.length, items: [] },
        turnstile: { enabled: false, checked: false },
        appCheck: { configured: false, initialized: false, checked: false },
        csp: { available: false, reportOnly: false },
        version: APP_VERSION,
        checkedAt: null,
    });
    const firebaseApiRef = useRef(null);
    const messageTimerRef = useRef(null);

    const showMessage = useCallback((type, text) => {
        if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current);
        setMessage({ type, text });
        messageTimerRef.current = window.setTimeout(() => setMessage(null), 5000);
    }, []);

    const runSecurityChecks = useCallback(async ({ initial = false } = {}) => {
        if (!initial) setChecking(true);

        try {
            const firebaseApi = await import('../../firebase');
            const [configResult, appCheckResult, turnstileResult, headersResult, cspResult, versionResult] = await Promise.allSettled([
                firebaseApi.getSiteConfig(),
                firebaseApi.getFirebaseAppCheckStatus(),
                fetch('/api/security/turnstile', { cache: 'no-store' }).then((response) => response.json()),
                fetch('/', { method: 'HEAD', cache: 'no-store' }),
                fetch('/api/csp-report', { cache: 'no-store' }),
                fetch('/api/app-version', { cache: 'no-store' }).then((response) => response.json()),
            ]);

            firebaseApiRef.current = {
                getFirebaseAuth: firebaseApi.getFirebaseAuth,
                saveSiteConfigSection: firebaseApi.saveSiteConfigSection,
            };

            if (configResult.status === 'fulfilled') {
                setSettings(pickSecuritySettings(configResult.value));
            }

            const headerResponse = headersResult.status === 'fulfilled' ? headersResult.value : null;
            const headerItems = REQUIRED_HEADERS.map(([name, label]) => ({
                name,
                label,
                enabled: Boolean(headerResponse?.headers?.get(name)),
            }));
            const cspHeader = headerResponse?.headers?.get('content-security-policy-report-only') || '';
            const appCheck = appCheckResult.status === 'fulfilled' ? appCheckResult.value : {};
            const turnstile = turnstileResult.status === 'fulfilled' ? turnstileResult.value : {};
            const cspAvailable = cspResult.status === 'fulfilled' && cspResult.value.status === 204;

            setChecks({
                headers: {
                    passed: headerItems.filter((item) => item.enabled).length,
                    total: headerItems.length,
                    items: headerItems,
                },
                turnstile: { enabled: turnstile.enabled === true, checked: true },
                appCheck: {
                    configured: appCheck.configured === true,
                    initialized: appCheck.initialized === true,
                    checked: true,
                },
                csp: { available: cspAvailable, reportOnly: Boolean(cspHeader) },
                version: versionResult.status === 'fulfilled' ? versionResult.value.version || APP_VERSION : APP_VERSION,
                checkedAt: new Date(),
            });

            if (!initial) showMessage('success', 'اكتمل الفحص الحي لإعدادات الحماية المتاحة للموقع.');
        } catch (error) {
            console.error('Security dashboard check failed:', error);
            showMessage('error', 'تعذر إكمال فحص الحماية. أعد المحاولة بعد لحظات.');
        } finally {
            setLoading(false);
            setChecking(false);
        }
    }, [showMessage]);

    useEffect(() => {
        runSecurityChecks({ initial: true });
        return () => {
            if (messageTimerRef.current) window.clearTimeout(messageTimerRef.current);
        };
    }, [runSecurityChecks]);

    const privacyChoices = useMemo(
        () => getPrivacyPageChoices(settings.internalPages),
        [settings.internalPages],
    );
    const selectedPrivacyPages = useMemo(
        () => new Set(settings.privacySettingsButton.pages.map(normalizeSecurityPagePath)),
        [settings.privacySettingsButton.pages],
    );

    const updatePrivacyEnabled = (enabled) => {
        setSettings((current) => ({
            ...current,
            privacySettingsButton: { ...current.privacySettingsButton, enabled },
        }));
    };

    const togglePrivacyPage = (path) => {
        const safePath = normalizeSecurityPagePath(path);
        setSettings((current) => {
            const pages = current.privacySettingsButton.pages.map(normalizeSecurityPagePath);
            return {
                ...current,
                privacySettingsButton: {
                    ...current.privacySettingsButton,
                    pages: pages.includes(safePath)
                        ? pages.filter((item) => item !== safePath)
                        : [...pages, safePath],
                },
            };
        });
    };

    const savePrivacySettings = async () => {
        if (!firebaseApiRef.current?.saveSiteConfigSection) {
            showMessage('error', 'لم تكتمل تهيئة إعدادات الموقع بعد.');
            return;
        }

        setSaving(true);
        try {
            const saved = await firebaseApiRef.current.saveSiteConfigSection({
                privacySettingsButton: settings.privacySettingsButton,
            });
            const savedSettings = pickSecuritySettings(saved);
            setSettings((current) => ({
                ...current,
                privacySettingsButton: savedSettings.privacySettingsButton,
            }));
            showMessage('success', 'تم حفظ إعداد زر الخصوصية والصفحات المختارة.');
        } catch (error) {
            console.error('Privacy security settings save failed:', error);
            showMessage('error', 'تعذر حفظ إعداد الخصوصية. تحقق من صلاحية المدير.');
        } finally {
            setSaving(false);
        }
    };

    const cleanupFirebaseData = async () => {
        if (!window.confirm('سيتم حذف حقول Firestore القديمة غير المستخدمة فقط. هل تريد المتابعة؟')) return;

        setCleaning(true);
        try {
            const auth = await firebaseApiRef.current?.getFirebaseAuth?.();
            if (typeof auth?.authStateReady === 'function') await auth.authStateReady();
            if (!auth?.currentUser) throw new Error('not_authenticated');
            const token = await auth.currentUser.getIdToken();
            const response = await fetch('/api/admin/cleanup', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok || payload.ok === false) throw new Error(payload.error || 'cleanup_failed');
            showMessage('success', 'تم تنظيف بيانات Firebase القديمة غير المستخدمة.');
        } catch (error) {
            console.error('Firebase cleanup failed:', error);
            showMessage('error', 'تعذر تنظيف Firebase. العملية متاحة للمدير الكامل فقط.');
        } finally {
            setCleaning(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <i className="fa-solid fa-shield-halved fa-beat-fade"></i>
                <h3>جاري فحص إعدادات الحماية...</h3>
            </div>
        );
    }

    const allHeadersEnabled = checks.headers.passed === checks.headers.total;
    const appCheckHealthy = checks.appCheck.configured && checks.appCheck.initialized;

    return (
        <div className="admin-security-page" dir="rtl">
            <Toast
                message={message?.text || ''}
                type={message?.type || 'info'}
                visible={Boolean(message?.text)}
                onClose={() => setMessage(null)}
            />

            <section className="security-hero">
                <div>
                    <span className="security-hero-eyebrow">مركز الحماية</span>
                    <h1><i className="fa-solid fa-shield-halved" aria-hidden="true"></i> الأمان</h1>
                    <p>حالة الحماية الحالية، روابط التقارير الخارجية، وإعدادات الخصوصية والصيانة الحساسة في صفحة واحدة.</p>
                </div>
                <div className="security-hero-actions">
                    <span>الإصدار <b dir="ltr">{checks.version}</b></span>
                    <button type="button" onClick={() => runSecurityChecks()} disabled={checking}>
                        <i className={`fa-solid fa-arrows-rotate ${checking ? 'fa-spin' : ''}`}></i>
                        {checking ? 'جاري الفحص' : 'فحص الآن'}
                    </button>
                    <small>{checks.checkedAt ? `آخر فحص: ${checks.checkedAt.toLocaleTimeString('ar-SA')}` : APP_VERSION_DATE}</small>
                </div>
            </section>

            <section className="security-status-grid" aria-label="ملخص حالة الحماية">
                <SecurityStatusCard
                    icon="fa-lock"
                    title="رؤوس المتصفح"
                    value={`${checks.headers.passed}/${checks.headers.total}`}
                    detail={allHeadersEnabled ? 'جميع الرؤوس الأساسية ظاهرة' : 'توجد رؤوس تحتاج مراجعة'}
                    tone={statusTone(allHeadersEnabled)}
                />
                <SecurityStatusCard
                    icon="fa-shield-halved"
                    title="Cloudflare Turnstile"
                    value={checks.turnstile.enabled ? 'فعّال' : 'غير مهيأ'}
                    detail="يحمي الدخول والتسجيل وإعادة كلمة المرور"
                    tone={statusTone(checks.turnstile.enabled)}
                />
                <SecurityStatusCard
                    icon="fa-fingerprint"
                    title="Firebase App Check"
                    value={appCheckHealthy ? 'مهيأ' : 'يحتاج مراجعة'}
                    detail="الفرض يبقى Monitoring حتى استقرار التقارير"
                    tone={statusTone(appCheckHealthy, appCheckHealthy)}
                />
                <SecurityStatusCard
                    icon="fa-file-shield"
                    title="تقارير CSP"
                    value={checks.csp.available ? 'يستقبل التقارير' : 'غير متاح'}
                    detail={checks.csp.reportOnly ? 'السياسة في وضع المراقبة الآمن' : 'ترويسة المراقبة غير ظاهرة'}
                    tone={statusTone(checks.csp.available && checks.csp.reportOnly, checks.csp.reportOnly)}
                />
            </section>

            <section className="security-panel">
                <SectionHeading
                    icon="fa-wave-square"
                    title="التقارير والأحداث الأمنية"
                    description="كل مزود يحتفظ بسجلاته داخل منصته؛ تفتح الأزرار التقرير الأصلي دون نقل رموز الحساب إلى الموقع."
                />
                <div className="security-report-grid">
                    {EXTERNAL_REPORTS.map((report) => (
                        <a href={report.href} target="_blank" rel="noopener noreferrer" key={report.title} className={`tone-${report.tone}`}>
                            <span><i className={`fa-solid ${report.icon}`}></i></span>
                            <div>
                                <strong>{report.title}</strong>
                                <p>{report.detail}</p>
                                <small>{report.state}</small>
                            </div>
                            <i className="fa-solid fa-up-right-from-square" aria-hidden="true"></i>
                        </a>
                    ))}
                </div>
                <div className="security-info-note">
                    <i className="fa-solid fa-circle-info"></i>
                    <p><strong>كيف تصل التنبيهات؟</strong> CodeQL وDependabot وSecret Scanning يضعون النتائج داخل تبويب Security في GitHub. Cloudflare يسجل WAF وWorker وCSP، وFirebase يعرض App Check. هذه الصفحة تتحقق حيًا من إعدادات الموقع فقط ثم توصلك إلى المصدر الكامل للتقرير.</p>
                </div>
            </section>

            <section className="security-panel">
                <SectionHeading
                    icon="fa-list-check"
                    title="تفاصيل الفحص الحي"
                    description="اختبار غير مؤثر للرؤوس الأمنية والخدمات العامة المستخدمة في النسخة المفتوحة الآن."
                />
                <div className="security-check-list">
                    {checks.headers.items.map((item) => (
                        <div key={item.name}>
                            <span className={item.enabled ? 'is-pass' : 'is-fail'}>
                                <i className={`fa-solid ${item.enabled ? 'fa-check' : 'fa-xmark'}`}></i>
                            </span>
                            <div><strong>{item.label}</strong><code dir="ltr">{item.name}</code></div>
                            <b>{item.enabled ? 'مفعّل' : 'مفقود'}</b>
                        </div>
                    ))}
                </div>
            </section>

            <section className="security-panel">
                <SectionHeading
                    icon="fa-shield"
                    title="خريطة حماية المنصة"
                    description="ملخص طبقات الحماية الموجودة في الكود أو المنصات الخارجية وحالة كل طبقة حاليًا."
                />
                <div className="security-protection-grid">
                    {PROTECTION_AREAS.map((area) => (
                        <article key={area.title} className={`is-${area.tone}`}>
                            <span><i className={`fa-solid ${area.icon}`}></i></span>
                            <div><strong>{area.title}</strong><p>{area.detail}</p></div>
                            <small>{area.state}</small>
                        </article>
                    ))}
                </div>
            </section>

            <section className="security-panel" id="privacy-controls">
                <SectionHeading
                    icon="fa-cookie-bite"
                    title="الخصوصية وموافقة الزائر"
                    description="بعد أول موافقة يظهر زر إعدادات الخصوصية في الصفحات المختارة فقط؛ قبل الموافقة يبقى تنبيه الموافقة متاحًا للزائر."
                />
                <div className="security-privacy-toolbar">
                    <div><strong>لغة أسماء الصفحات</strong><small>المسارات والإعدادات مشتركة بين العربية والإنجليزية.</small></div>
                    <div className="admin-language-segmented" role="group" aria-label="لغة أسماء صفحات الخصوصية">
                        <button type="button" className={language === 'ar' ? 'active' : ''} onClick={() => setLanguage('ar')}>العربية</button>
                        <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
                    </div>
                </div>
                <div className="security-privacy-toggle">
                    <div><strong>إظهار زر إعدادات الخصوصية</strong><small>يشغّل الزر الدائم في الصفحات المحددة بعد حفظ موافقة الزائر.</small></div>
                    <AdminEnableToggle
                        enabled={settings.privacySettingsButton.enabled}
                        onChange={updatePrivacyEnabled}
                        enabledLabel="إخفاء زر إعدادات الخصوصية"
                        disabledLabel="إظهار زر إعدادات الخصوصية"
                    />
                </div>
                <div className="security-privacy-pages">
                    {privacyChoices.map((page) => (
                        <label key={page.path}>
                            <input
                                type="checkbox"
                                checked={selectedPrivacyPages.has(normalizeSecurityPagePath(page.path))}
                                onChange={() => togglePrivacyPage(page.path)}
                            />
                            <span>{language === 'en' ? (page.titleEn || page.title) : page.title}</span>
                            <code dir="ltr">{page.path}</code>
                        </label>
                    ))}
                </div>
                <div className="security-panel-actions">
                    <button type="button" className="legacy-primary-btn" onClick={savePrivacySettings} disabled={saving}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الخصوصية'}
                    </button>
                </div>
            </section>

            <section className="security-maintenance-grid">
                <article className="security-panel">
                    <SectionHeading
                        icon="fa-broom"
                        title="تنظيف Firebase"
                        description="يحذف الحقول القديمة المحددة مسبقًا فقط عبر مسار خادمي محمي ومتاح للمدير الكامل."
                    />
                    <button type="button" className="legacy-secondary-btn security-maintenance-action" onClick={cleanupFirebaseData} disabled={cleaning}>
                        <i className="fa-solid fa-broom"></i>
                        {cleaning ? 'جاري التنظيف...' : 'تنظيف البيانات القديمة'}
                    </button>
                </article>

                <article className="security-panel">
                    <SectionHeading
                        icon="fa-database"
                        title="النسخ الاحتياطي والاستعادة"
                        description="تذكير بتفعيل نسخة دورية وتجربة الاستعادة عند الانتقال إلى الخطة المدفوعة."
                    />
                    <div className="security-backup-actions">
                        <button type="button" className="legacy-secondary-btn" onClick={() => showMessage('error', 'يجب الاشتراك في الخطة المدفوعة لتفعيل النسخ الاحتياطي والاستعادة.')}>
                            <i className="fa-solid fa-cloud-arrow-up"></i> نسخ احتياطي
                        </button>
                        <button type="button" className="legacy-secondary-btn" onClick={() => showMessage('error', 'يجب الاشتراك في الخطة المدفوعة لتفعيل النسخ الاحتياطي والاستعادة.')}>
                            <i className="fa-solid fa-clock-rotate-left"></i> استعادة
                        </button>
                    </div>
                </article>
            </section>
        </div>
    );
}
