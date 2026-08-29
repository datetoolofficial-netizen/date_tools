import ToolSeoContent from '../components/ToolSeoContent';
import ToolPageHero from '../components/ToolPageHero';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';
import { serializeJsonLd } from '../safeJsonLd';
import ClockPageClient from './ClockPageClient';

export async function generateMetadata() {
    return buildManagedToolMetadata('clock');
}

export default async function ClockPage() {
    const page = await getManagedToolPage('clock');
    const jsonLd = buildManagedToolJsonLd(page, page.settings.faqs);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <ToolPageHero title={page.title} description={page.description} icon="fa-solid fa-clock" className="clock-hero" toolKey="clock" />
            <ClockPageClient hideHero>
                <ToolSeoContent tool="clock" />
            </ClockPageClient>
        </>
    );
}
