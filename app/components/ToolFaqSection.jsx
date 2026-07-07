export default function ToolFaqSection({ items }) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <div className="seo-sections-wrapper">
            <section className="seo-card faq-card">
                <h2 className="seo-title">الأسئلة الشائعة</h2>
                {items.map((item) => (
                    <div className="faq-item" key={item.q}>
                        <h4 className="faq-q">{item.q}</h4>
                        <p className="faq-a">{item.a}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
