'use client';

import { useSiteContext } from '../SiteContext';
import { getToolSettings } from '../toolSettings';

export default function ToolPageHero({ title, description, icon, className = '', toolKey = '', subtoolKey = '' }) {
    const { configData, lang } = useSiteContext();
    const settings = toolKey ? getToolSettings(configData, toolKey, lang) : null;
    const localizedSeo = subtoolKey ? settings?.subtoolSeo?.[subtoolKey] : settings?.seo;
    const displayedTitle = localizedSeo?.h1 || title;
    const displayedDescription = localizedSeo?.metaDescription || description;

    return (
        <div className={`tools-hero ${className}`.trim()}>
            <i className={icon}></i>
            <div>
                <h1>{displayedTitle}</h1>
                <p>{displayedDescription}</p>
            </div>
        </div>
    );
}
