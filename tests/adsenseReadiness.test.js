import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADSENSE_SITE_STATUS, canServeAdsense, normalizeAdsenseSiteStatus } from '../app/adsenseSettings';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('AdSense readiness', () => {
    it('publishes the account verification meta without loading ads globally', () => {
        const layout = readProjectFile('app', 'layout.jsx');

        expect(layout).toContain('<meta name="google-adsense-account" content={adsenseAccount} />');
        expect(layout).toContain('adsenseClientPattern.test(configuredAdsenseClient)');
        expect(layout).not.toContain('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
    });

    it('keeps ad loading behind marketing consent and a configured unit', () => {
        const adSlot = readProjectFile('app', 'components', 'PublicAdSlot.jsx');

        expect(adSlot).toContain('adsenseServingAllowed');
        expect(adSlot).toContain('canServeAdsense(configData)');
        expect(adSlot).toContain('privacyConsent?.marketing === true');
        expect(adSlot).toContain('googleAd?.enabledWhenNoAdvertiser');
        expect(adSlot).toContain('ADSENSE_CLIENT_PATTERN.test(client)');
        expect(adSlot).toContain('ADSENSE_SLOT_PATTERN.test(slot)');
    });

    it('keeps all prepared placements blocked until the site is explicitly approved', () => {
        expect(normalizeAdsenseSiteStatus()).toBe(ADSENSE_SITE_STATUS.UNDER_REVIEW);
        expect(normalizeAdsenseSiteStatus('unexpected')).toBe(ADSENSE_SITE_STATUS.UNDER_REVIEW);
        expect(canServeAdsense({ externalIntegrations: { adsenseSiteStatus: 'under_review' } })).toBe(false);
        expect(canServeAdsense({ externalIntegrations: { adsenseSiteStatus: 'paused' } })).toBe(false);
        expect(canServeAdsense({ externalIntegrations: { adsenseSiteStatus: 'approved' } })).toBe(true);
    });

    it('keeps the review status visible in administration and removes the unused legacy loader', () => {
        const adminSettings = readProjectFile('app', 'admin', 'ad-settings', 'page.jsx');
        const homeSections = readProjectFile('app', 'components', 'home', 'HomeSections.jsx');
        const placementIds = [
            'dateTop', 'dateMiddle', 'dateBottom',
            'clockTop', 'clockMiddle', 'clockBottom',
            'weatherTop', 'weatherMiddle', 'weatherBottom',
        ];

        expect(adminSettings).toContain('حالة نشر وحدات AdSense');
        expect(adminSettings).toContain('ADSENSE_SITE_STATUS.UNDER_REVIEW');
        placementIds.forEach((placementId) => expect(adminSettings).toContain(`id: '${placementId}'`));
        expect(homeSections).not.toContain('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
        expect(homeSections).not.toContain('export function TopAdSlot');
    });
});
