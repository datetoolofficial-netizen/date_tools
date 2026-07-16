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
const ALLOWED_ATTRIBUTES = new Set([
    'href',
    'src',
    'alt',
    'title',
    'target',
    'rel',
    'dir',
    'align',
    'colspan',
    'rowspan',
    'style',
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
    'color',
    'background-color',
    'font-weight',
    'font-style',
    'text-decoration',
    'text-align',
    'font-size',
    'font-family',
    'line-height',
    'letter-spacing',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'direction',
    'unicode-bidi',
    'vertical-align',
    'list-style-type',
]);

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

function isSafeStyleValue(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return false;

    return !(
        normalized.includes('url(') ||
        normalized.includes('expression(') ||
        normalized.includes('javascript:') ||
        normalized.includes('data:') ||
        normalized.includes('@import') ||
        normalized.includes('var(') ||
        normalized.includes('position:') ||
        normalized.includes('behavior:')
    );
}

function sanitizeStyle(value) {
    const declarations = String(value || '')
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean);

    const safeDeclarations = [];

    declarations.forEach((declaration) => {
        const separatorIndex = declaration.indexOf(':');
        if (separatorIndex === -1) return;

        const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
        const styleValue = declaration.slice(separatorIndex + 1).trim();

        if (!ALLOWED_STYLE_PROPERTIES.has(property)) return;
        if (!isSafeStyleValue(styleValue)) return;

        safeDeclarations.push(`${property}: ${styleValue}`);
    });

    return safeDeclarations.join('; ');
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

        if (!ALLOWED_ATTRIBUTES.has(name) && !name.startsWith('aria-')) {
            element.removeAttribute(attribute.name);
            return;
        }

        if (name === 'style') {
            const safeStyle = sanitizeStyle(value);
            if (safeStyle) {
                element.setAttribute('style', safeStyle);
            } else {
                element.removeAttribute(attribute.name);
            }
            return;
        }

        if (URL_ATTRIBUTES.has(name) && !isSafeUrl(value)) {
            element.removeAttribute(attribute.name);
        }

        if (name === 'target' && value === '_blank') {
            element.setAttribute('rel', 'noopener noreferrer');
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
