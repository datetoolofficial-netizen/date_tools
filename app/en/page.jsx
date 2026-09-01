import { buildManagedToolMetadata } from '../toolSeoServer';
import EnglishToolPage from './EnglishToolPage';

export async function generateMetadata() {
    return buildManagedToolMetadata('date', '', 'en');
}

export default function EnglishDatePage() {
    return <EnglishToolPage toolKey="date" />;
}
