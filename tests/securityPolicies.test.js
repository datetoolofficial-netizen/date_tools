import { describe, expect, it } from 'vitest';
import {
    evaluateAdminAccess,
    evaluateAdvertiserAccess,
    isValidSupportSubmission,
    normalizeSupportSubmission,
    validateCampaignSubmission,
} from '../app/securityPolicies';

describe('login policies', () => {
    it('requires an active administrator profile', () => {
        expect(evaluateAdminAccess(null)).toBe('missing');
        expect(evaluateAdminAccess({ active: false })).toBe('inactive');
        expect(evaluateAdminAccess({ active: true, role: 'manager' })).toBe('allowed');
        expect(evaluateAdminAccess({ active: true, role: 'assistant' })).toBe('allowed');
        expect(evaluateAdminAccess({ active: true })).toBe('unauthorized');
        expect(evaluateAdminAccess({ active: true, role: 'unknown' })).toBe('unauthorized');
    });

    it('handles advertiser verification and activation states', () => {
        expect(evaluateAdvertiserAccess({ emailVerified: false, profile: null })).toBe('unverified');
        expect(evaluateAdvertiserAccess({ emailVerified: true, profile: null })).toBe('missing');
        expect(evaluateAdvertiserAccess({ emailVerified: true, profile: { status: 'pending_email' } })).toBe('activate');
        expect(evaluateAdvertiserAccess({ emailVerified: true, profile: { status: 'active' } })).toBe('allowed');
        expect(evaluateAdvertiserAccess({ emailVerified: true, profile: {} })).toBe('inactive');
        expect(evaluateAdvertiserAccess({ emailVerified: true, profile: { status: 'suspended' } })).toBe('inactive');
    });
});

describe('support tickets', () => {
    it('normalizes and validates customer input', () => {
        const payload = normalizeSupportSubmission({
            senderName: '  Customer\u0000 Name ',
            senderEmail: 'USER@EXAMPLE.COM ',
            subject: ' Help ',
            message: ' A valid support message. ',
        });
        expect(payload.senderEmail).toBe('user@example.com');
        expect(payload.senderName).toBe('Customer Name');
        expect(isValidSupportSubmission(payload)).toBe(true);
    });

    it('rejects malformed email and short messages', () => {
        expect(isValidSupportSubmission(normalizeSupportSubmission({
            senderName: 'User', senderEmail: 'bad', subject: 'Help', message: 'short',
        }))).toBe(false);
    });
});

describe('campaign submission', () => {
    const valid = {
        campaignName: 'Summer',
        targetUrl: 'https://example.com/offer',
        imageUrl: '/api/media/ads/2026/08/ad.webp',
        startTime: '2026-08-12T10:00',
        endTime: '2026-08-13T10:00',
    };

    it('accepts a complete campaign', () => {
        expect(validateCampaignSubmission(valid)).toBe('');
    });

    it('rejects unsafe targets, external media and invalid periods', () => {
        expect(validateCampaignSubmission({ ...valid, targetUrl: 'http://example.com' })).toBe('invalid_target_url');
        expect(validateCampaignSubmission({ ...valid, imageUrl: 'https://example.com/ad.png' })).toBe('invalid_campaign_media');
        expect(validateCampaignSubmission({ ...valid, endTime: valid.startTime })).toBe('invalid_campaign_period');
    });
});
