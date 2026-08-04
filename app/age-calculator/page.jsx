import HomePageClient from '../HomePageClient';
import ToolPageHero from '../components/ToolPageHero';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';

export async function generateMetadata() {
    return buildManagedToolMetadata('date', 'ageCalc');
}

export default async function AgeCalculatorPage() {
    const page = await getManagedToolPage('date', 'ageCalc');

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildManagedToolJsonLd(page, page.settings.faqs)) }} />
            <ToolPageHero title={page.title} description={page.description} icon="fa-solid fa-calculator" className="date-tools-hero" />
            <HomePageClient focusTool="ageCalc" hideHero>
                <ToolSeoContent tool="date" subtool="ageCalc" />
            </HomePageClient>
        </>
    );
}
