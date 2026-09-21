import { buildManagedToolMetadata } from '../../toolSeoServer';
import EnglishToolPage from '../../en/EnglishToolPage';

export async function generateMetadata() {
    return buildManagedToolMetadata('date', '', 'en');
}

export default function EnglishDatePage() {
    return <EnglishToolPage toolKey="date" />;
}
