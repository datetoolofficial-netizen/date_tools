import { resolveAdminRole } from './adminAccess';
import { normalizeAdvertiserRole } from './advertiserAccess';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanPlainText(value, maxLength) {
    return String(value || '')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

export function evaluateAdminAccess(profile) {
    if (!profile) return 'missing';
    if (profile.active !== true) return 'inactive';
    return resolveAdminRole(profile) ? 'allowed' : 'unauthorized';
}

export function evaluateAdvertiserAccess({ emailVerified, profile }) {
    if (!emailVerified) return 'unverified';
    if (!profile) return 'missing';
    if (profile.status === 'pending_email') return 'activate';
    if (profile.status !== 'active') return 'inactive';
    if (profile.role && !normalizeAdvertiserRole(profile.role)) return 'unauthorized';
    return 'allowed';
}

export function normalizeSupportSubmission(payload = {}) {
    return {
        senderName: cleanPlainText(payload.senderName, 80),
        senderEmail: cleanPlainText(payload.senderEmail, 120).toLowerCase(),
        subject: cleanPlainText(payload.subject, 120),
        message: cleanPlainText(payload.message, 1200),
    };
}

export function isValidSupportSubmission(payload = {}) {
    return Boolean(
        payload.senderName
        && EMAIL_PATTERN.test(payload.senderEmail || '')
        && payload.subject
        && String(payload.message || '').length >= 10
    );
}

export function validateCampaignSubmission(form = {}, { allowLocalMedia = false } = {}) {
    const start = Date.parse(form.startTime || '');
    const end = Date.parse(form.endTime || '');

    if (!String(form.campaignName || '').trim()) return 'missing_campaign_name';
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 'invalid_campaign_period';
    if (!/^https:\/\/[^\s]+$/i.test(String(form.targetUrl || '').trim())) return 'invalid_target_url';
    const mediaUrl = String(form.imageUrl || '').trim();
    const isManagedMedia = /^\/api\/media\/ads\//.test(mediaUrl);
    const isLocalDemoMedia = allowLocalMedia && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(mediaUrl);
    if (!isManagedMedia && !isLocalDemoMedia) return 'invalid_campaign_media';
    return '';
}
