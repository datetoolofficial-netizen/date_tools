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
الإصدار الحالي للتطبيق هو 0.3.44.
نسخة منصة الإدارة الحالية هي 0.1.50.
نسخة بوابة المعلنين الحالية هي 1.0.5.
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
26. تنظيم إدارة محتوى الأدوات والأسئلة الشائعة والأحداث في جداول أفقية قابلة للاستخدام على جميع الشاشات، مع حفظ حالات التفعيل في Firebase.
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
100. تحسين شكل تنبيه تثبيت الأداة وحقل رفع صورة التواصل على الجوال.
101. ترتيب إشعارات التثبيت والكوكيز داخل مكدس واحد وتحديث كاش أيقونة تطبيق PWA.
102. فصل نطاق سنوات أدوات التاريخ، وتحويل فرق التوقيت إلى بحث مدن، وتوحيد نمط أدوات الساعة مع أدوات التاريخ.
103. تعبئة حقول التاريخ بتاريخ اليوم عند أول تفاعل، وتوحيد عناوين أدوات الساعة، وتحسين بطاقة نصيحة الطقس.
104. تحسين بطاقات أدوات الساعة لتطابق نمط أدوات التاريخ، واختصار نتيجة فرق التوقيت.
105. إضافة قوالب مشاركة قابلة للتعديل من إدارة الأدوات، وإعادة بطاقة نصيحة الطقس للشكل الأبسط.
106. اعتماد نصوص مشاركة افتراضية أجمل في أزرار مشاركة نتائج أدوات التاريخ.
107. تثبيت تسمية أزرار المشاركة بصريًا مع إبقاء نصوص المشاركة القابلة للتعديل تعمل من إعدادات الأدوات.
108. تحسين إدارة قوالب المشاركة بعمود إجراءات يحتوي زر تحرير وزر معاينة بالقيم الافتراضية.
109. إزالة أزرار قوالب المشاركة وجعل النص الكامل قابلًا للتعديل مباشرة داخل نفس الصف أسفل الملخص.
110. جعل ملخص قوالب المشاركة يعرض معاينة بالقيم الافتراضية مع إبقاء النص الكامل قابلًا للتعديل.
111. نقل إدارة تثبيت التطبيق وهوية PWA إلى صفحة الهوية، مع دعم أيقونة التطبيق واختصارات التاريخ والساعة والطقس من R2 وفصل نسخة الإدارة.
112. تصحيح مصدر عنوان ووصف Link Preview عند تفعيل استخدام الهوية الأساسية ليأخذ من اسم الأداة والسلوغن الحاليين بدل SEO القديم.
113. تنظيف آمن لتكرار CSS في أزرار الواجهة وجداول الإدارة، وتوسيع sitemap ليشمل صفحات الأدوات العامة.
114. فصل إعدادات العرض العامة عن إعدادات الإدارة، وتوحيد غلاف إدارة الأدوات، ونشر قواعد Firestore، وإضافة اختبارات أمنية وتدفقية آلية.
114. إضافة إشعار تحديث تلقائي للتطبيق المثبت عند تغير نسخة الموقع مع خطوات تحديث واضحة.
115. تقوية المحتوى النصي وبيانات SEO/Schema لصفحات التاريخ والساعة والطقس استعدادًا لمراجعة AdSense.
116. مراجعة وتحسين الهيدرز الأمنية وتهيئة Cloudflare العامة مع إبقاء CSP لمرحلة report-only مستقلة.
117. إضافة اختبار CSP بصيغة Report-Only ومحاولة تشغيل PageSpeed فعلي مع توثيق عائق كوتا Google عند عدم توفر مفتاح محلي.
118. معالجة CLS بحذر في /weather و /contact عبر حجز مساحات التحميل دون تغيير الهوية البصرية.
119. نقل محتوى SEO والأسئلة الافتراضية في /clock و /weather إلى Server Render مع إبقاء أسئلة الإدارة الإضافية ديناميكية.
120. إزالة الأسئلة الشائعة الافتراضية من الكود وجعل قسم FAQ في التاريخ والساعة والطقس يعتمد حصريًا على الأسئلة المحفوظة من إدارة كل أداة ويختفي عند فراغها.
121. إزالة ازدواج مسار من نحن، وتوحيد روابط أدوات التاريخ داخل الرئيسية، وإضافة إشعار IndexNow عند تغيّر الصفحات العامة فقط.
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

### تحسين تنبيه تثبيت الأداة وحقل رفع صورة التواصل - الإصدار 0.2.85

الأعراض:

```txt
تنبيه تثبيت الأداة على الجوال كان أفقيًا ومزدحمًا، والنص والزر يظهران في نفس السطر تقريبًا.
حقل رفع صورة التواصل كان طويلًا وعموديًا أكثر من اللازم، والمطلوب أن يكون الإدخال أفقيًا داخل مستطيل بورد dashed.
```

السبب:

```txt
ستايل .pwa-install-prompt في الجوال كان يحافظ على flex أفقي.
ستايل .contact-upload-field كان مبنيًا كمنطقة رفع عمودية بارتفاع كبير.
```

الحل:

```txt
تحويل .pwa-install-prompt في الشاشات الصغيرة إلى بطاقة عمودية: الرسالة في الأعلى وزر الإجراء في الأسفل وزر الإغلاق في الزاوية.
تحويل .contact-upload-field إلى مستطيل أفقي بحد dashed، أيقونة رفع صغيرة ونص قابل للاختصار عند طول اسم الملف.
رفع الإصدار إلى 0.2.85 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم نشر الإصدار 0.2.85 على Cloudflare Version ID: 41028654-5e67-4da0-896e-4be76d5a4a02.
✅ تم اختبار `/privacy` و `/contact` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8
rg -n "pwa-install-prompt|contact-upload-field|ثبّت الأداة|صورة أو لقطة" app -g "*.jsx" -g "*.css"
git status --short
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/privacy?v=0.2.85
curl.exe -I https://date-tool.com/contact?v=0.2.85
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

### ترتيب إشعارات التثبيت والكوكيز وتحديث أيقونة PWA - الإصدار 0.2.86

الأعراض:

```txt
إشعار تثبيت الأداة وإشعار الكوكيز كانا يظهران فوق بعضهما في أسفل الصفحة، مما يعطي انطباعًا أوليًا غير مرتب.
نافذة تثبيت Chrome على الكمبيوتر كانت ما زالت تظهر أيقونة قديمة/غير مناسبة بسبب كاش manifest أو أيقونة قديمة محفوظة في المتصفح.
```

السبب:

```txt
كل من .pwa-install-prompt و .privacy-consent-panel كان يملك position: fixed مستقلًا.
رابط manifest في metadata كان ثابتًا بدون رقم إصدار، وأيقونات manifest لم تكن تحمل query لكسر كاش المتصفح.
وجود app/manifest.js كملف Next خاص كان يضيف رابط manifest تلقائيًا بدون رقم الإصدار بجانب الرابط المخصص.
```

الحل:

```txt
إضافة .site-action-stack كمكدس ثابت في منتصف أسفل الشاشة يضم إشعار الكوكيز وإشعار تثبيت الأداة بشكل عمودي متتابع.
إعادة تصميم إشعار التثبيت ليقترب من شكل سيكشن الكوكيز ويعرض أيقونة التطبيق من appIconUrl المحفوظة في إدارة الهوية.
تمرير appIconUrl إلى مكون PwaInstallPrompt من SiteShell.
تحديث رابط manifest في layout.jsx ليحمل رقم الإصدار.
نقل منطق manifest من app/manifest.js إلى app/manifestConfig.js وإضافة route مستقل app/manifest.webmanifest/route.js حتى يظهر رابط manifest واحد فقط.
تحديث manifest لإضافة رقم الإصدار على روابط أيقونة التطبيق وفصل purpose إلى any و maskable.
تفضيل appIconUrl ثم logoUrl ثم faviconUrl في أيقونة التطبيق داخل manifest.
رفع الإصدار إلى 0.2.86 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ تم نشر الإصدار 0.2.86 على Cloudflare Version ID: c4e3c36e-c039-49b2-ab2e-1b18b0c2f98d.
✅ تم اختبار الصفحة الرئيسية على الإنتاج ورجعت 200.
✅ تم اختبار HTML الصفحة الرئيسية وتأكد وجود رابط manifest واحد فقط: /manifest.webmanifest?v=0.2.86.
✅ تم اختبار manifest وتأكد أن أيقونة التطبيق تأتي من appIconUrl مع v=0.2.86 و purpose منفصل any/maskable.
```

الأوامر المستخدمة:

```powershell
Get-Content PROJECT_MEMO.md -Encoding UTF8
rg -n "manifest|appIconUrl|pwa-install-prompt|privacy-consent|cookie|cookies|كوكيز|beforeinstallprompt|PwaInstallPrompt|Consent" app -g "*.js" -g "*.jsx" -g "*.css"
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.85
git status --short
git diff --check
npm run lint
npm run build
npx wrangler --version
npm run deploy
curl.exe -s https://date-tool.com/?v=0.2.86
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.86
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/?v=0.2.86
```

الملفات المتأثرة:

```txt
app/SiteShell.jsx
app/components/PwaInstallPrompt.jsx
app/globals.css
app/layout.jsx
app/manifest.js
app/manifestConfig.js
app/manifest.webmanifest/route.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### دعم التواريخ المستقبلية وبحث فرق التوقيت - الإصدار 0.2.87

الأعراض:

```txt
أداتا تحويل التاريخ وحساب المدة كانتا تستخدمان نطاق سنوات قريب من نطاق حاسبة العمر، لذلك لم يكن اختيار السنوات المستقبلية متاحًا كما يجب.
أداة فرق التوقيت بين مدينتين كانت تعتمد على قائمة مدن ثابتة بدل البحث عن مدينة مثل صفحة الطقس.
نتيجة فرق التوقيت لم تكن تعرض الوقت الحالي للمدينة الأولى والثانية بعد الحساب.
حقول أدوات الساعة كانت تحتاج توحيدًا أوضح مع خلفية ومقاسات أدوات التاريخ.
```

السبب:

```txt
نطاق سنوات أدوات التاريخ كان مشتركًا جزئيًا بين حاسبة العمر وأدوات التحويل/المدة.
أداة فرق التوقيت كانت مبنية على zone select ثابت بدل جلب المنطقة الزمنية من نتيجة بحث المدينة.
تنسيق حقول الساعة لم يكن يملك حاوية داخلية بنفس فكرة tool-mode-card في أدوات التاريخ.
```

الحل:

```txt
فصل سنوات حاسبة العمر عن سنوات أدوات التحويل وحساب المدة.
إبقاء حاسبة العمر حتى السنة الحالية فقط، وجعل التحويل والمدة يدعمان المستقبل حتى 2100 ميلادي وما يقابله هجريًا.
تحويل فرق التوقيت إلى حقلي بحث عن المدن باستخدام Open-Meteo Geocoding من المتصفح بدون مفاتيح سرية.
عرض فرق التوقيت مع الوقت الحالي لكل مدينة في النتيجة.
إضافة تنسيق مشترك لحاويات اختيار الساعة وبحث المدن ونتيجة فرق التوقيت لتقترب من شكل أدوات التاريخ.
رفع الإصدار إلى 0.2.87 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed أثناء البناء المحلي بسبب تقييد الشبكة في بيئة Codex فقط، لكن البناء اكتمل بنجاح.
✅ تم نشر الإصدار 0.2.87 على Cloudflare Version ID: a5ff65a1-ce70-427a-944b-15e3fa6e243c.
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw AGENTS.md
Get-Content -Raw PROJECT_MEMO.md
git status --short
rg -n "gregAgeYears|gregConvYears|hijriAgeYears|hijriToolYears|makeYears|maxSupported" app\page.jsx app\components\home\HomeSections.jsx
rg -n "defaultFromCity|searchCityTimezone|timezoneSearch|timezone-search|calculateTimezoneDiff|timezoneDiff|time-select-grid|tool-widget" app\clock\page.jsx app\globals.css
npm version 0.2.87 --no-git-tag-version
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/?v=0.2.87
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/clock?v=0.2.87
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/weather?v=0.2.87
```

الملفات المتأثرة:

```txt
app/page.jsx
app/components/home/HomeSections.jsx
app/clock/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تعبئة تاريخ اليوم وتوحيد عناوين الساعة - الإصدار 0.2.88

الأعراض:

```txt
حقول التاريخ كانت تظهر placeholders فقط حتى يختار المستخدم اليوم والشهر والسنة يدويًا، مما يجعل الأدوات أقل وضوحًا عند أول استخدام.
عناوين أدوات الساعة كانت تظهر بأيقونة جانبية مختلفة عن عناوين أدوات التاريخ.
بطاقة نصيحة الطقس اليومية كانت تحتاج فصل النص داخل مساحة أكثر وضوحًا وتناسقًا.
```

السبب:

```txt
DateDropdowns لم يكن يملك قيمة افتراضية لتاريخ اليوم عند أول تفاعل.
عناوين بطاقات الساعة كانت تعتمد نمط .tool-widget-title العام بدل نمط h2 المستخدم في أدوات التاريخ.
نص بطاقة النصيحة كان نصًا مباشرًا داخل البطاقة بدون حاوية داخلية شبيهة بخلفية أدوات الإدخال.
```

الحل:

```txt
إضافة defaultValues إلى DateDropdowns وتعبئة الحقول الفارغة بتاريخ اليوم عند أول focus أو pointer down فقط.
تمرير تاريخ اليوم الميلادي والهجري من app/page.jsx إلى كل أدوات التاريخ.
توحيد عنواني time-converter-card و timezone-diff-card مع عناوين أدوات التاريخ بخطين جانبيين وإخفاء أيقونة العنوان.
تحسين .advice-card بإضافة خلفية داخلية للنص وتخفيف حجم الخط على الجوال.
رفع الإصدار إلى 0.2.88 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed أثناء البناء المحلي بسبب تقييد الشبكة في بيئة Codex فقط، لكن البناء اكتمل بنجاح.
⚠️ npm run deploy رفع Worker والأصول، ثم أرجع Cloudflare API خطأ 503 في خطوة subdomain بعد الرفع.
✅ تم التأكد أن الإنتاج يعرض الإصدار 0.2.88 بعد النشر.
✅ تم نشر الإصدار 0.2.88 على Cloudflare Version ID: b929c5ce-7106-424b-8dc6-6d4952b31073.
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
git status --short
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
rg -n "function DateDropdowns|DateDropdowns|tool-widget-title|advice-card|time-select-grid|timezone-search-grid|action-btn|tool-mode-card" app\components\home\HomeSections.jsx app\page.jsx app\clock\page.jsx app\weather\page.jsx app\globals.css
npm run lint
git diff --check
npm version 0.2.88 --no-git-tag-version
npm run build
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/?v=0.2.88
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/clock?v=0.2.88
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/weather?v=0.2.88
npx wrangler versions list
```

الملفات المتأثرة:

```txt
app/components/home/HomeSections.jsx
app/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين بطاقات أدوات الساعة ونتيجة فرق التوقيت - الإصدار 0.2.89

الأعراض:

```txt
أداة تحويل الساعة كانت تعرض زر الإجراء والنتيجة خارج مربع الإدخال الداكن، بينما أدوات التاريخ تعرض التفاعل كاملًا داخل نفس الحاوية.
نتيجة فرق التوقيت كانت طويلة وتعرض علاقة المدينة كاملة مثل أمام/خلف مع اسم المنطقة والدولة.
أوقات المدن داخل نتيجة فرق التوقيت كانت تعرض الثواني، مما يجعل النص أطول ومتحركًا أكثر من اللازم.
زر تبديل نظام الساعة في البانر كان بريديُوس دائريًا جدًا مقارنة بباقي أزرار الهوية.
```

السبب:

```txt
هيكل JSX في صفحة الساعة كان يفصل حاوية الإدخال عن زر الإجراء والنتيجة.
دالة نتيجة فرق التوقيت كانت تستخدم label القادم من نتيجة البحث الجغرافي الكامل بدل النص الذي كتبه المستخدم.
دالة formatTime كانت تضيف الثواني دائمًا ولا تسمح بتعطيلها في مواضع محددة.
```

الحل:

```txt
نقل زر التحويل والنتيجة وزر مشاركة النتيجة داخل time-select-grid.
نقل زر حساب فرق التوقيت والخطأ والنتيجة وزر المشاركة داخل timezone-search-grid.
إضافة time-select-fields و timezone-search-fields للحفاظ على توزيع الحقول داخل الحاوية الداكنة.
جعل نتيجة فرق التوقيت مختصرة مثل "فرق التوقيت: ساعتين".
حفظ اسم المدينة المعروض في النتيجة كما كتبه المستخدم في خانة الإدخال، مع إبقاء timezone الحقيقي من Open-Meteo للحساب.
إضافة خيار includeSeconds إلى formatTime واستخدامه لإخفاء الثواني داخل نتيجة فرق التوقيت فقط.
تقليل border-radius زر تبديل 12/24 في بانر الساعة.
رفع الإصدار إلى 0.2.89 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح قبل رفع الإصدار.
✅ git diff --check نجح.
✅ npm run lint نجح بعد رفع الإصدار.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch failed أثناء البناء المحلي بسبب تقييد الشبكة في بيئة Codex فقط، لكن البناء اكتمل بنجاح.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.89 على Cloudflare Version ID: 98781a64-b9b0-4cd7-9a5a-89575d081f2f.
✅ تم اختبار `/clock` و `/` على الإنتاج ورجعت HTTP 200.
✅ تم التأكد أن صفحة `/clock` تحمل manifest الإصدار 0.2.89 وملف الساعة الجديد.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
git status --short
rg -n "time-converter|timezone|clock-format-toggle|tool-result|share|action-btn|calculateTimezoneDiff|formatTime|Intl.DateTimeFormat|current" app\clock\page.jsx app\globals.css
npm run lint
npm version 0.2.89 --no-git-tag-version
git diff --check
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/clock?v=0.2.89
curl.exe -s https://date-tool.com/clock?v=0.2.89
curl.exe -s -o NUL -w "%{http_code}" https://date-tool.com/?v=0.2.89
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

### قوالب مشاركة الأدوات وإعادة نصيحة الطقس - الإصدار 0.2.90

الأعراض:

```txt
بطاقة نصيحة الخروج في صفحة الطقس أصبحت تحتوي صندوقًا داخليًا داكنًا لا يتناسق مع الشكل المطلوب.
نص زر/مشاركة تحويل الساعة كان عامًا ولا يوضح أن الوقت المدخل يساوي النتيجة بنظام 12 ساعة.
نص مشاركة فرق التوقيت لم يكن قابلًا للتخصيص من لوحة الإدارة.
إدارة محتوى الأدوات لا تعرض جدولًا واضحًا لمعرفات متغيرات المشاركة مثل المدخلات والنتيجة والمدينة.
```

السبب:

```txt
تمت إضافة تنسيق خاص لـ advice-card p في CSS أضاف خلفية داخلية منفصلة.
نصوص المشاركة كانت ثابتة داخل صفحات الواجهة بدل أن تأتي من إعدادات toolSettings.
normalizeToolSettings لم يكن يحفظ أو يطبّع قوالب مشاركة لكل أداة.
```

الحل:

```txt
إزالة التنسيق الداخلي الخاص بنص بطاقة نصيحة الطقس وإرجاعها للنص المباشر داخل الكرت.
إضافة shareTemplates و SHARE_TEMPLATE_DEFINITIONS إلى app/toolSettings.js لكل من التاريخ والساعة والطقس.
إضافة renderShareTemplate لاستبدال المتغيرات الآمنة مثل {input} و {result} و {fromCity} و {toCity}.
إضافة جدول إدارة قوالب المشاركة داخل /admin/tool-management/* يعرض معرف المشاركة والمتغيرات المتاحة وحقل نص المشاركة.
ربط مشاركة المواعيد ونتائج أدوات التاريخ بقوالب إدارة أداة التاريخ.
ربط مشاركة تحويل الساعة وفرق التوقيت بقوالب إدارة أداة الساعة، مع عرض نص الزر كجملة مفيدة.
رفع الإصدار إلى 0.2.90 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح قبل رفع الإصدار.
✅ git diff --check نجح قبل رفع الإصدار.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.90 على Cloudflare Version ID: 0b3a593e-78cd-45d9-89c5-d343d345a191.
✅ تم اختبار `/`, `/clock`, `/weather`, و `/admin/tool-management/clock` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "share|مشاركة|settings|toolSettings|subtools|faq|events|advice|نصيحة|tool-result|timezone|ClockPage|WeatherPage|Date" app
rg -n "admin.*tool|Tool|tools|إدارة الأدوات|toolSettings|subtools|faq|events|share|مشاركة" app\admin app\components app
node -e "const fs=require('fs'); const s=fs.readFileSync('app/toolSettings.js','utf8'); console.log(s.slice(0,1800));"
git show HEAD~1:app/globals.css
git show HEAD~2:app/globals.css
npm run lint
git diff --check
npm version 0.2.90 --no-git-tag-version
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/?v=0.2.90"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/clock?v=0.2.90"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/weather?v=0.2.90"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/clock?v=0.2.90"
```

الملفات المتأثرة:

```txt
app/toolSettings.js
app/admin/tool-management/ToolContentSettings.jsx
app/admin/AdminDashboard.css
app/clock/page.jsx
app/page.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اعتماد نصوص أزرار المشاركة - الإصدار 0.2.91

الأعراض:

```txt
نصوص مشاركة نتائج أدوات التاريخ كانت افتراضية ومباشرة أكثر من اللازم.
زر مشاركة نتيجة أدوات التاريخ كان يعرض نصًا عامًا مثل "مشاركة النتيجة" بدل أن يعكس نص القالب المعتمد.
إذا كانت القوالب القديمة محفوظة في Firebase كقيم افتراضية، فقد لا تظهر النصوص الجديدة بمجرد تغيير الافتراضي في الكود.
```

السبب:

```txt
ResultCard كان يستخدم labels.shareResult كنص ثابت للزر.
قوالب التاريخ الافتراضية في toolSettings كانت مختصرة جدًا.
normalizeShareTemplates كان يحترم القيم المحفوظة دائمًا حتى لو كانت مجرد القوالب الافتراضية القديمة.
```

الحل:

```txt
اعتماد نصوص مشاركة افتراضية أجمل لأداة العمر والتحويل والمدة والمواعيد.
إضافة getShareButtonLabel كدالة مشتركة لاستخراج أول سطر مفيد من نص المشاركة.
ربط زر مشاركة نتيجة أدوات التاريخ بـ enteredDateInfo.shareButtonLabel.
تحديث صفحة الساعة لاستخدام getShareButtonLabel المشتركة بدل دالة محلية مكررة.
إضافة LEGACY_SHARE_TEMPLATES لاستبدال القوالب القديمة فقط إذا كانت ما زالت مطابقة للافتراضي السابق، مع عدم لمس النصوص المخصصة.
رفع الإصدار إلى 0.2.91 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح قبل رفع الإصدار.
✅ git diff --check نجح قبل رفع الإصدار.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.91 على Cloudflare Version ID: 82fcc105-f627-4a4a-adbe-bb27dd40acdb.
✅ تم اختبار `/`, `/clock`, `/admin/tool-management/date`, و `/admin/tool-management/clock` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "share|مشاركة|shareText|handleShare|enteredDateInfo|shareTemplates|ageResult|dateConversionResult|durationResult" app\components\home app\page.jsx app\toolSettings.js app\globals.css
npm run lint
npm version 0.2.91 --no-git-tag-version
git diff --check
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/?v=0.2.91"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/clock?v=0.2.91"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/date?v=0.2.91"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/clock?v=0.2.91"
```

الملفات المتأثرة:

```txt
app/toolSettings.js
app/page.jsx
app/components/home/HomeSections.jsx
app/clock/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تثبيت تسمية أزرار المشاركة - الإصدار 0.2.92

الأعراض:

```txt
زر مشاركة نتيجة أداة العمر كان يعرض أول سطر من نص المشاركة المخصص بدل اسم زر ثابت.
هذا جعل الزر طويلًا وغير مناسب بصريًا على الجوال.
```

السبب:

```txt
تمت إضافة getShareButtonLabel في الإصدار السابق لاستخراج تسمية الزر من نص المشاركة نفسه.
هذا خلط بين النص الذي يتم مشاركته فعليًا وبين تسمية الزر داخل الواجهة.
```

الحل:

```txt
إرجاع أزرار مشاركة نتائج التاريخ إلى labels.shareResult كنص واجهة ثابت.
إرجاع أزرار مشاركة نتائج الساعة إلى نص ثابت "مشاركة النتيجة".
الإبقاء على shareText و renderShareTemplate كما هي حتى تستمر قوالب المشاركة من الإدارة في العمل عند النسخ/المشاركة.
حذف getShareButtonLabel لأنها لم تعد مطلوبة بعد فصل التسمية عن محتوى المشاركة.
رفع الإصدار إلى 0.2.92 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ git diff --check نجح.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.92 على Cloudflare Version ID: 6c9687f1-2f3e-4c22-bd00-8809f2077152.
✅ تم اختبار `/`, `/clock`, `/admin/tool-management/date`, و `/admin/tool-management/clock` على الإنتاج ورجعت HTTP 200.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "getShareButtonLabel|shareButtonLabel|shareResult|مشاركة النتيجة|شارك النتيجة|clock-result-share|share-btn" app
npm version 0.2.92 --no-git-tag-version
npm run lint
git diff --check
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/?v=0.2.92"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/clock?v=0.2.92"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/date?v=0.2.92"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/clock?v=0.2.92"
```

الملفات المتأثرة:

```txt
app/toolSettings.js
app/page.jsx
app/components/home/HomeSections.jsx
app/clock/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين إدارة قوالب المشاركة - الإصدار 0.2.93

الأعراض:

```txt
جدول قوالب المشاركة في /admin/tool-management/date كان يعرض textarea طويلًا داخل كل صف.
هذا جعل الصفحة مزدحمة وصعبة القراءة على الجوال، خصوصًا عند وجود نصوص مشاركة طويلة.
كان المدير يحتاج طريقة سريعة لمعاينة النص بعد استبدال المتغيرات بقيم مفهومة.
```

السبب:

```txt
واجهة إدارة قوالب المشاركة وضعت حقل الكتابة مباشرة في الجدول بدل فصل التحرير والمعاينة داخل إجراءات.
لم تكن هناك معاينة افتراضية تستبدل المتغيرات مثل {result} و {url} بقيم نموذجية.
```

الحل:

```txt
تحويل صفوف قوالب المشاركة إلى جدول بأعمدة: معرف المشاركة، المتغيرات المتاحة، ملخص النص، الإجراءات.
إضافة زر قلم يفتح نافذة تحرير تحتوي textarea كبيرًا للكتابة.
إضافة زر عين يفتح نافذة معاينة بالقيم الافتراضية لكل المتغيرات المعروفة.
إبقاء منطق الحفظ كما هو داخل toolSettings حتى لا تتغير بنية البيانات في Firebase.
رفع الإصدار إلى 0.2.93 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح قبل رفع الإصدار.
✅ git diff --check نجح قبل رفع الإصدار.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.93 على Cloudflare Version ID: 1b519750-bb29-4370-ac1c-d541a1cd3337.
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "shareTemplates|tool-share|قوالب|متغيرات|textarea|preview|tool-management" app\admin app\components app\toolSettings.js
npm run lint
git diff --check
npm version 0.2.93 --no-git-tag-version
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/date?v=0.2.93"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/admin/tool-management/clock?v=0.2.93"
curl.exe -s -o NUL -w "%{http_code}" "https://date-tool.com/?v=0.2.93"
```

الملفات المتأثرة:

```txt
app/admin/tool-management/ToolContentSettings.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### التحرير المباشر لقوالب المشاركة - الإصدار 0.2.94

الأعراض:

```txt
واجهة قوالب المشاركة أصبحت أنظف بعد إضافة أزرار القلم والعين، لكن المستخدم أراد الحفاظ على شكل الملخص نفسه.
لم تعد الحاجة قائمة لزر التحرير أو زر المعاينة إذا أمكن إظهار النص الكامل أسفل الملخص مباشرة.
```

السبب:

```txt
الإصدار السابق فصل تحرير نص المشاركة ومعاينته داخل نوافذ مستقلة.
هذا أضاف خطوة إضافية رغم أن شكل بطاقة الملخص كان مناسبًا للاستخدام المباشر.
```

الحل:

```txt
إزالة عمود الإجراءات من جدول قوالب المشاركة.
إزالة أزرار القلم والعين ونوافذ التحرير والمعاينة المرتبطة بها.
عرض ملخص نص المشاركة في بطاقة مختصرة.
عرض مربع النص الكامل القابل للتعديل أسفل الملخص وبنفس روح التنسيق.
إبقاء زر حفظ نصوص الأداة هو المسؤول عن حفظ التغييرات إلى Firebase.
رفع الإصدار إلى 0.2.94 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح قبل رفع الإصدار.
✅ git diff --check نجح قبل رفع الإصدار.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.94 على Cloudflare Version ID: fdf57462-4433-49ca-bf72-d04e72d3125e.
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "shareModal|openShareModal|closeShareModal|renderSharePreview|SHARE_PREVIEW_VALUES|tool-share-modal|tool-share-actions|tool-share-preview-box" app\admin\tool-management\ToolContentSettings.jsx app\admin\AdminDashboard.css
npm run lint
git diff --check
npm version 0.2.94 --no-git-tag-version
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.2.94
curl.exe -I https://date-tool.com/admin/tool-management/clock?v=0.2.94
curl.exe -I https://date-tool.com/?v=0.2.94
```

الملفات المتأثرة:

```txt
app/admin/tool-management/ToolContentSettings.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### معاينة قوالب المشاركة بالقيم الافتراضية - الإصدار 0.2.95

الأعراض:

```txt
بطاقة ملخص قالب المشاركة داخل `/admin/tool-management/date` كانت تعرض المتغيرات الخام مثل `{toolTitle}` و `{result}`.
المستخدم أراد أن تعرض البطاقة معاينة مفهومة بالقيم الافتراضية، مع إبقاء مربع النص الكامل كما هو قابلًا للتعديل.
```

السبب:

```txt
بعد إزالة أزرار المعاينة في الإصدار السابق أصبحت دالة الملخص تستخدم نص القالب الخام مباشرة بدل تمريره على محرك استبدال المتغيرات.
```

الحل:

```txt
إعادة دالة معاينة داخلية آمنة بقيم افتراضية فقط دون إرجاع أزرار القلم/العين أو النوافذ.
ربط بطاقة الملخص بدالة المعاينة حتى تظهر الرسالة كما ستبدو تقريبًا عند المشاركة.
إبقاء textarea يعرض النص الأصلي بالمتغيرات حتى يبقى قابلًا للتعديل والحفظ.
دعم فواصل الأسطر داخل بطاقة الملخص مع الحفاظ على الاختصار البصري.
رفع الإصدار إلى 0.2.95 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ npm run lint نجح.
✅ npm run build نجح، مع ظهور رسائل fetch failed بسبب تقييد الشبكة داخل بيئة Codex فقط دون كسر البناء.
✅ npm run deploy نجح.
✅ تم نشر الإصدار 0.2.95 على Cloudflare Version ID: 41c3c5b5-825b-4da5-b082-dfc9290d45f4.
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw AGENTS.md
Get-Content -Raw PROJECT_MEMO.md
Get-Content -Raw app\admin\tool-management\ToolContentSettings.jsx
Get-Content -Raw app\admin\AdminDashboard.css
Get-Content -Raw app\toolSettings.js
git status --short
rg -n "tool-share-template|tool-template-vars" app\admin\AdminDashboard.css app\admin\tool-management\ToolContentSettings.jsx
npm run lint
npm version 0.2.95 --no-git-tag-version
npm run build
Get-Content -Raw C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.2.95
curl.exe -I https://date-tool.com/admin/tool-management/clock?v=0.2.95
curl.exe -I https://date-tool.com/?v=0.2.95
```

الملفات المتأثرة:

```txt
app/admin/tool-management/ToolContentSettings.jsx
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نقل إعدادات تثبيت التطبيق إلى الهوية - الإصدار 0.2.96

الأعراض:

```txt
إعدادات زر تثبيت التطبيق وهوية التطبيق المثبت كانت موزعة في إدارة الأداة العامة.
أيقونات اختصارات PWA كانت تعتمد على ملفات ثابتة احتياطية بدل التحكم بها من الهوية.
رقم نسخة الإدارة كان غير مفصول بوضوح عن رقم نسخة الموقع الأساسي.
```

السبب:

```txt
إعدادات PWA أصبحت جزءًا من الهوية البصرية أكثر من كونها إعدادًا عامًا للأداة.
ملف manifest يحتاج قراءة روابط أيقونات التطبيق والاختصارات من إعدادات الهوية المحفوظة في Firebase مع fallback آمن.
```

الحل:

```txt
نقل سيكشن زر تثبيت الأداة من `/admin/tools` إلى `/admin/identity`.
إضافة رفع أيقونة التطبيق المثبت وأيقونات اختصارات التاريخ والساعة والطقس إلى R2 من صفحة الهوية.
ربط حقول `pwaShortcutDateIconUrl` و `pwaShortcutClockIconUrl` و `pwaShortcutWeatherIconUrl` بملف manifest.
إضافة زر "إظهار مجددًا" لتنبيه التثبيت من صفحة الهوية.
فصل `ADMIN_VERSION` عن `APP_VERSION` وإظهار نسخة الإدارة داخل Shell الإدارة.
إضافة إمكانية تعطيل زر مشاركة كل قالب من إعدادات الأدوات مع استمرار عرض زر المشاركة باسم ثابت في الواجهة.
رفع الإصدار إلى 0.2.96 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح بعد موافقة صريحة على نشر الإنتاج.
✅ تم نشر الإصدار 0.2.96 على Cloudflare Version ID: 8abddc3f-347f-4b92-bad1-28026675c476.
✅ تم اختبار `/`, `/admin/identity`, و `/manifest.webmanifest` على الإنتاج بعد النشر.
⏳ يلزم اختبار حفظ إعدادات PWA من `/admin/identity` بجلسة مدير فعلية بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
Get-Content C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
rg -n "pwaInstallPrompt|appIconUrl|manifest|shareEnabled" app
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin/identity?v=0.2.96
curl.exe -I https://date-tool.com/?v=0.2.96
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.96
git diff --stat
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/admin/tools/page.jsx
app/admin/AdminDashboard.css
app/admin/AdminShell.jsx
app/admin/tool-management/ToolContentSettings.jsx
app/api/media/upload/route.js
app/api/site-config/route.js
app/firebase.js
app/manifestConfig.js
app/toolSettings.js
app/page.jsx
app/clock/page.jsx
app/components/home/HomeSections.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تصحيح مصدر Link Preview من الهوية - الإصدار 0.2.97

الأعراض:

```txt
في `/admin/identity` كان خيار "استخدم عنوان الهوية الأساسي" يعرض "أدوات التاريخ الشاملة" رغم أن اسم الهوية الحالي مختلف.
خيار "استخدم السلوغن الأساسي" كان يعرض وصفًا قديمًا عند التفعيل.
```

السبب:

```txt
دالة عارض الرابط كانت تعطي أولوية لحقول `mainSEO.title` و `mainSEO.description` قبل `toolDisplayName` و `toolSlogan`.
هذه الحقول قديمة أو منفصلة عن الاسم والسلوغن الحاليين المستخدمين في الهيدر والتطبيق.
```

الحل:

```txt
تعديل `resolveLinkPreview` حتى تكون الأولوية لاسم الهوية الحالي `toolDisplayName` ثم SEO كاحتياط.
تعديل وصف المشاركة حتى تكون الأولوية للسلوغن الحالي `toolSlogan` ثم SEO كاحتياط.
تحديث المعاينة داخل صفحة الهوية لتعرض القيمة الفعلية نفسها التي ستستخدم عند المشاركة.
رفع الإصدار إلى 0.2.97 وتوثيقه في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ npm run deploy نجح بعد موافقة صريحة على نشر الإنتاج.
✅ تم نشر الإصدار 0.2.97 على Cloudflare Version ID: 7c3b2971-b646-4bf0-a534-724cf3242e46.
✅ تم اختبار `/`, `/admin/identity`, و `/manifest.webmanifest` على الإنتاج بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md
Select-String -Path app\admin\identity\page.jsx -Pattern "useSiteTitle|useSiteSlogan|switch-current-value|mainSEO|toolDisplayName|toolSlogan"
Select-String -Path app\layout.jsx,app\api\site-config\route.js -Pattern "resolveLinkPreview|mainSEO|toolDisplayName|toolSlogan|linkPreview"
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/?v=0.2.97
curl.exe -I https://date-tool.com/admin/identity?v=0.2.97
curl.exe -s https://date-tool.com/manifest.webmanifest?v=0.2.97
```

الملفات المتأثرة:

```txt
app/linkPreview.js
app/admin/identity/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحسين صفحة الهوية وتحميل الإدارة - إصدار الإدارة 0.1.1

الأعراض:

```txt
كانت شاشة تحميل صفحات الإدارة تظهر بخلفية بيضاء قبل اكتمال التحقق والتحميل.
صفحة إدارة الهوية كانت مزدحمة على العروض الضيقة بسبب بقاء معاينة الهوية بجانب حقول التعديل.
ألوان روابط السايد بار في الوضع الداكن كانت أقل وضوحًا من بقية الهوية.
كان يلزم توثيق تغييرات الإدارة دون رفع نسخة الموقع الأساسية.
```

السبب:

```txt
تنسيق .admin-dashboard-loading كان يستخدم خلفية فاتحة ثابتة.
كسر العرض responsive لصفحة الهوية كان يبدأ عند 900px فقط، وهذا لا يناسب وجود السايد بار الثابت.
قسم بيانات العلامة لم يكن ضمن بطاقة عنوان واضحة مثل بقية سكاشن الإدارة الحديثة.
```

الحل:

```txt
تغيير شاشة تحميل الإدارة إلى خلفية داكنة متدرجة متوافقة مع هوية الإدارة.
إضافة سيكشن "التعديل الأساسي للأداة" أعلى صفحة الهوية.
تحسين بطاقة بيانات العلامة ومعاينة الهوية.
جعل معاينة الهوية تنتقل أسفل حقول التعديل عند العروض الضيقة داخل لوحة الإدارة.
تحسين ألوان وروابط السايد بار في الوضع الداكن.
رفع ADMIN_VERSION إلى 0.1.1 دون تغيير APP_VERSION أو package.json/package-lock.json.
```

الحالة:

```txt
✅ تم تنفيذ التعديل محليًا.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
✅ لم يتم تغيير إصدار الموقع الأساسي 0.2.97.
✅ npm run deploy نجح بعد موافقة صريحة على نشر الإنتاج.
✅ تم نشر تحديث الإدارة على Cloudflare Version ID: aa04eb71-ac54-47fb-b032-a12f193064a4.
✅ تم اختبار `/admin`, `/admin/identity`, و `/` على الإنتاج بعد النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md -TotalCount 80
git status --short
git diff -- app/admin/AdminDashboard.css
git diff -- app/admin/identity/page.jsx
git diff -- app/version.js VERSION_LOG.md
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin/identity?v=0.1.1
curl.exe -I https://date-tool.com/admin?v=0.1.1
curl.exe -I https://date-tool.com/?v=0.2.97
```

الملفات المتأثرة:

```txt
app/admin/identity/page.jsx
app/admin/AdminDashboard.css
app/version.js
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### إضافة شعار أساسي كأصل تصميم - بدون تغيير إصدار

الأعراض:

```txt
احتاج المستخدم شعارًا مناسبًا للموقع الأساسي يكون موجودًا داخل المشروع ويمكن فتحه من Visual Studio Code.
```

السبب:

```txt
مجلد public كان يحتوي أيقونات اختصارات PWA فقط، ولم يكن هناك ملف شعار مستقل محفوظ ضمن أصول الهوية في المستودع.
```

الحل:

```txt
إضافة شعار Vector بصيغة SVG داخل public/brand باسم date-tools-primary-logo.svg.
تصميم الشعار يجمع بين الساعة والتقويم وعلامة التحويل بما يناسب أدوات التاريخ والساعة والطقس.
فتح ملف الشعار في Visual Studio Code من داخل المشروع.
عدم ربط الشعار تلقائيًا بالإنتاج أو إعدادات R2 حتى يبقى القرار النهائي من لوحة إدارة الهوية.
عدم تغيير APP_VERSION أو ADMIN_VERSION لأن التعديل أصل تصميم غير منشور وظيفيًا.
```

الحالة:

```txt
✅ تم إنشاء ملف الشعار داخل المشروع.
✅ تم التحقق من صلاحية SVG كملف XML.
✅ تم فتح الملف في Visual Studio Code.
⏳ لم يتم نشر الشعار أو ربطه بإعدادات الهوية بعد.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md -TotalCount 90
Get-ChildItem -Path public -Force
[xml](Get-Content -Raw public\brand\date-tools-primary-logo.svg) | Out-Null
Get-Command code -ErrorAction SilentlyContinue
code -r public\brand\date-tools-primary-logo.svg
```

الملفات المتأثرة:

```txt
public/brand/date-tools-primary-logo.svg
PROJECT_MEMO.md
```

---

### حذف الشعار التجريبي غير المعتمد - بدون تغيير إصدار

الأعراض:

```txt
الشعار التجريبي الذي أضيف كأصل تصميم لم يعجب المستخدم وطلب حذفه من المشروع.
```

السبب:

```txt
الشعار كان مجرد مقترح SVG محفوظ محليًا داخل public/brand ولم يتم اعتماده في لوحة الهوية أو نشره كهوية رسمية.
```

الحل:

```txt
حذف public/brand/date-tools-primary-logo.svg من المستودع.
عدم تغيير APP_VERSION أو ADMIN_VERSION لأن الحذف يخص أصل تصميم غير مربوط وظيفيًا بالموقع أو الإدارة.
عدم تشغيل npm run deploy لأن الشعار لم يكن مستخدمًا على الإنتاج.
```

الحالة:

```txt
✅ تم حذف ملف الشعار التجريبي.
✅ بقيت إعدادات الهوية الحالية كما هي دون تعديل.
⏳ يمكن لاحقًا إنشاء شعار جديد أو رفع شعار معتمد من صفحة إدارة الهوية إلى R2.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md -TotalCount 90
Test-Path public\brand\date-tools-primary-logo.svg
git status --short
Select-String -Path PROJECT_MEMO.md -Pattern "شعار SVG|date-tools-primary-logo|أصل تصميم"
```

الملفات المتأثرة:

```txt
public/brand/date-tools-primary-logo.svg
PROJECT_MEMO.md
```

---

### تحسينات واجهة إدارة الإعلانات وإدارة الأدوات - admin 0.1.2

الأعراض:

```txt
في الجوال كانت أزرار إجراءات جدول الإعلانات القديمة تظهر عمودية بدل أن تبقى أفقية.
بطاقات إحصائيات الحملات في صفحة إدارة الإعلانات كانت تحتاج ترتيبًا أجمل وأوضح.
زر تبديل المظهر في شريط الإدارة كان يدور بكامل الزر عند الهوفر بدل دوران الأيقونة فقط.
زر الخروج كان يعرض كلمة "خروج" في الشاشات الصغيرة ويزاحم الأيقونات.
بطاقات إدارة الأدوات كانت تعرض شارات حالة غير مطلوبة.
جدول الأدوات الفرعية كان يعرض معرف الأداة التقني بدل اسم مختصر مفهوم.
جدول قوالب المشاركة كان مزدحمًا بعمود النص الحالي.
زر إضافة سؤال في قسم الأسئلة الإضافية كان بجانب العنوان بدل أسفل التوضيح.
```

السبب:

```txt
بعض قواعد CSS العامة للجداول والأزرار لم تكن صارمة بما يكفي على الشاشات الصغيرة.
عرض إدارة الأدوات احتوى عناصر مساعدة قديمة أصبحت غير ضرورية بعد اعتماد النوافذ المنبثقة للتعديل والمعاينة.
```

الحل:

```txt
تثبيت أزرار إجراءات الجداول على صف أفقي مع منع الالتفاف، وإعطاء عمود الإجراءات في جدول الإعلانات القديمة عرضًا مناسبًا داخل التمرير الأفقي.
تحسين بطاقات إحصائيات الحملات بخلفية ناعمة وتوسيط النصوص والأرقام.
نقل دوران الهوفر في زر تبديل المظهر إلى الأيقونة الداخلية فقط.
إخفاء نص زر الخروج على الشاشات الصغيرة مع إبقاء الأيقونة.
إزالة شارات حالة أدوات التاريخ والساعة والطقس من صفحة إدارة الأدوات.
تغيير أول عمود في جدول الأدوات الفرعية إلى اسم مختصر مفهوم، وإبقاء الاسم المعروض قابلًا للتعديل.
حذف عمود النص الحالي من جدول قوالب المشاركة والإبقاء على أزرار التفعيل والتعديل والمعاينة.
نقل زر إضافة سؤال أسفل نص التوضيح في قسم الأسئلة الإضافية.
رفع نسخة منصة الإدارة فقط إلى 0.1.2 دون تغيير نسخة الموقع الأساسية 0.2.97.
```

الحالة:

```txt
✅ تم تنفيذ تعديلات واجهة الإدارة المطلوبة.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch EACCES أثناء build بسبب تقييد الشبكة المحلي، لكنها لم تُفشل البناء.
⏳ لم يتم نشر نسخة الإدارة 0.1.2 على الإنتاج ضمن هذه المهمة.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md -TotalCount 120
Get-Content -Path app\admin\AdminDashboard.css | Select-Object -Skip ...
Select-String -Path app\admin\tool-management\ToolContentSettings.jsx -Pattern ...
git diff --check
npm run lint
npm run build
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/admin/tool-management/page.jsx
app/admin/tool-management/ToolContentSettings.jsx
app/version.js
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نشر نسخة الإدارة 0.1.2 على الإنتاج

الأعراض:

```txt
بعد تحسين واجهة إدارة الإعلانات وإدارة الأدوات، وافق المستخدم صراحة على نشر الإنتاج عبر npm run deploy.
```

السبب:

```txt
التعديلات كانت قد رُفعت إلى GitHub ولم تكن منشورة بعد على Cloudflare Workers.
```

الحل:

```txt
تشغيل npm run deploy باستخدام OpenNext for Cloudflare.
فحص استجابة صفحات الإنتاج المهمة بعد النشر.
```

الحالة:

```txt
✅ npm run deploy نجح.
✅ تم نشر Worker datetools بنجاح.
✅ Cloudflare Version ID: d0c97ec4-8e6d-4664-8fa2-9cd62105acae.
✅ https://date-tool.com/?v=0.2.97 ردت 200 OK.
✅ https://date-tool.com/admin/ads?v=0.1.2 ردت 200 OK.
✅ https://date-tool.com/admin/tool-management/date?v=0.1.2 ردت 200 OK.
⚠️ ظهر تحذير OpenNext المعتاد بأن Windows ليس البيئة المثلى، ولم يمنع النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md -TotalCount 120
Get-Content -Path C:\Users\d7mi6\.codex\skills\wrangler\SKILL.md
npm run deploy
curl.exe -I https://date-tool.com/admin/ads?v=0.1.2
curl.exe -I https://date-tool.com/admin/tool-management/date?v=0.1.2
curl.exe -I https://date-tool.com/?v=0.2.97
```

الملفات المتأثرة:

```txt
PROJECT_MEMO.md
```

---

### توحيد زر الخروج في شريط الإدارة على الجوال - admin 0.1.3

الأعراض:

```txt
زر الخروج في شريط الإدارة على الشاشات الصغيرة كان يظهر كزر ضيق مختلف عن أزرار التحكم الافتراضية بجانبه.
```

السبب:

```txt
قاعدة الجوال كانت تخفي نص زر الخروج لكنها لم تثبت ارتفاعه وبادينغه وشكله بنفس قياسات أزرار الناف بار الأخرى.
```

الحل:

```txt
تثبيت زر الخروج على قياس مربع 52px في الجوال، وتوسيط الأيقونة، وتوحيد نصف القطر مع أزرار التحكم، مع إبقاء اللون التحذيري الهادئ.
رفع نسخة منصة الإدارة فقط إلى 0.1.3 دون تغيير نسخة الموقع الأساسية 0.2.97.
```

الحالة:

```txt
✅ تم تنفيذ تعديل CSS المطلوب.
✅ git diff --check نجح.
✅ npm run lint نجح.
✅ npm run build نجح.
⚠️ ظهرت رسائل fetch EACCES أثناء build المحلي بسبب تقييد الشبكة، ولم تُفشل البناء.
✅ npm run deploy نجح.
✅ تم نشر Worker datetools بنجاح.
✅ Cloudflare Version ID: 115e8215-fbf6-4519-8dfa-1a464f175b9d.
✅ https://date-tool.com/admin/ads?v=0.1.3 ردت 200 OK.
✅ https://date-tool.com/admin?v=0.1.3 ردت 200 OK.
✅ https://date-tool.com/?v=0.2.97 ردت 200 OK.
⚠️ ظهر تحذير OpenNext المعتاد بأن Windows ليس البيئة المثلى، ولم يمنع النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Path PROJECT_MEMO.md
git status --short
Select-String -Path app\admin\AdminDashboard.css -Pattern "legacy-nav-controls|legacy-theme-toggle|legacy-logout-btn|legacy-mobile-menu-toggle|legacy-user" -Context 0,5
Get-Content -Path app\admin\AdminDashboard.css | Select-Object -Skip ...
Get-Content -Path app\version.js
Get-Content -Path VERSION_LOG.md | Select-Object -First 50
git diff --check
npm run lint
npm run build
npm run deploy
curl.exe -I https://date-tool.com/admin/ads?v=0.1.3
curl.exe -I https://date-tool.com/admin?v=0.1.3
curl.exe -I https://date-tool.com/?v=0.2.97
```

الملفات المتأثرة:

```txt
app/admin/AdminDashboard.css
app/version.js
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تنظيف CSS المشترك وخريطة الموقع التقنية - 0.2.98 / admin 0.1.4

الأعراض:

```txt
توسع الواجهة العامة ومنصة الإدارة على مراحل متتالية تسبب في تكرار واضح داخل CSS، خصوصًا في أزرار الإجراء العامة وزر عرض الطقس ورؤوس وصفوف جداول الإدارة.
كما أن خريطة الموقع كانت بحاجة إلى تضمين صفحات الأدوات العامة الجديدة حتى تظهر لمسارات SEO الأساسية.
```

السبب:

```txt
إضافة صفحات التاريخ والساعة والطقس ومنصة الإدارة تمت تدريجيًا، وكل مرحلة أضافت بعض القيم المتشابهة مباشرة داخل selectors مختلفة.
هذا لا يكسر الموقع، لكنه يزيد صعوبة الصيانة ويجعل أي تعديل مستقبلي على الأحجام أو الألوان قابلًا للتكرار والخطأ.
```

الحل:

```txt
إضافة متغيرات CSS مشتركة لأزرار الإجراء العامة وزر عرض الطقس داخل app/globals.css.
توحيد hover و active و disabled وحركة الأيقونات للأزرار العامة بدون تغيير سلوك الأدوات.
إضافة متغيرات CSS مشتركة لرؤوس وصفوف جداول الإدارة داخل app/admin/AdminDashboard.css.
تنظيم app/sitemap.js بمصفوفة روابط واحدة وإضافة صفحات /clock و /weather و /month-names.
تحديث نسخة الموقع إلى 0.2.98 ونسخة الإدارة إلى 0.1.4 وتوثيق ذلك في VERSION_LOG.md.
```

الحالة:

```txt
✅ تم تنظيف التكرار المحدود بدون نقل مكونات أو تغيير منطق الواجهة.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
✅ نجح npm run lint.
✅ نجح npm run build.
⚠️ أثناء npm run build ظهرت رسائل fetch EACCES بسبب منع الشبكة الخارجية في بيئة Codex، لكنها لم تفشل البناء.
⏳ لم يتم تشغيل npm run deploy ضمن هذه المهمة.
✅ تم تحديث PROJECT_MEMO.md و VERSION_LOG.md.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
git status --short
rg "month-names|clock|weather" app
Get-Content -Raw app\sitemap.js
Get-Content -Raw -LiteralPath app\[slug]\page.jsx
git diff --check
npm run lint
npm run build
```

الملفات المتأثرة:

```txt
app/sitemap.js
app/globals.css
app/admin/AdminDashboard.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نشر تنظيف CSS وخريطة الموقع على الإنتاج - 0.2.98 / admin 0.1.4

الأعراض:

```txt
كانت نسخة 0.2.98 / admin 0.1.4 مرفوعة إلى GitHub فقط بعد مهمة التنظيف العامة، ولم تكن منشورة على Cloudflare بعد.
```

السبب:

```txt
تم فصل مهمة التنظيف عن مهمة النشر حتى لا يتم النشر إلا بعد موافقة صريحة من المستخدم.
```

الحل:

```txt
بعد موافقة المستخدم الصريحة، تم تشغيل npm run deploy عبر OpenNext for Cloudflare.
فشلت المحاولة الأولى في مرحلة wrangler deploy بسبب مشكلة اتصال/DNS مؤقتة ظهرت كـ fetch failed و ENOTFOUND firestore.googleapis.com.
تم فحص DNS و Wrangler auth بنجاح، ثم أعيد تشغيل npm run deploy ونجح النشر.
```

الحالة:

```txt
✅ نجح OpenNext build.
✅ نجح رفع الأصول الجديدة إلى Cloudflare.
✅ تم نشر Worker datetools على الإنتاج.
✅ Cloudflare Version ID: 25872a4f-a4b4-4593-8091-3b8af3c27dee
✅ تم اختبار https://date-tool.com/ ورجع 200.
✅ تم اختبار https://date-tool.com/sitemap.xml ورجع 200 ويتضمن /clock و /weather.
✅ تم اختبار https://date-tool.com/admin/ads ورجع 200.
⚠️ ظهرت تحذيرات OpenNext الخاصة بتشغيله على Windows، لكنها لم تمنع النشر.
✅ تم تحديث PROJECT_MEMO.md بنتيجة النشر.
```

الأوامر المستخدمة:

```powershell
npx wrangler --version
npx wrangler whoami
Resolve-DnsName firestore.googleapis.com
npm run deploy
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/sitemap.xml
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/admin/ads
```

الملفات المتأثرة:

```txt
PROJECT_MEMO.md
```

---

### إشعار تحديث التطبيق المثبت - 0.2.99

الأعراض:

```txt
المستخدم الذي ثبّت الموقع كتطبيق PWA لا يحصل على إشعار واضح داخل التطبيق عند صدور نسخة جديدة من الأداة.
وكان زر "إظهار مجددًا" من الإدارة يفيد في إعادة إظهار التنبيه يدويًا، لكنه لا يعتمد تلقائيًا على رقم نسخة الموقع بعد كل تحديث.
```

السبب:

```txt
مكون PwaInstallPrompt كان يتابع beforeinstallprompt و showAgainKey فقط.
لم يكن هناك تخزين لآخر نسخة شاهدها التطبيق المثبت أو مقارنة مباشرة مع APP_VERSION.
```

الحل:

```txt
إضافة مفاتيح localStorage لآخر نسخة مثبتة وآخر نسخة تم تجاهل إشعار تحديثها.
جعل التطبيق المثبت يقارن النسخة المخزنة مع APP_VERSION ويعرض إشعار "تحديث جديد متاح" مرة واحدة لكل إصدار جديد.
إضافة زر "تحديث الآن" يعيد تحميل التطبيق بعد اعتماد النسخة الحالية.
إضافة خطوات تحديث مختصرة داخل الإشعار: الضغط على تحديث الآن، ثم إغلاق التطبيق وفتحه من جديد إذا بقيت النسخة القديمة.
تحديث نسخة الموقع إلى 0.2.99 دون تغيير نسخة منصة الإدارة 0.1.4.
```

الحالة:

```txt
✅ تم إضافة إشعار تحديث تلقائي للتطبيقات المثبتة.
✅ تم إصلاح نصوص PwaInstallPrompt العربية المشوهة داخل المكون.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
✅ نجح npm run lint.
✅ نجح npm run build.
⚠️ أثناء npm run build ظهرت رسائل fetch EACCES بسبب منع الشبكة الخارجية في بيئة Codex، لكنها لم تفشل البناء.
⏳ لم يتم تشغيل npm run deploy ضمن هذه المهمة لأن المستخدم لم يطلب نشر الإنتاج لهذا التعديل.
✅ تم تحديث PROJECT_MEMO.md و VERSION_LOG.md.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
Get-Content -Raw app\components\PwaInstallPrompt.jsx
rg "pwa|install|showAgain|APP_VERSION|ADMIN_VERSION|serviceWorker|manifest|beforeinstallprompt|pwa-install|تثبيت|تحديث" app package.json VERSION_LOG.md
git diff --check
npm run lint
npm run build
git add PROJECT_MEMO.md VERSION_LOG.md app/components/PwaInstallPrompt.jsx app/globals.css app/version.js package.json package-lock.json
git commit -m "Add PWA update notice"
git push origin master
```

الملفات المتأثرة:

```txt
app/components/PwaInstallPrompt.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نشر إشعار تحديث التطبيق المثبت على الإنتاج - 0.2.99 / admin 0.1.4

الأعراض:

```txt
كانت نسخة 0.2.99 التي تضيف إشعار تحديث التطبيق المثبت موجودة في الكود ومرفوعة إلى GitHub، لكنها لم تكن منشورة على Cloudflare بعد.
```

السبب:

```txt
تم انتظار موافقة صريحة من المستخدم قبل تشغيل نشر الإنتاج.
```

الحل:

```txt
بعد موافقة المستخدم الصريحة، تم تشغيل npm run deploy.
نجح OpenNext build ونجح رفع الأصول الجديدة إلى Cloudflare Workers.
تم نشر Worker datetools على الإنتاج.
```

الحالة:

```txt
✅ نجح npm run deploy.
✅ تم نشر نسخة 0.2.99 / admin 0.1.4 على Cloudflare.
✅ Cloudflare Version ID: 48fe0e96-1435-4fed-b7a4-136db662ca8b
✅ تم اختبار https://date-tool.com/ ورجع 200 ويتضمن 0.2.99.
✅ تم اختبار https://date-tool.com/manifest.webmanifest ورجع 200.
✅ تم اختبار https://date-tool.com/admin/identity ورجع 200.
⚠️ ظهرت تحذيرات OpenNext الخاصة بتشغيله على Windows، لكنها لم تمنع النشر.
✅ تم تحديث PROJECT_MEMO.md بنتيجة النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
npm run deploy
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/manifest.webmanifest
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/admin/identity
```

الملفات المتأثرة:

```txt
PROJECT_MEMO.md
```

---

### تنفيذ المرحلة الأولى من تحسين SEO وأدسنس - 0.3.0 / admin 0.1.4

الأعراض:

```txt
صفحات /clock و /weather كانت تعتمد على Metadata عامة ولا تملك بيانات منظمة مستقلة.
المحتوى النصي في صفحات الأدوات غير التاريخية كان أخف من المطلوب لقبول AdSense وثقة محركات البحث.
sitemap.xml كانت ثابتة ولا تجمع الصفحات العامة التي تنشأ من لوحة الإدارة.
بعض مسارات الإدارة والبوابات الداخلية لم يكن لديها noindex صريح من مستوى Next metadata.
Fallback metadata في بعض الملفات كان يعتمد على نصوص قديمة من ملفات ترجمة قد تظهر بترميز غير مناسب في بعض البيئات.
```

السبب:

```txt
الموقع بدأ كأداة تاريخ رئيسية ثم توسع إلى أدوات ساعة وطقس وصفحات ديناميكية، لذلك احتاجت الصفحات الجديدة إلى طبقة SEO مستقلة ومحتوى داعم وخريطة موقع ديناميكية.
```

الحل:

```txt
تم إنشاء إعداد SEO مركزي آمن في app/seoConfig.js.
تم تحويل صفحات /clock و /weather إلى Server wrapper مع Client component منفصل، حتى يمكن إضافة Metadata و JSON-LD بدون كسر التفاعل.
تمت إضافة JSON-LD لصفحات الأدوات العامة من نوع WebApplication و FAQPage و BreadcrumbList، وإضافة WebSite schema عام في layout.
تمت إضافة محتوى نصي إرشادي إضافي لصفحات الساعة والطقس عبر مكون ToolSeoContent.
تم جعل sitemap.xml تجمع الصفحات العامة الثابتة والصفحات الديناميكية من Firestore مع استبعاد مسارات الإدارة والعميل والدعم والـ API.
تمت إضافة noindex لمسارات الإدارة وتسجيل الدخول وبوابة المعلنين والدعم.
تم تحديث fallback metadata في layout وصفحات slug لاستخدام هوية الموقع الحالية والبدائل المركزية بدل نصوص قديمة.
تم رفع نسخة الموقع الأساسية إلى 0.3.0 دون تغيير نسخة منصة الإدارة لأنها لم تتغير وظيفيًا.
```

الحالة:

```txt
✅ تم تنفيذ المرحلة الأولى من خطة SEO وأدسنس.
✅ نجح npm run lint.
✅ نجح npm run build.
✅ نجح git diff --check بعد إصلاح نهايات الملفات الجديدة.
⚠️ أثناء build ظهرت رسائل fetch failed بسبب منع الشبكة داخل بيئة الفحص المحلية عند محاولة الوصول إلى Firestore، لكنها لم تكسر البناء وخرج الأمر بنجاح.
⚠️ لم يتم نشر الإنتاج في هذه المهمة لأن المستخدم طلب إضافة الخطوات والعمل عليها، ولم يطلب نشرًا صريحًا بعد هذه التعديلات.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "metadata|sitemap|robots|noindex|schema|firebase|toolSlogan|mainSEO" app
git diff --check
npm run lint
npm run build
git status --short
git diff --name-only
```

الملفات المتأثرة:

```txt
app/seoConfig.js
app/components/ToolSeoContent.jsx
app/clock/page.jsx
app/clock/ClockPageClient.jsx
app/weather/page.jsx
app/weather/WeatherPageClient.jsx
app/layout.jsx
app/[slug]/page.jsx
app/admin/layout.jsx
app/admin_login/layout.jsx
app/client/layout.jsx
app/support/layout.jsx
app/sitemap.js
app/robots.js
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نشر المرحلة الأولى من تحسين SEO وأدسنس على الإنتاج - 0.3.0 / admin 0.1.4

الأعراض:

```txt
كانت تحسينات SEO و JSON-LD والمحتوى النصي وخريطة الموقع الديناميكية موجودة في الكود ومرفوعة إلى GitHub، لكنها لم تكن منشورة على Cloudflare بعد.
```

السبب:

```txt
كان يلزم الحصول على موافقة صريحة قبل تشغيل npm run deploy لأن الأمر ينشر مباشرة إلى الإنتاج.
```

الحل:

```txt
بعد موافقة المستخدم الصريحة، تم تشغيل npm run deploy.
نجح OpenNext build ونجح رفع الأصول الجديدة إلى Cloudflare Workers.
تم نشر Worker datetools على الإنتاج.
تم اختبار الصفحات العامة ومسارات SEO الأساسية بعد النشر.
```

الحالة:

```txt
✅ نجح npm run deploy.
✅ تم نشر نسخة 0.3.0 / admin 0.1.4 على Cloudflare.
✅ Cloudflare Version ID: e6dbc554-cb5c-4599-84e3-98008a8ed766
✅ تم اختبار https://date-tool.com/ ورجع 200 ويتضمن 0.3.0 و JSON-LD.
✅ تم اختبار https://date-tool.com/clock ورجع 200.
✅ تم اختبار https://date-tool.com/weather ورجع 200.
✅ تم اختبار https://date-tool.com/sitemap.xml ورجع 200 ويتضمن /clock و /weather.
✅ تم اختبار https://date-tool.com/robots.txt ورجع 200 ويتضمن منع /admin و /client.
✅ تم اختبار https://date-tool.com/admin/identity ورجع 200.
⚠️ ظهرت تحذيرات OpenNext الخاصة بتشغيله على Windows، لكنها لم تمنع النشر.
✅ تم تحديث PROJECT_MEMO.md بنتيجة النشر.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
npm run deploy
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/clock
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/weather
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/sitemap.xml
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/robots.txt
Invoke-WebRequest -UseBasicParsing -Uri https://date-tool.com/admin/identity
```

الملفات المتأثرة:

```txt
PROJECT_MEMO.md
```

---

### تقوية المحتوى النصي لأدوات أدسنس - 0.3.1 / admin 0.1.4

الأعراض:

```txt
صفحات /clock و /weather والصفحة الرئيسية كانت تحتاج محتوى نصيًا إرشاديًا أقوى حتى لا تظهر كأدوات قليلة المحتوى عند مراجعة AdSense.
الصفحة الرئيسية لم تكن تعرض محتوى SEO مستقلًا لأداة التاريخ قبل الأسئلة الشائعة.
ملف SEO المركزي احتاج تصحيحًا للنصوص العربية وتوسيعًا للـ FAQ والوصوف المستخدمة في metadata و JSON-LD.
```

السبب:

```txt
إضافة الأدوات الجديدة جعلت قيمة الصفحات تعتمد على التفاعل أكثر من النصوص التوضيحية، بينما قبول AdSense ومحركات البحث يحتاجان محتوى واضحًا يشرح الأداة وحدود الدقة والخصوصية ومتى يستخدم الزائر كل أداة.
```

الحل:

```txt
تم توسيع ToolSeoContent ليغطي أدوات التاريخ والساعة والطقس بثلاثة أقسام نصية لكل أداة.
تم ربط محتوى أداة التاريخ داخل الصفحة الرئيسية قبل قسم الأسئلة الشائعة.
تم فصل الصفحة الرئيسية إلى Server wrapper في `app/page.jsx` ومكون عميل في `app/HomePageClient.jsx` حتى يظهر محتوى أداة التاريخ و JSON-LD من جهة السيرفر.
تم تصحيح وتوسيع app/seoConfig.js بعناوين وأوصاف وFAQ عربية سليمة لكل أداة.
تم إضافة JSON-LD خاص بصفحة التاريخ داخل الصفحة الرئيسية حتى لا تبقى الصفحة الرئيسية أضعف من /clock و /weather.
تم رفع نسخة الموقع العامة إلى 0.3.1 دون تغيير نسخة الإدارة لأن التعديل يخص الموقع العام فقط.
```

الحالة:

```txt
✅ تم تنفيذ تقوية المحتوى النصي للصفحة الرئيسية و /clock و /weather.
✅ تم تصحيح نصوص SEO المركزية العربية.
✅ نجح `npm run lint`.
✅ نجح `npm run build`.
✅ نجح `git diff --check` مع تحذيرات CRLF المعتادة فقط.
✅ تم نشر نسخة 0.3.1 / admin 0.1.4 على Cloudflare Version ID: 1dc21452-d3e7-4bc4-97e9-2909cb879268.
⚠️ أمر النشر انتهى بمهلة أداة Codex بعد ظهور نجاح Cloudflare و Version ID.
⚠️ فحص الإنتاج الشبكي من الطرف المحلي لم يكتمل لأن طلب الصلاحية رُفض من طبقة المراجعة الآلية، وليس بسبب خطأ ظاهر من الموقع.
⚠️ محاولة تشغيل `next start` لفحص HTML محليًا لم تكتمل بسبب مشكلة Windows/PowerShell في `Start-Process` مع تكرار متغير PATH.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw PROJECT_MEMO.md
rg -n "ToolSeoContent|seoContent|clock|weather|date|seo-card|faq-card|tool-seo" app\components\ToolSeoContent.jsx app\seoConfig.js app\page.jsx app\components\home\HomeSections.jsx app\clock\ClockPageClient.jsx app\weather\WeatherPageClient.jsx
rg -n "APP_VERSION|ADMIN_VERSION|version" app\version.js package.json VERSION_LOG.md PROJECT_MEMO.md
npm version 0.3.1 --no-git-tag-version
git diff -- app\components\ToolSeoContent.jsx app\seoConfig.js app\page.jsx
npm run lint
git diff --check
npm run build
npm run deploy
```

الملفات المتأثرة:

```txt
app/components/ToolSeoContent.jsx
app/HomePageClient.jsx
app/seoConfig.js
app/page.jsx
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### مراجعة headers الأمنية وPageSpeed التقنية - 0.3.2 / admin 0.1.4

الأعراض:

```txt
بعد تقوية محتوى الأدوات لأدسنس، بقيت مرحلة مراجعة الهيدرز الأمنية وتهيئة Cloudflare/PageSpeed.
كانت صفحات الإدارة والعميل والدعم تعتمد على metadata noindex، لكنها لم تكن تضع X-Robots-Tag من مستوى HTTP Header.
كان middleware يضع مجموعة هيدرز أساسية، لكنه لم يكن مركزيًا ولم يتضمن بعض رؤوس العزل والتشخيص الحديثة.
لم يكن `X-Powered-By` معطلًا من إعداد Next.js.
لم تكن Observability مفعلة في wrangler.jsonc.
```

السبب:

```txt
الموقع أصبح أقرب لمتطلبات SEO وأدسنس، لكن تحسين الأمان والفهرسة الداخلية يحتاج طبقة HTTP مباشرة إلى جانب metadata، كما أن Cloudflare Worker يحتاج تشخيصًا أفضل عند ظهور أخطاء إنتاجية.
فرض CSP كامل الآن قد يكسر AdSense أو Firebase أو Google Tag Manager لأن المشروع يستخدم سكربتات خارجية مشروطة بالموافقة، لذلك يجب تأجيله لمرحلة report-only مدروسة.
```

الحل:

```txt
تم إعادة تنظيم middleware.js لتطبيق الهيدرز الأمنية من قائمة مركزية واحدة.
تم إضافة X-Robots-Tag: noindex, nofollow, noarchive لمسارات /admin و /admin_login و /client و /support و /api.
تم إضافة Cross-Origin-Opener-Policy و Origin-Agent-Cluster و X-Permitted-Cross-Domain-Policies و X-DNS-Prefetch-Control مع الحفاظ على Permissions-Policy التي تسمح بـ geolocation من نفس الموقع فقط.
تم إبقاء X-Frame-Options على DENY و Strict-Transport-Security مفعلة للدومينات.
تم تعطيل ترويسة Next.js الافتراضية عبر poweredByHeader: false في next.config.mjs.
تم تفعيل observability في wrangler.jsonc بمعدل head_sampling_rate خفيف 0.1.
تم رفع نسخة الموقع العامة إلى 0.3.2 دون تغيير نسخة الإدارة لأن التعديل يخص الموقع العام وتهيئة Cloudflare.
```

الحالة:

```txt
✅ تم تنفيذ تحسينات headers الأمنية.
✅ تم تعزيز noindex للمسارات الداخلية من مستوى HTTP Header.
✅ تم تفعيل Observability في إعداد Cloudflare Worker.
✅ نجح npm run lint.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
✅ نجح npm run build، مع ظهور تحذيرات fetch failed بسبب منع الشبكة داخل بيئة Codex أثناء جلب Firestore، دون فشل البناء.
✅ تم النشر عبر npm run deploy على Cloudflare Worker datetools.
✅ Version ID المنشور: 39b4e32c-dcb2-4922-8160-ad168625efc6.
✅ فحص الإنتاج أكد أن الصفحة الرئيسية تعمل مع الهيدرز الأمنية وبدون X-Powered-By.
✅ فحص الإنتاج أكد أن /admin/identity يحمل X-Robots-Tag: noindex, nofollow, noarchive.
✅ فحص الإنتاج أكد أن www.date-tool.com يحول إلى date-tool.com مع الهيدرز الأمنية.
✅ فحص الإنتاج أكد أن أيقونات PWA القديمة المحذوفة ترجع 410 مع noindex.
⚠️ أداة Chrome DevTools MCP الخاصة بقياس Core Web Vitals غير متاحة في جلسة Codex الحالية، لذلك قياس PageSpeed الفعلي يحتاج تقرير PageSpeed أو جلسة DevTools لاحقة.
⚠️ CSP الكامل مؤجل عمدًا حتى يتم اختباره أولًا بصيغة report-only بسبب AdSense/Firebase/GTM.
```

الأوامر المستخدمة:

```powershell
Get-Content -LiteralPath PROJECT_MEMO.md -Encoding UTF8 -TotalCount 220
Get-Content -LiteralPath PROJECT_MEMO.md -Encoding UTF8 | Select-Object -Last 260
Get-Content -LiteralPath C:\Users\d7mi6\.codex\skills\web-perf\SKILL.md -Encoding UTF8
Get-Content -LiteralPath C:\Users\d7mi6\.codex\skills\workers-best-practices\SKILL.md -Encoding UTF8
rg -n "headers\(|NextResponse|Permissions-Policy|Content-Security-Policy|X-Frame|Referrer-Policy|X-Robots-Tag|Strict-Transport|noindex|robots|metadataBase|sitemap|manifest|service-worker|Cache-Control" app middleware.* next.config.* wrangler.jsonc package.json
Get-Content -LiteralPath middleware.js -Encoding UTF8
Get-Content -LiteralPath node_modules\wrangler\config-schema.json -Encoding UTF8 -TotalCount 120
rg -n "observability|head_sampling_rate" node_modules\wrangler\config-schema.json
npm version 0.3.2 --no-git-tag-version
npm run lint
git diff --check
npm run build
npm run deploy
Invoke-WebRequest -Uri https://date-tool.com/
Invoke-WebRequest -Uri https://date-tool.com/admin/identity
Invoke-WebRequest -Uri https://www.date-tool.com/
Invoke-WebRequest -Uri https://date-tool.com/pwa-icon-192.png
```

الملفات المتأثرة:

```txt
middleware.js
next.config.mjs
wrangler.jsonc
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### اختبار CSP Report-Only ومحاولة PageSpeed الفعلي - 0.3.3 / admin 0.1.4

الأعراض:

```txt
بعد تقوية الهيدرز الأمنية، بقي اختبار CSP بصيغة Report-Only قبل فرضه فعليًا.
طلب المستخدم تشغيل PageSpeed فعلي بعد انتشار النسخة، لكن الطلبات العامة إلى Google PageSpeed API بدون مفتاح رجعت 429 Too Many Requests.
```

السبب:

```txt
CSP يجب اختباره على الإنتاج بصيغة Report-Only لأن الموقع يستخدم AdSense وFirebase وGoogle Tag Manager وAnalytics وClarity وربما Turnstile، وفرض السياسة مباشرة قد يمنع سكربتات أو إطارات مهمة.
PageSpeed API العام محدود جدًا بدون مفتاح API، بينما مسار /api/pagespeed في المشروع محمي بصلاحية المدير ويحتاج جلسة مدير أو وجود PAGESPEED_API_KEY في Cloudflare.
```

الحل:

```txt
تم إضافة Content-Security-Policy-Report-Only من middleware.js فقط، دون إضافة Content-Security-Policy الملزمة.
تم السماح مبدئيًا بالمصادر المعروفة المستخدمة في المشروع مثل self و Google/AdSense و Firebase/Google APIs و Open-Meteo و BigDataCloud و FontAwesome CDN و Clarity و Facebook Pixel و Turnstile.
تم إضافة endpoint آمن /api/csp-report يستقبل تقارير CSP ويرجع 204 ولا يحفظ أي بيانات في Firebase.
تقارير CSP تنظف document-uri و blocked-uri من query/hash قبل طباعتها في Cloudflare logs لتقليل خطر تسريب بيانات.
تم رفع نسخة الموقع العامة إلى 0.3.3 دون تغيير نسخة الإدارة لأن التعديل يخص الهيدرز العامة ومراقبة CSP.
```

الحالة:

```txt
✅ تم تنفيذ CSP بصيغة Report-Only فقط.
✅ تم إنشاء /api/csp-report بدون تخزين دائم.
✅ تم توثيق أن PageSpeed API العام أعاد 429 بسبب الكوتا عند التشغيل من الطرفية بدون مفتاح.
✅ نجح npm run lint.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
✅ نجح npm run build مع نفس تحذيرات الشبكة المحلية أثناء جلب Firestore في بيئة Codex.
✅ تم النشر عبر npm run deploy على Cloudflare Worker datetools.
✅ Version ID المنشور: 558fc331-07b8-48d9-a470-04edb96b2f7a.
✅ فحص الإنتاج أكد وجود Content-Security-Policy-Report-Only على الصفحة الرئيسية وصفحة الإدارة.
✅ فحص الإنتاج أكد عدم وجود Content-Security-Policy ملزم، لذلك لن يتم كسر AdSense/Firebase/GTM.
✅ فحص الإنتاج أكد أن /api/csp-report يرجع 204 No Content.
⏳ بعد النشر يجب مراقبة CSP عبر wrangler tail ثم تضييق السياسة أو تحويلها لاحقًا إلى سياسة ملزمة عند الثبات.
```

الأوامر المستخدمة:

```powershell
Invoke-RestMethod -Uri https://www.googleapis.com/pagespeedonline/v5/runPagespeed...
rg -n "https?://|googlesyndication|google-analytics|googletagmanager|firebase|firestore|gstatic|googleapis|cloudflare|adsbygoogle|pagead|doubleclick|analytics|gtag|turnstile|recaptcha|api\\.media|R2|open-meteo|nominatim|bigdatacloud|ipapi|ipinfo" app middleware.js next.config.mjs wrangler.jsonc package.json
Get-Content -LiteralPath app\api\pagespeed\route.js -Encoding UTF8
npm version 0.3.3 --no-git-tag-version
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -sS -D - -o NUL https://date-tool.com/
curl.exe -sS -D - -o NUL https://date-tool.com/admin/identity
curl.exe -sS -D - -o NUL -X POST -H "Content-Type: application/json" --data-raw '{...}' https://date-tool.com/api/csp-report
```

الملفات المتأثرة:

```txt
middleware.js
app/api/csp-report/route.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### تحليل تقارير PageSpeed المحفوظة وتحسينات محايدة بصريًا - 0.3.4 / admin 0.1.4

الأعراض:

```txt
تقارير PageSpeed HTML المحفوظة للصفحة الرئيسية وصفحات /clock و /weather و /contact و /terms و /privacy أظهرت أن Best Practices و SEO جيدة، لكن توجد فرص أداء وتحذيرات متكررة.
أبرز الملاحظات المتكررة: render-blocking-insight و font-display-insight و unused-css-rules و cls-culprits-insight و image-delivery-insight و llms-txt.
صفحة /weather كانت الأعلى في CLS ضمن التقارير المحفوظة، بينما TBT كان 0ms في التقارير التي تم استخراجها، ما يعني أن المشكلة ليست حمل JavaScript ثقيلًا بقدر ما هي موارد وأحجام/ثبات عناصر.
```

السبب:

```txt
FontAwesome يتم تحميله من CDN ويظهر في تقارير PageSpeed كسلسلة تحميل مؤثرة و CSS غير مستخدم، لكنه مطلوب للحفاظ على الأيقونات الأصلية التي طلب المستخدم إعادتها سابقًا.
لم يكن هناك مسار llms.txt صالح، فظهر فحص PageSpeed الخاص به كملاحظة ناقصة.
بعض ملاحظات PageSpeed مثل color-contrast و heading-order و CLS العميق قد تحتاج تغييرات تصميمية أو إعادة ترتيب عناصر مرئية، لذلك لم يتم لمسها في هذه المهمة التزامًا بطلب عدم تغيير التصميم.
صور الهوية والأيقونات القادمة من R2 قد تحتاج تحسين أبعاد/صيغة لاحقًا من لوحة الإدارة أو عبر مسار صور محسن.
```

الحل:

```txt
تمت إضافة مسار /llms.txt بمحتوى Markdown عربي مختصر يشرح الموقع وروابط الصفحات العامة المهمة.
تم حجز llms.txt في sitemap.js حتى لا يتعامل معه مسار الصفحات الديناميكية كصفحة قاعدة بيانات.
تمت إضافة dns-prefetch و preconnect و preload لملف FontAwesome CDN في layout.jsx لتحسين اكتشاف المورد وتقليل تأخر الأيقونات بدون تغيير المكتبة أو شكل الأيقونات.
تم رفع نسخة الموقع العامة إلى 0.3.4 دون تغيير نسخة الإدارة لأن التعديل يخص الموقع العام وSEO/PageSpeed فقط.
```

الحالة:

```txt
✅ تم تحليل تقارير PageSpeed المحفوظة محليًا للصفحات العامة المذكورة.
✅ تم إصلاح ملاحظة llms-txt بإضافة /llms.txt.
✅ تم تحسين تحميل FontAwesome بشكل آمن دون تغيير التصميم.
✅ نجح npm run lint.
✅ نجح npm run build مع استمرار تحذيرات الشبكة المحلية عند محاولة جلب Firestore داخل بيئة Codex المقيدة.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
⏳ لم يتم نشر نسخة 0.3.4 بعد؛ يلزم npm run deploy بعد موافقة المستخدم.
⏳ بعد النشر يجب تشغيل PageSpeed جديد من لوحة الإدارة أو API للتحقق من أثر التعديل على النسخة المنتشرة.
⏳ المتبقي الأكبر للأداء هو معالجة CLS خصوصًا في /weather و /contact بحذر، وتحسين الصور، وربما استبدال FontAwesome لاحقًا بحزمة محلية/Subset بعد موافقة صريحة لأنه قد يغير الأيقونات.
```

الأوامر المستخدمة:

```powershell
rg -n "FCP|LCP|TBT|CLS|render-blocking-insight|font-display-insight|unused-css-rules|llms-txt" "C:\Users\d7mi6\Downloads\PageSpeed*.html"
npm run lint
npm run build
npm start -- -p 3116
git diff --check
```

الملفات المتأثرة:

```txt
app/layout.jsx
app/llms.txt/route.js
app/sitemap.js
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### معالجة CLS في /weather و /contact - 0.3.5 / admin 0.1.4

الأعراض:

```txt
تقارير PageSpeed المحفوظة أظهرت ارتفاع CLS في /weather و /contact مقارنة ببقية الصفحات.
صفحة /weather كانت تبدأ بدون كروت الطقس ثم تضيف كرت الطقس والنصيحة والتوقعات بعد جلب البيانات.
صفحة /contact كانت تعرض Skeleton قصيرًا ثم تستبدله بهيدر الصفحة ونموذج تواصل أطول، ما قد يدفع المحتوى والفوتر بعد اكتمال التحميل.
```

السبب:

```txt
الصفحتان تعتمدان على بيانات تُجلب من جهة العميل بعد أول تحميل.
عدم حجز مساحة قريبة من الشكل النهائي قبل وصول البيانات يجعل Lighthouse يحسب انزياحًا في التخطيط.
```

الحل:

```txt
إضافة Skeleton احتياطي في /weather يحجز مساحة كرت الطقس الحالي ومقاييسه ونصيحة الخروج وتوقعات 5 أيام أثناء أول تحميل.
جعل التحميل الابتدائي في /weather يبدأ بحالة loading حتى تظهر المساحات المحجوزة من أول رسم.
تعديل حالة التحميل في صفحات slug، وخصوصًا /contact، لتستخدم نفس PageFrame ونفس عرض البطاقة النهائي بدل بطاقة قصيرة منفصلة.
إضافة Skeleton خاص بنموذج التواصل يحاكي ارتفاع الحقول والرفع والزر دون تغيير التصميم النهائي للنموذج.
رفع نسخة الموقع العامة إلى 0.3.5 دون تغيير نسخة الإدارة لأن التعديل يخص صفحات عامة وأداء PageSpeed فقط.
```

الحالة:

```txt
✅ نجح npm run lint.
✅ نجح npm run build مع استمرار تحذيرات fetch failed بسبب منع الشبكة الخارجية داخل بيئة Codex عند محاولة الوصول إلى Firestore.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
⏳ لم تُنشر نسخة 0.3.5 منفردة؛ أصبحت مدمجة ضمن نسخة 0.3.6 الحالية غير المنشورة بعد.
⏳ يلزم تشغيل PageSpeed جديد بعد النشر للتحقق من تحسن CLS فعليًا على بيانات Lighthouse الحديثة.
```

الأوامر المستخدمة:

```powershell
Select-String -Path app\weather\WeatherPageClient.jsx -Pattern "WeatherCurrentPlaceholder|const current|weather-current-card|daily\?\.time" -Context 2,4
Select-String -LiteralPath app\[slug]\PageClient.jsx -Pattern "if \(loading\)|function PageFrame|static-page-loading|normalizeSlug" -Context 3,5
npm run lint
npm run build
git diff --check
git diff --stat
```

الملفات المتأثرة:

```txt
app/weather/WeatherPageClient.jsx
app/[slug]/PageClient.jsx
app/globals.css
app/version.js
package.json
package-lock.json
VERSION_LOG.md
PROJECT_MEMO.md
```

---

### نقل محتوى SEO الافتراضي للساعة والطقس إلى Server Render - 0.3.6 / admin 0.1.4

الأعراض:

```txt
صفحتا /clock و /weather كانتا تحتويان على جزء من المحتوى النصي العام والأسئلة الافتراضية داخل Client Components.
هذا يجعل جزءًا مهمًا من المحتوى المفيد لأدسنس وSEO يعتمد على JavaScript العميل بدل أن يكون موجودًا مباشرة في HTML الأولي.
```

السبب:

```txt
مكونات ClockPageClient و WeatherPageClient كانت تعرض ToolSeoContent والأسئلة الافتراضية بعد تحميل مكون العميل.
المحتوى التفاعلي يجب أن يبقى Client Component، لكن المحتوى النصي الثابت والأسئلة الافتراضية أفضل أن تكون Server-rendered.
```

الحل:

```txt
نقل ToolSeoContent والأسئلة الافتراضية لصفحات /clock و /weather إلى app/clock/page.jsx و app/weather/page.jsx.
استخدام publicToolSeo لعرض FAQ الافتراضي من السيرفر بجانب JSON-LD والmetadata الخاصة بكل صفحة.
إبقاء الأسئلة الإضافية التي تضيفها الإدارة في مكونات العميل فقط، وعرضها كسكشن "أسئلة إضافية" عند وجودها بدون تكرار الأسئلة الافتراضية.
إضافة title اختياري لمكون ToolFaqSection حتى يمكن استخدام نفس المكون للأسئلة الافتراضية والإضافية.
رفع نسخة الموقع العامة إلى 0.3.6 دون تغيير نسخة منصة الإدارة لأن التعديل يخص صفحات عامة وSEO.
```

الحالة:

```txt
✅ نجح npm run lint.
✅ نجح npm run build مع استمرار تحذيرات fetch failed بسبب منع الشبكة الخارجية داخل بيئة Codex عند محاولة الوصول إلى Firestore.
✅ نجح git diff --check مع تحذيرات CRLF المعتادة فقط.
✅ تم نشر نسخة 0.3.6 على الإنتاج عبر Cloudflare Worker `datetools`.
✅ Cloudflare Version ID: d371faca-25c5-46a6-81e5-8b9d80f6f354.
✅ تم فحص `https://date-tool.com/clock` بعد النشر ورجعت الصفحة status 200.
⏳ بعد انتشار الكاش يجب فحص Rich Results أو مصدر HTML للتأكد من ظهور المحتوى والأسئلة ضمن HTML الأولي كما هو متوقع.
```

الأوامر المستخدمة:

```powershell
Get-Content -Raw app\clock\page.jsx
Get-Content -Raw app\weather\page.jsx
Select-String -Path app\clock\ClockPageClient.jsx -Pattern "ToolSeoContent|ToolFaqSection|clockFaqItems|const clockFaq|</section>" -Context 2,3
Select-String -Path app\weather\WeatherPageClient.jsx -Pattern "ToolSeoContent|ToolFaqSection|weatherFaqItems|const weatherFaq|</section>" -Context 2,3
npm run lint
npm run build
git diff --check
git diff --stat
npm run deploy
Invoke-WebRequest -Uri https://date-tool.com/clock -UseBasicParsing -TimeoutSec 30
```

الملفات المتأثرة:

```txt
app/clock/page.jsx
app/weather/page.jsx
app/clock/ClockPageClient.jsx
app/weather/WeatherPageClient.jsx
app/components/ToolFaqSection.jsx
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
✅ تم تحديث الإصدار إلى 0.2.85 وتحسين تنبيه تثبيت الأداة وحقل رفع صورة التواصل
✅ تم نشر الإصدار 0.2.85 على Cloudflare Version ID: 41028654-5e67-4da0-896e-4be76d5a4a02
✅ تم اختبار `/privacy` و `/contact` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.86 وترتيب إشعارات التثبيت والكوكيز داخل مكدس واحد
✅ تم نشر الإصدار 0.2.86 على Cloudflare Version ID: c4e3c36e-c039-49b2-ab2e-1b18b0c2f98d
✅ تم اختبار الصفحة الرئيسية والـ manifest على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.87 بدعم مستقبل أدوات التاريخ وتحويل فرق التوقيت إلى بحث مدن
✅ تم نشر الإصدار 0.2.87 على Cloudflare Version ID: a5ff65a1-ce70-427a-944b-15e3fa6e243c
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.88 بتعبئة تاريخ اليوم عند أول تفاعل وتوحيد عناوين أدوات الساعة
✅ تم نشر الإصدار 0.2.88 على Cloudflare Version ID: b929c5ce-7106-424b-8dc6-6d4952b31073
✅ تم اختبار `/`, `/clock`, و `/weather` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.89 بتحسين بطاقات أدوات الساعة واختصار نتيجة فرق التوقيت
✅ تم نشر الإصدار 0.2.89 على Cloudflare Version ID: 98781a64-b9b0-4cd7-9a5a-89575d081f2f
✅ تم اختبار `/clock` و `/` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.90 بقوالب مشاركة قابلة للتعديل وإعادة نصيحة الطقس للشكل الأبسط
✅ تم نشر الإصدار 0.2.90 على Cloudflare Version ID: 0b3a593e-78cd-45d9-89c5-d343d345a191
✅ تم اختبار `/`, `/clock`, `/weather`, و `/admin/tool-management/clock` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.91 واعتماد نصوص مشاركة افتراضية أجمل في أزرار مشاركة نتائج التاريخ
✅ تم نشر الإصدار 0.2.91 على Cloudflare Version ID: 82fcc105-f627-4a4a-adbe-bb27dd40acdb
✅ تم اختبار `/`, `/clock`, `/admin/tool-management/date`, و `/admin/tool-management/clock` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.92 لتثبيت تسمية أزرار المشاركة مع إبقاء نصوص المشاركة المخصصة
✅ تم نشر الإصدار 0.2.92 على Cloudflare Version ID: 6c9687f1-2f3e-4c22-bd00-8809f2077152
✅ تم اختبار `/`, `/clock`, `/admin/tool-management/date`, و `/admin/tool-management/clock` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.93 بتحسين إدارة قوالب المشاركة عبر زر تحرير وزر معاينة
✅ تم نشر الإصدار 0.2.93 على Cloudflare Version ID: 1b519750-bb29-4370-ac1c-d541a1cd3337
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.94 بإزالة أزرار قوالب المشاركة وجعل النص الكامل قابلًا للتعديل داخل الصف
✅ تم نشر الإصدار 0.2.94 على Cloudflare Version ID: fdf57462-4433-49ca-bf72-d04e72d3125e
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بنجاح
✅ تم تحديث الإصدار إلى 0.2.95 بجعل ملخص قوالب المشاركة يعرض معاينة بالقيم الافتراضية
✅ تم نشر الإصدار 0.2.95 على Cloudflare Version ID: 41c3c5b5-825b-4da5-b082-dfc9290d45f4
✅ تم اختبار `/admin/tool-management/date`, `/admin/tool-management/clock`, و `/` على الإنتاج بنجاح
✅ تمت إزالة شاشة التحميل البيضاء من صفحات الإدارة واستبدالها بتحميل داكن متوافق مع الهوية
✅ نسخة الموقع الأساسية في الكود الحالي هي 0.2.99
✅ نسخة منصة الإدارة في الكود الحالي هي 0.1.4
✅ تم تنظيف CSS المشترك للأزرار العامة وجداول الإدارة وتوسيع sitemap لصفحات الأدوات العامة
✅ تم نشر نسخة 0.2.98 / admin 0.1.4 على Cloudflare Version ID: 25872a4f-a4b4-4593-8091-3b8af3c27dee
✅ تم اختبار `/`, `/sitemap.xml`, و `/admin/ads` على الإنتاج بنجاح
✅ تم نشر إشعار تحديث التطبيق المثبت ضمن نسخة 0.2.99 / admin 0.1.4 على Cloudflare Version ID: 48fe0e96-1435-4fed-b7a4-136db662ca8b
✅ تم اختبار `/`, `/manifest.webmanifest`, و `/admin/identity` على الإنتاج بنجاح
✅ نسخة منصة الإدارة السابقة في الكود كانت 0.1.3 دون تغيير نسخة الموقع الأساسية 0.2.97
✅ تم نشر نسخة الإدارة 0.1.3 على Cloudflare Version ID: 115e8215-fbf6-4519-8dfa-1a464f175b9d
✅ تم حذف الشعار SVG التجريبي غير المعتمد من public/brand بناءً على طلب المستخدم
✅ تم تنفيذ المرحلة الأولى من تحسين SEO وأدسنس للصفحات العامة
✅ تمت إضافة Metadata و JSON-LD مستقلين لصفحات /clock و /weather
✅ تم دعم محتوى نصي إرشادي إضافي لصفحات الساعة والطقس لتقليل خطر انخفاض قيمة المحتوى
✅ أصبحت sitemap.xml تجمع الصفحات العامة الثابتة والديناميكية من قاعدة البيانات مع استبعاد المسارات الداخلية
✅ تمت إضافة noindex لمسارات الإدارة وتسجيل الدخول وبوابة المعلنين والدعم
✅ تم نشر نسخة 0.3.3 / admin 0.1.4 على Cloudflare Version ID: 558fc331-07b8-48d9-a470-04edb96b2f7a
✅ تم اختبار `/`, `/clock`, `/weather`, `/sitemap.xml`, `/robots.txt`, و `/admin/identity` على الإنتاج بنجاح
✅ تم فحص الهيدرز الأمنية على الإنتاج وتأكيد noindex لمسارات الإدارة وتعطيل X-Powered-By
✅ تم تفعيل Content-Security-Policy-Report-Only على الإنتاج دون فرض CSP ملزم
✅ يعمل endpoint `/api/csp-report` ويرجع 204 دون تخزين دائم
✅ تم تحليل تقارير PageSpeed المحفوظة للصفحات العامة وإضافة /llms.txt وتحسين اكتشاف FontAwesome دون تغيير التصميم
✅ تمت معالجة CLS في /weather و /contact بحذر عبر Skeleton يحجز المساحات أثناء التحميل دون تغيير الهوية البصرية
✅ تم نقل محتوى SEO والأسئلة الافتراضية في /clock و /weather إلى Server Render
✅ نسخة الموقع الأساسية السابقة المنشورة هي 0.3.6 عبر Cloudflare Version ID: d371faca-25c5-46a6-81e5-8b9d80f6f354
✅ أزيلت جميع الأسئلة الشائعة الافتراضية من كود التاريخ والساعة والطقس
✅ أصبح قسم الأسئلة الشائعة يظهر فقط عند وجود سؤال وإجابة مكتملين محفوظين من إدارة الأداة
✅ أزيل FAQPage schema الافتراضي حتى لا تعلن محركات البحث عن أسئلة غير ظاهرة في الصفحة
✅ حُدث وصف إدارة الأسئلة ليبيّن أنها المصدر الوحيد للقسم
✅ نجح `npm run lint` و `npm run build` للإصدار 0.3.7 / admin 0.1.5
✅ تم نشر الإصدار 0.3.7 / admin 0.1.5 على Cloudflare Version ID: eab7ac59-be1c-46ac-a8c8-6a6678f59e5c
✅ تم اختبار `/`, `/clock`, `/weather`, و `/admin/tool-management/date` على الإنتاج بنجاح بحالة 200
✅ تم تحديث صفحة إدارة الأدوات بتوسيط عنوانها وإخفاء زر الرجوع من صفحة القائمة الرئيسية
✅ أصبح زر الرجوع عائمًا داخل صفحات الأدوات الفرعية فقط، وأصبح حفظ إعدادات الأداة زرًا عامًا عائمًا
✅ تم تحويل قوالب المشاركة والأسئلة الشائعة إلى جداول أفقية ثابتة الأعمدة مع تمرير داخلي للشاشات الضيقة
✅ تم نقل إضافة وحفظ الأسئلة إلى أسفل جدول الأسئلة وإضافة إجراءات التفعيل والتعديل والمعاينة والحذف
✅ أصبحت حالة تفعيل السؤال محفوظة في Firebase، والسؤال المتوقف يبقى محفوظًا لكنه لا يظهر في صفحات الموقع العامة
✅ تم نقل إضافة وحفظ أحداث التاريخ أسفل الجدول وإضافة زر تفعيل ضمن إجراءات كل حدث وتحسين محاذاة أعمدة الحدث
✅ نجح `npm run lint` و `npm run build` للإصدار 0.3.8 / admin 0.1.6
✅ تم نشر الإصدار 0.3.8 / admin 0.1.6 على Cloudflare Version ID: 40a6c7e4-ff2b-4635-95d5-79354d6c6460
✅ تم تحديث منصة الإدارة إلى 0.1.7 دون تغيير إصدار الموقع العام 0.3.8.
✅ أزيل عمود التفعيل المستقل من جدول أحداث التاريخ، وبقي التفعيل ضمن إجراءات الحدث.
✅ وُحّدت محاذاة أزرار إجراءات الأحداث وأزيلت المسافة الزائدة عن زر اللون.
✅ جُمعت أزرار `رجوع` و`حفظ` في شريط عائم سفلي واحد، وأصبح زر الحفظ أخضر ولا يتداخل الشريط مع الفوتر أو سكاشن المحتوى.
✅ نجح `npm run lint` و `npm run build` للإصدار الإداري 0.1.7. ظهرت تحذيرات اتصال Firebase بسبب منع الشبكة داخل بيئة البناء، ولم تؤثر في نجاح البناء أو توليد الصفحات.
✅ تم نشر الإصدار 0.3.8 / admin 0.1.7 على Cloudflare Version ID: d15aa996-f2dc-41d8-bc18-2741ee906add
✅ أعادت صفحات `/admin/tool-management/date` و`/admin/tool-management/clock` و`/admin/tool-management/weather` الحالة 200 بعد النشر.
✅ تم تحديث التطبيق إلى 0.3.9 ومنصة الإدارة إلى 0.1.8 لإزالة نظام إشعار تحديث التطبيق المثبت بالكامل.
✅ أزيلت مقارنة إصدار التطبيق والتخزين المحلي الخاص بالتحديث ورسالة خطوات التحديث وزر `إظهار مجددًا` وحقل `showAgainKey`.
✅ بقي إشعار التثبيت القياسي فقط، ولا يظهر داخل التطبيق المثبت أو بدون حدث تثبيت حقيقي من المتصفح.
✅ تم نشر الإصدار 0.3.9 / admin 0.1.8 على Cloudflare Version ID: c427a4f4-ad06-4432-b043-302dad254bec
✅ أعادت `/` و`/admin/identity` و`/admin/tool-management/date` الحالة 200 بعد النشر النهائي.
✅ تم اختبار `/admin/tool-management`, `/admin/tool-management/date`, `/`, `/clock`, و `/weather` على الإنتاج بنجاح بحالة 200
✅ نسخة الموقع الأساسية الحالية في الكود هي 0.3.8
✅ نسخة منصة الإدارة الحالية في الكود هي 0.1.8
```

---

✅ تم تحديث منصة الإدارة إلى 0.1.9 دون تغيير إصدار الموقع العام 0.3.9.
✅ نُقلت إجراءات الرجوع والحفظ إلى يسار الشاشة عموديًا دون إطار جامع، مع إبقائها خارج سكاشن المحتوى.
✅ وُسّطت عناوين صفحات الأدوات ووُحّد لون عنوان ورأس جدول أحداث التاريخ مع بقية جداول الإدارة.
✅ ضُيّق عمود إجراءات الأحداث ووُحّدت محاذاة أزرار التفعيل واللون والحذف.
✅ أزيلت حدود أزرار الإدارة وأصبح تأثير المرور يحافظ على اللون الدلالي لكل زر.
✅ وُحّد مقاس زر الخروج مع زر تبديل المظهر على الشاشات الصغيرة.
✅ نجح `npm run lint` و`npm run build` للإصدار الإداري 0.1.9. ظهرت رسائل منع اتصال Firebase داخل بيئة البناء المعزولة ولم تؤثر في نجاح البناء.
✅ تم نشر الإصدار 0.3.9 / admin 0.1.9 على Cloudflare Version ID: f76e5e8a-5a01-4527-bd2b-288ce504e0bc
✅ أعادت صفحات إدارة أدوات التاريخ والساعة والطقس الحالة 200 بعد النشر.
✅ نسخة الموقع الأساسية الحالية في الكود هي 0.3.9
✅ نسخة منصة الإدارة الحالية في الكود هي 0.1.9

---

## 10. المتبقي

### أولوية SEO وأدسنس والمحتوى النصي

```txt
زيادة المحتوى النصي المفيد لكل صفحة أداة، خصوصًا /clock و /weather، مع أمثلة استخدام وأسئلة أكثر عمقًا دون حشو.
تقييم نقل إعدادات الإدارة الديناميكية إلى Server-rendered content لاحقًا إذا توفر مسار آمن للقراءة من Firestore دون زيادة زمن التحميل.
إضافة Schema إضافية عند الحاجة مثل SoftwareApplication و HowTo و Breadcrumb للصفحات الديناميكية بعد تثبيت شكل المحتوى.
مراجعة sitemap.xml داخل Search Console بعد أن تقرأ Google النسخة الجديدة، والتأكد من فهرسة الصفحات العامة المطلوبة فقط.
اختبار Rich Results و Search Console و PageSpeed بعد النشر، ثم إصلاح أي تحذير فعلي.
تشغيل PageSpeed فعلي من لوحة الإدارة بعد انتشار 0.3.6 ومقارنة النتائج بتقارير HTML المحفوظة.
مراقبة تقارير Content-Security-Policy-Report-Only عبر wrangler tail قبل التفكير في فرض CSP ملزم.
تحسين صور الهوية وأيقونة التطبيق من R2 أو عبر مسار صور محسن دون تغيير التصميم.
دراسة نقل FontAwesome إلى تحميل محلي/Subset لاحقًا فقط بعد موافقة صريحة، لأن ذلك قد يؤثر على الأيقونات.
تنظيف نصوص fallback القديمة في app/toolSettings.js و app/i18n.js إذا ظهرت أي مشكلة ترميز في بيئات العرض أو السجلات.
مراجعة AdSense بعد طلب المراجعة وعدم اعتبار هذه التحسينات ضمانًا للقبول؛ هي أساس تقني ومحتوى أولي يحتاج متابعة.
```

---

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
رفع أيقونات اختصارات التاريخ والساعة والطقس من سيكشن تثبيت التطبيق في `/admin/identity`.
اختبار زر إظهار تنبيه التثبيت مجددًا والتأكد من تغير `showAgainKey`.
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
اختبار صفحة `/admin/support` بجلسة مدير فعلية على الإنتاج: عرض التذاكر، تغيير الحالة، حفظ الملاحظة الداخلية، تنزيل مرفق خاص، وحذف تذكرة تجريبية مع مرفقها من R2.
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

### تحسين جدول الأحداث وتأكيد الحذف في الإدارة 0.1.10

ما تم إنجازه:

- توسيع عمود اسم الحدث وتقليص عمود الإجراءات في جدول أحداث التاريخ.
- تحسين شكل زر الرجوع العائم في صفحات إدارة الأدوات.
- إضافة اعتراض مركزي لأزرار الحذف داخل غلاف الإدارة يعرض نافذة تأكيد موحدة بخياري حذف وإلغاء.
- إزالة التأكيد الأصلي المكرر من حذف الحملات، مع إبقاء التفعيل والإيقاف كإجراء مستقل.
- لم تتغير نسخة الموقع العام لأن نطاق العمل إداري فقط.

الملفات المتأثرة:

- `app/admin/AdminShell.jsx`
- `app/admin/AdminDashboard.css`
- `app/admin/ads/page.jsx`
- `app/version.js`
- `VERSION_LOG.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
```

الحالة:

- منجز ومنشور على Cloudflare Workers برقم `dc7f8b6e-a4f4-4c8d-ad69-ec40f569165b`.

### توحيد جدول أحداث التاريخ ونافذة التحرير في الإدارة 0.1.11

ما تم إنجازه:

- جعل جدول أحداث التاريخ مخصصًا للعرض فقط وبنفس بنية وتنسيق جداول إدارة الأداة الأخرى.
- استبدال حقول الإدخال داخل الصف بقيم عرض ثابتة للاسم والتاريخ والتكرار وكود الأيقونة.
- إضافة نافذة واحدة لإضافة الحدث أو تعديله تشمل الاسم والتاريخ والتكرار والأيقونة واللون.
- إضافة زر تعديل لكل حدث، مع الإبقاء على التفعيل والحذف والحفظ الحاليين.
- لم تتغير نسخة الموقع العام لأن نطاق العمل إداري فقط.

الملفات المتأثرة:

- `app/admin/tool-management/date/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `VERSION_LOG.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
```

الحالة:

- منجز ومنشور على Cloudflare Workers برقم `94e66e3f-abb7-4995-a9c8-f0ec26196e47`.

### توحيد مكونات ستايل الإدارة وإزالة عمود الأحداث الزائد 0.1.12

ما تم إنجازه:

- إزالة العمود السابع الزائد من جدول أحداث التاريخ، واعتماد ستة أعمدة مطابقة للبيانات المعروضة فعليًا.
- إضافة متغيرات مركزية داخل `.legacy-admin-shell` لنصف قطر عناصر التحكم، حشوة الأزرار، المسافات، أحجام أزرار الأيقونات، انتقالات التفاعل، ومقاسات عناوين السكاشن.
- توحيد الأزرار النصية عبر `.legacy-primary-btn` و`.legacy-secondary-btn`.
- توحيد أزرار الإجراءات الأيقونية عبر القياسات المركزية المستخدمة في `.legacy-row-actions` و`.tools-item-actions` و`.tools-row-action` و`.tools-color-action` و`.legacy-media-picker-action`.
- توحيد السكاشن التعريفية الداخلية عبر `.tools-section-head` و`.tools-section-title`.
- توحيد مظهر رؤوس الجداول عبر `.tools-table-head`، مع إبقاء شبكة الأعمدة منفصلة لكل جدول حسب محتواه.
- توحيد لون رأس الجدول وحدوده مع هوية الإدارة الأساسية بدل اختلافها بين الجداول.
- لم تتغير نسخة الموقع العام لأن نطاق العمل إداري فقط.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/version.js`
- `VERSION_LOG.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm run deploy
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `c4e986eb-463d-4d71-820b-d496622c464c`.

### إعادة بناء محاذاة ومقاسات جدول أحداث التاريخ 0.1.13

ما تم إنجازه:

- إعادة بناء جدول أحداث التاريخ على شبكة أعمدة واحدة مشتركة بين رأس الجدول وصفوف البيانات.
- تقليل العرض الأدنى للجدول إلى قياس أنسب للشاشات الصغيرة مع بقاء التمرير الأفقي عند الحاجة فقط.
- توسيع عمود اسم الحدث، وتخصيص مقاسات ثابتة مناسبة لأعمدة التاريخ والتكرار وكود الأيقونة والإجراءات.
- اعتماد اتجاه RTL ومحاذاة من اليمين لجميع خلايا الجدول، بما فيها النصوص الإنجليزية والأرقام والرموز.
- إبقاء ترتيب التاريخ وكود الأيقونة بصيغة LTR داخل خلايا محاذاة إلى اليمين حتى لا تنعكس الأحرف أو الأرقام.
- إزالة تعريفات شبكة الأعمدة المكررة وربط الرأس والصفوف بمتغيري CSS مركزيين خاصين بالجدول.
- لم تتغير نسخة الموقع العام لأن نطاق العمل إداري فقط.

الملفات المتأثرة:

- `app/admin/tool-management/date/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `VERSION_LOG.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
npm run deploy
Invoke-WebRequest -Uri 'https://date-tool.com/admin/tool-management/date?v=0.1.13' -Method Head -UseBasicParsing
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `c39ed498-eb5d-4093-8b7d-83028ede1c88`، والتحقق الحي أعاد `200 OK`.

### توحيد جداول إعدادات الأداة وإجراءاتها 0.1.14

ما تم إنجازه:

- توحيد جداول الصفحات والروابط الخارجية والسوشيال ميديا ضمن مكونات جدول مشتركة في ملف تصميم الإدارة.
- جعل الصفوف مخصصة للعرض المنظم افتراضيًا، مع زر قلم يفتح حقول التعديل داخل الصف نفسه.
- إضافة زر تفعيل وتعطيل لكل صفحة ورابط خارجي وحساب سوشيال.
- ربط حالة التفعيل بظهور الصفحات والروابط في الهيدر والفوتر، وبظهور حسابات السوشيال في الفوتر.
- نقل أزرار الإضافة والحفظ أسفل كل جدول، مع الإبقاء على أزرار المعاينة والفتح والحذف الملائمة.
- إضافة تنسيق موحد لقيم الجدول والروابط ذات اتجاه LTR وعينات الألوان والصفوف غير المفعلة.
- لم تتغير نسخة الموقع العام لأن نطاق العمل إداري فقط.

الملفات المتأثرة:

- `app/admin/tools/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `VERSION_LOG.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
npm run deploy
Invoke-WebRequest -Uri 'https://date-tool.com/admin/tools?v=0.1.14' -UseBasicParsing
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `0978de1a-5415-4491-8f1a-34831a04f4c8`، والتحقق الحي أعاد `200 OK`.

### توحيد هيدرات الإدارة ونوافذ الإضافة وإصلاح تأكيد الحذف 0.1.15

ما تم إنجازه:

- تجميع القواعد النهائية لهيدرات السكاشن والبطاقات ورؤوس الجداول وأزرار أسفل الجداول داخل ملف تصميم الإدارة المشترك.
- تثبيت زري الإضافة والحفظ أفقيًا في عمودين متساويين على جميع مقاسات الشاشة.
- إزالة البوردر الخارجي من بطاقات الإدارة المتشابهة والاكتفاء بالخلفية واللون والظل الخفيف للفصل البصري.
- تحويل إضافة الصفحات والروابط الخارجية وحسابات السوشيال إلى نافذة منبثقة موحدة، مع التحقق من الحقول قبل إضافة الصف إلى الجدول.
- إصلاح نافذة تأكيد الحذف العامة بتنفيذ ضغطة الزر الأصلية قبل إزالة النافذة، حتى يعمل الحذف في جميع صفحات الإدارة.
- التحقق من ترتيب صفحات الأدوات العامة: الأسئلة الشائعة هي آخر محتوى في التاريخ والساعة والطقس قبل الفوتر، وتختفي تلقائيًا عند عدم وجود أسئلة.
- إبقاء نسخة الموقع العام `0.3.9` دون تغيير لأن ترتيب الأسئلة لم يحتج تعديلًا برمجيًا في الواجهة العامة.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/AdminShell.jsx`
- `app/admin/tools/page.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `5154af09-abac-4ade-ae66-172d29716a86`.
- نجح التحقق الحي من `/` و`/admin/tools` و`/clock` و`/weather` وأعادت جميعها `200 OK`.
- نجح البناء كاملًا. ظهرت رسائل اتصال `EACCES` بفايربيس بسبب منع الشبكة داخل بيئة الفحص المحلية، ولم تؤثر في نتيجة البناء.
- تفضيل سير العمل المعتمد من المستخدم: بعد كل نشر ناجح تُجمع تغييرات المهمة في `commit` واضح وتُدفع إلى `origin/master` تلقائيًا، ما لم يطلب المستخدم خلاف ذلك صراحةً.

### توحيد عناوين صفحات الإدارة وإجراءات الحفظ العامة 0.1.16

ما تم إنجازه:

- توحيد عناوين صفحات الإدارة بنمط مرئي واحد بلا خلفية، مع محاذاة مركزية للأيقونة والعنوان والوصف واستجابة مناسبة للشاشات الصغيرة.
- تحويل أزرار الحفظ العامة في الهوية وإعدادات الأداة وإعدادات الإعلانات والربط الخارجي إلى أزرار عائمة خضراء يسار الشاشة، مع إبقاء أزرار الإجراءات الأخرى داخل تدفق الصفحة.
- تثبيت بطاقة معاينة رابط المشاركة أثناء تحرير الحقول على الشاشات الواسعة، وإعادتها إلى التدفق الطبيعي على الشاشات الأصغر.
- إزالة الحدود من حقول الإدخال النصية والقوائم ومربعات النص في منصة الإدارة، مع إبقاء حلقة تركيز واضحة لاستخدام لوحة المفاتيح.
- توحيد المسافات حول أزرار الإضافة والحفظ أسفل جداول الإدارة وإضافة تباعد ثابت بين الأزرار.
- إزالة وصف «الإدارة القديمة» من واجهة إدارة الهوية.
- إبقاء نسخة الموقع العام `0.3.9` دون تغيير لأن العمل يخص منصة الإدارة فقط، ورفع نسخة الإدارة إلى `0.1.16`.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/identity/page.jsx`
- `app/admin/tools/page.jsx`
- `app/admin/ad-settings/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
git diff --check
npm run build
npm run deploy
curl.exe -s -o NUL -w "%{http_code}" <url>
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `701df817-8828-4f52-8fea-983f56ff0be2`.
- نجح التحقق الحي من `/admin/identity` و`/admin/tools` و`/admin/ad-settings` و`/admin/integrations` و`/admin/pagespeed`، وأعادت جميعها `200 OK`.
- نجح البناء كاملًا. ظهرت رسائل اتصال `EACCES` بفايربيس بسبب منع الشبكة داخل بيئة الفحص المحلية، ولم تؤثر في نتيجة البناء أو النشر.

### توحيد مسارات أدوات التاريخ وإشعارات IndexNow 0.3.11 / admin 0.1.19

ما تم إنجازه:

- حذف التحويل القديم من `/about` إلى `/about-us` وجعل المسار المحذوف يعيد صفحة غير موجودة، مع استمرار استبعاده من خريطة الموقع حتى لا تعيده بيانات Firebase قديمة.
- حذف ملفات صفحات `/age-calculator` و`/date-converter` و`/date-difference` المستقلة، والإبقاء على تحويلات HTTP `308` توافقية تعيد الروابط القديمة إلى الأداة المقصودة داخل الصفحة الرئيسية وتنفذ تمريرًا تلقائيًا إليها.
- إزالة مسارات أدوات التاريخ الفرعية من الروابط الداخلية وخريطة الموقع وتوحيد روابطها الأساسية على `/` لمنع منافسة صفحات متعددة على المحتوى نفسه.
- إضافة endpoint محمي لإرسال IndexNow، مع ملف إثبات عام في جذر الموقع، وربطه فقط بإضافة الصفحات العامة أو تعديلها أو حذفها من الإدارة.
- مقارنة بيانات الصفحات المحفوظة قبل الإرسال وتحديث `lastModified` عند التغيير الفعلي فقط، دون إرسال IndexNow عند حفظ الروابط أو السوشيال أو بقية الإعدادات غير المتعلقة بالصفحات.
- رفع نسخة الموقع إلى `0.3.11` ونسخة الإدارة إلى `0.1.19` لأن المهمة تشمل مسارات الواجهة العامة ومنصة الإدارة.

الملفات المتأثرة:

- `app/[slug]/page.jsx`
- `middleware.js`
- `app/HomePageClient.jsx`
- `app/components/home/HomeSections.jsx`
- `app/components/ToolSeoContent.jsx`
- `app/admin/tools/page.jsx`
- `app/api/admin/indexnow/route.js`
- `app/sitemap.js`
- `app/toolSettings.js`
- `app/globals.css`
- `public/d7a98f24b63e4c91a5f27038c4e16b92.txt`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/toolSettings.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- منجز برمجيًا؛ إشعارات IndexNow لا تمنح ضمانًا للفهرسة لكنها تُبلغ Bing والمحركات المشاركة عند تغيّر صفحة عامة.
- المتبقي خارج الكود: إرسال `sitemap.xml` من Google Search Console، استيراد الموقع في Bing Webmaster Tools، ثم التحقق من ظهور الخريطة ومراقبة تقرير Queries بعد بدء الانطباعات.

### إدارة SEO ومسارات أدوات التاريخ المستقلة 0.3.10 / admin 0.1.18

ما تم إنجازه:

- إضافة نموذج SEO مركزي إلى إعدادات التاريخ والساعة والطقس، يشمل عنوان نتيجة البحث، الوصف، عنوان `H1`، العبارة الرئيسية، العبارات المساندة، الرابط الأساسي `canonical` وتاريخ التعديل الفعلي.
- إضافة حقول مستقلة للأدوات الفرعية الثلاث في إدارة أداة التاريخ مع معاينة فورية لشكل نتيجة البحث وحفظ القيم في `toolSettings` داخل Firestore.
- نقل عناوين أدوات التاريخ والساعة والطقس الأساسية إلى Server Components حتى يصل `H1` والمحتوى التعريفي وبيانات `metadata` إلى محركات البحث في HTML الأولي.
- إنشاء مسارات مستقلة: `/age-calculator` و`/date-converter` و`/date-difference`، مع إبقاء الأدوات نفسها داخل الصفحة الرئيسية دون تغيير سلوكها الحالي.
- إضافة محتوى نصي مخصص وروابط داخلية وبيانات منظمة `WebApplication` و`BreadcrumbList` و`FAQPage` للمسارات العامة.
- إصلاح `sitemap.xml` بحيث لا يتغير `lastmod` عند كل طلب، بل يأخذ التاريخ المحفوظ عند تعديل إعدادات SEO أو الصفحة الديناميكية.
- استبعاد المسار القديم `/about` من خريطة الموقع وإضافة تحويل دائم إلى `/about-us` لمنع فهرسة نسختين من المحتوى نفسه.
- إبقاء تصميم البطاقات والأدوات وألوان الموقع دون تغيير؛ أضيفت فقط نصوص أدق وروابط دليل نصية وإدارة SEO.

الملفات المتأثرة:

- `app/toolSettings.js`
- `app/toolSeoServer.js`
- `app/components/ToolPageHero.jsx`
- `app/components/ToolSeoContent.jsx`
- `app/page.jsx`
- `app/HomePageClient.jsx`
- `app/clock/page.jsx`
- `app/clock/ClockPageClient.jsx`
- `app/weather/page.jsx`
- `app/weather/WeatherPageClient.jsx`
- `app/age-calculator/page.jsx`
- `app/date-converter/page.jsx`
- `app/date-difference/page.jsx`
- `app/sitemap.js`
- `app/[slug]/page.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/AdminDashboard.css`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- منجز ومفحوص محليًا؛ نجح `npm run lint` ونجح بناء جميع صفحات Next.js بما فيها المسارات الجديدة.
- ظهرت رسائل اتصال `EACCES` أثناء البناء لأن بيئة الفحص المحلية تمنع اتصال Firestore الخارجي، واستخدمت الصفحات القيم الافتراضية الآمنة ولم يفشل البناء.
- المتبقي خارج الكود: نشر النسخة، إعادة إرسال `sitemap.xml` في Search Console، وطلب فهرسة المسارات الجديدة ثم مراقبة تقرير Queries بعد بدء ظهور الانطباعات.

### منع وميض الثيم وتنظيف حدود صفحة الهوية 0.1.17

ما تم إنجازه:

- إضافة تهيئة مبكرة لثيم صفحات الإدارة قبل أول رسم، اعتمادًا على التفضيل المحفوظ أو تفضيل النظام، لمنع ظهور خلفية بيضاء أثناء التحقق من صلاحية الدخول.
- مزامنة زر تبديل المظهر في غلاف الإدارة مع قيمة الثيم المبكرة وحفظ الاختيار في `localStorage`.
- فصل أزرار الحفظ العامة عن هيدرات صفحات الهوية وإعدادات الأداة والإعلانات والربط الخارجي، واعتمادها كأزرار عائمة ثابتة بقياس موحد وتوهج خفيف باستخدام اللون الأخضر الحالي.
- توحيد عرض بطاقة معاينة رابط المشاركة العائمة مع عرض بطاقات معاينة الهوية والتطبيق على الشاشات الواسعة.
- إزالة الحدود الصلبة من الحاويات الداخلية في صفحة الهوية دون تغيير الألوان أو الخلفيات، مع إبقاء حدود مناطق رفع الملفات المتقطعة.
- إبقاء نسخة الموقع العام `0.3.9` دون تغيير لأن العمل يخص منصة الإدارة فقط، ورفع نسخة الإدارة إلى `0.1.17`.

الملفات المتأثرة:

- `app/layout.jsx`
- `app/globals.css`
- `app/admin/AdminShell.jsx`
- `app/admin/AdminDashboard.css`
- `app/admin/identity/page.jsx`
- `app/admin/tools/page.jsx`
- `app/admin/ad-settings/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
npm run deploy
Invoke-WebRequest -Uri <url> -UseBasicParsing
```

الحالة:

- منجز ومفحوص ومنشور على Cloudflare Workers برقم `c532e65d-12fc-4c00-aa85-88981e7d8808`.
- نجح التحقق الحي من `/admin/identity` و`/admin/tools` و`/admin/ad-settings` و`/admin/integrations`، وأعادت جميعها `200 OK`.
- نجح البناء كاملًا. ظهرت رسائل اتصال `EACCES` بفايربيس بسبب منع الشبكة داخل بيئة الفحص المحلية، ولم تؤثر في نتيجة البناء أو النشر.

### توحيد روابط أقسام الأدوات وإكمال SEO للساعة والطقس 0.3.12 / admin 0.1.20

ما تم إنجازه:

- إنشاء منطق مشترك للتمرير إلى أقسام الأدوات عبر رابط يحتوي `hash`، واستخدامه في التاريخ والساعة والطقس بدل تكرار الكود.
- إضافة تحويلات توافقية دائمة HTTP `308` لمسارات محول الساعة وفرق التوقيت وأقسام الطقس، بحيث تفتح الصفحة الأساسية ثم تنتقل إلى القسم المقصود.
- إبقاء `/clock` و`/weather` كصفحتين أساسيتين مستقلتين وقابلتين للفهرسة، وعدم إنشاء صفحات منفصلة مكررة للأقسام الداخلية.
- إضافة معرفات ثابتة لأقسام الساعة والطقس وتوسيع `scroll-margin-top` لها دون تغيير التصميم أو المقاسات.
- إزالة الثواني من شريط الساعة الحالية، وتحديث الوقت مرة كل دقيقة بدل كل ثانية لتقليل العمل غير الضروري في المتصفح.
- قصر خيارات محول نظام 24 ساعة على الساعات من `13` إلى `24` مع بقاء تحويل الساعة `24` إلى منتصف الليل صحيحًا.
- إضافة سجلات SEO قابلة للإدارة للأدوات الداخلية في الساعة والطقس، وتشمل عنوان البحث والوصف والعنوان والعبارات المستهدفة والرابط الأساسي وتاريخ التعديل.
- رفع نسخة الموقع إلى `0.3.12` ونسخة الإدارة إلى `0.1.20` لأن المهمة عدلت الواجهة العامة وإدارة SEO معًا.

الملفات المتأثرة:

- `middleware.js`
- `app/useSectionHashScroll.js`
- `app/HomePageClient.jsx`
- `app/clock/ClockPageClient.jsx`
- `app/weather/WeatherPageClient.jsx`
- `app/toolSettings.js`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3099
curl.exe -s -o NUL -w "%{http_code} %{redirect_url}" http://localhost:3099/time-converter
curl.exe -s -o NUL -w "%{http_code} %{redirect_url}" http://localhost:3099/current-weather
git diff --check
```

الحالة:

- نجح `npm run lint` ونجح `npm run build` كاملًا.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء البناء بسبب منع الشبكة في بيئة الفحص، ثم أكمل Next.js إنشاء الصفحات بنجاح باستخدام القيم الافتراضية الآمنة.
- نجح اختبار التحويل المحلي: `/time-converter` أعاد `308` إلى `/clock#time-converter`، و`/current-weather` أعاد `308` إلى `/weather#current-weather`.
- المتبقي خارج الكود: انتظار النشر المرتبط بالدفع إلى `master` ثم إعادة إرسال `sitemap.xml` في Search Console، وبعدها ربط Bing Webmaster Tools واستيراد الملكية والخريطة من Search Console.

### إظهار روابط الأدوات الداخلية وتصحيح منتصف الليل 0.3.13 / admin 0.1.21

ما تم إنجازه:

- إنشاء ملف مركزي واحد يعرّف روابط أدوات التاريخ والساعة والطقس الداخلية ومسار الصفحة الأساسية ومعرف القسم الذي يجب التمرير إليه.
- ربط `middleware` بهذا الملف بدل الاحتفاظ بقائمة تحويلات منفصلة، لمنع اختلاف الرابط المنفذ عن الرابط المعروض في الإدارة.
- إظهار الرابط المخصص لكل أداة داخلية في قسم SEO مع زر فتح مباشر، بما يشمل الأدوات التسع في التاريخ والساعة والطقس.
- إبقاء الروابط المخصصة ثابتة في الكود لأنها جزء من بنية Routes، مع إبقاء بيانات SEO النصية قابلة للتعديل والحفظ في Firebase داخل `settings/main.toolSettings`.
- تصحيح خيارات محول 24 ساعة لتعرض `13` حتى `23` ثم `00`، لأن منتصف الليل يكتب `00` وليس `24` في قيمة الوقت القياسية.
- رفع نسخة الموقع إلى `0.3.13` ونسخة الإدارة إلى `0.1.21` لأن التعديل شمل الواجهة العامة ولوحة الإدارة.

الملفات المتأثرة:

- `toolSectionRoutes.js`
- `middleware.js`
- `app/clock/ClockPageClient.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3099
curl.exe -s -o NUL -w "%{http_code} %{redirect_url}" http://localhost:3099/<tool-path>
git diff --check
```

الحالة:

- نجح `npm run lint` و`npm run build` و`git diff --check`.
- نجح الفحص المحلي للمسارات التسعة، وأعاد كل رابط `308` إلى الصفحة الأساسية ومعرف القسم الصحيح.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء البناء بسبب منع الشبكة في بيئة الفحص، ثم اكتمل البناء بالقيم الافتراضية الآمنة دون فشل.
- جاهز للالتزام والدفع إلى `origin/master`.
- لا توجد بيانات SEO ثابتة إجبارية على المدير: القيم الموجودة في الكود قيم افتراضية آمنة فقط، وما يحفظ من منصة الإدارة في Firebase يتقدم عليها.

### روابط Canonical فعلية وتنظيف نصوص الأدوات 0.3.14 / admin 0.1.22

ما تم إنجازه:

- تحويل المسارات الداخلية التسعة لأدوات التاريخ والساعة والطقس إلى صفحات فعلية تعيد `200 OK`، مع إعادة استخدام واجهة الصفحة الأساسية والتركيز أو التمرير إلى الأداة المطلوبة.
- جعل رابط كل أداة داخلية هو رابطها `Canonical` الحقيقي وإدراج الروابط التسعة في `sitemap.xml` مع تاريخ التعديل المحفوظ لكل أداة.
- إزالة تحويلات `308` الخاصة بمسارات الأدوات من `middleware` حتى لا يتحول الرابط الأساسي الجديد إلى رابط آخر.
- حذف قسم نصوص الأداة القديم من إدارة التاريخ والساعة والطقس، بما يشمل اسم الأداة في الإدارة والعنوان التعريفي والسلوغن.
- حذف الحقول القديمة `label` و`heroTitle` و`heroDescription` من القيم الافتراضية والتطبيع والتخزين، والاعتماد على إعدادات SEO وH1 وأسماء الأدوات الفرعية.
- تعديل حفظ `toolSettings` ليستبدل الخريطة كاملة في Firebase، وبذلك تُحذف الحقول القديمة عند حفظ إعدادات الأدوات ولا تبقى بيانات غير مستخدمة.
- إزالة خانة Canonical المنفصلة وعرض الرابط المخصص المكرر للأدوات الداخلية، وإظهار الرابط الأساسي داخل معاينة SEO مع أيقونة فتح صغيرة.
- تصحيح مفتاح قسم توقعات الطقس ليتطابق مع معرف الأداة المحفوظ في الإعدادات.
- رفع نسخة الموقع إلى `0.3.14` ونسخة الإدارة إلى `0.1.22` لأن المهمة شملت الواجهة العامة ومنصة الإدارة.

الملفات المتأثرة:

- `toolSectionRoutes.js`
- `middleware.js`
- `app/[slug]/page.jsx`
- `app/HomePageClient.jsx`
- `app/clock/ClockPageClient.jsx`
- `app/weather/WeatherPageClient.jsx`
- `app/useSectionHashScroll.js`
- `app/components/ToolSeoContent.jsx`
- `app/toolSeoServer.js`
- `app/toolSettings.js`
- `app/firebase.js`
- `app/sitemap.js`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tool-management/clock/page.jsx`
- `app/admin/tool-management/weather/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3099
curl.exe -s -o NUL -w "%{http_code}" http://localhost:3099/<tool-path>
curl.exe -s http://localhost:3099/sitemap.xml
git diff --check
```

الحالة:

- نجح `npm run lint` و`npm run build` والفحص المحلي الأولي للمسارات التسعة.
- أعاد كل مسار داخلي `200 OK` مع رابط `Canonical` مطابق للمسار نفسه، وظهرت الروابط التسعة في `sitemap.xml`.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء البناء بسبب منع الشبكة داخل بيئة الفحص، ثم اكتمل البناء باستخدام القيم الافتراضية الآمنة.
- تنظيف الحقول القديمة في Firebase مضمّن في مسار الحفظ الدقيق لخريطة `toolSettings` ويُطبق عند أول حفظ لإعدادات أي أداة بعد نشر هذه النسخة.

### إعادة حقل Canonical للأدوات الداخلية 0.3.15 / admin 0.1.23

ما تم إنجازه:

- إعادة خانة إدخال الرابط الأساسي `Canonical` داخل إعدادات SEO لكل أداة داخلية في التاريخ والساعة والطقس.
- إبقاء رابط الأداة المخصص ثابتًا داخل بطاقة المعاينة، مع فصل قيمته عن حقل `Canonical` القابل للتعديل.
- اعتماد رابط الصفحة الداخلية الفعلي كقيمة افتراضية، مثل `/time-converter`، بدل الرابط العام للأداة مثل `/clock`.
- حفظ القيم المخصصة لحقل `Canonical` ضمن `toolSettings` في Firebase وعدم استبدالها عند إعادة تحميل الإعدادات.
- ترحيل القيم القديمة التي كانت مطابقة لرابط الصفحة الأم إلى رابط الأداة الداخلي، مع الحفاظ على أي قيمة مخصصة مختلفة.
- رفع نسخة الموقع إلى `0.3.15` ونسخة الإدارة إلى `0.1.23` لأن الحقل يتحكم في بيانات `Canonical` العامة من منصة الإدارة.

الملفات المتأثرة:

- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/toolSettings.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm version 0.3.15 --no-git-tag-version
npm run lint
npm run build
git diff --check
```

الحالة:

- حقل `Canonical` ظاهر وقابل للتعديل لكل الأدوات الداخلية التسعة.
- لا يعيد هذا التعديل قسم نصوص الأداة أو الحقول المحذوفة سابقًا.
- القيم الجديدة قابلة للحفظ في Firebase من زر حفظ إعدادات الأداة.

### تصحيح معاينات المشاركة وإكمال مشاركة النتائج 0.3.16 / admin 0.1.24

ما تم إنجازه:

- فصل بيانات النتائج الافتراضية في معاينة الإدارة حسب معرف قالب المشاركة بدل استخدام نتيجة واحدة لكل الأدوات.
- تصحيح معاينة محول الساعة لتعرض `13:30` و`1:30 م` بدل نتيجة عمر.
- تصحيح معاينة حساب المدة لتعرض تاريخين تجريبيين ونتيجة مدة مناسبة.
- ربط نتيجة حساب المدة بين تاريخين بزر المشاركة والقالب المحفوظ في Firebase، مع تمرير التاريخين والنتيجة الفعلية.
- إضافة مشاركة مستقلة للطقس الحالي ونصيحة الخروج وتوقعات الأيام الخمسة، مع احترام مفاتيح التفعيل وقوالب Firebase.
- نقل محتوى SEO في الساعة والطقس قبل الأسئلة الشائعة، لتصبح الأسئلة الشائعة آخر محتوى قبل الفوتر في التاريخ والساعة والطقس ومساراتها الداخلية.
- رفع نسخة الموقع إلى `0.3.16` ونسخة الإدارة إلى `0.1.24` لأن المهمة شملت الواجهة العامة ومعاينات الإدارة.

الملفات المتأثرة:

- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/HomePageClient.jsx`
- `app/weather/WeatherPageClient.jsx`
- `app/clock/ClockPageClient.jsx`
- `app/clock/page.jsx`
- `app/weather/page.jsx`
- `app/[slug]/page.jsx`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- نجح `npm run lint` و`npm run build`.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء توليد الصفحات بسبب منع الشبكة داخل بيئة الفحص، ثم اكتمل البناء بنجاح باستخدام القيم الافتراضية الآمنة.
- لم تتغير ألوان الأدوات أو هيكل بطاقاتها؛ أضيفت أزرار المشاركة باستخدام الستايل المشترك الموجود.

### تحسين مشاركة الطقس وقالب حساب المدة 0.3.17 / admin 0.1.25

ما تم إنجازه:

- نقل زر مشاركة نتيجة الطقس الحالي إلى صف عنوان بطاقة الطقس بحجم صغير في الجهة المقابلة، بدل ظهوره كزر بعرض البطاقة أسفل المقاييس.
- تعديل سكيلتون بطاقة الطقس ليحجز صف العنوان وزر المشاركة الصغير قبل ظهور البيانات، لتقليل اختلاف الارتفاع وتغير التخطيط أثناء التحميل.
- إبقاء دليل أهمية تحويل التواريخ لأنه محتوى مفيد لـ SEO وأدسنس، مع تقليل المسافة قبله ليتصل بصريًا بالمحتوى النصي السابق دون تغيير هوية البطاقة.
- استبدال متغير الإدخال المجمع في قالب مشاركة حساب المدة بمتغيرين مستقلين: `{firstDate}` للتاريخ الأول و`{secondDate}` للتاريخ الثاني.
- تمرير التاريخين الفعليين من حساب المدة الميلادي والهجري إلى نص المشاركة، مع إبقاء المتغيرات القديمة داخليًا للتوافق مع أي قالب مخصص سابق.
- إضافة نتائج افتراضية منفصلة للتاريخ الأول والثاني في معاينة الإدارة، وتحديث القالب الافتراضي ليعرضهما بوضوح.
- إضافة ترحيل آمن للقوالب الافتراضية القديمة المحفوظة في Firebase إلى القالب الجديد، دون استبدال أي نص مشاركة مخصص كتبه المدير.
- جعل خلفية حقل تحرير نص المشاركة داخل النافذة المنبثقة أغمق من خلفية المعاينة، دون إضافة حدود جديدة.
- رفع نسخة الموقع إلى `0.3.17` ونسخة الإدارة إلى `0.1.25` لأن المهمة شملت الواجهة العامة ومنصة الإدارة.

الملفات المتأثرة:

- `app/weather/WeatherPageClient.jsx`
- `app/components/home/HomeSections.jsx`
- `app/HomePageClient.jsx`
- `app/toolSettings.js`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/AdminDashboard.css`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm version 0.3.17 --no-git-tag-version
npm run lint
npm run build
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` واكتمل توليد جميع الصفحات الثلاثين.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء توليد الصفحات بسبب منع الشبكة داخل بيئة الفحص، ثم اكتمل البناء بنجاح باستخدام القيم الافتراضية الآمنة.
- نجح `git diff --check`، والتعديلات جاهزة للالتزام والدفع إلى `origin/master`.

### إعادة ترتيب بطاقة الطقس وتوضيح أزرار المشاركة 0.3.18 / admin 0.1.25

ما تم إنجازه:

- إعادة اسم المدينة والدولة إلى داخل رأس معلومات الطقس مع الحرارة والحالة كما كان قبل نقل زر المشاركة.
- إعادة زر مشاركة الطقس الحالي إلى أسفل بطاقة الطقس بعرض البطاقة الكامل.
- إعادة سكيلتون الطقس إلى البنية السابقة حتى يطابق ترتيب البطاقة الفعلي أثناء التحميل.
- تغيير اسم زر الطقس الحالي إلى `مشاركة معلومات الطقس`.
- تغيير اسم زر نصيحة الخروج إلى `مشاركة نصيحة اليوم`.
- تغيير اسم زر توقعات الأيام إلى `مشاركة توقعات الطقس`.
- رفع نسخة الموقع العام إلى `0.3.18` مع إبقاء نسخة الإدارة `0.1.25` لأن منصة الإدارة لم تتغير في هذه الجولة.

الملفات المتأثرة:

- `app/weather/WeatherPageClient.jsx`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm version 0.3.18 --no-git-tag-version
npm run lint
npm run build
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` واكتمل توليد جميع الصفحات الثلاثين.
- ظهرت رسائل اتصال `EACCES` بفايربيس أثناء توليد الصفحات بسبب منع الشبكة داخل بيئة الفحص، ثم اكتمل البناء باستخدام القيم الافتراضية الآمنة.
- نجح `git diff --check`، والتعديل جاهز للالتزام والدفع إلى `origin/master`.

### نشر الإنتاج 0.3.18 / admin 0.1.25

ما تم إنجازه:

- نشر نسخة الإنتاج الحالية عبر OpenNext for Cloudflare إلى العامل الصحيح `datetools`.
- رفع 25 أصلًا ثابتًا جديدًا أو معدلًا مع إعادة استخدام 69 أصلًا موجودًا.
- نشر مسارات العامل وربطها بإعدادات R2 وImages والأصول والخدمة الذاتية الحالية دون تعديل تكوينها.
- تثبيت إصدار Cloudflare بالمعرف `3d4751ad-64b1-4038-8723-f4fcf127b0d7`.
- إبقاء نسخة الموقع `0.3.18` ونسخة الإدارة `0.1.25` دون تغيير، لأن هذه الخطوة نشر وتوثيق فقط.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
Unblock-File node_modules\@ast-grep\napi-win32-x64-msvc\ast-grep-napi.win32-x64-msvc.node
npm run deploy
```

الحالة:

- نجح بناء Next.js واكتمل توليد جميع الصفحات الثلاثين.
- نجح إنشاء حزمة OpenNext ورفع الأصول ونشر العامل `datetools`.
- زمن بدء العامل المنشور 27 مللي ثانية بحسب نتيجة Wrangler.
- رابط العامل المباشر: `https://datetools.date-tool-official.workers.dev`.
- إصدار Cloudflare الحالي: `3d4751ad-64b1-4038-8723-f4fcf127b0d7`.

### تحسين HTML الأولي وبيانات الفهرسة 0.3.19 / admin 0.1.25

ما تم إنجازه:

- تمرير إعدادات الهوية العامة المفلترة من الخادم إلى `SiteShell` حتى يظهر الهيدر والفوتر ومحتوى الصفحة في HTML الأولي بدل شاشة تحميل تعتمد على JavaScript.
- نقل فلترة بيانات الموقع العامة إلى وحدة مشتركة يستخدمها العرض الخادمي ومسار `/api/site-config`، مع استبعاد بيانات الإدارة والحملات والربط الخاص.
- تحويل اسم العلامة في الهيدر من `h1` إلى عنصر نصي، والإبقاء على `h1` واحد خاص بعنوان الصفحة في الصفحات العامة.
- إضافة محتوى نصي مستقل لكل واحدة من الأدوات الداخلية التسع: ثلاث أدوات تاريخ، وأداتا ساعة، وأربع أدوات طقس.
- إضافة روابط داخلية خادمية بين الأدوات الشقيقة داخل كل عائلة لتسهيل الزحف والاكتشاف دون تغيير وظائف الأدوات.
- تصحيح `lastmod` في `sitemap.xml`: صفحات المحتوى الثابت بلا تاريخ موثوق لا ترسل قيمة وهمية، وصفحات الأدوات تستخدم أحدث تاريخ بين إعداد SEO المحفوظ وتاريخ تعديل محتوى عائلة الأداة.
- تحليل تقريري Search Console المحفوظين: الخريطة الصحيحة `/sitemap.xml` ناجحة وتضم 17 رابطًا، بينما توجد إضافة قديمة خاطئة باسم `/sitemap.xm` ينبغي حذفها يدويًا من Search Console.
- التحقق من الأدوات الداخلية التسع: 9 عناوين نتائج فريدة، و9 أوصاف فريدة، و9 عناوين `H1` فريدة، وروابط `Canonical` مطابقة لمساراتها.
- التحقق من JSON-LD في المسارات التسعة: نجح التحليل وظهرت أنواع `WebSite` و`WebApplication` و`BreadcrumbList` و`FAQPage`.
- التحقق من تطابق الأسئلة المرئية مع `FAQPage` في عينة من كل عائلة؛ تطابقت الأسئلة الثلاثة نصًا وعددًا. الأسئلة حاليًا مشتركة داخل كل عائلة وليست مخصصة لكل أداة فرعية.
- رفع نسخة الموقع العام إلى `0.3.19` مع إبقاء نسخة الإدارة `0.1.25` لأن واجهة الإدارة لم تتغير.

الملفات المتأثرة:

- `app/Header.jsx`
- `app/SiteShell.jsx`
- `app/layout.jsx`
- `app/publicSiteConfig.js`
- `app/api/site-config/route.js`
- `app/components/ToolSeoContent.jsx`
- `app/globals.css`
- `app/sitemap.js`
- `app/toolSeoServer.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3099
Invoke-WebRequest http://localhost:3099/<tool-path>
Invoke-WebRequest http://localhost:3099/sitemap.xml
npm version 0.3.19 --no-git-tag-version
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` واكتمل توليد جميع الصفحات الثلاثين.
- أظهرت رسائل `EACCES` أن بيئة الفحص منعت اتصالات Firebase الخارجية أثناء البناء، ثم اكتمل البناء بالقيم الافتراضية الآمنة.
- نجح فحص HTML الخام محليًا للمسارات التسعة: `H1` واحد، محتوى نصي، وروابط داخلية موجودة قبل تشغيل JavaScript.
- أعادت خريطة الموقع 17 رابطًا؛ صفحات الأدوات تحمل تاريخ تعديل موثوقًا وصفحات المحتوى التي لا تملك تاريخًا دقيقًا لا ترسل `lastmod`.
- المتبقي يدويًا في Search Console: حذف إدخال `/sitemap.xm`، وفحص مثال حالة «تم الزحف ولم تتم الفهرسة حاليًا»، ثم طلب فهرسة الصفحات الأساسية بعد وصول النسخة للإنتاج.
- Bing Webmaster Tools وIndexNow الخارجي مؤجلان إلى مرحلة مستقلة بعد إنهاء Google Search Console حسب قرار المستخدم.

### إزالة قسم الأدوات المرتبطة المرئي 0.3.20 / admin 0.1.25

ما تم إنجازه:

- إزالة قسم "أدوات مرتبطة" المرئي من المحتوى النصي لصفحات التاريخ والساعة والطقس، بما في ذلك صفحات الأدوات الداخلية التسع.
- حذف قائمة الروابط الثابتة واستيراد `next/link` وأنماط CSS التي أصبحت غير مستخدمة.
- الحفاظ على قابلية اكتشاف الأدوات التسع من خلال مساراتها المستقلة في `sitemap.xml`، وروابط `canonical`، وبيانات `BreadcrumbList`، ومحتوى HTML الخادمي الفريد لكل أداة.
- عدم استبدال القسم بروابط مخفية؛ الزحف يعتمد على البنية التقنية الدلالية وخريطة الموقع بدل عنصر بصري لا يفيد الزائر.
- إبقاء نسخة منصة الإدارة `0.1.25` ورفع نسخة الموقع العام فقط إلى `0.3.20` لأن التعديل يخص الواجهة العامة.

الملفات المتأثرة:

- `app/components/ToolSeoContent.jsx`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm version 0.3.20 --no-git-tag-version
npm run lint
npm run build
npm start -- -p 3099
Invoke-WebRequest http://localhost:3099/<tool-path>
Invoke-WebRequest http://localhost:3099/sitemap.xml
git diff --check
```

الحالة:

- قسم الروابط المرئي وكوده غير المستخدم أزيلا.
- إعدادات الربط الخارجي ما زالت تدعم Google tag وGoogle Tag Manager بعد موافقة التحليلات؛ ترك حقل GTM فارغًا يمنع تحميله ولا يؤثر في SEO أو Search Console.
- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` واكتمل توليد جميع الصفحات الثلاثين؛ منعت بيئة الفحص اتصال Firebase الخارجي برسائل `EACCES` ثم اكتمل البناء بالقيم الافتراضية الآمنة.
- نجح فحص HTML الخام للمسارات الداخلية التسعة: استجابة `200`، وعنوان `H1` واحد، و`canonical` مطابق للمسار، وبيانات `WebApplication` و`BreadcrumbList` موجودة، وقسم الروابط المرئي غير موجود.
- بقيت عناوين نتائج البحث والأوصاف وعناوين `H1` فريدة بنسبة `9/9` لكل مجموعة بعد إزالة القسم.
- أعادت `sitemap.xml` عدد 17 رابطًا بعد التعديل.
- نجح `git diff --check` دون أخطاء مسافات أو تنسيق.

### تدقيق جاهزية Google AdSense 0.3.20 / admin 0.1.25

ما تم إنجازه:

- تحليل نسخة صفحة حالة `date-tool.com` المحفوظة من Google AdSense دون تغيير أي ملف تشغيلي.
- تأكيد أن حالة الموقع في التقرير هي `يتطلب عناية` وأن سببَي عدم الجاهزية هما: `الإعلانات التي تعرضها Google على الشاشات بدون محتوى الناشر` و`محتوى غير ذي قيمة`.
- تأكيد وجود تنبيه منفصل داخل الحساب لإكمال معلومات الدفع وربط الموقع الإلكتروني.
- فحص `https://date-tool.com/ads.txt` مباشرة؛ أعاد استجابة `200` ويحتوي سطر الناشر الصحيح `pub-1147243690926079`، ولذلك حالة `غير متوفّر` في تقرير AdSense قديمة وتحتاج إلى إعادة زحف من Google.
- فحص الصفحات العامة الأساسية والأدوات الداخلية المنشورة؛ جميع روابط خريطة الموقع السبعة عشر تستجيب بحالة `200` وتملك عنوان `H1` واحدًا.
- رصد أن صفحات الطقس الداخلية هي الأقل نصًا بين صفحات الأدوات، وأن صفحة `month-names` قصيرة نسبيًا وتحتاج إلى تقوية أو استبعاد مؤقت من الفهرسة إذا لم يضف لها محتوى مفيد.
- رصد أن محتوى الصفحات المدارة مثل الخصوصية والشروط ومن نحن يُحمّل في `PageClient` بعد تشغيل JavaScript، بينما من الأفضل لجاهزية المحتوى أن يصل النص الأساسي في HTML الخادمي.
- تأكيد أن أرقام وحدات AdSense اليدوية في إعدادات المواضع العامة فارغة حاليًا، لذلك لا تُنشأ وحدات يدوية من هذه المواضع؛ يبقى فحص إعداد `الإعلانات التلقائية` داخل AdSense ضروريًا لأنه قد يكون مصدر الظهور على شاشات منخفضة المحتوى.
- لم تتغير نسخة الموقع `0.3.20` أو نسخة الإدارة `0.1.25` لأن هذه الجولة تدقيق وتوثيق فقط.

المتبقي قبل طلب مراجعة AdSense:

- إيقاف الإعلانات التلقائية مؤقتًا أو استثناء الصفحات غير المناسبة، وعدم عرض إعلانات على صفحات الدخول والإدارة والأخطاء والتنبيهات والصفحات قليلة المحتوى.
- تقليل كثافة المواضع في صفحات الأدوات الداخلية؛ الثلاثة مواضع الحالية كثيرة عند فتح أداة فرعية واحدة، والأفضل عرض موضع يدوي واحد بعد محتوى فعلي حتى اكتمال الموافقة.
- تقوية المحتوى الفريد للأدوات الداخلية، خصوصًا أدوات الطقس، بأمثلة وحدود الاستخدام ومصدر البيانات وطريقة الاستفادة العملية دون حشو.
- نقل محتوى الصفحات المدارة العامة إلى العرض الخادمي الأولي، مع الإبقاء على الإدارة من Firebase.
- تحسين صفحة `month-names` أو إخراجها مؤقتًا من خريطة الموقع حتى تقدم قيمة كافية.
- إكمال معلومات الدفع وخطوة ربط الموقع من حساب AdSense، ثم الانتظار حتى تتحدث حالة `ads.txt`.
- فتح AdSense دون مانع إعلانات قبل طلب المراجعة؛ النسخة المحفوظة أظهرت خطأ واجهة سببه مانع الإعلانات.
- طلب المراجعة فقط بعد تنفيذ البنود السابقة والتأكد من فهرسة الصفحات الأساسية في Search Console.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
Invoke-WebRequest https://date-tool.com/ads.txt
Invoke-WebRequest https://date-tool.com/sitemap.xml
Invoke-WebRequest https://date-tool.com/<public-path>
rg -n "GoogleAdsenseUnit|adsbygoogle|PublicAdSlot|ca-pub|adsense" app
```

الحالة:

- الربط الأساسي وملف `ads.txt` يعملان، لكن تقرير AdSense ما زال يرفض الموقع لأسباب جودة المحتوى وقيمة الشاشات الإعلانية.
- لا يوجد ضمان للقبول بعد الإصلاح؛ قرار المراجعة النهائي بيد Google وقد يستغرق عدة أيام أو حتى بضعة أسابيع.

### العرض الخادمي للصفحات المدارة من Firebase 0.3.21 / admin 0.1.25

ما تم إنجازه:

- جلب الصفحة العامة المطلوبة من مستند إعدادات Firebase داخل مسار `[slug]` الخادمي وتمريرها إلى مكوّن الصفحة قبل الترطيب.
- جعل محتوى صفحات مثل `privacy` و`terms` و`about-us` موجودًا داخل HTML الأولي بدل انتظار طلب `/api/site-config` بعد تشغيل JavaScript.
- إبقاء طلب إعدادات الصفحات في المتصفح للمزامنة اللاحقة، مع الاحتفاظ بالمحتوى الخادمي إذا تعذر الاتصال بدل إظهار رسالة خطأ للزائر.
- تمرير الصفحة المطلوبة وبريد التواصل العام فقط إلى المكوّن، وعدم تضمين إعدادات Firebase الكاملة في HTML.
- الحفاظ على نموذج `contact` التفاعلي وعلى التنسيق والهوية البصرية دون تعديل CSS.
- رفع نسخة الموقع العام إلى `0.3.21` مع إبقاء نسخة الإدارة `0.1.25` لأن التعديل يخص إخراج الصفحات العامة.

الملفات المتأثرة:

- `app/[slug]/page.jsx`
- `app/[slug]/PageClient.jsx`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3102
Invoke-WebRequest http://localhost:3102/privacy
Invoke-WebRequest http://localhost:3102/terms
Invoke-WebRequest http://localhost:3102/about-us
Invoke-WebRequest http://localhost:3102/contact
npm version 0.3.21 --no-git-tag-version
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` واكتمل توليد 30 صفحة؛ ظهرت رسائل `EACCES` لاتصال Firebase أثناء البناء داخل البيئة المقيدة، ثم اكتمل البناء بالقيم الاحتياطية الآمنة.
- نجح الفحص المحلي مع اتصال Firebase: أعادت الصفحات الأربع استجابة `200`.
- احتوت صفحات `privacy` و`terms` و`about-us` على عنصر `static-page-content` في HTML الخام ولم يظهر هيكل `static-page-loading`.
- احتوت صفحة `contact` على نموذج `contact-page-form` داخل HTML الخام دون هيكل تحميل.
- لا يوجد تغيير بصري، وما زالت النصوص قابلة للتعديل من منصة الإدارة وتظهر خادميًا في الطلب التالي بعد مدة إعادة التحقق القصيرة.

### إدارة تذاكر الدعم 0.3.21 / admin 0.1.26

ما تم إنجازه:

- إضافة صفحة `/admin/support` داخل هيكل الإدارة الثابت لعرض تذاكر `support_tickets` نفسها التي ينشئها نموذج التواصل العام.
- إضافة عدادات إجمالية، بحث بالرقم والاسم والبريد والعنوان والنص، وتصفية حسب حالة التذكرة.
- بناء جدول تذاكر متوافق مع ستايل جداول الإدارة الموحد، مع إجراءات عرض التفاصيل، تنزيل المرفق الخاص، وحذف التذكرة.
- إضافة نافذة تفاصيل تسمح بتغيير الحالة بين: جديدة، قيد المتابعة، بانتظار العميل، ومغلقة، مع حفظ ملاحظة داخلية والرد على العميل عبر البريد.
- إضافة مسار `/api/admin/support` للتحقق من Firebase ID Token ومن أن حساب الإدارة نشط قبل أي قراءة أو تحديث أو حذف.
- إبقاء مفاتيح `support/...` خاصة وعدم تمريرها إلى `/api/media` العام؛ تنزيل المرفق يتم عبر استجابة خاصة غير مخزنة بعد التحقق من المدير.
- حذف مرفق R2 عند حذف التذكرة لمنع الملفات اليتيمة، مع منع حذف مفاتيح لا تبدأ بالمسار الآمن `support/`.
- توجيه عنصر "الدعم" في القائمة الثابتة وجميع القوائم الداخلية القديمة إلى `/admin/support`، وإتاحته للمساعد عند منحه صلاحية `support` أو `tickets`.
- تحميل Firebase Auth عند الطلب داخل الصفحة لتقليل حجم JavaScript الأولي، وعدم تغيير نسخة الموقع العام.

الملفات المتأثرة:

- `app/admin/support/page.jsx`
- `app/api/admin/support/route.js`
- `app/admin/AdminShell.jsx`
- `app/admin/AdminDashboard.css`
- `app/admin/page.jsx`
- `app/admin/ad-settings/page.jsx`
- `app/admin/ads/page.jsx`
- `app/admin/identity/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/admin/pagespeed/page.jsx`
- `app/admin/tools/page.jsx`
- `app/admin/tool-management/ToolManagementShell.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3110
Invoke-WebRequest http://localhost:3110/admin/support
Invoke-WebRequest http://localhost:3110/api/admin/support
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح `npm run build` وأضيفت صفحة `/admin/support` ومسار `/api/admin/support` إلى مخرجات Next.js؛ رسائل `EACCES` تخص منع اتصال Firebase الخارجي داخل بيئة الفحص ولم توقف البناء.
- أعادت صفحة الإدارة محليًا استجابة `200`، وأعاد مسار API دون رمز مدير استجابة `401` كما يجب.
- المتبقي اختبار دورة فعلية بعد وصول النسخة للإنتاج: فتح تذكرة حقيقية، تغيير حالتها، تنزيل مرفق، ثم حذف تذكرة تجريبية والتأكد من إزالة كائن R2.

### توحيد مسمى التذاكر في السايد بار 0.3.21 / admin 0.1.27

ما تم إنجازه:

- تغيير اسم رابط `/admin/support` في السايد بار من "الدعم" إلى "التذاكر" ليطابق محتوى الصفحة الفعلي.
- استبدال أيقونة السماعة بأيقونة التذكرة في القائمة الثابتة وجميع القوائم الداخلية القديمة.
- إبقاء المسار والصلاحيات وواجهة جدول التذاكر دون تغيير، وعدم تعديل نسخة الموقع العام.

الملفات المتأثرة:

- `app/admin/AdminShell.jsx`
- `app/admin/page.jsx`
- `app/admin/ad-settings/page.jsx`
- `app/admin/ads/page.jsx`
- `app/admin/identity/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/admin/pagespeed/page.jsx`
- `app/admin/tools/page.jsx`
- `app/admin/tool-management/ToolManagementShell.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
rg -n "الدعم|/admin/support|fa-headset" app/admin
npm run lint
git diff --check
```

الحالة:

- رابط "التذاكر" يفتح جدول التذاكر عبر `/admin/support`، ولا توجد تسمية "الدعم" متبقية لهذا الرابط داخل قوالب الإدارة.

### تحسين واجهة إدارة التذاكر 0.3.21 / admin 0.1.28

ما تم إنجازه:

- توحيد أيقونة عنوان صفحة التذاكر مع أيقونة الرابط في السايد بار.
- إعادة بناء بطاقات الإحصاءات لتكون مضغوطة ومتباعدة، مع أيقونة ولون حالة خفيف لكل بطاقة.
- إصلاح التصاق البطاقات الناتج عن استخدام متغير `--admin-control-gap` دون تعريفه، وتعريفه ضمن متغيرات تصميم الإدارة المشتركة.
- تحسين الحشوات والمسافات في قسم جدول التذاكر مع ضبط خاص للشاشات الصغيرة دون تغيير وظائف الصفحة.
- إبقاء ألوان الإدارة الأساسية ومسار التذاكر وAPI والصلاحيات دون تغيير.

الملفات المتأثرة:

- `app/admin/support/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- بطاقات الإحصاءات لم تعد متلاصقة، وتظهر في أربعة أعمدة على الشاشات الواسعة وعمودين متوازنين على الجوال.

### إصلاح إرسال نموذج التواصل ورسائل التذاكر 0.3.22 / admin 0.1.28

ما تم إنجازه:

- إصلاح الحالة التي كانت تنشئ التذكرة في Firebase ثم تعرض رسالة فشل للعميل بسبب محاولة استخدام `event.currentTarget` بعد اكتمال الطلب غير المتزامن.
- حفظ مرجع النموذج قبل بدء الطلب واستخدامه لإعادة الضبط بعد نجاح الحفظ، بحيث لا تستبدل رسالة النجاح برسالة خطأ بعد إنشاء التذكرة.
- تحسين رسالة النجاح لتؤكد إرسال الرسالة، وتوضح أن الرد سيكون خلال 27 ساعة، وتعرض رقم التذكرة الذي أعاده الخادم.
- إضافة أرقام أخطاء عامة من عائلة `SUP-*` إلى مسار الدعم بدل عرض التفاصيل الداخلية، مع أرقام مستقلة لأخطاء الإدخال والحجم والمرفق والإعداد والمصادقة والحفظ.
- تحسين رسالة الخطأ لتعرض رقم الخطأ العام وبريد التواصل المباشر القادم من إعدادات هوية الموقع، دون تضمين أسرار أو تفاصيل تقنية حساسة.
- تحسين زر إغلاق التنبيه ليكون دائريًا وخفيفًا، ومنع تنسيق زر إرسال نموذج التواصل من التمدد إلى أزرار التنبيهات.
- دعم الأسطر المتعددة داخل رسائل التنبيه حتى يظهر رقم التذكرة أو البريد في سطر مستقل وواضح.
- رفع نسخة الموقع العام إلى `0.3.22` مع إبقاء نسخة الإدارة `0.1.28` لأن التعديل يخص صفحة التواصل العامة ومسارها.

الخطأ المكتشف:

- الأعراض: التذكرة تظهر في إدارة التذاكر، لكن صفحة التواصل تعرض للعميل رسالة تعذر الإرسال.
- السبب: بعد نجاح طلب الشبكة كانت الواجهة تستدعي `event.currentTarget.reset()` بعد `await`، وقد يصبح `currentTarget` فارغًا في تلك المرحلة، فينتقل التنفيذ إلى `catch` رغم نجاح الحفظ.
- الحل: حفظ عنصر النموذج في متغير ثابت قبل أول `await`، ثم إعادة ضبطه بعد نجاح الاستجابة.
- الحالة: تم الإصلاح والتحقق من استجابة مسار الأخطاء محليًا.

الملفات المتأثرة:

- `app/[slug]/PageClient.jsx`
- `app/api/support/route.js`
- `app/components/Toast.module.css`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3112
curl.exe -s -i -X POST http://localhost:3112/api/support -H "Content-Type: application/json" -d "{}"
npm version 0.3.22 --no-git-tag-version
git diff --check
```

الحالة:

- نجح `npm run lint` دون أخطاء.
- نجح بناء Next.js في تجميع المشروع وتوليد الصفحات؛ رسائل منع اتصال Firebase داخل البيئة المقيدة لا تخص منطق التذاكر ولا تمنع البناء.
- أعاد اختبار الإدخال غير الصالح محليًا استجابة `400` مع `errorNumber: SUP-4001` كما هو متوقع.
- لم ينشئ اختبار المسار تذكرة تجريبية جديدة لأنه استخدم طلبًا غير صالح للتحقق من عقد الخطأ فقط.

### تحويل رسائل التواصل إلى نوافذ منبثقة 0.3.23 / admin 0.1.28

ما تم إنجازه:

- تحويل رسائل نجاح إرسال نموذج التواصل وفشله وأخطاء التحقق المهمة إلى نافذة منبثقة مركزية بدل التنبيه العلوي الصغير.
- فصل عنوان الحالة عن شرحها، وعرض رقم التذكرة داخل شارة واضحة في حالة النجاح، ورقم الخطأ داخل شارة مماثلة عند التعذر.
- عرض بريد التواصل القادم من إعدادات الهوية كرابط بريد مباشر داخل نافذة الخطأ دون كشف أي تفاصيل داخلية حساسة.
- توفير زر إغلاق أيقوني في زاوية النافذة وزر إغلاق نصي واضح داخل البطاقة، مع خلفية تعتيم تمنع تداخل الرسالة مع حقول النموذج.
- دعم التصميم على الجوال والوضع الداكن، مع إبقاء إشعار اختيار المرفق الناجح بالتنسيق العلوي الخفيف لأنه لا يحتاج إلى مقاطعة المستخدم.
- التحقق البصري على مقاس `414×552` باستخدام رسالة قصيرة لا ترسل طلبًا إلى الخادم ولا تنشئ تذكرة تجريبية.
- رفع نسخة الموقع العام إلى `0.3.23` مع إبقاء نسخة الإدارة `0.1.28` لأن التعديل يخص صفحة التواصل العامة فقط.

الملفات المتأثرة:

- `app/[slug]/PageClient.jsx`
- `app/components/Toast.jsx`
- `app/components/Toast.module.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm start -- -p 3113
npm version 0.3.23 --no-git-tag-version
git diff --check
```

الحالة:

- نجح `npm run build` وتوليد 31 صفحة؛ رسائل `EACCES` الظاهرة أثناء البناء ناتجة عن منع اتصال Firebase الخارجي داخل بيئة الفحص ولم توقف البناء.
- اجتازت نافذة الخطأ معاينة الجوال، وبقيت جميع عناصرها داخل البطاقة دون تداخل مع النموذج.
- لم تُنشأ تذكرة أثناء الاختبار البصري لأن التحقق تم برسالة أقصر من الحد الأدنى قبل تنفيذ طلب الشبكة.

### ضبط هوامش نافذة التواصل وموضع البريد 0.3.24 / admin 0.1.28

ما تم إنجازه:

- تثبيت عرض نافذة رسائل التواصل على الحد الأقصى `عرض الشاشة - 32px` مع احتساب الحشوات ضمن العرض، لضمان هامش جانبي واضح على الجوال.
- دمج رابط بريد التواصل داخل جملة الخطأ مباشرة بعد عبارة «البريد المباشر:» بدل فصله في سطر مستقل عن سياق الرسالة.
- إبقاء ألوان النافذة ومحتواها وحالات النجاح والخطأ كما هي دون تغيير بقية تصميم صفحة التواصل.
- رفع نسخة الموقع العام إلى `0.3.24` مع إبقاء نسخة الإدارة `0.1.28`.

الملفات المتأثرة:

- `app/[slug]/PageClient.jsx`
- `app/components/Toast.jsx`
- `app/components/Toast.module.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
npm version 0.3.24 --no-git-tag-version
git diff --check
```

الحالة:

- النافذة تحتفظ بهامش لا يقل عن 16 بكسل من كل جانب على الشاشات الصغيرة.
- البريد أصبح جزءًا من نص الإرشاد وقابلًا للنقر عبر `mailto:`.

### توحيد المسافة الآمنة حول نافذة التواصل 0.3.25 / admin 0.1.28

ما تم إنجازه:

- نقل مسؤولية المسافة الآمنة إلى خلفية النافذة المنبثقة بحشوة ثابتة مقدارها `16px` من الجهات الأربع.
- منع قواعد موضع التنبيه العلوي الخاصة بالجوال من إزاحة نافذة النجاح أو الخطأ إلى أحد جانبي الشاشة.
- جعل عرض البطاقة يعتمد على المساحة الداخلية المتاحة للخلفية مع حد أقصى `460px` بدل حساب العرض من نافذة المتصفح مباشرة.
- إضافة حد ارتفاع يترك `16px` أعلى وأسفل الشاشة وتمرير داخلي عند الحاجة على الشاشات القصيرة.
- رفع نسخة الموقع العام إلى `0.3.25` مع إبقاء نسخة الإدارة `0.1.28` لأن التعديل يخص نافذة التواصل العامة فقط.

الملفات المتأثرة:

- `app/components/Toast.module.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- نافذتا النجاح والخطأ تستخدمان الآن المسافة الآمنة نفسها من الجهات الأربع دون تغيير الألوان أو المحتوى.
- يبقى محتوى النافذة قابلًا للوصول عبر تمرير داخلي إذا كان ارتفاع الشاشة أقل من ارتفاع الرسالة.
- أثبت القياس البصري عند `414×552` أن المسافتين الجانبيتين متساويتان `16px` بعد استبعاد عرض شريط التمرير، وأن المسافتين العلوية والسفلية متساويتان كذلك.

### تأخير إشعار تثبيت الأداة 0.3.26 / admin 0.1.28

ما تم إنجازه:

- تأخير إظهار دعوة تثبيت التطبيق لمدة `12` ثانية بعد إطلاق المتصفح حدث `beforeinstallprompt` بدل عرضها فورًا للمستخدم الجديد.
- الاحتفاظ بحدث التثبيت المؤجل حتى يضغط المستخدم زر التثبيت، دون تشغيل نافذة المتصفح الأصلية تلقائيًا.
- إلغاء مؤقت الظهور عند تثبيت التطبيق أو مغادرة الصفحة لمنع ظهور الإشعار بعد تغير حالة الصفحة.
- إبقاء قواعد عدم العرض للمستخدم الذي ثبّت التطبيق أو أخفى الدعوة سابقًا دون تغيير.
- رفع نسخة الموقع العام إلى `0.3.26` مع إبقاء نسخة الإدارة `0.1.28` لأن التعديل يخص تجربة زوار الموقع العام فقط.

الملفات المتأثرة:

- `app/components/PwaInstallPrompt.jsx`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- لا يظهر إشعار التثبيت فور تحميل الموقع، ويظل زر التثبيت قادرًا على تشغيل مطالبة المتصفح بعد انتهاء التأخير.
- الإشعار لا يظهر إذا كان التطبيق مثبتًا أو إذا سبق للمستخدم إخفاؤه.

### استكمال بيانات مشاركة الطقس والتوقعات القادمة 0.3.27 / admin 0.1.28

ما تم إنجازه:

- توسيع رسالة مشاركة الطقس الحالي لتشمل درجة الحرارة والحالة والإحساس والرطوبة وسرعة الرياح واحتمال المطر ومؤشر UV.
- طلب ستة أيام من Open-Meteo ثم استبعاد اليوم الحالي، ليبدأ عرض توقعات الأيام الخمسة من الغد.
- بناء قائمة موحدة للأيام الخمسة تستخدمها البطاقة ورسالة المشاركة لمنع اختلاف البيانات بينهما.
- إضافة احتمال المطر لكل يوم داخل رسالة مشاركة التوقعات.
- ترقية قالب مشاركة الطقس الافتراضي القديم المحفوظ إلى القالب الكامل، مع إبقاء النصوص المخصصة التي عدلها المدير دون تغيير.
- تحديث معاينة توقعات الطقس في منصة الإدارة لتعرض خمسة أيام كاملة.
- رفع نسخة الموقع العام إلى `0.3.27` مع إبقاء نسخة الإدارة `0.1.28` لأن التعديل يخص بيانات الطقس العامة ومعاينتها فقط.

الملفات المتأثرة:

- `app/weather/WeatherPageClient.jsx`
- `app/toolSettings.js`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- توقعات الأيام الخمسة تبدأ من الغد وتظهر بالترتيب نفسه في البطاقة ورسالة المشاركة.
- مشاركة الطقس الحالي تتضمن جميع البيانات الظاهرة في البطاقة.

### تحسين حقول دخول الإدارة 0.3.27 / admin 0.1.29

ما تم إنجازه:

- منع حقول البريد وكلمة المرور في صفحة دخول الإدارة من وراثة الخلفية الرمادية العامة للوضع الداكن.
- تثبيت خلفية فاتحة هادئة ونص داكن وplaceholder واضح داخل بطاقة الدخول البيضاء.
- إضافة حالات تحويم وتركيز زرقاء خفيفة مع دعم ألوان التعبئة التلقائية في Chrome.
- رفع نسخة منصة الإدارة إلى `0.1.29` مع إبقاء نسخة الموقع العام `0.3.27` دون تغيير.

الملفات المتأثرة:

- `app/admin_login/AdminLogin.css`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
git diff --check
```

الحالة:

- حقول تسجيل الدخول أصبحت متباينة بوضوح مع البطاقة وتحتفظ بحالتها الصحيحة عند التركيز والتعبئة التلقائية.

### توحيد معاينات الهوية وربط اختصارات PWA بـ R2 0.3.28 / admin 0.1.30

ما تم إنجازه:

- استبدال صف أيقونة التطبيق داخل ملخص الهوية بعرض أيقونة المتصفح فقط ومنع تكرار المعاينتين.
- توسيط رأس معاينة الهوية وتوحيد تدرج خلفيات معاينات الهوية والرابط والتثبيت.
- دمج خلفية صورة ونص عارض الرابط في سطح واحد متصل وتحسين ترتيب بطاقة معاينة التثبيت.
- إزالة صور اختصارات التاريخ والساعة والطقس المحلية الثابتة من منصة الإدارة وmanifest، واعتماد روابط الأيقونات المرفوعة فقط.
- إتاحة فئات `pwa-shortcut-date` و`pwa-shortcut-clock` و`pwa-shortcut-weather` للقراءة العامة من R2 عبر مسار الوسائط الآمن.
- رفع نسخة الموقع العام إلى `0.3.28` لأن manifest تغيّر، ونسخة الإدارة إلى `0.1.30` لأن معاينات الهوية تغيّرت.

الملفات المتأثرة:

- `app/admin/identity/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/api/media/[...key]/route.js`
- `app/manifestConfig.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm run build
git diff --check
```

الحالة:

- معاينات الهوية والرابط والتثبيت تستخدم سطحًا بصريًا موحدًا، وتظهر اختصارات الضغط المطوّل من روابط R2 المحفوظة دون استبدالها بصور ثابتة من المشروع.

### جولة التقوية الأمنية الشاملة 0.3.29 / admin 0.1.31 / client 1.0.1

ما تم إنجازه:

- تحديث الاعتماديات الآمنة ورفع Next.js إلى `15.5.23` وWrangler إلى `4.121.0`، مع تثبيت إصدارات آمنة لـ `postcss` و`sharp` وإضافة `sanitize-html` وTurnstile.
- خفض نتيجة `npm audit` من 11 ثغرة مكتشفة في خط الأساس إلى `0 vulnerabilities` دون استخدام `npm audit fix --force`.
- إضافة تسلسل JSON-LD آمن يمنع إنهاء وسم script أو حقن HTML داخل البيانات المنظمة في الرئيسية والساعة والطقس وصفحات slug.
- تنظيف HTML القادم من Firestore على الخادم قبل إدراجه في صفحات slug، وتنظيف HTML النتائج المعروضة داخل مكونات الصفحة الرئيسية.
- إضافة Cloudflare Turnstile اختياريًا لنموذج التواصل ودخول الإدارة وتسجيل/دخول/استعادة حساب المعلن، مع تحقق خادمي من الرمز واسم المضيف واسم الإجراء وحد أقصى للطلب.
- منع الاعتماد على امتداد أو MIME الصورة فقط، والتحقق من التوقيع الثنائي لصور PNG وJPEG وGIF وWEBP وICO قبل تخزينها في R2.
- تقييد رفع الوسائط بحسب نوع الحساب وصلاحية المساعد، وقصر المعلن على فئة صور الإعلانات، مع تسجيل رافع الملف داخل metadata.
- تقوية نموذج التذاكر بحدود فعلية للنص والمرفق، وأرقام تذاكر غير قابلة للتخمين بسهولة، والتحقق من Turnstile، وحذف مرفق R2 تلقائيًا إذا فشل إنشاء مستند Firestore.
- تقييد مسارات PageSpeed وIndexNow والتذاكر والوسائط حسب صلاحيات المساعد، وقصر تنظيف Firebase على المدير الكامل.
- تقوية قواعد Firestore لتقييد حقول إعدادات الموقع بحسب القسم، ومنع كتابة الإحصائيات من العميل، والتحقق من ملكية المعلن للحملات وحالة الحساب وروابط الصور.
- إضافة تأكيد البريد الإلكتروني للمعلنين الجدد قبل تفعيل الحساب مع إبقاء الحسابات النشطة القديمة متوافقة.
- عدم إرسال إحصائيات الزيارة قبل موافقة المستخدم على التحليلات، وقصر طلب الموقع التلقائي على صفحتي الساعة والطقس.
- وضع حدود لحجم تقارير CSP وطلبات Turnstile، وإضافة نطاق Cloudflare Challenges إلى CSP بصيغة Report-Only.
- فصل أرقام نسخ الموقع والإدارة وبوابة المعلنين ورفعها فقط لأن المجالات الثلاثة تأثرت فعليًا.
- لم تتغير ملفات CSS أو ألوان أو أحجام أو تخطيط الواجهة في هذه الجولة، وبقي حجم JavaScript المشترك `103 kB`.

الملفات المتأثرة:

- `app/safeJsonLd.js`
- `app/sanitizeHtmlServer.js`
- `app/turnstileServer.js`
- `app/turnstileClient.js`
- `app/components/TurnstileField.jsx`
- `app/layout.jsx`
- `app/page.jsx`
- `app/clock/page.jsx`
- `app/weather/page.jsx`
- `app/[slug]/page.jsx`
- `app/[slug]/PageClient.jsx`
- `app/components/home/HomeSections.jsx`
- `app/SiteShell.jsx`
- `app/admin_login/page.jsx`
- `app/client/page.jsx`
- `app/client/register/page.jsx`
- `app/client/reset-password/page.jsx`
- `app/client/create-campaign/page.jsx`
- `app/api/_lib/adminPermissions.js`
- `app/api/security/turnstile/route.js`
- `app/api/support/route.js`
- `app/api/admin/support/route.js`
- `app/api/admin/indexnow/route.js`
- `app/api/admin/cleanup/route.js`
- `app/api/media/upload/route.js`
- `app/api/media/[...key]/route.js`
- `app/api/pagespeed/route.js`
- `app/api/statistics/route.js`
- `app/api/csp-report/route.js`
- `firestore.rules`
- `middleware.js`
- `.dev.vars.example`
- `app/version.js`
- `app/client/ClientVersion.js`
- `package.json`
- `package-lock.json`

الأوامر المستخدمة:

```powershell
npm run lint
npm audit
npm run build
npx opennextjs-cloudflare build
git diff --check
```

الحالة:

- نجح ESLint وبناء Next.js 15.5.23 وبناء OpenNext for Cloudflare، وتم إنشاء `.open-next/worker.js`.
- نتيجة تدقيق اعتماديات الإنتاج والتطوير: `found 0 vulnerabilities`.
- بقيت CSP بصيغة Report-Only عمدًا حتى تتم مراقبة التقارير قبل فرضها، منعًا لكسر AdSense أو Firebase أو Turnstile.
- المتبقي الخارجي: إنشاء Widget Turnstile وإضافة أسراره، نشر قواعد Firestore، تفعيل App Check تدريجيًا من Firebase Console، وضبط Rate Limiting من Cloudflare WAF.
- يبقى مستند `settings/main` عامًا للقراءة بسبب اعتماد HTML الخادمي وmanifest وSEO عليه؛ الأفضل لاحقًا فصل إسقاط عام محدود في `settings/public` عن إعدادات الإدارة الخاصة ضمن ترحيل مستقل.
- لم يتم النشر أو إنشاء commit في هذه الجولة.

### فصل الإعدادات واختبارات الأمان 0.3.30 / admin 0.1.32 / client 1.0.2

ما تم إنجازه:

- إنشاء وثيقة عامة محدودة `settings/public` للمعلومات التي يحتاجها الموقع وSEO وmanifest وصفحات المحتوى، مع إبقاء `settings/main` للإدارة فقط بعد اكتمال الترحيل.
- إضافة مزامنة تلقائية للإسقاط العام بعد حفظ الإعدادات، ومزامنة صامتة عند دخول مدير كامل لضمان إنشاء الوثيقة العامة دون كشف إعدادات خاصة.
- تحويل قراءات `layout` وSEO وsitemap وmanifest و`ads.txt` وصفحات slug و`/api/site-config` إلى المساعد الخادمي العام الموحد.
- تصفية إعدادات مواضع Google Ads داخل الإسقاط العام إلى الحقول اللازمة للعرض فقط، مع استبعاد `htmlSnippet` وأي قيم داخلية أو خاصة من `settings/public`.
- إزالة التحقق والسايدبار والنافبار والفوتر المكررة من `ToolManagementShell` واعتماد `AdminShell` الثابت كمسؤول وحيد عن صلاحيات إدارة الأدوات وتنقلها.
- نشر `firestore.rules` مرتين على مشروع `date-tool-official`: الأولى للتحقق، والثانية بعد إزالة تحذيرات القواعد؛ انتهى النشر دون تحذيرات.
- تقييد مفتاح Firebase Web في Google Cloud باستخدام HTTP referrers للدومينات `date-tool.com` و`www` وWorker وFirebase Hosting والتطوير المحلي.
- استخراج سياسات تسجيل دخول الإدارة والمعلنين، التذاكر، الحملات، والتحقق من وسائط R2 إلى دوال قابلة للاختبار وإعادة الاستخدام.
- إضافة Vitest وسكربتات `npm test` و`npm run test:watch`، مع 13 اختبارًا ناجحًا تغطي الصلاحيات، الدخول، التذاكر، الحملات، R2، والإعدادات العامة.
- إبقاء Turnstile في وضع اختياري آمن لأن Wrangler غير مسجل الدخول ولا توجد أسرار Widget في بيئة Cloudflare بعد.
- إبقاء Firebase App Check مهيأ عبر reCAPTCHA Enterprise مع تحديث تلقائي للرمز، دون فرضه على الخدمات قبل مراقبة المقاييس.
- لم تتغير ملفات CSS أو الألوان أو المقاسات أو تخطيط الموقع في هذه الجولة.

الملفات المتأثرة:

- `app/firestorePublicConfig.js`
- `app/publicSiteConfig.js`
- `app/firebase.js`
- `app/layout.jsx`
- `app/toolSeoServer.js`
- `app/manifestConfig.js`
- `app/sitemap.js`
- `app/[slug]/page.jsx`
- `app/ads.txt/route.js`
- `app/api/site-config/route.js`
- `app/admin/AdminShell.jsx`
- `app/admin/tool-management/ToolManagementShell.jsx`
- `app/securityPolicies.js`
- `app/api/_lib/mediaValidation.js`
- `app/admin_login/page.jsx`
- `app/client/page.jsx`
- `app/client/create-campaign/page.jsx`
- `app/api/support/route.js`
- `app/api/media/upload/route.js`
- `tests/adminPermissions.test.js`
- `tests/securityPolicies.test.js`
- `tests/mediaValidation.test.js`
- `tests/publicSiteConfig.test.js`
- `firestore.rules`
- `package.json`
- `package-lock.json`
- `app/version.js`
- `app/client/ClientVersion.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm install --save-dev vitest
npm test
npm run lint
npm run build
npx opennextjs-cloudflare build
npx firebase-tools deploy --only firestore:rules --project date-tool-official
git diff --check
```

الحالة:

- قواعد Firestore الجديدة منشورة وتمنع القراءة العامة لوثيقة الإدارة بعد ظهور `settings/public`.
- تقييد مفتاح Firebase محفوظ ويمنع استعماله من مواقع غير مدرجة، مع إبقاء قيود APIs الحالية لتجنب كسر Firebase Auth أو Firestore أو App Check.
- Turnstile يحتاج خارجيًا إنشاء Widget باسم واضح وإضافة `TURNSTILE_SITE_KEY` و`TURNSTILE_SECRET_KEY` و`TURNSTILE_ALLOWED_HOSTNAMES` إلى Worker؛ الكود الخادمي للتحقق موجود وجاهز.
- App Check يحتاج فتح Firebase Console ومراقبة المقاييس أولًا، ثم فرض Cloud Firestore تدريجيًا، وبعد ثبات الطلبات يمكن تقييم فرض Authentication الذي ما زال Preview.
- بعد وصول النسخة الجديدة للإنتاج ودخول مدير كامل مرة واحدة، تُنشأ `settings/public` تلقائيًا وينتهي مسار الترحيل الانتقالي.
- التحقق المباشر من Firestore قبل النشر أعاد `404` لوثيقة `settings/public`؛ لذلك بقي الرجوع الانتقالي إلى `settings/main` حتى يصل الكود الجديد ويدخل مدير كامل، ثم يجب التحقق من إنشاء الوثيقة وإزالة الرجوع الانتقالي في جولة الإغلاق التالية.
- التحقق النهائي نجح: 13 اختبار Vitest، وESLint، و`npm audit` بنتيجة `0 vulnerabilities`، وبناء Next.js، وبناء OpenNext وإنشاء `.open-next/worker.js`، و`git diff --check`.

### تفعيل Turnstile وتهيئة App Check 0.3.30 / admin 0.1.33 / client 1.0.3

ما تم إنجازه:

- إنشاء Cloudflare Turnstile Managed Widget باسم `date-tools-forms` للنطاقين `date-tool.com` و`www.date-tool.com` مع السماح بالتطوير المحلي.
- إضافة أسرار `TURNSTILE_SITE_KEY` و`TURNSTILE_SECRET_KEY` و`TURNSTILE_ALLOWED_HOSTNAMES` إلى Worker `datetools` دون حفظ القيم السرية في المستودع.
- نشر Worker والتحقق حيًا من أن `/api/security/turnstile` يعرض تفعيل الخدمة، وأن الطلب الخالي من الرمز يُرفض، وأن مكوّن Turnstile في صفحة الدخول يصدر رمزًا صالحًا.
- التحقق من تسجيل تطبيق الويب في Firebase App Check باستخدام reCAPTCHA Enterprise.
- تعديل طبقة Firebase Client بحيث تنتظر عمليات Authentication وFirestore وStorage تهيئة App Check قبل إرسال الطلبات، مع تسجيل خطأ التهيئة في وحدة التحكم بدل ابتلاعه بصمت.
- إبقاء Enforcement متوقفًا لأن صفحة APIs في Firebase تعرض حاليًا 0% طلبات موثقة و100% غير موثقة لكل من Firestore وAuthentication.
- عدم تغيير نسخة الموقع العام أو CSS أو التصميم؛ تحديث نسختي الإدارة وبوابة العميل فقط.

الملفات المتأثرة:

- `app/firebase.js`
- `app/version.js`
- `app/client/ClientVersion.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run deploy
```

الحالة:

- Turnstile فعّال ومتحقق منه في الإنتاج، وأسراره موجودة في Cloudflare فقط.
- App Check مهيأ في الكود ولوحة Firebase، لكنه يبقى في وضع Monitoring إلى أن تبدأ المقاييس بإظهار طلبات موثقة بعد انتشار هذه النسخة واستخدام الإدارة والبوابة.
- لا يجب تفعيل Enforcement الآن؛ القراءة الخادمية العامة من Firestore REST تحتاج معالجة مستقلة أو استثناءً موثوقًا قبل فرض Firestore App Check.
- الخطوة التالية بعد مرور فترة مراقبة مناسبة هي مراجعة نسبة الطلبات الموثقة في Firebase App Check، ثم اختبار فرض Firestore تدريجيًا قبل التفكير في Authentication.

### جولة التحقق من الربط والأمان 0.3.30 / admin 0.1.33 / client 1.0.3

ما تم إنجازه:

- تشغيل الاختبارات الآلية كاملة: `13` اختبارًا ناجحًا في `4` ملفات.
- نجاح ESLint وبناء Next.js للإنتاج وإنشاء جميع الصفحات دون خطأ، مع بقاء JavaScript المشترك `103 kB`.
- إعادة تشغيل `npm audit` من سجل npm وكانت النتيجة `0 vulnerabilities`.
- فحص الصفحات العامة والإدارية الأساسية على الإنتاج؛ أعادت جميعها `200`، بما فيها sitemap وrobots وads.txt وmanifest.
- فحص مسارات الأدوات الداخلية التسعة؛ جميعها تعيد `200` وتحتوي في HTML الأولي على `H1` وCanonical خاص بالمسار.
- تأكيد أن sitemap الحية تحتوي `17` رابطًا، وأن صفحات الإدارة وبوابة المعلنين ودخول الإدارة تحمل `noindex`.
- تأكيد ترويسات الأمان الحية: HSTS وX-Content-Type-Options وX-Frame-Options وReferrer-Policy وPermissions-Policy، مع بقاء CSP بصيغة Report-Only.
- تأكيد أن Turnstile مفعّل على الإنتاج وأن Worker يعرض Site Key العام فقط، وأن أسرار Firebase وPageSpeed وTurnstile الستة موجودة في Cloudflare Worker كأسرار دون كشف قيمها.
- تأكيد ربط R2 باسم `datetools-media` وObservability وصور Cloudflare داخل إعداد Worker.

الأخطاء المكتشفة:

1. **App Check لا يصدر رمز تحقق صالحًا على الإنتاج**
   - الأعراض: صفحة Firebase App Check تعرض `0%` طلبات موثقة و`100%` غير موثقة لـ Firestore وAuthentication، ووحدة تحكم المتصفح تعرض `appCheck/recaptcha-error` عند تحميل الإدارة.
   - السبب المرجح: إعداد مفتاح reCAPTCHA Enterprise يحتاج مراجعة في Google Cloud من ناحية نوع المفتاح Website/Score، النطاقات المسموحة، تفعيل API، ومطابقة Site Key المسجل في Firebase مع المفتاح الموجود في `app/firebase.js`.
   - الحل: مراجعة مفتاح reCAPTCHA Enterprise وإصلاح إعداداته، ثم التأكد من اختفاء الخطأ وبدء ظهور طلبات Verified قبل أي Enforcement.
   - الحالة: مفتوح؛ **يمنع تفعيل Enforcement حاليًا** حتى لا تتوقف الطلبات الشرعية.

2. **الإسقاط العام `settings/public` لم يُنشأ على الإنتاج**
   - الأعراض: Firestore REST يعيد `404` لـ `settings/public` و`200` لـ `settings/main`.
   - السبب: المزامنة التي يفترض أن ينفذها مدير كامل لم تنجح أو لم تُنفذ بعد، ويرجح أن فشل App Check في الواجهة ساهم في عدم إتمامها.
   - الحل: بعد إصلاح App Check، تشغيل مزامنة الإسقاط العام من جلسة مدير كامل والتحقق من أن `settings/public` يعيد `200` وأن `settings/main` يعيد `403`، ثم إزالة fallback الانتقالي من `app/firestorePublicConfig.js`.
   - الحالة: مفتوح؛ الفصل الأمني موجود في الكود والقواعد لكنه غير مكتمل حيًا.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm audit
npm run build
git diff --check
git status --short
npx wrangler secret list --name datetools
curl.exe --max-time 20 ...
```

الحالة:

- لا توجد تغييرات تشغيلية أو بصرية ولم تتغير أرقام النسخ.
- Turnstile وR2 وPageSpeed وFirebase Service Account وSEO الحي وملفات الفهرسة تعمل أو موجودة كما هو متوقع.
- لا يجب فرض Firebase App Check أو حذف fallback حتى تُحل مشكلتا reCAPTCHA Enterprise وإنشاء `settings/public` بالترتيب.
- بقي خارجيًا تأكيد WAF Rate Limiting، مراقبة CSP Report-Only قبل فرضه، إكمال Bing Webmaster Tools، ومتابعة Search Console وAdSense وPageSpeed بعد استقرار النسخة.

### ترتيب إغلاق App Check والحماية 0.3.30 / admin 0.1.33 / client 1.0.3

ما تم إنجازه:

- إعادة التحقق الحي من فصل إعدادات Firestore؛ ما زال `settings/public` يعيد `404` وما زال `settings/main` يعيد `200` للقراءة العامة.
- تأكيد أن كود الموقع يستخدم `ReCaptchaEnterpriseProvider` وأن مفتاح الموقع فيه يطابق المفتاح المسجل سابقًا في Firebase App Check.
- تأكيد أن رؤوس الحماية الحية سليمة وأن CSP ما زال بصيغة `Content-Security-Policy-Report-Only` ويرسل التقارير إلى `/api/csp-report`.
- تثبيت ترتيب المعالجة: إصلاح reCAPTCHA Enterprise وظهور طلبات Verified، ثم إنشاء `settings/public` وإغلاق `settings/main`، ثم Rate Limiting، ثم مراقبة CSP قبل فرضها.
- تفسير رسالة Search Console الجديدة كإشارة إيجابية على بدء ظهور صفحات الموقع وجمع بيانات مرات الظهور وطلبات البحث، دون حاجة إلى إعادة الفهرسة بسبب رسالة الإثبات وحدها.
- عدم تغيير ملفات التطبيق أو أرقام النسخ أو التصميم، وعدم تفعيل Enforcement قبل اكتمال التحقق.

الأخطاء المكتشفة:

1. **App Check ما زال يحتاج تحققًا خارجيًا من إعداد مفتاح reCAPTCHA Enterprise**
   - الأعراض: آخر قراءة للمقاييس كانت `0% Verified` و`100% Unverified` مع ظهور `appCheck/recaptcha-error` في المتصفح.
   - السبب المرجح: نوع مفتاح reCAPTCHA أو وضع Score-based أو النطاقات المسموحة أو تفعيل API يحتاج تأكيدًا من Google Cloud.
   - الحل: فتح مفتاح الموقع في Google Cloud والتأكد أنه Website وScore-based بلا Checkbox، وإضافة `date-tool.com` و`www.date-tool.com`، والتأكد من تفعيل reCAPTCHA Enterprise API ومطابقة المفتاح المسجل في Firebase، ثم إعادة الاختبار ومراقبة المقاييس من 15 دقيقة إلى 24 ساعة.
   - الحالة: مفتوح؛ لا يُفعّل Firestore Enforcement قبله.

2. **فصل إعدادات Firestore غير مكتمل حيًا**
   - الأعراض: `settings/public = 404` و`settings/main = 200` في الفحص الحي بتاريخ 2026-08-16.
   - السبب: مزامنة الإسقاط العام لم تنجح بعد، ويرجح تأثرها بفشل App Check في المتصفح.
   - الحل: بعد إصلاح App Check، الدخول بحساب مدير كامل وتشغيل حفظ إعداد واحد أو إعادة تحميل الإدارة لتشغيل المزامنة، ثم التحقق من `public = 200` و`main = 403` قبل إزالة fallback الانتقالي.
   - الحالة: مفتوح؛ لا يُحذف fallback الآن حتى لا تختفي إعدادات الموقع العام.

3. **Rate Limiting لم يُضبط بعد في Cloudflare WAF**
   - الأعراض: لا يوجد تأكيد على قواعد تحد من الإساءة المتكررة لمسارات النماذج والرفع وPageSpeed.
   - السبب: إعداد WAF خارجي ولم يُعتمد حد فعلي بعد.
   - الحل: إنشاء القواعد أولًا بوضع Log، مراقبة المعدل الطبيعي، ثم تحويلها تدريجيًا إلى Managed Challenge أو Block للمسارات الحساسة فقط.
   - الحالة: مفتوح؛ يأتي بعد استقرار App Check وفصل الإعدادات.

4. **CSP ما زال في مرحلة المراقبة**
   - الأعراض: الرأس الحي هو `Content-Security-Policy-Report-Only` وليس CSP إلزاميًا.
   - السبب: هذا مقصود لمنع كسر Firebase وTurnstile وAnalytics وAdSense أثناء جمع الانتهاكات المشروعة.
   - الحل: مراقبة سجلات `csp_report_only` لمدة 7 إلى 14 يومًا بعد استقرار التكاملات، واختبار الصفحات العامة والإدارة والرفع والنماذج والإعلانات، ثم فرض السياسة فقط بعد تنظيف المصادر المشروعة.
   - الحالة: صحيح وآمن حاليًا؛ لا يُحوّل إلى إلزامي الآن.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
curl.exe --max-time 20 https://firestore.googleapis.com/...
curl.exe -I --max-time 20 https://date-tool.com/
rg -n "Content-Security-Policy|csp-report|Report-Only" middleware.js app
git status --short
```

الحالة:

- لم تُجر أي تغييرات تشغيلية ولم يتغير أي رقم نسخة.
- الأولوية الحالية خارج الكود هي تصحيح إعداد مفتاح reCAPTCHA Enterprise حتى تبدأ مقاييس App Check بعرض طلبات Verified.
- لا يُنشأ `settings/public` ولا يُغلق `settings/main` بالقوة قبل نجاح App Check واختبار جلسة مدير كامل.
- بعد إغلاق هاتين النقطتين تبدأ قواعد Rate Limiting في وضع Log، بينما تستمر مراقبة CSP بالتوازي لمدة 7 إلى 14 يومًا.

### تصحيح مفتاح Firebase App Check 0.3.30 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- تأكيد أن مفتاح reCAPTCHA Enterprise الصحيح من نوع Website Invisible وأن التحقق من النطاقات مفعّل له.
- إضافة `date-tool.com` و`www.date-tool.com` و`localhost` و`127.0.0.1` إلى النطاقات المسموحة للمفتاح الصحيح من Google Cloud.
- تحديث `ReCaptchaEnterpriseProvider` داخل `app/firebase.js` لاستخدام معرف المفتاح الصحيح المسجل في Firebase App Check بدل مفتاح Checkbox القديم.
- إبقاء Firebase App Check في وضع Monitoring وعدم تفعيل Enforcement قبل ظهور طلبات Verified واختفاء خطأ `appCheck/recaptcha-error`.
- إبقاء مفتاح Checkbox القديم مؤقتًا دون حذفه إلى أن يثبت بعد انتشار النسخة الجديدة أنه بلا نشاط وغير مستخدم في أي تكامل آخر.
- ترقية نسخة الإدارة إلى `0.1.34` وبوابة العميل إلى `1.0.4` مع إبقاء نسخة الموقع العام `0.3.30` دون تغيير، وعدم تعديل CSS أو التصميم.

الملفات المتأثرة:

- `app/firebase.js`
- `app/version.js`
- `app/client/ClientVersion.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت `13` حالة اختبار في `4` ملفات، ونجح ESLint وبناء Next.js للإنتاج وتوليد `31` صفحة.
- لا يُحذف مفتاح Checkbox القديم قبل مراقبة نشاط المفتاحين بعد وصول النسخة الجديدة للإنتاج.
- المطلوب بعد النشر: فتح الإدارة وبوابة العميل لإصدار طلبات Firestore وAuthentication، ثم مراجعة Firebase App Check بعد 15 دقيقة إلى 24 ساعة للتأكد من ظهور نسبة Verified.
- إذا ظهر نشاط Verified واختفى خطأ App Check، يمكن حذف المفتاح القديم بعد التأكد من عدم وجود Activity له، ثم متابعة إنشاء `settings/public` وإغلاق القراءة العامة عن `settings/main`.

### نشر مفتاح App Check الصحيح والتحقق الحي 0.3.30 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- تشغيل بناء OpenNext جديد ثم نشره مباشرة إلى Cloudflare Worker `datetools` بدل الاعتماد على أصول البناء القديمة.
- تأكيد نجاح رفع الأصل الجديد `/_next/static/chunks/905.659cefa1d5e73643.js` وأنه يحتوي مفتاح reCAPTCHA Enterprise الصحيح فقط ولا يحتوي مفتاح Checkbox القديم.
- إعادة تحميل صفحة الإدارة بعد النشر؛ لم تُسجل رسالة `appCheck/recaptcha-error` جديدة، بينما بقيت في سجل المتصفح رسالتان قديمتان بوقت سابق للنشر.
- تأكيد أن تطبيق الويب في Firebase App Check ما زال مسجلًا بمزوّد `reCAPTCHA Enterprise` وحالة `Registered`.
- إبقاء Enforcement متوقفًا لأن حساب Firebase الحالي يعرض أن إدارة فرض المنتجات ومؤشراتها تحتاج صلاحية مالك المشروع، ولأن المقاييس قد تحتاج من 15 دقيقة إلى 24 ساعة لتظهر.
- عدم تغيير الكود أو التصميم أو أرقام النسخ في هذه المهمة؛ التغيير التشغيلي الوحيد هو إعادة البناء والنشر.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run deploy
curl.exe -sS --max-time 30 https://date-tool.com/_next/static/chunks/905.659cefa1d5e73643.js
```

الحالة:

- نجح بناء Next.js وتوليد `31` صفحة، ونجح بناء OpenNext ورفع Worker بزمن بدء `29 ms`.
- نُشرت نسخة Worker بالمعرف `10622088-2f2d-4f7f-9495-78a357da9e94`.
- مفتاح App Check الصحيح أصبح مستخدمًا في أصل JavaScript الحي، والمفتاح القديم غير موجود في الأصل الجديد.
- يجب مراقبة Firebase App Check من 15 دقيقة إلى 24 ساعة قبل الحكم على نسبة Verified، وعدم تفعيل Enforcement أو حذف المفتاح القديم حتى يظهر نشاط موثّق ويثبت عدم استخدام المفتاح القديم.

### تفعيل Cloudflare Rate Limiting للمسارات العامة الحساسة 0.3.30 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- فحص مسارات API العامة وتحديد `/api/support` و`/api/security/turnstile` كأكثر المسارات حاجة إلى حماية من الإغراق الآلي.
- التحقق من لوحة Cloudflare أن خطة النطاق المجانية تتيح قاعدة Rate Limiting واحدة وأن الإجراء المتاح فيها هو `Block` فقط؛ وضع `Log` غير متاح لهذه الخطة.
- إنشاء قاعدة نشطة باسم `Protect public forms from bursts` على النطاق `date-tool.com`.
- ضبط المطابقة على المسارين فقط باستخدام التعبير `(http.request.uri.path wildcard r"/api/support") or (http.request.uri.path wildcard r"/api/security/turnstile")`.
- ضبط الحد على أكثر من `20` طلبًا خلال `10` ثوانٍ من عنوان IP نفسه، مع حظر مؤقت لمدة `10` ثوانٍ.
- التحقق بعد النشر أن القاعدة بحالة `Active` وأن لوحة Cloudflare تعرض `1/1` قاعدة، ومعرفها `e1a81a9281844e7981a6ff4524d7c29f`.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
git status --short
git diff --check
```

الحالة:

- القاعدة تعمل على مستوى Cloudflare قبل وصول الطلب إلى Worker، ولا يوجد تغيير في كود الموقع أو التصميم أو أرقام النسخ.
- الحد أعلى بكثير من الاستخدام الطبيعي للنموذج وتسجيل الدخول، ويستهدف الاندفاعات الآلية الواضحة فقط.
- يجب مراقبة عداد `Events` وسجلات Security Events خلال أول `48` إلى `72` ساعة؛ إذا ظهرت طلبات شرعية محظورة يرفع الحد، وإذا استمر الإغراق دون بلوغ الحد يمكن خفضه تدريجيًا.
- بقيت مراقبة Firebase App Check وCSP Report-Only وفصل `settings/public` عن `settings/main` كما هي دون تغيير.

### اختبار Turnstile الحي للنماذج الثلاثة 0.3.30 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- اختبار نموذج دخول الإدارة حيًا على الإنتاج؛ أصدر Turnstile رمزًا بطول `794` حرفًا، وقَبِل مسار التحقق الخادمي الرمز ثم وصل الطلب إلى Firebase وأعاد خطأ بيانات الاعتماد المتوقع للحساب التجريبي.
- اختبار نموذج تسجيل المعلنين حيًا دون إنشاء حساب جديد؛ أصدر Turnstile رمزًا بطول `794` حرفًا، واجتاز التحقق الخادمي ثم أعاد Firebase رسالة أن البريد الإداري مستخدم مسبقًا.
- اختبار نموذج التواصل حيًا؛ أصدر Turnstile رمزًا بطول `794` حرفًا، وقَبِل `/api/support` الطلب وأنشأ تذكرة الاختبار `DT-MSXH2BYT-7D2577F9` بنجاح.
- التأكد عمليًا أن Turnstile يعمل في الإجراءات الثلاثة `admin-login` و`advertiser-register` و`support-form`، وأن طبقة الحماية لا تعطل الاستخدام الشرعي.
- تشغيل مجموعة الاختبارات الآلية كاملة بعد الاختبار الحي ونجاح `13` حالة في `4` ملفات.
- عدم إدخال كلمة مرور حقيقية أو إنشاء حساب معلن جديد، وعدم تغيير الكود أو التصميم أو أرقام النسخ.

الأخطاء المكتشفة:

1. **تعذر حذف تذكرة الاختبار من جلسة الاختبار المنفصلة**
   - الأعراض: صفحة إدارة التذاكر عرضت انتهاء جلسة الإدارة أو عدم امتلاك صلاحية التذاكر.
   - السبب: تبويب الاختبار المعزول لا يحمل جلسة المدير المفتوحة في تبويب المستخدم.
   - الحل: حذف التذكرة `DT-MSXH2BYT-7D2577F9` يدويًا من `/admin/support` في جلسة المدير الحالية.
   - الحالة: تنظيف يدوي بسيط متبقٍ؛ لا يؤثر في عمل Turnstile أو الموقع.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
npm test
git diff --check
git status --short
```

الحالة:

- نجح Turnstile حيًا في دخول الإدارة وتسجيل المعلنين والتواصل، مع تحقق خادمي قبل تنفيذ عمليات Firebase أو إنشاء التذكرة.
- نجحت `13` حالة اختبار آلية في `4` ملفات.
- لا يحتاج هذا الاختبار إلى نشر Cloudflare لأنه لم يغير أي ملف تشغيلي.
- تبقى مراقبة Firebase App Check بعد انتشار المفتاح الصحيح، ومراقبة Rate Limiting وCSP، ثم إكمال فصل `settings/public` عن `settings/main` وفق الترتيب المسجل أعلاه.

### فحص ظهور الموقع كاتصال آمن 0.3.30 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- فحص الاستجابة الحية للرئيسية و`/clock` عبر HTTPS وتأكيد إرجاع `200 OK` من Cloudflare دون تحويل إلى HTTP أو تحذير شهادة.
- تأكيد وجود `Strict-Transport-Security` لمدة سنة مع `includeSubDomains` و`preload`، إضافة إلى `X-Content-Type-Options: nosniff` و`X-Frame-Options: DENY` و`Referrer-Policy` و`Permissions-Policy`.
- تأكيد أن الموقع وصفحات الأدوات تعمل تحت النطاق نفسه، ولذلك تنطبق شهادة HTTPS وحماية Cloudflare على الرئيسية و`/clock` و`/weather` وروابط الأدوات الداخلية.
- توثيق طريقة التحقق الدائم من Google Search Console عبر تقارير `Security issues` و`Manual actions` و`HTTPS`، ومن Google Safe Browsing Site Status.
- عدم إجراء أي تغيير تشغيلي أو بصري أو تغيير في أرقام النسخ.

الملاحظات:

1. **CSP ما زال في وضع Report-Only**
   - الأعراض: الرأس الحي هو `Content-Security-Policy-Report-Only`.
   - السبب: السياسة قيد المراقبة لتجنب كسر Firebase وTurnstile وAnalytics وAdSense قبل فرضها.
   - الحل: الاستمرار في مراقبة تقارير CSP ثم فرض السياسة بعد تنظيف المصادر المسموحة.
   - الحالة: مقصود وآمن للمرحلة الحالية، لكنه آخر خطوة متبقية من تشديد سياسة المحتوى.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
curl.exe -sS -I --max-time 20 https://date-tool.com/
curl.exe -sS -I --max-time 20 https://date-tool.com/clock
git diff --check
git status --short
```

الحالة:

- الاتصال بالموقع وصفحات الأدوات مشفر ويظهر للمتصفح عبر HTTPS دون تحذير شهادة.
- Google لا يعرض عادة شارة «آمن» داخل نتيجة البحث؛ علامة السلامة هي عدم ظهور تحذير Safe Browsing أو صفحة حمراء عند الفتح.
- المصدر المرجعي الدائم لحالة Google هو تقرير `Security issues` في Search Console وأداة Safe Browsing Site Status.

### توافق التواريخ والثيم وإشعارات الإجراءات 0.3.31 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- استبدال تحويل التقويم المعتمد على `Intl` في المتصفح بتحويل أم القرى ثابت عبر `@internationalized/date`، حتى تعطي أجهزة iOS والمتصفحات القديمة النتيجة نفسها.
- فرض تقويم `gregory` ومحلي صريح عند عرض نتيجة التحويل من الهجري إلى الميلادي لمنع ظهور التاريخ الهجري مرة ثانية على الأجهزة التي تفرض تقويم المنطقة تلقائيًا.
- إضافة تحقق من صحة تواريخ الإدخال واختبارات معروفة للتحويل والعودة العكسية ورفض الأيام غير الموجودة أو السنوات خارج نطاق أم القرى المدعوم.
- إضافة رقم الشهر بجانب كل اسم في القوائم الميلادية والهجرية، مثل `رمضان 9` و`أكتوبر 10`.
- اعتماد ثلاثة أوضاع للمظهر في الموقع العام: فاتح، داكن، واتباع النظام، مع حفظ الاختيار وتطبيق `color-scheme` قبل الرسم الأول ومنع صفحة slug من إعادة تفسير الثيم بصورة منفصلة.
- توحيد تطبيق الثيم في الإدارة عند الانتقال من الموقع، وإضافة لون تحكم ثابت لحقول الإدخال الأصلية دون تغيير لوحة الألوان الحالية.
- إضافة خلفيات احتياطية للأزرار المصغرة قبل استخدام `color-mix()` حتى تبقى واضحة في المتصفحات الأقدم التي لا تدعم هذه الدالة.
- جعل إغلاق رسالة الخصوصية يحولها إلى زر كوكيز مصغر إلى أن يختار المستخدم، وجعل إغلاق رسالة التثبيت يحولها إلى زر تثبيت مصغر إلى أن يتخذ المستخدم قرار التثبيت.
- إبقاء تأخير رسالة التثبيت الكاملة `12` ثانية، وإضافة `id` و`display_override` و`prefer_related_applications` إلى Web App Manifest مع كسر كاش الأيقونات بواسطة نسخة `0.3.31`.
- نجاح معاينة OpenNext/Cloudflare محليًا، وإرجاع الرئيسية و`/age-calculator` و`/manifest.webmanifest` بحالة `200` مع ظهور أيقونات التطبيق والاختصارات المرفوعة إلى R2.

الملاحظات:

1. **تحذير Play Protect عن إصدار أندرويد قديم**
   - الأعراض: قد يعرض Android تحذيرًا بأن التطبيق المثبت أُنشئ لإصدار قديم من Android.
   - السبب: نسخة Android المستهدفة تخص WebAPK الذي ينشئه المتصفح أو حزمة Android/TWA، ولا يوفّر Web App Manifest حقلًا لتعيين `targetSdkVersion`.
   - الحل: تحديث المتصفح وAndroid System WebView، حذف النسخة المثبتة القديمة ثم إعادة التثبيت. إذا استمر التحذير بعد تثبيت جديد، فالحل الذي يعطي تحكمًا مباشرًا في `targetSdkVersion` هو إصدار تطبيق Android/TWA مستقل ومحدّث.
   - الحالة: تم تحسين Manifest والهوية والكاش من جانب الموقع؛ التحكم في `targetSdkVersion` خارج صلاحيات تطبيق الويب نفسه.

الملفات المتأثرة:

- `app/components/home/homeDateUtils.js`
- `app/HomePageClient.jsx`
- `app/SiteShell.jsx`
- `app/Header.jsx`
- `app/[slug]/PageClient.jsx`
- `app/admin/AdminShell.jsx`
- `app/components/PwaInstallPrompt.jsx`
- `app/globals.css`
- `app/i18n.js`
- `app/layout.jsx`
- `app/manifestConfig.js`
- `app/version.js`
- `tests/homeDateUtils.test.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm install @internationalized/date
npm test
npm run lint
npm run build
npm run preview
curl.exe -sS -I --max-time 20 http://127.0.0.1:8787/
curl.exe -sS -I --max-time 20 http://127.0.0.1:8787/age-calculator
curl.exe -sS --max-time 20 http://127.0.0.1:8787/manifest.webmanifest
git diff --check
```

الحالة:

- نجحت `17` حالة اختبار في `5` ملفات، ونجح ESLint وبناء Next.js وتوليد `31` صفحة.
- نجح بناء OpenNext وتشغيل Wrangler Preview محليًا، وأعيدت المسارات المختبرة بحالة `200`.
- لم يتغير تصميم الموقع أو لوحة ألوانه، ولم تتغير نسختا الإدارة والعميل.
- يلزم بعد النشر اختبار التحويل والثيم والتثبيت على جهاز iPhone المتأثر وجهاز Android كان مثبتًا عليه الإصدار السابق، مع إزالة النسخة القديمة وإعادة تثبيتها عند فحص تحذير Play Protect.

### إصلاح فشل تثبيت Cloudflare للنسخة 0.3.31 / admin 0.1.34 / client 1.0.4

ما تم إنجازه:

- تحليل فشل بناء Cloudflare للكومت `b5e400b` وتأكيد أن التوقف حدث في مرحلة `Installing` قبل تشغيل بناء Next.js أو نشر Worker، ولذلك بقيت النسخة الحية السابقة ظاهرة.
- محاكاة بيئة Cloudflare باستخدام `npm 10.9.2` نفسها، وإعادة إنتاج الخطأ محليًا: اعتبر `npm ci` ملف القفل غير متزامن لغياب `@emnapi/runtime@1.11.3` و`@emnapi/core@1.11.3` و`esbuild@0.28.2`.
- إعادة توليد `package-lock.json` باستخدام `npm 10.9.2` بدل ملف القفل الذي ولده `npm 11`، دون تغيير تبعيات التطبيق المباشرة أو وظائفه أو تصميمه.
- إعادة تشغيل تثبيت نظيف باستخدام `npm 10.9.2` ونجاح تثبيت `733` حزمة، ثم نجاح الاختبارات وESLint وبناء Next.js وبناء OpenNext.
- تشغيل Wrangler Preview محليًا والتحقق من أن الصفحة الرئيسية تعيد `200 OK`.
- عدم رفع رقم نسخة جديد؛ النسخة `0.3.31` موجودة بالفعل في الكود ولم تصل إلى الإنتاج بسبب فشل التثبيت السابق.

الأخطاء المكتشفة:

1. **عدم توافق ملف القفل المولد بـ npm 11 مع npm 10 في Cloudflare**
   - الأعراض: فشل بناء Cloudflare خلال ثوانٍ في مرحلة `Installing` وبقاء النسخة الحية القديمة.
   - السبب: ملف `package-lock.json` كان مقبولًا لدى `npm 11.6.2` لكنه ناقص سجلات peer/optional يتطلبها فحص `npm ci` في `npm 10.9.2` الذي تستخدمه بيئة Cloudflare.
   - الحل: تحديث ملف القفل بواسطة `npm 10.9.2` واختبار `npm ci` بنفس الإصدار قبل الدفع.
   - الحالة: محلول محليًا ومختبر؛ يحتاج دفع الكومت الجديد لتعيد Cloudflare البناء والنشر.

الملفات المتأثرة:

- `package-lock.json`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npx npm@10.9.2 ci --foreground-scripts --loglevel verbose
npx npm@10.9.2 install --package-lock-only --ignore-scripts --no-audit --no-fund
npx npm@10.9.2 ci --no-audit --no-fund
npm test
npm run lint
npm run build
npm run preview
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8787
```

الحالة:

- نجحت `17` حالة اختبار في `5` ملفات، ونجح ESLint وبناء Next.js وتوليد `31` صفحة.
- نجح بناء OpenNext وتشغيل Wrangler Preview، وأعادت الرئيسية محليًا `200 OK`.
- لم يتغير كود واجهة الموقع أو التصميم أو أرقام نسخ الموقع والإدارة والعميل.
- المتبقي: إنشاء كومت إصلاح ملف القفل ودفعه إلى `origin/master` بعد موافقة المستخدم، ثم مراقبة نجاح بناء Cloudflare وظهور `0.3.31` في الإنتاج.

### إصلاح تحقق رفع R2 وتبسيط الثيم وإشعارات الخصوصية 0.3.32 / admin 0.1.35 / client 1.0.4

ما تم إنجازه:

- استبدال تحقق جلسة Firebase الخادمي المعتمد على `accounts:lookup` ومفتاح Web API بتحقق مباشر من توقيع رمز Firebase ID عبر مفاتيح Google العامة، مع فحص المشروع والمصدر والمدة وهوية المستخدم.
- إبقاء فحص وثيقة المدير أو المساعد في Firestore بعد التحقق من الرمز؛ رفع الصور ما زال يتطلب حسابًا نشطًا ودورًا أو صلاحية مناسبة.
- تطبيق التحقق نفسه على رفع R2 وPageSpeed وتنظيف الإدارة وIndexNow وإدارة التذاكر حتى لا تتكرر المشكلة بعد تقييد مفتاح Firebase Web API بنطاقات المتصفح.
- توضيح رسائل رفع الهوية: خطأ الجلسة يطلب إعادة تسجيل الدخول، وخطأ الصلاحية يوضح أن الحساب نشط لكنه لا يملك صلاحية الهوية.
- إلغاء وضع `اتباع الجهاز` من زر المظهر؛ الزيارة الأولى تختار مظهر الجهاز تلقائيًا مرة واحدة، وبعدها يتنقل الزر بين الفاتح والداكن فقط ويحفظ اختيار المستخدم.
- استخدام زر `إعدادات الخصوصية` نفسه بعد إغلاق رسالة الموافقة بدل إنشاء زر كوكيز مختلف، مع استمرار احترام إعدادات الإدارة الخاصة بالصفحات بعد قبول المستخدم.
- جعل زر التثبيت المصغر يستخدم نفس هوية زر إعدادات الخصوصية ويظهر فوقه بعد إغلاق رسالة التثبيت، وعدم اعتبار رفض نافذة المتصفح تثبيتًا مكتملًا.
- عدم تغيير لوحة ألوان الموقع؛ التعديلات اقتصرت على السلوك وإعادة استخدام الأنماط الموجودة.
- إضافة اختبار انحدار لحالة العميل على iPhone: تحويل `23 رجب 1414` يعطي تاريخًا ميلاديًا صريحًا هو `6 يناير 1994`.
- إضافة اختبارات لوحدة التحقق الجديدة تغطي رمز Firebase الصحيح والرمز التالف ورمز المشروع الخاطئ.

الأخطاء المكتشفة:

1. **رفض رفع صورة المشاركة رغم أن حساب المدير نشط**
   - الأعراض: ظهور رسالة تفيد بعدم امتلاك صلاحية رفع الصور داخل `/admin/identity` مع استمرار فتح منصة الإدارة بصورة طبيعية.
   - السبب: مسار الرفع كان يستدعي Firebase Identity Toolkit من الخادم باستخدام مفتاح Web API المقيد بإحالات HTTP؛ طلب Worker الخادمي لا يحمل إحالة متصفح ففشل التحقق قبل الوصول إلى فحص حساب المدير.
   - الحل: التحقق من توقيع Firebase ID Token داخل Worker باستخدام مفاتيح Google العامة، ثم فحص حساب المدير وصلاحياته من Firestore كما كان.
   - الحالة: محلول محليًا ومغطى باختبارات؛ يحتاج نشر النسخة ثم إعادة تجربة رفع صورة المشاركة بالحساب الحالي، ولا يحتاج إنشاء مدير جديد أو إعادة تفعيل الحساب.

2. **اختلاط المظهر الصريح مع اتباع النظام**
   - الأعراض: اختيار الفاتح قد يبدو كأنه بقي داكنًا لأن دورة الزر كانت تمر بوضع ثالث يتبع الجهاز.
   - السبب: وجود ثلاثة أوضاع في زر واحد دون وضوح كافٍ للمستخدم.
   - الحل: اعتماد فاتح/داكن فقط بعد اختيار المظهر الأول تلقائيًا من نظام الجهاز.
   - الحالة: محلول محليًا ومختبر عبر البناء وESLint.

3. **اختلاف شكل زر الخصوصية والتثبيت بعد إغلاق الرسائل**
   - الأعراض: إنشاء زر كوكيز جديد وعدم اتساقه مع زر إعدادات الخصوصية الموجود، مع اختلاف زر التثبيت المصغر.
   - السبب: استخدام أصناف تصميم منفصلة للحالات المصغرة.
   - الحل: إعادة استخدام زر إعدادات الخصوصية نفسه، ووضع زر التثبيت فوقه بنفس النمط داخل مكدس إجراءات واحد.
   - الحالة: محلول محليًا دون تغيير ألوان الهوية.

الملفات المتأثرة:

- `app/api/_lib/firebaseIdToken.js`
- `app/api/media/upload/route.js`
- `app/api/pagespeed/route.js`
- `app/api/admin/cleanup/route.js`
- `app/api/admin/indexnow/route.js`
- `app/api/admin/support/route.js`
- `app/admin/identity/page.jsx`
- `app/SiteShell.jsx`
- `app/Header.jsx`
- `app/layout.jsx`
- `app/i18n.js`
- `app/components/PwaInstallPrompt.jsx`
- `app/globals.css`
- `tests/firebaseIdToken.test.js`
- `tests/homeDateUtils.test.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- tests/firebaseIdToken.test.js tests/homeDateUtils.test.js
npm test
npm run lint
npm run build
npm run dev
git diff --check
git commit -m "fix admin uploads and public preference controls"
git push origin master
npm run deploy
curl.exe -sS -I --max-time 30 https://date-tool.com/privacy
curl.exe -sS -I --max-time 30 https://date-tool.com/admin/identity
curl.exe -sS -X POST --max-time 30 https://date-tool.com/api/media/upload
```

الحالة:

- نجحت `20` حالة اختبار في `6` ملفات، ونجح ESLint وبناء Next.js وتوليد `31` صفحة.
- نجح اختبار التحويل المبلغ عنه وتأكد أن الناتج ميلادي وليس هجريًا.
- تعذر ربط أداة المعاينة المرئية بالخادم المحلي بسبب إعداد ثقة داخلي في إضافة المتصفح، وليس بسبب خطأ في التطبيق؛ البناء والاختبارات البرمجية مكتملة.
- أُنشئ الكومت `22f57fd` ودُفع إلى `origin/master`، ثم نُشر Worker `datetools` مباشرة إلى Cloudflare بالمعرف `6aaf0a31-f05f-4d4c-a182-b6cd16ccec20`.
- نجح فحص الإنتاج: أعادت `/privacy` و`/admin/identity` حالة `200`، واحتوى أصل JavaScript الحي نسختي `0.3.32` و`admin 0.1.35`، ورفض مسار رفع الصور الطلب غير المسجل برسالة `unauthorized` كما يجب.
- تعطل أول تشغيل للنشر لأن عملية Next.js محلية قديمة كانت تقفل مجلد `.open-next`؛ تم التحقق من العمليات التابعة للمشروع وإيقافها وتنظيف مجلد البناء المؤقت فقط، ثم نجح البناء والنشر.
- يلزم الآن تسجيل الخروج والدخول مرة واحدة إذا كانت الجلسة القديمة محفوظة، ثم تجربة رفع صورة مشاركة من `/admin/identity` واختبار أزرار الخصوصية والتثبيت على هاتف فعلي.

### متابعة مظهر الجهاز وتحسين مشاركة المواعيد 0.3.33 / admin 0.1.35 / client 1.0.4

ما تم إنجازه:

- جعل الموقع العام والنسخة المثبتة يقرآن مظهر الجهاز عند التشغيل ويستجيبان لتغيّره مباشرة أثناء الاستخدام.
- إضافة توافق مع واجهتي `MediaQueryList.addEventListener` و`addListener` حتى تستمر مراقبة المظهر على المتصفحات القديمة.
- تحديث `color-scheme` ووسم `theme-color` أثناء التشغيل بحسب المظهر الفعلي، بما يحسن اتساق شريط المتصفح والتطبيق المثبت.
- الإبقاء على زر المظهر للتبديل اليدوي الفوري بين الفاتح والداكن، مع عودة المتابعة التلقائية عند تغيّر مظهر الجهاز لاحقًا.
- تحويل مشاركة المواعيد إلى نافذة اختيار صغيرة تسمح بتحديد موعد واحد أو عدة مواعيد قبل المشاركة.
- فصل التاريخ الميلادي والهجري داخل شريط اليوم بعنصر فاصل واضح وتحسين توزيع النص على الشاشات الصغيرة.
- تثبيت شبكة المواعيد على عمودين في الجوال وتقليل المقاسات الداخلية بحذر لمنع التداخل أو قص النص.
- عدم تغيير لوحة الألوان أو نسختي الإدارة والعميل.

الملفات المتأثرة:

- `app/SiteShell.jsx`
- `app/layout.jsx`
- `app/HomePageClient.jsx`
- `app/components/home/HomeSections.jsx`
- `app/globals.css`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run dev -- --port 3000
npm run lint
npm test
npm run build
git diff --check
```

الحالة:

- نجحت اختبارات Vitest وعددها 20 اختبارًا، ونجح ESLint وبناء Next.js النهائي للنسخة 0.3.33.
- أعادت الصفحة الرئيسية من خادم التطوير المحلي حالة `200`.
- تعذر ربط أداة الفحص البصري داخل التطبيق بالخادم المحلي بسبب إعداد ثقة داخلي في إضافة المتصفح، وليس بسبب خطأ في الموقع.
- تم إنشاء الكومت `3ce5f43` ودفعه إلى `origin/master`.
- تم نشر Worker `datetools` بنجاح على Cloudflare، ومعرف النسخة المنشورة هو `b29e5f2e-f4fe-460e-aed5-f99614e0c6de`.
- أعادت الصفحة الحية وملف `manifest.webmanifest` حالة `200`، وظهر رقم 0.3.33 في HTML، وتأكد وجود `display: standalone` وأيقونات PWA المحدثة في الـmanifest.
- أكدت أصول الإنتاج وجود مراقبة `prefers-color-scheme` ونافذة اختيار المواعيد وتنسيقات فصل التاريخين وعمودي المواعيد على الجوال.
- التطبيق المثبت يتبع مظهر الجهاز عند بدء التشغيل وأثناء تغيره، ويحدث `theme-color` و`color-scheme` بحسب المظهر الفعلي. يبقى لون شاشة الإطلاق الأولية ثابتًا حسب الـmanifest لأن معيار Web App Manifest لا يدعم لونًا شرطيًا حسب مظهر النظام، ثم يتزامن التطبيق فور تحميل الواجهة.
- تم فصل سلوك الموقع العام عن مفتاح `site_theme` المستخدم في الإدارة، لذلك لا تؤدي زيارة الموقع أو تشغيل التطبيق المثبت إلى حذف اختيار مظهر منصة الإدارة.

### تجربة صورة مشاركة مستقلة لأداة حساب المدة - 0.3.34 / admin 0.1.36 / client 1.0.4

ما تم إنجازه:

- إضافة حقل تجريبي لإرفاق صورة ظهور الرابط داخل إعدادات SEO لأداة `حساب المدة بين تاريخين` فقط، دون تعميمه على بقية الأدوات في هذه المرحلة.
- رفع الصورة بصيغ PNG أو JPG أو WEBP وبحد أقصى 5MB إلى R2 ضمن تصنيف مستقل وآمن باسم `seo-share`.
- تمرير جلسة Firebase الفعلية إلى إدارة الأدوات حتى يعمل رفع الصورة بحساب المدير أو المساعد المصرح له بإدارة الأدوات.
- حفظ رابط الصورة ضمن `toolSettings.date.subtoolSeo.durationCalc.shareImageUrl` في Firebase، مع الحفاظ عليه أثناء التطبيع والتسلسل.
- استخدام الصورة المحفوظة في `og:image` و`twitter:image` لصفحة `/date-difference`، وعرضها داخل معاينة SEO في الإدارة.
- إبقاء سيكشن عارض الرابط العام في الهوية مؤقتًا؛ فهو ما زال احتياطيًا للصفحة الرئيسية والصفحات التي لا تملك صورة SEO مستقلة.

الأخطاء المكتشفة:

1. **عدم تمرير جلسة Firebase إلى صفحة إدارة الأدوات**
   - الأعراض: كان حقل الصورة سيظهر، لكن الرفع سيرفض دائمًا برسالة انتهاء جلسة الإدارة.
   - السبب: `ToolManagementShell` كان يمرر دوال القراءة والحفظ فقط دون كائن `auth`.
   - الحل: تهيئة `getFirebaseAuth()` وتمرير `auth` إلى مكونات إدارة الأدوات.
   - الحالة: محلول ومختبر بالبناء وESLint.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tool-management/ToolManagementShell.jsx`
- `app/api/_lib/mediaValidation.js`
- `app/api/media/upload/route.js`
- `app/toolSeoServer.js`
- `app/toolSettings.js`
- `tests/mediaValidation.test.js`
- `tests/toolSettings.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت اختبارات Vitest وعددها 21 اختبارًا في 7 ملفات، ونجح ESLint وبناء Next.js وتوليد 31 صفحة.
- ظهرت تحذيرات `fetch EACCES` أثناء البناء لأن بيئة الفحص المحلية تمنع الوصول الشبكي إلى Firestore، لكن آليات fallback أكملت البناء بنجاح ولم تفشل أي صفحة.
- تم اعتماد إصدار الموقع `0.3.34` وإصدار الإدارة `0.1.36` مع إبقاء إصدار بوابة العميل `1.0.4` دون تغيير.
- تم إنشاء الكومت `fb012fe` ودفعه إلى `origin/master`.
- تم نشر Worker `datetools` بنجاح، ومعرف النسخة المنشورة هو `06d37634-28b3-457b-9b38-f2db24a41cfa`.
- أعادت الصفحة الرئيسية وصفحة `/date-difference` وصفحة إدارة التاريخ حالة `200` من النطاق الحي، وظهر إصدار `0.3.34` في HTML.
- أعاد مسار رفع الصور `401` عند استدعائه دون جلسة، وتأكد بقاء صفحة الإدارة `noindex`.
- لا يظهر `og:image` في `/date-difference` قبل رفع الصورة وحفظ إعدادات الأداة، وهذا هو السلوك المقصود حتى لا تُستخدم صورة غير معتمدة.
- المتبقي بعد النشر: رفع صورة 1200×630 من بطاقة أداة المدة، الضغط على حفظ، التحقق من وجود `og:image` في `/date-difference`، ثم اختبار مشاركة الرابط بعد تحديث كاش واتساب.
- بعد نجاح التجربة يمكن تعميم الحقل على الأدوات التسع والرئيسية، ثم تقرير حذف عارض الرابط العام من الهوية أو إبقائه كقيمة احتياطية للصفحات العامة.

### تثبيت حفظ صورة SEO وتحسين معاينتها - 0.3.34 / admin 0.1.37 / client 1.0.4

ما تم إنجازه:

- تثبيت مرجع دالة رسائل إدارة الأدوات باستخدام `useCallback` لمنع آثار تحميل Firebase من العمل مجددًا بعد كل إشعار حفظ أو رفع.
- منع ضياع رابط صورة المشاركة بعد اكتمال رفعه إلى R2 وقبل الضغط على حفظ، حتى يصل إلى `settings/public` ويظهر لاحقًا ضمن `og:image` و`twitter:image`.
- منع إعادة تحميل بيانات جميع سيكشنات إدارة الأداة عند الحفظ أو الرفع، مع تحديث الحالة المحلية فقط بعد نجاح العملية.
- توسيع حقل رفع صورة المشاركة وتحسين عرض اسم الملف والصورة المصغرة على الشاشات الكبيرة والصغيرة.
- فصل معاينة صورة المشاركة في مربع مستقل أسفل معاينة نتيجة البحث، مع حالة فارغة واضحة قبل اختيار الصورة.
- رفع إصدار الإدارة فقط إلى `0.1.37` مع إبقاء إصدار الموقع العام `0.3.34` والعميل `1.0.4` دون تغيير.

الأخطاء المكتشفة:

1. **اختفاء رابط صورة المشاركة بعد الرفع وإعادة تحميل السيكشنات**
   - الأعراض: ينجح رفع الصورة وتظهر رسالة النجاح، ثم تعود قيمة الصورة إلى القيمة القديمة ولا يصل `og:image` إلى صفحة الأداة بعد الحفظ.
   - السبب: دالة `showMessage` كانت تُنشأ من جديد مع كل رسم للأب؛ وكانت ضمن اعتماد أثر تحميل إعدادات الأداة، لذلك أعاد الإشعار جلب Firebase واستبدل الحالة المحلية قبل الحفظ.
   - الحل: تثبيت الدالة باستخدام `useCallback` وإبقاء تحديثات الحفظ والرفع داخل الحالة المحلية دون جلب جديد غير مطلوب.
   - الحالة: محلول، ونجحت الاختبارات وESLint والبناء الكامل.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tool-management/ToolManagementShell.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
git diff --check
npm test
npm run lint
npm run build
```

الحالة:

- نجحت اختبارات Vitest وعددها 21 اختبارًا في 7 ملفات، ونجح ESLint وبناء Next.js وتوليد 31 صفحة.
- ظهرت رسائل `fetch EACCES` أثناء التوليد بسبب منع بيئة الفحص المحلية الوصول إلى Firestore، لكن fallback أكمل البناء ولم تفشل أي صفحة.
- تم إنشاء الكومت `d078302` ودفعه إلى `origin/master`.
- تم نشر Worker `datetools` بنجاح، ومعرف النسخة المنشورة هو `2b1db2b2-8bcd-47a2-b4ac-290473057f62`.
- أعادت صفحة إدارة التاريخ حالة `200` من النطاق الحي، وظهرت ملفات JavaScript وCSS الجديدة ومعها إصدار الإدارة `0.1.37` ومعاينة صورة المشاركة المنفصلة.
- ما زالت قيمة `durationCalc.shareImageUrl` العامة فارغة لأن الصورة السابقة ضاعت من الحالة المحلية قبل هذا الإصلاح؛ يلزم رفع الصورة مرة أخرى ثم الضغط على حفظ لتظهر في `og:image`.
- بقي بعد النشر رفع الصورة مرة أخرى والضغط على حفظ؛ قد تحتاج بطاقة واتساب القديمة إلى رابط جديد أو انتظار تحديث الكاش بعد ظهور `og:image` في مصدر `/date-difference`.

### إصلاح عرض صور SEO وتثبيت تدفقات الحفظ والرفع - 0.3.34 / admin 0.1.38 / client 1.0.4

ما تم إنجازه:

- توحيد قائمة فئات الوسائط العامة مع قائمة فئات الرفع الآمنة، وإتاحة قراءة `seo-share` بعد أن كان الرفع ينجح لكن مسار العرض يرفض الصورة.
- تصغير ارتفاع حقل رفع صورة المشاركة وإزالة الصورة المصغرة المكررة من داخله، مع إبقاء المعاينة الكاملة في البطاقة المنفصلة.
- وضع أيقونة الرفع داخل الحقل وزر إزالة مستقل بمحاذاته، مع ضغط الزر إلى أيقونة فقط على الشاشات الصغيرة.
- مراجعة صفحات الإدارة بحثًا عن `router.refresh` و`location.reload` وإرسال النماذج التقليدي، وعدم العثور على أي إعادة تحميل صريحة في تدفقات الحفظ أو الرفع.
- تثبيت `showMessage` باستخدام `useCallback` في صفحات الهوية، الربط الخارجي، إعدادات الإعلانات، الحملات، وإعدادات الأداة؛ وإبقاء التحديثات داخل الحالة المحلية.
- إضافة اختبار آلي يفشل إذا أضيفت لاحقًا أي إعادة تحميل صريحة داخل ملفات منصة الإدارة.
- حذف أيقونات اختصارات التاريخ والساعة والطقس المحلية بمقاسي 192 و512 لعدم استخدامها، مع إبقاء Manifest معتمدًا على روابط R2 المحفوظة في إعدادات الهوية.
- رفع إصدار الإدارة فقط إلى `0.1.38` دون تغيير إصدار الموقع العام `0.3.34` أو بوابة العميل `1.0.4`.

الأخطاء المكتشفة:

1. **رفع صورة SEO ينجح لكن الصورة لا تظهر في المعاينة أو بطاقة المشاركة**
   - الأعراض: يظهر رابط `/api/media/seo-share/...` بعد الرفع، بينما تعرض المعاينة صورة مكسورة.
   - السبب: مسار القراءة العام للوسائط احتوى قائمة مستقلة لا تشمل فئة `seo-share` رغم سماح مسار الرفع بها.
   - الحل: استخدام `getSafeMediaCategory` نفسها في الرفع والقراءة لمنع اختلاف القائمتين مستقبلًا.
   - الحالة: محلول ومغطى باختبار فئة الوسائط وبناء المشروع.

2. **احتمال إعادة إنشاء دوال الرسائل في صفحات الإدارة**
   - الأعراض: لا يحدث تحميل صريح، لكن المرجع المتغير قد يعيد تشغيل أثر يعتمد عليه عند إضافة اعتماد جديد مستقبلًا.
   - السبب: تعريف `showMessage` كدالة جديدة مع كل رسم في بعض الصفحات.
   - الحل: تثبيت الدوال بـ `useCallback` وإضافة اختبار يمنع أوامر إعادة التحميل الصريحة.
   - الحالة: محلول.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/ad-settings/page.jsx`
- `app/admin/ads/page.jsx`
- `app/admin/identity/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tools/page.jsx`
- `app/api/media/[...key]/route.js`
- `app/version.js`
- `tests/adminNoReload.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`
- حذف `public/pwa-shortcut-*.png` الستة.

الأوامر المستخدمة:

```powershell
rg -n "router\.refresh|location\.reload|window\.location\.href|document\.location" app/admin
npm test
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت اختبارات Vitest وعددها 22 اختبارًا في 8 ملفات.
- نجح ESLint دون أخطاء أو تحذيرات بعد تثبيت اعتماد دالة رسائل الحملات.
- نجح بناء Next.js النهائي وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` المتوقعة بسبب حظر الشبكة المحلية، وأكملت آليات fallback البناء دون فشل.
- تم إنشاء الكومت `5a9d972` ودفعه إلى `origin/master`.
- تم نشر Worker `datetools` بنجاح، ومعرف النسخة المنشورة هو `9454ac17-5743-4f66-ad06-4cb0218cd63b`.
- أعادت صفحة `/date-difference` حالة `200` بعد النشر، وأصبح `og:image` يشير إلى صورة `seo-share` المرفوعة على R2.
- أعاد رابط صورة المشاركة نفسه حالة `200`، وبذلك تأكد إصلاح المعاينة وبطاقة مشاركة الرابط على الإنتاج.

### توحيد روابط الأدوات الكاملة وصور SEO - 0.3.35 / admin 0.1.39 / client 1.0.4

ما تم إنجازه:

- إبقاء المسارات النظيفة للأدوات الداخلية التسع مستقلة مثل `/age-calculator` و`/date-difference` مع بيانات SEO وCanonical خاصة بكل أداة.
- عرض صفحة الأداة الأم كاملة داخل كل مسار، ثم التمرير تلقائيًا إلى القسم المطلوب دون إضافة `#` إلى عنوان الرابط.
- إزالة `focusTool` ووضع الاختصار القديم الذي كان يخفي المواعيد وبقية أدوات التاريخ في المسارات الثلاثة الخاصة بالتاريخ.
- تعميم رفع صورة مشاركة SEO ومعاينتها على الأدوات الداخلية التسع بدل اقتصارها على حساب المدة بين تاريخين.
- تحديث رسالة رفع الصورة لتكون عامة وصحيحة لأي أداة، مع استمرار الرفع إلى فئة `seo-share` الآمنة في R2.
- رفع إصدار الموقع العام إلى `0.3.35` وإصدار الإدارة إلى `0.1.39`، مع إبقاء بوابة العميل `1.0.4`.

الأخطاء المكتشفة:

1. **المسارات النظيفة لأدوات التاريخ تعرض صفحة مختصرة**
   - الأعراض: رابط مثل `/date-difference` يعرض أداة واحدة ويخفي المواعيد وبقية أدوات الصفحة الرئيسية.
   - السبب: تمرير `focusTool` إلى `HomePageClient` واستخدامه لإخفاء كل الأقسام غير المحددة.
   - الحل: إزالة وضع الاختصار مع إبقاء `initialSectionId` للتمرير إلى الأداة المطلوبة داخل الصفحة الكاملة.
   - الحالة: محلول، وتأكد وجود المعرّفات التسعة المطابقة للمسارات ونجح البناء.

2. **صورة المشاركة متاحة لأداة داخلية واحدة فقط**
   - الأعراض: إعداد صورة `og:image` يظهر لحساب المدة فقط رغم وجود تسع صفحات SEO مستقلة.
   - السبب: شرط واجهة الإدارة كان يحصر `enableShareImage` في `durationCalc`.
   - الحل: تفعيل حقل الرفع والمعاينة لكل إعداد SEO فرعي، مع بقاء الصورة محفوظة بصورة مستقلة لكل أداة.
   - الحالة: محلول.

الملفات المتأثرة:

- `app/[slug]/page.jsx`
- `app/HomePageClient.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `tests/toolSettings.test.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
rg -n "focusTool|initialSectionId|enableShareImage" app tests
npm test
npm run lint
npm run build
git diff --check
npm run deploy
```

الحالة:

- نجحت اختبارات Vitest وعددها 22 اختبارًا في 8 ملفات.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` بسبب حظر الشبكة المحلية وأكملت آليات fallback البناء دون فشل.
- تم إنشاء الكومت `ade5729` ودفعه إلى `origin/master`.
- تم نشر Worker `datetools` بنجاح، ومعرف النسخة المنشورة هو `e381b88b-ea8a-469b-a499-9dc673709152`.
- أعادت مسارات `/age-calculator` و`/time-converter` و`/weather-search` و`/date-difference` الحالة `200` مع Canonical مستقل لكل مسار.
- أكد فحص المتصفح الحي أن `/date-difference` و`/timezone-difference` و`/weather-forecast` تبقى بلا `#`، تمرر تلقائيًا إلى الأداة المطلوبة، وتعرض جميع أقسام صفحة الأداة الأم دون أخطاء في سجل المتصفح.
- استمر `og:image` الخاص بـ`/date-difference` في الإشارة إلى صورة `seo-share` المرفوعة على R2؛ وتصبح صور الأدوات الثماني الأخرى فعالة فور رفع صورة مستقلة وحفظ إعداد SEO لكل أداة من منصة الإدارة.

### دمج الهوية وصور SEO الرئيسية - 0.3.36 / admin 0.1.40 / client 1.0.4

ما تم إنجازه:

- دمج سيكشنات بيانات الهوية وهوية التطبيق والتثبيت داخل `/admin/tools` مع حفظ إعدادات الأداة والهوية في عملية واحدة دون إعادة تحميل الصفحة.
- نقل رابط إعدادات الأداة إلى العنصر الثاني في القائمة الجانبية، وحذف رابط إدارة الهوية المنفصل، وتحويل `/admin/identity` إلى `#identity-basic-settings` داخل صفحة الإعدادات الموحدة.
- عدم نقل سيكشن عارض الرابط القديم إلى الصفحة الموحدة، والاعتماد على صور وعوارض SEO لكل صفحة وأداة.
- إبقاء بيانات `linkPreview` القديمة ومسار رفعها في الخلفية مؤقتًا للتوافق مع الصفحات القديمة دون عرضها في الإدارة أو حذف بيانات المستخدم.
- إضافة رفع صورة مشاركة ومعاينتها إلى SEO صفحات التاريخ والساعة والطقس الرئيسية، مع استمرار الصورة المستقلة لكل واحدة من الأدوات الداخلية التسع.
- حذف جدول الأسماء المختصرة والمعروضة للأدوات الفرعية من إدارة الأدوات لأنه لم يعد مستخدمًا.
- توحيد ارتفاع زر إزالة صورة المشاركة مع حقل الرفع على الشاشات الكبيرة والصغيرة.
- إصلاح مسار قراءة صور R2 الديناميكي ليتوافق مع `params` غير المتزامنة في Next.js 15.
- إبقاء صلاحيات صفحة إعدادات الأداة كما كانت دون إضافة صلاحية الهوية القديمة إلى حسابات المساعدين، منعًا لتوسيع الوصول تلقائيًا.
- رفع إصدار الموقع العام إلى `0.3.36` وإصدار الإدارة إلى `0.1.40`، مع إبقاء بوابة العميل `1.0.4`.

الأخطاء المكتشفة:

1. **تشتت إعدادات الهوية والأداة بين صفحتين**
   - الأعراض: حقول الهوية والتثبيت منفصلة عن إعدادات الصفحات والروابط ويصعب الوصول إليها من مكان واحد.
   - السبب: بقاء صفحة `/admin/identity` مستقلة مع رابط خاص في القائمة الجانبية.
   - الحل: نقل السيكشنات المطلوبة إلى `/admin/tools` واعتماد حفظ موحد وتحويل دائم للمسار القديم.
   - الحالة: محلول، مع حذف عارض الرابط القديم من الواجهة فقط كما طلب المستخدم.

2. **صور المشاركة متاحة للأدوات الداخلية دون صفحات الأدوات الأم**
   - الأعراض: لا يمكن تعيين صورة مستقلة للرئيسية أو `/clock` أو `/weather` من لوحة SEO.
   - السبب: تفعيل حقل `shareImageUrl` داخل إعدادات SEO الفرعية فقط.
   - الحل: إضافة الحقل إلى SEO الرئيسي للصفحات الثلاث وتعميم الرفع والمعاينة عليه.
   - الحالة: محلول ومغطى باختبارات الحفظ والتسلسل.

3. **معاينة صور R2 تعيد 404 محليًا في Next.js 15**
   - الأعراض: تحذير `params should be awaited` وفشل معاينة favicon أو صورة R2 أثناء الفحص المحلي.
   - السبب: قراءة `params.key` قبل انتظار كائن `params` في مسار catch-all.
   - الحل: استخدام `getKey(await params)` وإضافة اختبار حارس للمسار.
   - الحالة: محلول.

4. **تعارض مؤقت في تبويب إدارة مفتوح قبل النشر**
   - الأعراض: ظهر خطأ `e[o] is not a function` عند إعادة تحميل تبويب كان يحتفظ بحزمة JavaScript من النسخة السابقة.
   - السبب: مزج كاش التبويب القديم بين ملف Webpack سابق وحزم الإصدار المنشور حديثًا، وليس خطأ في حزمة الإنتاج الجديدة.
   - الحل: فحص النسخة من طلب غير مخزن وتحديث تبويب الإدارة إلى رابط النسخة الجديدة؛ ظهرت إعدادات الهوية والتثبيت دون أخطاء Console.
   - الحالة: محلول للتبويب المفتوح، وأكدت جلسة جديدة أن الزوار الجدد لا يتأثرون.

الملفات المتأثرة:

- `app/admin/AdminDashboard.css`
- `app/admin/AdminShell.jsx`
- `app/admin/ad-settings/page.jsx`
- `app/admin/ads/page.jsx`
- `app/admin/identity/page.jsx`
- `app/admin/integrations/page.jsx`
- `app/admin/page.jsx`
- `app/admin/pagespeed/page.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/tools/page.jsx`
- `app/api/media/[...key]/route.js`
- `app/toolSettings.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/adminNoReload.test.js`
- `tests/mediaRoute.test.js`
- `tests/toolSettings.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
rg -n "/admin/identity|إدارة الهوية|link-preview|tool-subtools-list" app tests
npm test
npm run lint
npm run build
npm run dev
git diff --check
```

الحالة:

- نجحت اختبارات Vitest وعددها 25 اختبارًا في 9 ملفات، ومنها حارس لترتيب إعدادات الأداة ثانيًا في جميع تعريفات قائمة الإدارة المتبقية.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js النهائي وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` المتوقعة بسبب حظر الشبكة المحلية وأكملت آليات fallback البناء دون فشل.
- أكد الفحص المحلي تحميل `/admin/tools` دون أخطاء Console قبل تحويل المستخدم غير المسجل إلى صفحة الدخول، وكشف فحص الصور مشكلة `params` التي تم إصلاحها وإضافة اختبار لها.
- تم نشر Worker `datetools` بنجاح من نسخة مؤقتة نظيفة للكومت `761282d` بعد أن قفل خادم تطوير سابق مجلد `.open-next` داخل OneDrive.
- معرف نسخة Cloudflare المنشورة هو `8ff00834-5943-427d-b782-2b2281c32a02`.
- أعادت الصفحة الرئيسية و`/clock` و`/weather` و`/admin/tools` و`/admin/identity` و`/manifest.webmanifest` و`/api/site-config` الحالة `200` بعد النشر.
- أكد فحص المتصفح الحي ظهور بيانات الهوية وهوية التثبيت داخل `/admin/tools`، واختفاء عارض الرابط القديم، وعدم وجود أخطاء Console في جلسة جديدة.

### تقوية الصلاحيات والبيانات العامة وإزالة تحدي App Check المزعج - 0.3.37 / admin 0.1.41 / client 1.0.5

ما تم إنجازه:

- توحيد أدوار الإدارة في مساعد مركزي واحد، وقبول الأدوار المعروفة فقط، ورفض الحساب النشط إذا كان دوره مفقودًا أو غير معروف بدل منحه صلاحية ضمنية.
- تقييد المساعدين بالصلاحيات الممنوحة لهم صراحة، ومنع المساعد بلا صلاحيات من فتح أقسام الإدارة أو تنفيذ عمليات رفع الوسائط.
- جعل حساب المعلن صالحًا للدخول وقراءة حملاته فقط عندما تكون حالته `active` صراحة، وعدم اعتبار الحالة المفقودة نشطة.
- تضييق قواعد Firestore لوثائق الإدارة والمعلنين والحملات، وتحديد الحقول والأنواع والحالات المسموحة ومنع الحقول الإضافية غير المتوقعة.
- قصر تحديث المعلن لحملته على الحالة و`updatedAt` فقط، وتحويل وقت التحديث إلى `serverTimestamp()` بما يطابق قواعد Firestore.
- إغلاق قراءة `settings/main` العامة نهائيًا داخل الكود، والاعتماد على الإسقاط العام `settings/public` فقط.
- جعل تحقق Turnstile يفشل بصورة مغلقة في الإنتاج عند غياب المفاتيح، مع السماح بتجاوز محلي محدود على `localhost` و`127.0.0.1` للاختبار.
- إزالة مفتاح reCAPTCHA Enterprise التفاعلي الثابت الذي كان يعرض تحديات صور مزعجة داخل الإدارة، وجعل Firebase App Check يعمل فقط عند توفير مفتاح Website score-based عبر `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`.
- إبقاء App Check Enforcement متوقفًا إلى أن يظهر تدفق طلبات موثقة فعليًا بالمفتاح score-based، حتى لا تتوقف قراءات الموقع الخادمية.
- تقليل البيانات العامة للحملات بحذف العدادات الداخلية، وقبول صور إعلانات R2 الداخلية وروابط HTTPS والتواريخ الصالحة فقط.
- جعل حفظ كل سيكشن يحدّث حقوله المرسلة فقط بدل حذف حقول قديمة في كل عملية حفظ، منعًا لتعارض حفظ الأقسام المتزامنة.
- مساواة موضع زر إزالة صورة SEO مع حقل الرفع بإضافة الهامش المستهدف نفسه إلى الزر دون إزالة `margin-top` العام من جميع `label` في الإدارة.
- إضافة اختبارات حارسة للصلاحيات، وفصل الإعدادات، وتعطيل مفتاح App Check الثابت، وحدود البيانات العامة للحملات.
- رفع إصدار الموقع العام إلى `0.3.37`، ومنصة الإدارة إلى `0.1.41`، وبوابة المعلنين إلى `1.0.5`.

الأخطاء المكتشفة:

1. **تحدي صور Google يظهر داخل منصة الإدارة**
   - الأعراض: ظهور نافذة اختيار صور ممرات المشاة أثناء استخدام إدارة الأدوات.
   - السبب: مفتاح reCAPTCHA Enterprise ثابت من نوع تفاعلي/Invisible داخل Firebase App Check، وليس Cloudflare Turnstile.
   - الحل: إزالة المفتاح الثابت، وربط App Check لاحقًا فقط بمفتاح Website score-based من متغير بناء عام.
   - الحالة: محلول برمجيًا؛ فرض App Check مؤجل عمدًا حتى إعداد المفتاح الصحيح ومراقبة الطلبات الموثقة.

2. **قبول أدوار أو حالات حسابات ناقصة ضمنيًا**
   - الأعراض: الحساب النشط كان قد يمر دون دور إدارة معروف، والمعلن كان قد يمر دون حالة صريحة.
   - السبب: فحوص تعتمد على `active` وحدها أو تعتبر الحالة المفقودة مسموحة.
   - الحل: اعتماد قوائم أدوار معروفة وحالة معلن `active` صريحة في العميل وAPI والقواعد.
   - الحالة: محلول ومغطى بالاختبارات.

3. **اتساع تحديثات Firestore للمساعدين والحملات**
   - الأعراض: وجود حقول تنظيف مشتركة في كل سيكشن وقواعد حملات لا تحصر المخطط كاملًا.
   - السبب: دمج تنظيف البيانات القديمة مع عمليات الحفظ اليومية، وعدم استخدام `keys().hasOnly()` في إنشاء الوثائق.
   - الحل: فصل التنظيف عن الحفظ، وحصر حقول الوثائق والأنواع والحالات والتحديثات المملوكة للمعلن.
   - الحالة: محلول ومنشور على مشروع `date-tool-official` بعد موافقة إنتاج صريحة في 2026-08-24.

4. **اختلاف محاذاة زر إزالة صورة SEO عن حقل الرفع**
   - الأعراض: يبدو زر الإزالة أطول لأن `label` العام ينزل حقل الرفع بمقدار 10px.
   - السبب: `label { margin-top: 10px; }` لا ينطبق على زر الإزالة.
   - الحل: إضافة `margin-top: 10px` إلى `.tool-seo-image-remove` دون تعديل قاعدة `label` العامة.
   - الحالة: محلول.

الملفات المتأثرة:

- `.dev.vars.example`
- `app/adminRoles.js`
- `app/admin/AdminDashboard.css`
- `app/admin/AdminShell.jsx`
- `app/admin_login/page.jsx`
- `app/api/_lib/adminPermissions.js`
- `app/api/media/upload/route.js`
- `app/api/public-campaigns/route.js`
- `app/client/ClientVersion.js`
- `app/client/dashboard/page.jsx`
- `app/firebase.js`
- `app/firestorePublicConfig.js`
- `app/securityPolicies.js`
- `app/turnstileServer.js`
- `app/version.js`
- `firestore.rules`
- `package.json`
- `package-lock.json`
- `tests/adminPermissions.test.js`
- `tests/securityPolicies.test.js`
- `tests/settingsSecurity.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
git diff --check
npx firebase-tools deploy --only firestore:rules --project date-tool-official
```

الحالة:

- نجحت اختبارات Vitest وعددها 32 اختبارًا في 10 ملفات.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` بسبب منع الشبكة داخل بيئة البناء المحلية واكتملت آليات fallback دون فشل.
- نُشرت قواعد Firestore المشددة بنجاح إلى مشروع `date-tool-official`، ونجح فحص التجميع ثم إصدار القواعد إلى `cloud.firestore`.
- أكد الفحص الخارجي بعد النشر أن `settings/public` يعيد `200`، وأن `settings/main` وقائمتي `admins` و`campaigns` تعيد `403` للطلب غير المسجل.
- يبقى CSP في وضع Report-Only، ويبقى App Check Enforcement متوقفًا حتى اكتمال المراقبة بالمفتاح score-based الصحيح.
- تم دفع الكومت `d4065c5` إلى `origin/master` ونشر Worker `datetools` بنجاح؛ معرف نسخة Cloudflare هو `c51326ff-0b3b-470a-9ad4-ef34958b18da`.
- أعادت الصفحة الرئيسية و`/admin/tools` الحالة `200`، وظهر الإصدار العام `0.3.37`، وكانت ترويسات HSTS وCSP Report-Only و`X-Frame-Options: DENY` موجودة.
- أكد المسار `/api/security/turnstile` أن Turnstile مفعّل، ورفض رفع الوسائط دون جلسة بالحالة `401`، ولم تعد واجهة الإدارة تعرض إطار reCAPTCHA أو تحدي اختيار الصور.
- انتهت جلسة الإدارة المفتوحة أثناء التحقق وأعادت المستخدم إلى `/admin_login`؛ يلزم تسجيل دخول جديد لإكمال فحص الواجهة بصلاحية المدير، ولا يدل انتهاء الجلسة بذاته على فشل النشر.

### تفعيل إعداد App Check في بناء الإنتاج - 0.3.37 / admin 0.1.41 / client 1.0.5

ما تم إنجازه:

- ربط متغير بناء Cloudflare العام `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` بمفتاح reCAPTCHA Enterprise من نوع Website score-based والمسجل في Firebase App Check.
- ضبط مدة صلاحية رمز App Check في Firebase على ساعة واحدة.
- إعادة بناء ونشر Worker `datetools` بعد وصول متغير البناء إلى حزمة المتصفح.
- استخدام رمز Cloudflare API من الحافظة داخل عملية النشر فقط، دون عرضه أو كتابته في ملف أو المستودع، ثم إزالته من متغيرات العملية والذاكرة.
- إبقاء App Check Enforcement متوقفًا عمدًا إلى أن تظهر طلبات Verified في لوحة Firebase وتستقر النسبة، حمايةً لقراءات Firestore الخادمية الحالية.
- عدم تغيير أرقام نسخ الموقع أو الإدارة أو بوابة المعلنين لأن المهمة إعداد أمني ونشر لنفس الكود، وليست إصدار وظائف جديدًا.

الأخطاء المكتشفة:

1. **متغير App Check موجود في إعدادات البناء دون وصوله إلى النسخة الحية القديمة**
   - الأعراض: المفتاح صحيح في Cloudflare، لكن ملف الحزمة المحدد لم يكن موجودًا على النطاق قبل إعادة النشر.
   - السبب: النسخة الحية كانت تسبق بناء الكومت الذي يعتمد متغير App Check.
   - الحل: نشر OpenNext مباشرة بعد ضبط متغير البناء ثم فحص ملف الحزمة من النطاق العام.
   - الحالة: محلول؛ أعاد الملف الحالة الصحيحة واحتوى مفتاح App Check العام المطابق.

2. **ملف رمز Cloudflare المحلي القديم غير صالح للاعتماد عليه**
   - الأعراض: فشل ترويسة التفويض عند محاولة استخدام الملف المحلي السابق.
   - السبب: الملف لم يكن يحتوي رمز API خامًا صالحًا.
   - الحل: استخدام رمز جديد من الحافظة داخل عملية واحدة فقط، دون حفظه، وإزالته بعد انتهاء النشر.
   - الحالة: تم تجاوز الملف بأمان ونجح النشر؛ لا يعتمد مسار النشر الحالي عليه.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npx opennextjs-cloudflare deploy
curl.exe -sS https://date-tool.com/_next/static/chunks/543.a92f1d383f0001f1.js
git diff --check
```

الحالة:

- نجح نشر Worker `datetools`، ومعرف نسخة Cloudflare الحالية هو `055f5a3f-9eb1-4086-aa9e-ab41067bca7f` ووقت بدء Worker هو 36ms.
- رُفعت ثلاثة أصول جديدة أو معدلة، منها حزمة App Check وملف `BUILD_ID`، دون فشل في البناء أو النشر.
- أكد الفحص المباشر من `date-tool.com` أن حزمة App Check المنشورة متاحة وتحتوي المفتاح العام الصحيح.
- أكد فحص المتصفح الحي أن `/admin_login` يعرض عنوان تسجيل الدخول، والوضع الداكن، ونموذج دخول واحدًا بصورة سليمة.
- الخطوة التالية هي مراقبة Firebase App Check من 15 دقيقة إلى 24 ساعة حتى تظهر طلبات Verified، وعدم تفعيل Enforcement قبل نجاح هذه المراقبة وفحص أثره على قراءات Firestore الخادمية.

### إصلاح اعتماد دور المدير العام عند تعدد حقول الدور - admin 0.1.42

ما تم إنجازه:

- التأكد أن `super_admin` دور كامل الصلاحية ومعتمد أصلًا، وعدم إضافة استثناء خاص أو تجاوز أمني للحساب.
- إضافة محلل مركزي يختار أول دور معروف من `role` ثم `adminRole`، بحيث لا تحجب قيمة قديمة غير معروفة في `role` قيمة `super_admin` الصحيحة في `adminRole`.
- توحيد القرار في تسجيل الدخول وواجهة الإدارة وواجهات API وقواعد Firestore، مع بقاء الحساب غير النشط أو الذي لا يملك أي دور معروف مرفوضًا.
- الحفاظ على أولوية الحقل `role` إذا كان يحتوي دورًا معروفًا، منعًا لترقية حساب مساعد بسبب قيمة متعارضة في حقل قديم.
- إضافة اختبارات لحالة الحقل القديم مع `adminRole: super_admin` وحالات الرفض المغلق.
- رفع إصدار منصة الإدارة فقط إلى `0.1.42` دون تغيير إصدار الموقع العام أو بوابة المعلنين.

الأخطاء المكتشفة:

1. **رفض حساب المدير العام رغم وجود `super_admin`**
   - الأعراض: تسجيل الدخول ينجح عبر Firebase Auth ثم تظهر رسالة أن الدور الإداري غير معتمد.
   - السبب: استخدام `profile.role || profile.adminRole`؛ وجود قيمة قديمة غير فارغة وغير معروفة في `role` كان يمنع فحص `adminRole` الصحيح.
   - الحل: حل الدور من الحقلين وفق قائمة الأدوار المعتمدة نفسها في العميل وAPI والقواعد.
   - الحالة: محلول برمجيًا ومغطى بالاختبارات، ونُشرت قواعد Firestore المحدثة؛ يلزم إعادة نشر التطبيق ثم إعادة تجربة الحساب.

الملفات المتأثرة:

- `app/adminRoles.js`
- `app/securityPolicies.js`
- `app/admin/AdminShell.jsx`
- `app/api/_lib/adminPermissions.js`
- `firestore.rules`
- `tests/securityPolicies.test.js`
- `tests/adminPermissions.test.js`
- `tests/settingsSecurity.test.js`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
npx firebase-tools deploy --only firestore:rules --project date-tool-official
git diff --check
```

الحالة:

- نجحت اختبارات Vitest وعددها 33 اختبارًا في 10 ملفات.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js النهائي وتوليد 31 صفحة بعد السماح بجلب خط Cairo أثناء البناء.
- جُمّعت قواعد Firestore ونُشرت بنجاح إلى `cloud.firestore` في مشروع `date-tool-official`.
- لم تُفعّل App Check Enforcement ضمن هذا التعديل، ولم تُحذف تذكرة Turnstile التجريبية قبل استعادة دخول المدير.

### إصلاح سباق جاهزية Turnstile في دخول الإدارة - admin 0.1.43

ما تم إنجازه:

- منع إرسال نموذج دخول الإدارة قبل اكتمال توليد رمز Turnstile صالح.
- إبقاء التحقق الخادمي إلزاميًا وفاشلًا بصورة مغلقة في الإنتاج دون أي تجاوز للحماية.
- تفعيل التجديد التلقائي عند انتهاء الرمز أو انتهاء مهلة التحدي، وإعادة المحاولة التلقائية عند خطأ الشبكة.
- تصنيف ردود Siteverify الآمنة إلى رمز منتهي أو مكرر، وتعطل مؤقت، وخطأ إعداد، ورفض عادي بدل جمعها تحت رسالة واحدة.
- تمرير سبب الرفض التشغيلي الآمن إلى واجهة الدخول دون كشف الرمز أو المفتاح السري أو رد Cloudflare الخام.
- إضافة اختبارين لتأكيد قبول التحقق الناجح والحفاظ على سبب انتهاء الرمز في مسار الاسترداد.
- رفع إصدار منصة الإدارة فقط إلى `0.1.43` دون تغيير إصدار الموقع العام أو بوابة المعلنين.

الأخطاء المكتشفة:

1. **إرسال تسجيل الدخول قبل جاهزية رمز Turnstile أو بعد استهلاكه**
   - الأعراض: ظهور رسالة `تعذر إكمال التحقق الأمني` رغم تحميل أداة Turnstile داخل الصفحة.
   - السبب: زر الدخول كان متاحًا قبل وصول الرمز إلى حالة React، ولم يكن يميز الرمز المنتهي أو المستخدم سابقًا.
   - الحل: ربط إتاحة الزر بحالة جاهزية فعلية، وتجديد الرمز تلقائيًا، وتصنيف رد Siteverify بأسباب آمنة.
   - الحالة: محلول ومنشور؛ اجتاز التحقق الحي، وتبقى تجربة بيانات المدير الفعلية من صاحب الحساب.

2. **احتمال عدم تطابق مفاتيح Turnstile**
   - الأعراض: كان من المحتمل أن يكون الرفض ناتجًا عن اختلاف Site key وSecret key.
   - السبب: الرسالة السابقة لم تكن تحفظ سبب Siteverify الآمن.
   - الحل: تنفيذ اختبار حي برمز مولد من الصفحة وبيانات دخول وهمية؛ اجتاز Turnstile ووصل إلى رفض Firebase لبيانات الدخول.
   - الحالة: مستبعد؛ مفاتيح Turnstile الحية متطابقة ويعمل التحقق الخادمي.

الملفات المتأثرة:

- `app/admin_login/page.jsx`
- `app/components/TurnstileField.jsx`
- `app/turnstileClient.js`
- `app/turnstileServer.js`
- `app/version.js`
- `tests/turnstileClient.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
npm run preview
git diff --check
git push origin master
```

الحالة:

- نجحت اختبارات Vitest وعددها 35 اختبارًا في 11 ملفًا.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js النهائي وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` المتوقعة من قيود الشبكة المحلية وأكملت آليات fallback البناء.
- نجح OpenNext for Cloudflare في توليد الحزمة وتشغيل المعاينة المحلية، وأعادت صفحة `/admin_login` استجابة `200` من Wrangler.
- أكد اختبار حي على `date-tool.com/admin_login` أن رمز Turnstile الحالي مقبول خادميًا؛ وصلت محاولة وهمية إلى Firebase ثم رُفضت كبيانات دخول غير صحيحة.
- أكد فحص الإصدار المنشور أن زر الدخول يبقى معطلًا أثناء تجهيز الحماية، ثم يتفعّل بعد نجاح Turnstile، ويعود جاهزًا بعد تجديد الرمز المستهلك.
- نُشر الإصلاح في الكومت `5f3c81a` إلى `origin/master`، وتأكد وصول حزمة الواجهة الجديدة إلى الإنتاج.
- لم تُغيّر إعدادات App Check أو قواعد Firestore أو صلاحيات الأدوار في هذا الإصلاح.
- بعد نجاح دخول المدير بالإصدار المنشور يجب حذف التذكرة التجريبية `DT-MSXH2BYT-7D2577F9` من إدارة التذاكر.

### استعادة دور المدير العام في بيانات Firestore - دون تغيير إصدار

ما تم إنجازه:

- تتبع رسالة `الدور الإداري لهذا الحساب غير معتمد` عبر مسار الدخول من Firebase Auth حتى تقييم وثيقة `admins/{uid}`.
- التأكد من أن الكود المحلي وحزمة الإنتاج يعتمدان دور `super_admin` صراحة ويفحصان الحقلين `role` و`adminRole` دون استثناء قائم على البريد.
- تشغيل اختبارات سياسات الصلاحيات والتأكد من نجاح 17 اختبارًا مرتبطًا بأدوار الإدارة والإعدادات الأمنية.
- تحديد السبب الحي: وثيقة حساب المدير كانت تفتقد حقل `adminRole`، ثم أضافه مالك الموقع بنوع String وقيمة `super_admin`.
- عدم تخفيف Turnstile أو App Check أو قواعد Firestore، وعدم تغيير أي رقم نسخة لأن المعالجة تخص بيانات الحساب في Firestore فقط.

الأخطاء المكتشفة:

1. **عودة رفض دور المدير بعد اكتمال تسجيل الدخول**
   - الأعراض: نجاح المصادقة ثم ظهور رسالة أن الدور الإداري غير معتمد.
   - السبب: غياب `adminRole` من وثيقة المدير الحية، فلم يجد مقيّم الصلاحيات دورًا كاملًا معتمدًا في بيانات الحساب.
   - الحل: إضافة `adminRole` بنوع String وقيمة `super_admin` إلى وثيقة `admins/{uid}` المطابقة لحساب Firebase Authentication.
   - الحالة: عولجت بيانات الحساب؛ يلزم تأكيد الدخول الفعلي ثم حذف تذكرة Turnstile التجريبية.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run tests/securityPolicies.test.js tests/adminPermissions.test.js tests/settingsSecurity.test.js
```

الحالة:

- نجحت 17 حالة اختبار في 3 ملفات.
- لا يلزم نشر أو تعديل كود لهذه المعالجة.
- بعد تأكيد نجاح دخول المدير يجب حذف التذكرة التجريبية `DT-MSXH2BYT-7D2577F9` من إدارة التذاكر.

### إصلاح تنفيذ حذف التذاكر وتوسيط نافذة التأكيد - admin 0.1.44

ما تم إنجازه:

- تتبع زر حذف التذكرة من صف الجدول إلى معترض الحذف العام ثم طلب `DELETE /api/admin/support`.
- اكتشاف أن معترض الحذف العام كان يعترض زر «حذف» داخل نافذة التأكيد نفسها بسبب احتوائه أيقونة سلة المهملات، فيمنع تشغيل `confirmDelete`.
- استثناء أزرار نافذة التأكيد نفسها من الاعتراض، مع إبقاء اعتراض زر الحذف الأصلي وإعادة تشغيله مرة واحدة بعد الموافقة.
- توسيط زري الحذف والإلغاء بعرض متوازن، مع رجوعهما إلى أعمدة مرنة على الشاشات الأضيق من `420px`.
- إضافة اختبار رجوع يمنع عودة اعتراض زر التأكيد ويتحقق من محاذاة الإجراءات.
- رفع إصدار منصة الإدارة فقط إلى `0.1.44` دون تغيير إصدار الموقع العام أو بوابة المعلنين.

الأخطاء المكتشفة:

1. **زر حذف التذكرة لا ينفذ بعد فتح نافذة التأكيد**
   - الأعراض: تظهر نافذة التأكيد، لكن الضغط على زر «حذف» لا يرسل طلب الحذف ولا يغلق النافذة.
   - السبب: مستمع الحذف العام يعمل في مرحلة الالتقاط ويصنف زر التأكيد الداخلي نفسه كزر حذف جديد، فيوقف الحدث قبل وصوله إلى معالج React.
   - الحل: تجاهل أي زر يوجد داخل `.admin-delete-confirm` في المستمع العام، ثم السماح لمسار الموافقة بإعادة تشغيل زر الصف الأصلي المحفوظ.
   - الحالة: محلول برمجيًا ومغطى بالاختبار؛ يلزم نشر نسخة الإدارة ثم تجربة حذف التذكرة الحية.

الملفات المتأثرة:

- `app/admin/AdminShell.jsx`
- `app/admin/AdminDashboard.css`
- `tests/adminDeleteConfirmation.test.js`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run tests/adminDeleteConfirmation.test.js tests/adminNoReload.test.js
npm run lint
npm test
npm run build
git diff --check
```

الحالة:

- نجح الاختبار المخصص مع اختبارات عدم إعادة تحميل الإدارة: 5 اختبارات في ملفين.
- نجحت الحزمة الكاملة: 37 اختبارًا في 12 ملفًا.
- نجح ESLint دون أخطاء أو تحذيرات.
- نجح بناء Next.js النهائي وتوليد 31 صفحة؛ ظهرت رسائل `fetch EACCES` المتوقعة من قيود الشبكة المحلية وأكملت آليات fallback البناء.
- لم يُنشر هذا الإصلاح بعد، ولم تُحذف التذكرة التجريبية الحية قبل نشره وتجربة الزر.

### تدقيق مفاتيح الربط والمنصات الخارجية - دون تغيير إصدار

ما تم إنجازه:

- تنفيذ جرد أمني للربط المحلي والحي عبر Cloudflare وGoogle Cloud وFirebase وGitHub، مع فحص أسماء متغيرات Worker والمفاتيح المقيدة وحساب الخدمة وتكامل البناء دون عرض أو نسخ القيم السرية.
- فحص المستودع والتأكد من عدم تتبع ملفات أسرار أو مفاتيح حساب خدمة أو رموز GitHub، وأن ملف التطوير المحلي لا يحتوي أسرار إنتاج.
- التأكد من أن Worker يعتمد متغيرات Firebase وPageSpeed وTurnstile المعروفة فقط، ولا توجد داخله نسخ مكررة من صيغ اعتماد حساب الخدمة القديمة أو البديلة.
- التأكد من أن ربط R2 يتم عبر Worker Binding ولا يحتاج مفتاح R2 مستقل داخل التطبيق.
- التأكد من خلو GitHub من Actions Secrets وDeploy Keys وWebhooks، وأن GitHub App الخاص بـCloudflare هو الربط الوحيد الضروري للبناء التلقائي.
- التأكد من إلغاء رمز Turnstile المؤقت السابق واختفاء ملفه المحلي، مع بقاء رمز بناء Cloudflare المستخدم فعليًا في تكامل النشر.
- التأكد من أن Rate Limiting مفعّل مسبقًا بقاعدة `Protect public forms from bursts` على مساري `/api/support` و`/api/security/turnstile`؛ لا حاجة إلى قاعدة مكررة.

الأخطاء المكتشفة:

1. **مفتاح reCAPTCHA قديم غير مستخدم**
   - الأعراض: مفتاح Website Checkbox قديم باسم `date-tool` يظهر بحالة `No activity`، بينما App Check يستخدم مفتاح Website Invisible/Score-based الحالي باسم `date-tool.com` وحالته `Protected`.
   - السبب: بقاء إعداد قديم من تجربة سابقة بعد الانتقال إلى مفتاح App Check الحالي.
   - الحل: حذف المفتاح القديم فقط بعد موافقة صريحة وقت الحذف، مع إبقاء المفتاح الحالي دون تغيير.
   - الحالة: حذفه مالك الموقع من Google Cloud في 2026-08-25 بعد التأكد من عدم وجود نشاط عليه.

2. **رمز Cloudflare إضافي غير مرتبط بالبناء الحالي**
   - الأعراض: وجود رمز باسم `Edit Cloudflare Workers` إلى جانب `datetools build token`، بينما إعداد البناء الحي يختار رمز البناء الأخير فقط.
   - السبب: الرمز الإضافي يُرجح أنه أُنشئ للنشر أو التعديل اليدوي السابق.
   - الحل: التأكد أولًا من عدم الاعتماد عليه في نشر CLI يدوي، ثم إلغاؤه بموافقة صريحة. لا يُلغى `datetools build token` قبل إنشاء بديل أقل صلاحيات واختبار بناء كامل.
   - الحالة: فحص المستودع ومتغيرات العملية وملفات اعتماد Wrangler المحلية أثبت عدم تخزين الرمز أو استخدامه محليًا، كما أن بناء Cloudflare يختار `datetools build token` صراحة. أظهر Cloudflare أن آخر استخدام للرمز الإضافي كان في 2026-08-24، مقابل 2026-08-25 لرمز البناء الفعلي، ثم حُذف `Edit Cloudflare Workers` نهائيًا في 2026-08-26 بعد موافقة صريحة والتحقق من بقاء رمز البناء.

3. **رمز البناء الحالي أوسع صلاحية من الحاجة الظاهرة**
   - الأعراض: `datetools build token` مستخدم فعليًا لكنه يملك مجموعة صلاحيات واسعة.
   - السبب: إنشاؤه بصلاحيات عامة لتكامل البناء بدل مبدأ أقل صلاحية.
   - الحل: إنشاء رمز بديل محدود للبناء والنشر على حساب ومشروع `datetools` فقط، اختباره في بناء إنتاج واحد، ثم إلغاء الرمز الحالي.
   - الحالة: تحسين أمني متبقٍ ومسجل كتذكير دائم للمراجعة الأمنية التالية؛ لا يجوز إلغاء الرمز الحالي مباشرة لأنه سيوقف البناء التلقائي.

4. **مفتاح Firebase Web مقيد لكنه يسمح بعدد واسع من واجهات API**
   - الأعراض: مفتاح المتصفح مقيد بالمراجع المسموحة، لكنه يسمح بمجموعة Firebase APIs أوسع من الحد الأدنى المتوقع.
   - السبب: الإعداد التلقائي الافتراضي لمفتاح Firebase Web.
   - الحل: تقليص APIs تدريجيًا بعد حصر الاستدعاءات واختبار تسجيل الدخول وFirestore وApp Check وInstallations، دون حذف المفتاح أو معاملته كسر خادمي.
   - الحالة: تقوية لاحقة، وليست مفتاحًا غير مستخدم.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
git status --short
rg --hidden --glob "!.git/**" --glob "!node_modules/**" "(token|secret|api[_-]?key|private[_-]?key|measurementId|gtm|clarity|pixel|indexnow)"
git ls-files
```

الحالة:

- لا توجد قيمة سرية معروضة أو محفوظة في المذكرة، ولم يُحذف أي مفتاح سحابي دون موافقة وقت التنفيذ.
- المفاتيح الضرورية حاليًا: مفتاح App Check الحالي، Firebase Web API المقيد، مفتاح PageSpeed المقيد، مفتاح حساب خدمة Firebase الوحيد، أسرار Turnstile، ورمز بناء Cloudflare.
- حُذف مفتاح reCAPTCHA Checkbox القديم، وحُذف رمز `Edit Cloudflare Workers` غير المرتبط بالبناء بعد مراجعة آخر استخدام والموافقة الصريحة. بقي `datetools build token` فعالًا لأنه رمز البناء الحالي.
- المعرّفات العامة مثل GA4 وGTM وAdSense وClarity وMeta Pixel وIndexNow ليست أسرار وصول؛ تُزال فقط عند إيقاف التكامل نفسه، لا كإجراء طوارئ أمني.
- لا يلزم بناء أو نشر لأن هذه المهمة جرد وتوثيق فقط، ولم تتغير أرقام الموقع أو الإدارة أو بوابة المعلنين.

### تشخيص تحدي الصور المتكرر في Firebase App Check - دون تغيير إصدار

ما تم إنجازه:

- فحص صفحة الإدارة الحية وتحديد أصل إطار التحقق بدل الاستدلال من الشكل فقط.
- التأكد من أن نافذة الصور تأتي من `google.com/recaptcha/enterprise` وأن المفتاح الحي يعمل بوضع `invisible` التفاعلي، وليست النافذة صادرة من Cloudflare Turnstile.
- مراجعة كود الموقع والتأكد من أن Turnstile منفصل عن App Check ومضبوط على Managed مع `interaction-only`؛ لذلك لا يعرض ألغاز صور، وقد يظهر مربع اختيار فقط عند ارتفاع الاشتباه.
- مراجعة توثيق Firebase الرسمي الذي يشترط لـApp Check مفتاح reCAPTCHA Enterprise من نوع Website score-based ويؤكد أنه لا يطلب من المستخدم حل تحديات.

الأخطاء المكتشفة:

1. **مفتاح App Check الحي من النوع التفاعلي غير المناسب**
   - الأعراض: ظهور تحدي اختيار صور بصورة متكررة أثناء التنقل داخل منصة الإدارة.
   - السبب: متغير `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` يشير إلى مفتاح reCAPTCHA Enterprise بوضع Invisible التفاعلي، وليس مفتاح Website score-based الصامت المطلوب من Firebase App Check.
   - الحل: إنشاء مفتاح Website score-based جديد مع النطاقات المعتمدة، تسجيله في Firebase App Check، تحديث متغير بناء Cloudflare، إعادة البناء والنشر، ثم مراقبة Verified قبل حذف المفتاح التفاعلي الحالي.
   - الحالة: مشخص حيًا؛ يحتاج إعدادًا خارجيًا جديدًا ولا يحتاج تعديل كود لأن `ReCaptchaEnterpriseProvider` ومتغير البناء موجودان بالفعل.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
rg -n --hidden --glob "!node_modules/**" --glob "!.git/**" "ReCaptcha|AppCheck|Turnstile|TURNSTILE|CLOUDFLARE_API_TOKEN"
Get-ChildItem Env:
Test-Path "$HOME/.wrangler/config/default.toml"
```

الحالة:

- لا يوصى باستبدال App Check بـTurnstile؛ الأول يحمي طلبات Firebase والثاني يحمي النماذج الحساسة، وهما طبقتان مختلفتان.
- الحل الأقل إزعاجًا هو App Check بمفتاح score-based صامت مع إبقاء Turnstile Managed للنماذج.
- لم يتغير أي كود أو رقم نسخة ولم يتم إنشاء مفتاح أو تعديل إعداد سحابي ضمن هذا التشخيص.

### إنشاء مفتاح App Check صامت بنظام Score-based - دون تغيير إصدار

ما تم إنجازه:

- إنشاء مفتاح reCAPTCHA Enterprise جديد باسم `date-tool-app-check-score` داخل مشروع Google Cloud `date-tool-official`.
- ضبط المفتاح كتطبيق Website مع النطاقات `date-tool.com` و`www.date-tool.com` و`localhost` و`127.0.0.1`.
- تعطيل التحديات المرئية ووضع الاختبار وWAF، والتأكد من أن تكامل المفتاح يستخدم التقييم الصامت `Score-based`.
- تسجيل المفتاح الجديد في Firebase App Check كمزوّد `reCAPTCHA Enterprise` مع مدة رمز `TTL` مقدارها ساعة واحدة.
- تحديث متغير بناء Cloudflare `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` دون عرض قيمته أو حفظها في المستودع.
- إعادة بناء آخر نسخة مستقرة من فرع `master` ونشرها عبر Cloudflare Build `32f01390` باستخدام متغير البناء الجديد.
- فحص الصفحة الرئيسية بعد النشر والتأكد من تحميلها دون `Application error` أو `Internal Server Error`.
- إعادة تحميل `/admin/support` بعد النشر والتأكد من وصول جلسة المدير إلى صفحة إدارة التذاكر دون خطأ تحقق أمني أو رفض للدور الإداري.
- فتح مؤشرات Firebase App Check بعد النشر والتأكد من بدء ظهور طلبات موثقة: `Authentication` بنسبة 93% و`Cloud Firestore` بنسبة 4% وقت الفحص، والحالتان ما زالتا `Monitoring`.
- إبقاء المفتاح التفاعلي القديم دون حذف مؤقتًا حتى تستقر نسب الطلبات الموثقة ويُتأكد من عدم وجود مسار إنتاج يعتمد عليه.
- فحص آخر استخدام لرمز Cloudflare `Edit Cloudflare Workers` بعد تسجيل الدخول؛ كان آخر استخدام له في 2026-08-24، بينما استُخدم `datetools build token` في 2026-08-25.
- حذف رمز `Edit Cloudflare Workers` نهائيًا بعد موافقة صريحة، والتحقق من اختفائه من الجدول وبقاء `datetools build token` فعالًا.

الأخطاء المكتشفة:

1. **المفتاح الجديد لم يكن مرتبطًا بالإنتاج**
   - الأعراض: كان المفتاح موجودًا وصحيحًا في Google Cloud بينما استمر الموقع في استخدام مفتاح App Check التفاعلي السابق.
   - السبب: لم يكن Site key الجديد مسجلًا في Firebase App Check ولا مضمّنًا في متغير بناء Cloudflare.
   - الحل: تسجيل المفتاح في Firebase، تحديث متغير البناء، ثم إعادة بناء ونشر فرع `master` وفحص النسخة الحية.
   - الحالة: عولج الربط والنشر؛ المتبقي مراقبة نسب `Verified` قبل فرض Enforcement أو حذف المفتاح القديم.

الملفات المتأثرة:

- `PROJECT_MEMO.md` فقط.

الأوامر المستخدمة:

```powershell
Get-Content -LiteralPath PROJECT_MEMO.md -Tail 180
git status --short
rg -n -C 8 "إنشاء مفتاح App Check صامت|App Check|Score-based|المتبقي" PROJECT_MEMO.md
```

الحالة:

- لم تُعرض أو تُحفظ قيمة Site key الجديدة في المستودع أو المذكرة.
- لم يتغير كود الموقع أو أي رقم نسخة.
- نجح حفظ متغير البناء، واكتمل Cloudflare Build `32f01390` من فرع `master`، وعملت الصفحة الرئيسية وصفحة إدارة التذاكر بعد النشر دون خطأ ظاهر.
- App Check ما زال في وضع `Monitoring` ولم يُفعّل Enforcement عمدًا لحماية مسارات Firestore الحالية من التوقف المفاجئ.
- الخطوة التالية: مراقبة نسب `Verified` عدة أيام، وتحديد مصادر طلبات Firestore غير الموثقة قبل أي فرض، ثم حذف المفتاح التفاعلي القديم بعد التأكد من عدم الحاجة إليه.

### تقوية الإسقاط العام واختبارات Turnstile النهائية - دون تغيير إصدار

ما تم إنجازه:

- تشديد إسقاط إعدادات الموقع العامة بحيث لا يعيد `internalPages` كامل كائن الصفحة عند طلب المحتوى، بل يعيد الحقول العامة المسموحة فقط مع `content` عند طلبه صراحة.
- منع تسرب الحقول الإدارية أو الملاحظات الداخلية أو أسرار التكاملات من الإسقاط العام حتى لو أضيفت مستقبلًا داخل كائنات الصفحات.
- فصل منطق تحقق Turnstile الخادمي إلى وحدة مستقلة قابلة للاختبار، مع إبقاء قراءة أسرار Cloudflare داخل الملف الخادمي فقط.
- تغطية تحقق Turnstile لحالات النجاح، وعدم تطابق المضيف أو الإجراء، والرمز المنتهي أو المكرر، وتعذر Siteverify، وغياب الإعدادات خارج التطوير المحلي.
- تثبيت سلوك الفشل المغلق في الإنتاج عند تعذر خدمة التحقق، مع السماح بالتطوير المحلي فقط عند غياب المفاتيح.
- تشغيل الاختبارات الكاملة وESLint وبناء Next.js الإنتاجي للتأكد من عدم كسر صفحات الموقع أو الإدارة أو بوابة المعلنين.
- مراجعة CSP والتأكد من بقائه بصيغة `Content-Security-Policy-Report-Only` مع حد أقصى 16KB لتقارير الانتهاك وتنظيف query/hash قبل التسجيل.

الأخطاء المكتشفة:

1. **إسقاط محتوى الصفحات كان يعيد الكائن الأصلي عند طلب المحتوى**
   - الأعراض: أي حقل داخلي جديد داخل عناصر `internalPages` كان يمكن أن يظهر ضمن استجابة الإعدادات العامة عند تفعيل `includeContent`.
   - السبب: إرجاع مصفوفة الصفحات الأصلية مباشرة بدل إعادة بنائها من قائمة سماح ثابتة.
   - الحل: تطبيق قائمة سماح في الحالتين، وإضافة `content` فقط عند الطلب الصريح.
   - الحالة: محلول ومغطى باختبارات رجوع.

2. **منطق Turnstile الحساس لم يكن قابلًا للاختبار دون بيئة Cloudflare**
   - الأعراض: صعوبة اختبار حالات Siteverify والفشل المغلق محليًا لأن قراءة البيئة والتحقق الخارجي كانا في ملف واحد يعتمد `server-only`.
   - السبب: اقتران جلب أسرار Worker بمنطق التحقق والتصنيف.
   - الحل: فصل النواة الخالصة في `app/turnstileVerification.js` والإبقاء على موصل البيئة في `app/turnstileServer.js`.
   - الحالة: محلول؛ نجحت ست حالات Turnstile آلية.

3. **CSP ما زال واسعًا وغير جاهز للفرض**
   - الأعراض: السياسة الحالية تسمح مؤقتًا بـ`unsafe-inline` و`unsafe-eval` وتعمل بوضع Report-Only.
   - السبب: الحاجة إلى مراقبة استخدام Firebase وTurnstile وAdSense والتكاملات الخارجية قبل التضييق، منعًا لكسر الإنتاج.
   - الحل: إبقاء السياسة للمراقبة، ثم تحليل سجلات `csp_report_only` في Cloudflare قبل إزالة المصادر أو تحويلها إلى سياسة ملزمة.
   - الحالة: مفتوح للمراقبة؛ لا يجوز فرض CSP قبل اكتمال تحليل السجلات.

4. **Firebase Web API Key ما زال يسمح بواجهات أكثر من حاجة العميل**
   - الأعراض: المفتاح مقيد بالمراجع الصحيحة، لكن قائمة API المسموحة أوسع من الخدمات المستخدمة في الواجهة.
   - السبب: القيود الافتراضية الواسعة التي أنشأتها Firebase.
   - الحل: تقليص القائمة تدريجيًا إلى واجهات Firebase اللازمة وفق الاستخدام الفعلي، ثم اختبار Authentication وApp Check وFirestore وStorage قبل إلغاء القيود القديمة نهائيًا.
   - الحالة: متبقٍ خارجيًا؛ لم يُحفظ تغيير سحابي غير مختبر ضمن هذه الجولة.

5. **رمز بناء Cloudflare الحالي واسع الصلاحيات**
   - الأعراض: `datetools build token` مستخدم للبناء التلقائي لكنه أوسع من مبدأ أقل صلاحية.
   - السبب: إنشاؤه سابقًا بصلاحيات عامة لتفادي تعطل النشر.
   - الحل: إنشاء بديل محصور بالحساب وWorker `datetools` وموارد البناء اللازمة، تشغيل بناء إنتاج كامل به، ثم إلغاء الرمز القديم فقط بعد نجاح الاختبار.
   - الحالة: متبقٍ خارجيًا؛ لا يُلغى الرمز الحالي قبل نجاح البديل.

الملفات المتأثرة:

- `app/publicSiteConfig.js`
- `app/turnstileServer.js`
- `app/turnstileVerification.js`
- `tests/publicSiteConfig.test.js`
- `tests/turnstileServer.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test
npm run lint
npm run build
git status --short
git diff --stat
```

الحالة:

- نجحت الحزمة الكاملة: 45 اختبارًا في 13 ملفًا.
- نجح ESLint دون أخطاء.
- نجح بناء Next.js الإنتاجي وتوليد 31 صفحة. ظهرت مهلات مؤقتة عند جلب بيانات خارجية أثناء التوليد، وعالجتها آليات fallback وأكمل البناء بالحالة `0`.
- App Check يبقى في `Monitoring`؛ لا يُفعّل Enforcement قبل استقرار النسب وفهم طلبات Firestore غير الموثقة.
- لم يتغير رقم نسخة الموقع أو الإدارة أو بوابة المعلنين، ولم يتم نشر هذه التغييرات بعد.

### قياس App Check وخطة تقليص مفاتيح الإنتاج - دون تغيير إصدار

ما تم إنجازه:

- قراءة مقاييس Firebase App Check الحية لآخر 7 أيام بعد الانتقال إلى مفتاح reCAPTCHA Enterprise بنظام Score-based.
- التأكد من أن Authentication يسجل 58 طلبًا موثقًا من أصل 62، بنسبة 94%، مع طلب قديم واحد و3 طلبات من مصادر غير معروفة.
- التأكد من أن Cloud Firestore يسجل 491 طلبًا موثقًا فقط من نحو 12 ألف طلب، بينما 96% من الطلبات مصنفة كمصادر غير معروفة.
- ربط انخفاض نسبة Firestore بالقراءات الخادمية الحالية عبر Firestore REST التي لا تحمل رمز App Check للعميل، ولذلك إبقاء Firestore وAuthentication في وضع `Monitoring` دون فرض.
- حصر واجهات Google المطلوبة لمفتاح Firebase Web وفق الاستخدام الفعلي في المشروع وتوثيق Firebase الرسمي: Firebase Management، Cloud Logging، Firebase App Check، Identity Toolkit، Token Service، Firebase Rules، Cloud Datastore، وCloud Firestore.
- حصر الصلاحيات الدنيا المقترحة لرمز بناء Cloudflare وفق إعداد Workers Builds الحالي: Account Settings Read، Workers Scripts Edit، Workers KV Storage Edit، Workers R2 Storage Edit، Zone Workers Routes Edit، User Details Read، وMemberships Read.

الأخطاء المكتشفة:

1. **فرض App Check على Firestore سيعطل طلبات إنتاج حالية**
   - الأعراض: 96% من طلبات Firestore في آخر 7 أيام غير موثقة ومصنفة كمصادر غير معروفة.
   - السبب: وجود قراءات خادمية وREST عامة لا تمر عبر Firebase Client SDK ولا ترسل App Check token.
   - الحل: عدم فرض Firestore حاليًا، ثم حصر هذه القراءات وتحويل المسارات المناسبة إلى وسيط خادمي محمي أو إضافة تحقق App Check حيث ينطبق قبل إعادة القياس.
   - الحالة: قرار الحماية مثبت؛ Firestore يبقى `Monitoring` حتى ترتفع النسبة الموثقة دون كسر SSR أو الإعدادات العامة.

2. **مفتاح Firebase Web يسمح بخدمات غير مستخدمة**
   - الأعراض: قائمة المفتاح الحالية تضم 25 واجهة، منها Storage وFCM وAI Logic وRemote Config وخدمات لا يستخدمها العميل.
   - السبب: القيود التلقائية الواسعة لمفتاح Firebase Web القديم.
   - الحل: تقليصه إلى الواجهات الثماني المحصورة، ثم اختبار الدخول والتسجيل وقراءة وكتابة Firestore والإدارة، مع التراجع الفوري عند ظهور `API_KEY_SERVICE_BLOCKED` أو 403.
   - الحالة: محلول في 2026-08-27؛ حُفظت قائمة الواجهات الثماني فقط بعد موافقة صريحة، ونجحت اختبارات الموقع وتسجيل الإدارة وقراءة وكتابة Firestore دون 403 أو `API_KEY_SERVICE_BLOCKED`.

3. **رمز بناء Cloudflare الحالي يتجاوز أقل صلاحية**
   - الأعراض: `datetools build token` يملك 24 صلاحية تشمل خدمات لا يستخدمها البناء.
   - السبب: إنشاء الرمز السابق بصلاحيات حساب واسعة لضمان نجاح أول ربط للبناء.
   - الحل: إنشاء رمز بديل بالصلاحيات السبع المحصورة، ربطه بـWorkers Builds، تشغيل بناء إنتاج كامل، ثم إلغاء الرمز القديم فقط بعد نجاح البناء وفحص الموقع والإدارة.
   - الحالة: جاهز للتنفيذ الخارجي بعد موافقة صريحة؛ الرمز القديم يبقى فعالًا إلى أن ينجح البديل.

4. **سجلات CSP الكاملة غير متاحة في الخطة الحالية**
   - الأعراض: Cloudflare Log Explorer يطلب ترقية مدفوعة ولا توجد بيانات كافية للحكم على جميع انتهاكات CSP.
   - السبب: قيود خطة Cloudflare الحالية، مع بقاء السياسة بصيغة Report-Only.
   - الحل: إبقاء `Content-Security-Policy-Report-Only` وعدم فرضها، ومراجعة السجلات المتاحة أو إضافة وجهة تقارير آمنة محدودة لاحقًا قبل التضييق.
   - الحالة: مراقبة فقط؛ لا تغيير إلزامي الآن.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الحالة:

- Authentication قريب من الجاهزية للفرض، لكن يظل `Monitoring` حتى استكمال اختبار الأجهزة القديمة وتفسير الطلبات الستة غير الموثقة.
- Firestore غير جاهز للفرض إطلاقًا بالنسبة الحالية؛ الأولوية هي إصلاح مسارات REST الخادمية قبل إعادة التقييم.
- لا توجد أسرار أو قيم مفاتيح في المذكرة، ولم يُلغ أي رمز إنتاج أو يُحفظ أي قيد سحابي ضمن هذه الخطوة.

نتيجة تطبيق قيود Firebase Web API Key:

- الواجهات المحفوظة: Cloud Datastore API، Cloud Firestore API، Cloud Logging API، Firebase App Check API، Firebase Management API، Firebase Rules API، Identity Toolkit API، وToken Service API.
- بقيت قيود مواقع الويب كما هي للنطاق الرئيسي و`www` وWorker وFirebase Hosting والتطوير المحلي.
- نجحت الصفحة الرئيسية في تحميل المحتوى والبيانات العامة بعد الحفظ.
- نجحت جلسة المدير في فتح `/admin` وإعادة إحصاءات Firestore دون أخطاء صلاحيات.
- نجح اختبار كتابة غير مؤثر بحفظ إعدادات الأداة الحالية دون تغيير قيمها، واكتملت العملية دون منع API أو خطأ Firestore.
- لا حاجة إلى التراجع للقائمة السابقة ذات 25 واجهة، مع استمرار مراقبة السجلات لأي جهاز أو مسار قديم خلال الأيام التالية.

### تقليص رمز بناء Cloudflare وربطه - دون تغيير إصدار

ما تم إنجازه:

- إنشاء وربط الرمز `datetools build token limited active` في إعداد Workers Builds لخدمة `datetools`.
- تقليص الرمز إلى سبع صلاحيات فقط: Account Settings Read، Workers Scripts Edit، Workers KV Storage Edit، Workers R2 Storage Edit، Workers Routes Edit، User Details Read، وMemberships Read.
- تقييد النطاق إلى حساب Cloudflare الحالي ومنطقة `date-tool.com` بدل جميع المناطق.
- تشغيل محاولة بناء إنتاج بالرمز المحدود من الفرع `master` والالتزام `99db92b`.
- التأكد بعد إلغاء المحاولة من استمرار الصفحة الرئيسية وصفحة الإدارة في الاستجابة بالحالة `200`، وعدم تأثر النسخة الحية.

الأخطاء المكتشفة:

1. **توقف محاولة البناء المحدود في مرحلة التهيئة**
   - الأعراض: البناء `7fa985a3-e7da-4b1d-9dc4-4e620823c48c` بقي في `Initializing` لأكثر من تسع دقائق دون الانتقال إلى الاستنساخ أو إظهار خطأ صلاحيات صريح.
   - السبب: لم يعرض Cloudflare سببًا حاسمًا؛ التوقف حدث قبل مراحل البناء والنشر، لذلك لا يثبت نقص الصلاحيات السبع.
   - الحل: أُلغيت المحاولة العالقة، ويعاد تشغيلها يدويًا من لوحة Cloudflare. لا يُلغى أي رمز سابق قبل نجاح بناء ونشر كامل وفحص الموقع والإدارة.
   - الحالة: محلول في 2026-08-28؛ نجحت إعادة المحاولة اليدوية بالبناء `4fc3cf7b-19a1-4457-a1cb-87e793021c89` خلال دقيقتين و22 ثانية، واكتملت مراحل التهيئة والاستنساخ والتثبيت والبناء والنشر جميعًا باللون الأخضر.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الحالة:

- إعداد Workers Builds يشير إلى الرمز المحدود الجديد، وقد ثبت نجاحه في بناء ونشر إنتاج كامل من الفرع `master` والالتزام `99db92b`.
- انتهت الحاجة الفنية إلى الرمز القديم واسع الصلاحيات `datetools build token` والرمز اليدوي غير المرتبط `datetools build token limited`، وحذفهما مالك الموقع من Cloudflare بعد نجاح البناء المحدود.
- الصفحة الرئيسية متاحة بعد النشر، ولم يظهر خطأ بناء أو نشر مرتبط بالصلاحيات السبع.
- لم تُعرض أو تُحفظ أي قيمة سرية في المستودع أو المذكرة، ولم يتغير كود التطبيق أو رقم الإصدار في هذه الخطوة.
- تؤكد مراجعة قائمة User API Tokens في 2026-08-28 بقاء رمز واحد فقط باسم `datetools build token limited active` بصلاحياته السبع ونطاق حساب واحد ومنطقة واحدة؛ مهمة تقليص رمز البناء مغلقة بالكامل.

### مراجعة البنود الأمنية غير المرتبطة بفترة المراقبة - دون تغيير إصدار

ما تم إنجازه:

- مراجعة جميع مسارات API وتصنيف حدود الحماية بين العام، والمستخدم الموثق، والمعلن، والمساعد، والمدير الكامل.
- التأكد من أن واجهات الإدارة الحساسة تتحقق من Firebase ID Token ومن صلاحية القسم، وأن التنظيف الإداري محصور بالمدير الكامل.
- التأكد من أن مرفقات تذاكر الدعم لا تدخل ضمن فئات الوسائط العامة، وأن تنزيلها يمر عبر مسار إدارة موثق ويستخدم `private, no-store`.
- التأكد من أن رفع R2 يتحقق من الدور والفئة والحجم ونوع MIME والتوقيع الثنائي الحقيقي، ويولد اسمًا عشوائيًا بدل الثقة باسم العميل.
- مراجعة قواعد Firestore والتأكد من وجود منع افتراضي، ومنع القراءة العامة للإدارة والإحصاءات والتذاكر، وفصل صلاحيات المدير والمساعد والمعلن.
- مراجعة رؤوس الحماية: HSTS وDENY framing وnosniff وReferrer-Policy وPermissions-Policy وnoindex للمسارات الداخلية، مع إبقاء CSP في Report-Only عمدًا.
- إضافة ثلاثة اختبارات رجوع جديدة لحماية الرؤوس، وخصوصية مرفقات الدعم، والتحقق الحقيقي من ملفات R2.
- فحص الملفات المتتبعة بحثًا عن مفاتيح خاصة وأسرار Cloudflare وTurnstile وحسابات الخدمة؛ لم يظهر سر خاص متتبع. مفتاح Firebase Web الظاهر في العميل عام بطبيعته ومقيد خارجيًا بالنطاقات والواجهات الثماني.
- فحص شجرة تبعيات الإنتاج محليًا والتأكد من اكتمال الحزم الأساسية دون حزمة مفقودة.
- تشغيل الاختبارات والـlint وبناء Next.js الإنتاجي بعد المراجعة.

الأخطاء المكتشفة:

1. **طلبات Firestore الخادمية لا تحمل App Check**
   - الأعراض: القراءة الخادمية لـ`settings/public` تستخدم Firestore REST، وهو ما يفسر جزءًا أساسيًا من طلبات App Check المصنفة Unknown.
   - السبب: SSR لا يستخدم Firebase Client SDK ولا يملك رمز App Check خاصًا بالمتصفح.
   - الحل: إبقاء Firestore Enforcement متوقفًا، ثم نقل القراءة الخادمية لاحقًا إلى وسيط موثق بحساب خدمة أو تصميم لا يعتمد Firestore العام مباشرة قبل إعادة القياس.
   - الحالة: معروف ومراقب؛ لا يفرض App Check على Firestore حاليًا.

2. **تعذر تدقيق npm الشبكي في المحاولة الأولى**
   - الأعراض: `npm audit --omit=dev --audit-level=high` لم يصل إلى endpoint الخاص بسجل npm في المحاولة الأولى.
   - السبب: قيد اتصال مؤقت في بيئة التنفيذ، وليس خطأ في الحزم أو المشروع.
   - الحل: أُعيد تشغيل الفحص باتصال مصرح به دون استخدام أي أمر إصلاح تلقائي.
   - الحالة: محلول في 2026-08-28؛ اكتمل الفحص وكانت النتيجة `found 0 vulnerabilities` لاعتمادات الإنتاج.

3. **Rate Limiting إعداد سحابي لا يظهر في كود التطبيق**
   - الأعراض: لا يمكن استنتاج قاعدة WAF من ملفات Next.js وحدها.
   - السبب: Cloudflare Rate Limiting إعداد على مستوى المنطقة والحساب، وليس جزءًا من المستودع.
   - الحل: الرجوع إلى الجرد السحابي الموثق وعدم إنشاء قاعدة ثانية مكررة ضمن حد الخطة المجانية.
   - الحالة: منجز مسبقًا؛ القاعدة `Protect public forms from bursts` تحمي `/api/support` و`/api/security/turnstile`، وتبقى المراقبة قبل أي تشديد.

4. **النسخ الاحتياطي والاستعادة غير مثبتين باختبار استعادة**
   - الأعراض: لا يوجد في المستودع سجل لاختبار استعادة Firestore/R2 حديث.
   - السبب: النسخ والاستعادة عمليتان سحابيتان تحتاجان وجهة تخزين وصلاحيات وجدولة خارج التطبيق.
   - الحل: تفعيل تصدير دوري، وتوثيق تجربة استعادة إلى بيئة منفصلة قبل اعتبار البند منجزًا.
   - الحالة: متبقٍ خارجيًا.

الملفات المتأثرة:

- `tests/securityBoundaries.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
npm ls --omit=dev --depth=0
git grep -n -I -E "أنماط الأسرار"
rg -n "مسارات الحماية وقواعد Firestore"
```

الحالة:

- نجحت 48 حالة اختبار في 14 ملفًا.
- نجح ESLint دون أخطاء.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة؛ اتصالات Firestore المحظورة داخل sandbox استخدمت fallback ولم تفشل البناء.
- لا يوجد تغيير في سلوك أو تصميم الموقع ولا في أرقام الإصدارات ضمن هذه الجولة.
- البنود التي لا تعتمد تقارير واختبارات سحابية أُنجزت أو ثُبتت باختبارات رجوع.
- المتبقي الذي يحتاج منصة خارجية: تفعيل النسخ والاستعادة بعد قرار Blaze وتجديد مصادقة Wrangler، ومراقبة App Check وCSP قبل أي Enforcement.

### فحص تدقيق الحزم وجاهزية النسخ الاحتياطي - دون تغيير إصدار

ما تم إنجازه:

- تشغيل `npm audit --omit=dev --audit-level=high` باتصال مصرح به؛ النتيجة `found 0 vulnerabilities` دون تعديل `package-lock.json` أو تشغيل إصلاح تلقائي.
- مراجعة توثيق Cloudflare الحالي والتأكد من أن الخطة المجانية تسمح بقاعدة Rate Limiting واحدة، لذلك أُبقيت القاعدة الحالية بدل إنشاء قاعدة مكررة قد تستهلك الحد أو تضاعف الحظر.
- مراجعة متطلبات النسخ الاحتياطي المدار لـCloud Firestore؛ النسخ المجدول والاستعادة يتطلبان خطة Blaze وتترتب عليهما تكلفة تخزين واستعادة.
- فحص مصادقة Wrangler المحلية قبل التعامل مع R2؛ الجلسة منتهية ولا يوجد رمز API محلي بديل، لذلك لم تُنشأ حاوية أو نسخة غير قابلة للإدارة.

الأخطاء المكتشفة:

1. **النسخ الاحتياطي المدار لـFirestore غير متاح على الخطة المجانية**
   - الأعراض: لا يمكن إنشاء جدول Backup أو تنفيذ Restore في المشروع دون تفعيل الفوترة.
   - السبب: Firestore Backups وRestore وPITR ميزات مدفوعة تتطلب Blaze.
   - الحل: يقرر مالك الموقع تفعيل Blaze أولًا، ثم ننشئ نسخة يومية أو أسبوعية باحتفاظ مناسب ونختبر الاستعادة إلى قاعدة منفصلة، لا إلى قاعدة الإنتاج.
   - الحالة: متوقف عمدًا عند قرار الفوترة؛ لم يُفعّل أي مورد مدفوع ضمنيًا.

2. **جلسة Wrangler المحلية منتهية**
   - الأعراض: `npx wrangler whoami` و`npx wrangler r2 bucket list` يعيدان أن رمز المصادقة منتهي ولا يمكن تحديثه في البيئة غير التفاعلية.
   - السبب: انتهاء جلسة OAuth المحلية بعد إلغاء الرموز المؤقتة القديمة.
   - الحل: تشغيل `npx wrangler login` تفاعليًا من طرف مالك الموقع، ثم جرد حاويات R2 وحجمها قبل إنشاء وجهة Backup واختبار نسخ واستعادة كائن تجريبي.
   - الحالة: متبقٍ خارجيًا؛ لا يؤثر على البناء التلقائي لأنه يستخدم الرمز المحدود المرتبط في Cloudflare.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm audit --omit=dev --audit-level=high
npx wrangler whoami
npx wrangler r2 bucket list
```

الحالة:

- فحص الحزم منجز ولا توجد ثغرات معروفة في اعتمادات الإنتاج وقت الفحص.
- Rate Limiting منجز مسبقًا ولا توجد حاجة إلى قاعدة ثانية على الخطة المجانية.
- النسخ الاحتياطي والاستعادة لم يُعلنا منجزين لأن Firestore يحتاج قرار فوترة وR2 يحتاج إعادة مصادقة ثم اختبار استعادة فعليًا.
- لم يتغير كود التطبيق أو التصميم أو رقم الإصدار، ولم يتم نشر أو إنشاء موارد سحابية جديدة.

### تذكير النسخ الاحتياطي في إعدادات الأداة - دون تغيير إصدار

ما تم إنجازه:

- إضافة قسم `النسخ الاحتياطي والاستعادة` في أسفل صفحة إعدادات الأداة وقبل تذييل الإدارة.
- إضافة زري `نسخ احتياطي` و`استعادة` بنفس شبكة أزرار الإدارة الموحدة.
- إبقاء الزرين تذكيريين فقط؛ الضغط على أي منهما يعرض خطأ واضحًا بأن الميزة تتطلب الاشتراك في الخطة المدفوعة، دون إرسال طلب شبكة أو تعديل Firebase أو R2.
- إضافة اختبار رجوع يمنع ربط قسم التذكير مستقبلًا بأي تنفيذ فعلي بالخطأ.

الأخطاء المكتشفة:

1. **لا توجد خطة نسخ احتياطي قابلة للتنفيذ حاليًا**
   - الأعراض: الحاجة إلى تذكير دائم داخل الإدارة إلى حين تفعيل النسخ المدفوع وتجربة الاستعادة.
   - السبب: النسخ المدار لـFirestore يتطلب Blaze، ونسخ R2 يحتاج إعداد وجهة وجدولة واختبار استعادة مستقل.
   - الحل: إبقاء الأزرار تذكيرية وغير تنفيذية، ثم استبدالها بتدفق حقيقي فقط بعد تفعيل الخطة وتوثيق تجربة استعادة خارج الإنتاج.
   - الحالة: التذكير منجز؛ التنفيذ السحابي مؤجل عمدًا.

الملفات المتأثرة:

- `app/admin/tools/page.jsx`
- `app/admin/AdminDashboard.css`
- `tests/adminNoReload.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run tests/adminNoReload.test.js
npm run lint
npm test -- --run
npm run build
```

الحالة:

- نجحت 49 حالة اختبار في 14 ملفًا.
- نجح ESLint دون أخطاء.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة؛ طلبات Firestore المحظورة داخل sandbox استخدمت fallback ولم تفشل البناء.
- لا توجد عملية نسخ أو استعادة وهمية خلف الزرين، ولا تغيير في رقم الإصدار أو نشر ضمن هذه المهمة.

### إعادة الفحص الأمني النهائي ومصالحة البنود - دون تغيير إصدار

ما تم إنجازه:

- إعادة مطابقة مذكرة الأمان مع الكود الحالي بدل الاعتماد على البنود التاريخية التي أُغلقت لاحقًا.
- مراجعة مسارات حفظ الإعدادات والتأكد من بقاء الإعداد الكامل في `settings/main` ونشر إسقاط عام مصفى فقط في `settings/public`.
- مراجعة واجهات الإدارة الخادمية والتأكد من أنها تتحقق من Firebase ID Token ثم من ملف إداري نشط ودور معروف أو صلاحية القسم، مع حصر التنظيف الحساس بالمدير الكامل.
- فحص النسخة الحية والتأكد من وجود HSTS و`nosniff` ومنع الإطارات وسياسة الإحالة والصلاحيات وCSP Report-Only، ومنع فهرسة الإدارة وتسجيل الدخول وواجهات API.
- اختبار الواجهات الحية دون توثيق؛ رفضت واجهات رفع الوسائط والتنظيف وIndexNow الطلبات بالحالة `401`، كما رفضت واجهة دعم الإدارة القراءة بالحالة `401`.
- فحص أسماء الحقول المعادة من `/api/site-config` وعدم ظهور أسماء أسرار أو رموز أو مفاتيح خاصة ضمن الاستجابة العامة.
- إعادة فحص الملفات المتتبعة؛ لا يوجد مفتاح خاص أو رمز Cloudflare أو قيمة سرية فعلية محفوظة. الموجود في `.dev.vars.example` قالب وهمي فقط، وبقية المطابقات كود لمعالجة صيغة المفتاح من متغير البيئة.
- إعادة تشغيل تدقيق اعتماديات الإنتاج والاختبارات وESLint وبناء Next.js الإنتاجي.

الأخطاء المكتشفة:

1. **اتصالات Firestore الخارجية لا تتاح دائمًا أثناء البناء المحلي**
   - الأعراض: ظهرت مهلات اتصال `fetch failed` أثناء توليد بعض الصفحات الثابتة.
   - السبب: اتصال بيئة التنفيذ بـFirestore تعذر مؤقتًا، بينما يملك التطبيق fallback مقصودًا للإعداد العام.
   - الحل: أكمل البناء توليد 31 صفحة بنجاح ولم يتحول الخطأ إلى فشل بناء؛ لا يلزم تغيير الكود لهذا العرض.
   - الحالة: غير حاجب ومغطى بالـfallback الحالي.

2. **البنود المتبقية تعتمد مراقبة أو خدمة خارجية**
   - الأعراض: لا يمكن إعلان Enforcement لـApp Check أو CSP، ولا إثبات النسخ الاحتياطي، من فحص الكود وحده.
   - السبب: App Check وCSP يحتاجان تقارير إنتاج مستقرة، والنسخ والاستعادة يحتاجان Blaze ومصادقة Wrangler وتجربة استعادة منفصلة.
   - الحل: عدم فرض السياسات قبل اكتمال القياس، وعدم تفعيل مورد مدفوع دون قرار المالك، والإبقاء على تذكير النسخ الاحتياطي داخل الإدارة.
   - الحالة: ينتظر التقارير أو قرار الخطة؛ لا يوجد بند أمني آخر قابل للتنفيذ محليًا الآن.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
curl.exe -sS -D - https://date-tool.com/
curl.exe -sS -D - https://date-tool.com/admin
curl.exe -sS -D - https://date-tool.com/admin_login
curl.exe -sS -D - https://date-tool.com/api/site-config
curl.exe -sS -X POST https://date-tool.com/api/media/upload
curl.exe -sS -X POST https://date-tool.com/api/admin/cleanup
curl.exe -sS -X POST https://date-tool.com/api/admin/indexnow
git grep -n "BEGIN PRIVATE KEY"
npm audit --omit=dev --audit-level=high
npm test -- --run
npm run lint
npm run build
```

الحالة:

- `npm audit` مكتمل بنتيجة `found 0 vulnerabilities`.
- نجحت 49 حالة اختبار في 14 ملفًا، ونجح ESLint دون أخطاء.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة.
- البنود الأمنية القابلة للتنفيذ دون انتظار أُنجزت؛ المتبقي فقط مراقبة تقارير App Check وCSP، ثم اتخاذ قرار Enforcement، إضافة إلى النسخ الاحتياطي المؤجل للخطة المدفوعة وتجربة الاستعادة.
- لا يوجد تغيير وظيفي جديد أو نشر أو تغيير في رقم الإصدار ضمن جولة إعادة الفحص هذه.

### إدارة المحتوى العربي والإنجليزي للهوية وSEO - دون تغيير إصدار

ما تم إنجازه:

- إضافة مفتاح لغة واضح أعلى قسم الهوية في صفحة إعدادات الأداة للتبديل بين حقول العربية والإنجليزية، مع إبقاء البريد والصور والروابط بيانات مشتركة لا تتكرر بين اللغتين.
- إضافة تخزين إنجليزي مصفى للهوية يشمل اسم الأداة والسلوغن وحقوق الموقع ونص تثبيت PWA، وربطه بالهيدر والفوتر ومطالبة التثبيت عند تحويل الموقع للإنجليزية.
- إضافة مفتاح لغة أعلى قسم SEO في إدارة أدوات التاريخ والساعة والطقس، وربط العنوان والوصف وH1 والكلمات والعناوين الفرعية والأسئلة الشائعة بنسخة اللغة المختارة.
- إبقاء canonical وصورة المشاركة ومواضع المشاركة حقولًا تقنية مشتركة؛ لا تظهر حقول رفع مكررة في النموذج الإنجليزي ولا تتأثر الصورة عند حفظ الترجمة.
- إضافة قيم إنجليزية افتراضية مناسبة لسياق كل أداة وأقسامها، مع حفظ الترجمات تحت `toolSettings.<tool>.localizations.en`.
- ربط اللغة العامة ببيانات SEO المخصصة وعنوان المتصفح والوصف وعنوان البطل، مع تحديث `html lang` و`dir` عند التبديل.
- ترجمة واجهات أداة الساعة والطقس وإشعارات الخصوصية والموقع ومطالبة PWA والمحتوى الإرشادي العام، وربط بحث المدن بلغة الواجهة.
- توسيع الإسقاط العام وقواعد Firestore لحقل `identityTranslations` فقط بعد تصفيته بقائمة حقول مسموحة، لمنع نشر أي بيانات متداخلة غير معروفة.

الأخطاء المكتشفة:

1. **فرع SEO الإنجليزي كان معطلًا في ملف الترجمة**
   - الأعراض: القيمة `en.seo` كانت `null` وبعض النصوص العامة بقيت عربية بعد تحويل اللغة.
   - السبب: نظام الترجمة القديم غطى عناصر الأدوات الأساسية فقط ولم يغطِ البيانات الديناميكية أو النصوص الإرشادية.
   - الحل: استكمال قاموس الإنجليزية وربط البيانات الديناميكية بمحدد اللغة.
   - الحالة: منجز ومختبر.

2. **عنوان البطل بقي عربيًا بعد تحويل اللغة**
   - الأعراض: تغير عنوان المتصفح ومحتوى الأداة إلى الإنجليزية بينما بقي H1 والوصف أعلى الصفحة بالعربية.
   - السبب: `ToolPageHero` كان يعرض نصًا مولدًا على الخادم دون قراءة لغة الواجهة في العميل.
   - الحل: إبقاء النص الخادمي قيمة أولية لمحركات البحث ثم اختيار SEO المحلي من سياق اللغة في العميل.
   - الحالة: منجز ومؤكد باختبار متصفح محلي.

3. **الساعة والطقس لم يستهلكا اللغة كاملة**
   - الأعراض: البحث عن المدن وتسميات الإدخال والنتائج بقيت عربية جزئيًا في الوضع الإنجليزي.
   - السبب: عدم تمرير `lang` إلى بعض دوال التنسيق والجلب، وعدم قراءة اللغة أصلًا في بعض المكونات.
   - الحل: تمرير اللغة للتنسيق وOpen-Meteo وترجمة التسميات والقيم الافتراضية.
   - الحالة: منجز ومختبر.

4. **الأسئلة الشائعة المخصصة كانت مشتركة بين اللغتين**
   - الأعراض: كان يمكن أن تظهر أسئلة عربية داخل الصفحة الإنجليزية.
   - السبب: بنية `localizations.en` لم تتضمن `faqs`.
   - الحل: فصل أسئلة الإنجليزية داخل نفس بنية الترجمة وإدارتها من مفتاح اللغة نفسه.
   - الحالة: منجز ومغطى باختبار رجوع.

الملفات المتأثرة:

- `app/localizedConfig.js`
- `app/publicSiteConfig.js`
- `app/firebase.js`
- `app/toolSettings.js`
- `app/i18n.js`
- `app/SiteShell.jsx`
- `app/Header.jsx`
- `app/Footer.jsx`
- `app/HomePageClient.jsx`
- `app/clock/ClockPageClient.jsx`
- `app/weather/WeatherPageClient.jsx`
- `app/components/ToolPageHero.jsx`
- `app/components/ToolSeoContent.jsx`
- `app/components/PwaInstallPrompt.jsx`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/AdminDashboard.css`
- `app/page.jsx`
- `app/clock/page.jsx`
- `app/weather/page.jsx`
- `app/[slug]/page.jsx`
- `firestore.rules`
- `tests/publicSiteConfig.test.js`
- `tests/toolSettings.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 51 حالة اختبار في 14 ملفًا.
- نجح ESLint دون أخطاء، ونجح `git diff --check` دون أخطاء محتوى.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة.
- أكد اختبار المتصفح المحلي تحول صفحة الطقس إلى `lang=en` و`dir=ltr` مع عنوان ووصف وH1 إنجليزي، كما أكد ترجمة عناصر الأدوات العامة.
- لم يتغير رقم الإصدار ولم يتم النشر ضمن هذه المهمة. يحتاج حقل الهوية الجديد نشر قواعد Firestore مع نشر التطبيق قبل استخدامه في الإنتاج.

### إشعارات الخصوصية والتثبيت وتحديث التطبيق - الإصدار 0.3.38

ما تم إنجازه:

- تقليص نافذة موافقة الخصوصية إلى شريط سفلي بعرض أقصى `680px` وارتفاع لا يتجاوز ثلث الشاشة، مع تمرير داخلي عند فتح خيارات التخصيص بدل تغطية المحتوى.
- إعادة ترتيب تصميم نافذة الخصوصية والتثبيت للجوال بحيث تبقى الأزرار واضحة داخل المساحة المحددة ولا يحدث تمدد خارج الشاشة.
- منع إشعار تثبيت PWA وتنبيه تحديث التطبيق من الظهور أثناء فتح نافذة الخصوصية؛ تظهر الإشعارات التالية فقط بعد قبول الخصوصية أو تصغير نافذتها.
- دعم تثبيت iPhone دون الاعتماد على `beforeinstallprompt`: يكتشف الكود iPhone وiPad ويعرض تعليمات المشاركة ثم `إضافة إلى الشاشة الرئيسية`.
- إضافة تنبيه تحديث يظهر داخل التطبيق المثبّت فقط عند تفعيله من الإدارة، ويظهر مرة واحدة لكل رقم إصدار محفوظ.
- إضافة تعليمات تحديث تتغير تلقائيًا حسب iPhone وAndroid وEdge وبقية متصفحات سطح المكتب، مع زر تحديث مباشر يعيد تحميل الصفحة دون حذف قسري للكاش.
- إضافة مفتاح `إعلان تحديث للتطبيقات المثبّتة` وحقل رقم الإصدار داخل قسم هوية التطبيق والتثبيت في إعدادات الأداة.
- تصفية إعداد التحديث العام إلى `enabled` و`version` فقط قبل نشره في `settings/public`، وإضافة الحقل إلى صلاحيات الهوية في قواعد Firestore.
- رفع رقم إصدار الموقع إلى `0.3.38` وتاريخ الإصدار إلى `2026-08-29`.
- نشر قواعد Firestore الجديدة بنجاح إلى مشروع `date-tool-official`.
- تجهيز حزمة OpenNext كاملة؛ تعذر الرفع المباشر فقط لعدم وجود رمز Cloudflare CLI بعد إلغاء الرمز القديم، لذلك استُخدم مسار GitHub المرتبط ببناء Cloudflare الدائم.

الأخطاء المكتشفة:

1. **إشعار التثبيت اعتمد على حدث غير متاح في iOS**
   - الأعراض: مستخدم iPhone لا يرى زر تثبيت مباشر ولا يحصل على طريقة بديلة.
   - السبب: Safari على iOS لا يقدم تدفق `beforeinstallprompt` المستخدم في Chromium.
   - الحل: اكتشاف iOS وعرض خطوات المشاركة والإضافة إلى الشاشة الرئيسية.
   - الحالة: منجز.

2. **إشعارات عامة قابلة للتراكم**
   - الأعراض: كان إشعار التثبيت قادرًا على الظهور بالتزامن مع نافذة الخصوصية.
   - السبب: كل إشعار كان يدير ظهوره مستقلًا داخل المكدس السفلي.
   - الحل: تمرير حالة حجب مركزية من `SiteShell` وإعطاء نافذة الخصوصية الأولوية.
   - الحالة: منجز ومغطى باختبار السلوك والبناء.

3. **نشر Wrangler المباشر بلا اعتماد دائم**
   - الأعراض: اكتمل بناء OpenNext ثم رفض Wrangler الرفع لغياب `CLOUDFLARE_API_TOKEN`.
   - السبب: رمز CLI القديم أُلغي سابقًا ضمن تقليل الصلاحيات، بينما النشر الدائم للمشروع مربوط بفرع GitHub.
   - الحل: عدم إنشاء رمز واسع جديد واستخدام الدفع إلى `master` لتشغيل Cloudflare Build بالرمز المحدود المرتبط.
   - الحالة: مسار النشر الآمن معتمد.

الملفات المتأثرة:

- `app/SiteShell.jsx`
- `app/components/PwaInstallPrompt.jsx`
- `app/components/PwaUpdatePrompt.jsx`
- `app/pwaPromptSettings.js`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/AdminDashboard.css`
- `app/globals.css`
- `app/firebase.js`
- `app/publicSiteConfig.js`
- `app/version.js`
- `firestore.rules`
- `package.json`
- `package-lock.json`
- `tests/adminNoReload.test.js`
- `tests/publicSiteConfig.test.js`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
git diff --check
npm run build
npx firebase-tools deploy --only firestore:rules --project date-tool-official
npm run deploy
git push origin master
```

الحالة:

- نجحت 53 حالة اختبار في 14 ملفًا، ونجح ESLint و`git diff --check`.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة، ونجح إنشاء حزمة OpenNext.
- نُشرت قواعد Firestore الجديدة بنجاح.
- الإصدار المستهدف للنشر العام هو `0.3.38` عبر Cloudflare Build المرتبط بفرع `master`.
- إعداد إعلان التحديث افتراضيًا غير مفعّل؛ يفعّله المدير ويغير رقم الإعلان عند الحاجة إلى إشعار التطبيقات المثبّتة.

### توحيد تحرير المحتوى الثنائي وربط إعلان التحديث بآخر نسخة - الإصدار 0.3.39 / admin 0.1.45

ما تم إنجازه:

- جعل رقم إعلان تحديث التطبيق المثبت يُقرأ تلقائيًا من `APP_VERSION`، وإلغاء الإدخال اليدوي الذي كان يسمح بحفظ رقم قديم أو خاطئ.
- إبقاء مفتاح إعلان التحديث تحت تحكم المدير، مع عرض رقم النسخة الحالية للقراءة فقط داخل إعدادات الأداة.
- تثبيت عناوين سيكشن SEO وتسميات الحقول ومعاينة Google بالعربية عند التبديل إلى الإنجليزية؛ يتغير محتوى المدخلات واتجاهها فقط.
- إبقاء أسماء الأدوات الفرعية الإدارية ثابتة بالعربية أثناء تحرير بيانات SEO الإنجليزية حتى لا يتغير ترتيب الصفحة أو سياقها.
- تحويل نافذة تعديل الأسئلة الشائعة إلى محرر ثنائي يعرض السؤال والإجابة بالعربية والإنجليزية معًا.
- مزامنة تفعيل السؤال وإضافته وحذفه بين الصف العربي والإنجليزي، ومعالجة البيانات القديمة عند نقص عدد الترجمات الإنجليزية دون إزاحة الفهارس.
- تحويل نافذة تعديل الموعد إلى حقلي اسم عربي وإنجليزي مشتركين مع التاريخ والتكرار واللون والأيقونة نفسها.
- عرض المواعيد في الواجهة الإنجليزية باستخدام `nameEn` والرجوع الآمن إلى الاسم العربي عند غياب الترجمة، بدل إخفاء قسم المواعيد بالكامل.
- تحويل نافذة نصوص المشاركة إلى محرر عربي وإنجليزي متزامن، واستخدام نص المشاركة الإنجليزي عند تحويل الموقع إلى الإنجليزية مع الرجوع للنص العربي عند عدم إدخاله.
- رفع إصدار الموقع إلى `0.3.39` وإصدار منصة الإدارة إلى `0.1.45` بتاريخ `2026-08-30`.

الأخطاء المكتشفة:

1. **رقم إعلان التحديث كان يدويًا**
   - الأعراض: يمكن أن يبقى رقم إعلان قديم بعد نشر نسخة أحدث أو يُكتب رقم غير مطابق للبناء.
   - السبب: الحقل كان نصًا قابلًا للتحرير منفصلًا عن `APP_VERSION`.
   - الحل: تطبيع الإعداد دائمًا إلى آخر `APP_VERSION` وعرضه للقراءة فقط.
   - الحالة: منجز ومغطى باختبار يمنع اعتماد نسخة مخزنة قديمة.

2. **تبديل SEO غيّر لغة واجهة السيكشن كاملة**
   - الأعراض: تتغير تسميات الحقول والعناوين واتجاه المعاينة، ما يصعّب معرفة موضع المدخل المطلوب.
   - السبب: اللغة المختارة استُخدمت للبيانات ولواجهة الإدارة في الوقت نفسه.
   - الحل: فصل لغة قيمة المدخل عن لغة واجهة الإدارة، مع إبقاء اتجاه المدخل الإنجليزي `LTR`.
   - الحالة: منجز.

3. **ترجمات الأسئلة والمواعيد ونصوص المشاركة لم تكن مرئية في نافذة تعديل واحدة**
   - الأعراض: يحتاج المدير للتنقل بين اللغات، ولا يحتوي الموعد على اسم إنجليزي، ونص المشاركة الإنجليزي غير مستقل.
   - السبب: نماذج الإدارة كانت تربط الصف باللغة الحالية أو تخزن نصًا واحدًا مشتركًا.
   - الحل: محررات ثنائية اللغة مع حقول مشتركة للخصائص غير النصية وتوافق رجوعي للبيانات القديمة.
   - الحالة: منجز.

الملفات المتأثرة:

- `app/pwaPromptSettings.js`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/tool-management/ToolContentSettings.jsx`
- `app/admin/tool-management/date/page.jsx`
- `app/admin/AdminDashboard.css`
- `app/HomePageClient.jsx`
- `app/components/home/HomeSections.jsx`
- `app/toolSettings.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/publicSiteConfig.test.js`
- `tests/toolSettings.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 54 حالة اختبار في 14 ملفًا.
- نجح ESLint دون أخطاء، ونجح بناء Next.js 15.5.23 وتوليد 31 صفحة.
- الفحص المحلي لصفحات الإدارة توقف عند تحقق جلسة localhost المنفصلة، لذلك يكون الفحص البصري النهائي على الإنتاج بعد نشر الفرع `master`.

### إصلاح أيقونة iPhone وإشعار التثبيت وحالة الخصوصية - الإصدار 0.3.40 / admin 0.1.46

ما تم إنجازه:

- فصل أيقونة المتصفح عن أيقونة التطبيق في metadata؛ يستخدم `apple-touch-icon` الآن `appIconUrl` أولًا ثم الشعار ثم favicon كحل أخير.
- إضافة رقم الإصدار إلى رابط أيقونة iOS لكسر كاش Safari عند تغيير أيقونة التطبيق.
- تحديث `apple-touch-icon` من إعدادات الموقع العامة بعد تحميلها، مع إبقاء favicon مستقلًا لألسنة المتصفح.
- تأكيد أن أيقونة التطبيق الصحيحة محفوظة في R2 تحت تصنيف `app-icon`، بينما النسخة السابقة كانت ترسل مسار `favicon` إلى iOS.
- إزالة قرار تثبيت قديم كان يمنع إشعار التثبيت نهائيًا في تبويب المتصفح العادي.
- إضافة ترحيل لمرة واحدة لحالة إشعار التثبيت القديمة؛ يظهر الإشعار كاملًا مجددًا ثم يحترم التصغير إلى الزر المختصر.
- استمرار إخفاء إشعار التثبيت داخل وضع `standalone` حتى لا يظهر للمستخدم داخل التطبيق المثبت.
- فصل فتح إعدادات الخصوصية للمراجعة عن حالة الموافقة الأولى؛ لم تعد المراجعة تمس الموافقة المحفوظة.
- إبقاء زر الخصوصية ظاهرًا في كل الصفحات فقط قبل اتخاذ القرار الأول إذا صغّر المستخدم التنبيه.
- بعد حفظ الموافقة، يظهر زر الخصوصية فقط في الصفحات المحددة من الإدارة، ويختفي عند إغلاق اللوحة أو الانتقال لصفحة غير محددة.
- إضافة دالة مستقلة لحساب حالة واجهة الخصوصية واختبارات تغطي القرار الأول والمراجعة والإغلاق والصفحات المحددة.
- رفع إصدار الموقع إلى `0.3.40` وإصدار منصة الإدارة إلى `0.1.46` بتاريخ `2026-08-30`.

الأخطاء المكتشفة:

1. **iOS استخدم favicon بدل أيقونة التطبيق**
   - الأعراض: اختصار الشاشة الرئيسية ظهر بأيقونة زرقاء وحرف بدل شعار التطبيق المرفوع.
   - السبب: `generateMetadata` أعطى `faviconUrl` الأولوية في حقل Apple رغم وجود `appIconUrl` مستقل.
   - الحل: فصل المصدرين وإضافة رابط Apple ديناميكي محدث بالإصدار.
   - الحالة: منجز؛ الاختصار القديم يحتاج حذفه وإضافته مجددًا لأن iOS يحتفظ بالأيقونة عند الإنشاء.

2. **إشعار التثبيت توقف بسبب حالة قديمة**
   - الأعراض: لا يظهر الإشعار رغم فتح الموقع من المتصفح وعدم التشغيل كتطبيق مثبت.
   - السبب: مفتاح `date_tools_pwa_install_decided` القديم كان يُعامل كقرار دائم.
   - الحل: عدم اعتماد القرار القديم في تبويب المتصفح، وترحيل حالة العرض إلى النسخة الثانية مع الإبقاء على كشف standalone.
   - الحالة: منجز ومغطى باختبار رجوع.

3. **مراجعة الخصوصية ألغت حالة الموافقة داخل الواجهة**
   - الأعراض: بعد فتح إعدادات الخصوصية ثم إغلاقها ظهر الزر في جميع الصفحات رغم وجود موافقة سابقة.
   - السبب: `openPrivacySettings` كان يضع `privacyConsent` على `null` لاستخدامه لفتح اللوحة، وهي القيمة نفسها المخصصة لعدم اتخاذ القرار.
   - الحل: إضافة حالة فتح مستقلة وعدم تعديل الموافقة المحفوظة، مع إغلاق المراجعة عند مغادرة الصفحات المحددة.
   - الحالة: منجز ومغطى بثلاث حالات اختبار مباشرة.

الملفات المتأثرة:

- `app/layout.jsx`
- `app/SiteShell.jsx`
- `app/components/PwaInstallPrompt.jsx`
- `app/privacyUiState.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/privacyUiState.test.js`
- `tests/pwaInstall.test.js`
- `tests/publicSiteConfig.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 59 حالة اختبار في 16 ملفًا.
- نجح ESLint دون أخطاء، ونجح بناء Next.js 15.5.23 وتوليد 31 صفحة.
- لا يوجد تغيير في قواعد Firestore أو صلاحياتها ضمن هذه المهمة.

### اكتشاف تحديث التطبيق المثبت تلقائيًا - الإصدار 0.3.41 / admin 0.1.47

ما تم إنجازه:

- إضافة واجهة عامة `/api/app-version` تعرض رقم آخر نسخة منشورة وتاريخها مع رؤوس تمنع كاش المتصفح وCloudflare.
- جعل التطبيق المثبت يقارن `APP_VERSION` المضمّن في الكود المشغل بآخر نسخة منشورة عند التشغيل وعند العودة من الخلفية، مع حد دوري ست ساعات للفحص أثناء التركيز المستمر.
- حصر الفحص والإشعار في وضع التطبيق المثبت عبر `display-mode: standalone` أو `navigator.standalone` في iOS أو مرجع تطبيق Android.
- إظهار الإشعار فقط عندما تكون نسخة الخادم أحدث رقميًا من النسخة المشغلة، وعدم الاعتماد على التاريخ لاتخاذ قرار التحديث.
- فصل إغلاق الإشعار عن نجاح التحديث؛ زر الإغلاق يحفظ الإصدار المستبعد، بينما زر التحديث يعيد فتح الصفحة بعنوان كاسر للكاش دون إخفاء الإصدار مسبقًا.
- تنظيف معامل كسر الكاش من شريط العنوان بعد تحميل التطبيق، وإعادة فحص الخادم عند عودة التطبيق إلى الواجهة.
- جعل إعلان التحديث مفعّلًا افتراضيًا، مع إبقاء مفتاح الإدارة وسيلة إيقاف طارئ للإشعارات.
- ترحيل إعداد الإعلان اليدوي القديم تلقائيًا إلى مخطط الإصدار الثاني؛ لا تمنع قيمة `enabled: false` القديمة الفحص، بينما يُحترم الإيقاف الصريح المحفوظ لاحقًا من لوحة الإدارة.
- رفع إصدار الموقع إلى `0.3.41` وإصدار منصة الإدارة إلى `0.1.47` بتاريخ `2026-08-30`.

الأخطاء المكتشفة:

1. **الإشعار السابق لم يكن يقارن نسخة الجهاز بنسخة الخادم**
   - الأعراض: كان ظهور الإشعار يعتمد على رقم الإصدار الحالي ومفتاح الإدارة، لذلك يمكن أن يظهر دون إثبات وجود نسخة أحدث فعلًا.
   - السبب: لم توجد واجهة إصدار مستقلة غير قابلة للكاش، ولم يحتفظ الكود بمفهومين منفصلين للنسخة المشغلة والمنشورة.
   - الحل: إضافة endpoint للإصدار ومقارنة رقمية مستقلة ومغطاة بالاختبارات.
   - الحالة: منجز.

2. **زر التحديث كان يسجل الإصدار كمشاهَد قبل إعادة التحميل**
   - الأعراض: إذا أعاد iOS فتح النسخة القديمة بسبب الكاش، يختفي التنبيه رغم عدم وصول النسخة الجديدة.
   - السبب: كان الزر يكتب `date_tools_pwa_update_seen` ثم ينفذ `reload` مباشرة.
   - الحل: عدم حفظ الاستبعاد عند التحديث، واستخدام معامل URL لكسر كاش التنقل؛ لا يختفي التنبيه إلا بعد تطابق النسخة أو إغلاقه صراحة.
   - الحالة: منجز ومغطى باختبارات منطق المقارنة.

الملفات المتأثرة:

- `app/api/app-version/route.js`
- `app/components/PwaUpdatePrompt.jsx`
- `app/pwaVersionCheck.js`
- `app/pwaPromptSettings.js`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/pwaVersionCheck.test.js`
- `tests/publicSiteConfig.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 62 حالة اختبار في 17 ملفًا، بما فيها اختبار واجهة الإصدار ورؤوس منع الكاش، ونجح ESLint.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة؛ ظهرت رسائل انقطاع اتصال Firebase أثناء التوليد ضمن بيئة التنفيذ المقيدة، ثم أكمل البناء بنجاح باستخدام مسارات الرجوع الحالية.
- لا يوجد تغيير في قواعد Firestore أو البيانات أو الصلاحيات ضمن هذه المهمة.
- هذه النسخة تؤسس الفحص التلقائي للتحديثات اللاحقة؛ النسخ الأقدم تحتاج تحميل كود `0.3.41` مرة واحدة قبل أن تستطيع اكتشاف `0.3.42` وما بعدها تلقائيًا.

### ترجمة أسماء الإدارة وتحسين الهوية والتثبيت - الإصدار 0.3.42 / admin 0.1.48

ما تم إنجازه:

- إضافة محرر لغة مستقل لأسماء الصفحات والروابط الخارجية وحسابات التواصل، مع إبقاء المسارات والروابط والألوان وبقية الإعدادات مشتركة.
- إضافة حقول `titleEn` المتوافقة رجعيًا للعناصر الإدارية، ونشرها ضمن الإعدادات العامة الآمنة دون كشف حقول إضافية.
- ربط الهيدر والفوتر بالأسماء الإنجليزية عند تحويل لغة الموقع، مع ترجمات افتراضية صحيحة للصفحات الحالية: Contact Us وTerms of Use وPrivacy Policy وMonths Table وAbout Us.
- إضافة ترجمة إنجليزية افتراضية صحيحة لاسم الهوية `Comprehensive Tools` والسلوغن `All tools at your fingertips` ونص الحقوق.
- استبدال كلمة اللوقو بكلمة الشعار في واجهة الإدارة ووصفها ونصوص المعاينة.
- توحيد مفاتيح إظهار الشعار والتثبيت وتحديث التطبيق والخصوصية إلى زر تشغيل أخضر وإيقاف أحمر بنفس نمط أزرار الجداول.
- تحويل حقول الشعار وfavicon وأيقونة التطبيق إلى مربعات معاينة؛ يظهر إجراء الاستبدال عند المرور أو التركيز، وتظهر أيقونة رفع عند عدم وجود صورة.
- إخفاء مسارات R2 الداخلية من صفوف أيقونات اختصارات التاريخ والساعة والطقس والاكتفاء بحالة رفع واضحة.
- إضافة حقل عربي وإنجليزي لتعليمات التثبيت على الأجهزة التي لا توفر زر تثبيت مباشر، واستخدامه في تنبيه Safari على iPhone وiPad.
- إزالة بوردر بطاقات الاختصارات العلوية وجعل خلفية الأيقونة بلون القسم كاملًا مع ظل خفيف.
- رفع إصدار الموقع إلى `0.3.42` وإصدار منصة الإدارة إلى `0.1.48` بتاريخ `2026-08-30` حتى يلتقطه نظام تحديث التطبيقات المثبتة.

الأخطاء المكتشفة:

1. **أسماء الهيدر والفوتر بقيت عربية في الواجهة الإنجليزية**
   - الأعراض: تحولت أدوات الصفحة ومحتواها إلى الإنجليزية، بينما بقيت أسماء الصفحات والحقوق بالعربية.
   - السبب: عناصر الإدارة كانت تخزن حقل `title` عربيًا واحدًا، ولم تكن المصفوفات تمر عبر توطين اللغة.
   - الحل: إضافة `titleEn` وتوطين المصفوفات في `getLocalizedSiteConfig` مع ترجمات رجوع للصفحات الحالية.
   - الحالة: منجز ومغطى باختبار مباشر.

2. **حقول الصور كشفت مسارات التخزين داخل الواجهة**
   - الأعراض: ظهر مسار `/api/media/...` الطويل تحت كل شعار وأيقونة.
   - السبب: مكوّن الرفع كان يعرض قيمة الرابط كنص مساعد رغم وجود معاينة بصرية.
   - الحل: الاكتفاء بمربع المعاينة وحالة الرفع وإجراء الاستبدال دون عرض المسار.
   - الحالة: منجز.

3. **تعليمات iOS كانت نصًا ثابتًا داخل الكود**
   - الأعراض: لا يمكن تحديث تعليمات التثبيت اليدوي من الإدارة عند تغير واجهة النظام.
   - السبب: `PwaInstallPrompt` استخدم نص iPhone ثابتًا.
   - الحل: إضافة `manualInstructions` بالعربية والإنجليزية وربطه بالإدارة وبالتنبيه العام.
   - الحالة: منجز.

الملفات المتأثرة:

- `app/admin/tools/page.jsx`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/AdminDashboard.css`
- `app/components/PwaInstallPrompt.jsx`
- `app/localizedConfig.js`
- `app/publicSiteConfig.js`
- `app/firebase.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/publicSiteConfig.test.js`
- `tests/pwaVersionCheck.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 63 حالة اختبار في 17 ملفًا، ونجح ESLint و`git diff --check`.
- نجح بناء Next.js 15.5.23 وتوليد 31 صفحة؛ رسائل `EACCES` كانت من منع اتصال Firebase في بيئة التنفيذ ثم اكتمل البناء بمسارات الرجوع.
- لم تتغير قواعد Firestore أو صلاحيات الإدارة أو آلية رفع R2.
- ترجمة محتوى الصفحات نفسها مؤجلة كما طلب المستخدم؛ هذه المرحلة تغيّر أسماء الجداول وروابط الواجهة فقط.

### إصلاح ترجمة جدول الأشهر المخزنة - الإصدار 0.3.43 / admin 0.1.49

تم إنجازه:

- اكتشاف أن قيمة `titleEn` المخزنة لصفحة `month-names` عربية، ولذلك كانت تتغلب على ترجمة الرجوع الإنجليزية الصحيحة.
- تجاهل قيمة الاسم الإنجليزي عندما تحتوي أحرفًا عربية، ثم استخدام ترجمة المسار النظامية مع إبقاء أي قيمة إنجليزية مخصصة صحيحة.
- إضافة حالة اختبار تحاكي البيانات القديمة الفعلية ورفع الإصدار كي تلتقط التطبيقات المثبتة التصحيح.

الأخطاء المكتشفة:

1. **رابط جدول الأشهر بقي عربيًا في الفوتر الإنجليزي**
   - الأعراض: ظهرت جميع روابط الفوتر بالإنجليزية عدا `جدول الأشهر`.
   - السبب: حقل `titleEn` القديم كان موجودًا لكنه يحتوي الاسم العربي نفسه.
   - الحل: التحقق من لغة القيمة المخزنة قبل اعتمادها، ثم الرجوع إلى `Months Table` للمسار المعروف.
   - الحالة: منجز ومغطى باختبار مباشر.

الملفات المتأثرة:

- `app/localizedConfig.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/publicSiteConfig.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 63 حالة اختبار في 17 ملفًا، ونجح ESLint وبناء Next.js الكامل وتوليد 31 صفحة.
- نُشرت النسخة `0.3.43` وتأكدت واجهة الإصدار الحية منها، ثم تحقق المتصفح من ظهور `Months Table` مع بقية روابط الفوتر الإنجليزية والهوية والحقوق الصحيحة.

### توحيد زر التشغيل والإيقاف في الإدارة - admin 0.1.50

تم إنجازه:

- إنشاء مكوّن الإدارة الموحد `AdminEnableToggle` بحجم زر حالة الجداول نفسه `38×38` وبألوان النجاح والحالة غير النشطة نفسها.
- استبدال تكرار زر الحالة في جداول الصفحات والروابط والسوشيال بالمكوّن الموحد ليصبح هو المرجع الرسمي لأي تشغيل وإيقاف جديد.
- تطبيق المكوّن على إظهار الشعار وتنبيه التثبيت وإشعار تحديث التطبيق وزر إعدادات الخصوصية.
- إضافة `aria-pressed` وعناوين وصفية مستقلة لكل استخدام لدعم لوحة المفاتيح وقارئات الشاشة.
- إبقاء نسخة تطبيق العملاء `0.3.43` دون تغيير لأن التعديل إداري فقط، ورفع نسخة الإدارة إلى `0.1.50`.

الأخطاء المكتشفة:

1. **اختلاف شكل مفاتيح التشغيل الجديدة عن زر حالة الجداول**
   - الأعراض: ظهرت بعض المفاتيح كشريط منزلق كبير بينما زر الجداول مربع صغير بأيقونة واضحة.
   - السبب: وجود CSS ومكوّن بصري مستقل لكل مجموعة بدل مرجع واحد مشترك.
   - الحل: إنشاء `AdminEnableToggle` واستخدامه في الجداول وجميع المفاتيح المضافة في المرحلة الأخيرة.
   - الحالة: منجز.

الملفات المتأثرة:

- `app/admin/AdminEnableToggle.jsx`
- `app/admin/AdminDashboard.css`
- `app/admin/tools/IdentitySettingsSections.jsx`
- `app/admin/tools/page.jsx`
- `app/version.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm test -- --run
npm run lint
npm run build
git diff --check
```

الحالة:

- نجحت 63 حالة اختبار في 17 ملفًا، ونجح ESLint وبناء Next.js الكامل وتوليد 31 صفحة.
- لم تتغير قواعد Firestore أو إعدادات الحماية أو منطق حفظ الإعدادات.
- نُشرت نسخة الإدارة `0.1.50` وتحقق المتصفح من 11 زرًا موحدًا بأبعاد `38×38` وانحناء `12px` وألوان الحالة المرجعية، مع عدم بقاء أي عنصر من النمط القديم.

### تشخيص الظهور في Google Search Console - 2026-08-31

تم إنجازه:

- مراجعة تقارير الفهرسة والأداء وخرائط الموقع والروابط وHTTPS ومؤشرات أداء الويب والإجراءات اليدوية والمشاكل الأمنية.
- التأكد من نجاح قراءة `https://date-tool.com/sitemap.xml` بتاريخ `2026-08-29` واكتشاف 17 عنوانًا فيها.
- تشغيل اختبار URL حي لصفحة `/age-calculator` بتاريخ `2026-08-31`؛ أكد Google أن الصفحة متاحة وقابلة للفهرسة، ورصد عنصر Breadcrumb صالحًا.
- مقارنة عناوين Search Console مع توليد sitemap والمسارات وcanonical والربط الداخلي في الكود.

الأخطاء المكتشفة:

1. **صفحات الأدوات الفرعية معزولة عن الروابط الداخلية**
   - الأعراض: تسعة مسارات أدوات فرعية موجودة في sitemap لكن لا توجد روابط HTML داخل الصفحات الرئيسية تشير إليها.
   - السبب: الواجهة تستخدم أقسامًا داخل الصفحة، بينما المسارات المستقلة أضيفت للفهرسة دون إضافة تنقل داخلي إليها.
   - الحل المقترح: إضافة روابط سياقية واضحة من صفحات التاريخ والوقت والطقس إلى المسارات الفرعية المطابقة.
   - الحالة: مكتشف ولم يُنفذ بعد.

2. **مسارات قديمة رقيقة ما زالت مفهرسة**
   - الأعراض: Search Console يعرض `/index.html` و`/after-14-days.html` كصفحتين مفهرستين، وكلتاهما تعرض صفحة بلا محتوى مع canonical ذاتي ولا تحمل `noindex`.
   - السبب: مسار `[slug]` يعرض واجهة "لا يوجد محتوى" لعناوين غير معروفة بدل إرجاع 404/410 أو إعادة توجيه مناسبة.
   - الحل المقترح: إعادة توجيه `/index.html` إلى `/`، وإرجاع 410 للمسارات القديمة المنتهية، وإرجاع 404 حقيقي لأي slug غير موجود.
   - الحالة: مكتشف ولم يُنفذ بعد.

3. **بيانات الفهرسة أقدم من آخر sitemap**
   - الأعراض: تقرير الفهرسة معدل آخر مرة في `2026-08-21` ويعرض 3 صفحات مفهرسة و19 غير مفهرسة، بينما sitemap قرئت في `2026-08-29`.
   - السبب: Google لم يكمل إعادة الزحف والمعالجة للبنية الحالية، والموقع حديث ولا يملك روابط خارجية بعد.
   - الحل المقترح: تنفيذ إصلاحات الروابط والمسارات القديمة أولًا، ثم طلب فهرسة الصفحات الرئيسية ومراقبة التقرير.
   - الحالة: يحتاج متابعة بعد الإصلاح.

الملفات المتأثرة:

- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
rg --files app
rg -n "canonical|alternates|metadata|generateMetadata|noindex|robots" app middleware.js
```

الحالة:

- لا توجد إجراءات يدوية أو مشاكل أمنية، وHTTPS سليم دون عناوين غير آمنة.
- الأداء خلال آخر 3 أشهر: ظهوران ونقرة واحدة للصفحة الرئيسية، بمتوسط موضع 43.5.
- لا تتوفر بيانات استخدام ميدانية كافية لـCore Web Vitals حتى الآن.
- اختبار Google الحي يثبت عدم وجود منع من robots أو noindex أو خطأ وصول في صفحة الأداة المختبرة.

### إصلاح بنية الفهرسة والبيانات المنظمة - الإصدار 0.3.44

تم إنجازه:

- إضافة تحويل دائم `308` من `/index.html` إلى `/` مع الحفاظ على معاملات الرابط.
- إرجاع `410 Gone` مع `noindex, nofollow, noarchive` للمسارين القديمين `/after-14-days.html` و`/ad_request.html`.
- تعديل صفحة `[slug]` لإرجاع 404 حقيقي لأي صفحة غير موجودة أو معطلة، وإرجاع Metadata تحمل `noindex` بدل canonical ذاتي لصفحة رقيقة.
- إضافة قسم روابط داخلية سياقية متعدد اللغات إلى صفحات التاريخ والوقت والطقس وصفحات الأدوات الفرعية التسعة.
- إضافة JSON-LD من نوع `ContactPage` و`AboutPage` أو `WebPage` مع `BreadcrumbList` للصفحات المدارة.
- إضافة معرفات ثابتة مترابطة لـ`WebSite` و`Organization` و`WebApplication`، مع استمرار التعقيم عبر `serializeJsonLd`.
- تحديث `lastModified` لعائلات الأدوات في sitemap إلى `2026-08-31` ورفع نسخة التطبيق إلى `0.3.44`.
- نشر الإصدار `0.3.44` على Cloudflare والتحقق حيًا من الإصدار والروابط الداخلية وSchema وحالات `308` و`410` و`404`.
- إرسال طلبات فهرسة ناجحة من Google Search Console للصفحات الرئيسية الخمس: `/age-calculator` و`/date-converter` و`/date-difference` و`/clock` و`/weather`.

الأخطاء المكتشفة:

1. **صفحات slug الوهمية كانت تعود بصفحة رقيقة قابلة للفهرسة**
   - الأعراض: `/index.html` و`/after-14-days.html` ظهرتا في فهرس Google بعنوان عام ومحتوى فارغ وcanonical ذاتي.
   - السبب: الخادم مرر `initialPage=null` إلى العميل بدل استدعاء `notFound()`، ثم عرض العميل صفحة دون محتوى بحالة 200.
   - الحل: اتخاذ قرار الوجود على الخادم، وإرجاع 404 أو 410 أو 308 حسب نوع المسار.
   - الحالة: منجز ومختبر محليًا.

2. **مسارات الأدوات الفرعية بلا روابط HTML داخلية**
   - الأعراض: اكتشف Google المسارات من sitemap فقط ولم يرصد صفحات إحالة.
   - السبب: صفحات العائلات عرضت الأدوات كأقسام داخلية ولم تربط بالمسارات المستقلة ذات canonical الخاص.
   - الحل: إضافة شبكة روابط سياقية تظهر في HTML الأولي لكل عائلة وتربط صفحاتها الفرعية ببعضها.
   - الحالة: منجز ومختبر للمسارات التسعة.

3. **Schema الصفحات التعريفية اقتصرت على WebSite العامة**
   - الأعراض: صفحات التواصل ومن نحن وبقية الصفحات المدارة لم تحمل تعريف WebPage خاصًا أو BreadcrumbList.
   - السبب: JSON-LD الخاص كان محصورًا في صفحات الأدوات.
   - الحل: إضافة مولد Schema آمن للصفحات المدارة وربطه بمسار `[slug]` بعد التحقق من وجود الصفحة.
   - الحالة: منجز ومغطى باختبار مباشر.

الملفات المتأثرة:

- `middleware.js`
- `app/[slug]/page.jsx`
- `app/components/ToolSeoContent.jsx`
- `app/pageJsonLd.js`
- `app/seoConfig.js`
- `app/toolSeoServer.js`
- `app/globals.css`
- `app/sitemap.js`
- `app/version.js`
- `package.json`
- `package-lock.json`
- `tests/pageJsonLd.test.js`
- `tests/securityBoundaries.test.js`
- `tests/publicSiteConfig.test.js`
- `tests/pwaVersionCheck.test.js`
- `VERSION_LOG.md`
- `PROJECT_MEMO.md`

الأوامر المستخدمة:

```powershell
npm run lint
npm test -- --run
npm run build
npm start -- -p 3007
git diff --check
```

الحالة:

- نجح ESLint و65 اختبارًا في 18 ملفًا، ونجح بناء Next.js الكامل وتوليد 31 صفحة.
- أثبت فحص الإنتاج المحلي: `308` لـ`/index.html`، و`410` للمسارين القديمين، و`404 + noindex` للـslug الوهمي، و`200` لصفحات الأدوات والصفحات المدارة.
- ظهرت الروابط الفرعية التسعة في HTML الأولي، وظهرت Schema `WebApplication` و`ContactPage` الصحيحة.
- نُشر الإصدار `0.3.44` وتأكد حيًا من `/api/app-version` ومن sitemap والصفحات الرئيسية دون أخطاء.
- أكد Google في `2026-08-31` إضافة الصفحات الخمس المطلوبة إلى قائمة انتظار الزحف ذات الأولوية؛ الفهرسة الفعلية ليست فورية وتحتاج متابعة تقرير Search Console بعد إعادة الزحف.
