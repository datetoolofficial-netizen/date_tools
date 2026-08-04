export default function ToolPageHero({ title, description, icon, className = '' }) {
    return (
        <div className={`tools-hero ${className}`.trim()}>
            <i className={icon}></i>
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </div>
    );
}
