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
الصفحات الثابتة تعمل.
صفحات slug تعمل.
النشر من GitHub إلى Cloudflare يعمل.
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
✅ npm run lint ينجح
✅ npm run build ينجح
```

---

## 10. المتبقي

### 1. Endpoint آمن للإحصائيات

تم إيقاف الكتابة المباشرة من المتصفح إلى:

```txt
statistics/main
```

المطلوب لاحقًا بناء API آمن أو Worker endpoint لتحديث الإحصائيات من جهة موثوقة، مع منع أي كتابة عامة مباشرة من المتصفح.

---

### 2. SEO

بعد حذف قراءة `config.json` من `layout.jsx`، يجب بناء SEO جديد مناسب لـ Cloudflare.

المطلوب لاحقًا:

```txt
app/sitemap.js
app/robots.js
Canonical URL
OpenGraph metadata
Twitter metadata
Metadata للصفحات الديناميكية
```

---

### 3. Canonical Redirect

حاليًا يعمل:

```txt
date-tool.com
www.date-tool.com
```

الأفضل تحديد نسخة واحدة رئيسية لتجنب تكرار المحتوى.

الاقتراح:

```txt
www.date-tool.com → date-tool.com
```

أو العكس، لكن يجب اختيار واحد فقط.

---

### 4. تنظيف Firebase Imports

يجب على Codex مراجعة هذه الملفات:

```txt
app/page.jsx
app/[slug]/PageClient.jsx
app/admin/page.jsx
app/admin_login/page.jsx
app/firebase.js
app/Header.jsx
app/Footer.jsx
```

القاعدة:

```txt
لا يتم تحميل Firebase Client SDK داخل Server Component أو Worker runtime.
أي استخدام Firebase يكون داخل Client Component أو dynamic import داخل useEffect.
```

---

### 5. لوحة الإدارة

المتبقي من خطة الإدارة:

```txt
تقسيم app/admin/page.jsx إلى مكونات أصغر
تحسين محرر الصفحات
تحسين معاينة الصفحات
التحقق من slug قبل الحفظ
منع تكرار slug
تحسين رسائل الخطأ والنجاح
تحسين إدارة الإحصائيات
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

### 6. إصلاح تحذير ESLint

ظهر التحذير:

```txt
The Next.js plugin was not detected in your ESLint configuration
```

هذا لا يمنع النشر، لكنه يحتاج تنظيف لاحقًا.

---

### 7. مراجعة npm audit

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

10. المرحلة القادمة الأفضل أن تبدأ ببناء endpoint آمن للإحصائيات ثم SEO ثم تنظيم لوحة الإدارة.

11. تم نشر `firestore.rules` على Firebase. المهمة القادمة المباشرة هي بناء endpoint آمن للإحصائيات. لا تعيد فتح كتابة عامة على `statistics/main` من المتصفح.
