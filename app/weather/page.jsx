import ToolFaqSection from '../components/ToolFaqSection';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildToolJsonLd, buildToolMetadata, publicToolSeo } from '../seoConfig';
import WeatherPageClient from './WeatherPageClient';

export const metadata = buildToolMetadata('weather');

export default function WeatherPage() {
    const jsonLd = buildToolJsonLd('weather');

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WeatherPageClient />
            <ToolSeoContent tool="weather" />
            <ToolFaqSection items={publicToolSeo.weather.faq} />
        </>
    );
}
