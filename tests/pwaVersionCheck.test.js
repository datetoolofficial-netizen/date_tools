import { describe, expect, it } from 'vitest';
import { compareVersions, shouldShowPwaUpdate } from '../app/pwaVersionCheck';
import { GET as getLatestAppVersion } from '../app/api/app-version/route';

describe('installed app version checks', () => {
    it('compares dotted versions numerically', () => {
        expect(compareVersions('0.3.41', '0.3.40')).toBe(1);
        expect(compareVersions('0.3.40', '0.3.40')).toBe(0);
        expect(compareVersions('0.3.9', '0.3.10')).toBe(-1);
    });

    it('shows only a newer release that was not dismissed', () => {
        expect(shouldShowPwaUpdate({ currentVersion: '0.3.40', latestVersion: '0.3.41' })).toBe(true);
        expect(shouldShowPwaUpdate({ currentVersion: '0.3.41', latestVersion: '0.3.41' })).toBe(false);
        expect(shouldShowPwaUpdate({ currentVersion: '0.3.40', latestVersion: '0.3.41', dismissedVersion: '0.3.41' })).toBe(false);
    });

    it('serves the latest release without browser or edge caching', async () => {
        const response = await getLatestAppVersion();
        const body = await response.json();

        expect(body.version).toBe('0.3.53');
        expect(body.publishedAt).toBe('2026-09-05');
        expect(response.headers.get('cache-control')).toContain('no-store');
    });
});
