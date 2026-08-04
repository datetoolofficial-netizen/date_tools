import HomePageClient from './HomePageClient';
import ToolSeoContent from './components/ToolSeoContent';
import ToolPageHero from './components/ToolPageHero';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from './toolSeoServer';

export async function generateMetadata() {
    return buildManagedToolMetadata('date');
}

export default async function Home() {
    const page = await getManagedToolPage('date');
    const dateJsonLd = buildManagedToolJsonLd(page, page.settings.faqs);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(dateJsonLd) }}
            />
            <ToolPageHero
                title={page.title}
                description={page.description}
                icon="fa-solid fa-calendar-days"
                className="date-tools-hero"
            />
            <HomePageClient hideHero>
                <ToolSeoContent tool="date" />
            </HomePageClient>
        </>
    );
}
