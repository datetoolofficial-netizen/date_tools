export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_MEDIA_CATEGORIES = new Set([
    'logo',
    'favicon',
    'ads',
    'link-preview',
    'app-icon',
    'pwa-shortcut-date',
    'pwa-shortcut-clock',
    'pwa-shortcut-weather',
]);

const ALLOWED_TYPES = new Map([
    ['image/png', 'png'],
    ['image/jpeg', 'jpg'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
    ['image/x-icon', 'ico'],
    ['image/vnd.microsoft.icon', 'ico'],
]);

const FALLBACK_EXTENSION_TYPES = new Map([
    ['png', 'image/png'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
    ['gif', 'image/gif'],
    ['ico', 'image/x-icon'],
]);

export function getSafeMediaCategory(value) {
    const category = String(value || '').trim().toLowerCase();
    return ALLOWED_MEDIA_CATEGORIES.has(category) ? category : '';
}

export function getAllowedImageInfo(file = {}) {
    const extensionFromType = ALLOWED_TYPES.get(file.type);
    if (extensionFromType) return { extension: extensionFromType, contentType: file.type };
    if (file.type && file.type !== 'application/octet-stream') return null;

    const extension = String(file.name || '').toLowerCase().split('.').pop()?.replace(/[^a-z0-9]/g, '') || '';
    const contentType = FALLBACK_EXTENSION_TYPES.get(extension);
    if (!contentType) return null;
    return { extension: extension === 'jpeg' ? 'jpg' : extension, contentType };
}

export function hasExpectedImageSignature(bytes, contentType) {
    if (!(bytes instanceof Uint8Array) || bytes.length < 12) return false;
    if (contentType === 'image/png') {
        return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
            .every((value, index) => bytes[index] === value);
    }
    if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (contentType === 'image/x-icon' || contentType === 'image/vnd.microsoft.icon') {
        return bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00;
    }

    const header = new TextDecoder('ascii').decode(bytes.slice(0, 12));
    if (contentType === 'image/gif') return header.startsWith('GIF87a') || header.startsWith('GIF89a');
    if (contentType === 'image/webp') return header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP';
    return false;
}
