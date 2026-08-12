import sanitize from 'sanitize-html';

const ALLOWED_TAGS = [
    'p', 'br', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's',
    'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote',
    'a', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img',
];

const ALLOWED_ATTRIBUTES = {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
    '*': ['dir', 'lang'],
};

export function sanitizeHtmlServer(value) {
    return sanitize(String(value || ''), {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: ALLOWED_ATTRIBUTES,
        allowedSchemes: ['https', 'mailto', 'tel'],
        allowProtocolRelative: false,
        enforceHtmlBoundary: true,
        transformTags: {
            a: (_tagName, attribs) => ({
                tagName: 'a',
                attribs: {
                    ...attribs,
                    ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
                },
            }),
            img: (_tagName, attribs) => ({
                tagName: 'img',
                attribs: { ...attribs, loading: attribs.loading || 'lazy' },
            }),
        },
    });
}
