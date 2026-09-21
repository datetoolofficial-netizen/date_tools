import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const MAX_SCAN_BYTES = 2 * 1024 * 1024;

const SECRET_PATTERNS = Object.freeze([
    {
        id: 'private-key',
        regex: /-----BEGIN(?: RSA| EC| OPENSSH)? PRIVATE KEY-----\s*(?:\\n|\r?\n)[A-Za-z0-9+/=]{16,}/g,
    },
    { id: 'aws-access-key', regex: /AKIA[0-9A-Z]{16}/g },
    { id: 'github-token', regex: /gh[pousr]_[A-Za-z0-9]{30,}/g },
    { id: 'openai-key', regex: /sk-(?:proj-)?[A-Za-z0-9_-]{32,}/g },
    { id: 'stripe-secret', regex: /sk_(?:live|test)_[A-Za-z0-9]{16,}/g },
    { id: 'slack-token', regex: /xox[baprs]-[A-Za-z0-9-]{20,}/g },
    { id: 'google-api-key', regex: /AIzaSy[A-Za-z0-9_-]{30,}/g },
]);

function isAllowedMatch(path, patternId) {
    return patternId === 'google-api-key' && path === 'app/firebase.js';
}

export function findSecretMatches(path, text) {
    const findings = [];

    for (const pattern of SECRET_PATTERNS) {
        pattern.regex.lastIndex = 0;
        for (const match of text.matchAll(pattern.regex)) {
            if (isAllowedMatch(path, pattern.id)) continue;
            const line = text.slice(0, match.index).split(/\r?\n/).length;
            findings.push({ path, line, type: pattern.id });
        }
    }

    return findings;
}

function listRepositoryFiles() {
    const result = spawnSync(
        'git',
        ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        { cwd: root, encoding: 'buffer' },
    );

    if (result.error || result.status !== 0) {
        throw result.error || new Error('git ls-files failed');
    }

    return result.stdout
        .toString('utf8')
        .split('\0')
        .filter(Boolean);
}

export function scanRepository() {
    const findings = [];

    for (const path of listRepositoryFiles()) {
        const absolutePath = resolve(root, path);
        const normalizedPath = relative(root, absolutePath).replaceAll('\\', '/');
        if (!existsSync(absolutePath)) continue;
        const bytes = readFileSync(absolutePath);
        if (bytes.byteLength > MAX_SCAN_BYTES || bytes.includes(0)) continue;
        findings.push(...findSecretMatches(normalizedPath, bytes.toString('utf8')));
    }

    return findings;
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    const findings = scanRepository();
    if (findings.length > 0) {
        console.error('[security] Potential secrets detected. Values are intentionally hidden.');
        findings.forEach(({ path, line, type }) => console.error(`[security] ${path}:${line} (${type})`));
        process.exit(1);
    }

    console.log('[security] Secret scan passed. No unapproved credential patterns were found.');
}
