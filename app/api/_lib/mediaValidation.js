export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 8192;
export const MAX_IMAGE_PIXELS = 40_000_000;

export const ALLOWED_MEDIA_CATEGORIES = new Set([
    'logo',
    'favicon',
    'ads',
    'link-preview',
    'seo-share',
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

function readUint16BE(bytes, offset) {
    return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUint16LE(bytes, offset) {
    return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint24LE(bytes, offset) {
    return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function readUint32BE(bytes, offset) {
    return ((bytes[offset] * 0x1000000)
        + (bytes[offset + 1] << 16)
        + (bytes[offset + 2] << 8)
        + bytes[offset + 3]);
}

function readAscii(bytes, offset, length) {
    return new TextDecoder('ascii').decode(bytes.slice(offset, offset + length));
}

function getJpegDimensions(bytes) {
    let offset = 2;
    const startOfFrameMarkers = new Set([
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
        0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
    ]);

    while (offset + 8 < bytes.length) {
        if (bytes[offset] !== 0xff) return null;
        while (bytes[offset] === 0xff) offset += 1;
        const marker = bytes[offset];
        offset += 1;

        if (marker === 0xd8 || marker === 0xd9) continue;
        if (offset + 1 >= bytes.length) return null;

        const segmentLength = readUint16BE(bytes, offset);
        if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
        if (startOfFrameMarkers.has(marker) && segmentLength >= 7) {
            return {
                width: readUint16BE(bytes, offset + 5),
                height: readUint16BE(bytes, offset + 3),
            };
        }
        offset += segmentLength;
    }

    return null;
}

export function getImageDimensions(bytes, contentType) {
    if (!(bytes instanceof Uint8Array)) return null;

    if (contentType === 'image/png' && bytes.length >= 24 && readAscii(bytes, 12, 4) === 'IHDR') {
        return { width: readUint32BE(bytes, 16), height: readUint32BE(bytes, 20) };
    }
    if (contentType === 'image/gif' && bytes.length >= 10) {
        return { width: readUint16LE(bytes, 6), height: readUint16LE(bytes, 8) };
    }
    if ((contentType === 'image/x-icon' || contentType === 'image/vnd.microsoft.icon') && bytes.length >= 8) {
        return { width: bytes[6] || 256, height: bytes[7] || 256 };
    }
    if (contentType === 'image/jpeg') return getJpegDimensions(bytes);
    if (contentType !== 'image/webp' || bytes.length < 25) return null;

    const chunkType = readAscii(bytes, 12, 4);
    if (chunkType === 'VP8X' && bytes.length >= 30) {
        return {
            width: readUint24LE(bytes, 24) + 1,
            height: readUint24LE(bytes, 27) + 1,
        };
    }
    if (chunkType === 'VP8 ' && bytes.length >= 30
        && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
        return {
            width: readUint16LE(bytes, 26) & 0x3fff,
            height: readUint16LE(bytes, 28) & 0x3fff,
        };
    }
    if (chunkType === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
        return {
            width: 1 + bytes[21] + ((bytes[22] & 0x3f) << 8),
            height: 1 + ((bytes[22] >> 6) & 0x03) + (bytes[23] << 2) + ((bytes[24] & 0x0f) << 10),
        };
    }

    return null;
}

export function validateImageUpload(file, bytes) {
    if (!file || typeof file.size !== 'number' || file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
        return { ok: false, error: 'invalid_file_size' };
    }

    const imageInfo = getAllowedImageInfo(file);
    if (!imageInfo) {
        return { ok: false, error: 'unsupported_image_type' };
    }

    if (!hasExpectedImageSignature(bytes, imageInfo.contentType)) {
        return { ok: false, error: 'invalid_image_content' };
    }

    const dimensions = getImageDimensions(bytes, imageInfo.contentType);
    if (!dimensions
        || dimensions.width <= 0
        || dimensions.height <= 0
        || dimensions.width > MAX_IMAGE_DIMENSION
        || dimensions.height > MAX_IMAGE_DIMENSION
        || dimensions.width * dimensions.height > MAX_IMAGE_PIXELS) {
        return { ok: false, error: 'invalid_image_dimensions' };
    }

    return { ok: true, imageInfo, dimensions };
}
