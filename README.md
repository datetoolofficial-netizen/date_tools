# date_tools

موقع أدوات تاريخ ووقت وطقس ثنائي اللغة مبني بـNext.js 15 وReact 19، ويجهز للنشر إلى Cloudflare Worker المسمى `datetools` عبر OpenNext.

## التشغيل المحلي

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
```

افتح `http://127.0.0.1:3000`. وضع المعلنين المحلي يستخدم بيانات مصطنعة في Local Storage ولا ينشئ حسابات Firebase.

## الفحص

```powershell
npm run lint
npm test
npm run test:rules
npm run build
npm run test:e2e
npm run quality:local
```

`test:e2e` يشغل خادم الإنتاج المحلي، لذلك يسبق بأمر `npm run build`. `quality:local` ينفذ الترتيب كاملًا ولا ينشر شيئًا. اختبارات قواعد Firestore تعمل على Emulator ومشروع تجريبي اسمه يبدأ بـ`demo-` لمنع الوصول العرضي إلى الإنتاج.
يشغل Playwright الخادم مع `LOCAL_E2E_ISOLATED=1` حتى يستخدم إعدادات وحملات عامة فارغة ولا يتصل ببيانات الإنتاج.

## الصحة والتشغيل

```powershell
npm run health:check -- http://127.0.0.1:3000
```

- دليل الحوادث والاستعادة: `docs/OPERATIONS_RUNBOOK.md`
- خطة اختبار القبول: `docs/ACCEPTANCE_TEST_PLAN.md`
- تعريف إحصاء التثبيت والخصوصية: `docs/STATISTICS_AND_PRIVACY.md`

## النشر

النشر لا ينفذ ضمن الفحص المحلي، ويحتاج موافقة صريحة ومصادقة Cloudflare:

```powershell
npm run deploy
```

لا تحفظ `.env.local` أو `.dev.vars` أو مفاتيح Firebase وCloudflare في Git.
