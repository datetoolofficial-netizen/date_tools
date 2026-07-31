import { buildToolJsonLd, buildToolMetadata } from '../seoConfig';
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
        </>
    );
}
