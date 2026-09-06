import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

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

        expect(adSlot).toContain('privacyConsent?.marketing === true');
        expect(adSlot).toContain('googleAd?.enabledWhenNoAdvertiser');
        expect(adSlot).toContain('ADSENSE_CLIENT_PATTERN.test(client)');
        expect(adSlot).toContain('ADSENSE_SLOT_PATTERN.test(slot)');
    });
});
