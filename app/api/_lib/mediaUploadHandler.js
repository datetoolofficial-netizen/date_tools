import {
    getSafeMediaCategory,
    validateImageUpload,
} from './mediaValidation';
import { ADMIN_PERMISSIONS } from '../../adminAccess';
import { hasAdminPermission } from './adminPermissions';

function jsonResponse(body, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

function canAdminUploadCategory(profile, category) {
    const identityCategories = new Set([
        'logo', 'favicon', 'link-preview', 'app-icon',
        'pwa-shortcut-date', 'pwa-shortcut-clock', 'pwa-shortcut-weather',
    ]);

    if (identityCategories.has(category)) {
        return hasAdminPermission(profile, [ADMIN_PERMISSIONS.SITE_IDENTITY_UPDATE, 'identity']);
    }

    if (category === 'seo-share') {
        return hasAdminPermission(profile, [ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE, 'tool-management']);
    }

    if (category === 'ads') {
        return hasAdminPermission(profile, [ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE, ADMIN_PERMISSIONS.ADS_SETTINGS_UPDATE]);
    }

    return false;
}

function canAdvertiserUploadAds(profile) {
    const role = profile?.role?.stringValue || 'owner';
    return ['owner', 'organization_admin', 'campaign_manager', 'campaign_editor'].includes(role);
}

function getSafeFileName(name) {
    return String(name || 'image')
        .toLowerCase()
        .replace(/\.[^.]+$/g, '')
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'image';
}

export async function processAuthorizedMediaUpload({
    request,
    uploader,
    bucket,
    writeAuditEvent = async () => {},
}) {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = getSafeMediaCategory(formData.get('category'));

    if (!category) {
        return jsonResponse({ ok: false, error: 'invalid_category' }, 400);
    }

    if (uploader.type === 'advertiser' && (category !== 'ads' || !canAdvertiserUploadAds(uploader.profile))) {
        return jsonResponse({ ok: false, error: 'forbidden_category' }, 403);
    }
    if (uploader.type === 'admin' && !canAdminUploadCategory(uploader.profile, category)) {
        return jsonResponse({ ok: false, error: 'forbidden_category' }, 403);
    }

    if (!(file instanceof File)) {
        return jsonResponse({ ok: false, error: 'missing_file' }, 400);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validateImageUpload(file, bytes);
    if (!validation.ok) {
        return jsonResponse({ ok: false, error: validation.error }, 400);
    }

    const { imageInfo } = validation;
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const safeName = getSafeFileName(file.name);
    const key = `${category}/${year}/${month}/${crypto.randomUUID()}-${safeName}.${imageInfo.extension}`;

    await bucket.put(key, bytes, {
        httpMetadata: {
            contentType: imageInfo.contentType,
            cacheControl: 'public, max-age=31536000, immutable',
        },
        customMetadata: {
            originalName: file.name.slice(0, 120),
            category,
            uploadedBy: uploader.uid,
            uploaderType: uploader.type,
        },
    });

    try {
        await writeAuditEvent({
            actor: {
                uid: uploader.uid,
                email: uploader.email,
                role: uploader.profile?.platformRole?.stringValue || uploader.profile?.role?.stringValue || uploader.type,
            },
            action: 'media.uploaded',
            resourceType: 'media',
            resourceId: key,
            details: { source: uploader.type, category },
        });
    } catch {
        console.error('Unable to write media upload audit event.');
    }

    return jsonResponse({
        ok: true,
        key,
        url: `/api/media/${key}`,
        contentType: imageInfo.contentType,
        size: file.size,
    });
}
