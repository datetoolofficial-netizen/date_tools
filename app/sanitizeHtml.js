const BLOCKED_TAGS = new Set([
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'link',
    'meta',
    'base',
    'form',
]);

const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'poster']);

function isSafeUrl(value) {
    const url = String(value || '').trim();
    if (!url) return true;
    if (url.startsWith('/') && !url.startsWith('//')) return true;

    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:';
    } catch {
        return false;
    }
}

function cleanElement(element) {
    const tagName = element.tagName?.toLowerCase();

    if (BLOCKED_TAGS.has(tagName)) {
        element.remove();
        return;
    }

    [...element.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value || '';

        if (name.startsWith('on')) {
            element.removeAttribute(attribute.name);
            return;
        }

        if (name === 'style') {
            element.removeAttribute(attribute.name);
            return;
        }

        if (URL_ATTRIBUTES.has(name) && !isSafeUrl(value)) {
            element.removeAttribute(attribute.name);
        }
    });

    [...element.children].forEach(cleanElement);
}

export function sanitizeHtml(html) {
    const value = String(html || '');
    if (!value) return '';

    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        return value
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+="[^"]*"/gi, '')
            .replace(/\son\w+='[^']*'/gi, '')
            .replace(/javascript:/gi, '');
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(`<div>${value}</div>`, 'text/html');
    const root = document.body.firstElementChild;

    if (!root) return '';

    [...root.children].forEach(cleanElement);

    return root.innerHTML;
}
