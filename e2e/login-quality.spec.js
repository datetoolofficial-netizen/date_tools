import { expect, test } from '@playwright/test';

test('admin login survives a reload and exposes labelled credentials fields', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/admin_login', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /تسجيل الدخول/ })).toBeEnabled();
    await expect(page.getByLabel('البريد الإلكتروني للإدارة')).toHaveAttribute('autocomplete', 'username');
    await expect(page.getByLabel('كلمة المرور')).toHaveAttribute('autocomplete', 'current-password');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /تسجيل الدخول/ })).toBeEnabled();
    expect(pageErrors).toEqual([]);
});

test('advertiser demo account completes the local sign-in flow', async ({ page }) => {
    await page.goto('/client', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'تعبئة بيانات التجربة' }).click();
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    await expect(page).toHaveURL(/\/client\/dashboard$/);
    await expect(page.getByRole('heading', { name: /أهلًا بك|حملاتك الإعلانية/ }).first()).toBeVisible();
});
