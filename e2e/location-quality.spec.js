import { expect, test } from '@playwright/test';

test('clock and weather start without a city when location is unavailable', async ({ page }) => {
    await page.context().grantPermissions([]);
    await page.goto('/clock', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.clock-now-label')).toContainText('الساعة الآن');
    await expect(page.locator('.clock-now-label')).not.toContainText('الرياض');
    await expect(page.locator('.clock-now-banner strong')).toHaveText('--:--');
    await expect(page.getByRole('textbox', { name: 'ابحث عن المدينة الأولى' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'ابحث عن المدينة الثانية' })).toHaveValue('');

    await page.goto('/weather', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('textbox', { name: 'ابحث باسم المدينة' })).toHaveValue('');
    await expect(page.locator('.weather-current-card')).toHaveCount(0);
});

test('clock and weather use the coordinates rather than the device city', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 51.5072, longitude: -0.1276, accuracy: 40 });
    await page.route('**/api.bigdatacloud.net/data/reverse-geocode-client?*', async (route) => {
        await route.fulfill({ json: { city: 'لندن', principalSubdivision: 'إنجلترا' } });
    });
    await page.route('**/api.open-meteo.com/v1/forecast?*', async (route) => {
        await route.fulfill({ json: {
            timezone: 'Europe/London',
            current: {
                temperature_2m: 18,
                apparent_temperature: 17,
                relative_humidity_2m: 60,
                wind_speed_10m: 10,
                weather_code: 1,
                precipitation: 0,
            },
            daily: {
                time: ['2026-09-23', '2026-09-24'],
                temperature_2m_max: [20, 21],
                temperature_2m_min: [12, 13],
                precipitation_probability_max: [10, 20],
                uv_index_max: [3, 4],
                weather_code: [1, 2],
            },
        } });
    });

    await page.goto('/clock', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.clock-now-label')).toContainText('لندن');
    await expect(page.getByRole('textbox', { name: 'ابحث عن المدينة الأولى' })).toHaveValue('لندن');
    await expect(page.getByRole('textbox', { name: 'ابحث عن المدينة الثانية' })).toHaveValue('');

    await page.goto('/weather', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.weather-current-card')).toContainText('لندن');
    await expect(page.getByRole('textbox', { name: 'ابحث باسم المدينة' })).toHaveValue('');
});

test('clock uses the provider alternate endpoint when the first city lookup fails', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 26.4207, longitude: 50.0888, accuracy: 40 });
    await page.route('**/api.bigdatacloud.net/data/reverse-geocode-client?*', (route) => route.fulfill({ status: 503 }));
    await page.route('**/api-bdc.net/data/reverse-geocode-client?*', (route) => route.fulfill({
        json: { city: 'الدمام', lookupSource: 'reverseGeocoding' },
    }));
    await page.route('**/api.open-meteo.com/v1/forecast?*', (route) => route.fulfill({
        json: { timezone: 'Asia/Riyadh' },
    }));

    await page.goto('/clock', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.clock-now-label')).toContainText('الدمام');
    await expect(page.locator('.clock-now-label')).not.toContainText('موقعك الحالي');
});
