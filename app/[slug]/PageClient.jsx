'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Toast from '../components/Toast';
import { sanitizeHtml } from '../sanitizeHtml';

const DEFAULT_PAGE_CONTENT = {
    about: `
        <section class="static-rich-page">
            <p>أدوات التاريخ الشاملة موقع عربي بسيط صمم لمساعدة المستخدم على إنجاز حسابات التاريخ اليومية بدقة ووضوح، مثل حساب العمر، تحويل التاريخ بين الميلادي والهجري، حساب المدة بين تاريخين، ومعرفة معلومات الوقت والطقس بطريقة منظمة.</p>
            <p>نركز على أن تكون الأدوات سهلة الاستخدام، سريعة التحميل، ومناسبة للجوال والكمبيوتر. لذلك نحاول تقديم النتائج بلغة مفهومة مع واجهة نظيفة لا تشتت المستخدم، مع تطوير مستمر بناء على ملاحظات الزوار.</p>
            <h2>ما الذي نقدمه؟</h2>
            <ul>
                <li>أدوات تاريخ دقيقة للاستخدام الشخصي والتعليمي والتنظيمي.</li>
                <li>محتوى إرشادي يوضح الفرق بين التقاويم وطريقة قراءة النتائج.</li>
                <li>صفحات واضحة للخصوصية، شروط الاستخدام، وطرق التواصل.</li>
                <li>تجربة متوافقة مع الأجهزة المختلفة وبأداء مناسب.</li>
            </ul>
            <p>الموقع لا يغني عن الجهات الرسمية في المعاملات القانونية أو الحكومية، لكنه يقدم وسيلة عملية وسريعة للفهم والحساب اليومي.</p>
        </section>
    `,
    privacy: `
        <section class="static-rich-page">
            <p>نحترم خصوصية زوار أدوات التاريخ الشاملة، ونسعى إلى تقليل البيانات التي نجمعها إلى الحد اللازم لتشغيل الموقع وتحسين التجربة.</p>
            <h2>البيانات التي قد نعالجها</h2>
            <ul>
                <li>بيانات استخدام عامة مثل عدد الزيارات واستخدام الأدوات، دون بيع بياناتك الشخصية.</li>
                <li>معلومات ترسلها طوعًا عند استخدام نموذج التواصل مثل الاسم والبريد الإلكتروني ونص الرسالة.</li>
                <li>إذن الموقع الجغرافي لا يطلب إلا لتحسين أدوات الوقت والطقس، ولا نحفظ إحداثياتك في قاعدة البيانات.</li>
            </ul>
            <h2>الإعلانات وملفات تعريف الارتباط</h2>
            <p>قد يستخدم الموقع Google AdSense أو خدمات مشابهة لعرض إعلانات. قد تستخدم هذه الخدمات ملفات تعريف الارتباط أو معرفات مشابهة لعرض إعلانات مناسبة وقياس الأداء وفق سياسات مزود الخدمة.</p>
            <p>يمكنك التحكم في ملفات تعريف الارتباط وإعدادات الخصوصية من إعدادات المتصفح أو من أدوات Google المخصصة لإعلاناتها.</p>
            <h2>حماية البيانات</h2>
            <p>نستخدم خدمات موثوقة مثل Firebase وCloudflare لتشغيل الموقع وحماية الطلبات. ورغم أننا نبذل جهدًا معقولًا لحماية البيانات، لا توجد وسيلة نقل عبر الإنترنت مضمونة بالكامل.</p>
            <h2>التواصل</h2>
            <p>لأي استفسار متعلق بالخصوصية يمكنك مراسلتنا عبر صفحة اتصل بنا أو على البريد: <a href="mailto:{{contactEmail}}">{{contactEmail}}</a></p>
        </section>
    `,
    terms: `
        <section class="static-rich-page">
            <p>باستخدامك لموقع أدوات التاريخ الشاملة فإنك توافق على هذه الشروط. إذا لم توافق عليها، يرجى التوقف عن استخدام الموقع.</p>
            <h2>طبيعة الخدمة</h2>
            <p>الأدوات المتاحة في الموقع تقدم نتائج حسابية وإرشادية لمساعدة المستخدم في فهم التواريخ والأوقات. النتائج مبنية على معادلات وتقويمات شائعة، لكنها لا تعد وثيقة رسمية أو بديلًا عن الجهات المختصة.</p>
            <h2>الاستخدام المقبول</h2>
            <ul>
                <li>يمنع استخدام الموقع بطريقة تؤثر على استقراره أو تستهلك موارده بشكل آلي مفرط.</li>
                <li>يمنع محاولة تجاوز أنظمة الحماية أو إساءة استخدام نماذج التواصل والإعلانات.</li>
                <li>يتحمل المستخدم مسؤولية التأكد من النتائج قبل استخدامها في معاملات رسمية.</li>
            </ul>
            <h2>الإعلانات والروابط الخارجية</h2>
            <p>قد يحتوي الموقع على إعلانات أو روابط خارجية. لا نتحمل مسؤولية محتوى المواقع الخارجية، وينبغي للمستخدم مراجعة سياساتها وشروطها قبل التعامل معها.</p>
            <h2>تحديث الشروط</h2>
            <p>قد يتم تحديث هذه الشروط من وقت لآخر لتحسين الوضوح أو مواكبة تغييرات الخدمة. استمرار استخدامك للموقع بعد التحديث يعني قبولك بالشروط الجديدة.</p>
        </section>
    `,
};

const initialContactForm = {
    senderName: '',
    senderEmail: '',
    subject: '',
    message: '',
    website: '',
};

function normalizeSlug(value = '') {
    return String(value)
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

function findPageInList(pages, slug) {
    const currentSlug = normalizeSlug(slug);

    return pages.find((page) => {
        const pageSlug = normalizeSlug(
            page?.slug ||
            page?.path ||
            page?.url ||
            page?.link ||
            ''
        );

        return pageSlug === currentSlug;
    });
}

function findPageBySlug(config, slug) {
    if (!config) return null;

    const currentSlug = normalizeSlug(slug);
    const customPages = config.customPages || {};
    const pages = config.pages || {};
    const internalPage = Array.isArray(config.internalPages)
        ? findPageInList(config.internalPages, currentSlug)
        : null;

    if (!currentSlug) return null;

    if (customPages && !Array.isArray(customPages) && customPages[currentSlug]) {
        return {
            ...(internalPage || {}),
            ...customPages[currentSlug],
            slug: currentSlug,
            title: customPages[currentSlug].title || internalPage?.title,
        };
    }

    if (pages && !Array.isArray(pages) && pages[currentSlug]) {
        return {
            ...pages[currentSlug],
            slug: currentSlug,
        };
    }

    if (Array.isArray(customPages)) {
        const customPage = findPageInList(customPages, currentSlug);
        if (customPage) return customPage;
    }

    if (internalPage) return internalPage;

    if (Array.isArray(pages)) {
        return findPageInList(pages, currentSlug);
    }

    return null;
}

function getPageTitle(page) {
    return (
        page?.title ||
        page?.pageTitle ||
        page?.name ||
        page?.label ||
        'صفحة'
    );
}

function getPageDescription(page) {
    return (
        page?.description ||
        page?.seoDescription ||
        page?.summary ||
        ''
    );
}

function getPageContent(page) {
    return (
        page?.content ||
        page?.html ||
        page?.body ||
        page?.text ||
        ''
    );
}

function applyConfigVariables(content, config) {
    const replacements = {
        contactEmail: config?.contactEmail || '',
    };

    return String(content || '').replace(/\{\{\s*(contactEmail)\s*\}\}/g, (_, key) => replacements[key]);
}

function getEnhancedContent(slug, content) {
    const normalized = normalizeSlug(slug);
    const current = String(content || '').trim();
    if (normalized === 'about') return current;

    const fallback = DEFAULT_PAGE_CONTENT[normalized] || '';

    if (!fallback) return current;
    if (current.replace(/<[^>]*>/g, '').trim().length >= 650) return current;

    return fallback;
}

function PageFrame({ lang, title, children, align = 'right' }) {
    return (
        <div className="container">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" className="control-btn" style={{ textDecoration: 'none', width: 'auto', padding: '0 15px' }}>
                    <i className="fa-solid fa-arrow-right"></i> {lang === 'ar' ? 'العودة' : 'Back'}
                </Link>
                <h1>{title}</h1>
                <div style={{ width: '80px' }}></div>
            </div>

            <div className="card" style={{ lineHeight: '1.8', textAlign: align }}>
                {children}
            </div>
        </div>
    );
}

function ContactForm() {
    const [form, setForm] = useState(initialContactForm);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [notice, setNotice] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const updateAttachment = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            setAttachmentFile(null);
            return;
        }

        if (!file.type.startsWith('image/')) {
            event.target.value = '';
            setAttachmentFile(null);
            setNotice({ text: 'يرجى اختيار صورة فقط بصيغة PNG أو JPG أو WEBP أو GIF.', type: 'error' });
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            event.target.value = '';
            setAttachmentFile(null);
            setNotice({ text: 'حجم الصورة كبير. الحد الأقصى المسموح هو 3MB.', type: 'error' });
            return;
        }

        setAttachmentFile(file);
        setNotice({ text: 'تم اختيار الصورة، وسيتم رفعها بأمان مع الرسالة.', type: 'success' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (form.message.trim().length < 10) {
            setNotice({ text: 'اكتب رسالة أوضح، 10 أحرف على الأقل.', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const payload = new FormData();
            Object.entries(form).forEach(([key, value]) => payload.append(key, value));
            if (attachmentFile) payload.append('attachment', attachmentFile);

            const response = await fetch('/api/support', {
                method: 'POST',
                body: payload,
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) throw new Error(result.error || 'support_failed');

            setNotice({ text: `تم إرسال رسالتك بنجاح. رقم التذكرة: ${result.ticketNumber}`, type: 'success' });
            setForm(initialContactForm);
            setAttachmentFile(null);
            event.currentTarget.reset();
        } catch {
            setNotice({ text: 'تعذر إرسال الرسالة الآن. حاول مرة أخرى لاحقًا.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="contact-page-form">
            <Toast visible={Boolean(notice.text)} message={notice.text} type={notice.type} onClose={() => setNotice({ text: '', type: 'info' })} />

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={form.website}
                    onChange={(event) => updateField('website', event.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                    className="contact-hidden-field"
                />

                <div className="contact-form-grid">
                    <label>
                        <span>الاسم</span>
                        <input required value={form.senderName} onChange={(event) => updateField('senderName', event.target.value)} />
                    </label>
                    <label>
                        <span>البريد الإلكتروني</span>
                        <input required type="email" dir="ltr" value={form.senderEmail} onChange={(event) => updateField('senderEmail', event.target.value)} />
                    </label>
                </div>

                <label>
                    <span>عنوان الرسالة</span>
                    <input required value={form.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="مثال: اقتراح لتحسين أداة التاريخ" />
                </label>

                <label>
                    <span>نص الرسالة</span>
                    <textarea required value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder="اكتب التفاصيل التي تساعدنا على فهم طلبك..." />
                </label>

                <label>
                    <span>صورة أو لقطة شاشة اختيارية</span>
                    <div className="contact-upload-field">
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={updateAttachment} />
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <strong>{attachmentFile ? attachmentFile.name : 'اختر صورة من جهازك'}</strong>
                    </div>
                </label>

                <button type="submit" disabled={isLoading}>
                    <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                    {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
            </form>
        </section>
    );
}
export default function PageClient({ slug }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lang, setLang] = useState('ar');

    useEffect(() => {
        const savedLang = localStorage.getItem('site_lang') || 'ar';
        setLang(savedLang);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

        const savedTheme = localStorage.getItem('site_theme');
        const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadPage() {
            try {
                setLoading(true);
                setError('');

                const { getSiteConfig } = await import('../firebase');
                const siteConfig = await getSiteConfig();

                if (isMounted) {
                    setConfig(siteConfig || {});
                }
            } catch (err) {
                console.error('خطأ في قراءة صفحة slug من Firestore:', err);

                if (isMounted) {
                    setError('تعذر تحميل الصفحة. يرجى المحاولة لاحقًا.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const page = useMemo(() => {
        return findPageBySlug(config, slug);
    }, [config, slug]);

    if (loading) {
        return (
            <div className="container">
                <div className="card" style={{ lineHeight: '1.8', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-sub)', margin: 0 }}>جاري تحميل الصفحة...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'حدث خطأ' : 'Error'} align="center">
                <p style={{ color: 'var(--text-sub)' }}>{error}</p>
            </PageFrame>
        );
    }

    if (!page || page?.isActive === false || page?.enabled === false) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'} align="center">
                <p style={{ color: 'var(--text-sub)' }}>
                    {lang === 'ar'
                        ? 'لم يتم العثور على الصفحة المطلوبة أو أنها غير مفعلة.'
                        : 'The requested page was not found or is not enabled.'}
                </p>
            </PageFrame>
        );
    }

    const title = getPageTitle(page);
    const description = getPageDescription(page);
    const normalizedSlug = normalizeSlug(slug);
    const isContactPage = normalizedSlug === 'contact';
    const rawContent = isContactPage ? '' : getEnhancedContent(slug, getPageContent(page));
    const content = sanitizeHtml(applyConfigVariables(rawContent, config));
    const align = lang === 'ar' ? 'right' : 'left';

    return (
        <PageFrame lang={lang} title={title} align={align}>
            {description ? (
                <p style={{ color: 'var(--text-sub)', marginBottom: '25px' }}>{description}</p>
            ) : null}

            {!isContactPage && content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : !isContactPage ? (
                <p style={{ color: 'var(--text-sub)' }}>
                    {lang === 'ar'
                        ? 'لا يوجد محتوى لهذه الصفحة حاليًا.'
                        : 'This page does not have content yet.'}
                </p>
            ) : null}

            {isContactPage ? <ContactForm /> : null}
        </PageFrame>
    );
}
