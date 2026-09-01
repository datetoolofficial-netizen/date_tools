import { buildManagedToolMetadata } from '../../toolSeoServer';
import EnglishToolPage from '../EnglishToolPage';

export async function generateMetadata() {
    return buildManagedToolMetadata('weather', '', 'en');
}

export default function EnglishWeatherPage() {
    return <EnglishToolPage toolKey="weather" />;
}
