'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Toast from '../components/Toast';
import TurnstileField from '../components/TurnstileField';
import { sanitizeHtml } from '../sanitizeHtml';
import { useSiteContext } from '../SiteContext';

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
    'month-names': `
        <section class="static-rich-page">
            <p>فيما يلي أسماء الأشهر الميلادية والهجرية مرتبة حسب تسلسلها المعتمد.</p>
            <h2>الأشهر الميلادية</h2>
            <p>يناير، فبراير، مارس، أبريل، مايو، يونيو، يوليو، أغسطس، سبتمبر، أكتوبر، نوفمبر، ديسمبر.</p>
            <h2>الأشهر الهجرية</h2>
            <p>محرم، صفر، ربيع الأول، ربيع الآخر، جمادى الأولى، جمادى الآخرة، رجب، شعبان، رمضان، شوال، ذو القعدة، ذو الحجة.</p>
        </section>
    `,
};

const DEFAULT_PAGE_CONTENT_EN = {
    about: `
        <section class="static-rich-page">
            <p>Comprehensive Tools is a practical website designed to make everyday date calculations clear and straightforward. It includes tools for calculating age, converting between Gregorian and Hijri dates, finding the duration between two dates, and checking time and weather information.</p>
            <p>We focus on ease of use, fast loading, and a consistent experience across phones and computers. Results are presented in plain language through a clean interface that continues to improve based on visitor feedback.</p>
            <h2>What do we offer?</h2>
            <ul>
                <li>Accurate date tools for personal, educational, and planning purposes.</li>
                <li>Helpful content that explains calendar differences and how to read results.</li>
                <li>Clear privacy, terms of use, and contact pages.</li>
                <li>A responsive experience with reliable performance across devices.</li>
            </ul>
            <p>The website is not a substitute for official authorities in legal or government matters, but it provides a convenient way to understand and perform everyday calculations.</p>
        </section>
    `,
    privacy: `
        <section class="static-rich-page">
            <p>We respect the privacy of Comprehensive Tools visitors and limit data collection to what is needed to operate the website and improve the experience.</p>
            <h2>Data we may process</h2>
            <ul>
                <li>General usage data, such as visits and tool interactions. We do not sell your personal data.</li>
                <li>Information you voluntarily submit through the contact form, such as your name, email address, and message.</li>
                <li>Location permission is requested only to improve time and weather tools. Your coordinates are not stored in our database.</li>
            </ul>
            <h2>Advertising and cookies</h2>
            <p>The website may use Google AdSense or similar services to display ads. These services may use cookies or comparable identifiers to personalize ads and measure performance under their own policies.</p>
            <p>You can manage cookies and privacy preferences through your browser settings or Google’s advertising controls.</p>
            <h2>Data protection</h2>
            <p>We use established services such as Firebase and Cloudflare to operate the website and protect requests. Although we take reasonable measures to safeguard data, no method of transmission over the internet is completely secure.</p>
            <h2>Contact</h2>
            <p>For privacy questions, contact us through the Contact Us page or by email at <a href="mailto:{{contactEmail}}">{{contactEmail}}</a>.</p>
        </section>
    `,
    terms: `
        <section class="static-rich-page">
            <p>By using Comprehensive Tools, you agree to these terms. If you do not agree, please stop using the website.</p>
            <h2>Nature of the service</h2>
            <p>The tools provide calculations and guidance to help users understand dates and times. Results are based on common formulas and calendars, but they are not official documents or a substitute for the relevant authorities.</p>
            <h2>Acceptable use</h2>
            <ul>
                <li>Do not use the website in a way that disrupts its operation or consumes resources through excessive automation.</li>
                <li>Do not attempt to bypass security controls or misuse contact and advertising features.</li>
                <li>You are responsible for verifying results before using them in official transactions.</li>
            </ul>
            <h2>Advertising and external links</h2>
            <p>The website may contain advertisements or external links. We are not responsible for third-party content, and users should review the policies and terms of those websites.</p>
            <h2>Changes to these terms</h2>
            <p>We may update these terms to improve clarity or reflect changes to the service. Continued use after an update means that you accept the revised terms.</p>
        </section>
    `,
    'month-names': `
        <section class="static-rich-page">
            <p>Gregorian and Hijri month names are listed below in their standard order.</p>
            <h2>Gregorian months</h2>
            <p>January, February, March, April, May, June, July, August, September, October, November, and December.</p>
            <h2>Hijri months</h2>
            <p>Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Shaaban, Ramadan, Shawwal, Dhu al-Qadah, and Dhu al-Hijjah.</p>
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

function getPageTitle(page, lang = 'ar') {
    if (lang === 'en') {
        return (
            page?.titleEn ||
            page?.pageTitleEn ||
            page?.nameEn ||
            page?.labelEn ||
            page?.title ||
            'Page'
        );
    }

    return (
        page?.title ||
        page?.pageTitle ||
        page?.name ||
        page?.label ||
        'صفحة'
    );
}

function getFallbackPageTitle(slug, lang = 'ar') {
    const normalized = normalizeSlug(slug);
    const titles = {
        contact: { ar: 'اتصل بنا', en: 'Contact us' },
        privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
        terms: { ar: 'شروط الاستخدام', en: 'Terms of Use' },
        about: { ar: 'من نحن', en: 'About Us' },
        'about-us': { ar: 'من نحن', en: 'About Us' },
        'month-names': { ar: 'جدول الأشهر', en: 'Month Names' },
    };

    return titles[normalized]?.[lang] || titles[normalized]?.ar || (lang === 'ar' ? 'صفحة' : 'Page');
}

function getPageDescription(page, lang = 'ar') {
    if (lang === 'en') {
        return page?.descriptionEn || page?.seoDescriptionEn || page?.summaryEn || '';
    }

    return (
        page?.description ||
        page?.seoDescription ||
        page?.summary ||
        ''
    );
}

function getPageContent(page, lang = 'ar') {
    if (lang === 'en') {
        return page?.contentEn || page?.htmlEn || page?.bodyEn || page?.textEn || '';
    }

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

function getEnhancedContent(slug, content, lang = 'ar') {
    const normalized = normalizeSlug(slug);
    const fallbackKey = normalized === 'about-us'
        ? 'about'
        : ['months', 'months-table'].includes(normalized) ? 'month-names' : normalized;
    const current = String(content || '').trim();
    const fallback = lang === 'en'
        ? DEFAULT_PAGE_CONTENT_EN[fallbackKey] || ''
        : DEFAULT_PAGE_CONTENT[fallbackKey] || '';

    if (lang === 'en' && current) return current;
    if (!fallback) return current;
    if (current.replace(/<[^>]*>/g, '').trim().length >= 650) return current;

    return fallback;
}

function PageFrame({ lang, title, children, align = 'right', variant = '' }) {
    return (
        <div className={`container static-page-container ${variant}`.trim()}>
            <header className="static-page-header">
                <Link href="/" className="static-page-back">
                    <i className="fa-solid fa-arrow-right"></i> {lang === 'ar' ? 'العودة' : 'Back'}
                </Link>
                <h1>{title}</h1>
                <span className="static-page-header-spacer" aria-hidden="true"></span>
            </header>

            <main className="card static-page-card" style={{ '--static-page-align': align }}>
                {children}
            </main>
        </div>
    );
}

function StaticPageLoading({ isContactPage = false }) {
    if (isContactPage) {
        return (
            <div className="static-page-loading static-contact-loading" aria-busy="true">
                <span className="skeleton-block static-page-skeleton-line"></span>
                <div className="static-contact-loading-grid">
                    <span className="skeleton-block static-contact-skeleton-field"></span>
                    <span className="skeleton-block static-contact-skeleton-field"></span>
                </div>
                <span className="skeleton-block static-contact-skeleton-field"></span>
                <span className="skeleton-block static-contact-skeleton-textarea"></span>
                <span className="skeleton-block static-contact-skeleton-upload"></span>
                <span className="skeleton-block static-contact-skeleton-button"></span>
            </div>
        );
    }

    return (
        <div className="static-page-loading" aria-busy="true">
            <span className="skeleton-block static-page-skeleton-title"></span>
            <span className="skeleton-block static-page-skeleton-line"></span>
            <span className="skeleton-block static-page-skeleton-line short"></span>
        </div>
    );
}

const CONTACT_COPY = {
    ar: {
        invalidAttachmentTitle: 'تعذر اختيار المرفق', invalidAttachment: 'يرجى اختيار صورة فقط بصيغة PNG أو JPG أو WEBP أو GIF.',
        largeAttachmentTitle: 'حجم الصورة غير مناسب', largeAttachment: 'حجم الصورة كبير. الحد الأقصى المسموح هو 3MB.', attachmentSelected: 'تم اختيار الصورة، وسيتم رفعها بأمان مع الرسالة.',
        shortMessageTitle: 'الرسالة قصيرة', shortMessage: 'اكتب رسالة أوضح حتى نتمكن من مساعدتك، بحد أدنى 10 أحرف.',
        successTitle: 'تم إرسال رسالتك بنجاح', successText: 'شكرًا لتواصلك معنا. سيتم الرد على رسالتك خلال 27 ساعة.', ticketNumber: 'رقم التذكرة',
        errorTitle: 'تعذر إرسال الرسالة', errorWithEmail: 'لم نتمكن من إرسال طلبك الآن. يمكنك المحاولة مرة أخرى أو التواصل معنا عبر البريد المباشر:', errorWithoutEmail: 'لم نتمكن من إرسال طلبك الآن. يرجى المحاولة مرة أخرى بعد قليل.', errorNumber: 'رقم الخطأ',
        name: 'الاسم', namePlaceholder: 'اكتب اسمك', email: 'البريد الإلكتروني', subject: 'عنوان الرسالة', subjectPlaceholder: 'مثال: اقتراح لتحسين أداة التاريخ', message: 'نص الرسالة', messagePlaceholder: 'اكتب التفاصيل التي تساعدنا على فهم طلبك...', attachment: 'صورة أو لقطة شاشة اختيارية', chooseImage: 'اختر صورة من جهازك', sending: 'جاري الإرسال...', send: 'إرسال الرسالة',
    },
    en: {
        invalidAttachmentTitle: 'Unable to select attachment', invalidAttachment: 'Choose a PNG, JPG, WEBP, or GIF image only.',
        largeAttachmentTitle: 'Image is too large', largeAttachment: 'The image exceeds the 3 MB limit.', attachmentSelected: 'The image is ready and will be uploaded securely with your message.',
        shortMessageTitle: 'Message is too short', shortMessage: 'Please provide at least 10 characters so we can understand and respond to your request.',
        successTitle: 'Your message was sent', successText: 'Thank you for contacting us. We will respond within 27 hours.', ticketNumber: 'Ticket number',
        errorTitle: 'Unable to send your message', errorWithEmail: 'We could not send your request. Try again or contact us directly by email:', errorWithoutEmail: 'We could not send your request. Please try again shortly.', errorNumber: 'Error number',
        name: 'Name', namePlaceholder: 'Enter your name', email: 'Email address', subject: 'Subject', subjectPlaceholder: 'Example: Suggestion for improving a date tool', message: 'Message', messagePlaceholder: 'Add the details that will help us understand your request...', attachment: 'Optional image or screenshot', chooseImage: 'Choose an image from your device', sending: 'Sending...', send: 'Send message',
    },
};

function ContactForm({ contactEmail = '', lang = 'ar' }) {
    const copy = CONTACT_COPY[lang] || CONTACT_COPY.ar;
    const [form, setForm] = useState(initialContactForm);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [notice, setNotice] = useState({ text: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);

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
            setNotice({
                title: copy.invalidAttachmentTitle,
                text: copy.invalidAttachment,
                type: 'error',
                modal: true,
            });
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            event.target.value = '';
            setAttachmentFile(null);
            setNotice({
                title: copy.largeAttachmentTitle,
                text: copy.largeAttachment,
                type: 'error',
                modal: true,
            });
            return;
        }

        setAttachmentFile(file);
        setNotice({ text: copy.attachmentSelected, type: 'success' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formElement = event.currentTarget;

        if (form.message.trim().length < 10) {
            setNotice({
                title: copy.shortMessageTitle,
                text: copy.shortMessage,
                type: 'error',
                modal: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const payload = new FormData();
            Object.entries(form).forEach(([key, value]) => payload.append(key, value));
            if (attachmentFile) payload.append('attachment', attachmentFile);
            if (turnstileToken) payload.append('turnstileToken', turnstileToken);

            const response = await fetch('/api/support', {
                method: 'POST',
                body: payload,
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) throw new Error(result.errorNumber || 'SUP-5000');

            setNotice({
                title: copy.successTitle,
                text: copy.successText,
                type: 'success',
                modal: true,
                referenceLabel: copy.ticketNumber,
                referenceValue: result.ticketNumber,
            });
            setForm(initialContactForm);
            setAttachmentFile(null);
            setTurnstileToken('');
            setTurnstileResetKey((current) => current + 1);
            formElement.reset();
        } catch (error) {
            const errorNumber = String(error?.message || 'SUP-5000').startsWith('SUP-')
                ? String(error.message)
                : 'SUP-5000';
            const directEmail = String(contactEmail || '').trim();
            setNotice({
                title: copy.errorTitle,
                text: directEmail
                    ? copy.errorWithEmail
                    : copy.errorWithoutEmail,
                type: 'error',
                modal: true,
                referenceLabel: copy.errorNumber,
                referenceValue: errorNumber,
                linkHref: directEmail ? `mailto:${directEmail}` : '',
                linkLabel: directEmail || '',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="contact-page-form">
            <Toast
                visible={Boolean(notice.text)}
                message={notice.text}
                type={notice.type}
                modal={Boolean(notice.modal)}
                title={notice.title || ''}
                referenceLabel={notice.referenceLabel || ''}
                referenceValue={notice.referenceValue || ''}
                linkHref={notice.linkHref || ''}
                linkLabel={notice.linkLabel || ''}
                onClose={() => setNotice({ text: '', type: 'info' })}
            />

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
                        <span>{copy.name}</span>
                        <input required value={form.senderName} onChange={(event) => updateField('senderName', event.target.value)} placeholder={copy.namePlaceholder} />
                    </label>
                    <label>
                        <span>{copy.email}</span>
                        <input required type="email" dir="ltr" value={form.senderEmail} onChange={(event) => updateField('senderEmail', event.target.value)} placeholder="name@example.com" />
                    </label>
                </div>

                <label>
                    <span>{copy.subject}</span>
                    <input required value={form.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder={copy.subjectPlaceholder} />
                </label>

                <label>
                    <span>{copy.message}</span>
                    <textarea required value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder={copy.messagePlaceholder} />
                </label>

                <label>
                    <span>{copy.attachment}</span>
                    <div className="contact-upload-field">
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={updateAttachment} />
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <strong>{attachmentFile ? attachmentFile.name : copy.chooseImage}</strong>
                    </div>
                </label>

                <TurnstileField
                    action="support-form"
                    onTokenChange={setTurnstileToken}
                    resetKey={turnstileResetKey}
                />

                <button type="submit" disabled={isLoading}>
                    <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                    {isLoading ? copy.sending : copy.send}
                </button>
            </form>
        </section>
    );
}
export default function PageClient({ slug, initialPage = null, initialConfig = null }) {
    const { lang } = useSiteContext();
    const hasInitialPage = Boolean(initialPage);
    const [config, setConfig] = useState(initialConfig);
    const [loading, setLoading] = useState(!hasInitialPage);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadPage() {
            try {
                if (!hasInitialPage) setLoading(true);
                setError('');

                const response = await fetch('/api/site-config?include=pages');
                const result = await response.json().catch(() => ({}));
                const siteConfig = response.ok && result.ok ? result.config : {};

                if (isMounted) {
                    setConfig(siteConfig || {});
                }
            } catch (err) {
                console.error('خطأ في قراءة صفحة slug من Firestore:', err);

                if (isMounted && !hasInitialPage) {
                    setError('load_failed');
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
    }, [hasInitialPage]);

    const page = useMemo(() => {
        return findPageBySlug(config, slug) || initialPage;
    }, [config, initialPage, slug]);

    if (loading) {
        const normalizedSlug = normalizeSlug(slug);
        const isContactPage = normalizedSlug === 'contact';

        return (
            <PageFrame
                lang={lang}
                title={getFallbackPageTitle(slug, lang)}
                align={lang === 'ar' ? 'right' : 'left'}
                variant={isContactPage ? 'static-contact-page' : ''}
            >
                <StaticPageLoading isContactPage={isContactPage} />
            </PageFrame>
        );
    }

    if (error) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'حدث خطأ' : 'Error'} align="center">
                <p className="static-page-description">
                    {lang === 'en'
                        ? 'Unable to load this page. Please try again later.'
                        : 'تعذر تحميل الصفحة. يرجى المحاولة لاحقًا.'}
                </p>
            </PageFrame>
        );
    }

    if (!page || page?.isActive === false || page?.enabled === false) {
        return (
            <PageFrame lang={lang} title={lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'} align="center">
                <p className="static-page-description">
                    {lang === 'ar'
                        ? 'لم يتم العثور على الصفحة المطلوبة أو أنها غير مفعلة.'
                        : 'The requested page was not found or is not enabled.'}
                </p>
            </PageFrame>
        );
    }

    const title = getPageTitle(page, lang);
    const description = getPageDescription(page, lang);
    const normalizedSlug = normalizeSlug(slug);
    const isContactPage = normalizedSlug === 'contact';
    const rawContent = isContactPage ? '' : getEnhancedContent(slug, getPageContent(page, lang), lang);
    const content = sanitizeHtml(applyConfigVariables(rawContent, config));
    const align = lang === 'ar' ? 'right' : 'left';

    return (
        <PageFrame lang={lang} title={title} align={align} variant={isContactPage ? 'static-contact-page' : ''}>
            {description ? (
                <p className="static-page-description">{description}</p>
            ) : null}

            {!isContactPage && content ? (
                <div className="static-page-content" dangerouslySetInnerHTML={{ __html: content }} />
            ) : !isContactPage ? (
                <p className="static-page-description">
                    {lang === 'ar'
                        ? 'لا يوجد محتوى لهذه الصفحة حاليًا.'
                        : 'This page does not have content yet.'}
                </p>
            ) : null}

            {isContactPage ? <ContactForm contactEmail={config?.contactEmail || ''} lang={lang} /> : null}
        </PageFrame>
    );
}
