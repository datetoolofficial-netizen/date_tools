import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeIndexNowUrl, normalizePagespeedTargetUrl } from '../app/api/_lib/urlPolicies';
import { validateCampaignSubmission } from '../app/securityPolicies';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('API abuse protection contracts', () => {
    it('prevents PageSpeed from being used as an SSRF proxy', () => {
        expect(normalizePagespeedTargetUrl('https://date-tool.com/weather?debug=1#part')).toBe('https://date-tool.com/weather');
        expect(() => normalizePagespeedTargetUrl('http://127.0.0.1/admin')).toThrow('invalid_target_url');
        expect(() => normalizePagespeedTargetUrl('https://attacker.example/')).toThrow('invalid_target_url');
        expect(() => normalizePagespeedTargetUrl('file:///etc/passwd')).toThrow('invalid_target_url');
    });

    it('submits only canonical site URLs to IndexNow', () => {
        expect(normalizeIndexNowUrl('/weather?release=old#part')).toBe('https://date-tool.com/weather');
        expect(normalizeIndexNowUrl('https://www.date-tool.com/en/clock')).toBe('https://date-tool.com/en/clock');
        expect(normalizeIndexNowUrl('https://attacker.example/date-tool.com')).toBe('');
        expect(normalizeIndexNowUrl('http://127.0.0.1:3000/admin')).toBe('');
    });

    it('rejects unsafe campaign destinations and unmanaged media', () => {
        const valid = {
            campaignName: 'Campaign',
            targetUrl: 'https://advertiser.example/offer',
            imageUrl: '/api/media/ads/2026/09/image.webp',
            startTime: '2026-09-14T10:00:00Z',
            endTime: '2026-09-15T10:00:00Z',
        };

        expect(validateCampaignSubmission(valid)).toBe('');
        expect(validateCampaignSubmission({ ...valid, targetUrl: 'javascript:alert(1)' })).toBe('invalid_target_url');
        expect(validateCampaignSubmission({ ...valid, targetUrl: 'http://advertiser.example' })).toBe('invalid_target_url');
        expect(validateCampaignSubmission({ ...valid, imageUrl: 'https://attacker.example/ad.svg' })).toBe('invalid_campaign_media');
    });

    it('covers IDOR and replay controls with executable tests', () => {
        const rulesTests = readProjectFile('emulator-tests', 'firestoreRules.test.js');
        const turnstileTests = readProjectFile('tests', 'turnstileServer.test.js');
        const statisticsRoute = readProjectFile('app', 'api', 'statistics', 'route.js');

        expect(rulesTests).toContain('denies cross-organization reads');
        expect(rulesTests).toContain("doc(managerDb, 'campaigns/cross-org')");
        expect(turnstileTests).toContain("'error-codes': ['timeout-or-duplicate']");
        expect(statisticsRoute).toContain('currentDocument: { exists: false }');
        expect(statisticsRoute).toContain('response.status === 409');
    });

    it('keeps real distributed rate limiting classified as an external Cloudflare control', () => {
        const humanChecklist = readProjectFile('docs', 'HUMAN_VERIFICATION_CHECKLIST.md');
        expect(humanChecklist).toContain('Rate Limiting');
        expect(humanChecklist).toContain('Cloudflare');
    });
});
