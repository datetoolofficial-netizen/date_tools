export const MAX_CITY_ACCURACY_METERS = 20000;

export function getLocationCityLabel(data) {
    if (typeof data?.lookupSource === 'string' && /ip/i.test(data.lookupSource)) return '';
    return [data?.city, data?.locality, data?.localityName].find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

export function getPhotonCityLabel(data) {
    for (const feature of Array.isArray(data?.features) ? data.features : []) {
        const place = feature?.properties;
        if (typeof place?.city === 'string' && place.city.trim()) return place.city.trim();
        if (place?.osm_key === 'place' && ['city', 'town', 'village', 'hamlet'].includes(place.osm_value)
            && typeof place.name === 'string' && place.name.trim()) return place.name.trim();
    }
    return '';
}

export async function resolveLocationLabel(latitude, longitude, lang) {
    const unavailable = { label: '', source: '' };
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90
        || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return unavailable;

    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        localityLanguage: lang === 'en' ? 'en' : 'ar',
    });

    for (const origin of ['https://api.bigdatacloud.net', 'https://api-bdc.net']) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        try {
            const response = await fetch(`${origin}/data/reverse-geocode-client?${params}`, {
                signal: controller.signal,
            });
            if (response.ok) {
                const label = getLocationCityLabel(await response.json());
                if (label) return { label, source: 'bigdatacloud' };
                break;
            }
            if (response.status < 500) break;
        } catch {
            // Use the provider's alternate domain after a transient connection failure.
        } finally {
            clearTimeout(timer);
        }
    }

    // City lookup only needs approximate coordinates, not the full device precision.
    const photonParams = new URLSearchParams({
        lat: latitude.toFixed(3),
        lon: longitude.toFixed(3),
        lang: lang === 'en' ? 'en' : 'default',
        limit: '5',
        radius: '10',
    });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
        const response = await fetch(`https://photon.komoot.io/reverse?${photonParams}`, {
            signal: controller.signal,
            credentials: 'omit',
            referrerPolicy: 'strict-origin',
        });
        if (!response.ok) return unavailable;
        const label = getPhotonCityLabel(await response.json());
        return label ? { label, source: 'photon' } : unavailable;
    } catch {
        return unavailable;
    } finally {
        clearTimeout(timer);
    }
}
