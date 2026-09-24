export const MAX_CITY_ACCURACY_METERS = 20000;

export function getLocationCityLabel(data, accuracy) {
    if (!Number.isFinite(accuracy) || accuracy > MAX_CITY_ACCURACY_METERS) return '';
    if (typeof data?.lookupSource === 'string' && /ip/i.test(data.lookupSource)) return '';
    return [data?.city, data?.locality].find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}
