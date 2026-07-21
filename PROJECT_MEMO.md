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
الإصدار الحالي للتطبيق هو 0.2.84.
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
48. تحسين رؤوس سكاشن صفحة `/admin/tools` بخلفيات ملوّنة حسب القسم، عنوان متوسط دائمًا، وبطاقات اختصار علوية بأيقونات ناعمة.
49. تحويل سكشن الصفحات في `/admin/tools` إلى عرض جدولي مضغوط برأس جدول بلون خلفية القسم.
50. تحويل سكاشن الروابط والسوشيال ميديا والأحداث في `/admin/tools` إلى جداول مضغوطة بأزرار إجراءات مناسبة.
51. تحسين هيدر الصفحة الرئيسية بترتيب اللوقو واسم الأداة والسلوقن داخل منطقة هوية وتحويل روابط الهيدر إلى شريط أفقي قابل للتمرير.
52. إضافة شريط جانبي مميز لكروت الأحداث بدل البوردر الثقيل مع تخفيف بوردرات أقسام الصفحة.
53. ضبط هيدر الصفحة الرئيسية ومحاذاة الشعار والاسم والسلوغن والأزرار، وإظهار أسهم الصفحات فقط عند وجود overflow، وإرجاع كروت الأحداث إلى بوردر يمين ملوّن بلون الحدث.
54. إنشاء ملف ترجمة مركزي للواجهة الرئيسية وتنظيف مشاكل الترميز والملفات غير المستخدمة.
55. إضافة Skeleton لامع وخفيف أثناء تحميل الصفحة الرئيسية بدل ظهور نصوص مؤقتة ثم اختفائها.
56. إضافة Shell عام للصفحات العامة حتى يبقى الهيدر والفوتر ثابتين، وإضافة صفحات أدوات الساعة والطقس.
57. إضافة بانر الساعة الحالية في صفحة الساعة وإضافة Hero تعريفي أعلى صفحة التاريخ.
58. توحيد قياسات السكاشن العامة في صفحات التاريخ والساعة والطقس، وإضافة Skeleton عام، وطلب موافقة صريح لاستخدام الموقع الحالي في الساعة والطقس.
59. تبسيط صفحة الساعة بإزالة كرت الوقت حسب المدينة، وتحويل أداة الساعة إلى 24→12 فقط، ونقل طلب الموقع إلى إشعار موافقة عند تحميل الصفحة.
60. تحسين إشعار موافقة الموقع في صفحة الساعة وتثبيت ارتفاع ونص بانر الساعة الحالية حتى لا يتحرك مع الثواني.
61. نقل طلب إذن الموقع إلى Shell عام يعمل تلقائيًا بعد تحميل الصفحات العامة، وإصلاح `Permissions-Policy` للسماح بـ geolocation من نفس الموقع فقط.
62. تحسين أدوات الساعة بزر استخدام وحقول ساعة/دقيقة منفصلة، وإضافة مواضع إعلانية للساعة والطقس مع نص تسويقي قابل للتحكم من الإدارة.
63. توحيد مواضع الإعلانات في صفحات التاريخ والساعة والطقس إلى ثلاثة مواضع لكل صفحة وربطها بمعرفات واضحة في لوحة التحكم.
64. ضبط وثيقة Firebase نفسها حتى تحفظ مواضع الإعلانات التسعة الجديدة فقط وتحذف مفاتيح التاريخ القديمة عند حفظ إعدادات الإعلانات.
65. ربط حفظ مفاتيح صور الإعلانات `adImages` بصفحة إعدادات الإعلانات حتى تصبح مواضع الصور في Firebase موحدة أيضًا.
66. تحسين جدول إعدادات الإعلانات بفصل تفعيل Google والنص التسويقي إلى عمودين مستقلين بتصميم أوضح.
67. تحسين صفحات القبول لدى AdSense بإخفاء إشعار الموقع تلقائيًا، منع صور الإعلانات المكسورة، وإضافة محتوى ونموذج تواصل أفضل للصفحات الأساسية.
68. تحسين واجهة الجوال لصفحة التاريخ بتوحيد بانرات الإعلانات، محاذاة الهيرو، تحسين نماذج الإدخال، تلوين زر الهجري، وتبسيط الأسئلة والفوتر.
69. إصلاح منطق عرض النص التسويقي في مواضع الإعلانات العامة حتى لا يظهر إلا عند تفعيل زر النص التسويقي، مع حصر Google بزر Google عند عدم وجود معلنين.
70. ضبط أولوية مواضع الإعلانات العامة في التاريخ والساعة والطقس: حملة عميل نشطة بصورة، ثم Google، ثم النص التسويقي فقط.
71. توحيد تصميم السكاشن التعريفية في صفحات التاريخ والساعة والطقس عبر قيم CSS مشتركة.
72. إضافة زر تبديل 12/24 في بانر الساعة الحالية وتحسين تسمية المدينة الحالية من إحداثيات المتصفح.
73. تحسين شكل بانر الساعة الحالية، تغيير أزرار الساعة إلى تحويل/احسب، وإزالة شريط أفكار الأدوات المؤجلة.
74. دمج مقاييس الطقس الأساسية داخل كرت الطقس الحالي وتأكيد اعتماد الطقس على إحداثيات المتصفح عند الموافقة.
75. حذف النص التعريفي من صفحة اتصل بنا وربط مرفقات نموذج التواصل برفع صور آمن إلى Cloudflare R2.
76. إزالة نص R2 التقني من مربع رفع الصورة في صفحة اتصل بنا حتى لا تظهر تفاصيل التخزين للعملاء.
77. إضافة قسم الأسئلة الشائعة إلى صفحات الساعة والطقس بنفس نمط قسم الأسئلة في صفحة التاريخ.
78. فصل إدارة أدوات الموقع بإضافة صفحة إدارة أدوات مستقلة ونقل أهم أحداث أداة التاريخ إليها، مع جعل حذف صفحات slug يحذف محتواها من Firebase صراحة.
79. إضافة إعدادات محتوى مستقلة لكل أداة لتعديل عنوان السكشن التعريفي والسلوغن وأسماء الأدوات الفرعية والأسئلة الشائعة من لوحة الإدارة.
80. إضافة إعدادات Link Preview داخل الهوية البصرية وربطها بوسوم المشاركة، مع إضافة زر رجوع من صفحات إعداد كل أداة إلى صفحة إدارة الأدوات.
81. ربط صورة Link Preview المخصصة برفع آمن إلى Cloudflare R2 بدل إدخال رابط يدوي فقط.
82. إضافة موافقة الخصوصية والكوكيز، حجب أدوات التحليلات/التسويق حتى الموافقة، ومنع تسريب تاريخ الميلاد أو البريد الإلكتروني عبر URL أو سجلات عامة أو إعلانات.
83. إضافة تحكم إداري بظهور زر إعدادات الخصوصية العائم حسب الصفحة، وتحسين دعم لصق تنسيقات Google Docs في محرر الصفحات.
84. إعادة محرر الصفحات لطريقة اللصق السابقة حتى تزال تنسيقات Google Docs الخارجية ويتناسق المحتوى تلقائيًا مع ستايل الموقع.
85. تحسين إشعار الموقع الحالي على الجوال ليظهر أسفل يمين الصفحة بحجم أصغر ويختفي تلقائيًا عند السحب أو التمرير.
86. تحسين أداء التحميل الآمن وصفحات روابط الفوتر الديناميكية مثل الخصوصية والشروط واتصل بنا لتظهر بشكل ممتاز على الشاشات الصغيرة.
87. تحسين تعداد صفحات الفوتر وإضافة دعم تثبيت الموقع كتطبيق جوال عبر PWA Manifest وزر تثبيت عند دعم المتصفح.
88. ربط اسم ووصف ولوقو التطبيق عند التثبيت بإعدادات الهوية المحفوظة من لوحة الإدارة.
89. تحسين وضوح نموذج اتصل بنا على الجوال وتقليل أحجام أدوات التاريخ على الشاشات الصغيرة.
90. توسيع صفحة اتصل بنا على الجوال وتحسين تباين حقولها مع تخفيف إضافي لخطوط أدوات التاريخ.
91. إضافة إدارة زر تثبيت الأداة ومنع تكرار رسالة الموقع وتحسين عرض نموذج التواصل.
92. إصلاح تمدد صفحة التواصل وتحسين ثبات Shell عند التنقل بين أدوات الموقع.
93. تحسين صفحة الطقس بزر الموقع الحالي ونسبة الهطول وصفوف توقعات مضغوطة للجوال.
94. جعل صفحة الطقس تبدأ بالموقع الحالي عند التحميل بدل عرض الرياض أولًا.
95. ضبط أيقونات PWA للتطبيق المثبت واختصارات أدوات التاريخ والساعة والطقس.
96. تحسينات PageSpeed آمنة بتأجيل تحميل Firebase Auth/App Check عن الواجهة العامة وإصلاح أسماء حقول الاختيار.
97. إضافة ربط PageSpeed Insights API داخل لوحة الإدارة عبر endpoint محمي للمدير.
98. إضافة Layout ثابت لمنصة الإدارة حتى يبقى السايد بار والناف بار ظاهرين عند التنقل، مع فلترة روابط السايد بار حسب صلاحيات المساعدين.
99. توحيد أحجام وهوية أزرار الإجراءات في أدوات التاريخ والساعة والطقس.
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

### الخطأ 11: فشل OpenNext deploy على Windows بخطأ spawn UNKNOWN

**الأعراض:**

```txt
npm run deploy بنى المشروع وولّد .open-next/worker.js بنجاح، ثم فشل في مرحلة OpenNext deploy مع:
Error: spawn UNKNOWN
داخل miniflare / getPlatformProxy
```

**السبب:**

```txt
تعطل مرتبط بتشغيل OpenNext/Miniflare على Windows أثناء محاولة قراءة Platform Proxy قبل نشر Worker.
OpenNext نفسه أظهر تحذيرًا أن Windows غير مدعوم بالكامل وقد تحدث أخطاء غير متوقعة.
```

**الحل:**

بعد نجاح مرحلة OpenNext build وتوليد `.open-next/worker.js` والأصول، تم نشر Worker مباشرة عبر Wrangler باستخدام إعداد المشروع:

```powershell
npx wrangler deploy --config wrangler.jsonc
```

**الحالة:**

```txt
تم الحل للإصدار 0.2.36 عبر النشر المباشر بWrangler بعد نجاح build
```

---

### الخطأ 12: المتصفح لا يطلب إذن الموقع بسبب Permissions-Policy

**الأعراض:**

```txt
إشعار الموقع يظهر داخل الصفحة، لكن المتصفح لا يفتح نافذة طلب الإذن تلقائيًا.
```

**السبب:**

كان `middleware.js` يرسل الهيدر التالي:

```txt
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

وهذا يمنع geolocation بالكامل، حتى لو استدعى الكود `navigator.geolocation.getCurrentPosition`.

**الحل:**

تم تعديل السياسة لتبقى صارمة، لكنها تسمح للموقع نفسه فقط بطلب الموقع:

```txt
Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=()
```

**الحالة:**

```txt
تم الحل في الإصدار 0.2.41
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

### اختبار تحويل سكشن الصفحات إلى جدول - الإصدار 0.2.28

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
✅ npm run build نجح وظهرت صفحة `/admin/tools` ضمن البناء.
✅ OpenNext build نجح بعد تشغيله بصلاحية موسعة بسبب قيود sandbox على ويندوز.
✅ تم نشر الإصدار 0.2.28 على Cloudflare.
✅ صفحة الإنتاج `/admin/tools` أعادت 200.
✅ Cloudflare Version ID: 84f9afc2-e4bf-49c4-aa3d-41c0269bfa8f
✅ تم تحسين هيدر الصفحة الرئيسية وجعل روابط الهيدر شريطًا أفقيًا قابلًا للتمرير
✅ تم تخفيف بوردرات أقسام الصفحة مع الحفاظ على تباين الوضع الفاتح
✅ تم إضافة شريط جانبي مميز لكروت الأحداث بدل البوردر الثقيل
✅ تم تحديث الإصدار إلى 0.2.31
✅ تم نشر الإصدار 0.2.30 على Cloudflare Version ID: 1efc19bc-4195-4b71-8fe6-530a2e90d204
✅ تم نشر الإصدار 0.2.31 على Cloudflare Version ID: 22335cab-3c15-4d93-9f5a-fbf59e8b4f96
✅ تم ضبط هيدر الصفحة الرئيسية ومحاذاة الشعار والاسم والسلوغن وأزرار اللغة/الوضع
✅ تم جعل أسهم شريط الصفحات تظهر فقط عند تجاوز عرض الروابط للشاشة وبدون خلفية
✅ تم إرجاع كروت الأحداث إلى بوردر يمين حقيقي يأخذ لون الحدث
✅ تم تحديث الإصدار إلى 0.2.32
✅ تم نشر الإصدار 0.2.32 على Cloudflare Version ID: 4411a5fd-8bc1-4cfa-8b60-39df8fdeda8c
✅ تم التحقق من https://date-tool.com/ وأعاد 200 وظهر v0.2.32 في الصفحة
✅ تم تحويل سكاشن الروابط والسوشيال ميديا والأحداث في `/admin/tools` إلى جداول مضغوطة
✅ تم ترتيب جدول الأحداث بعمود التفعيل أولًا ثم الأيقونة والاسم والتاريخ والتكرار وكود الأيقونة والإجراءات
✅ تم تحديث الإصدار إلى 0.2.29
✅ تم نشر الإصدار 0.2.29 على Cloudflare Version ID: 85915f7e-dd6e-42eb-a5b4-925365baa173
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/admin/tools/page.jsx
app/Header.jsx
app/components/home/HomeSections.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار تحسين رؤوس سكاشن إعدادات الأداة - الإصدار 0.2.27

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
✅ npm run build نجح وظهرت صفحة `/admin/tools` ضمن البناء.
✅ OpenNext build نجح بعد تشغيله بصلاحية موسعة بسبب قيود sandbox على ويندوز.
✅ تم نشر الإصدار 0.2.27 على Cloudflare.
✅ صفحة الإنتاج `/admin/tools` أعادت 200.
✅ Cloudflare Version ID: 029b520f-272f-4174-acc2-40bd977658bb
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
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

### اختبار ملف الترجمة وتنظيف المشروع - الإصدار 0.2.33

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/clock?v=0.2.42
curl.exe -I https://date-tool.com/weather?v=0.2.42
curl.exe -I https://date-tool.com/admin/ad-settings?v=0.2.42
npm run deploy
Invoke-WebRequest https://date-tool.com/?v=0.2.33
Invoke-WebRequest https://date-tool.com/ads.txt?v=0.2.33
```

النتيجة:

```txt
✅ تم إنشاء ملف ترجمة مركزي `app/i18n.js` لنصوص الصفحة الرئيسية والهيدر والفوتر وSEO.
✅ تم نقل نصوص المشاركة والأحداث وقصص التاريخ إلى ملف الترجمة بدل إبقائها داخل كود الصفحة.
✅ تم تنظيف ملفات وأصول غير مستخدمة من المشروع.
✅ تم تصحيح إدخالات الترميز المشوهة في `VERSION_LOG.md`.
✅ فحص الترميز لم يجد علامات mojibake في ملفات المشروع بعد التنظيف.
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهرت الصفحة الرئيسية وباقي المسارات ضمن البناء.
✅ تم نشر الإصدار 0.2.33 على Cloudflare.
✅ صفحة الإنتاج أعادت 200 وظهر رقم الإصدار 0.2.33.
✅ `/ads.txt` أعاد 200.
✅ Cloudflare Version ID: 0d12e075-d709-4c62-a162-9339430f7699
```

الملفات المتأثرة:

```txt
app/i18n.js
app/page.jsx
app/Header.jsx
app/Footer.jsx
app/layout.jsx
app/components/home/HomeSections.jsx
app/components/home/homeDateUtils.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
config.json
CLAUDE.md
logo.png
logo.svg
favicon.svg
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
```

### اختبار Skeleton تحميل الصفحة الرئيسية - الإصدار 0.2.34

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
Invoke-WebRequest https://date-tool.com/?v=0.2.34
Invoke-WebRequest https://date-tool.com/ads.txt?v=0.2.34
```

النتيجة:

```txt
✅ تم إضافة Skeleton لامع وخفيف أثناء تحميل الصفحة الرئيسية.
✅ لم يعد الهيدر والفوتر ومحتوى الصفحة يظهرون بقيم مؤقتة قبل اكتمال تحميل إعدادات الموقع.
✅ Skeleton يدعم الوضع الفاتح والمظلم.
✅ تم دعم prefers-reduced-motion بإيقاف الحركة لمن يفعّله.
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهرت الصفحة الرئيسية وباقي المسارات ضمن البناء.
✅ تم نشر الإصدار 0.2.34 على Cloudflare.
✅ صفحة الإنتاج أعادت 200 وظهر رقم الإصدار 0.2.34.
✅ `/ads.txt` أعاد 200.
✅ Cloudflare Version ID: a4309318-03d5-4539-9288-77fd73e7daed
```

الملفات المتأثرة:

```txt
app/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار توحيد الاستجابة لكل المنصات - الإصدار 0.2.35

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
Invoke-WebRequest https://date-tool.com/?v=0.2.35
Invoke-WebRequest https://date-tool.com/ads.txt?v=0.2.35
```

النتيجة:

```txt
✅ تم توحيد متغيرات قياسات الهيدر والسكيلتون في الصفحة الرئيسية.
✅ تم تصغير عنوان وسلوغن الهيدر للشاشات الصغيرة بدون تغيير الهوية العامة.
✅ تم إصلاح تعارض `.header h1` مع `.tool-title` الذي كان يمنع تطبيق مقاسات الجوال الصحيحة.
✅ تم حذف CSS إدارة قديم غير مستخدم من `globals.css`.
✅ تم تحسين نقاط الاستجابة في صفحات الإدارة الحالية والقديمة وبوابة الكلاينت.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run lint نجح بدون أخطاء.
✅ npm run build نجح وظهرت الصفحة الرئيسية والإدارة والكلاينت ضمن البناء.
✅ تم نشر الإصدار 0.2.35 على Cloudflare.
✅ صفحة الإنتاج أعادت 200 وظهر رقم الإصدار 0.2.35.
✅ `/ads.txt` أعاد 200.
✅ Cloudflare Version ID: 5dc52627-e705-4290-87b7-f67d9062f603
```

الملفات المتأثرة:

```txt
app/globals.css
app/admin/AdminDashboard.css
app/admin/AdminPage.css
app/client/ClientPortal.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار بانر الساعة وHero صفحة التاريخ - الإصدار 0.2.37

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/?v=0.2.37b
Invoke-WebRequest https://date-tool.com/clock?v=0.2.37b
```

النتيجة:

```txt
✅ تم إضافة بانر الساعة الحالية داخل صفحة /clock بنفس نمط شريط معلومات اليوم.
✅ تم إضافة Hero تعريفي أعلى صفحة التاريخ بنفس أسلوب Hero صفحة الساعة.
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح بعد تشغيله بصلاحية كاملة بسبب قيود Windows/sandbox.
✅ تم نشر الإصدار عبر npx wrangler deploy --config wrangler.jsonc.
✅ / و /clock أعادتا 200 وظهر رقم الإصدار 0.2.37.
✅ تحقق الإنتاج وجد نص "الساعة الآن" في صفحة /clock.
✅ Cloudflare Version ID: 329dce14-55d1-476d-8bfd-2fb05ed9fa96
```

الملفات المتأثرة:

```txt
app/clock/page.jsx
app/globals.css
app/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

### اختبار Shell أدوات الموقع وصفحات الساعة والطقس - الإصدار 0.2.36

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/?v=0.2.36
Invoke-WebRequest https://date-tool.com/clock?v=0.2.36
Invoke-WebRequest https://date-tool.com/weather?v=0.2.36
Invoke-WebRequest https://date-tool.com/ads.txt?v=0.2.36
```

النتيجة:

```txt
✅ تم إضافة SiteShell عام للصفحات العامة حتى يبقى الهيدر والفوتر ثابتين بين صفحات الأدوات.
✅ تم تغيير زر الرئيسية إلى التاريخ وإضافة الساعة والطقس في شريط الهيدر.
✅ تم إضافة صفحة /clock لأدوات الوقت: تحويل 24/12، الوقت حسب المدينة، وفرق التوقيت.
✅ تم إضافة صفحة /weather لأدوات الطقس اعتمادًا على Open-Meteo بدون مفاتيح سرية.
✅ npm run lint نجح بدون أخطاء.
✅ git diff --check لم يجد أخطاء whitespace، مع تحذيرات CRLF المعتادة على ويندوز فقط.
✅ npm run build نجح وظهرت /clock و /weather ضمن 21 صفحة.
⚠️ npm run deploy فشل في مرحلة OpenNext deploy بسبب خطأ Windows/Miniflare: spawn UNKNOWN.
✅ تم نشر الإصدار بنجاح عبر npx wrangler deploy --config wrangler.jsonc بعد نجاح build.
✅ / و /clock و /weather أعادت 200 وظهر رقم الإصدار 0.2.36.
✅ /ads.txt أعاد 200.
✅ Cloudflare Version ID: 2344ab93-b02d-4a0d-9fc9-2cd247b27854
```

الملفات المتأثرة:

```txt
app/SiteContext.jsx
app/SiteShell.jsx
app/Header.jsx
app/clock/page.jsx
app/weather/page.jsx
app/globals.css
app/i18n.js
app/layout.jsx
app/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار توحيد السكاشن والسكيلتون وموافقة الموقع - الإصدار 0.2.38

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx wrangler --version
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/?v=0.2.38
Invoke-WebRequest https://date-tool.com/clock?v=0.2.38
Invoke-WebRequest https://date-tool.com/weather?v=0.2.38
Browser check: https://date-tool.com/clock?v=0.2.38
Browser check: https://date-tool.com/weather?v=0.2.38
```

النتيجة:

```txt
✅ تم توحيد قياسات السكاشن والبطاقات العامة بين صفحات التاريخ والساعة والطقس عبر CSS variables.
✅ تم نقل Skeleton التحميل إلى SiteShell حتى يظهر قبل اكتمال إعدادات الموقع العامة.
✅ تم إضافة زر موافقة صريح لاستخدام الموقع الحالي في `/clock` و `/weather`.
✅ لا يتم طلب إذن الموقع تلقائيًا ولا يتم حفظ الإحداثيات في قاعدة البيانات.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح بصلاحية كاملة.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ / و /clock و /weather أعادت 200 وظهر رقم الإصدار 0.2.38.
✅ فحص المتصفح أكد ظهور زر "استخدام موقعي الحالي" في الساعة والطقس واختفاء `.shell-skeleton` بعد التحميل.
✅ Cloudflare Version ID: b141fca1-986a-449b-96a6-09de9d13e3f5
```

الملفات المتأثرة:

```txt
app/SiteContext.jsx
app/SiteShell.jsx
app/clock/page.jsx
app/weather/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار تبسيط صفحة الساعة وتنبيه الموقع - الإصدار 0.2.39

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/clock?v=0.2.39
Browser check: https://date-tool.com/clock?v=0.2.39
```

النتيجة:

```txt
✅ تم حذف كرت "الوقت حسب المدينة" من صفحة /clock.
✅ تم تحويل أداة الساعة إلى تحويل مباشر من 24 إلى 12 فقط بدون أزرار تبديل.
✅ تم تحسين حجم خانة إدخال الوقت ومنع بروزها خارج الكرت.
✅ تم نقل طلب الموقع إلى إشعار موافقة يظهر عند تحميل صفحة الساعة.
✅ تم جعل أيقونة Hero خلفية شفافة خلف النص بدل أيقونة مستقلة بارزة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ /clock أعادت 200 وظهر رقم الإصدار 0.2.39.
✅ فحص المتصفح أكد عدم وجود كرت المدينة، ووجود `.location-permission-toast`، واختفاء `.location-consent-card` من صفحة الساعة.
✅ Cloudflare Version ID: 35325539-20ee-41a5-bb22-b716f3e09fef
```

الملفات المتأثرة:

```txt
app/clock/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار إشعار الموقع وثبات بانر الساعة - الإصدار 0.2.40

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
Invoke-WebRequest https://date-tool.com/clock?v=0.2.40
```

النتيجة:

```txt
✅ تم تحسين إشعار الموقع في صفحة /clock بحيث يفحص حالة إذن الموقع في المتصفح قبل طلب الإذن.
✅ عند كون إذن الموقع مرفوضًا من المتصفح تظهر رسالة توضح ضرورة تغييره من أيقونة القفل بجانب الرابط.
✅ تم تصغير ارتفاع بانر الساعة الحالية وتثبيت عرض خانة الوقت حتى لا يتحرك النص مع تغير الثواني.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ /clock أعادت 200 وظهر رقم الإصدار 0.2.40.
✅ Cloudflare Version ID: a5d74276-91cd-4167-9308-86b2ee284927
⚠️ فحص المتصفح الآلي تعطل مرتين بسبب timeout في أداة المتصفح، لذلك تم الاكتفاء بتحقق HTTP والبناء والنشر.
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار طلب إذن الموقع العام - الإصدار 0.2.41

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/clock?v=0.2.41
curl.exe -I https://date-tool.com/weather?v=0.2.41
```

النتيجة:

```txt
✅ تم نقل طلب الموقع من صفحة /clock إلى SiteShell العام للصفحات العامة.
✅ أصبح طلب geolocation يبدأ تلقائيًا بعد تحميل الصفحة العامة واكتمال إعدادات الموقع.
✅ أصبح إشعار الموقع يظهر بعد نتيجة المتصفح فقط: نجاح أو رفض/منع.
✅ تم حذف رسالة/زر الموافقة اليدوي من /clock.
✅ تم حذف كرت الموافقة اليدوي من /weather، وأصبحت صفحة الطقس تحدث بياناتها تلقائيًا عند السماح بالموقع.
✅ تم إصلاح Permissions-Policy من geolocation=() إلى geolocation=(self).
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ /clock أعادت 200 وبالهيدر: permissions-policy: camera=(), microphone=(), geolocation=(self), payment=()
✅ /weather أعادت 200 وبالهيدر: permissions-policy: camera=(), microphone=(), geolocation=(self), payment=()
✅ Cloudflare Version ID: 1d9f7c66-ca25-4810-840d-71df4bc9f7c7
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/clock/page.jsx
app/weather/page.jsx
app/globals.css
middleware.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار أدوات الساعة ومواضع الإعلانات - الإصدار 0.2.42

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
```

النتيجة:

```txt
✅ تم تحويل إدخال الساعة إلى قائمتين: الساعة من 00 إلى 23، والدقيقة من 00 إلى 59.
✅ أصبحت نتيجة تحويل 24 إلى 12 تظهر بعد الضغط على زر استخدام فقط.
✅ أصبح فرق التوقيت يظهر بعد الضغط على زر استخدام فقط، ويتم تصفير النتيجة عند تغيير المدينة أو تحديث الموقع.
✅ الفقرات المعتمدة على الموقع في صفحة الساعة والطقس تستقبل `currentLocation` من SiteShell وتحدث نفسها بعد موافقة المتصفح.
✅ تمت إضافة مكون `PublicAdSlot` لعرض إعلان صورة/معلن من الإعدادات، أو Google fallback، أو نص تسويقي عند تفعيله من لوحة الإدارة.
✅ تمت إضافة 3 مواضع إعلانية لصفحة الساعة و3 مواضع إعلانية لصفحة الطقس.
✅ تمت توسعة `/admin/ad-settings` لتشمل مواضع الساعة والطقس وخيار النص التسويقي لكل موضع.
✅ تمت توسعة قوائم الحملات في لوحة الإدارة وبوابة العميل بمواضع الساعة والطقس.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ /clock أعادت 200.
✅ /weather أعادت 200.
✅ /admin/ad-settings أعادت 200.
✅ Cloudflare Version ID: 074c21b9-bb4e-4ddc-9e3b-4847cf0a8f74
⚠️ عرض حملات العملاء العامة مباشرة من `campaigns` يحتاج endpoint خادم لاحقًا، لأن قواعد Firestore تمنع القراءة العامة للحملات وهذا مطلوب أمنيًا.
```

الملفات المتأثرة:

```txt
app/components/PublicAdSlot.jsx
app/clock/page.jsx
app/weather/page.jsx
app/admin/ad-settings/page.jsx
app/admin/ads/page.jsx
app/client/create-campaign/page.jsx
app/firebase.js
app/api/statistics/route.js
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار توحيد مواضع إعلانات الأدوات - الإصدار 0.2.43

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
```

النتيجة:

```txt
✅ تم تحويل صفحة التاريخ إلى ثلاثة مواضع إعلانية موحدة: dateTop و dateMiddle و dateBottom.
✅ أصبحت صفحات التاريخ والساعة والطقس تعتمد نفس نمط المواضع: أعلى ووسط وأسفل.
✅ تمت إضافة توافق خلفي لقراءة إعدادات التاريخ القديمة top و middle و bottom1 و bottom2 حتى لا ينقطع العرض قبل إعادة الحفظ من لوحة الإدارة.
✅ تمت إضافة معرف كل موضع داخل جدول /admin/ad-settings.
✅ تمت تحديث قوائم الحملات في لوحة الإدارة وبوابة المعلنين لاستخدام معرفات المواضع الجديدة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ / و /clock و /weather و /admin/ad-settings أعادت 200.
✅ Cloudflare Version ID: cb7b4eae-09e2-4162-a8ff-65eec25c3ed0
```

الملفات المتأثرة:

```txt
app/components/PublicAdSlot.jsx
app/page.jsx
app/admin/AdminDashboard.css
app/admin/ad-settings/page.jsx
app/admin/ads/page.jsx
app/client/create-campaign/page.jsx
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار ضبط مواضع الإعلانات داخل Firebase - الإصدار 0.2.44

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
```

النتيجة:

```txt
✅ تم تعديل `defaultGoogleAdSlots` ليحتوي مواضع الأدوات التسعة فقط.
✅ تمت إضافة ترحيل داخلي يقرأ مفاتيح التاريخ القديمة ويحولها إلى dateTop/dateMiddle/dateBottom.
✅ تمت إضافة حذف صريح لمفاتيح top و middle و bottom1 و bottom2 من googleAdSlots و adImages عند حفظ الإعدادات في Firestore.
✅ تم حفظ إعدادات الإعلانات من جلسة المدير لتحديث وثيقة settings/main في Firebase.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم حفظ إعدادات الإعلانات من جلسة المدير بعد النشر.
✅ تم التحقق من Firestore: googleAdSlotsCount=9.
✅ Cloudflare Version ID: 2aabef59-2998-40c8-b014-988dd01c720a
```

الملفات المتأثرة:

```txt
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار توحيد مفاتيح صور الإعلانات داخل Firebase - الإصدار 0.2.45

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -s "https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main"
```

النتيجة:

```txt
✅ تمت إضافة حفظ `adImages` داخل صفحة `/admin/ad-settings`.
✅ تم نشر الإصدار 0.2.45 على Cloudflare.
✅ تم حفظ إعدادات الإعلانات من جلسة المدير بعد النشر.
✅ تم التحقق من Firestore: googleAdSlotsCount=9.
✅ تم التحقق من Firestore: adImagesCount=9.
✅ معرفات المواضع النهائية: dateTop و dateMiddle و dateBottom و clockTop و clockMiddle و clockBottom و weatherTop و weatherMiddle و weatherBottom.
✅ Cloudflare Version ID: 56a5c636-0266-4ad2-9f84-69e5472984f6
```

الملفات المتأثرة:

```txt
app/admin/ad-settings/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار تحسين جدول إعدادات الإعلانات - الإصدار 0.2.46

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.47
curl.exe -I https://date-tool.com/contact?v=0.2.47
curl.exe -I https://date-tool.com/about?v=0.2.47
curl.exe -I https://date-tool.com/privacy?v=0.2.47
curl.exe -I https://date-tool.com/terms?v=0.2.47
```

النتيجة:

```txt
✅ تم فصل خيار `إعلانات Google` وخيار `النص التسويقي` إلى عمودين مستقلين في جدول `/admin/ad-settings`.
✅ أصبحت أزرار التفعيل بطاقات تبديل منفصلة بأيقونة وحالة واضحة لكل موضع إعلان.
✅ تم تحسين عرض الجدول على الجوال بتوسعة عرض الجدول الأفقي بدل تكديس الخيارين داخل خلية واحدة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ /admin/ad-settings أعادت 200.
✅ / أعادت 200.
✅ Cloudflare Version ID: 9502acf8-9c69-405e-8230-5d6b045bf685.
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

---

### اختبار تحسين صفحات قبول AdSense - الإصدار 0.2.47

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
```

النتيجة:

```txt
✅ تم جعل إشعار رفض الموقع الجغرافي يختفي تلقائيًا بعد 8 ثواني.
✅ تم منع ظهور صورة إعلان مكسورة داخل `PublicAdSlot` واستبدالها بمربع إعلان منسق.
✅ تمت إضافة محتوى احتياطي غني لصفحات `about` و `privacy` و `terms` عند وجود محتوى قصير.
✅ تمت إضافة نموذج تواصل في صفحة `contact` يرسل إلى `/api/support` ونظام تذاكر الدعم الحالي.
✅ تم توثيق أن إدارة تذاكر الدعم من لوحة الإدارة تبقى مهمة مستقلة لاحقة لأنها تحتاج صفحة إدارة وصلاحيات قراءة `support_tickets`.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.47 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: c8a24b1b-b294-483c-b758-463dc903951a.
✅ صفحات `/` و `/contact` و `/about` و `/privacy` و `/terms` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/components/PublicAdSlot.jsx
app/[slug]/PageClient.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار تحسين واجهة الجوال وصفحة التاريخ - الإصدار 0.2.48

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.48
curl.exe -I https://date-tool.com/clock?v=0.2.48
```

النتيجة:

```txt
✅ تم توحيد عرض بانرات الإعلانات الفارغة أو التي تفشل صورها بنص تسويقي واحد وأيقونة خلفية منخفضة الشفافية.
✅ تم ضبط Hero صفحة التاريخ ليكون النص في المنتصف أفقيًا وعموديًا.
✅ تم تحسين نماذج إدخال أدوات التاريخ وعناوين الحقول، مع أحجام خطوط أصغر وأنسب للجوال.
✅ تم تمييز زر التقويم الهجري بتدرج أخضر عند اختياره.
✅ تم تبسيط قسم الأسئلة الشائعة بإزالة خلفية كرت الأسئلة وعلامات الاستفهام الزرقاء وتخفيف النصوص على الجوال.
✅ تم دمج رقم الإصدار في الفوتر بشكل أهدأ وأقل بروزًا.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.48 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 519c0455-e052-44c4-beff-805f1fd87e6b.
✅ صفحات `/` و `/clock` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/components/PublicAdSlot.jsx
app/components/home/HomeSections.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار إصلاح منطق عرض مواضع الإعلانات - الإصدار 0.2.49

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.49
```

النتيجة:

```txt
✅ تم منع ظهور النص التسويقي عند تعطيل زر النص التسويقي للموضع.
✅ أصبح إعلان Google يظهر فقط عند عدم وجود إعلان معلن صالح وعند تفعيل زر Google الخاص بالموضع.
✅ أصبح نص الحملة النشطة يظهر إذا كانت الحملة النصية لا تحتوي صورة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.49 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 859d2519-f8c9-4276-93bc-82333b9808a1.
✅ الصفحة الرئيسية رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/components/PublicAdSlot.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار ضبط أولوية مواضع الإعلانات العامة - الإصدار 0.2.50

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.50
curl.exe -I https://date-tool.com/clock?v=0.2.50
curl.exe -I https://date-tool.com/weather?v=0.2.50
```

النتيجة:

```txt
✅ تم ضبط أولوية العرض في مواضع الإعلانات العامة لكل من التاريخ والساعة والطقس.
✅ الأولوية الأولى الآن لحملة عميل نشطة داخل وقتها ولديها صورة إعلان فقط.
✅ إذا لم توجد حملة عميل صالحة، يظهر Google AdSense فقط عند تفعيل زر Google للموضع.
✅ إذا لم توجد حملة عميل صالحة ولم يكن Google مفعلًا، يظهر النص التسويقي فقط عند تفعيل زر النص التسويقي.
✅ تم منع عرض حملات العملاء النصية بدون صورة في المواضع العامة.
✅ تم إيقاف اعتماد الواجهة العامة على صور المواضع القديمة حتى لا تتجاوز نظام الحملات والأزرار الجديدة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.50 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 5dc02eea-ea5c-45a2-aac0-bb05fb1f9ad5.
✅ صفحات `/` و `/clock` و `/weather` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/components/PublicAdSlot.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار توحيد السكاشن التعريفية - الإصدار 0.2.51

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.51
curl.exe -I https://date-tool.com/clock?v=0.2.51
curl.exe -I https://date-tool.com/weather?v=0.2.51
```

النتيجة:

```txt
✅ تم توحيد تصميم السكاشن التعريفية `tools-hero` في صفحات التاريخ والساعة والطقس.
✅ تم نقل قيم الخلفية وحجم وشفافية الأيقونة إلى متغيرات CSS مشتركة.
✅ تم إزالة اعتماد صفحة التاريخ على تخصيص منفصل وجعل الساعة والطقس يرثان نفس القيم.
✅ تم الحفاظ على بطاقة الطقس الحالية `weather-current-card` خارج هذا التوحيد حتى لا يتغير تصميمها السلوكي.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.51 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 44854e8b-7c1e-4b24-8927-18a917f9489d.
✅ صفحات `/` و `/clock` و `/weather` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار تحسين بانر الساعة الحالية - الإصدار 0.2.52

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/clock?v=0.2.52
curl.exe -I https://date-tool.com/?v=0.2.52
```

النتيجة:

```txt
✅ تم إضافة زر خفيف داخل بانر الساعة الحالية للتبديل بين نظام 24 ساعة ونظام 12 ساعة.
✅ تم تثبيت عرض خانة الوقت حتى لا يتحرك النص عند تغير الثواني أو نظام العرض.
✅ تم تحسين تسمية المدينة الحالية عبر reverse geocoding من إحداثيات المتصفح بعد موافقة المستخدم.
✅ بقي حساب الوقت معتمدًا على المنطقة الزمنية التي يوفرها المتصفح لضمان توافق الوقت المحلي مع جهاز الزائر.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.52 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 84490522-f964-4c35-a53f-63bd04b0503d.
✅ صفحات `/clock` و `/` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/clock/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار تحسين شكل صفحة الساعة - الإصدار 0.2.53

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/clock?v=0.2.53
curl.exe -I https://date-tool.com/?v=0.2.53
```

النتيجة:

```txt
✅ تم تحسين توزيع بانر الساعة الحالية ليصبح أقل تباعدًا وأكثر اتزانًا على الجوال.
✅ تم دمج زر تبديل 12/24 داخل البانر بشكل أبسط وأصغر.
✅ تم تغيير زر تحويل الساعة من `استخدام` إلى `تحويل`.
✅ تم تغيير زر فرق التوقيت من `استخدام` إلى `احسب`.
✅ تم حذف شريط أفكار أدوات الساعة المؤجلة من أسفل الصفحة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ تم نشر الإصدار 0.2.53 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: b6410797-5813-4c24-8726-0fd84a720080.
✅ صفحات `/clock` و `/` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/clock/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار دمج مقاييس الطقس داخل كرت الطقس - الإصدار 0.2.54

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/weather?v=0.2.54
curl.exe -I https://date-tool.com/?v=0.2.54
```

النتيجة:

```txt
✅ تم دمج الرطوبة والرياح والأمطار وUV داخل كرت الطقس الحالي بدل عرضها في سيكشن منفصل.
✅ تم تنسيق المقاييس المدمجة بخلفية شفافة خفيفة لتتبع جمالية الكرت العلوي.
✅ صفحة الطقس ما زالت تستخدم `currentLocation` من المتصفح بعد الموافقة وتطلب التوقعات مباشرة بالإحداثيات.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح بعد إعادة التشغيل بمهلة أطول لأن التشغيل الأول انتهى بالمهلة.
✅ npx wrangler deploy --config wrangler.jsonc نجح بعد إعادة التشغيل بمهلة أطول لأن التشغيل الأول انتهى بالمهلة.
✅ تم نشر الإصدار 0.2.54 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: cdfa7014-5606-4893-80be-aea565db62c6.
✅ صفحات `/weather` و `/` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/weather/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار إعدادات محتوى الأدوات - الإصدار 0.2.59

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
npx wrangler versions list --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.59
curl.exe -I https://date-tool.com/clock?v=0.2.59
curl.exe -I https://date-tool.com/weather?v=0.2.59
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.2.59
curl.exe -I https://date-tool.com/admin/tool-management/clock?v=0.2.59
curl.exe -I https://date-tool.com/admin/tool-management/weather?v=0.2.59
```

النتيجة:

```txt
✅ تمت إضافة إعدادات `toolSettings` داخل إعدادات الموقع.
✅ يمكن الآن تعديل عنوان السكشن التعريفي والسلوغن وأسماء الأدوات الفرعية والأسئلة الإضافية لكل أداة.
✅ صفحة التاريخ تقرأ عنوان الهيرو والسلوغن وأسماء حساب العمر وتحويل التاريخ وحساب المدة من إعدادات الإدارة.
✅ صفحة الساعة تقرأ عنوان الهيرو والسلوغن وأسماء تحويل الساعة وفرق التوقيت من إعدادات الإدارة.
✅ صفحة الطقس تقرأ عنوان الهيرو والسلوغن وبعض أسماء أدوات الطقس من إعدادات الإدارة.
✅ صفحة `/admin/tool-management/date` تحتوي إعدادات محتوى أداة التاريخ مع إدارة أحداث التاريخ.
✅ تمت إضافة صفحات `/admin/tool-management/clock` و `/admin/tool-management/weather` لإعدادات محتوى الساعة والطقس.
✅ كروت إحصائيات صفحة `/admin` أصبحت تستخدم أسماء أدوات التاريخ القابلة للتعديل.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.59 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: e6c22fe0-9384-47c7-b4ef-50cc6f0b7e90.
✅ الصفحة الرئيسية و `/clock` و `/weather` وصفحات إدارة الأدوات الثلاث رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/toolSettings.js
app/firebase.js
app/page.jsx
app/clock/page.jsx
app/weather/page.jsx
app/components/home/HomeSections.jsx
app/admin/page.jsx
app/admin/tool-management/ToolContentSettings.jsx
app/admin/tool-management/page.jsx
app/admin/tool-management/date/page.jsx
app/admin/tool-management/clock/page.jsx
app/admin/tool-management/weather/page.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

المتبقي:

```txt
اختبار حفظ إعدادات محتوى كل أداة من جلسة مدير فعلية والتأكد من انعكاسها على صفحات الإنتاج.
توسيع ربط أسماء أدوات الطقس إذا أضيفت أدوات فرعية جديدة لاحقًا.
```

---

### اختبار Link Preview وزر رجوع إدارة الأدوات - الإصدار 0.2.60

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
npx wrangler versions list --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.60
curl.exe -I https://date-tool.com/admin/identity?v=0.2.60
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.2.60
curl.exe -I https://date-tool.com/admin/tool-management/clock?v=0.2.60
curl.exe -I https://date-tool.com/admin/tool-management/weather?v=0.2.60
curl.exe -I https://date-tool.com/contact?v=0.2.60
curl.exe -I https://date-tool.com/clock?v=0.2.60
```

النتيجة:

```txt
✅ تمت إضافة إعدادات `linkPreview` داخل صفحة `/admin/identity` ضمن الهوية البصرية.
✅ تمت إضافة معاينة بطاقة المشاركة مع عنوان ووصف واسم موقع وصورة مشاركة.
✅ يمكن استخدام عنوان الهوية والسلوغن واللوقو الحالي تلقائيًا أو كتابة قيم مخصصة للمعاينة.
✅ تم إزالة إعدادات Link Preview من `/admin/tools` حتى لا تتكرر في الإدارة العامة.
✅ `app/layout.jsx` يقرأ إعدادات Link Preview عبر Firestore REST بدون Firebase Client SDK وبدون fs/path/config.json.
✅ صفحات slug الديناميكية مثل `/contact` تستخدم عنوان الصفحة ووصفها مع إعدادات صورة واسم Link Preview من الهوية.
✅ تمت إضافة زر رجوع من صفحات `/admin/tool-management/date` و `/admin/tool-management/clock` و `/admin/tool-management/weather` إلى `/admin/tool-management`.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح. أثناء sandbox ظهرت تحذيرات اتصال Firestore بسبب منع الشبكة، لكن البناء اكتمل بنجاح.
✅ npx opennextjs-cloudflare build نجح خارج قيود الشبكة.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.60 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 5ae7a4a4-d064-4645-b7cc-ca5de00567d3.
✅ الصفحة الرئيسية و `/admin/identity` وصفحات إدارة الأدوات الثلاث و `/contact` و `/clock` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/linkPreview.js
app/firebase.js
app/layout.jsx
app/[slug]/page.jsx
app/admin/identity/page.jsx
app/admin/tool-management/ToolManagementShell.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

المتبقي:

```txt
اختبار حفظ إعدادات Link Preview من `/admin/identity` بجلسة مدير فعلية والتأكد من تحديث معاينة المشاركة في منصات السوشيال بعد تنظيف كاش المنصة عند الحاجة.
```

---

### اختبار ربط صورة Link Preview المخصصة بـ R2 - الإصدار 0.2.61

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
npx wrangler versions list --config wrangler.jsonc
curl.exe -I https://date-tool.com/admin/identity?v=0.2.61
curl.exe -I https://date-tool.com/?v=0.2.61
curl.exe -I https://date-tool.com/api/media/upload
curl.exe -X POST https://date-tool.com/api/media/upload
```

النتيجة:

```txt
✅ تمت إضافة فئة رفع جديدة `link-preview` في `/api/media/upload`.
✅ أصبحت صورة Link Preview المخصصة ترفع إلى R2 ثم تحفظ داخل `linkPreview.imageUrl`.
✅ عند اختيار صورة مخصصة يتم تعطيل استخدام اللوقو تلقائيًا حتى تظهر الصورة الجديدة في المعاينة.
✅ واجهة `/admin/identity` تعرض بطاقة اختيار ومعاينة لصورة المشاركة بدل حقل رابط يدوي فقط.
✅ endpoint الرفع بقي محميًا ويرفض POST بدون توكن مدير برسالة `unauthorized`.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح. أثناء sandbox ظهرت تحذيرات اتصال Firestore بسبب منع الشبكة، لكن البناء اكتمل بنجاح.
✅ npx opennextjs-cloudflare build نجح خارج قيود الشبكة.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.61 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 8a99f70d-4a03-4e9f-b2b9-f21d3d960f40.
✅ `/admin/identity` والصفحة الرئيسية رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/admin/AdminDashboard.css
app/api/media/upload/route.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

المتبقي:

```txt
اختبار رفع صورة Link Preview فعلية من `/admin/identity` بجلسة مدير، ثم الضغط على حفظ الهوية والتأكد من ظهور الرابط تحت `/api/media/link-preview/...`.
```

---

### اختبار إدارة الأدوات وحذف صفحات slug - الإصدار 0.2.58

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/?v=0.2.58
curl.exe -I https://date-tool.com/admin/tool-management?v=0.2.58
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.2.58
```

النتيجة:

```txt
✅ تم التأكد من عدم وجود مجلد `app/about` في المشروع.
✅ تم إيقاف المحتوى الاحتياطي الثابت لمسار `about` حتى تأتي صفحة "من نحن" من قاعدة البيانات فقط.
✅ تم إضافة رابط `إدارة الأدوات` في سايد بار لوحة الإدارة.
✅ تم إضافة صفحة `/admin/tool-management` كبوابة لإدارة أدوات الموقع.
✅ تم إضافة صفحة `/admin/tool-management/date` ونقل إدارة أهم أحداث أداة التاريخ إليها.
✅ تم إزالة سكشن الأحداث من صفحة `/admin/tools` لتبقى مخصصة للصفحات والروابط والسوشيال.
✅ تم تعديل حذف الصفحات في `/admin/tools` ليحذف محتوى slug من `customPages` في Firebase بعلامة `deleteField`.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build احتاج صلاحية شبكة لتحميل خط Cairo من Google Fonts ثم نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.58 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: ee5fe69d-db1e-4d47-88e9-60f562d929c4.
✅ الصفحة الرئيسية و `/admin/tool-management` و `/admin/tool-management/date` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/admin/tool-management/ToolManagementShell.jsx
app/admin/tool-management/page.jsx
app/admin/tool-management/date/page.jsx
app/admin/AdminDashboard.css
app/admin/page.jsx
app/admin/tools/page.jsx
app/admin/ads/page.jsx
app/admin/ad-settings/page.jsx
app/admin/identity/page.jsx
app/admin/integrations/page.jsx
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

المتبقي:

```txt
اختبار حذف صفحة فعلية من `/admin/tools` بجلسة مدير للتأكد من اختفائها من Firebase والفوتر.
اختبار حفظ أحداث أداة التاريخ من `/admin/tool-management/date` بجلسة مدير والتأكد من ظهورها في صفحة التاريخ.
لاحقًا: نقل إعدادات مستقلة للساعة والطقس إلى إدارة الأدوات عند تحديدها.
```

---

### اختبار إضافة الأسئلة الشائعة للساعة والطقس - الإصدار 0.2.57

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/clock?v=0.2.57
curl.exe -I https://date-tool.com/weather?v=0.2.57
curl.exe -I https://date-tool.com/contact?v=0.2.57
```

النتيجة:

```txt
✅ تم إضافة مكون مشترك `ToolFaqSection` لعرض الأسئلة الشائعة بنفس نمط صفحة التاريخ.
✅ تم إضافة أسئلة شائعة لصفحة `/clock` حول تحويل 24/12، استخدام الموقع الحالي، وفرق التوقيت.
✅ تم إضافة أسئلة شائعة لصفحة `/weather` حول مصدر بيانات الطقس، الموقع الحالي، واختلاف النتائج بين المصادر.
✅ تم حذف النص التقني الخاص بـ R2 من مربع رفع الصورة في صفحة `contact`.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.57 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: 3bb8e312-e90e-4154-8a07-665f49cb8ddb.
✅ صفحات `/clock` و `/weather` و `/contact` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/components/ToolFaqSection.jsx
app/clock/page.jsx
app/weather/page.jsx
app/[slug]/PageClient.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار حذف نص R2 من واجهة التواصل - الإصدار 0.2.56

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
```

النتيجة:

```txt
✅ تم حذف نص "ترفع الصورة إلى R2 مع التذكرة بعد الإرسال" من مربع رفع الصورة في صفحة اتصل بنا.
✅ بقي رفع الصورة إلى R2 يعمل من الخلفية بدون كشف تفاصيل التخزين للعميل.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
ℹ️ لم يتم نشر 0.2.56 منفردًا لأن طلب إضافة الأسئلة الشائعة وصل قبل النشر، وسيتم نشر التغييرات ضمن 0.2.57.
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار حذف نص التواصل وربط مرفق R2 - الإصدار 0.2.55

تم تشغيل:

```powershell
npm run lint
git diff --check
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --config wrangler.jsonc
curl.exe -I https://date-tool.com/contact?v=0.2.55
curl.exe -I https://date-tool.com/?v=0.2.55
```

النتيجة:

```txt
✅ تم حذف النص التعريفي من صفحة `contact` والإبقاء على نموذج التواصل فقط.
✅ تم تحويل حقل رابط الصورة إلى اختيار ملف صورة من الجهاز.
✅ نموذج التواصل يرسل `FormData` إلى `/api/support` بدل JSON عند وجود مرفق.
✅ `/api/support` يتحقق من نوع الصورة وحجمها ثم يرفعها إلى R2 تحت مسار `support/...`.
✅ يتم حفظ `attachmentKey` و `attachmentName` و `attachmentContentType` و `attachmentSize` داخل مستند التذكرة.
✅ مرفقات الدعم لا تُعرض عبر `/api/media` العام لأن فئة `support` ليست ضمن الفئات العامة.
✅ npm run lint نجح.
✅ git diff --check نجح، مع تحذيرات CRLF المعتادة على Windows فقط.
✅ npm run build نجح.
✅ npx opennextjs-cloudflare build نجح.
✅ npx wrangler deploy --config wrangler.jsonc نجح.
✅ تم نشر الإصدار 0.2.55 على Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: cd96d81b-a732-4540-8d81-a9a49447e5f3.
✅ صفحات `/contact` و `/` رجعت HTTP 200 بعد النشر.
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/api/support/route.js
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تنظيف بيانات Firestore القديمة وربط الحملات الحديثة - الإصدار 0.2.62

الأعراض:

```txt
بقيت بيانات قديمة في `settings/main` بعد حذفها أو نقلها من المنصة، مثل `customPages.about` و `adCampaigns` القديم و `pages` وحقل `toolSlogan ` المكرر بمسافة.
كان العرض العام للإعلانات يعتمد على حقل `settings/main.adCampaigns` القديم، بينما إدارة الحملات الحديثة تحفظ في collection `campaigns`.
```

السبب:

```txt
بعض الحقول كانت انتقالية من النظام القديم ولم تكن تزال عند الحفظ.
Firebase CLI المتاح لا يوفر أمرًا مباشرًا لحذف حقول داخل وثيقة واحدة بدون حذف الوثيقة كاملة.
```

الحل:

```txt
إضافة `/api/public-campaigns` لقراءة الحملات النشطة من collection `campaigns` عبر Service Account وإرجاع بيانات العرض العامة فقط.
ربط `SiteShell` بالحملات الحديثة ودمجها داخل `configData.adCampaigns` لاستخدامها في كل الأدوات.
تعديل `app/firebase.js` حتى لا يعيد حفظ الحقول القديمة ويحذفها تلقائيًا عند أي حفظ إداري.
إضافة `/api/admin/cleanup` كتنظيف إداري محمي بجلسة مدير فعالة ويحذف فقط قائمة ثابتة من الحقول القديمة.
إضافة زر "تنظيف Firebase" في `/admin/tools` لتنفيذ التنظيف من الواجهة دون كشف أي token أو سر.
```

الحالة:

```txt
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build بسبب منع الشبكة في بيئة sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
⚠️ لم يتم تنفيذ الحذف الحي بعد؛ يجب الضغط على زر "تنظيف Firebase" من `/admin/tools` بعد النشر بجلسة مدير فعالة.
```

الأوامر المستخدمة:

```powershell
Get-Content -TotalCount 120 PROJECT_MEMO.md
git status --short
Get-Content -Raw .firebaserc
Get-Content -Raw firebase.json
rg -n "deleteField|deleteDoc|deleteObject|remove|customPages|internalPages|support_tickets|campaigns|settings/main|toolSettings|events|linkPreview|googleAdSlots|adPlacements|marketing" app firestore.rules
Invoke-RestMethod -Uri 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main'
npx firebase-tools --version
npx firebase-tools login:list
npx firebase-tools --help
npm run lint
npm run build
npm run deploy
curl.exe -s https://date-tool.com/api/public-campaigns
curl.exe -s -o NUL -w "%{http_code}" -X POST https://date-tool.com/api/admin/cleanup
curl.exe -I https://date-tool.com/admin/tools?v=0.2.62
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/api/admin/cleanup/route.js
app/api/public-campaigns/route.js
app/admin/AdminDashboard.css
app/admin/tools/page.jsx
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### موافقة الخصوصية ومنع تسريب البيانات الحساسة - الإصدار 0.2.63

الأعراض:

```txt
نصوص صفحات الخصوصية الجديدة تذكر التحكم في الخصوصية والكوكيز من الموقع أو المتصفح.
كان يلزم إشعار موافقة فعلي، وحجب أدوات التحليلات/التسويق قبل الموافقة.
كان يلزم التأكد برمجيًا من عدم خروج تاريخ الميلاد أو البريد الإلكتروني إلى URL أو query string أو أسماء أحداث Google Analytics أو عنوان الصفحة أو معلمات الإعلانات أو سجلات الأخطاء العامة.
كان محرر محتوى الصفحات يحتاج دعم لصق نصوص منسقة من Google Docs ومحررات النصوص.
```

السبب:

```txt
التكاملات الخارجية كانت تقرأ الإعدادات وتحقن بعض السكربتات مباشرة بعد تحميل الموقع.
روابط المشاركة كانت تستخدم window.location.href وقد تحمل query string.
بعض سجلات الأخطاء العامة كانت تطبع كائن الخطأ كاملًا.
محرر الصفحات كان textarea عاديًا لا يحافظ على البنية المنسقة عند اللصق.
```

الحل:

```txt
إضافة app/privacyConsent.js لإدارة موافقة الخصوصية في localStorage وإطلاق حدث تحديث للمكونات.
إضافة إشعار موافقة في SiteShell مع خيارات ضرورية/تحليلات/تسويق وزر دائم لإعادة فتح إعدادات الخصوصية من الموقع.
حجب Google Analytics وGTM وClarity حتى موافقة التحليلات، وحجب Meta Pixel وAdSense حتى موافقة التسويق.
تعديل روابط المشاركة لتستخدم origin + pathname فقط بدون query string.
تقليل سجلات الأخطاء العامة في endpoints العامة وصفحات الكلاينت حتى لا تطبع payload أو كائنات خطأ كاملة.
تحويل محرر محتوى الصفحات في /admin/tools إلى محرر contentEditable يقبل HTML منسقًا وينظفه عبر sanitizeHtml قبل الحفظ.
```

الحالة:

```txt
✅ تم تنفيذ التعديلات محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.63 على Cloudflare Version ID: 178e9e28-40a6-4ae0-8b1e-b2cd969fb177.
✅ تم اختبار الصفحة الرئيسية وصفحة `/admin/tools` على الإنتاج ورجعت HTTP 200.
✅ تم اختبار `/api/public-campaigns` على الإنتاج ورجع `{ ok: true, campaigns: [] }`.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "tools-rich-editor|privacy-consent|PRIVACY_CONSENT|External integrations were skipped|getSafeCurrentUrl|console\.error\(|console\.warn\(" app PROJECT_MEMO.md package.json app/version.js VERSION_LOG.md
git status --short
npm version 0.2.63 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.63
curl.exe -I https://date-tool.com/admin/tools?v=0.2.63
curl.exe -s https://date-tool.com/api/public-campaigns
```

الملفات المتأثرة:

```txt
app/privacyConsent.js
app/SiteContext.jsx
app/SiteShell.jsx
app/components/ExternalIntegrations.jsx
app/components/PublicAdSlot.jsx
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/globals.css
app/page.jsx
app/api/support/route.js
app/api/statistics/route.js
app/api/public-campaigns/route.js
app/api/admin/cleanup/route.js
app/client/create-campaign/page.jsx
app/client/dashboard/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### التحكم بزر إعدادات الخصوصية وتحسين محرر الصفحات - الإصدار 0.2.64

الأعراض:

```txt
زر إعدادات الخصوصية العائم كان يظهر في كل الصفحات بعد الموافقة ولا يمكن التحكم بمكان ظهوره من الإدارة.
خلفية زر وإشعار الخصوصية كانت تبدو شفافة وتتداخل بصريًا مع محتوى الصفحة.
محرر محتوى الصفحات كان لا يحافظ بما يكفي على تنسيقات النصوص الملصوقة من Google Docs.
```

السبب:

```txt
لم يكن يوجد حقل إعدادات يحدد الصفحات المسموح بظهور زر الخصوصية فيها.
CSS كان يستخدم خلفيات شفافة/متغيرة لإشعار الخصوصية والزر العائم.
sanitizeHtml كان يحذف كل style بالكامل، وهذا يحمي الصفحة لكنه يزيل كثيرًا من تنسيقات Google Docs المفيدة.
```

الحل:

```txt
إضافة privacySettingsButton إلى إعدادات الموقع مع enabled وقائمة pages.
إضافة سيكشن صغير في /admin/tools لتفعيل زر إعدادات الخصوصية واختيار صفحات ظهوره.
تعديل SiteShell حتى لا يظهر الزر العائم إلا بعد الموافقة وعند تفعيل الإعداد ووجود الصفحة الحالية ضمن القائمة.
جعل خلفية إشعار الخصوصية والزر العائم صلبة وواضحة في الوضعين الفاتح والداكن.
توسيع sanitizeHtml ليحافظ على خصائص تنسيق آمنة من Google Docs مثل اللون والمحاذاة والحجم والقوائم مع منع JavaScript والروابط والأنماط الخطرة.
```

الحالة:

```txt
✅ تم تنفيذ التعديلات محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.64 على Cloudflare Version ID: f63df789-1b4f-4f14-b7fb-6932d71a92a5.
✅ تم اختبار الصفحة الرئيسية وصفحة `/admin/tools` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md
git status --short
Select-String -Path app\admin\tools\page.jsx -Pattern "function pickToolsConfig|function PageHtmlEditor|const saveTools|tools-quick-grid|section className" -Context 3,12
Select-String -Path app\SiteShell.jsx -Pattern "privacyConsent|privacy-settings-button|isSiteLoading|function timezoneLabel|const contextValue" -Context 3,8
Select-String -Path app\globals.css -Pattern "privacy-consent-panel|privacy-settings-button|privacy-secondary" -Context 0,18
Select-String -Path app\admin\AdminDashboard.css -Pattern "tools-rich-editor|tools-section-card|tools-quick-grid" -Context 0,12
npm run lint
npm version 0.2.64 --no-git-tag-version
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.64
curl.exe -I https://date-tool.com/admin/tools?v=0.2.64
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/globals.css
app/sanitizeHtml.js
app/firebase.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إعادة لصق الصفحات ليتناسق مع ستايل الموقع - الإصدار 0.2.65

الأعراض:

```txt
بعد تحسين دعم Google Docs أصبح محرر الصفحات يحتفظ ببعض inline styles القادمة من المحررات الخارجية.
هذا جعل بعض النصوص الملصوقة لا تتناسق تلقائيًا مع هوية الموقع كما كانت في النسخة السابقة.
```

السبب:

```txt
الإصدار 0.2.64 وسّع sanitizeHtml للسماح بخصائص CSS آمنة من Google Docs.
رغم أن ذلك كان آمنًا من ناحية JavaScript، لكنه سمح للنصوص بجلب ألوان وأحجام وتباعدات لا تطابق تصميم الموقع.
```

الحل:

```txt
إرجاع sanitizeHtml إلى إزالة attribute style من المحتوى الملصوق.
إرجاع PageHtmlEditor إلى طريقة اللصق السابقة التي تحفظ بنية HTML النظيفة فقط.
الإبقاء على زر إعدادات الخصوصية الجديد كما هو دون تغيير.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.65 على Cloudflare Version ID: 5ec301fc-9e53-48e5-a4ee-fc894317b875.
✅ تم اختبار الصفحة الرئيسية وصفحة `/admin/tools` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md
git status --short
Get-Content app\sanitizeHtml.js
Get-Content app\admin\tools\page.jsx
npm version 0.2.65 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.65
curl.exe -I https://date-tool.com/admin/tools?v=0.2.65
```

الملفات المتأثرة:

```txt
app/admin/tools/page.jsx
app/sanitizeHtml.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين إشعار الموقع الحالي على الجوال - الإصدار 0.2.66

الأعراض:

```txt
إشعار تعذر استخدام الموقع الحالي كان يظهر أعلى الشاشة بحجم كبير نسبيًا على الجوال.
الإشعار كان قد يغطي جزءًا من محتوى صفحة الساعة أثناء القراءة أو السحب.
```

السبب:

```txt
تنسيق إشعار الموقع كان موحدًا بين سطح المكتب والجوال.
لم يكن هناك سلوك يخفي الإشعار مباشرة عند تمرير الصفحة أو السحب.
```

الحل:

```txt
إضافة تنسيق responsive يجعل إشعار الموقع الحالي أصغر وأسفل يمين الشاشة على الشاشات الصغيرة.
إضافة مستمع scroll و touchmove في SiteShell لإخفاء الإشعار تلقائيًا عند أول تمرير أو سحب.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.66 على Cloudflare Version ID: 29a1ab67-4d1d-4167-9d83-6fda34f515d7.
✅ تم اختبار صفحة `/clock` والصفحة الرئيسية على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md
Select-String -Path app\SiteShell.jsx -Pattern "locationNotice|location-permission-toast|setLocationNotice|scroll" -Context 3,8
Select-String -Path app\globals.css -Pattern "location-permission-toast" -Context 0,24
git status --short
npm version 0.2.66 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/clock?v=0.2.66
curl.exe -I https://date-tool.com/?v=0.2.66
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين أداء التحميل وصفحات روابط الفوتر - الإصدار 0.2.67

الأعراض:

```txt
روابط الفوتر الديناميكية مثل الخصوصية والشروط واتصل بنا كانت تستخدم قالب صفحة قديم يعتمد على inline styles وكرت عام.
على الشاشات الصغيرة لم تكن محاذاة العنوان وزر الرجوع ونصوص الصفحات ونموذج التواصل بنفس جودة صفحات الأدوات الحديثة.
تقرير PageSpeed أشار إلى فرص تحسين أداء التحميل، خصوصًا الموارد التي قد تؤثر على الرسم الأولي.
```

السبب:

```txt
قالب PageFrame في app/[slug]/PageClient.jsx لم يكن مربوطًا بكلاسات تصميم مخصصة للصفحات النصية.
ملف Font Awesome كان محملًا كرابط CSS داخل head، وهذا يجعله موردًا حاجبًا للرسم.
تكاملات التحليلات والتسويق كانت تستورد Firebase عند أول تحميل حتى قبل موافقة المستخدم.
```

الحل:

```txt
تحويل قالب صفحات slug إلى بنية semantic بكلاسات static-page-* بدل inline styles.
إضافة Skeleton خفيف لصفحات slug أثناء التحميل.
تحسين CSS صفحات الفوتر: عنوان متجاوب، زر رجوع مناسب للجوال، عرض نصي منضبط، كسر الروابط الطويلة، وتحسين نموذج اتصل بنا.
نقل Font Awesome إلى مكون عميل يتم تحميله بعد تفاعل الصفحة بدل رابط CSS داخل head.
نقل Google/Bing verification إلى metadata السيرفر.
منع تحميل Firebase الخاص بالتكاملات الخارجية إلا بعد وجود موافقة analytics أو marketing.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.67 على Cloudflare Version ID: 66cfa0b9-0d23-4c72-96e7-d5a895fa91fa.
✅ تم اختبار الصفحة الرئيسية و `/privacy` و `/terms` و `/contact` على الإنتاج ورجعت HTTP 200.
⚠️ تعذر الاعتماد على PageSpeed API داخل هذه الجلسة بسبب حد/منع الوصول، لذلك تم تنفيذ التحسينات الآمنة بناءً على التقرير والرؤية البرمجية.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw -Encoding UTF8 PROJECT_MEMO.md
git status --short
Select-String -LiteralPath 'app\[slug]\PageClient.jsx' -Pattern 'function PageFrame' -Context 0,70
Select-String -Path app\globals.css -Pattern 'static-rich-page|contact-page-form|contact-form-grid|contact-upload' -Context 0,8
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.67
curl.exe -I https://date-tool.com/privacy?v=0.2.67
curl.exe -I https://date-tool.com/terms?v=0.2.67
curl.exe -I https://date-tool.com/contact?v=0.2.67
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/globals.css
app/components/ExternalIntegrations.jsx
app/components/FontAwesomeLoader.jsx
app/layout.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين تعداد صفحات الفوتر وإضافة تثبيت التطبيق - الإصدار 0.2.68

الأعراض:

```txt
التعدادات داخل صفحات روابط الفوتر مثل `/terms` كانت تظهر بخلفية مختلفة عن كرت الصفحة.
الموقع لم يكن يملك Web App Manifest وأيقونات PWA ثابتة تتيح تثبيته كتطبيق على الجوالات والمتصفحات الداعمة.
```

السبب:

```txt
تنسيق `ul/ol` داخل صفحات slug كان يضيف خلفية ناعمة مستقلة لكل قائمة.
نصوص Google Docs قد تضيف غلافًا داخليًا مثل `b#docs-internal-guid` يجعل التعدادات والنصوص أثقل من المطلوب.
لم يكن هناك manifest route أو أيقونات PWA محلية أو زر تثبيت مرتبط بحدث beforeinstallprompt.
```

الحل:

```txt
إزالة الخلفية المستقلة من قوائم صفحات slug مع الإبقاء على نقاط القائمة بلون الهوية.
إضافة قاعدة تمنع غلاف Google Docs الداخلي من فرض bold على كامل المحتوى.
إضافة `app/manifest.js` مع بيانات التطبيق والاختصارات وأيقونات 192/512/maskable.
إضافة أيقونات PWA ثابتة داخل `public`.
إضافة مكون `PwaInstallPrompt` يظهر زر تثبيت فقط عند دعم المتصفح للتثبيت ويختفي بعد التثبيت أو الإخفاء.
ربط metadata في `layout.jsx` بملف manifest ودعم Apple Web App.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.68 على Cloudflare Version ID: fa495716-3b7d-41f6-a671-9183611cc333.
✅ تم اختبار `/terms?v=0.2.68` على الإنتاج ورجع HTTP 200.
✅ تم اختبار `/manifest.webmanifest` على الإنتاج ورجع `application/manifest+json`.
✅ تم اختبار `/pwa-icon-192.png` و `/pwa-icon-512.png` على الإنتاج ورجعت `image/png`.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw -Encoding UTF8 PROJECT_MEMO.md
Get-Content -Raw -Encoding UTF8 app\layout.jsx
Get-Content -Raw -Encoding UTF8 app\SiteShell.jsx
npm version 0.2.68 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/terms?v=0.2.68
curl.exe -I https://date-tool.com/manifest.webmanifest
curl.exe -I https://date-tool.com/pwa-icon-192.png
curl.exe -I https://date-tool.com/pwa-icon-512.png
curl.exe -s https://date-tool.com/manifest.webmanifest
```

الملفات المتأثرة:

```txt
app/manifest.js
app/components/PwaInstallPrompt.jsx
app/SiteShell.jsx
app/globals.css
app/layout.jsx
app/version.js
public/pwa-icon-192.png
public/pwa-icon-512.png
public/pwa-maskable-512.png
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### ربط هوية التطبيق المثبت بإعدادات الإدارة - الإصدار 0.2.69

الأعراض:

```txt
بعد إضافة خاصية تثبيت الموقع كتطبيق، كان اسم التطبيق وأيقونته داخل `manifest.webmanifest` ثابتين من الكود.
المطلوب أن يأخذ التثبيت اسم الأداة واللوقو الأساسي من صفحة الإدارة/الهوية.
```

السبب:

```txt
ملف `app/manifest.js` كان يعرض name و short_name و description و icons بقيم ثابتة.
لم يكن يقرأ وثيقة `settings/main` من Firestore كما يفعل `layout.jsx` لبيانات الهوية وLink Preview.
```

الحل:

```txt
تحويل `app/manifest.js` إلى دالة async تقرأ `toolDisplayName` و `toolSlogan` و `logoUrl` من Firestore.
استخدام اسم الأداة المحفوظ كـ name و short_name للتطبيق المثبت.
استخدام السلوغن المحفوظ كوصف للتطبيق المثبت.
إدراج اللوقو الأساسي المحفوظ من الإدارة كأول أيقونات manifest مع إبقاء أيقونات PWA المحلية كاحتياط.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.69 على Cloudflare Version ID: a734fee2-2886-49dc-b51f-bc0aa388374e.
✅ تم اختبار `/manifest.webmanifest` على الإنتاج ورجع الاسم والوصف واللوقو من إعدادات الإدارة.
✅ تم اختبار الصفحة الرئيسية على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw -Encoding UTF8 PROJECT_MEMO.md
Get-Content -Raw -Encoding UTF8 app\manifest.js
Get-Content -Raw -Encoding UTF8 app\layout.jsx
npm version 0.2.69 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -s https://date-tool.com/manifest.webmanifest
curl.exe -I https://date-tool.com/manifest.webmanifest
curl.exe -I https://date-tool.com/?v=0.2.69
```

الملفات المتأثرة:

```txt
app/manifest.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين نموذج التواصل وأدوات التاريخ على الجوال - الإصدار 0.2.70

الأعراض:

```txt
في صفحة `/contact` على الشاشات الصغيرة كانت أماكن الإدخال غير واضحة وتظهر كمساحات كبيرة لا تبرز كحقول فعلية.
في الصفحة الرئيسية للتاريخ كانت كروت الأدوات والاختيارات كبيرة أكثر من اللازم على الأجهزة الصغيرة.
```

السبب:

```txt
حقول نموذج التواصل كانت تعتمد على خلفية عامة قريبة من لون البطاقة بدون إبراز كافٍ للحقل والـ placeholder.
قواعد الجوال لأدوات التاريخ كانت ما زالت تستخدم padding وارتفاعات مناسبة للشاشات الأكبر، مما جعل الكروت ضخمة على عرض 380px وأقل.
```

الحل:

```txt
إضافة placeholders واضحة لحقلي الاسم والبريد الإلكتروني في نموذج التواصل.
تقوية حدود وخلفيات حقول التواصل وحالة التركيز مع الحفاظ على ألوان الموقع.
إضافة قواعد متجاوبة مخصوصة لكروت أدوات التاريخ على `max-width: 520px` و `max-width: 380px`.
تقليل padding وحجم عناوين الأدوات وأزرار التقويم وارتفاع حقول اليوم/الشهر/السنة وأزرار التنفيذ على الجوال.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.70 على Cloudflare Version ID: 6eafce62-8243-423c-98a8-2422e70f748d.
✅ تم اختبار `/contact?v=0.2.70` على الإنتاج ورجع HTTP 200.
✅ تم اختبار `/?v=0.2.70` على الإنتاج ورجع HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 180
rg -n "contact-page-form|contact-upload-field|calendar-mode|date-dropdowns|tool-mode-card|site-page-content > \.card|@media \(max-width: 520px\)" app\globals.css app\[slug]\PageClient.jsx app\page.jsx app\components\home
Get-Content app\globals.css -Encoding UTF8 | Select-Object -Skip 940 -First 190
Get-Content app\globals.css -Encoding UTF8 | Select-Object -Skip 1530 -First 120
Get-Content app\globals.css -Encoding UTF8 | Select-Object -Skip 2480 -First 320
Get-Content -LiteralPath 'app\[slug]\PageClient.jsx' -Encoding UTF8 | Select-Object -Skip 250 -First 95
npm version 0.2.70 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/contact?v=0.2.70
curl.exe -I https://date-tool.com/?v=0.2.70
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### ضبط عرض صفحة التواصل وتخفيف خطوط أدوات التاريخ - الإصدار 0.2.71

الأعراض:

```txt
بعد فحص `/contact` على عرض جوال صغير، ظهرت الصفحة ضيقة جدًا بسبب وجود container داخل SiteShell.
حقول نموذج التواصل كانت لا تزال قريبة بصريًا من خلفية النموذج.
خطوط أدوات التاريخ الرئيسية كانت ما زالت كبيرة على الشاشات الصغيرة جدًا.
```

السبب:

```txt
صفحات slug تستخدم `.container static-page-container` داخل حاوية Shell العامة، وهذا ضاعف قيود العرض على الجوال.
صفحة التواصل لم تكن تملك class خاصًا يسمح بضبط عرضها وحقولها دون التأثير على صفحات الخصوصية والشروط.
قواعد الجوال السابقة خففت الأحجام، لكنها لم تكن كافية لعرض 368px وما حوله.
```

الحل:

```txt
إضافة variant خاص لصفحة التواصل باسم `static-contact-page`.
جعل صفحات static داخل SiteShell تأخذ عرضًا كاملًا آمنًا، مع ضبط أوسع لصفحة التواصل تحديدًا.
تقليل padding صفحة التواصل على الجوال وتوضيح لون حقول الإدخال بخلفية مختلفة وحدود أقوى.
تقليل ارتفاع حقول التواصل ومربع رفع الصورة وزر الإرسال مع الحفاظ على قابلية القراءة.
تخفيف إضافي لعناوين وأزرار وحقول أدوات التاريخ في `max-width: 520px` و `max-width: 380px`.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.71 على Cloudflare Version ID: 2c452616-1005-4e0e-a9ad-4f10cd982c84.
✅ تم اختبار `/contact?v=0.2.71` على الإنتاج ورجع HTTP 200.
✅ تم اختبار `/?v=0.2.71` على الإنتاج ورجع HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 120
rg -n "static-page-container|static-page-header|static-page-card|contact-page-form|site-page-content > \.card|@media \(max-width: 520px\)|@media \(max-width: 380px\)" app\globals.css
rg -n "static-page-container|site-page-content|container site-shell-container|Static|className=.*static" app\[slug] app\SiteShell.jsx app\globals.css
Get-Content -LiteralPath 'app\[slug]\PageClient.jsx' -Encoding UTF8 | Select-Object -Skip 170 -First 45
npm version 0.2.71 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/contact?v=0.2.71
curl.exe -I https://date-tool.com/?v=0.2.71
```

الملفات المتأثرة:

```txt
app/[slug]/PageClient.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إدارة زر تثبيت الأداة ومنع تكرار رسالة الموقع - الإصدار 0.2.72

الأعراض:

```txt
نموذج اتصل بنا لا يزال لا يطابق عرض بطاقة عنوان الصفحة، وخلفية حقول الإدخال مطلوبة بلون خلفية الموقع الأساسية.
زر تثبيت الأداة لم يكن قابلًا للتحكم من لوحة الإدارة.
رسالة السماح بالموقع كانت تظهر بعد كل إعادة تحميل أو في صفحات متعددة، مما يزعج الزائر.
```

السبب:

```txt
زر التثبيت كان مكونًا ثابتًا بنص ثابت وبدون إعدادات محفوظة في `settings/main`.
رسالة الموقع اعتمدت على حالة `locationStatus` فقط، ولم يكن لديها ذاكرة محلية تمنع تكرار نفس الإشعار بعد ظهوره.
حقول التواصل كانت تستخدم مزيج ألوان قريب من النموذج بدل `var(--bg-body)` المطلوب.
```

الحل:

```txt
إضافة إعداد `pwaInstallPrompt` إلى إعدادات الموقع العامة: enabled و text و buttonText.
إضافة سيكشن "زر تثبيت الأداة" في `/admin/tools` للتحكم في إظهاره ونص الرسالة ونص الزر.
تمرير إعدادات زر التثبيت إلى `PwaInstallPrompt` في الواجهة العامة.
إضافة نص صغير اختياري داخل زر التثبيت العام مع إبقاء الزر ظاهرًا فقط عند دعم المتصفح للتثبيت.
استخدام مفاتيح localStorage منفصلة لمنع تكرار إشعار نجاح الموقع وإشعار خطأ الموقع بعد أول ظهور لكل حالة.
ضبط خلفية حقول التواصل إلى لون خلفية الموقع الأساسية `var(--bg-body)` وجعل بطاقة التواصل تتبع عرض صفحة التواصل.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.72 على Cloudflare Version ID: 4fce8e4a-195f-4d35-82c1-f601525f33c2.
✅ تم اختبار `/contact?v=0.2.72` على الإنتاج ورجع HTTP 200.
✅ تم اختبار `/admin/tools?v=0.2.72` على الإنتاج ورجع HTTP 200.
✅ تم اختبار `/?v=0.2.72` على الإنتاج ورجع HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 130
rg -n "PwaInstallPrompt|install|privacySettingsButton|location-permission|requestLocation|geolocation|static-contact-page|contact-page-form" app
Get-Content app\components\PwaInstallPrompt.jsx -Encoding UTF8
Get-Content app\SiteShell.jsx -Encoding UTF8 | Select-Object -Skip 220 -First 270
Get-Content app\admin\tools\page.jsx -Encoding UTF8 | Select-Object -First 470
Get-Content app\admin\tools\page.jsx -Encoding UTF8 | Select-Object -Skip 590 -First 180
Get-Content app\firebase.js -Encoding UTF8 | Select-Object -Skip 210 -First 80
Get-Content app\admin\AdminDashboard.css -Encoding UTF8 | Select-Object -Skip 1660 -First 120
npm version 0.2.72 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/contact?v=0.2.72
curl.exe -I https://date-tool.com/admin/tools?v=0.2.72
curl.exe -I https://date-tool.com/?v=0.2.72
```

الملفات المتأثرة:

```txt
app/components/PwaInstallPrompt.jsx
app/SiteShell.jsx
app/firebase.js
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إصلاح تمدد صفحة التواصل وتحسين ثبات Shell - الإصدار 0.2.73

الأعراض:

```txt
بعد تعديل صفحة التواصل، أصبح عنوان صفحة اتصل بنا أكبر من المطلوب على الشاشات الصغيرة.
بطاقة نموذج التواصل كانت تتجاوز عرض الشاشة وتسبب سحبًا أفقيًا.
المطلوب أن يبقى الهيدر والفوتر ثابتين قدر الإمكان عند التنقل بين أدوات التاريخ والساعة والطقس، ويظهر محتوى الصفحة فقط.
```

السبب:

```txt
قاعدة `width: 100%` على بطاقة التواصل مع padding بدون `box-sizing: border-box` جعلت عرض البطاقة الفعلي أكبر من الحاوية.
كان هناك override خاص لعنوان صفحة التواصل على الجوال جعله أكبر من قواعد الصفحات العامة السابقة.
روابط الأدوات كانت تستخدم `Next Link` بالفعل، لكن لم يكن هناك prefetch صريح، كما أن Shell لم يكن يحتفظ بإعداداته مؤقتًا داخل الجلسة.
```

الحل:

```txt
إضافة `box-sizing: border-box` لرأس وبطاقة الصفحات الثابتة.
إزالة override حجم عنوان صفحة التواصل حتى يرجع لحجم الصفحات العامة السابق.
إبقاء بطاقة التواصل بعرض آمن دون تجاوز الشاشة.
إضافة `prefetch` صريح لروابط الأدوات والروابط الداخلية في الهيدر.
إضافة كاش جلسة خفيف لإعدادات `SiteShell` لمدة 5 دقائق، مع تحديثها من الشبكة في الخلفية، لتقليل وميض الهيدر والفوتر عند التنقل أو إعادة فتح صفحة داخل نفس الجلسة.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.73 على Cloudflare Version ID: ff10c105-2b2c-4aa0-93bb-5f31cc2d36fd.
✅ تم اختبار `/contact?v=0.2.73` و `/?v=0.2.73` و `/clock?v=0.2.73` و `/weather?v=0.2.73` على الإنتاج بنجاح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 130
rg -n "static-contact-page|static-page-header h1|site-page-content|primaryToolLinks|site-nav-shell|router|Link href" app\globals.css app\Header.jsx app\SiteShell.jsx app\page.jsx app\clock app\weather
Get-Content app\globals.css -Encoding UTF8 | Select-Object -Skip 800 -First 100
Get-Content app\globals.css -Encoding UTF8 | Select-Object -Skip 2760 -First 190
Get-Content app\layout.jsx -Encoding UTF8 | Select-Object -First 180
Get-Content app\SiteShell.jsx -Encoding UTF8 | Select-Object -First 240
npm version 0.2.73 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/contact?v=0.2.73
curl.exe -I https://date-tool.com/?v=0.2.73
curl.exe -I https://date-tool.com/clock?v=0.2.73
curl.exe -I https://date-tool.com/weather?v=0.2.73
```

الملفات المتأثرة:

```txt
app/Header.jsx
app/SiteShell.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين صفحة الطقس بزر الموقع الحالي ونسبة الهطول - الإصدار 0.2.74

الأعراض:

```txt
صفحة الطقس كانت تحتوي زر عرض الطقس فقط، وبعد البحث عن مدينة أخرى لم يكن هناك زر سريع للرجوع إلى طقس الموقع الحالي.
بطاقة الطقس كانت تعرض كمية الأمطار بالملليمتر، بينما المطلوب للمستخدم هنا نسبة توقع هطول المطر.
صفوف توقعات 5 أيام كانت طويلة جدًا على الجوال لأنها تتحول إلى عناصر عمودية كثيرة.
```

السبب:

```txt
نموذج البحث لم يكن يحتوي إجراء مستقل لاستخدام الموقع الحالي.
واجهة الملخص كانت تعتمد `current.precipitation` بدل `daily.precipitation_probability_max`.
قاعدة الجوال لـ `.forecast-row` كانت تحول كل أعمدة التوقعات إلى عمود واحد، ما جعل كل يوم يظهر طويلًا.
```

الحل:

```txt
إضافة زر أيقوني بجانب زر عرض الطقس لاستخدام الموقع الحالي وتحديث الإحداثيات يدويًا عند الضغط.
إضافة دعم `force` في `requestCurrentLocation` حتى يمكن للزر اليدوي طلب تحديث الموقع بدل الاعتماد دائمًا على الكاش.
تغيير خانة الأمطار إلى `توقع المطر` وعرض النسبة المئوية من توقع الهطول اليومي.
إعادة تصميم صفوف التوقعات على الجوال لتظهر في عمودين مضغوطين بدل صفوف طويلة.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.74 على Cloudflare Version ID: 3f98e6fb-54ab-4085-b4d7-cff693b5ec7c.
✅ تم اختبار `/weather?v=0.2.74` و `/?v=0.2.74` على الإنتاج بنجاح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "weather|forecast|precip|rain|location|عرض الطقس|توقعات" app -S
npm version 0.2.74 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/weather?v=0.2.74
curl.exe -I https://date-tool.com/?v=0.2.74
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/globals.css
app/weather/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحميل طقس الموقع الحالي أولًا - الإصدار 0.2.75

الأعراض:

```txt
عند فتح صفحة `/weather` كان كرت الطقس يبدأ بعرض الرياض مباشرة، حتى إذا كان المتصفح سيمنح الموقع الحالي بعد لحظات.
هذا جعل المستخدم يرى موقعًا افتراضيًا قبل أن تتحدث الصفحة حسب موقعه المحدد.
```

السبب:

```txt
تأثير التحميل الأول في صفحة الطقس كان ينفذ `loadWeather('Riyadh')` فورًا عند mount.
طلب الموقع العام في `SiteShell` كان يعمل بالتوازي، ما يعني أن طقس الموقع الحقيقي يصل لاحقًا بدل أن يكون أولوية التحميل.
```

الحل:

```txt
تعديل تحميل صفحة الطقس الأولي ليطلب الموقع الحالي أولًا عبر `requestCurrentLocation`.
إذا نجح الموقع، يتم تحميل الطقس من الإحداثيات مباشرة وتحديث حقل البحث باسم الموقع.
إذا تعذر الموقع أو رفضه المتصفح، يتم استخدام الرياض كخيار احتياطي فقط.
منع تكرار طلب تحديد الموقع إذا طلبه `SiteShell` وصفحة الطقس في الوقت نفسه عبر promise مشترك للطلب الجاري.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.75 على Cloudflare Version ID: 34c67d87-658a-48e0-94a8-6d0f6fd0c7a9.
✅ تم اختبار `/weather?v=0.2.75` و `/?v=0.2.75` على الإنتاج بنجاح.
⚠️ ظهرت رسائل fetch failed / EACCES أثناء build المحلي بسبب منع الشبكة في sandbox عند محاولة جلب Firestore، لكنها لم تفشل البناء.
⚠️ أثناء deploy ظهر تحذير محلي من ملف كاش Next داخل `.next/cache/fetch-cache` غير قابل للقراءة كـ JSON؛ النشر اكتمل بنجاح والتحذير يخص كاش بناء محلي غير محفوظ في Git.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
Get-Content app\weather\page.jsx -Encoding UTF8 | Select-Object -First 260
Get-Content app\SiteShell.jsx -Encoding UTF8 | Select-Object -Skip 130 -First 230
npm version 0.2.75 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/weather?v=0.2.75
curl.exe -I https://date-tool.com/?v=0.2.75
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/weather/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### ضبط أيقونات PWA للتطبيق والاختصارات - الإصدار 0.2.76

الأعراض:

```txt
في قائمة الضغط المطول على تطبيق الموقع المثبت في Android كان اختصار التاريخ يستخدم لوقو الموقع بدل أيقونة أداة التاريخ.
اختصارا الساعة والطقس كانا يستخدمان الأيقونة العامة القديمة نفسها، فظهرت كأيقونة تقويم عامة بدل أيقونة كل أداة.
كان من المحتمل أن يختار Android الأيقونة maskable المحلية القديمة للتطبيق بدل لوقو الهوية المحفوظ من الإدارة.
```

السبب:

```txt
ملف app/manifest.js كان يربط اختصار التاريخ بـ logoUrl، ويربط اختصاري الساعة والطقس بـ /pwa-icon-192.png.
أيقونة التطبيق الرئيسية كانت تحتوي على logoUrl كأيقونة عادية، لكن الأيقونة maskable المحلية بقيت كخيار قد يفضله Android.
لم تكن هناك ملفات PNG مستقلة لاختصارات التاريخ والساعة والطقس.
```

الحل:

```txt
تحديث manifest ليجعل logoUrl القادم من الهوية البصرية أيقونة any و maskable للتطبيق المثبت.
إضافة أيقونات PNG مستقلة لاختصارات التاريخ والساعة والطقس بأحجام 192 و 512.
تحديث shortcuts داخل manifest لتستخدم أيقونة كل أداة بدل الأيقونة العامة أو لوقو التطبيق.
رفع الإصدار إلى 0.2.76 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.76 على Cloudflare Version ID: 1d5416c1-a760-4445-b896-b8b75aa1f0b2.
✅ تم اختبار /manifest.webmanifest?v=0.2.76 على الإنتاج بنجاح.
✅ تم اختبار أيقونات /pwa-shortcut-date-192.png و /pwa-shortcut-clock-192.png و /pwa-shortcut-weather-192.png على الإنتاج بنجاح.
⚠️ Android/Chrome قد يحتفظ بأيقونات التطبيق المثبتة في الكاش؛ إذا لم تتحدث الأيقونات فورًا، تزال الإضافة من الشاشة الرئيسية ثم يعاد تثبيت الموقع.
⚠️ أثناء deploy ظهر تحذير OpenNext المعتاد على Windows، والنشر اكتمل بنجاح.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 180
Get-Content app\manifest.js -Encoding UTF8 | Select-Object -First 260
rg --files public app | rg "(icon|logo|manifest|pwa|svg|png|ico|version)"
npm version 0.2.76 --no-git-tag-version
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/manifest.webmanifest?v=0.2.76
curl.exe -I https://date-tool.com/pwa-shortcut-date-192.png
curl.exe -I https://date-tool.com/pwa-shortcut-clock-192.png
curl.exe -I https://date-tool.com/pwa-shortcut-weather-192.png
curl.exe https://date-tool.com/manifest.webmanifest?v=0.2.76
```

الملفات المتأثرة:

```txt
app/manifest.js
app/version.js
package.json
package-lock.json
public/pwa-shortcut-date-192.png
public/pwa-shortcut-date-512.png
public/pwa-shortcut-clock-192.png
public/pwa-shortcut-clock-512.png
public/pwa-shortcut-weather-192.png
public/pwa-shortcut-weather-512.png
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسينات PageSpeed الآمنة وتأجيل Firebase Auth - الإصدار 0.2.77

الأعراض:

```txt
تقرير PageSpeed للجوال أظهر أن الصفحة حملت ببطء شديد وأن نتائج Lighthouse قد تكون غير مكتملة.
ظهر تحذير وصول واضح: Select element must have an accessible name.
تحليل التقرير أظهر تحميل سكربتات reCAPTCHA/Firebase Auth ضمن تجربة الزائر العامة رغم أنها مطلوبة أساسًا لتسجيل الدخول والإدارة.
```

السبب:

```txt
app/firebase.js كان يهيئ Firebase Auth وApp Check عند استيراد الملف، وصفحة Shell العامة تستورد firebase.js لجلب إعدادات الموقع.
هذا جعل reCAPTCHA/App Check وFirebase Auth قابلين للتحميل من الواجهة العامة بدل تحميلهما فقط عند الحاجة.
حقول select في أدوات التاريخ وبعض أدوات الساعة لم تكن تحتوي على aria-label/title واضح.
```

الحل:

```txt
فصل تهيئة Firebase Auth وApp Check إلى دوال كسولة getFirebaseAuth و ensureFirebaseAppCheck.
تحديث صفحات الإدارة والعميل لتطلب Auth عند الحاجة فقط.
إضافة أسماء وصول وtitle لحقول اليوم والشهر والسنة في أدوات التاريخ.
إضافة أسماء وصول لحقول الساعة والمدينة في صفحة الساعة وحقل المدينة في الطقس وبعض اختيارات بوابة العميل.
رفع الإصدار إلى 0.2.77 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.77 على Cloudflare Version ID: 2e592d66-fd30-4f52-9c65-8ba3e0cc4eb9.
✅ تم اختبار /?v=0.2.77 و /clock?v=0.2.77 و /weather?v=0.2.77 على الإنتاج ورجعت HTTP 200.
✅ تم فحص HTML الصفحة الرئيسية الأولي وتأكد عدم وجود recaptcha أو enterprise.js أو firebaseapp.com/__/auth داخله.
⚠️ أثناء build المحلي ظهرت رسائل fetch failed بسبب منع الشبكة الخارجية داخل sandbox، ولم تؤثر على نجاح البناء.
⚠️ Chrome DevTools MCP غير متاح في هذه الجلسة؛ تم الاعتماد على تقرير PageSpeed المرسل وفحص الكود والبناء.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8 | Select-Object -First 240
Get-Content C:\Users\d7mi6\.codex\skills\web-perf\SKILL.md -Encoding UTF8
curl.exe -L "https://pagespeed.web.dev/analysis/https-date-tool-com/zz61x8vdln?form_factor=mobile"
curl.exe -L "https://pagespeed.web.dev/analysis/https-date-tool-com/zz61x8vdln?form_factor=desktop"
rg -n "DateDropdowns|<select|aria-label|recaptcha|enterprise|firebaseapp|GoogleAuthProvider|getAuth|auth|grecaptcha|api.js|Turnstile" app -S
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.77
curl.exe -I https://date-tool.com/clock?v=0.2.77
curl.exe -I https://date-tool.com/weather?v=0.2.77
curl.exe -L https://date-tool.com/?v=0.2.77
```

الملفات المتأثرة:

```txt
app/firebase.js
app/components/home/HomeSections.jsx
app/clock/page.jsx
app/weather/page.jsx
app/admin/page.jsx
app/admin/ad-settings/page.jsx
app/admin/ads/page.jsx
app/admin/identity/page.jsx
app/admin/integrations/page.jsx
app/admin/tools/page.jsx
app/admin/tool-management/ToolManagementShell.jsx
app/admin_login/page.jsx
app/client/ClientShell.jsx
app/client/page.jsx
app/client/register/page.jsx
app/client/reset-password/page.jsx
app/client/dashboard/page.jsx
app/client/create-campaign/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### ربط PageSpeed Insights API بلوحة الإدارة - الإصدار 0.2.78

الأعراض:

```txt
تقرير PageSpeed كان يقرأ خارجيًا من رابط pagespeed.web.dev، ولا توجد لوحة داخل الموقع تعرض درجات الأداء والمقاييس بشكل منظم.
الحاجة إلى رؤية إحصاءات PageSpeed للجوال والكمبيوتر من لوحة الإدارة بدون كشف مفاتيح أو فتح استهلاك عام للكوتا.
```

السبب:

```txt
لم يكن هناك endpoint داخلي يربط الموقع بـ Google PageSpeed Insights API.
استخدام PageSpeed مباشرة من المتصفح أو لصق روابط التقارير لا يعطي لوحة إدارة قابلة للتكرار أو حماية من استهلاك API بشكل عشوائي.
```

الحل:

```txt
إضافة /api/pagespeed كمسار إداري محمي يتحقق من Firebase ID token و admins/{uid}.active قبل جلب التقرير.
حصر الفحص على date-tool.com و www.date-tool.com فقط، وحذف query string و hash قبل الإرسال إلى Google.
تلخيص تقرير PageSpeed إلى درجات Lighthouse والمقاييس الأساسية وبيانات المستخدمين الميدانية وأهم ملاحظات التحسين.
إضافة كاش مؤقت داخل Worker لمدة 10 دقائق لكل رابط/استراتيجية لتخفيف الضغط على Google API.
إضافة صفحة /admin/pagespeed مع اختيار الصفحة وفحص الجوال والكمبيوتر وأزرار منفصلة أو شاملة.
ربط صفحة PageSpeed في سايد بار الإدارة، وإضافة دعم سر Cloudflare اختياري باسم PAGESPEED_API_KEY.
رفع الإصدار إلى 0.2.78 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.78 على Cloudflare Version ID: b2c1f208-4ba2-4f0a-96bf-025c98b3b9e8.
✅ تم اختبار /admin/pagespeed?v=0.2.78 على الإنتاج ورجع HTTP 200.
✅ تم اختبار /api/pagespeed بدون توثيق ورجع 401 unauthorized كما هو متوقع.
⚠️ أثناء build المحلي ظهرت رسائل fetch failed بسبب منع الشبكة الخارجية داخل sandbox، ولم تؤثر على نجاح البناء.
⚠️ اختبار تشغيل فحص PageSpeed الفعلي يحتاج جلسة مدير داخل المتصفح، وقد يحتاج سر PAGESPEED_API_KEY إذا ظهرت حدود كوتا Google.
```

الأوامر المستخدمة:

```powershell
Get-Content AGENTS.md -Encoding UTF8
Get-Content PROJECT_MEMO.md -Encoding UTF8
Get-Content C:\Users\d7mi6\.codex\skills\web-perf\SKILL.md -Encoding UTF8
Get-Content app\api\admin\cleanup\route.js -Encoding UTF8
Get-Content app\admin\integrations\page.jsx -Encoding UTF8
rg -n "function AdminNav|AdminNav|/admin/integrations|/admin/ad-settings|tool-management|pagespeed" app\admin app\api -S
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin/pagespeed?v=0.2.78
curl.exe -i https://date-tool.com/api/pagespeed?strategy=mobile
```

المصدر الرسمي المستخدم:

```txt
https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
```

الملفات المتأثرة:

```txt
app/api/pagespeed/route.js
app/admin/pagespeed/page.jsx
app/admin/AdminDashboard.css
app/admin/page.jsx
app/admin/ad-settings/page.jsx
app/admin/ads/page.jsx
app/admin/identity/page.jsx
app/admin/integrations/page.jsx
app/admin/tools/page.jsx
app/admin/tool-management/ToolManagementShell.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### معالجة أسباب PageSpeed الحمراء في الواجهة العامة - الإصدار 0.2.79

الأعراض:

```txt
تقرير PageSpeed المحفوظ لنسخة قديمة من الموقع أظهر درجة أداء حمراء بسبب:
unused-javascript بحجم كبير من reCAPTCHA و Firebase Auth iframe وقطع JavaScript غير مستخدمة.
unused-css-rules من Font Awesome CSS وملفات reCAPTCHA.
مشاكل تباين في بعض النصوص والأزرار.
رابط سوشيال في الفوتر بدون اسم وصول واضح.
```

السبب:

```txt
الواجهة العامة كانت تعتمد على Firebase Client SDK لجلب إعدادات الموقع، وهذا قد يسحب Auth/App Check/reCAPTCHA في مسار الزائر العام.
Font Awesome كان قابلًا للتحميل على الواجهة العامة رغم أن الأيقونات يمكن توفيرها ببدائل CSS خفيفة.
تحميل إعدادات الموقع العامة كان يسحب نصوص الصفحات الطويلة بدون حاجة في أول تحميل.
الصفحة كانت تنتظر إعدادات الموقع والحملات معًا قبل عرض المحتوى، ما قد يؤخر أول عرض مهم.
```

الحل:

```txt
إضافة /api/site-config كمسار عام مخفف ومفلتر يقرأ إعدادات الموقع من Firestore عبر الخادم.
منع تحميل نصوص customPages/pages الطويلة في الإعدادات العامة، وتحميلها فقط عند فتح صفحة slug عبر include=pages.
استبدال استيراد Firebase في SiteShell و صفحات slug و ExternalIntegrations باستدعاء /api/site-config.
جعل SiteShell يعرض المحتوى بعد وصول الإعدادات الخفيفة أولًا، ثم يحدث الحملات الإعلانية لاحقًا بدون حبس LCP.
قصر تحميل Font Awesome CDN على صفحات الإدارة والعميل والدعم، وإضافة بدائل CSS خفيفة للأيقونات العامة.
تحسين ألوان التباين وإضافة aria-label و sr-only لروابط السوشيال في الفوتر.
رفع الإصدار إلى 0.2.79 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم التأكد من عدم وجود recaptcha__ أو firebaseapp.com/__/auth داخل ملفات البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.79 على Cloudflare Version ID: 08e61a37-e4eb-47e8-a4d2-617b82585a9c.
✅ تم اختبار https://date-tool.com/ ورجع HTTP 200.
✅ تم اختبار /clock و /weather على الإنتاج ورجعا HTTP 200.
✅ تم اختبار /api/site-config و /api/site-config?include=pages على الإنتاج ورجعا HTTP 200.
⚠️ تقرير PageSpeed المرفق كان لنسخة 0.2.66، لذلك يلزم تشغيل تقرير جديد بعد انتشار الكاش للتأكد من الدرجة النهائية لدى Google.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -TotalCount 80
rg -n "firebase" app\SiteShell.jsx app\[slug]\PageClient.jsx app\components\ExternalIntegrations.jsx app\page.jsx app\clock\page.jsx app\weather\page.jsx -S
rg -n "cdnjs.cloudflare.com/ajax/libs/font-awesome|recaptcha|firebaseapp.com/__/auth" app -S
git diff --check
npm run lint
npm run build
rg -l "recaptcha__|firebaseapp.com/__/auth" .next\static .next\server -S
rg -l "cdnjs.cloudflare.com/ajax/libs/font-awesome" .next\static .next\server -S
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/api/site-config
curl.exe -I "https://date-tool.com/api/site-config?include=pages"
curl.exe -I https://date-tool.com/clock
curl.exe -I https://date-tool.com/weather
```

الملفات المتأثرة:

```txt
app/api/site-config/route.js
app/SiteShell.jsx
app/[slug]/PageClient.jsx
app/components/ExternalIntegrations.jsx
app/components/FontAwesomeLoader.jsx
app/Footer.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إعادة أيقونات الموقع الأصلية وحذف المرفقات المحلية - الإصدار 0.2.80

الأعراض:

```txt
بعد تحسينات PageSpeed ظهرت أيقونات الواجهة العامة بشكل غير جيد وصغير لأنها اعتمدت على بدائل CSS نصية بدل أيقونات Font Awesome الأصلية.
بقي مجلد .codex-remote-attachments غير مستخدم وغير متتبع في Git.
```

السبب:

```txt
الإصدار 0.2.79 قصر تحميل Font Awesome على صفحات الإدارة والعميل والدعم لتقليل CSS غير المستخدم في تقرير PageSpeed.
هذا جعل الواجهة العامة تستخدم بدائل رمزية خفيفة، لكنها لم تحافظ على شكل الأيقونات الأصلي وهوية الموقع.
```

الحل:

```txt
إعادة FontAwesomeLoader لتحميل Font Awesome على كل صفحات الموقع كما كان سابقًا.
إزالة كتلة بدائل CSS النصية للأيقونات من globals.css.
حذف مجلد .codex-remote-attachments المحلي بعد التحقق من أنه داخل مجلد المشروع.
رفع الإصدار إلى 0.2.80 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم حذف المرفق المحلي غير المستخدم.
✅ تم تنفيذ تعديل الأيقونات محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.80 على Cloudflare Version ID: d6d1449d-076b-441f-82c0-3185aa08c742.
✅ تم اختبار / و /clock و /weather على الإنتاج ورجعت HTTP 200.
⚠️ عودة Font Awesome للواجهة العامة قد تعيد ملاحظة unused CSS في PageSpeed، لكنها أعادت الأيقونات الأصلية المطلوبة.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -TotalCount 70
git status --short
Get-Content app\components\FontAwesomeLoader.jsx
Resolve-Path -LiteralPath .codex-remote-attachments
Remove-Item -LiteralPath .codex-remote-attachments -Recurse -Force
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/
curl.exe -I https://date-tool.com/clock
curl.exe -I https://date-tool.com/weather
```

الملفات المتأثرة:

```txt
app/components/FontAwesomeLoader.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### أيقونة تطبيق مستقلة وإعادة إظهار تنبيه التثبيت - الإصدار 0.2.81

الأعراض:

```txt
أيقونة التطبيق المثبت على الجوال كانت تعتمد على لوقو الموقع أو أيقونات PWA الاحتياطية، وقد تظهر مختلفة عن لوقو الموقع في اختصار التطبيق.
إعداد زر تثبيت الأداة كان يسمح بالإظهار أو الإخفاء وتغيير النصوص فقط، ولا يوفر طريقة لإعادة إظهار التنبيه للمستخدمين الذين أخفوه أو ثبتوا التطبيق مسبقًا عند وجود تحديث.
```

السبب:

```txt
manifest.webmanifest لم يكن يحتوي على حقل مستقل لأيقونة التطبيق المثبت، وكان يستخدم logoUrl كأفضل خيار متاح ثم أيقونات PWA المحلية.
مكون PwaInstallPrompt كان يخفي التنبيه نهائيًا بعد الإخفاء أو التثبيت اعتمادًا على localStorage بدون مفتاح إصدار/تحديث من لوحة الإدارة.
تصنيفات R2 العامة لم تكن تحتوي على category مخصصة لأيقونة التطبيق.
```

الحل:

```txt
إضافة appIconUrl إلى إعدادات الهوية العامة وحقل رفع مستقل في /admin/identity.
السماح برفع وقراءة صور R2 تحت category جديدة باسم app-icon.
تحديث manifest.webmanifest ليستخدم appIconUrl أولًا ثم logoUrl كاحتياط.
إضافة showAgainKey إلى إعدادات pwaInstallPrompt وزر "إظهار مجددًا" في /admin/tools.
تحديث PwaInstallPrompt ليعرض بطاقة التثبيت مجددًا عند تغير showAgainKey، ويعرض رسالة تحديث مرة واحدة داخل التطبيق المثبت.
رفع الإصدار إلى 0.2.81 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديلات محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.81 على Cloudflare Version ID: f887abe3-bc78-4870-b4e4-8908cdc68467.
✅ تم اختبار /manifest.webmanifest و /admin/identity و /admin/tools والصفحة الرئيسية على الإنتاج ورجعت HTTP 200.
✅ manifest.webmanifest يستخدم appIconUrl عند وجودها، ويعود إلى logoUrl كاحتياط حتى يرفع المدير أيقونة التطبيق.
⚠️ لا يمكن للمتصفح عرض نافذة التثبيت الأصلية لمستخدم ثبت التطبيق مسبقًا؛ لذلك يعرض الموقع رسالة تحديث داخل التطبيق المثبت مرة واحدة عند استخدام زر "إظهار مجددًا".
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -TotalCount 90
rg -n "install|pwa|manifest|app icon|appIcon|beforeinstallprompt|showInstall|installPrompt|privacy|R2|media|logo|favicon" app package.json wrangler.jsonc PROJECT_MEMO.md
Get-Content app\manifest.js -Encoding UTF8
Get-Content app\components\PwaInstallPrompt.jsx -Encoding UTF8
Get-Content app\firebase.js -Encoding UTF8
Get-Content app\api\site-config\route.js -Encoding UTF8
Get-Content app\admin\identity\page.jsx -Encoding UTF8
Get-Content app\admin\tools\page.jsx -Encoding UTF8
Get-Content -LiteralPath app\api\media\[...key]\route.js -Encoding UTF8
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/manifest.webmanifest?v=0.2.81
curl.exe -I https://date-tool.com/admin/identity?v=0.2.81
curl.exe -I https://date-tool.com/admin/tools?v=0.2.81
curl.exe -I https://date-tool.com/
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.81
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/admin/identity/page.jsx
app/admin/tools/page.jsx
app/api/media/[...key]/route.js
app/api/media/upload/route.js
app/api/site-config/route.js
app/components/PwaInstallPrompt.jsx
app/firebase.js
app/globals.css
app/manifest.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إزالة أيقونات PWA الاحتياطية القديمة وربط كل الأيقونات ببيانات الإدارة - الإصدار 0.2.82

الأعراض:

```txt
عند تثبيت التطبيق على الجوال ظهرت أيقونة التقويم القديمة التي كانت ضمن أيقونات PWA الاحتياطية بدل الأيقونة التي يريدها المدير من لوحة الإدارة.
أيقونة المتصفح المصغرة على الجوال كانت قد ترجع إلى fallback ثابت بدل ترتيب بيانات الإدارة.
ظهر مجلد .codex-remote-attachments جديد نتيجة الصورة المرفقة ولم يكن جزءًا من المشروع.
```

السبب:

```txt
manifest.webmanifest كان لا يزال يحتوي على أيقونات static fallback: /pwa-icon-192.png و /pwa-icon-512.png و /pwa-maskable-512.png.
Android قد يفضّل الأيقونة maskable المحلية حتى مع وجود لوقو الإدارة.
layout.jsx كان يرجع إلى /favicon.ico عند غياب faviconUrl بدل استخدام appIconUrl أو logoUrl من الإدارة.
SiteShell كان يحدّث rel=icon من faviconUrl فقط ولا يستخدم appIconUrl أو logoUrl كاحتياط إداري.
```

الحل:

```txt
حذف ملفات أيقونات PWA العامة القديمة من public.
إزالة مراجع pwa-icon و pwa-maskable من app/manifest.js.
جعل manifest يستخدم فقط بيانات الإدارة بترتيب: appIconUrl ثم faviconUrl ثم logoUrl.
تحديث metadata في layout.jsx ليستخدم faviconUrl ثم appIconUrl ثم logoUrl، بدون fallback ثابت إلى /favicon.ico عند توفر بيانات الإدارة.
تحديث SiteShell ليطبّق نفس ترتيب أيقونة المتصفح من بيانات الإدارة.
حذف مجلد .codex-remote-attachments المحلي غير المستخدم.
رفع الإصدار إلى 0.2.82 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ تم حذف أيقونات PWA الاحتياطية القديمة من public.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم نشر التعديل ضمن الإصدار 0.2.83 على Cloudflare.
✅ manifest.webmanifest لم يعد يحتوي على pwa-icon أو pwa-maskable، ويستخدم appIconUrl من الإدارة.
✅ تم حجب مسارات أيقونات PWA القديمة بإرجاع 410 Gone حتى لا يلتقط المتصفح الشكل القديم.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -TotalCount 90
rg -n "pwa-icon|maskable|favicon|icon|manifest|appIconUrl|apple|metadata|shortcut" app public package.json PROJECT_MEMO.md VERSION_LOG.md
Get-Content app\layout.jsx -Encoding UTF8
Get-Content app\manifest.js -Encoding UTF8
Get-ChildItem public
Remove-Item -LiteralPath .codex-remote-attachments -Recurse -Force
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.83
curl.exe -I https://date-tool.com/pwa-icon-192.png?v=0.2.83
curl.exe -I https://date-tool.com/pwa-icon-512.png?v=0.2.83
curl.exe -I https://date-tool.com/pwa-maskable-512.png?v=0.2.83
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/layout.jsx
app/manifest.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
public/pwa-icon-192.png
public/pwa-icon-512.png
public/pwa-maskable-512.png
```

---

### تثبيت غلاف منصة الإدارة والسايد بار حسب الصلاحيات - الإصدار 0.2.83

الأعراض:

```txt
كل صفحة في منصة الإدارة كانت تعيد تحميل السايد بار والناف بار وفحص الدخول عند الانتقال بين صفحات الإدارة.
المستخدم كان يشعر أن لوحة الإدارة كلها يعاد بناؤها مع كل ضغط على صفحة.
لم يكن هناك مكان مركزي واحد يفلتر روابط السايد بار حسب صلاحيات المساعدين إن أضيفت لهم صلاحيات محددة.
```

السبب:

```txt
صفحات الإدارة كانت تحتوي نسخًا مكررة من legacy-admin-shell والسايد بار والناف بار وفحص Firebase Auth.
عدم وجود app/admin/layout.jsx ثابت جعل App Router يبدّل صفحة كاملة بدل إبقاء غلاف الإدارة مشتركًا.
```

الحل:

```txt
إضافة app/admin/layout.jsx و app/admin/AdminShell.jsx كغلاف ثابت لكل صفحات /admin.
نقل فحص الدخول الأساسي إلى AdminShell حتى يظهر السايد بار والناف بار بعد التحقق الأول.
إضافة قائمة روابط مركزية في AdminShell مع فلترة حسب حقول صلاحيات محتملة مثل permissions و allowedPages و adminPermissions.
السماح الكامل للأدوار super_admin و admin و owner و manager، وتقييد assistant عند وجود صلاحيات محددة.
إظهار حالة تحقق/رفض صلاحية الصفحة داخل محتوى الصفحة فقط، مع بقاء السايد بار والناف بار ظاهرين.
إخفاء أغلفة الإدارة الداخلية القديمة بصريًا عبر CSS مؤقتًا حتى تبقى الصفحات مستقرة بدون تفكيك شامل دفعة واحدة.
إضافة 410 Gone لمسارات أيقونات PWA القديمة في middleware.
رفع الإصدار إلى 0.2.83 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم نشر الإصدار 0.2.83 على Cloudflare Version ID: 997615ab-b99d-42a4-8a42-e9876ac09dff.
✅ تم اختبار /admin و /admin/identity و /admin/ads على الإنتاج ورجعت HTTP 200.
✅ تم اختبار manifest ومسارات pwa-icon القديمة على الإنتاج.
⚠️ صفحات الإدارة ما زالت تملك فحص Auth داخليًا كطبقة أمان إضافية؛ الغلاف الثابت يخفي تكرار السايد بار والناف بار بصريًا إلى أن يتم تفكيك صفحات الإدارة لاحقًا.
```

الأوامر المستخدمة:

```powershell
Get-Content app\admin\page.jsx -Encoding UTF8
Get-Content app\admin\AdminDashboard.css -Encoding UTF8
rg -n "legacy-admin-shell|legacy-sidebar|legacy-topbar|check|permission|role|assistant|auth|admin" app\admin -g "*.jsx" -g "*.css"
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin?v=0.2.83
curl.exe -I https://date-tool.com/admin/identity?v=0.2.83
curl.exe -I https://date-tool.com/admin/ads?v=0.2.83
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.83
curl.exe -I https://date-tool.com/pwa-icon-192.png?v=0.2.83
curl.exe -I https://date-tool.com/pwa-icon-512.png?v=0.2.83
curl.exe -I https://date-tool.com/pwa-maskable-512.png?v=0.2.83
```

الملفات المتأثرة:

```txt
app/admin/AdminShell.jsx
app/admin/layout.jsx
app/admin/AdminDashboard.css
middleware.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### توحيد أزرار إجراءات أدوات الموقع - الإصدار 0.2.84

الأعراض:

```txt
أزرار الساعة والطقس كانت تختلف في الارتفاع والتدرج والحركة عن أزرار أدوات التاريخ، خصوصًا على الجوال.
زر عرض الطقس وزر تحديد الموقع الحالي كانا يملكان تنسيقًا منفصلًا يجعل الحجم والشكل مختلفين.
```

السبب:

```txt
زر التاريخ كان يعتمد override خاصًا داخل .site-page-content > .card button.action-btn.
الساعة تستخدم action-btn لكن دون نفس متغيرات الجوال.
الطقس كان يستخدم .weather-search button بتنسيق مستقل عن action-btn.
```

الحل:

```txt
إضافة متغيرات CSS مشتركة لأزرار الأدوات: --tool-action-height و --tool-action-radius و --tool-action-font-size وغيرها.
تحديث button.action-btn ليستخدم نفس الهوية في كل الأدوات.
تحديث weather-search button ليستخدم نفس التدرج والارتفاع والحركة.
جعل weather-location-btn يأخذ ارتفاع زر الأداة نفسه.
نقل ضبط الجوال إلى متغيرات مشتركة حتى تتطابق أدوات التاريخ والساعة والطقس.
رفع الإصدار إلى 0.2.84 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم نشر الإصدار 0.2.84 على Cloudflare Version ID: 33f01687-749c-4b58-8df8-3708002109fd.
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8
git status --short
rg -n "action-btn|weather-search|weather-location-btn|tool-action" app\globals.css app\clock app\weather app\components\home
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.84
curl.exe -I https://date-tool.com/clock?v=0.2.84
curl.exe -I https://date-tool.com/weather?v=0.2.84
```

الملفات المتأثرة:

```txt
app/globals.css
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
✅ تم تحسين رؤوس سكاشن صفحة `/admin/tools` وبطاقات الاختصارات العلوية
✅ تم تحديث الإصدار إلى 0.2.27
✅ تم نشر الإصدار 0.2.27 على Cloudflare Version ID: 029b520f-272f-4174-acc2-40bd977658bb
✅ تم تحويل سكشن الصفحات في `/admin/tools` إلى عرض جدولي مضغوط
✅ تم تحديث الإصدار إلى 0.2.28
✅ تم نشر الإصدار 0.2.28 على Cloudflare Version ID: 84f9afc2-e4bf-49c4-aa3d-41c0269bfa8f
✅ تم إنشاء ملف ترجمة مركزي للصفحة الرئيسية والهيدر والفوتر
✅ تم تنظيف ملفات وأصول قديمة غير مستخدمة
✅ تم تصحيح إدخالات الترميز المشوهة في سجل الإصدارات
✅ تم تحديث الإصدار إلى 0.2.33
✅ تم نشر الإصدار 0.2.33 على Cloudflare Version ID: 0d12e075-d709-4c62-a162-9339430f7699
✅ تم إضافة Skeleton لامع وخفيف أثناء تحميل الصفحة الرئيسية بدل النصوص المؤقتة
✅ تم تحديث الإصدار إلى 0.2.34
✅ تم نشر الإصدار 0.2.34 على Cloudflare Version ID: a4309318-03d5-4539-9288-77fd73e7daed
✅ تم توحيد الاستجابة في واجهة الأداة والإدارة وبوابة الكلاينت
✅ تم تحديث الإصدار إلى 0.2.35
✅ تم نشر الإصدار 0.2.35 على Cloudflare Version ID: 5dc52627-e705-4290-87b7-f67d9062f603
✅ تم إضافة Shell عام للصفحات العامة مع بقاء الهيدر والفوتر ثابتين بين أدوات الموقع
✅ تم إضافة صفحتي `/clock` و `/weather`
✅ تم تحديث الإصدار إلى 0.2.36
✅ تم نشر الإصدار 0.2.36 على Cloudflare Version ID: 2344ab93-b02d-4a0d-9fc9-2cd247b27854
✅ تم إضافة بانر الساعة الحالية في `/clock` وHero تعريفي في صفحة التاريخ
✅ تم تحديث الإصدار إلى 0.2.37
✅ تم نشر الإصدار 0.2.37 على Cloudflare Version ID: 329dce14-55d1-476d-8bfd-2fb05ed9fa96
✅ تم توحيد قياسات السكاشن العامة في صفحات التاريخ والساعة والطقس
✅ تم إضافة Skeleton عام على مستوى SiteShell للصفحات العامة
✅ تم إضافة طلب موافقة صريح لاستخدام الموقع الحالي في الساعة والطقس بدون حفظ الإحداثيات
✅ تم تحديث الإصدار إلى 0.2.38
✅ تم نشر الإصدار 0.2.38 على Cloudflare Version ID: b141fca1-986a-449b-96a6-09de9d13e3f5
✅ تم تبسيط صفحة `/clock` بإزالة كرت الوقت حسب المدينة وتحويل أداة الساعة إلى 24→12 فقط
✅ تم نقل طلب موقع المستخدم في `/clock` إلى إشعار موافقة يظهر عند تحميل الصفحة
✅ تم تحديث الإصدار إلى 0.2.39
✅ تم نشر الإصدار 0.2.39 على Cloudflare Version ID: 35325539-20ee-41a5-bb22-b716f3e09fef
✅ تم تحسين إشعار الموقع في `/clock` ليتعامل مع رفض إذن المتصفح المحفوظ
✅ تم تصغير بانر الساعة الحالية وتثبيت عرض الوقت حتى لا يتحرك النص مع تغير الثواني
✅ تم تحديث الإصدار إلى 0.2.40
✅ تم نشر الإصدار 0.2.40 على Cloudflare Version ID: a5d74276-91cd-4167-9308-86b2ee284927
✅ تم نقل طلب إذن الموقع إلى SiteShell العام وإصلاح Permissions-Policy للسماح بـ geolocation من نفس الموقع فقط
✅ تم تحديث الإصدار إلى 0.2.41
✅ تم نشر الإصدار 0.2.41 على Cloudflare Version ID: 1d9f7c66-ca25-4810-840d-71df4bc9f7c7
✅ تم تحسين أدوات الساعة بزر استخدام وقوائم ساعة/دقيقة منفصلة
✅ تمت إضافة مواضع إعلانية للساعة والطقس مع نص تسويقي قابل للتحكم من إدارة الإعلانات
✅ تم تحديث الإصدار إلى 0.2.42
✅ تم نشر الإصدار 0.2.42 على Cloudflare Version ID: 074c21b9-bb4e-4ddc-9e3b-4847cf0a8f74
✅ تم تحديث الإصدار إلى 0.2.43 وتوحيد مواضع التاريخ مع الساعة والطقس
✅ تم نشر الإصدار 0.2.43 على Cloudflare Version ID: cb7b4eae-09e2-4162-a8ff-65eec25c3ed0
✅ تم تحديث الإصدار إلى 0.2.44 وضبط حفظ googleAdSlots في Firebase على 9 مواضع فقط
✅ تم نشر الإصدار 0.2.44 على Cloudflare Version ID: 2aabef59-2998-40c8-b014-988dd01c720a
✅ تم تحديث الإصدار إلى 0.2.45 وضبط حفظ adImages في Firebase على 9 مواضع فقط
✅ تم نشر الإصدار 0.2.45 على Cloudflare Version ID: 56a5c636-0266-4ad2-9f84-69e5472984f6
✅ تم التحقق من Firestore: googleAdSlotsCount=9 و adImagesCount=9
✅ تم تحديث الإصدار إلى 0.2.46 وتحسين جدول إعدادات الإعلانات بفصل Google والنص التسويقي إلى عمودين
✅ تم نشر الإصدار 0.2.46 على Cloudflare Version ID: 9502acf8-9c69-405e-8230-5d6b045bf685
✅ تم تحديث الإصدار إلى 0.2.47 وتحسين جاهزية صفحات القبول لدى AdSense
✅ تم تحديث الإصدار إلى 0.2.48 وتحسين واجهة الجوال لصفحة التاريخ
✅ تم تحديث الإصدار إلى 0.2.49 وإصلاح منطق النص التسويقي في مواضع الإعلانات
✅ تم تحديث الإصدار إلى 0.2.50 وضبط أولوية الإعلانات: حملات العملاء ثم Google ثم النص التسويقي
✅ تم تحديث الإصدار إلى 0.2.51 وتوحيد السكاشن التعريفية في أدوات التاريخ والساعة والطقس
✅ تم تحديث الإصدار إلى 0.2.52 وإضافة زر تبديل 12/24 في بانر الساعة الحالية
✅ تم تحديث الإصدار إلى 0.2.53 وتحسين صفحة الساعة وأزرارها
✅ تم تحديث الإصدار إلى 0.2.54 ودمج مقاييس الطقس داخل كرت الطقس الحالي
✅ تم تحديث الإصدار إلى 0.2.55 وربط مرفقات نموذج التواصل برفع صور R2
✅ تم تحديث الإصدار إلى 0.2.56 وإخفاء نص R2 التقني عن العملاء
✅ تم تحديث الإصدار إلى 0.2.57 وإضافة الأسئلة الشائعة للساعة والطقس
✅ تم تحديث الإصدار إلى 0.2.58 وفصل إدارة أدوات الموقع ونقل أحداث أداة التاريخ إليها
✅ تم تحديث الإصدار إلى 0.2.59 وإضافة إعدادات محتوى مستقلة لكل أداة من لوحة الإدارة
✅ تم نشر الإصدار 0.2.59 على Cloudflare Version ID: e6c22fe0-9384-47c7-b4ef-50cc6f0b7e90
✅ تم تحديث الإصدار إلى 0.2.60 وإضافة إعدادات Link Preview ضمن الهوية البصرية
✅ تم ربط Open Graph وTwitter Card بإعدادات الهوية والصفحات الديناميكية
✅ تم نشر الإصدار 0.2.60 على Cloudflare Version ID: 5ae7a4a4-d064-4645-b7cc-ca5de00567d3
✅ تم تحديث الإصدار إلى 0.2.61 وربط صورة Link Preview المخصصة برفع R2
✅ تم نشر الإصدار 0.2.61 على Cloudflare Version ID: 8a99f70d-4a03-4e9f-b2b9-f21d3d960f40
✅ تم تحديث الإصدار إلى 0.2.62 وإضافة تنظيف آمن لبيانات Firestore القديمة
✅ تم ربط عرض الإعلانات العام بالحملات النشطة من collection `campaigns` عبر `/api/public-campaigns`
✅ تم منع إعادة حفظ الحقول القديمة `adCampaigns` و `adImages` و `pages` و `toolSlogan ` داخل `settings/main`
✅ تم إضافة زر "تنظيف Firebase" في `/admin/tools` لحذف `customPages.about` والحقول القديمة بجلسة مدير فعالة
✅ تم نشر الإصدار 0.2.62 على Cloudflare Version ID: 00434034-28da-4cf1-90de-6f68a06fa119
✅ تم اختبار `/api/public-campaigns` على الإنتاج ورجع `{ ok: true, campaigns: [] }`
✅ تم اختبار حماية `/api/admin/cleanup` بدون توثيق ورجع 401 كما هو متوقع
✅ تم اختبار `/admin/tools?v=0.2.62` على الإنتاج ورجع HTTP 200
✅ تم تحديث الإصدار إلى 0.2.63 وإضافة موافقة الخصوصية والكوكيز
✅ تم حجب التحليلات والتسويق وAdSense حتى موافقة المستخدم المناسبة
✅ تم منع روابط المشاركة من حمل query string وتنظيف سجلات الأخطاء العامة من تفاصيل حساسة
✅ تم تحسين محرر صفحات `/admin/tools` لقبول لصق نص منسق من Google Docs مع تنظيف HTML
✅ تم نشر الإصدار 0.2.63 على Cloudflare Version ID: 178e9e28-40a6-4ae0-8b1e-b2cd969fb177
✅ تم اختبار `/`, `/admin/tools?v=0.2.63`, و `/api/public-campaigns` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.67 بتحسينات أداء آمنة وتحسين صفحات روابط الفوتر للجوال
✅ تم نشر الإصدار 0.2.67 على Cloudflare Version ID: 66cfa0b9-0d23-4c72-96e7-d5a895fa91fa
✅ تم اختبار `/`, `/privacy`, `/terms`, و `/contact` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.68 بتحسين تعداد صفحات الفوتر وإضافة PWA Manifest وزر تثبيت التطبيق
✅ تم نشر الإصدار 0.2.68 على Cloudflare Version ID: fa495716-3b7d-41f6-a671-9183611cc333
✅ تم اختبار `/manifest.webmanifest` وأيقونات PWA وصفحة `/terms` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.69 وربط هوية التطبيق المثبت بإعدادات الإدارة
✅ تم نشر الإصدار 0.2.69 على Cloudflare Version ID: a734fee2-2886-49dc-b51f-bc0aa388374e
✅ تم اختبار `/manifest.webmanifest` على الإنتاج ورجع الاسم والوصف واللوقو من إعدادات الإدارة
✅ تم تحديث الإصدار إلى 0.2.70 وتحسين وضوح نموذج التواصل وأحجام أدوات التاريخ على الجوال
✅ تم نشر الإصدار 0.2.70 على Cloudflare Version ID: 6eafce62-8243-423c-98a8-2422e70f748d
✅ تم اختبار `/contact?v=0.2.70` و `/?v=0.2.70` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.71 وتوسيع صفحة التواصل وتحسين حقولها وتخفيف خطوط أدوات التاريخ على الجوال
✅ تم نشر الإصدار 0.2.71 على Cloudflare Version ID: 2c452616-1005-4e0e-a9ad-4f10cd982c84
✅ تم اختبار `/contact?v=0.2.71` و `/?v=0.2.71` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.72 وإضافة إدارة زر تثبيت الأداة ومنع تكرار إشعار الموقع
✅ تم نشر الإصدار 0.2.72 على Cloudflare Version ID: 4fce8e4a-195f-4d35-82c1-f601525f33c2
✅ تم اختبار `/contact?v=0.2.72` و `/admin/tools?v=0.2.72` و `/?v=0.2.72` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.73 وإصلاح تمدد صفحة التواصل وتحسين ثبات Shell عند التنقل بين أدوات الموقع
✅ تم نشر الإصدار 0.2.73 على Cloudflare Version ID: ff10c105-2b2c-4aa0-93bb-5f31cc2d36fd
✅ تم اختبار `/contact?v=0.2.73` و `/?v=0.2.73` و `/clock?v=0.2.73` و `/weather?v=0.2.73` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.74 وتحسين صفحة الطقس بزر الموقع الحالي ونسبة الهطول وصفوف التوقعات
✅ تم نشر الإصدار 0.2.74 على Cloudflare Version ID: 3f98e6fb-54ab-4085-b4d7-cff693b5ec7c
✅ تم اختبار `/weather?v=0.2.74` و `/?v=0.2.74` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.75 وجعل صفحة الطقس تبدأ بالموقع الحالي عند التحميل
✅ تم نشر الإصدار 0.2.75 على Cloudflare Version ID: 34c67d87-658a-48e0-94a8-6d0f6fd0c7a9
✅ تم اختبار `/weather?v=0.2.75` و `/?v=0.2.75` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.76 وضبط أيقونات PWA للتطبيق واختصارات أدوات التاريخ والساعة والطقس
✅ تم نشر الإصدار 0.2.76 على Cloudflare Version ID: 1d5416c1-a760-4445-b896-b8b75aa1f0b2
✅ تم اختبار manifest وأيقونات الاختصارات الجديدة على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.77 بتحسينات PageSpeed آمنة وتأجيل Firebase Auth/App Check عن الواجهة العامة
✅ تم نشر الإصدار 0.2.77 على Cloudflare Version ID: 2e592d66-fd30-4f52-9c65-8ba3e0cc4eb9
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج بنجاح
✅ تم التأكد أن HTML الأولي للصفحة الرئيسية لا يحتوي على reCAPTCHA أو Firebase Auth iframe
✅ تم تحديث الإصدار إلى 0.2.78 وإضافة ربط PageSpeed Insights API داخل لوحة الإدارة
✅ تم نشر الإصدار 0.2.78 على Cloudflare Version ID: b2c1f208-4ba2-4f0a-96bf-025c98b3b9e8
✅ تم اختبار `/admin/pagespeed?v=0.2.78` على الإنتاج بنجاح
✅ تم اختبار حماية `/api/pagespeed` بدون توثيق ورجع 401 كما هو متوقع
✅ تم تحديث الإصدار إلى 0.2.79 ومعالجة أسباب PageSpeed الحمراء في التقرير المحفوظ
✅ تم نشر الإصدار 0.2.79 على Cloudflare Version ID: 08e61a37-e4eb-47e8-a4d2-617b82585a9c
✅ تم اختبار `/`, `/clock`, `/weather`, و `/api/site-config` على الإنتاج بنجاح
⚠️ يجب تشغيل تقرير PageSpeed جديد بعد انتشار الكاش لأن التقرير المرفق كان مبنيًا على نسخة 0.2.66 القديمة
✅ تم تحديث الإصدار إلى 0.2.80 وإعادة أيقونات Font Awesome الأصلية للواجهة العامة
✅ تم حذف مجلد `.codex-remote-attachments` المحلي غير المستخدم
✅ تم نشر الإصدار 0.2.80 على Cloudflare Version ID: d6d1449d-076b-441f-82c0-3185aa08c742
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج بنجاح
⚠️ تمت إعادة تحميل Font Awesome على الواجهة العامة بناءً على طلب المستخدم، وقد تعود ملاحظة unused CSS في PageSpeed مقارنة بالإصدار 0.2.79
✅ تم تحديث الإصدار إلى 0.2.81 وإضافة أيقونة تطبيق مستقلة مرفوعة عبر R2
✅ تم إضافة زر "إظهار مجددًا" لإعادة ظهور تنبيه التثبيت/التحديث من لوحة الإدارة
✅ تم نشر الإصدار 0.2.81 على Cloudflare Version ID: f887abe3-bc78-4870-b4e4-8908cdc68467
✅ تم اختبار `/manifest.webmanifest`, `/admin/identity`, `/admin/tools`, و `/` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.82 وإزالة أيقونات PWA الاحتياطية القديمة وربط أيقونة التطبيق وfavicon ببيانات الإدارة فقط
✅ تم تحديث الإصدار إلى 0.2.83 وإضافة Layout ثابت لمنصة الإدارة مع فلترة روابط السايد بار حسب صلاحيات المساعدين
✅ تم نشر الإصدار 0.2.83 على Cloudflare Version ID: 997615ab-b99d-42a4-8a42-e9876ac09dff
✅ تم اختبار `/admin`, `/admin/identity`, `/admin/ads`, و `/manifest.webmanifest` على الإنتاج بنجاح
✅ أصبحت مسارات `/pwa-icon-192.png`, `/pwa-icon-512.png`, و `/pwa-maskable-512.png` ترجع 410 Gone حتى لا تستخدم أيقونات قديمة
✅ تم تحديث الإصدار إلى 0.2.84 وتوحيد أحجام وهوية أزرار الإجراءات في أدوات التاريخ والساعة والطقس
✅ تم نشر الإصدار 0.2.84 على Cloudflare Version ID: 33f01687-749c-4b58-8df8-3708002109fd
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج بنجاح
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
app-icon
ads top / middle / bottom1 / bottom2
```

ثم حفظ الأقسام والتأكد من ظهور الصور على الإنتاج. هذا الاختبار يحتاج جلسة مدير نشطة وملفات صور حقيقية.

كذلك يجب اختبار حفظ جدول الإعلانات فعليًا من لوحة الإدارة بعد تسجيل الدخول كمدير، لأن اختبار الإنتاج الحالي تحقق من تحميل الصفحات وأمان endpoint فقط.

يجب أيضًا اختبار صفحة `/admin/identity` بجلسة مدير فعلية عبر:

```txt
رفع لوقو حقيقي إلى R2.
رفع favicon حقيقي إلى R2.
رفع أيقونة تطبيق حقيقية إلى R2 من حقل أيقونة التطبيق المثبت.
تعديل إيميل التواصل والحقوق.
الضغط على حفظ الهوية.
التأكد من انعكاس القيم على الصفحة الرئيسية والفوتر وmanifest.webmanifest والصفحات التي تستخدم {{contactEmail}}.
```

---

### 2. لوحة الإدارة

المتبقي من خطة الإدارة:

```txt
تقسيم app/admin/page.jsx إلى مكونات أصغر لاحقًا في مهمة منفصلة
اختبار محرر الصفحات المنسق في `/admin/tools` بجلسة مدير فعلية عبر لصق نص من Google Docs والتأكد من حفظه وعرضه بعد التنظيف.
تحسين معاينة الصفحات
تحسين إدارة الإحصائيات
اختبار زر حذف الصفحات في `/admin/tools` بجلسة مدير فعلية بعد تعديل الحذف الصريح من Firebase.
اختبار حفظ أحداث أداة التاريخ من `/admin/tool-management/date` والتأكد من انعكاسها على واجهة التاريخ.
اختبار حفظ إعدادات محتوى أدوات التاريخ والساعة والطقس من `/admin/tool-management/*` بجلسة مدير فعلية والتأكد من انعكاس العنوان والسلوغن وأسماء الأدوات والأسئلة في الواجهة.
اختبار حفظ إعدادات Link Preview من `/admin/identity` بجلسة مدير فعلية، ثم فحص معاينة المشاركة بعد تحديث كاش منصات السوشيال عند الحاجة.
اختبار رفع صورة Link Preview مخصصة من `/admin/identity` والتأكد من حفظها كرابط R2 تحت `/api/media/link-preview/...`.
ربط جدول الإعلانات لاحقًا بنظام طلبات الإعلانات وإدارة العملاء والتذاكر
اختبار حفظ إعداد Google AdSense للإعلان العلوي من لوحة الإدارة بجلسة مدير فعلية، ثم التأكد من ظهوره تحت خانة اليوم بعد ترك خانة صورة إعلان أعلى الصفحة فارغة
اختبار صفحة `/admin/ad-settings` بجلسة مدير فعلية: حفظ مواضع الإعلانات، تفعيل Google عند غياب المعلنين، وإدخال مقتطف Ads.txt ثم اختبار `/ads.txt`.
اختبار زر "تنظيف Firebase" في `/admin/tools` بجلسة مدير فعلية بعد نشر الإصدار 0.2.62 والتأكد من اختفاء الحقول القديمة من `settings/main`.
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
إضافة واجهة إدارة/عرض مرفقات التذاكر في لوحة الإدارة؛ الرفع إلى R2 أصبح موجودًا من `/api/support` لكن مفاتيح `support/...` لا تُعرض عبر `/api/media` العام.
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

### 5. توسعة أدوات الساعة والطقس

المتبقي بعد إضافة الصفحات الأساسية:

```txt
إضافة مؤقت وعد تنازلي ومنبه بسيط داخل صفحة /clock.
إضافة أداة أفضل وقت للاجتماع بين مدن متعددة.
إضافة SEO مستقل لصفحات /clock و /weather لاحقًا.
إضافة أدوات طقس إضافية مثل جودة الهواء ومؤشر المطر وسجل درجات الحرارة إذا كانت مناسبة بدون مفاتيح سرية أو بتكامل آمن.
تقييم نقل إعدادات أسماء الأدوات وروابط الهيدر إلى لوحة الإدارة لاحقًا بدل إبقائها ثابتة في الكود.
```

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
