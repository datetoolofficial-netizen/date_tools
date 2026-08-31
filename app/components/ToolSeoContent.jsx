'use client';

import { useSiteContext } from '../SiteContext';

const toolContent = {
    date: {
        sections: [
            {
                title: 'دليل أدوات التاريخ',
                paragraphs: [
                    'تجمع صفحة التاريخ الأدوات اليومية الأكثر استخدامًا للتعامل مع التواريخ: حساب العمر، تحويل التاريخ بين الميلادي والهجري، وحساب المدة بين تاريخين. صممت هذه الأدوات لتساعدك على الوصول إلى نتيجة واضحة بسرعة دون إدخال بيانات شخصية أو إنشاء حساب.',
                    'يمكنك استخدام الصفحة لمعرفة عمرك بالسنوات والأشهر والأيام، أو تحويل تاريخ مهم بين التقويمين، أو حساب مدة خدمة أو عقد أو فترة دراسة. النتائج تعتمد على الحسابات التقويمية المتاحة داخل الأداة، لذلك تبقى مناسبة للاستخدام اليومي والتنظيم الشخصي، مع ضرورة الرجوع إلى الجهة الرسمية عند الحاجة إلى اعتماد قانوني أو إداري.',
                ],
            },
            {
                title: 'متى تستخدم كل أداة؟',
                paragraphs: [
                    'اختر حاسبة العمر عندما تريد معرفة العمر الحالي أو الأيام المتبقية حتى تاريخ محدد. واستخدم محول التاريخ عندما يكون لديك تاريخ مكتوب بتقويم وتحتاج مطابقته بالتقويم الآخر. أما حساب المدة فيناسب المقارنة بين تاريخين في الماضي أو المستقبل.',
                ],
                items: [
                    'حساب العمر: مناسب للميلاد، المواعيد الشخصية، والتحقق السريع من العمر.',
                    'تحويل التاريخ: مناسب للمناسبات، الوثائق، والانتقال بين الميلادي والهجري.',
                    'حساب المدة: مناسب لفترات العمل، الاشتراكات، العقود، والعد التنازلي.',
                    'المواعيد القادمة: تعرض أحداثًا مهمة قابلة للمشاركة مثل الرواتب والمناسبات.',
                ],
            },
            {
                title: 'ملاحظات الدقة والخصوصية',
                paragraphs: [
                    'لا تضع الأداة تاريخ الميلاد أو البريد الإلكتروني في عنوان الصفحة أو رابط المشاركة أو أسماء أحداث التحليلات. كما أن المشاركة تستخدم نصًا عامًا دون إضافة بيانات شخصية إلى الرابط.',
                    'قد تختلف نتائج التحويل الهجري قليلًا بين التقويمات الحسابية والرؤية الشرعية أو التقويمات الرسمية في بعض الدول، لذلك يعرض الموقع نتيجة عملية للمساعدة ولا يستبدل المراجع الرسمية عند وجود قرار أو معاملة تعتمد على التاريخ.',
                ],
            },
        ],
    },
    clock: {
        sections: [
            {
                title: 'دليل أدوات الساعة والوقت',
                paragraphs: [
                    'تساعدك صفحة الساعة على التعامل مع الوقت بصيغته اليومية والعملية: تحويل الوقت من نظام 24 ساعة إلى نظام 12 ساعة، معرفة الساعة الحالية، وحساب فرق التوقيت بين مدينتين من خلال البحث عن اسم المدينة بدل الاختيار من قائمة محدودة.',
                    'هذه الأدوات مفيدة عند ترتيب الاجتماعات، متابعة مواعيد السفر، قراءة الجداول الرسمية، أو تحويل الوقت المكتوب بصيغة 13:30 إلى صيغة يومية واضحة مثل 1:30 مساءً.',
                ],
            },
            {
                title: 'كيف تستفيد من الصفحة؟',
                paragraphs: [
                    'ابدأ بتحويل الساعة إذا كان لديك وقت محدد وتريد قراءته بصيغة أبسط. وعند الحاجة للتواصل مع شخص في مدينة أخرى، استخدم أداة فرق التوقيت لعرض الفارق بالساعات مع الوقت الحالي في المدينتين بدون تفاصيل طويلة.',
                ],
                items: [
                    'تحويل 24 إلى 12: يحول الساعة والدقيقة إلى صيغة صباحًا أو مساءً.',
                    'الساعة الحالية: تعرض الوقت حسب المدينة أو الموقع بعد موافقة المتصفح.',
                    'فرق التوقيت: يقارن بين مدينتين ويعرض الفارق المختصر بينهما.',
                    'مشاركة النتيجة: تنشئ نصًا واضحًا يمكن إرساله دون بيانات شخصية.',
                ],
            },
            {
                title: 'ملاحظات حول الموقع والدقة',
                paragraphs: [
                    'عند السماح باستخدام الموقع الحالي، يعتمد المتصفح على إذنك المباشر لتحديد المنطقة الزمنية المناسبة، ولا يتم حفظ إحداثياتك في قاعدة البيانات. يمكنك أيضًا البحث يدويًا عن مدينة أخرى في أي وقت.',
                    'قد تختلف أسماء المدن أو المناطق الزمنية حسب مزود بيانات المواقع، لذلك تعرض الأداة اسم المدينة الذي أدخلته أنت في النتيجة لتبقى الرسالة مختصرة وواضحة.',
                ],
            },
        ],
    },
    weather: {
        sections: [
            {
                title: 'دليل قراءة الطقس',
                paragraphs: [
                    'تعرض صفحة الطقس ملخصًا عمليًا لحالة الجو الحالية: درجة الحرارة، الإحساس الحراري، الرطوبة، سرعة الرياح، توقع هطول المطر، ومؤشر UV. الهدف أن ترى أهم المؤشرات في بطاقة واحدة بدل التنقل بين أكثر من مصدر.',
                    'يمكنك البحث باسم المدينة أو استخدام زر الموقع الحالي بعد موافقة المتصفح. عند السماح بالموقع، تستخدم الصفحة الإحداثيات لعرض طقس أقرب مدينة متاحة دون حفظ موقعك في قاعدة البيانات.',
                ],
            },
            {
                title: 'ما الذي تعنيه المؤشرات؟',
                paragraphs: [
                    'درجة الحرارة تخبرك بالقراءة الأساسية، بينما الإحساس الحراري يوضح الشعور المتوقع في الخارج. الرطوبة والرياح تساعدان في تقدير الراحة، وتوقع المطر يعطيك فكرة سريعة عن احتمالية الهطول، أما مؤشر UV فيفيد عند التخطيط للخروج نهارًا.',
                ],
                items: [
                    'الإحساس الحراري: قد يكون أعلى أو أقل من درجة الحرارة حسب الرطوبة والرياح.',
                    'توقع المطر: يعرض نسبة احتمالية الهطول بدل الاكتفاء بوصف عام.',
                    'مؤشر UV: يساعدك على تجنب التعرض الطويل للشمس وقت الظهيرة.',
                    'توقعات الأيام القادمة: تمنحك نظرة مختصرة للتخطيط القريب.',
                ],
            },
            {
                title: 'مصدر البيانات وحدودها',
                paragraphs: [
                    'تعتمد بيانات الطقس على خدمة Open-Meteo العامة، وقد تختلف النتائج قليلًا حسب وقت التحديث والنموذج الجوي أو أقرب نقطة بيانات للمدينة. لذلك استخدم الصفحة كمؤشر عملي سريع، وراجع الجهات الرسمية عند وجود تنبيه جوي أو قرار سفر مهم.',
                    'لا يطلب الموقع إذن الموقع إلا لتحسين عرض الطقس أو الوقت عند رغبتك، ويمكنك دائمًا استخدام البحث اليدوي بدون مشاركة الموقع الحالي.',
                ],
            },
        ],
    },
};

const toolContentEn = {
    date: { sections: [
        { title: 'Date Tools Guide', paragraphs: ['Use this page to calculate age, convert between Gregorian and Hijri dates, and find the duration between two dates without creating an account.'] },
        { title: 'Accuracy and Privacy', paragraphs: ['Shared links do not include birth dates or personal inputs. Hijri conversion may differ by one day from an official calendar, so verify sensitive dates with the relevant authority.'] },
    ] },
    clock: { sections: [
        { title: 'Time Tools Guide', paragraphs: ['Convert 24-hour time to 12-hour time, view the current time, and compare time zones between two cities.'] },
        { title: 'Location and Accuracy', paragraphs: ['Location access is optional and coordinates are not stored in the database. Time differences may change with daylight saving rules.'] },
    ] },
    weather: { sections: [
        { title: 'Weather Guide', paragraphs: ['View temperature, feels-like temperature, humidity, wind, rain probability, UV index and a five-day forecast in one place.'] },
        { title: 'Data Source and Limits', paragraphs: ['Weather data comes from Open-Meteo and may vary by update time and the nearest forecast point. Follow official alerts for severe weather and travel decisions.'] },
    ] },
};

const subtoolContent = {
    ar: {
        date: {
            ageCalc: { sections: [
                {
                    title: 'كيف تستخدم حاسبة العمر؟',
                    paragraphs: [
                        'اختر التقويم الميلادي أو الهجري ثم أدخل يوم وشهر وسنة الميلاد واضغط حساب العمر. تعرض الحاسبة العمر المنقضي بالسنوات والأشهر والأيام، وتساعدك على قراءة النتيجة بطريقة أوضح من طرح السنوات فقط.',
                        'تفيد حاسبة العمر في التخطيط للمواعيد والمتطلبات العمرية والاستخدام الشخصي. وعند الحاجة إلى إثبات رسمي للعمر، اعتمد التاريخ والبيانات الواردة في الوثيقة الرسمية لدى الجهة المختصة.',
                    ],
                },
                {
                    title: 'الفرق بين العمر الميلادي والهجري',
                    paragraphs: ['السنة الهجرية أقصر من السنة الميلادية، لذلك قد يظهر العمر الهجري بعدد سنوات أكبر قليلًا. هذا اختلاف طبيعي بين التقويمين ولا يعني وجود خطأ في تاريخ الميلاد.'],
                    items: ['تأكد من اختيار نوع التقويم قبل إدخال التاريخ.', 'راجع اليوم والشهر والسنة قبل الحساب.', 'لا يُضاف تاريخ الميلاد إلى رابط الصفحة أو عنوان المشاركة.'],
                },
            ] },
            dateConverter: { sections: [
                {
                    title: 'تحويل التاريخ بين الميلادي والهجري',
                    paragraphs: [
                        'تتيح أداة تحويل التاريخ إدخال تاريخ ميلادي لمعرفة ما يقابله هجريًا، أو إدخال تاريخ هجري لتحويله إلى الميلادي. اختر اتجاه التحويل ثم حدد اليوم والشهر والسنة للحصول على النتيجة مباشرة.',
                        'تناسب الأداة المواعيد والمناسبات ومراجعة التواريخ اليومية. قد يختلف التاريخ الهجري يومًا واحدًا عن بعض التقاويم الرسمية بسبب طريقة اعتماد بداية الشهر، لذلك راجع المرجع الرسمي للمعاملات الحساسة.',
                    ],
                },
                {
                    title: 'نصائح لنتيجة صحيحة',
                    paragraphs: ['استخدم التاريخ كما هو مكتوب في المصدر، ولا تبدل بين أرقام الأشهر الميلادية والهجرية. بعد التحويل يمكنك مشاركة النتيجة كنص دون تضمين بياناتك داخل عنوان الصفحة.'],
                    items: ['اختر التقويم المصدر أولًا.', 'تحقق من ترتيب اليوم والشهر والسنة.', 'قارن النتيجة بالتقويم الرسمي عند الحاجة النظامية.'],
                },
            ] },
            durationCalc: { sections: [
                {
                    title: 'حساب المدة بين تاريخين',
                    paragraphs: [
                        'أدخل التاريخ الأول والتاريخ الثاني لتحسب الأداة المدة الفاصلة بينهما مع مراعاة اختلاف أطوال الأشهر والسنوات. يمكنك استخدام التاريخ الميلادي أو الهجري بحسب نوع المدة التي تريد حسابها.',
                        'تصلح النتيجة لحساب مدة خدمة أو دراسة أو عقد، ومعرفة الوقت المنقضي أو المتبقي حتى موعد قادم. إذا كان التاريخان متطابقين فستوضح الأداة أن المدة هي اليوم نفسه.',
                    ],
                },
                {
                    title: 'متى يفيد حساب فرق التاريخ؟',
                    paragraphs: ['الحساب التقويمي أدق من ضرب عدد السنوات أو الأشهر في قيمة ثابتة، لأن عدد الأيام يختلف من شهر إلى آخر وقد تدخل سنة كبيسة ضمن الفترة.'],
                    items: ['حساب مدة العقود والاشتراكات.', 'معرفة الفترة بين مناسبتين.', 'حساب الأيام المتبقية لموعد مستقبلي.'],
                },
            ] },
        },
        clock: {
            timeConverter: { sections: [
                {
                    title: 'تحويل الوقت من 24 إلى 12 ساعة',
                    paragraphs: [
                        'اختر الساعة والدقيقة بصيغة 24 ساعة لتحصل على الوقت المقابل بصيغة 12 ساعة مع تحديد صباحًا أو مساءً. تساعد الأداة على قراءة الجداول الرسمية ومواعيد الرحلات والعمل بسهولة.',
                        'تبدأ صيغة 24 ساعة من 00:00 وتنتهي عند 23:59، بينما تقسم صيغة 12 ساعة اليوم إلى فترتين. الساعة 00:00 تعني 12:00 صباحًا، والساعة 12:00 تعني 12:00 ظهرًا.',
                    ],
                },
                {
                    title: 'أمثلة سريعة للتحويل',
                    paragraphs: ['تبقى الدقائق كما هي أثناء التحويل، ويتغير رقم الساعة والفترة فقط عند الحاجة.'],
                    items: ['08:30 تساوي 8:30 صباحًا.', '13:30 تساوي 1:30 مساءً.', '23:45 تساوي 11:45 مساءً.'],
                },
            ] },
            timezoneDiff: { sections: [
                {
                    title: 'حساب فرق التوقيت بين مدينتين',
                    paragraphs: [
                        'اكتب اسم المدينة الأولى والثانية ثم اضغط حساب لعرض الوقت الحالي في كل مدينة والفرق بينهما بالساعات. تعتمد الأداة على المنطقة الزمنية الفعلية للمدينة بدل استخدام فرق ثابت محفوظ مسبقًا.',
                        'تفيد النتيجة عند ترتيب اجتماع دولي أو متابعة رحلة أو اختيار وقت مناسب للاتصال. وقد يتغير الفرق خلال السنة عندما تطبق إحدى المدينتين التوقيت الصيفي.',
                    ],
                },
                {
                    title: 'الحصول على مقارنة دقيقة',
                    paragraphs: ['اكتب اسم المدينة والدولة عند وجود أكثر من مدينة بالاسم نفسه، وأعد الحساب قريبًا من الموعد المطلوب للتأكد من قواعد التوقيت الصيفي الحالية.'],
                    items: ['مقارنة أوقات الاجتماعات.', 'متابعة الوصول والمغادرة.', 'تحويل موعد بث دولي إلى وقت مدينتك.'],
                },
            ] },
        },
        weather: {
            weatherSearch: { sections: [
                {
                    title: 'البحث عن الطقس حسب المدينة',
                    paragraphs: [
                        'اكتب اسم المدينة لعرض درجة الحرارة الحالية والإحساس الحراري والرطوبة والرياح واحتمال المطر وتوقعات الأيام القادمة. يمكنك أيضًا استخدام زر الموقع بعد منح المتصفح الإذن.',
                        'عند تشابه أسماء المدن، اكتب اسم الدولة مع المدينة للحصول على نتيجة أدق. لا يحفظ الموقع إحداثياتك في قاعدة البيانات، ويمكنك الاعتماد على البحث اليدوي دون مشاركة موقعك.',
                    ],
                },
                {
                    title: 'قراءة نتيجة البحث',
                    paragraphs: ['تعتمد البيانات على أحدث توقع متاح من Open-Meteo وقد تختلف قليلًا حسب وقت التحديث وأقرب نقطة تنبؤ. راجع الجهة الرسمية عند وجود تحذير جوي شديد.'],
                },
            ] },
            currentWeather: { sections: [
                {
                    title: 'فهم حالة الطقس الحالية',
                    paragraphs: [
                        'ابحث عن مدينتك لعرض درجة الحرارة الفعلية والمحسوسة والرطوبة وسرعة الرياح واحتمال هطول المطر ومؤشر الأشعة فوق البنفسجية في بطاقة واحدة.',
                        'قد تختلف درجة الإحساس عن القراءة الفعلية بسبب الرطوبة والرياح وأشعة الشمس. لهذا تساعدك المؤشرات مجتمعة على اتخاذ قرار أفضل قبل الخروج بدل الاعتماد على درجة الحرارة وحدها.',
                    ],
                },
                {
                    title: 'متى تتغير القراءة؟',
                    paragraphs: ['تتحدث بيانات الطقس مع مصدر التوقع، وقد تظهر فروق محدودة عن محطة محلية بسبب وقت القياس أو موقع نقطة البيانات.'],
                    items: ['راجع احتمال المطر قبل التنقل.', 'انتبه لمؤشر UV وقت الظهيرة.', 'تابع التنبيهات الرسمية عند الطقس الشديد.'],
                },
            ] },
            outdoorAdvice: { sections: [
                {
                    title: 'نصيحة الخروج حسب الطقس',
                    paragraphs: [
                        'ابحث عن المدينة لتنشئ الأداة نصيحة مختصرة تعتمد على الإحساس الحراري واحتمال المطر ومؤشر UV والحالة الجوية الحالية. تساعد النصيحة في اختيار وقت الخروج أو الحاجة إلى مظلة وحماية من الشمس.',
                        'النصيحة إرشادية للاستخدام اليومي ولا تمثل تحذيرًا رسميًا أو توصية طبية. عند وجود عاصفة أو حرارة شديدة أو قرار سفر، اتبع تعليمات الجهة الرسمية في منطقتك.',
                    ],
                },
                {
                    title: 'العوامل المستخدمة في النصيحة',
                    items: ['الحرارة والإحساس الحراري.', 'احتمال المطر والهطول الحالي.', 'مؤشر الأشعة فوق البنفسجية.'],
                },
            ] },
            forecast: { sections: [
                {
                    title: 'توقعات الطقس للأيام الخمسة القادمة',
                    paragraphs: [
                        'ابحث عن المدينة لعرض أعلى وأدنى درجة حرارة والحالة المتوقعة واحتمال المطر لكل يوم من الأيام القادمة. يمنحك الملخص رؤية سريعة للتخطيط للعمل والرحلات والأنشطة الخارجية.',
                        'تكون التوقعات الأقرب زمنيًا أكثر ثباتًا عادةً، بينما قد تتغير الأيام الأبعد مع تحديث النماذج الجوية. ارجع إلى الصفحة قبل الموعد للحصول على أحدث قراءة متاحة.',
                    ],
                },
                {
                    title: 'استخدام التوقع اليومي',
                    paragraphs: ['قارن درجات الحرارة واحتمال المطر بين الأيام لاختيار الموعد الأنسب، وراجع التنبيهات الرسمية عند توقع ظروف قوية أو رحلة طويلة.'],
                    items: ['التخطيط للأنشطة الخارجية.', 'اختيار الملابس المناسبة.', 'متابعة احتمال الأمطار خلال الأسبوع.'],
                },
            ] },
        },
    },
    en: {
        date: {
            ageCalc: { sections: [
                { title: 'How to Use the Age Calculator', paragraphs: ['Choose the Gregorian or Hijri calendar, enter the birth day, month and year, then calculate the completed age in years, months and days. This gives a clearer result than subtracting birth years alone.', 'The calculator is useful for personal planning and checking age requirements. Use an official identity document whenever an authority requires legally verified age information.'] },
                { title: 'Gregorian and Hijri Age', paragraphs: ['A Hijri year is shorter than a Gregorian year, so the Hijri age may contain slightly more completed years. This is a normal calendar difference.'], items: ['Select the correct calendar before entering the date.', 'Review the day, month and year before calculating.', 'Birth dates are not added to the page URL.'] },
            ] },
            dateConverter: { sections: [
                { title: 'Convert Gregorian and Hijri Dates', paragraphs: ['Enter a Gregorian date to find its Hijri equivalent, or switch direction to convert a Hijri date to Gregorian. Select the source calendar and provide the day, month and year for an immediate result.', 'Hijri dates can differ by one day between calculated calendars and official month declarations. Verify sensitive legal or religious dates with the relevant official calendar.'] },
                { title: 'Tips for an Accurate Conversion', paragraphs: ['Use the date exactly as written in the source and do not mix Gregorian and Hijri month numbers. The result can be shared as text without placing your input in the page address.'], items: ['Choose the source calendar first.', 'Check the order of day, month and year.', 'Verify official transactions with an approved calendar.'] },
            ] },
            durationCalc: { sections: [
                { title: 'Calculate the Difference Between Two Dates', paragraphs: ['Enter a start date and an end date to calculate the calendar duration between them. The tool accounts for different month lengths and supports both Gregorian and Hijri input.', 'Use the result for a contract, subscription, study period or countdown to a future date. Matching dates are correctly reported as the same day.'] },
                { title: 'Why Calendar Difference Matters', paragraphs: ['Calendar calculation is more reliable than multiplying years or months by a fixed number because month lengths vary and leap years may occur within the period.'], items: ['Measure service or contract periods.', 'Compare two important dates.', 'Count the time remaining until an event.'] },
            ] },
        },
        clock: {
            timeConverter: { sections: [
                { title: 'Convert 24-Hour Time to 12-Hour Time', paragraphs: ['Select an hour and minute in 24-hour format to see the matching 12-hour time with AM or PM. The converter makes schedules, travel times and work timetables easier to read.', 'The 24-hour day runs from 00:00 to 23:59. In 12-hour format, 00:00 becomes 12:00 AM and 12:00 becomes 12:00 PM.'] },
                { title: 'Quick Conversion Examples', paragraphs: ['Minutes stay unchanged during conversion; only the hour and day period change when required.'], items: ['08:30 is 8:30 AM.', '13:30 is 1:30 PM.', '23:45 is 11:45 PM.'] },
            ] },
            timezoneDiff: { sections: [
                { title: 'Find the Time Difference Between Cities', paragraphs: ['Enter two city names to view the current local time in each place and the difference in hours. The calculator resolves the actual time zone instead of relying on a permanently stored offset.', 'Use it to schedule international meetings, follow a flight or choose a suitable call time. The difference may change when either city observes daylight saving time.'] },
                { title: 'Get a Reliable Comparison', paragraphs: ['Add the country when multiple cities share the same name, and calculate again close to the event to include current daylight-saving rules.'], items: ['Coordinate meetings and calls.', 'Compare arrival and departure times.', 'Convert an international broadcast to local time.'] },
            ] },
        },
        weather: {
            weatherSearch: { sections: [
                { title: 'Search Weather by City', paragraphs: ['Enter a city to view current temperature, feels-like temperature, humidity, wind, rain probability and the upcoming forecast. You can also use location after granting browser permission.', 'Add the country when city names are ambiguous. Coordinates are not stored in the site database, and manual search works without sharing your current location.'] },
                { title: 'Reading Search Results', paragraphs: ['Data comes from the latest available Open-Meteo forecast and may vary by update time or forecast point. Follow official alerts during severe weather.'] },
            ] },
            currentWeather: { sections: [
                { title: 'Understand Current Weather', paragraphs: ['Search for a city to see actual and feels-like temperature, humidity, wind speed, rain probability and UV index in one place.', 'Feels-like temperature may differ because of humidity, wind and sunshine. Reading the indicators together gives a better picture than temperature alone.'] },
                { title: 'When Does the Reading Change?', paragraphs: ['Weather data updates with the forecast provider and may differ slightly from a local station because of measurement time or location.'], items: ['Check rain probability before travelling.', 'Watch the UV index around midday.', 'Follow official alerts in severe conditions.'] },
            ] },
            outdoorAdvice: { sections: [
                { title: 'Outdoor Advice Based on Weather', paragraphs: ['Search for a city to generate concise advice based on feels-like temperature, rain probability, UV index and current conditions. It can help you choose a suitable time, umbrella or sun protection.', 'The advice is for everyday guidance and is not an official warning or medical recommendation. Follow local authorities during storms, extreme heat or travel decisions.'] },
                { title: 'Factors Used for the Advice', items: ['Temperature and feels-like temperature.', 'Rain probability and current precipitation.', 'Ultraviolet index.'] },
            ] },
            forecast: { sections: [
                { title: 'Five-Day Weather Forecast', paragraphs: ['Search for a city to view expected high and low temperatures, general conditions and rain probability for each coming day. The summary supports planning for work, travel and outdoor activities.', 'Near-term forecasts are generally more stable, while later days can change as models update. Return before the event for the latest available reading.'] },
                { title: 'Use the Daily Forecast', paragraphs: ['Compare temperatures and rain probability across days to choose a suitable time, and check official alerts for severe conditions or long trips.'], items: ['Plan outdoor activities.', 'Choose suitable clothing.', 'Track rain probability through the week.'] },
            ] },
        },
    },
};

export default function ToolSeoContent({ tool, subtool = '' }) {
    const { lang } = useSiteContext();
    const content = subtool
        ? subtoolContent[lang === 'en' ? 'en' : 'ar']?.[tool]?.[subtool]
        : lang === 'en'
            ? toolContentEn[tool]
            : toolContent[tool];
    if (!content) return null;

    return (
        <div className="seo-sections-wrapper tool-seo-content">
            {content.sections.map((section) => (
                <section className="seo-card tool-seo-card" key={section.title}>
                    <h2>{section.title}</h2>
                    {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    {Array.isArray(section.items) && section.items.length > 0 && (
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </div>
    );
}
