# مذكرة مشروع: date_tools

## 1. معلومات عامة

* اسم المشروع: `date_tools`
* نوع المشروع: موقع أدوات التاريخ الشاملة
* التقنية الأساسية: `Next.js 15` + `React 19`
* إدارة البيانات: `Firebase Auth` + `Firestore`
* النشر: `Cloudflare Workers`
* أداة تشغيل Next.js على Cloudflare: `OpenNext for Cloudflare`
* المستودع: GitHub
* الفرع المستخدم: `master`
* المسار المحلي على جهاز المطور:

```powershell
C:\Users\d7mi6\OneDrive\Desktop\date_tools
```

* اسم Worker في Cloudflare:

```txt
datetools
```

* رابط Worker:

```txt
https://datetools.date-tool-official.workers.dev
```

* الدومين الأساسي:

```txt
https://date-tool.com
```

* دومين www:

```txt
https://www.date-tool.com
```

* حالة المشروع الحالية:

```txt
الموقع يعمل على Cloudflare Workers.
الدومين الأساسي يعمل.
دومين www يعمل.
الصفحة الرئيسية تعمل.
الصفحات التعريفية الثابتة `contact` و `privacy` و `terms` أزيلت من الكود وتدار الآن عبر صفحات slug من قاعدة البيانات.
صفحات slug تعمل.
النشر من GitHub إلى Cloudflare يعمل.
الإصدار الحالي للتطبيق هو 0.2.26.
يوجد سجل إصدارات رسمي في VERSION_LOG.md.
```

---

## 2. الهدف من العمل

كان الهدف من هذه المرحلة هو نقل مشروع `date_tools` من وضع البناء المحلي/النشر غير المكتمل إلى نشر فعلي على Cloudflare Workers عبر GitHub، وربط الدومين، وحل أخطاء التشغيل التي ظهرت في بيئة Cloudflare.

الأهداف التي تم العمل عليها:

1. تجهيز المشروع للنشر على Cloudflare Workers.
2. استخدام OpenNext بدل الاكتفاء بـ `next build`.
3. إصلاح مشكلة ظهور `Hello World` بدل المشروع.
4. إصلاح مشكلة `npm ci` وملف `package-lock.json`.
5. إصلاح خطأ `500 Internal Server Error`.
6. إصلاح خطأ `EvalError` داخل Cloudflare Worker.
7. تعديل الصفحة الرئيسية حتى لا تحمّل Firebase أثناء Server Render.
8. تعديل صفحات slug حتى تعمل بشكل صحيح.
9. ربط `date-tool.com`.
10. ربط `www.date-tool.com`.
11. الوصول إلى حالة مستقرة يمكن لـ Codex إكمال التطوير منها.
12. إضافة قواعد Firestore صارمة ومنع الكتابة العامة المباشرة على الإحصائيات.
13. مراجعة ورفع تعديلات `layout.jsx` وصفحات slug بعد التأكد من سببها وسلامتها.
14. بناء endpoint آمن للإحصائيات بدل الكتابة المباشرة من المتصفح إلى Firestore.
15. إضافة SEO الأساسي وCanonical Redirect للدومين.
16. تفعيل أسرار Firebase على Cloudflare وتشغيل endpoint الإحصائيات على الإنتاج.
17. تنظيف Firebase Imports في الصفحات المحددة بدون تقسيم لوحة الإدارة.
18. تأسيس تخزين صور Cloudflare R2 للّوقو وfavicon والإعلانات مع headers أمنية وتنظيف HTML.
19. تفعيل Cloudflare R2 فعليًا وربط bucket الصور بالـ Worker.
20. إصلاح إعداد ESLint وتحذيراته ومنع تكرار slug في لوحة الإدارة.
21. تحسين رفع صور اللوقو وfavicon وتوحيد رسائل الخطأ والنجاح في واجهة الموقع.
22. تنظيم صفحة الإدارة بدون تقسيمها إلى ملفات، وفصل حفظ الأقسام، وإضافة جدول/نافذة إدارة الإعلانات.
23. تأسيس بوابة المعلنين والدعم داخل `app` بتصميم مستوحى من المشروع القديم وباستخدام إعدادات المشروع الحالية.
24. بدء تقسيم الصفحة الرئيسية إلى مكونات أصغر وملف أدوات للتواريخ، مع إبقاء أنماط الصفحة الرئيسية المشتركة في ملف CSS العام.
25. تحديث فوتر الموقع ليتبع ستايل الفوتر القديم مع روابط المشروع الحالية وإضافة رقم الإصدار وسجل النسخ.
26. تحويل صفحات `privacy` و `terms` و `contact` من ملفات ثابتة إلى صفحات ديناميكية من قاعدة البيانات مع دعم متغير إيميل التواصل.
27. إعادة قالب عرض صفحات slug الديناميكية إلى نفس هيكل الصفحات القديمة وحذف ملف قوالب HTML من المشروع.
28. إضافة قسم التكاملات الخارجية الآمنة في لوحة الإدارة لتفعيل Google tag وGTM وAdSense وGoogle site verification من معرفات منظمة بدل كود خام.
29. إضافة إعداد منظم لإعلان Google AdSense العلوي داخل قسم الإعلانات، بحيث يحفظ `Publisher / Client ID` و `Ad Slot` ويعرض الإعلان تحت خانة اليوم بدون لصق JavaScript خام.
30. حصر تحميل سكربت Google AdSense ووحدة الإعلان داخل موضع إعلان أعلى الصفحة `adBanner1` فقط، وعدم تحميل AdSense من مكون التكاملات الخارجية العام.
31. تحويل أدوات الصفحة الرئيسية من عرض هجري/ميلادي مكرر في عمودين إلى نموذج واحد مع زر اختيار `ميلادي / هجري` داخل نفس مكان الأداة.
32. إصلاح تداخل أزرار اللغة والوضع مع اسم الأداة في الهيدر على الشاشات الصغيرة مع الحفاظ على الهوية البصرية.
33. إزالة خانات روابط ورفع صور الإعلانات من قسم إدارة الإعلانات في لوحة الإدارة والاكتفاء بزر إضافة إعلان فوق الجدول.
34. فصل إحصائيات الإعلانات عن إحصائيات الأدوات، وإضافة تتبع ظهور الإعلانات وحساب CTR ونسبة الظهور لكل بانر.
35. إضافة صفحة إدارة إعلانات مستقلة داخل لوحة الإدارة الجديدة وربطها من السايد بار مع الإبقاء على صفحة إعدادات الأداة القديمة كمرجع.
36. تحويل صفحة إدارة الإعلانات إلى جدول حملات متقدم قريب من الصفحة القديمة وربطه بـ Firestore campaigns مع رفع صور الإعلانات إلى R2.
37. إضافة فلاتر أعلى إحصائيات الإعلانات في صفحة `/admin/ads` حسب الأداة والتاريخ ومكان العرض/المصدر.
38. إضافة صفحة مستقلة لإدارة الهوية البصرية `/admin/identity` بنفس هيكل لوحة الإدارة الجديدة وروح الإدارة القديمة.
39. تحسين حقول رفع اللوقو وfavicon في `/admin/identity` لتكون بطاقة اختيار ومعاينة مصغرة بدل زر رفع منفصل.
40. تحويل رسائل صفحة `/admin/identity` إلى Toast عائم أعلى يسار الشاشة مثل النظام الحديث.
41. إضافة صفحة مستقلة لإعدادات مواضع الإعلانات `/admin/ad-settings` مع دعم مقتطف AdSense وAds.txt.
42. تبسيط جدول إعدادات مواضع الإعلانات في `/admin/ad-settings` ونقل تفاصيل الأكواد إلى نوافذ إجراءات.
43. نقل التكاملات الخارجية إلى صفحة مستقلة `/admin/integrations` باسم الربط الخارجي مع استثناء AdSense.
44. إعادة بناء صفحة `/admin/tools` بنمط الإدارة الحالية وإبقاؤها للصفحات والروابط والسوشيال والأحداث فقط.
45. توحيد شكل أيقونات لوحة الإدارة وأزرار الإجراءات وحقول رفع الصور، وتحويل أرقام الإحصائيات إلى أرقام إنجليزية.
46. إعادة بناء بوابة المعلنين بنمط الإدارة الحالي مع رقم نسخة مستقل وربط الحملات ورفع صور الإعلانات إلى R2.
47. تحسين كروت إحصائيات صفحة `/admin` بأربعة أعمدة، أيقونات خلفية شفافة، وأرقام أساسية واضحة لمواضع الإعلانات.

---

## 3. الوضع قبل التعديل

قبل الإصلاحات، كانت الحالة كالتالي:

* Cloudflare كان يبني المشروع من GitHub، لكن لا ينشره فعليًا.
* الدومين كان يعرض صفحة `Hello World`.
* إعداد Deploy command في Cloudflare كان غير صحيح.
* بعد تثبيت OpenNext ظهرت مشكلة في `package-lock.json`.
* بعد نجاح النشر ظهر خطأ:

```txt
500 Internal Server Error
```

* `wrangler tail` كشف الخطأ الحقيقي:

```txt
EvalError: Code generation from strings disallowed for this context
```

* `app/layout.jsx` كان يحاول قراءة `config.json` باستخدام `fs` و `path`.
* الصفحة الرئيسية `app/page.jsx` كانت تستورد Firebase مباشرة من أعلى الملف.
* بعض صفحات slug كانت تستورد Firebase بطريقة قد تجعل Cloudflare Worker يحمّل Firebase أثناء Server Render.
* `date-tool.com` عمل لاحقًا.
* `www.date-tool.com` لم يكن يعمل في البداية، ثم تم إصلاحه عبر DNS + Route.

---

## 4. الأخطاء المكتشفة

### الخطأ 1: الموقع يعرض Hello World بدل مشروع Next.js

**الأعراض:**

```txt
الدومين يفتح صفحة Hello World بدل الموقع.
```

**السبب:**

Cloudflare كان يعمل Build فقط، لكن لم يكن ينفذ نشر فعلي للمشروع. كان Deploy command مضبوطًا على:

```txt
echo "No deploy command"
```

**الحل:**

تم تجهيز OpenNext وإضافة سكربت Deploy حقيقي:

```json
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
```

ثم تم تعديل Cloudflare:

```txt
Build command:
npm run build

Deploy command:
npm run deploy

Root directory:
/
```

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 2: فشل Cloudflare أثناء npm ci

**الأعراض:**

ظهر في سجل Cloudflare:

```txt
npm ci can only install packages when your package.json and package-lock.json are in sync
Missing: @emnapi/runtime@1.11.1 from lock file
Missing: @emnapi/core@1.11.1 from lock file
```

**السبب:**

`package.json` تغيّر بعد تثبيت OpenNext/Wrangler، لكن `package-lock.json` لم يكن متزامنًا أو لم يكن مرفوعًا إلى GitHub بنسخته الصحيحة.

**الحل:**

تم تشغيل:

```powershell
npm install
npm ci
```

وعند الحاجة تم إعادة توليد `package-lock.json` بالكامل:

```powershell
Remove-Item package-lock.json
Remove-Item node_modules -Recurse -Force
npm install
npm ci
```

ثم تم رفع الملف إلى GitHub:

```powershell
git add package-lock.json package.json
git commit -m "refresh package lock for cloudflare ci"
git push origin master
```

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 3: نقص حزم @emnapi داخل package-lock

**الأعراض:**

Cloudflare كان يطلب:

```txt
@emnapi/runtime@1.11.1
@emnapi/core@1.11.1
```

بينما الملف المحلي كان يحتوي على نسخ قديمة مثل:

```txt
@emnapi/runtime 1.10.0
@emnapi/core 1.10.0
```

**السبب:**

ملف القفل قديم أو محدث جزئيًا.

**الحل:**

تم حذف `package-lock.json` و `node_modules` ثم إعادة تثبيت الحزم:

```powershell
Remove-Item package-lock.json
Remove-Item node_modules -Recurse -Force
npm install
npm ci
```

بعد نجاح `npm ci` محليًا تم رفع الملف.

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 4: 500 Internal Server Error بعد نجاح النشر

**الأعراض:**

بعد نجاح Build و Deploy، ظهرت الصفحة:

```txt
500 Internal Server Error
```

على:

```txt
https://datetools.date-tool-official.workers.dev
https://date-tool.com
```

**التشخيص:**

تم تشغيل:

```powershell
npx wrangler tail datetools --format pretty
```

وظهر الخطأ:

```txt
EvalError: Code generation from strings disallowed for this context
```

**السبب:**

أحد أجزاء التطبيق كان يحمّل مكتبة أو كود يستخدم `eval` أو `new Function` داخل بيئة Cloudflare Worker. السبب العملي كان غالبًا مرتبطًا بتحميل Firebase Client SDK أثناء SSR أو Worker runtime.

**الحل:**

تم تعديل طريقة تحميل Firebase بحيث لا يتم استيراده مباشرة في الصفحة الرئيسية، بل يتم تحميله داخل المتصفح باستخدام:

```js
await import('./firebase')
```

داخل `useEffect`.

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 5: layout.jsx يحاول قراءة config.json

**الأعراض:**

ظهر في `wrangler tail`:

```txt
⚠️ لم يتم العثور على config.json أو فشلت قراءته للـ SEO.
```

**السبب:**

ملف:

```txt
app/layout.jsx
```

كان يستخدم:

```js
import { promises as fs } from 'fs';
import path from 'path';
```

ثم يحاول قراءة:

```txt
config.json
```

داخل `generateMetadata()`.

هذا غير مناسب لحالة المشروع الحالية على Cloudflare Worker.

**الحل:**

تم حذف قراءة `config.json` من `layout.jsx`، واستبدال `generateMetadata()` ببيانات ثابتة:

```jsx
import './globals.css';

export const metadata = {
    title: 'أدوات التاريخ الشاملة',
    description: 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
```

**الحالة:**

```txt
تم الحل مؤقتًا
```

**ملاحظة لـ Codex:**

لاحقًا يجب تحسين SEO بدون الرجوع إلى `fs/path/config.json`. الأفضل إنشاء إعداد SEO آمن أو ثابت، ثم إضافة `sitemap.js` و `robots.js`.

---

### الخطأ 6: allow_eval_during_startup تسبب في فشل preview

**الأعراض:**

بعد تجربة إضافة:

```jsonc
"allow_eval_during_startup"
```

ظهر عند تشغيل:

```powershell
npm run preview
```

الخطأ:

```txt
The compatibility flag allow_eval_during_startup became the default as of 2025-06-01 so does not need to be specified anymore.
```

**السبب:**

هذا الـ compatibility flag أصبح default في Cloudflare بعد تاريخ 2025-06-01 ولا يجب إضافته يدويًا.

**الحل:**

تم حذف:

```jsonc
"allow_eval_during_startup"
```

من `wrangler.jsonc`.

الإعداد المقبول:

```jsonc
"compatibility_flags": [
  "nodejs_compat",
  "global_fetch_strictly_public"
]
```

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 7: صفحة privacy تعمل لكن الصفحة الرئيسية لا تعمل

**الأعراض:**

عند تشغيل:

```powershell
npm run preview
```

ظهر:

```txt
GET / 500 Internal Server Error
GET /privacy 200 OK
```

**السبب:**

المشكلة لم تكن عامة في كل المشروع، بل كانت محصورة في الصفحة الرئيسية `app/page.jsx`.

الصفحة الرئيسية كانت تستورد Firebase من أعلى الملف:

```jsx
import { initAndTrackVisit, trackToolUsage, trackAdClick, getSiteConfig } from './firebase';
```

**الحل:**

تم تعديل الصفحة الرئيسية بحيث يتم تحميل Firebase فقط داخل المتصفح باستخدام dynamic import:

```js
const firebaseApi = await import('./firebase');
```

وتم جعل دوال التتبع تعتمد على مرجع يتم تعبئته بعد تحميل Firebase.

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 8: صفحات slug قد تشغل Firebase داخل Server Component

**الأعراض:**

صفحات slug كانت من الملفات المحتمل تسببها في Runtime Error بسبب استيراد Firebase داخل صفحة ديناميكية.

**السبب:**

ملف:

```txt
app/[slug]/page.jsx
```

كان يستورد `getSiteConfig` من Firebase مباشرة.

**الحل:**

تم فصل الصفحة إلى ملف Server بسيط وملف Client:

```txt
app/[slug]/page.jsx
app/[slug]/PageClient.jsx
```

`app/[slug]/page.jsx`:

```jsx
import PageClient from './PageClient';

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';

    return <PageClient slug={slug} />;
}
```

`app/[slug]/PageClient.jsx` يبدأ بـ:

```jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSiteConfig } from '../firebase';
```

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 9: [www.date-tool.com](http://www.date-tool.com) لا يعمل

**الأعراض:**

الدومين الأساسي يعمل:

```txt
https://date-tool.com
```

لكن:

```txt
https://www.date-tool.com
```

لم يكن يعمل.

**ما تمت تجربته:**

محاولة إضافة `www.date-tool.com` كـ Custom Domain أظهرت رسالة:

```txt
No zones match www.date-tool.com
```

**الحل النهائي المعتمد:**

تم استخدام DNS + Worker Route بدل Custom Domain.

DNS record:

```txt
Type: CNAME
Name: www
Target: date-tool.com
Proxy status: Proxied
TTL: Auto
```

Worker Route:

```txt
Route:
www.date-tool.com/*

Worker:
datetools
```

**الحالة:**

```txt
تم الحل
```

---

### الخطأ 10: الزائر يستطيع امتلاك مسار كتابة مباشر محتمل على statistics/main

**الأعراض:**

```txt
app/firebase.js كان يحتوي على دوال من المتصفح لتحديث statistics/main مباشرة:
initAndTrackVisit
trackToolUsage
trackAdClick
```

**السبب:**

تحديث الإحصائيات من المتصفح يتطلب فتح صلاحيات كتابة عامة أو شبه عامة في Firestore، وهذا غير آمن. عدم وجود ملف `firestore.rules` داخل المستودع كان يجعل مراجعة الصلاحيات ونشرها عرضة للخطأ اليدوي.

**الحل:**

تمت إضافة قواعد Firestore محلية صارمة:

```txt
firestore.rules
firebase.json
.firebaserc
```

وتم تعديل `app/firebase.js` بحيث تصبح دوال تتبع الزائر no-op مؤقتًا ولا تكتب مباشرة إلى `statistics/main`. تبقى قراءة الإحصائيات متاحة للمدير فقط حسب القواعد، ويجب نقل التتبع لاحقًا إلى API آمن أو Worker endpoint قبل إعادة تفعيله.

**الحالة:**

```txt
تم الحل
تم نشر قواعد Firestore على مشروع date-tool-official عبر Firebase CLI
```

---

## 5. التعديلات المنفذة

### التعديل 1: تثبيت OpenNext و Wrangler

**الأوامر:**

```powershell
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
```

**الهدف:**

تمكين Next.js من العمل على Cloudflare Workers بدل الاكتفاء بـ Static Export أو Build فقط.

---

### التعديل 2: تعديل package.json

**المطلوب وجوده في scripts:**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "lint": "eslint"
}
```

**إصدارات مهمة ظهرت أثناء العمل:**

```txt
Next.js: 15.5.19
React: 19.2.7
Firebase: 12.14.0
Wrangler: 4.101.0
@opennextjs/cloudflare: 1.19.11
```

---

### التعديل 3: ضبط wrangler.jsonc

**يجب أن يكون اسم Worker:**

```jsonc
"name": "datetools"
```

**ويجب أن يكون service binding:**

```jsonc
"services": [
  {
    "binding": "WORKER_SELF_REFERENCE",
    "service": "datetools"
  }
]
```

**compatibility_flags بدون allow_eval_during_startup:**

```jsonc
"compatibility_flags": [
  "nodejs_compat",
  "global_fetch_strictly_public"
]
```

**مهم:**

لا تستخدم:

```jsonc
"allow_eval_during_startup"
```

لأنه سبب فشل preview.

---

### التعديل 4: تعديل app/layout.jsx

**تم حذف:**

```js
import { promises as fs } from 'fs';
import path from 'path';
```

**وتم حذف قراءة:**

```txt
config.json
```

**واستبدال metadata ببيانات ثابتة.**

---

### التعديل 5: تعديل app/page.jsx

**المشكلة:**

استيراد Firebase مباشرة من أعلى الملف كان يسبب مشاكل على Cloudflare Worker.

**الحل:**

تحميل Firebase داخل المتصفح فقط:

```js
const firebaseApi = await import('./firebase');
```

**ملاحظة لـ Codex:**

يجب المحافظة على هذه القاعدة:

```txt
لا تستورد Firebase Client SDK مباشرة في ملف يمكن أن يدخل في SSR/Worker.
استخدم Client Component أو dynamic import داخل useEffect.
```

---

### التعديل 6: تعديل صفحات slug

**المسارات:**

```txt
app/[slug]/page.jsx
app/[slug]/PageClient.jsx
```

**الهدف:**

جعل `page.jsx` مجرد wrapper، وجعل تحميل Firestore يتم داخل `PageClient.jsx`.

---

### التعديل 7: ضبط DNS للدومين الأساسي

تم ربط:

```txt
date-tool.com
```

بـ Worker:

```txt
datetools
```

كـ Custom Domain.

---

### التعديل 8: ضبط DNS و Route للـ www

تم ضبط:

```txt
www CNAME date-tool.com Proxied
```

ثم Route:

```txt
www.date-tool.com/*
```

إلى Worker:

```txt
datetools
```

---

### التعديل 9: إضافة Firestore Rules

تمت إضافة:

```txt
firestore.rules
firebase.json
.firebaserc
```

القواعد الحالية:

```txt
settings/main:
- قراءة عامة للزوار
- كتابة للمدير النشط فقط

statistics/main:
- قراءة وكتابة للمدير النشط فقط
- لا توجد كتابة مباشرة للزائر

admins/{uid}:
- قراءة المستند الخاص بالمستخدم المسجل فقط للتحقق من صلاحية الدخول
- لا توجد list عامة
- لا توجد كتابة من التطبيق
```

---

### التعديل 10: تعطيل الكتابة العامة المباشرة على الإحصائيات

تم تعديل:

```txt
app/firebase.js
```

وأصبحت الدوال التالية لا تكتب إلى Firestore من المتصفح:

```txt
initAndTrackVisit
trackToolUsage
trackAdClick
```

الهدف هو حماية `statistics/main` وعدم فتح صلاحيات كتابة عامة لمجرد استمرار العدادات. المهمة التالية المناسبة هي بناء endpoint موثوق لتحديث الإحصائيات.

---

### التعديل 11: تنظيف ESLint من فحص مخرجات OpenNext

تم تعديل:

```txt
eslint.config.mjs
```

وتمت إضافة:

```txt
.open-next/**
.wrangler/**
```

إلى قائمة التجاهل، لأن هذه ملفات توليد وليست مصدر التطبيق، وكانت تسبب فشل `npm run lint`.

---

### التعديل 12: مراجعة ورفع تعديلات layout وصفحات slug

تمت مراجعة الملفات:

```txt
app/layout.jsx
app/[slug]/page.jsx
app/[slug]/PageClient.jsx
```

سبب تعديل `app/layout.jsx`:

```txt
إزالة fs/path وقراءة config.json من Root Layout حتى لا يفشل Cloudflare Worker.
استبدال generateMetadata ببيانات metadata ثابتة وآمنة لبيئة Cloudflare.
```

سبب تعديل صفحات slug:

```txt
فصل صفحة slug إلى Server wrapper خفيف وClient Component.
منع استيراد Firebase Client SDK داخل Server Component أو Worker runtime.
```

تم تصحيح `PageClient.jsx` قبل الرفع حتى يدعم شكل البيانات الذي تحفظه لوحة الإدارة:

```txt
customPages ككائن keyed by slug
pages ككائن keyed by slug
internalPages كقائمة
customPages/pages كقوائم عند الحاجة
```

---

### التعديل 13: بناء Endpoint آمن للإحصائيات

تمت إضافة:

```txt
app/api/statistics/route.js
.dev.vars.example
```

وتم تعديل:

```txt
app/firebase.js
```

الآلية الجديدة:

```txt
المتصفح يرسل حدثًا محدودًا إلى /api/statistics.
الـ endpoint يتحقق من نوع الحدث والحقول المسموحة.
الـ endpoint يستخدم Firestore REST commit من جهة الخادم لزيادة العدادات.
لا توجد كتابة مباشرة من المتصفح إلى statistics/main.
```

الأحداث المسموحة:

```txt
visit
tool: ageCalc / dateConverter / durationCalc
adClick مع adId آمن ومحدود
```

متطلبات التشغيل على Cloudflare:

```txt
FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_EMAIL
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
STATISTICS_ALLOWED_ORIGINS
```

أو يمكن استخدام:

```txt
FIREBASE_SERVICE_ACCOUNT_JSON
```

مهم:

```txt
لا يتم commit لأي private key أو service account JSON.
يجب إضافة الأسرار عبر Cloudflare/Wrangler secrets قبل اعتبار الإحصائيات مفعلة على الإنتاج.
إذا لم تكن الأسرار موجودة، يرجع endpoint خطأ statistics_not_configured بدل فتح Firestore للزوار.
```

---

### التعديل 14: تجهيز متغيرات Cloudflare غير السرية للـ statistics endpoint

تم تعديل:

```txt
wrangler.jsonc
app/api/statistics/route.js
```

تمت إضافة متغيرات غير سرية إلى `wrangler.jsonc`:

```txt
FIREBASE_PROJECT_ID=date-tool-official
STATISTICS_ALLOWED_ORIGINS=https://date-tool.com,https://www.date-tool.com,https://datetools.date-tool-official.workers.dev
```

وتم تعديل endpoint ليقرأ المتغيرات من:

```txt
process.env
getCloudflareContext({ async: true }).env
```

الحالة:

```txt
Wrangler مسجل الدخول.
لا توجد أسرار Cloudflare محفوظة بعد.
FIREBASE_SERVICE_ACCOUNT_JSON لم يتم إدخاله بعد.
```

---

### التعديل 15: SEO الأساسي و Canonical Redirect

تمت إضافة:

```txt
app/sitemap.js
app/robots.js
middleware.js
```

وتم تعديل:

```txt
app/layout.jsx
app/[slug]/page.jsx
```

ما تم إنجازه:

```txt
إضافة metadataBase و canonical و OpenGraph و Twitter metadata للصفحة العامة.
إضافة metadata آمنة عامة لصفحات slug بدون تحميل Firebase على الخادم.
إضافة sitemap.xml للصفحة الرئيسية والصفحات الثابتة.
إضافة robots.txt مع منع /admin و /admin_login و /api.
إضافة تحويل 308 من www.date-tool.com إلى date-tool.com.
```

---

### التعديل 16: تفعيل endpoint الإحصائيات على الإنتاج بأسرار Cloudflare

تم تعديل:

```txt
app/api/statistics/route.js
```

وتم ضبط أسرار Cloudflare التالية على Worker بدون حفظها في Git:

```txt
FIREBASE_SERVICE_ACCOUNT_EMAIL
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
```

تم حذف السر غير الصحيح:

```txt
FIREBASE_SERVICE_ACCOUNT_JSON
```

سبب الحذف:

```txt
تم إدخال JSON بطريقة أدت إلى فشل JSON.parse داخل Worker.
تم اعتماد الأسرار المفصولة بدل JSON الكامل لتقليل احتمال تلف التنسيق عند اللصق.
```

تحسينات endpoint:

```txt
قراءة الأسرار من process.env ومن getCloudflareContext({ async: true }).env.
دعم fallback من FIREBASE_SERVICE_ACCOUNT_JSON إلى الأسرار المفصولة.
إرجاع invalid_json عند وصول جسم طلب غير صالح بدل خطأ عام.
إرجاع أخطاء تشغيل مختصرة بدون كشف تفاصيل داخلية أو أسرار.
```

الحالة:

```txt
تم نشر Worker.
/api/statistics يعمل على الإنتاج.
اختبارات visit و tool و adClick رجعت {"ok":true}.
لا توجد أسرار ملتزمة في Git.
```

---

### التعديل 17: تنظيف Firebase Imports بدون تقسيم الصفحات

تم تعديل:

```txt
app/[slug]/PageClient.jsx
app/admin/page.jsx
app/admin_login/page.jsx
```

وتمت مراجعة:

```txt
app/page.jsx
app/firebase.js
app/Header.jsx
app/Footer.jsx
```

ما تم إنجازه:

```txt
إزالة import المباشر لـ ../firebase من app/[slug]/PageClient.jsx.
إزالة import المباشر لـ ../firebase و firebase/auth من app/admin/page.jsx.
إزالة import المباشر لـ ../firebase و firebase/auth و firebase/firestore من app/admin_login/page.jsx.
استخدام dynamic import داخل useEffect أو داخل حدث تسجيل الدخول فقط.
الإبقاء على app/firebase.js كملف مركزي وحيد يتعامل مع Firebase Client SDK.
عدم تقسيم app/admin/page.jsx إلى مكونات في هذه المهمة.
```

الحالة:

```txt
npm run lint نجح.
npm run build نجح بعد السماح لـ Wrangler بكتابة سجلاته في AppData.
لم يتم تعديل إعدادات الأسرار أو قواعد Firestore.
```

---

### التعديل 18: تأسيس تخزين صور Cloudflare R2 والتهيئة الأمنية

تمت إضافة:

```txt
app/api/media/upload/route.js
app/api/media/[...key]/route.js
app/sanitizeHtml.js
```

وتم تعديل:

```txt
app/admin/page.jsx
app/page.jsx
app/firebase.js
app/[slug]/PageClient.jsx
middleware.js
```

ما تم إنجازه:

```txt
إضافة endpoint رفع إداري للصور عبر /api/media/upload.
إضافة endpoint عرض عام للصور من /api/media/{key}.
تجهيز تصنيفات الصور الحالية: logo و favicon و ads.
منع SVG والاقتصار على png / jpg / webp / gif / ico.
تحديد حجم الصورة بحد أقصى 5MB.
التحقق من Firebase Auth ID token ثم admins/{uid}.active قبل السماح بالرفع.
إضافة حقول رفع في لوحة الإدارة للّوقو وfavicon وأربع صور إعلانية.
عرض صور الإعلانات من إعدادات Firestore عند وجودها مع fallback للوضع الحالي.
تحديث favicon من إعدادات الموقع من جهة العميل.
إضافة تنظيف HTML بسيط قبل حفظ محتوى الصفحات وقبل عرضه.
إضافة Security Headers عبر middleware.
```

حالة R2:

```txt
لم يتم تفعيل R2 في حساب Cloudflare بعد.
أمر npx wrangler r2 bucket list رجع code 10042:
Please enable R2 through the Cloudflare Dashboard.
لذلك لم تتم إضافة r2_buckets إلى wrangler.jsonc حتى لا يفشل النشر.
endpoint الصور يرجع media_storage_not_configured إلى أن يتم تفعيل R2 وإضافة binding باسم MEDIA_BUCKET.
```

التصميم المستقبلي:

```txt
المرحلة الحالية مخصصة للصور العامة: logo / favicon / ads.
نظام التذاكر وطلبات الإعلانات لاحقًا يجب أن يستخدم تصنيفات ومسارات خاصة غير عامة، ولا تُعرض عبر /api/media العام إلا للصور المصرح بعرضها.
```

الحالة:

```txt
npm run lint نجح.
npm run build نجح.
npm run deploy نجح.
Security Headers ظهرت على الإنتاج.
/api/media/logo/test.png يرجع media_storage_not_configured بشكل متوقع حتى تفعيل R2.
```

---

### التعديل 19: تفعيل R2 وربط bucket الصور بالـ Worker

تم إنشاء R2 bucket:

```txt
datetools-media
```

وتم تعديل:

```txt
wrangler.jsonc
```

بإضافة binding:

```jsonc
"r2_buckets": [
  {
    "binding": "MEDIA_BUCKET",
    "bucket_name": "datetools-media"
  }
]
```

ما تم إنجازه:

```txt
تم تفعيل R2 في حساب Cloudflare.
تم إنشاء bucket بنجاح عبر Wrangler.
تم نشر Worker بعد إضافة binding.
ظهر binding في النشر: env.MEDIA_BUCKET (datetools-media) R2 Bucket.
تم اختبار القراءة من /api/media بعد رفع صورة مؤقتة إلى R2 الحقيقي باستخدام --remote.
تم حذف صورة الاختبار بعد التحقق.
```

الحالة:

```txt
R2 مفعل ومربوط بالإنتاج.
/api/media يقرأ من R2 بنجاح.
رفع الصور من لوحة الإدارة جاهز للاختبار العملي عند تسجيل الدخول كمدير.
```

---

## 6. الأوامر المستخدمة

### تثبيت OpenNext و Wrangler

```powershell
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
```

### تحديث package-lock

```powershell
npm install
npm ci
```

### إعادة توليد package-lock عند الحاجة

```powershell
Remove-Item package-lock.json
Remove-Item node_modules -Recurse -Force
npm install
npm ci
```

### تشغيل Preview محلي ببيئة Cloudflare

```powershell
npm run preview
```

### مراقبة Worker المنشور

```powershell
npx wrangler tail datetools --format pretty
```

### تسجيل الدخول إلى Wrangler عند الحاجة

```powershell
npx wrangler login
```

### رفع التعديلات إلى GitHub

```powershell
git status
git add .
git commit -m "fix cloudflare runtime and deployment"
git push origin master
```

### اختبار www

```powershell
nslookup www.date-tool.com
curl -I https://www.date-tool.com
```

### إضافة قواعد Firestore وحماية الإحصائيات

```powershell
Get-Content -Raw AGENTS.md
Get-Content -Raw -Encoding UTF8 PROJECT_MEMO.md
rg --files | rg "firestore|firebase|rules|\.rules$|\.firebaserc|firebase\.json"
rg -n "initAndTrackVisit|trackToolUsage|trackAdClick|getAdminStats|updateDoc|increment|setDoc" app\firebase.js app\page.jsx app\admin\page.jsx
npm run lint
npm run build
npx firebase-tools deploy --only firestore:rules --project date-tool-official
npx firebase-tools projects:list --json
```

### مراجعة ورفع ملفات layout و slug

```powershell
git diff -- app\layout.jsx
git diff -- app\[slug]\page.jsx
Get-Content -Raw -Encoding UTF8 -LiteralPath 'app\[slug]\PageClient.jsx'
rg -n "customPages|internalPages|pages\b|slug" app\admin\page.jsx app\firebase.js app\page.jsx app\Header.jsx app\Footer.jsx
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin_login
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/privacy
```

### بناء endpoint آمن للإحصائيات

```powershell
Get-Content -Raw C:\Users\d7mi6\.codex\skills\workers-best-practices\SKILL.md
Get-Content -Raw AGENTS.md
Get-Content -Raw -Encoding UTF8 PROJECT_MEMO.md
Get-Content -Raw -Encoding UTF8 app\page.jsx
Get-Content -Raw -Encoding UTF8 app\firebase.js
npm run lint
npm run build
```

### ضبط Cloudflare و SEO الأساسي

```powershell
npx wrangler whoami
npx wrangler secret list
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/robots.txt
curl.exe -I https://date-tool.com/sitemap.xml
curl.exe -I https://www.date-tool.com/
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" -d "{\"event\":\"visit\"}"
```

### تفعيل أسرار endpoint الإحصائيات واختبار الإنتاج

```powershell
npx wrangler secret put FIREBASE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
npx wrangler secret delete FIREBASE_SERVICE_ACCOUNT_JSON
npx wrangler secret list
npm run lint
npm run deploy
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-visit.json"
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-tool.json"
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-ad.json"
```

ملاحظة:

```txt
ملفات tmp-stat-*.json كانت مؤقتة للاختبار فقط وتم حذفها بعد الاختبار.
لم تتم طباعة أو حفظ قيم الأسرار في Git.
```

### تنظيف Firebase Imports

```powershell
rg -n "firebase/auth|firebase/firestore|firebase/storage|firebase/app|../firebase|./firebase" app\page.jsx app\admin\page.jsx app\admin_login\page.jsx app\firebase.js app\Header.jsx app\Footer.jsx
rg -n "firebase/auth|firebase/firestore|firebase/storage|firebase/app|../firebase|./firebase" -g "PageClient.jsx" app
npm run lint
npm run build
```

### تأسيس تخزين الصور عبر Cloudflare R2

```powershell
npx wrangler r2 bucket list
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -s -i https://date-tool.com/api/media/logo/test.png
```

### تفعيل R2 وربط bucket الصور

```powershell
npx wrangler r2 bucket list
npx wrangler r2 bucket create datetools-media
npm run lint
npm run build
npm run deploy
npx wrangler r2 object put datetools-media/logo/codex-r2-test.png --remote --file tmp-r2-test.png --content-type image/png --cache-control "public, max-age=60"
curl.exe -I https://date-tool.com/api/media/logo/codex-r2-test.png
npx wrangler r2 object delete datetools-media/logo/codex-r2-test.png --remote --force
curl.exe -s https://date-tool.com/api/media/logo/codex-r2-test.png
```

---

## 7. إعدادات Cloudflare / Firebase / GitHub

### Cloudflare

اسم Worker:

```txt
datetools
```

Build settings:

```txt
Build command:
npm run build

Deploy command:
npm run deploy

Root directory:
/
```

رابط Worker:

```txt
https://datetools.date-tool-official.workers.dev
```

Custom Domain:

```txt
date-tool.com
```

Route للـ www:

```txt
www.date-tool.com/*
```

Worker المرتبط بالـ Route:

```txt
datetools
```

---

### DNS

الدومين الأساسي يعمل عبر Cloudflare.

سجل www النهائي:

```txt
Type: CNAME
Name: www
Target: date-tool.com
Proxy status: Proxied
TTL: Auto
```

---

### Firebase

المشروع يستخدم Firebase للآتي:

```txt
Firebase Auth
Firestore
Storage
```

المسارات المهمة في Firestore:

```txt
settings/main
admins/{uid}
statistics/main
```

الوضع الحالي:

```txt
الموقع العام يقرأ settings/main.
لوحة الإدارة تعدل settings/main.
Firebase يجب أن يعمل من Client فقط أو عبر dynamic import.
تمت إضافة firestore.rules محليًا.
الزائر لا يملك مسار كتابة مباشر على statistics/main في الكود الحالي.
تم نشر قواعد Firestore على الإنتاج في مشروع date-tool-official.
تمت إضافة /api/statistics لإعادة تفعيل الإحصائيات من جهة الخادم.
تم تشغيل /api/statistics على الإنتاج بعد ضبط أسرار خدمة Firebase في Cloudflare.
تمت إضافة متغيرات Cloudflare غير السرية في wrangler.jsonc.
تمت إضافة sitemap.xml و robots.txt.
تم ضبط Canonical Redirect من www إلى الدومين الأساسي.
الأسرار المعتمدة حاليًا هي FIREBASE_SERVICE_ACCOUNT_EMAIL و FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.
تم حذف FIREBASE_SERVICE_ACCOUNT_JSON لأنه أُدخل بتنسيق غير صالح.
لا توجد أسرار محفوظة داخل المستودع.
تمت إضافة endpoints لتخزين الصور عبر R2 لكن R2 غير مفعل بعد في حساب Cloudflare.
تم تفعيل R2 لاحقًا وإنشاء bucket datetools-media وربطه بالـ Worker عبر MEDIA_BUCKET.
```

---

### GitHub

الفرع المستخدم:

```txt
master
```

يجب رفع أي تعديل قبل انتظار Cloudflare Build:

```powershell
git add .
git commit -m "message"
git push origin master
```

---

## 8. نتائج الاختبار

### اختبار npm ci

تم تشغيل:

```powershell
npm ci
```

والنتيجة:

```txt
نجح محليًا بعد تحديث package-lock.json.
```

---

### اختبار Cloudflare Build

ظهرت نتائج نجاح مثل:

```txt
Success: Build command completed
```

---

### اختبار OpenNext Deploy

ظهرت نتائج نجاح مثل:

```txt
OpenNext build complete
Uploaded datetools
Deployed datetools triggers
Success: Deploy command completed
Success! Build completed
```

آخر نشر يدوي عبر:

```powershell
npm run deploy
```

النتيجة:

```txt
OpenNext build complete
Uploaded datetools
Deployed datetools triggers
https://datetools.date-tool-official.workers.dev
Current Version ID: 72f032f0-97a9-456b-88d3-11ae3a4765d6
```

Bindings الظاهرة في النشر:

```txt
WORKER_SELF_REFERENCE
IMAGES
ASSETS
FIREBASE_PROJECT_ID
STATISTICS_ALLOWED_ORIGINS
```

ملاحظة:

```txt
FIREBASE_SERVICE_ACCOUNT_JSON غير موجود بعد في أسرار Worker.
```

---

### اختبار Worker URL

الرابط:

```txt
https://datetools.date-tool-official.workers.dev
```

الحالة:

```txt
يعمل بعد إصلاح Runtime Errors
```

---

### اختبار date-tool.com

الرابط:

```txt
https://date-tool.com
```

الحالة:

```txt
يعمل
```

---

### اختبار [www.date-tool.com](http://www.date-tool.com)

الرابط:

```txt
https://www.date-tool.com
```

الحالة:

```txt
يعمل بعد إعداد CNAME + Route
```

---

### اختبار الصفحات

```txt
/ يعمل
/privacy يعمل
/terms يعمل
/contact يعمل
/[slug] يعمل
/admin_login موجود
/admin موجود حسب صلاحيات Firebase/Auth
```

---

### اختبار Firestore Rules وحماية الإحصائيات

تم تشغيل:

```powershell
npm run lint
```

والنتيجة:

```txt
نجح بعد تجاهل مخرجات .open-next و .wrangler.
```

تم تشغيل:

```powershell
npm run build
```

والنتيجة:

```txt
نجح بعد السماح لـ Wrangler بكتابة سجلاته في AppData.
```

ملاحظة:

```txt
تم تسجيل الدخول إلى Firebase بنجاح بعد فتح جلسة تفاعلية.
تم نشر firestore.rules على مشروع date-tool-official.
أكد Firebase CLI أن ملف القواعد compiled successfully ثم released rules إلى cloud.firestore.
```

---

### اختبار نشر Firestore Rules

تم تشغيل:

```powershell
npx firebase-tools projects:list --json
```

والنتيجة:

```txt
ظهر مشروع date-tool-official بحالة ACTIVE.
```

تم تشغيل:

```powershell
npx firebase-tools deploy --only firestore:rules --project date-tool-official
```

والنتيجة:

```txt
cloud.firestore: rules file firestore.rules compiled successfully
firestore: released rules firestore.rules to cloud.firestore
Deploy complete
```

---

### اختبار تعديلات layout و slug

تم تشغيل:

```powershell
npm run lint
```

والنتيجة:

```txt
نجح.
```

تم تشغيل:

```powershell
npm run build
```

والنتيجة:

```txt
نجح.
ظهر المسار /[slug] كمسار dynamic server-rendered on demand.
```

---

### اختبار endpoint الإحصائيات

تم تشغيل:

```powershell
npm run lint
```

والنتيجة:

```txt
نجح.
```

تم تشغيل:

```powershell
npm run build
```

والنتيجة:

```txt
نجح.
ظهر المسار /api/statistics كمسار dynamic server-rendered on demand.
```

ملاحظة تشغيلية:

```txt
لم يتم وضع أسرار خدمة Firebase داخل Cloudflare من هذا التعديل.
الكود جاهز، لكن الإنتاج يحتاج FIREBASE_SERVICE_ACCOUNT_EMAIL و FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY أو FIREBASE_SERVICE_ACCOUNT_JSON.
```

---

### اختبار Cloudflare secrets و SEO

تم تشغيل:

```powershell
npx wrangler whoami
```

والنتيجة:

```txt
Wrangler مسجل الدخول بحساب date.tool.official@gmail.com.
```

تم تشغيل:

```powershell
npx wrangler secret list
```

والنتيجة:

```txt
[]
لا توجد أسرار محفوظة للـ Worker حتى الآن.
```

تم تشغيل:

```powershell
npm run lint
npm run build
```

والنتيجة:

```txt
نجحا.
ظهر /robots.txt و /sitemap.xml ضمن البناء.
ظهر Middleware ضمن البناء.
```

تم اختبار الإنتاج:

```powershell
curl.exe -I https://date-tool.com/robots.txt
curl.exe -I https://date-tool.com/sitemap.xml
curl.exe -I https://www.date-tool.com/
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" -d "{\"event\":\"visit\"}"
```

والنتيجة:

```txt
https://date-tool.com/robots.txt -> 200 OK
https://date-tool.com/sitemap.xml -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
/api/statistics -> {"ok":false,"error":"statistics_not_configured"}
```

تفسير نتيجة endpoint:

```txt
هذه نتيجة آمنة ومتوقعة لأن FIREBASE_SERVICE_ACCOUNT_JSON لم يتم إدخاله بعد كـ Cloudflare secret.
```

---

### اختبار تفعيل endpoint الإحصائيات بعد ضبط الأسرار

تم تشغيل:

```powershell
npx wrangler secret list
npm run lint
npm run deploy
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-visit.json"
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-tool.json"
curl.exe -s -X POST https://date-tool.com/api/statistics -H "Content-Type: application/json" --data-binary "@tmp-stat-ad.json"
```

والنتيجة:

```txt
npx wrangler secret list -> FIREBASE_SERVICE_ACCOUNT_EMAIL و FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY موجودان.
FIREBASE_SERVICE_ACCOUNT_JSON غير موجود بعد حذفه.
npm run lint -> نجح.
npm run deploy -> نجح.
Current Version ID: cfed1eb7-1cc9-4381-b75a-4cb45446ee02
/api/statistics visit -> {"ok":true}
/api/statistics tool ageCalc -> {"ok":true}
/api/statistics adClick test_ad -> {"ok":true}
```

ملاحظة أمنية:

```txt
لم تتم طباعة قيم الأسرار.
لم يتم commit لملف service account JSON.
ملفات JSON المؤقتة للاختبار حُذفت بعد الاختبار.
```

---

### اختبار تنظيف Firebase Imports

تم تشغيل:

```powershell
rg -n "firebase/auth|firebase/firestore|firebase/storage|firebase/app|../firebase|./firebase" app\page.jsx app\admin\page.jsx app\admin_login\page.jsx app\firebase.js app\Header.jsx app\Footer.jsx
rg -n "firebase/auth|firebase/firestore|firebase/storage|firebase/app|../firebase|./firebase" -g "PageClient.jsx" app
npm run lint
npm run build
```

والنتيجة:

```txt
app/page.jsx يستخدم dynamic import داخل useEffect.
app/[slug]/PageClient.jsx يستخدم dynamic import داخل useEffect.
app/admin/page.jsx يستخدم dynamic import داخل useEffect.
app/admin_login/page.jsx يستخدم dynamic import داخل handleLogin.
app/Header.jsx و app/Footer.jsx لا يستوردان Firebase.
app/firebase.js هو الملف المركزي الوحيد الذي يستورد Firebase Client SDK مباشرة.
npm run lint -> نجح.
npm run build -> نجح بعد السماح لـ Wrangler بكتابة سجلاته في AppData.
npm run deploy -> نجح.
Current Version ID: 08a8faca-a871-40a6-82af-80fc44a68161
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin_login -> 200 OK
https://date-tool.com/admin -> 200 OK
https://date-tool.com/privacy -> 200 OK
```

---

### اختبار تأسيس تخزين الصور والheaders الأمنية

تم تشغيل:

```powershell
npx wrangler r2 bucket list
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -s -i https://date-tool.com/api/media/logo/test.png
```

والنتيجة:

```txt
npx wrangler r2 bucket list -> فشل لأن R2 غير مفعل في حساب Cloudflare بعد.
Cloudflare API code: 10042
Please enable R2 through the Cloudflare Dashboard.
npm run lint -> نجح.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 086374a8-9ae0-4c77-9976-d73193273432
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
/api/media/logo/test.png -> 503 {"ok":false,"error":"media_storage_not_configured"}
```

Headers ظهرت على الإنتاج:

```txt
Strict-Transport-Security
Permissions-Policy
Referrer-Policy
X-Content-Type-Options
X-Frame-Options
```

---

### اختبار تفعيل R2 وربطه بالإنتاج

تم تشغيل:

```powershell
npx wrangler r2 bucket list
npx wrangler r2 bucket create datetools-media
npm run lint
npm run build
npm run deploy
npx wrangler r2 object put datetools-media/logo/codex-r2-test.png --remote --file tmp-r2-test.png --content-type image/png --cache-control "public, max-age=60"
curl.exe -I https://date-tool.com/api/media/logo/codex-r2-test.png
npx wrangler r2 object delete datetools-media/logo/codex-r2-test.png --remote --force
curl.exe -s https://date-tool.com/api/media/logo/codex-r2-test.png
```

والنتيجة:

```txt
R2 bucket list -> نجح بعد تفعيل R2.
تم إنشاء bucket datetools-media.
npm run lint -> نجح.
npm run build -> نجح.
npm run deploy -> نجح.
ظهر binding في النشر: env.MEDIA_BUCKET (datetools-media) R2 Bucket.
Current Version ID: 74c58791-b937-4942-bdfe-d46e6520429c
قراءة صورة الاختبار من /api/media/logo/codex-r2-test.png -> 200 OK / Content-Type: image/png.
بعد حذف الصورة المؤقتة -> {"ok":false,"error":"media_not_found"}.
```

---

### اختبار إصلاح تحذيرات ESLint ومنع تكرار slug

تم تشغيل:

```powershell
npm run lint
npm run build
git diff --check
```

والنتيجة:

```txt
npm run lint -> نجح بدون تحذيرات.
npm run build -> توقف داخل sandbox بسبب عدم السماح لـ Wrangler/OpenNext بإنشاء سجلات داخل AppData.
محاولة إعادة البناء بصلاحية أعلى -> رُفضت تلقائيًا بسبب حد استخدام Codex، وليس بسبب خطأ في الكود.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build بعد استئناف المهمة -> نجح.
npm run deploy بعد استئناف المهمة -> نجح.
Current Version ID: 4bcff349-5677-4973-8457-dcf0c823706c
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://date-tool.com/privacy -> 200 OK
/api/media/logo/codex-r2-test.png -> {"ok":false,"error":"media_not_found"} لأن صورة الاختبار حُذفت سابقًا.
```

التغييرات التي تمت:

```txt
تم تفعيل إعداد Next.js ESLint core-web-vitals عبر FlatCompat.
تم تحويل روابط الصفحات الداخلية إلى next/link.
تم تحويل صور اللوقو والإعلانات من img إلى next/image.
تم نقل خط Cairo إلى next/font بدل رابط Google Fonts اليدوي.
تم إصلاح اعتماد useEffect الخاص بأحداث اليوم.
تم منع تكرار slug داخل لوحة الإدارة قبل الحفظ وأثناء تعديل slug.
```

ملاحظة:

```txt
تم استئناف المهمة بعد توفر حد الاستخدام، وتم البناء والنشر والتحقق من الإنتاج.
```

---

### اختبار تحسين رفع صور اللوقو وfavicon وتوحيد الرسائل

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/admin_login
curl.exe -s -X POST https://date-tool.com/api/media/upload
```

والنتيجة:

```txt
npm run lint -> نجح بدون تحذيرات.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: adb3c119-f33f-4638-b08c-7259dcf2a24b
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://date-tool.com/admin_login -> 200 OK
/api/media/upload بدون توكن مدير -> {"ok":false,"error":"unauthorized"}
```

التغييرات التي تمت:

```txt
تم إضافة Toast موحد لرسائل النجاح والخطأ والتحذير والمعلومات.
تم استخدام Toast في الصفحة الرئيسية ولوحة الإدارة وصفحة تسجيل الدخول.
تم تحسين رسائل رفع الصور في لوحة الإدارة لتوضيح سبب الفشل.
تم دعم ملفات .ico حتى إذا أرسلها المتصفح كـ application/octet-stream.
تم إبقاء SVG مرفوضًا لأسباب أمنية.
تم تحسين accept لحقول رفع اللوقو وfavicon والإعلانات.
```

ملاحظة:

```txt
تم اختبار أمان endpoint الرفع بدون توكن مدير وتأكد أنه يرفض الطلب.
اختبار رفع لوقو وfavicon فعلي من لوحة الإدارة يحتاج جلسة مدير نشطة وملفات صور حقيقية.
```

---

### اختبار تنظيم صفحة الإدارة وجدول الإعلانات

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://datetools.date-tool-official.workers.dev/admin
curl.exe -I https://date-tool.com/admin_login
curl.exe -s -X POST https://date-tool.com/api/media/upload
```

والنتيجة:

```txt
npm run lint -> نجح بدون تحذيرات.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 71eb7127-8d4c-47e8-8e9e-e7feabf0ec37
https://date-tool.com/ -> 200 OK بعد إعادة الفحص خارج العزل.
https://datetools.date-tool-official.workers.dev/admin -> 200 OK.
https://date-tool.com/admin_login -> 200 OK.
/api/media/upload بدون توكن مدير -> {"ok":false,"error":"unauthorized"}
```

التغييرات التي تمت:

```txt
تم تنظيم قسم الهوية في لوحة الإدارة بحيث أصبحت الحقوق مع اسم الموقع والصور.
تم تعديل ظهور اللوقو بحيث يظهر أو يختفي وحده أعلى الاسم، ولا يخفي اسم الموقع.
تم فصل حفظ أقسام لوحة الإدارة عبر saveSiteConfigSection حتى يحفظ كل زر حقوله فقط.
تم تسمية إعلان وسط الصفحة "إعلان مميز".
تم تجهيز إعلان أعلى الصفحة كإطار مخصص لكود Google لاحقًا.
تمت إضافة جدول إدارة الإعلانات مع زر إضافة إعلان.
تمت إضافة نافذة إضافة/تعديل إعلان تشمل الاسم، الموضع، البداية والنهاية، رابط Google Drive، رابط الوجهة، الحالة، الملاحظات، المعاينة، الحجم المفضل، ونصائح الإعلان.
تم عدم تقسيم لوحة الإدارة إلى ملفات منفصلة تنفيذًا لطلب المستخدم.
```

ملاحظة:

```txt
تم فحص الإنتاج بعد النشر، وبقي endpoint رفع الصور يرفض الطلبات بدون توكن مدير.
اختبار الحفظ الفعلي داخل لوحة الإدارة يحتاج جلسة مدير نشطة لأن الحفظ يتطلب Firebase Auth.
```

---

### اختبار تأسيس بوابة المعلنين والدعم

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx firebase deploy --only firestore:rules
npx -p firebase-tools firebase deploy --only firestore:rules
npm run deploy
curl.exe -I https://date-tool.com/client
curl.exe -I https://date-tool.com/client/register
curl.exe -I https://date-tool.com/support
curl.exe -s -X POST https://date-tool.com/api/support -H "Content-Type: application/json" -d "{}"
```

والنتيجة:

```txt
npm run lint -> ظهر خطأ واحد بسبب استخدام <a> لمسار /client ثم تم إصلاحه باستخدام next/link.
npm run lint بعد الإصلاح -> نجح.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build -> نجح وظهرت 17 صفحة/مسار.
npx firebase deploy --only firestore:rules -> فشل لأن Firebase CLI غير متاح بهذه الصيغة داخل المشروع.
npx -p firebase-tools firebase deploy --only firestore:rules -> نجح وتم نشر قواعد Firestore.
npm run deploy -> المحاولة الأولى انتهت بمهلة زمنية بدون نتيجة مؤكدة.
npm run deploy بمهلة أطول -> نجح.
Current Version ID: 81a3bbc2-b905-4b28-8424-58dea977129e
https://date-tool.com/client -> 200 OK
https://date-tool.com/client/register -> 200 OK
https://date-tool.com/support -> 200 OK
/api/support ببيانات فارغة -> {"ok":false,"error":"invalid_support_payload"}
```

التغييرات التي تمت:

```txt
تمت إضافة /client لتسجيل دخول المعلنين.
تمت إضافة /client/register لإنشاء حساب معلن.
تمت إضافة /client/reset-password لاستعادة كلمة المرور.
تمت إضافة /client/dashboard لعرض الحملات والإحصائيات والفلاتر والنافبار والسايدبار.
تمت إضافة /client/create-campaign لإنشاء حملة جديدة وإرسالها للمراجعة.
تمت إضافة /support كواجهة دعم عامة.
تمت إضافة /api/support لحفظ تذاكر الدعم من جهة الخادم باستخدام أسرار Firebase الحالية.
تمت إضافة تصميم مشترك ClientPortal.css ومكون ClientShell للنافبار والسايدبار.
تم تحديث رابط إعلان الوسط في الصفحة الرئيسية ليفتح /client بدل الرابط الخارجي القديم.
تم تحديث firestore.rules لدعم advertisers و campaigns و support_tickets بصلاحيات محددة.
```

ملاحظة أمنية:

```txt
لم يتم نقل أسرار Google Script القديمة إلى العميل.
لم يتم فتح كتابة عامة مباشرة إلى support_tickets.
إنشاء تذاكر الدعم يتم عبر /api/support من جهة الخادم.
المعلن يستطيع قراءة حملاته فقط، وإنشاء حملة بحالة "قيد المراجعة"، وتعديل حالة حملته فقط إلى "قيد المراجعة" أو "متوقف مؤقتاً".
اختبار إنشاء حساب معلن أو حملة فعلية يحتاج حساب بريد/كلمة مرور وتجربة من المتصفح حتى لا ننشئ بيانات اختبار غير مرغوبة.
```

---

### اختبار تقسيم الصفحة الرئيسية

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/client
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/support
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build -> نجح بعد استئناف المهمة.
npm run deploy -> نجح.
Current Version ID: bf7bd30b-4b7d-4d7c-b391-85e2403338a9
https://date-tool.com/ -> 200 OK
https://date-tool.com/client -> 200 OK
https://date-tool.com/admin -> 200 OK
https://date-tool.com/support -> 200 OK
```

التغييرات التي تمت:

```txt
تم إنشاء app/components/home/HomeSections.jsx لتقسيم واجهة الصفحة الرئيسية إلى أقسام.
تم إنشاء app/components/home/homeDateUtils.js لنقل النصوص والثوابت ودوال التاريخ الأساسية.
تم تقليل app/page.jsx وإبقاؤه مسؤولًا عن الحالة والمنطق وربط الأقسام.
تم إبقاء أنماط الصفحة الرئيسية في app/globals.css لأن الأنماط مشتركة ومترابطة بين أقسام الصفحة.
```

---

### اختبار تحديث الفوتر ورقم الإصدار 0.2.1

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/privacy
curl.exe -I https://date-tool.com/client
curl.exe -I https://www.date-tool.com/
curl.exe -L "https://date-tool.com/?v=0.2.1"
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> لا توجد أخطاء whitespace، فقط تحذير CRLF المعتاد في ويندوز.
npm run build -> نجح بعد إعادة التشغيل خارج sandbox بسبب حاجة Wrangler للكتابة في AppData.
npm run deploy -> نجح.
Current Version ID: c5e8b8a5-f047-4b04-aec3-af842afe9c47
https://date-tool.com/ -> 200 OK
https://date-tool.com/privacy -> 200 OK
https://date-tool.com/client -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
تم التحقق من ظهور footer-version ورقم الإصدار 0.2.1 في HTML المنشور عند طلب الصفحة مع cache-bust.
```

التغييرات التي تمت:

```txt
تم تحديث app/Footer.jsx ليستخدم بنية فوتر مكتملة وروابط افتراضية ثابتة مع روابط الإعدادات.
تم نقل تنسيقات الفوتر من inline styles إلى app/globals.css مع دعم روابط التواصل ورقم الإصدار.
تم إنشاء app/version.js كمصدر رقم الإصدار داخل الواجهة.
تم رفع package.json و package-lock.json إلى الإصدار 0.2.1.
تم إنشاء VERSION_LOG.md كسجل رسمي لإصدارات المشروع.
```

---

### اختبار تصحيح الفوتر وربطه بروابط قاعدة البيانات فقط 0.2.2

تم تشغيل:

```powershell
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/privacy
curl.exe -I https://www.date-tool.com/
curl.exe -L "https://date-tool.com/?v=0.2.2"
```

والنتيجة:

```txt
npm run lint -> نجح.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 20b8701d-8941-4e32-85cb-a1d9eec0590b
https://date-tool.com/ -> 200 OK
https://date-tool.com/privacy -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
تم التحقق من أن الفوتر المنشور لا يحتوي footer-brand.
تم التحقق من ظهور رقم الإصدار 0.2.2 في الفوتر.
عند عدم وجود روابط footer من قاعدة البيانات لا يتم حقن روابط افتراضية ثابتة من الكود.
```

التغييرات التي تمت:

```txt
تم حذف روابط الفوتر الافتراضية الثابتة من app/Footer.jsx.
أصبحت روابط الفوتر تأتي فقط من config.internalPages و config.externalLinks عند اختيار location footer أو both.
تم حذف عرض اسم الأداة من الفوتر.
تم تصغير خط الفوتر وتقليل المسافات في app/globals.css.
تم رفع الإصدار إلى 0.2.2 وتحديث VERSION_LOG.md.
```

---

### اختبار توحيد أزرار الهيدر واستبدال نص اللغة بأيقونة 0.2.3

تم تشغيل:

```powershell
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://www.date-tool.com/
curl.exe -L "https://date-tool.com/?v=0.2.3"
```

والنتيجة:

```txt
npm run lint -> نجح.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: aa6dab5d-f402-42fe-95a2-69d883c3a166
https://date-tool.com/ -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
تم التحقق من أن زر اللغة يستخدم fa-language ولا يعرض نص English/عربي داخل الزر.
تم التحقق من أن زر اللغة وزر الوضع الليلي يستخدمان نفس class: control-btn.
```

التغييرات التي تمت:

```txt
تم تحديث app/Header.jsx لإزالة inline styles المختلفة من زري التحكم.
تم استبدال نص زر اللغة بأيقونة الترجمة.
تم تحسين aria-label و title لزر اللغة وزر الوضع.
تم رفع الإصدار إلى 0.2.3 وتحديث VERSION_LOG.md.
```

---

### اختبار تحويل الصفحات التعريفية إلى قاعدة البيانات 0.2.4

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run deploy
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/support
curl.exe -I https://www.date-tool.com/
git add PROJECT_MEMO.md VERSION_LOG.md PAGE_HTML_TEMPLATES.md app/[slug]/PageClient.jsx app/admin/AdminPage.css app/admin/page.jsx app/contact/page.jsx app/firebase.js app/privacy/page.jsx app/terms/page.jsx app/version.js package.json package-lock.json
git commit -m "move info pages to database"
git push origin master
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> فشل داخل الساندبوكس بسبب محاولة Wrangler الكتابة في AppData.
تشغيل build مع XDG_CONFIG_HOME داخل مجلد المشروع -> نجح.
npm run deploy داخل الساندبوكس -> فشل لأن OpenNext على ويندوز حاول قراءة مسار أعلى من مساحة العمل.
npm run deploy خارج الساندبوكس -> نجح بعد إعادة التشغيل بمهلة أطول.
Current Version ID: 3929e38a-ea6d-49fb-bd6d-5913ffd6e93a
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://date-tool.com/support -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
git commit -> نجح، commit: f246c04
git push origin master -> نجح، تم رفع master إلى GitHub.
```

التغييرات التي تمت:

```txt
تم حذف ملفات app/contact/page.jsx و app/privacy/page.jsx و app/terms/page.jsx.
تم الإبقاء على app/support لأنه صفحة دعم وظيفية وليست صفحة تعريفية ثابتة.
تمت إضافة contactEmail إلى إعدادات الموقع الافتراضية.
تمت إضافة خانة إيميل التواصل داخل قسم الهوية البصرية في لوحة الإدارة.
أصبح زر حفظ الهوية يحفظ contactEmail مع حقول الهوية فقط.
تم دعم المتغير {{contactEmail}} داخل صفحات slug الديناميكية.
تمت إضافة PAGE_HTML_TEMPLATES.md لقوالب HTML بسيطة للصفحات الثلاث.
تم حفظ تعديل app/admin/AdminPage.css الذي أزال min-height من حقول لوحة الإدارة.
تم رفع الإصدار إلى 0.2.4 وتحديث VERSION_LOG.md.
```

---

### اختبار إعادة شكل صفحات slug وحذف ملف القوالب 0.2.5

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/privacy
curl.exe -I https://date-tool.com/contact
curl.exe -I https://www.date-tool.com/
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 4b6664cb-3c33-4928-b829-fc7b9c0dcb75
https://date-tool.com/ -> 200 OK
https://date-tool.com/privacy -> 200 OK
https://date-tool.com/contact -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
```

التغييرات التي تمت:

```txt
تم تعديل app/[slug]/PageClient.jsx ليستخدم نفس هيكل الصفحات القديمة: container + header + card + control-btn.
تم حذف PAGE_HTML_TEMPLATES.md من المشروع لأن قوالب HTML سترسل للمستخدم كنص فقط ولا تحفظ داخل المستودع.
تم رفع الإصدار إلى 0.2.5 وتحديث VERSION_LOG.md.
```

---

### اختبار التكاملات الخارجية الآمنة 0.2.6

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -I https://www.date-tool.com/
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 31692154-654a-45cb-93a4-7992a834370f
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
```

التغييرات التي تمت:

```txt
تمت إضافة app/components/ExternalIntegrations.jsx كمكون عميل يجلب إعدادات الموقع ويحقن سكربتات Google المعروفة فقط.
تم ربط ExternalIntegrations داخل app/layout.jsx بدون استيراد Firebase في Server Component.
تمت إضافة externalIntegrations إلى إعدادات Firebase الافتراضية وحفظ الأقسام.
تمت إضافة قسم التكاملات الخارجية الآمنة في لوحة الإدارة بحفظ مستقل.
تم دعم Google tag / Analytics و Google Tag Manager و Google AdSense و Google site verification من معرفات منظمة.
لم يتم فتح حقل JavaScript خام لأسباب أمنية.
تم رفع الإصدار إلى 0.2.6 وتحديث VERSION_LOG.md.
```

ملاحظة مهمة جدًا:

```txt
⚠️ مهم جدًا:
بعد تأسيس بوابة المعلنين، الحملات الجديدة تحفظ في collection باسم campaigns.
أما جدول الإعلانات داخل لوحة الإدارة الحالية فما زال يعتمد على settings/main.adCampaigns.
هذا ليس كسرًا في الصفحة الرئيسية، لكنه تعارض معماري يجب حله في المهمة القادمة بربط لوحة الإدارة بـ campaigns أو توحيد المصدرين قبل إطلاق إدارة الإعلانات فعليًا.
```

حالة النشر:

```txt
تم استئناف المهمة بعد توفر حد الاستخدام.
تم البناء والنشر وفحص الإنتاج بنجاح.
```

---

### اختبار إعلان Google العلوي المنظم 0.2.7

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> نجح بعد إعادة التشغيل بمهلة أطول؛ التشغيل الأول وصل إلى نجاح التجميع ثم انتهى بمهلة الأداة قبل اكتمال فحص Next النهائي.
npm run deploy -> نجح.
Current Version ID: 0c1583f0-90fd-4882-960a-1cdb0ff2556d
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
```

التغييرات التي تمت:

```txt
تمت إضافة googleAdSlots إلى إعدادات Firebase الافتراضية والحفظ الجزئي للأقسام.
تمت إضافة لوحة "كود Google للإعلان العلوي" داخل قسم الإعلانات في /admin.
أصبح زر حفظ الإعلانات يحفظ adImages و googleAdSlots و adCampaigns فقط.
أصبح مربع الإعلان العلوي تحت خانة اليوم يستخدم Publisher / Client ID و Ad Slot المحفوظين بدل قيم ثابتة داخل الكود.
تمت إزالة كود AdSense الثابت من TopAdSlot واستبداله بقراءة آمنة من configData.
أصبح ExternalIntegrations يحمل سكربت AdSense من Google AdSense publisher ID أو من client الخاص بالإعلان العلوي إذا كان هو المدخل.
لم يتم فتح أي خانة JavaScript خام داخل قاعدة البيانات لأسباب أمنية.
تم رفع الإصدار إلى 0.2.7 وتحديث VERSION_LOG.md.
تم نشر الإصدار 0.2.7 على Cloudflare Version ID: 0c1583f0-90fd-4882-960a-1cdb0ff2556d.
```

ملاحظة تشغيل مهمة:

```txt
لإضافة الكود الذي أرسله المستخدم:
Publisher / Client ID = ca-pub-1147243690926079
Ad Slot = 7882868833
Ad Format = auto
full-width responsive = مفعل
إذا كانت خانة صورة إعلان أعلى الصفحة تحتوي رابط صورة، ستظهر الصورة بدل إعلان Google.
اختبار حفظ هذه القيم فعليًا من لوحة الإدارة يحتاج جلسة مدير نشطة.
```

---

### اختبار حصر AdSense في البانر العلوي 0.2.8

تم تشغيل:

```powershell
rg -n "adsbygoogle|pagead2.googlesyndication.com|googleAdsenseClient|googleAdSlots" app
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
```

والنتيجة:

```txt
تم التأكد أن وحدة `adsbygoogle` وسكربت `pagead2.googlesyndication.com` موجودان داخل app/components/home/HomeSections.jsx فقط.
مكون ExternalIntegrations لم يعد يحمل سكربت AdSense عامًّا.
Google Analytics وGTM وGoogle site verification بقوا داخل ExternalIntegrations.
الإعلان الخاص بـ Google يظهر برمجيًّا فقط في TopAdSlot داخل موضع إعلان أعلى الصفحة `adBanner1`، ولا يظهر في الإعلان المميز أو إعلانات الأسفل.
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> نجح بعد إعادة التشغيل مع XDG_CONFIG_HOME داخل مساحة العمل لأن المحاولة الأولى فشلت بسبب صلاحية كتابة سجلات Wrangler في AppData.
npm run deploy -> نجح.
Current Version ID: 4b06e953-925a-409c-b442-2b8c0d6c6e1c
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
```

التغييرات التي تمت:

```txt
تم حصر تحميل سكربت Google AdSense داخل GoogleAdsenseUnit في TopAdSlot فقط.
تم حذف تحميل AdSense العام من app/components/ExternalIntegrations.jsx حتى لا تتدخل Auto Ads خارج البانر العلوي.
تم رفع الإصدار إلى 0.2.8 وتحديث VERSION_LOG.md.
تم نشر الإصدار 0.2.8 على Cloudflare Version ID: 4b06e953-925a-409c-b442-2b8c0d6c6e1c.
```

---

### اختبار تبسيط أدوات التاريخ بمفتاح ميلادي/هجري 0.2.9

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
```

والنتيجة:

```txt
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات.
npm run build -> نجح.
npm run deploy -> نجح.
Current Version ID: 8f89fb12-6968-429e-8aa1-397da78e61ef
https://date-tool.com/ -> 200 OK
https://date-tool.com/admin -> 200 OK
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/
```

التغييرات التي تمت:

```txt
تمت إضافة حالة اختيار مستقلة لكل أداة: حساب العمر، تحويل التاريخ، حساب المدة.
تم استبدال عرض العمودين المتكرر بمكون واحد لكل أداة يعرض نموذج ميلادي أو هجري حسب الاختيار.
تمت إضافة زر اختيار أنيق `ميلادي / هجري` مطابق لألوان الموقع ويدعم العربية والإنجليزية.
يتم مسح النتائج عند تبديل نوع التقويم حتى لا تبقى نتيجة قديمة من الوضع السابق.
تم رفع الإصدار إلى 0.2.9 وتحديث VERSION_LOG.md.
تم نشر الإصدار 0.2.9 على Cloudflare Version ID: 8f89fb12-6968-429e-8aa1-397da78e61ef.
```

### اختبار إصلاح هيدر الجوال 0.2.10

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/admin
curl.exe -I https://www.date-tool.com/
```

والنتيجة:

```txt
تم نقل أزرار اللغة والوضع على الشاشات الصغيرة إلى صف متمركز داخل تدفق الهيدر بدل التموضع المطلق.
تم ضبط حجم عنوان الأداة ومسافات الهيدر للجوال حتى لا يحدث تداخل في عرض 362px.
تم رفع الإصدار إلى 0.2.10 وتحديث VERSION_LOG.md.
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات، مع تحذيرات LF/CRLF المعتادة في Windows.
npm run build -> نجح.
npm run deploy -> نجح.
https://date-tool.com/ -> 200 OK.
https://date-tool.com/admin -> 200 OK.
https://www.date-tool.com/ -> 308 Permanent Redirect إلى https://date-tool.com/.
تعذر التحقق البصري عبر متصفح التطبيق بسبب فشل تشغيل بيئة المتصفح بصلاحية Windows: CreateProcessAsUserW failed: 5.
تم نشر الإصدار 0.2.10 على Cloudflare Version ID: a6e85097-e51d-41c5-a02c-a0b7b2b4fb76.
```

### اختبار إزالة خانات صور الإعلانات من لوحة الإدارة 0.2.11

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/
```

والنتيجة:

```txt
تم حذف خانات روابط ورفع صور الإعلانات من قسم إدارة الإعلانات.
تم إبقاء إعداد Google للإعلان العلوي وجدول الإعلانات وزر إضافة إعلان.
تم تعديل زر حفظ قسم الإعلانات ليحفظ googleAdSlots و adCampaigns فقط.
تم تحديث عنوان القسم ونصه حتى لا يشير إلى رفع صور الإعلانات.
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات، مع تحذيرات LF/CRLF المعتادة في Windows.
npm run build -> نجح.
npm run deploy -> نجح.
https://date-tool.com/admin -> 200 OK.
https://date-tool.com/ -> 200 OK.
تم نشر الإصدار 0.2.11 على Cloudflare Version ID: e9fb6e72-98b0-487a-83d5-cf2d9786e073.
```

### اختبار فصل إحصائيات الإعلانات وتتبع الظهور 0.2.12

تم تشغيل:

```powershell
npm run lint
git diff --check
$env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.wrangler-xdg'); npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin
curl.exe -I https://date-tool.com/
```

والنتيجة:

```txt
تم استبدال بطاقة نقرات الإعلانات في الإحصائيات العامة ببطاقة استخدام أداة حساب فترتين.
تم إضافة قسم مستقل لإحصائيات الإعلانات يحتوي نقرات الإعلانات ومرات الظهور وCTR ونسبة الظهور للزيارات.
تم إضافة مربع تفصيلي لكل بانر: إعلان أعلى الصفحة، الإعلان المميز، إعلان أسفل الصفحة 1، إعلان أسفل الصفحة 2.
تم إضافة تتبع adImpression آمن عبر /api/statistics لكل بانر عند ظهوره في الشاشة.
npm run lint -> نجح.
git diff --check -> نجح بدون أخطاء فراغات، مع تحذيرات LF/CRLF المعتادة في Windows.
npm run build -> نجح.
npm run deploy -> نجح.
https://date-tool.com/admin -> 200 OK.
https://date-tool.com/ -> 200 OK.
تم نشر الإصدار 0.2.12 على Cloudflare Version ID: 932c39c7-27af-40de-81ce-c272c2d5b13f.
```

---

### اختبار استعادة النسخة 0.2.12 بعد الرجوع

تم تنفيذ:

```powershell
git rev-parse HEAD
git diff --stat bececd41b3daa57565a30dd16f4627dad71ff610 --
npm run lint
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
npx firebase-tools deploy --only firestore:rules
```

النتيجة:

```txt
✅ HEAD كان على bececd41b3daa57565a30dd16f4627dad71ff610 قبل الإصلاح.
✅ ملفات Firebase وCloudflare المتتبعة كانت مطابقة للنسخة.
✅ تم إصلاح next.config.mjs حتى لا يشغل initOpenNextCloudflareForDev أثناء production build.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ OpenNext build نجح.
✅ تم نشر Worker datetools على Cloudflare Version ID: 0dbea0db-38a7-4f7b-b2d1-00d1b091fe88.
✅ تم نشر Firestore Rules، وكانت already up to date.
✅ فحص الإنتاج: / = 200، /admin = 200، /admin_login = 200.
```

الملفات المتأثرة:

```txt
next.config.mjs
PROJECT_MEMO.md
```

---

### اختبار تحويل الصفحة الرئيسية للإدارة 0.2.13

تم تنفيذ:

```powershell
npm run lint
npm run build
npx firebase-tools deploy --only firestore:rules
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
npx wrangler versions list --config wrangler.jsonc
npx wrangler whoami
```

النتيجة:

```txt
✅ تم تحويل صفحة `app/1admin/admin.html` إلى صفحة React رئيسية جديدة في `/admin`.
✅ أصبحت `/admin` تعرض هيكل السايدبار والنافبار والبنر الترحيبي مع سيكشن الإحصائيات وسيكشن إحصائيات الإعلانات.
✅ تم نقل صفحة الإدارة الحالية إلى `/admin/tools` حتى تبقى مرجعًا لنقل السيكشنات لاحقًا.
✅ تم عزل تنسيق الصفحة الرئيسية الجديدة في `app/admin/AdminDashboard.css`.
✅ npm run lint نجح.
✅ npm run build نجح وظهر المساران `/admin` و `/admin/tools`.
✅ تم نشر الإصدار 0.2.13 على Cloudflare Workers. Version ID: dc368167-9006-493b-b6b5-5cf8dbafa6ff.
✅ فحص الإنتاج: `/admin` = 200 و `/admin/tools` = 200 و `/admin_login` = 200.
```

الملفات المتأثرة:

```txt
app/admin/page.jsx
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار صفحة إدارة الإعلانات 0.2.14

تم تنفيذ:

```powershell
npm run lint
npm run build
git diff --check
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
```

النتيجة:

```txt
✅ تمت إضافة صفحة `/admin/ads` داخل هيكل لوحة الإدارة الجديد.
✅ أصبح رابط السايد بار ينقل إلى إدارة الإعلانات الجديدة بدل صفحة إعدادات الأداة العامة.
✅ بقيت صفحة الإدارة القديمة على `/admin/tools` باسم إعدادات الأداة حتى تُنقل منها السيكشنات لاحقًا.
✅ صفحة الإعلانات الجديدة تعرض جدول الحملات وفلاتر البحث والموضع والحالة.
✅ تمت إضافة نافذة إضافة/تعديل إعلان مع الحقول الحالية: الاسم، الموضع، البداية، النهاية، رابط Google Drive، رابط العميل، الحالة، والملاحظات.
✅ تمت إضافة إعداد Google AdSense العلوي من نفس بيانات `settings/main.googleAdSlots.top`.
✅ حفظ صفحة الإعلانات يرسل `adCampaigns` و `googleAdSlots` فقط عبر `saveSiteConfigSection`.
✅ تم إصلاح ترميز `VERSION_LOG.md` إلى UTF-8 وإضافة الإصدار 0.2.14.
✅ npm run lint نجح بدون تحذيرات.
✅ npm run build نجح وظهر المسار `/admin/ads`.
✅ git diff --check نجح مع تحذيرات CRLF المعتادة فقط.
✅ فشل OpenNext build أولًا داخل sandbox بسبب `Access is denied` ثم نجح بعد تشغيله بصلاحيات موسعة.
✅ تم نشر الإصدار 0.2.14 على Cloudflare Workers. Version ID: 937d6fe4-4735-420e-b77d-ece654d4eefb.
✅ فحص الإنتاج: `/admin` = 200 و `/admin/ads` = 200 و `/admin/tools` = 200.
```

الملفات المتأثرة:

```txt
app/admin/page.jsx
app/admin/ads/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار جدول إدارة الإعلانات المتقدم ورفع R2 0.2.15

تم تنفيذ:

```powershell
npm run lint
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
```

النتيجة:

```txt
✅ تم تحويل صفحة `/admin/ads` إلى جدول إدارة حملات قريب من صفحة `admin_ads.html` القديمة.
✅ تم حذف قسم إعداد Google/الأكواد من صفحة إدارة الإعلانات الجديدة.
✅ أصبحت الصفحة تقرأ حملات الإعلانات من Firestore collection باسم `campaigns`.
✅ تمت إضافة فلاتر البحث القديمة: رقم/اسم الإعلان، اسم أو رقم المضيف، التاريخ، والحالة.
✅ تمت إضافة حالات وإجراءات الإدارة: قيد المراجعة، نشط، مرفوض، متوقف مؤقتاً، تم تعديله، منتهي.
✅ تمت إضافة أزرار: عرض التفاصيل، قبول، رفض، إيقاف، استئناف، تعديل، نسخ كإعلان جديد، حذف.
✅ تمت إضافة رفع صورة الإعلان إلى Cloudflare R2 عبر `/api/media/upload` بفئة `ads` بدل الاعتماد على Google Drive.
✅ تم تعديل `firestore.rules` للسماح للمدير النشط بإنشاء حملات من لوحة الإدارة مع إبقاء إنشاء المعلن محصورًا بحالته الآمنة.
✅ npm run lint نجح بدون تحذيرات.
✅ npm run build نجح وظهر المسار `/admin/ads`.
✅ تم نشر Firestore Rules بنجاح على مشروع `date-tool-official`.
✅ OpenNext build نجح للإصدار 0.2.15.
⚠️ لم يتم تأكيد نشر Worker عبر Wrangler لأن أوامر `wrangler deploy` و `wrangler versions list` و `wrangler whoami` علقت حتى انتهاء المهلة بدون إخراج.
⚠️ فحص `https://date-tool.com/admin/ads` أعطى 200، لكن لا يثبت وصول نسخة 0.2.15 لأن Wrangler لم يرجع Version ID.
```

الملفات المتأثرة:

```txt
app/admin/ads/page.jsx
app/admin/AdminDashboard.css
firestore.rules
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار فلاتر إحصائيات الإعلانات 0.2.16

تم تنفيذ:

```powershell
npm run lint
npm run build
```

النتيجة:

```txt
✅ تمت إضافة فلاتر أعلى بطاقات إحصائيات `/admin/ads`.
✅ الفلاتر الجديدة هي: الأداة، التاريخ، ومكان العرض / المصدر.
✅ فلتر الأداة يحتوي حاليًا على أداة التاريخ الشاملة مع خيار كل الأدوات استعدادًا للتوسع.
✅ فلتر مكان العرض / المصدر يدعم: الكل، مواضع الإعلانات، قوقل فقط، والمعلنين فقط.
✅ بطاقات إجمالي الحملات وقيد المراجعة والزيارات والنقرات أصبحت تعتمد على فلاتر الإحصائيات.
✅ فلاتر الجدول القديمة بقيت مستقلة أسفل الإحصائيات.
✅ npm run lint نجح بدون تحذيرات.
✅ npm run build نجح وظهر المسار `/admin/ads`.
✅ OpenNext build نجح للإصدار 0.2.16.
⚠️ لم يتم تأكيد نشر Worker عبر Wrangler لأن `npx wrangler deploy --config wrangler.jsonc` علق حتى انتهاء المهلة بدون إخراج.
```

الملفات المتأثرة:

```txt
app/admin/ads/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار صفحة إدارة الهوية البصرية - الإصدار 0.2.17

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/identity
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/identity`.
✅ OpenNext build نجح للإصدار 0.2.17.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/identity` أعاد 200.
✅ Cloudflare Version ID: 5d115ce5-a75f-42fb-8542-fa08ff6c6b2f
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/admin/AdminDashboard.css
app/admin/page.jsx
app/admin/ads/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار تحسين رفع صور الهوية - الإصدار 0.2.18

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/identity
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/identity`.
✅ OpenNext build نجح للإصدار 0.2.18.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/identity` أعاد 200.
✅ Cloudflare Version ID: 7f74ee6b-6722-4592-9edb-6583858bc348
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار Toast صفحة الهوية - الإصدار 0.2.19

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/identity
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/identity`.
✅ OpenNext build نجح للإصدار 0.2.19.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/identity` أعاد 200.
✅ Cloudflare Version ID: d52d8519-284e-4d3e-a9cd-fb122773caf7
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار صفحة إعدادات الإعلانات - الإصدار 0.2.20

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/ad-settings
Invoke-WebRequest https://date-tool.com/ads.txt
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/ad-settings`.
✅ ظهر المسار الديناميكي `/ads.txt` ضمن build.
✅ OpenNext build نجح للإصدار 0.2.20.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/ad-settings` أعاد 200.
✅ مسار الإنتاج `/ads.txt` أعاد 200 ويعرض سطر AdSense الحالي.
✅ Cloudflare Version ID: a2df03ff-6602-4b0e-b713-be0b6ee010f2
```

الملفات المتأثرة:

```txt
app/admin/ad-settings/page.jsx
app/ads.txt/route.js
app/admin/AdminDashboard.css
app/admin/page.jsx
app/admin/ads/page.jsx
app/admin/identity/page.jsx
app/components/home/HomeSections.jsx
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار تبسيط جدول إعدادات الإعلانات - الإصدار 0.2.21

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/ad-settings
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/ad-settings`.
✅ OpenNext build نجح للإصدار 0.2.21.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/ad-settings` أعاد 200.
✅ Cloudflare Version ID: f28b034a-3733-400d-9ab9-7ac5da50278e
```

الملفات المتأثرة:

```txt
app/admin/ad-settings/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار صفحة الربط الخارجي - الإصدار 0.2.22

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/integrations
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/integrations`.
✅ OpenNext build نجح للإصدار 0.2.22.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/integrations` أعاد 200.
✅ Cloudflare Version ID: 50c45500-f799-468e-b237-f60218c0e8c8
```

الملفات المتأثرة:

```txt
app/admin/integrations/page.jsx
app/admin/AdminDashboard.css
app/admin/tools/page.jsx
app/admin/page.jsx
app/admin/ad-settings/page.jsx
app/admin/ads/page.jsx
app/admin/identity/page.jsx
app/components/ExternalIntegrations.jsx
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار تبسيط إعدادات الأداة - الإصدار 0.2.23

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/tools
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر المسار `/admin/tools` بحجم أخف.
✅ OpenNext build نجح للإصدار 0.2.23.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/tools` أعاد 200.
✅ Cloudflare Version ID: d9f15483-6f0d-489b-b618-a5873fb23e36
```

الملفات المتأثرة:

```txt
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/Footer.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار توحيد أيقونات الإدارة - الإصدار 0.2.24

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin/tools
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهر مسار `/admin/tools`.
✅ OpenNext build نجح للإصدار 0.2.24.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ مسار الإنتاج `/admin/tools` أعاد 200.
✅ Cloudflare Version ID: ee732f31-bd57-49dc-a03f-921148dd7d92
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/admin/AdminPage.css
app/admin/page.jsx
app/admin/ads/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار تحسين إحصائيات لوحة الإدارة - الإصدار 0.2.26

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/admin
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهرت صفحة `/admin` ضمن البناء.
✅ OpenNext build نجح بعد تشغيله بصلاحية موسعة بسبب قيود sandbox على ويندوز.
✅ تم نشر الإصدار 0.2.26 على Cloudflare.
✅ صفحة الإنتاج `/admin` أعادت 200.
✅ Cloudflare Version ID: fa1f9f6c-43bd-4f4d-b7c0-c69c9e379636
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/admin/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار بوابة المعلنين - الإصدار 0.2.25

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
firebase deploy --only firestore:rules
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/client
Invoke-WebRequest https://date-tool.com/client/register
Invoke-WebRequest https://date-tool.com/client/dashboard
Invoke-WebRequest https://date-tool.com/client/create-campaign
```

النتيجة:

```txt
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهرت صفحات `/client` و`/client/register` و`/client/dashboard` و`/client/create-campaign`.
✅ تم نشر Firestore Rules بنجاح عبر `npx firebase-tools deploy --only firestore:rules`.
✅ OpenNext build نجح للإصدار 0.2.25.
✅ تم نشر Worker بنجاح على Cloudflare.
✅ صفحات الإنتاج `/client` و`/client/register` و`/client/dashboard` و`/client/create-campaign` أعادت 200.
✅ Cloudflare Version ID: c35f1d11-3f86-4529-8a44-ca05f9ea969b
⚠️ لم يتم تفعيل Turnstile فعليًا لأن ذلك يحتاج إنشاء Widget وSecret/Worker تحقق بصلاحية Cloudflare مخصصة. تم توضيح ذلك داخل صفحات الكلاينت بدل إضافة حماية شكلية غير متحققة من الخادم.
```

الملفات المتأثرة:

```txt
app/client/ClientPortal.css
app/client/ClientShell.jsx
app/client/ClientVersion.js
app/client/page.jsx
app/client/register/page.jsx
app/client/reset-password/page.jsx
app/client/dashboard/page.jsx
app/client/create-campaign/page.jsx
firestore.rules
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

## 9. الحالة الحالية

```txt
✅ مشروع Next.js يعمل على Cloudflare Workers
✅ OpenNext مضبوط
✅ GitHub deploy يعمل
✅ package-lock.json تم إصلاحه
✅ npm ci يعمل محليًا
✅ Cloudflare Build يعمل
✅ Cloudflare Deploy يعمل
✅ Worker datetools يعمل
✅ date-tool.com يعمل
✅ www.date-tool.com يعمل
✅ الصفحة الرئيسية تعمل
✅ صفحات privacy / terms / contact تعمل
✅ صفحات slug تعمل
✅ خطأ 500 تم حله
✅ خطأ EvalError تم حله
✅ layout.jsx لم يعد يقرأ config.json
✅ الصفحة الرئيسية لم تعد تستورد Firebase مباشرة أثناء Worker runtime
✅ Route الخاص بـ www مضبوط على datetools
✅ تمت إضافة firestore.rules محليًا
✅ تمت إضافة firebase.json و .firebaserc لتحديد مشروع Firebase وقواعده
✅ تم نشر Firestore Rules على مشروع date-tool-official
✅ تم منع الكتابة العامة المباشرة على statistics/main من كود المتصفح
✅ layout.jsx يستخدم metadata ثابتة بدون fs/path/config.json
✅ صفحات slug مفصولة إلى Server wrapper و PageClient آمن لتحميل Firebase من جهة العميل
✅ PageClient يدعم customPages/pages ككائنات keyed by slug كما تحفظها لوحة الإدارة
✅ تمت إضافة /api/statistics كـ endpoint آمن للإحصائيات
✅ app/firebase.js يرسل أحداث الإحصائيات إلى endpoint بدل الكتابة المباشرة على Firestore
✅ Wrangler مسجل الدخول بحساب Cloudflare الصحيح
✅ تمت إضافة متغيرات Cloudflare غير السرية إلى wrangler.jsonc
✅ تمت إضافة sitemap.xml
✅ تمت إضافة robots.txt
✅ تمت إضافة Canonical Redirect من www.date-tool.com إلى date-tool.com
✅ تم نشر التغييرات يدويًا إلى Cloudflare Workers
✅ robots.txt يعمل على الإنتاج
✅ sitemap.xml يعمل على الإنتاج
✅ تحويل www إلى الدومين الأساسي يعمل على الإنتاج
✅ تم ضبط أسرار Firebase المطلوبة للـ statistics endpoint على Cloudflare
✅ تم حذف FIREBASE_SERVICE_ACCOUNT_JSON غير الصحيح والاعتماد على الأسرار المفصولة
✅ /api/statistics يعمل على الإنتاج ويحدث Firestore عبر جهة الخادم
✅ تم تنظيف Firebase Imports في app/page.jsx و app/[slug]/PageClient.jsx و app/admin/page.jsx و app/admin_login/page.jsx و app/Header.jsx و app/Footer.jsx
✅ لم يتم تقسيم لوحة الإدارة في مهمة تنظيف Firebase Imports
✅ تمت إضافة endpoints آمنة مبدئيًا لتخزين وعرض صور R2
✅ تمت إضافة حقول رفع/روابط للّوقو وfavicon وصور الإعلانات في لوحة الإدارة
✅ تمت إضافة Security Headers أساسية عبر middleware
✅ تمت إضافة تنظيف HTML مبدئي لمحتوى الصفحات
✅ R2 مفعل وتم إنشاء bucket datetools-media
✅ تم ربط R2 بالـ Worker عبر MEDIA_BUCKET
✅ تم اختبار قراءة صورة من R2 عبر /api/media بنجاح
✅ تم إصلاح إعداد ESLint لاستخدام Next.js core-web-vitals
✅ npm run lint ينجح بدون تحذيرات
✅ تم منع تكرار slug في لوحة الإدارة قبل الحفظ وأثناء تعديل slug
✅ تم تحويل صور اللوقو والإعلانات إلى next/image
✅ تم نقل خط Cairo إلى next/font
✅ npm run lint ينجح
✅ npm run build ينجح بعد استئناف المهمة
✅ npm run deploy ينجح بعد استئناف المهمة
✅ تم نشر نسخة Cloudflare Version ID: 4bcff349-5677-4973-8457-dcf0c823706c
✅ تم توحيد رسائل الخطأ والنجاح عبر Toast أنيق في الموقع ولوحة الإدارة وتسجيل الدخول
✅ تم تحسين رفع favicon بصيغة .ico حتى عند وصول نوع الملف كـ application/octet-stream
✅ تم نشر نسخة Cloudflare Version ID: adb3c119-f33f-4638-b08c-7259dcf2a24b
✅ تم تنظيم صفحة الإدارة الحالية بدون تقسيمها إلى ملفات منفصلة
✅ أصبح حفظ كل قسم في لوحة الإدارة يرسل حقول ذلك القسم فقط
✅ أصبحت الحقوق ضمن قسم الهوية مع الاسم واللوقو وfavicon
✅ أصبح زر اللوقو يخفي/يظهر اللوقو فقط ولا يخفي اسم الموقع
✅ تمت إضافة جدول الإعلانات ونافذة إضافة/تعديل إعلان مع معاينة ونصائح وحالة الإعلان
✅ تم نشر نسخة Cloudflare Version ID: 71eb7127-8d4c-47e8-8e9e-e7feabf0ec37
✅ تمت إضافة بوابة المعلنين داخل app عبر /client
✅ تمت إضافة تسجيل معلن جديد واستعادة كلمة المرور
✅ تمت إضافة لوحة معلن بسايدبار ونافبار وإحصائيات وجدول حملات وفلاتر
✅ تمت إضافة صفحة طلب إعلان جديد وحفظ الحملات في Firestore بحالة قيد المراجعة
✅ تمت إضافة صفحة دعم عامة و endpoint آمن /api/support لحفظ التذاكر من جهة الخادم
✅ تم نشر قواعد Firestore بعد إضافة advertisers و campaigns و support_tickets
✅ تم نشر نسخة Cloudflare Version ID: 81a3bbc2-b905-4b28-8424-58dea977129e
✅ تم بدء تقسيم الصفحة الرئيسية إلى مكونات أصغر وملف أدوات للتواريخ
✅ npm run lint ينجح بعد تقسيم الصفحة الرئيسية
✅ npm run build ينجح بعد استئناف تقسيم الصفحة الرئيسية
✅ تم نشر تقسيم الصفحة الرئيسية على Cloudflare Version ID: bf7bd30b-4b7d-4d7c-b391-85e2403338a9
✅ تم تحديث فوتر الموقع وإضافة رقم الإصدار v0.2.1
✅ تم إنشاء VERSION_LOG.md وتوثيق الإصدار 0.2.1
✅ npm run lint و npm run build ينجحان بعد تحديث الفوتر ورقم الإصدار
✅ تم نشر تحديث الفوتر ورقم الإصدار على Cloudflare Version ID: c5e8b8a5-f047-4b04-aec3-af842afe9c47
✅ تم تصحيح الفوتر في الإصدار v0.2.2 ليعرض روابط قاعدة البيانات فقط بدون اسم الأداة وبدون روابط افتراضية ثابتة
✅ تم تصغير خط الفوتر وتقليل المسافات
✅ npm run lint و npm run build ينجحان بعد تصحيح الفوتر
✅ تم نشر تصحيح الفوتر على Cloudflare Version ID: 20b8701d-8941-4e32-85cb-a1d9eec0590b
✅ تم توحيد نمط زر اللغة وزر الوضع الليلي في الهيدر واستبدال نص اللغة بأيقونة ترجمة
✅ تم نشر تحديث الهيدر على Cloudflare Version ID: aa6dab5d-f402-42fe-95a2-69d883c3a166
✅ تم حذف صفحات `contact` و `privacy` و `terms` الثابتة من الكود حتى تدار من قاعدة البيانات عبر صفحات slug
✅ تم دعم متغير `{{contactEmail}}` داخل محتوى الصفحات الديناميكية
✅ تم إضافة خانة إيميل التواصل إلى قسم الهوية البصرية في لوحة الإدارة وحفظها ضمن زر حفظ الهوية فقط
✅ تم إضافة `PAGE_HTML_TEMPLATES.md` لقوالب HTML بسيطة للخصوصية والشروط واتصل بنا
✅ npm run lint و git diff --check و npm run build ينجحون بعد تحويل الصفحات التعريفية إلى قاعدة البيانات
✅ تم حفظ تعديل app/admin/AdminPage.css الذي أزال min-height من حقول لوحة الإدارة
✅ تم نشر الإصدار 0.2.4 على Cloudflare Version ID: 3929e38a-ea6d-49fb-bd6d-5913ffd6e93a
✅ تم رفع التغييرات إلى GitHub على commit: f246c04
✅ تم تعديل قالب صفحات slug الديناميكية ليستخدم نفس شكل الصفحات القديمة بدل الشكل الجديد المختلف
✅ تم حذف `PAGE_HTML_TEMPLATES.md` من المشروع بناءً على طلب المستخدم
✅ تم نشر الإصدار 0.2.5 على Cloudflare Version ID: 4b6664cb-3c33-4928-b829-fc7b9c0dcb75
✅ تم إضافة قسم التكاملات الخارجية الآمنة في لوحة الإدارة
✅ تم دعم Google tag / Analytics و Google Tag Manager و Google AdSense و Google site verification من معرفات منظمة بدل كود خام
✅ تم نشر الإصدار 0.2.6 على Cloudflare Version ID: 31692154-654a-45cb-93a4-7992a834370f
✅ تمت إضافة إعداد Google AdSense المنظم للإعلان العلوي داخل قسم الإعلانات
✅ تم نشر الإصدار 0.2.7 على Cloudflare Version ID: 0c1583f0-90fd-4882-960a-1cdb0ff2556d
✅ تم نشر الإصدار 0.2.8 وحصر تحميل Google AdSense داخل موضع `adBanner1` فقط على Cloudflare Version ID: 4b06e953-925a-409c-b442-2b8c0d6c6e1c
✅ تم نشر الإصدار 0.2.9 وتحويل أدوات العمر والتحويل والمدة إلى نموذج واحد مع زر اختيار `ميلادي / هجري` على Cloudflare Version ID: 8f89fb12-6968-429e-8aa1-397da78e61ef
✅ تم نشر الإصدار 0.2.10 وإصلاح تداخل أزرار الهيدر مع اسم الأداة على الشاشات الصغيرة على Cloudflare Version ID: a6e85097-e51d-41c5-a02c-a0b7b2b4fb76
✅ تم نشر الإصدار 0.2.11 وإزالة خانات صور الإعلانات من لوحة الإدارة والاكتفاء بزر إضافة إعلان فوق الجدول على Cloudflare Version ID: e9fb6e72-98b0-487a-83d5-cf2d9786e073
✅ تم نشر الإصدار 0.2.12 وفصل إحصائيات الإعلانات عن الأدوات وإضافة تتبع ظهور الإعلانات لكل بانر على Cloudflare Version ID: 932c39c7-27af-40de-81ce-c272c2d5b13f
✅ تمت إضافة صفحة `/admin/ads` لإدارة الإعلانات داخل هيكل لوحة الإدارة الجديد
✅ أصبح السايد بار يفتح إدارة الإعلانات الجديدة ويُبقي إعدادات الأداة القديمة على `/admin/tools`
✅ تم تحديث الإصدار إلى 0.2.14 وتحديث سجل النسخ
✅ تم نشر الإصدار 0.2.14 على Cloudflare Version ID: 937d6fe4-4735-420e-b77d-ece654d4eefb
✅ تم تحويل `/admin/ads` إلى جدول حملات متقدم مرتبط بـ `campaigns`
✅ تم دعم رفع صورة الإعلان إلى R2 من نافذة إضافة/تعديل الإعلان
✅ تم تحديث الإصدار إلى 0.2.15
⚠️ تم نشر قواعد Firestore للإصدار 0.2.15، لكن نشر Worker يحتاج إعادة محاولة لأن Wrangler علق بدون نتيجة
✅ تمت إضافة فلاتر إحصائيات الإعلانات في `/admin/ads`
✅ تم تحديث الإصدار إلى 0.2.16
⚠️ OpenNext build نجح للإصدار 0.2.16، لكن نشر Worker يحتاج إعادة محاولة لأن Wrangler علق بدون نتيجة
✅ تمت إضافة صفحة `/admin/identity` لإدارة الهوية البصرية داخل هيكل لوحة الإدارة الجديدة
✅ صفحة الهوية تحفظ حقول الهوية فقط: الاسم والوصف والإيميل واللوقو وfavicon والحقوق
✅ رفع اللوقو وfavicon في صفحة الهوية يستخدم Cloudflare R2 عبر `/api/media/upload`
✅ تم تحديث الإصدار إلى 0.2.17
✅ تم نشر الإصدار 0.2.17 على Cloudflare Version ID: 5d115ce5-a75f-42fb-8542-fa08ff6c6b2f
✅ تم تحسين حقول رفع اللوقو وfavicon في `/admin/identity` لتعرض معاينة مصغرة داخل نفس خانة الاختيار
✅ تم تحديث الإصدار إلى 0.2.18
✅ تم نشر الإصدار 0.2.18 على Cloudflare Version ID: 7f74ee6b-6722-4592-9edb-6583858bc348
✅ تم تحويل رسائل صفحة `/admin/identity` إلى Toast عائم أعلى يسار الشاشة
✅ تم تحديث الإصدار إلى 0.2.19
✅ تم نشر الإصدار 0.2.19 على Cloudflare Version ID: d52d8519-284e-4d3e-a9cd-fb122773caf7
✅ تمت إضافة صفحة `/admin/ad-settings` لإدارة إعدادات مواضع الإعلانات بعيدًا عن الحملات
✅ تم دعم مواضع الإعلانات الأربعة في `googleAdSlots`
✅ تم دعم مقتطف AdSense ومقتطف Ads.txt داخل `externalIntegrations`
✅ تمت إضافة route ديناميكي `/ads.txt` يقرأ مقتطف Ads.txt من إعدادات قاعدة البيانات
✅ تم تحديث الإصدار إلى 0.2.20
✅ تم نشر الإصدار 0.2.20 على Cloudflare Version ID: a2df03ff-6602-4b0e-b713-be0b6ee010f2
✅ تم تبسيط جدول `/admin/ad-settings` إلى أربعة أعمدة مع نقل تفاصيل كود Google إلى نوافذ إجراءات
✅ تم تحديث الإصدار إلى 0.2.21
✅ تم نشر الإصدار 0.2.21 على Cloudflare Version ID: f28b034a-3733-400d-9ab9-7ac5da50278e
✅ تمت إضافة صفحة `/admin/integrations` للربط الخارجي الآمن
✅ تم حذف سيكشن التكاملات من `/admin/tools` منعًا للتكرار
✅ بقي AdSense و Ads.txt داخل `/admin/ad-settings` فقط
✅ تم تحديث الإصدار إلى 0.2.22
✅ تم نشر الإصدار 0.2.22 على Cloudflare Version ID: 50c45500-f799-468e-b237-f60218c0e8c8
✅ تمت إعادة بناء `/admin/tools` بنمط الإدارة الحالي
✅ أصبحت إعدادات الأداة محصورة في الصفحات والروابط والسوشيال ميديا والأحداث فقط
✅ تم تحديث الإصدار إلى 0.2.23
✅ تم نشر الإصدار 0.2.23 على Cloudflare Version ID: d9f15483-6f0d-489b-b618-a5873fb23e36
✅ تم توحيد شكل أيقونات لوحة الإدارة وأزرار الإجراءات وحقول الرفع في النمط الحالي والقديم
✅ تم تحويل أرقام إحصائيات الإدارة والحملات إلى أرقام إنجليزية
✅ تم تحديث الإصدار إلى 0.2.24
✅ تم نشر الإصدار 0.2.24 على Cloudflare Version ID: ee732f31-bd57-49dc-a03f-921148dd7d92
✅ تم إعادة بناء بوابة المعلنين بنمط الإدارة الحالي ونص عربي صحيح
✅ تم إضافة رقم نسخة مستقل لبوابة المعلنين: 1.0.0
✅ تم ربط طلبات الإعلانات بالحملات الحالية ورفع صور الإعلانات إلى R2
✅ تم تصحيح قيم حالات الحملات في Firestore Rules
✅ تم تحديث الإصدار إلى 0.2.25
✅ تم نشر قواعد Firestore للإصدار 0.2.25
✅ تم نشر الإصدار 0.2.25 على Cloudflare Version ID: c35f1d11-3f86-4529-8a44-ca05f9ea969b
✅ تم تحسين كروت إحصائيات صفحة `/admin` بأربعة أعمدة وأيقونات خلفية شفافة
✅ تم تحديث الإصدار إلى 0.2.26
✅ تم نشر الإصدار 0.2.26 على Cloudflare Version ID: fa1f9f6c-43bd-4f4d-b7c0-c69c9e379636
```

---

## 10. المتبقي

### 0. إكمال صفحات قاعدة البيانات للإصدار 0.2.4

```txt
إنشاء الصفحات من لوحة الإدارة بالمسارات الدقيقة: privacy و terms و contact.
نسخ قوالب HTML التي يرسلها Codex في الرد داخل محرر الصفحات في لوحة الإدارة.
ضبط إيميل التواصل من قسم الهوية البصرية حتى يظهر بدل {{contactEmail}} في صفحة contact.
اختبار حفظ معرفات التكاملات الخارجية من لوحة الإدارة بجلسة مدير فعلية، ثم التأكد من ظهور السكربتات في المتصفح.
```

---

### 1. اختبار رفع الصور من لوحة الإدارة

بعد تسجيل الدخول كمدير، يجب اختبار رفع:

```txt
logo
favicon
ads top / middle / bottom1 / bottom2
```

ثم حفظ الأقسام والتأكد من ظهور الصور على الإنتاج. هذا الاختبار يحتاج جلسة مدير نشطة وملفات صور حقيقية.

كذلك يجب اختبار حفظ جدول الإعلانات فعليًا من لوحة الإدارة بعد تسجيل الدخول كمدير، لأن اختبار الإنتاج الحالي تحقق من تحميل الصفحات وأمان endpoint فقط.

يجب أيضًا اختبار صفحة `/admin/identity` بجلسة مدير فعلية عبر:

```txt
رفع لوقو حقيقي إلى R2.
رفع favicon حقيقي إلى R2.
تعديل إيميل التواصل والحقوق.
الضغط على حفظ الهوية.
التأكد من انعكاس القيم على الصفحة الرئيسية والفوتر والصفحات التي تستخدم {{contactEmail}}.
```

---

### 2. لوحة الإدارة

المتبقي من خطة الإدارة:

```txt
تقسيم app/admin/page.jsx إلى مكونات أصغر لاحقًا في مهمة منفصلة
تحسين محرر الصفحات
تحسين معاينة الصفحات
تحسين إدارة الإحصائيات
ربط جدول الإعلانات لاحقًا بنظام طلبات الإعلانات وإدارة العملاء والتذاكر
اختبار حفظ إعداد Google AdSense للإعلان العلوي من لوحة الإدارة بجلسة مدير فعلية، ثم التأكد من ظهوره تحت خانة اليوم بعد ترك خانة صورة إعلان أعلى الصفحة فارغة
اختبار صفحة `/admin/ad-settings` بجلسة مدير فعلية: حفظ مواضع الإعلانات، تفعيل Google عند غياب المعلنين، وإدخال مقتطف Ads.txt ثم اختبار `/ads.txt`.
مهم جدًا: بعد تحويل `/admin/ads` إلى `campaigns`، يجب لاحقًا ربط عرض الإعلانات في الصفحة الرئيسية بالحملات النشطة من `campaigns` بدل الاعتماد النهائي على `settings/main.adCampaigns`
```

تقسيم مقترح:

```txt
app/admin/components/AdminStats.jsx
app/admin/components/GeneralSettings.jsx
app/admin/components/EventsManager.jsx
app/admin/components/PagesManager.jsx
app/admin/components/SocialLinksManager.jsx
app/admin/components/SaveButton.jsx
```

---

### 3. بوابة المعلنين والدعم

المتبقي بعد تأسيس البوابة:

```txt
اختبار إنشاء حساب معلن فعلي من /client/register.
اختبار إنشاء حملة فعلية من /client/create-campaign.
اختبار ظهور الحملة في /client/dashboard لصاحبها فقط.
إضافة إدارة حملات Firestore داخل لوحة الإدارة بدل جدول adCampaigns المحلي فقط.
إضافة إدارة تذاكر support_tickets داخل لوحة الإدارة.
إضافة نظام مرفقات خاص وآمن للتذاكر بدل استخدام R2 العام.
تحديد سياسة تفعيل الحملات من الإدارة وربط الحملات المقبولة بمواقع الإعلان على الصفحة الرئيسية.
تفعيل Cloudflare Turnstile فعليًا لصفحات تسجيل/دخول/استعادة كلمة مرور الكلاينت بعد توفير صلاحية إنشاء Widget وSecret/Worker تحقق، وعدم الاكتفاء بواجهة شكلية.
```

---

### 4. مراجعة npm audit

ظهرت تحذيرات أمنية من npm.

لا تشغل مباشرة:

```powershell
npm audit fix --force
```

إلا بعد مراجعة أثره، لأنه قد يرفع حزم بإصدارات كاسرة.

---

## 11. ملاحظات مهمة للمستقبل

1. اسم Worker الصحيح هو:

```txt
datetools
```

لا تستخدم:

```txt
date-tools
```

إذا لم يكن موجودًا في Cloudflare.

2. لا تضف هذا flag إلى `wrangler.jsonc`:

```jsonc
"allow_eval_during_startup"
```

لأنه يسبب فشل تشغيل preview.

3. لا ترجع قراءة `config.json` من `layout.jsx` باستخدام `fs/path`.

4. لا تستورد Firebase مباشرة في ملفات قد تُنفذ داخل Cloudflare Worker.

5. لا تعتمد على نجاح `next build` وحده. المشروع يحتاج:

```powershell
npm run deploy
```

للنشر الفعلي على Cloudflare Workers.

6. عند ظهور 500 على Cloudflare، استخدم:

```powershell
npx wrangler tail datetools --format pretty
```

7. عند فشل Cloudflare في تثبيت الحزم، اختبر محليًا:

```powershell
npm ci
```

8. حل `www.date-tool.com` المعتمد هو:

```txt
DNS:
www CNAME date-tool.com Proxied

Worker Route:
www.date-tool.com/* → datetools
```

9. أي تعديل مهم يجب رفعه إلى GitHub:

```powershell
git add .
git commit -m "message"
git push origin master
```

10. لا تعيد إدخال `FIREBASE_SERVICE_ACCOUNT_JSON` إلا إذا كان الإدخال سيتم من ملف JSON صالح ومختبر. الوضع المعتمد حاليًا هو الأسرار المفصولة:

```txt
FIREBASE_SERVICE_ACCOUNT_EMAIL
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
```

11. تم بناء `/api/statistics` وإضافة SEO الأساسي و Canonical Redirect وتفعيل أسرار Firebase على Cloudflare وتنظيف Firebase Imports. تم تنظيم لوحة الإدارة الحالية بدون تقسيمها إلى ملفات، ويبقى التقسيم إلى مكونات أصغر مهمة لاحقة منفصلة عند طلبها. لا تعيد فتح كتابة عامة على `statistics/main` من المتصفح.

12. تخزين الصور عبر R2 مفعل حاليًا. الـ bucket المستخدم هو:

```txt
datetools-media
```

والـ binding المستخدم في Worker هو:

```txt
MEDIA_BUCKET
```

المسار العام `/api/media/{key}` مخصص للصور العامة فقط مثل logo وfavicon والإعلانات، وليس للتذاكر أو مرفقات خاصة.

13. بوابة المعلنين أضيفت داخل `app/client` وصفحة الدعم داخل `app/support`. لا تجعل `support_tickets` قابلة للكتابة مباشرة من المتصفح؛ المسار المعتمد هو `/api/support` من جهة الخادم. حملات المعلنين محفوظة في `campaigns` وقواعد Firestore الحالية تسمح لصاحب الحملة برؤيتها وتغيير حالتها المحددة فقط، بينما الإدارة تحتاج واجهة لاحقة لإدارة الحملات والتذاكر.

14. عند إصدار نسخة جديدة يجب تحديث `app/version.js` و `package.json` و `package-lock.json` و `VERSION_LOG.md` معًا، ثم توثيق الإصدار في هذه المذكرة.

15. صفحات `privacy` و `terms` و `contact` أزيلت عمدًا من `app` كملفات ثابتة. يجب إنشاؤها وإدارتها من لوحة الإدارة عبر `internalPages/customPages` بالمسارات نفسها. صفحة `contact` يمكن أن تستخدم المتغير:

```txt
{{contactEmail}}
```

ويتم ضبط قيمته من قسم الهوية البصرية في لوحة الإدارة.

16. قسم التكاملات الخارجية في لوحة الإدارة يقبل معرفات منظمة فقط مثل `G-...` و `GTM-...` و `ca-pub-...`. لا تضف حقل JavaScript خام إلا بعد مراجعة أمنية صريحة، لأنه يفتح باب XSS حتى لو كان الحفظ محصورًا بالمدير.
