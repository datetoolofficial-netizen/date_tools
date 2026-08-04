import HomePageClient from '../HomePageClient';
import ToolPageHero from '../components/ToolPageHero';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';

export async function generateMetadata() {
    return buildManagedToolMetadata('date', 'durationCalc');
}

export default async function DateDifferencePage() {
    const page = await getManagedToolPage('date', 'durationCalc');

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildManagedToolJsonLd(page, page.settings.faqs)) }} />
            <ToolPageHero title={page.title} description={page.description} icon="fa-solid fa-hourglass-half" className="date-tools-hero" />
            <HomePageClient focusTool="durationCalc" hideHero>
                <ToolSeoContent tool="date" subtool="durationCalc" />
            </HomePageClient>
        </>
    );
}
