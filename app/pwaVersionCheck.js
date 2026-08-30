export function compareVersions(left = '', right = '') {
    const normalize = (value) => String(value)
        .trim()
        .replace(/^v/i, '')
        .split(/[.-]/)
        .map((part) => Number.parseInt(part, 10) || 0);

    const leftParts = normalize(left);
    const rightParts = normalize(right);
    const length = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < length; index += 1) {
        const difference = (leftParts[index] || 0) - (rightParts[index] || 0);
        if (difference !== 0) return difference > 0 ? 1 : -1;
    }

    return 0;
}

export function shouldShowPwaUpdate({ currentVersion, latestVersion, dismissedVersion = '' }) {
    if (!currentVersion || !latestVersion) return false;
    if (compareVersions(latestVersion, currentVersion) <= 0) return false;
    return dismissedVersion !== latestVersion;
}
