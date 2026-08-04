import HomePageClient from '../HomePageClient';
import ToolPageHero from '../components/ToolPageHero';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';

export async function generateMetadata() {
    return buildManagedToolMetadata('date', 'dateConverter');
}

export default async function DateConverterPage() {
    const page = await getManagedToolPage('date', 'dateConverter');

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildManagedToolJsonLd(page, page.settings.faqs)) }} />
            <ToolPageHero title={page.title} description={page.description} icon="fa-solid fa-arrows-rotate" className="date-tools-hero" />
            <HomePageClient focusTool="dateConverter" hideHero>
                <ToolSeoContent tool="date" subtool="dateConverter" />
            </HomePageClient>
        </>
    );
}
