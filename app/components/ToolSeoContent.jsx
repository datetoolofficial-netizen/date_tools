const toolContent = {
    clock: {
        guideTitle: 'دليل سريع لاستخدام أدوات الساعة',
        guideParagraphs: [
            'صفحة الساعة مصممة لتجعل التعامل مع الوقت أبسط: تحويل صيغة الساعة، معرفة الوقت الحالي، ومقارنة فرق التوقيت بين مدينتين بدون خطوات طويلة.',
            'استخدم تحويل 24 إلى 12 عندما تكون لديك ساعة بصيغة رسمية مثل 13:30 وتريد معرفة صيغتها اليومية. واستخدم فرق التوقيت عند ترتيب اتصال أو اجتماع بين مدينتين.',
        ],
        benefitTitle: 'متى تفيدك أدوات الوقت؟',
        benefits: [
            'تحويل المواعيد المكتوبة بنظام 24 ساعة إلى صيغة 12 ساعة بسرعة.',
            'مقارنة توقيت مدينتين قبل الاتصال أو جدولة الاجتماعات.',
            'عرض الوقت بناءً على المدينة أو الموقع الحالي بعد موافقة المتصفح.',
        ],
    },
    weather: {
        guideTitle: 'دليل سريع لقراءة الطقس',
        guideParagraphs: [
            'تعرض صفحة الطقس ملخصًا عمليًا لحالة الجو الحالية، الإحساس الحراري، الرطوبة، سرعة الرياح، نسبة توقع المطر، ومؤشر UV في مكان واحد.',
            'يمكنك البحث باسم المدينة أو استخدام زر الموقع الحالي بعد موافقة المتصفح. لا يتم حفظ إحداثياتك في قاعدة البيانات، ويستخدم الموقع هذه البيانات فقط لعرض الحالة الأقرب لك.',
        ],
        benefitTitle: 'كيف تستفيد من بيانات الطقس؟',
        benefits: [
            'راجع الإحساس الحراري قبل الخروج، خصوصًا في الأيام شديدة الحرارة.',
            'تابع نسبة توقع المطر بدل الاكتفاء بوصف عام للحالة الجوية.',
            'استخدم مؤشر UV لاختيار وقت خروج أكثر راحة وأمانًا.',
        ],
        source: 'مصدر بيانات الطقس: Open-Meteo، وقد تختلف النتائج قليلًا حسب وقت التحديث والنموذج الجوي الأقرب للمدينة.',
    },
};

export default function ToolSeoContent({ tool }) {
    const content = toolContent[tool];
    if (!content) return null;

    return (
        <div className="seo-sections-wrapper tool-seo-content">
            <section className="seo-card">
                <h2>{content.guideTitle}</h2>
                {content.guideParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </section>

            <section className="seo-card">
                <h2>{content.benefitTitle}</h2>
                <ul>
                    {content.benefits.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                {content.source && <p className="seo-source-note">{content.source}</p>}
            </section>
        </div>
    );
}

