import ToolSeoContent from '../components/ToolSeoContent';
import ToolPageHero from '../components/ToolPageHero';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';
import { serializeJsonLd } from '../safeJsonLd';
import WeatherPageClient from './WeatherPageClient';

export async function generateMetadata() {
    return buildManagedToolMetadata('weather');
}

export default async function WeatherPage() {
    const page = await getManagedToolPage('weather');
    const jsonLd = buildManagedToolJsonLd(page, page.settings.faqs);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <ToolPageHero title={page.title} description={page.description} icon="fa-solid fa-cloud-sun-rain" className="weather-hero" toolKey="weather" />
            <WeatherPageClient hideHero>
                <ToolSeoContent tool="weather" />
            </WeatherPageClient>
        </>
    );
}
