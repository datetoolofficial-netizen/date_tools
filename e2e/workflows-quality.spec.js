import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function signInDemoAdvertiser(page) {
    await page.goto('/client', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'تعبئة بيانات التجربة' }).click();
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    await expect(page).toHaveURL(/\/client\/dashboard$/);
}

test('event sharing works by keyboard and restores focus', async ({ page }) => {
    const today = new Date();
    const eventDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');
    await page.route('**/api/site-config', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                ok: true,
                config: {
                    events: [{
                        name: 'موعد اختبار محلي',
                        nameEn: 'Local test date',
                        date: eventDate,
                        calendar: 'gregorian',
                        repeat: 'none',
                        active: true,
                        icon: 'fa-calendar-day',
                        color: '#1d4ed8',
                    }],
                },
            }),
        });
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const shareButton = page.getByRole('button', { name: /مشاركة المواعيد/ });
    await expect(shareButton).toBeVisible();
    await shareButton.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'اختر المواعيد' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'إغلاق' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(shareButton).toBeFocused();
});

test('support validates short messages and completes an isolated submission', async ({ page }) => {
    await page.route('**/api/support', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ ok: true, ticketNumber: 'LOCAL-TEST-1001' }),
        });
    });
    await page.goto('/support', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('الاسم أو الجهة').fill('جهة اختبار محلية');
    await page.getByLabel('البريد الإلكتروني').fill('support@example.test');
    await page.getByLabel('عنوان الطلب').fill('اختبار نموذج الدعم');
    await page.getByLabel('وصف المشكلة / الاستفسار').fill('قصير');
    const submitButton = page.getByRole('button', { name: 'إرسال طلب الدعم' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(page.getByText('اكتب وصفًا أوضح للمشكلة، 10 أحرف على الأقل.')).toBeVisible();

    await page.getByLabel('وصف المشكلة / الاستفسار').fill('هذه رسالة اختبار محلية واضحة ولا تُرسل إلى الإنتاج.');
    await submitButton.click();
    await expect(page.getByText(/LOCAL-TEST-1001/)).toBeVisible();
});

test('advertiser registration remains local and reaches the persistent dashboard', async ({ page }) => {
    const email = `qa-${Date.now()}@local.test`;
    await page.goto('/client/register', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('تسجيل محلي معزول')).toBeVisible();
    await page.getByLabel('اسم المتجر أو الجهة').fill('متجر اختبار التسجيل');
    await page.getByLabel('اسم المسؤول').fill('مسؤول محلي');
    await page.getByLabel('البريد الإلكتروني').fill(email);
    await page.getByLabel('رقم التواصل').fill('+966500000000');
    await page.getByLabel('كلمة المرور').fill('LocalTest2026!');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

    await expect(page).toHaveURL(/\/client\/dashboard$/, { timeout: 10_000 });
    await expect(page.getByText('متجر اختبار التسجيل').first()).toBeVisible();
});

test('demo advertiser creates a campaign and sees it in the dashboard', async ({ page }) => {
    const campaignName = `حملة اختبار ${Date.now()}`;
    await signInDemoAdvertiser(page);
    await page.goto('/client/create-campaign', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('اسم الحملة').fill(campaignName);
    await page.getByLabel('رابط الوجهة').fill('https://example.test/offer');
    await page.getByLabel('مكان عرض الإعلان المطلوب').selectOption('dateTop');
    await page.getByLabel('وقت وتاريخ بداية الإعلان').fill('2099-01-01T09:00');
    await page.getByLabel('وقت وتاريخ نهاية الإعلان').fill('2099-01-02T09:00');
    await page.locator('#campaign-image').setInputFiles({
        name: 'campaign.png',
        mimeType: 'image/png',
        buffer: Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex'),
    });
    await page.getByRole('button', { name: 'إرسال الإعلان للمراجعة' }).click();
    await expect(page.getByText(/تم إرسال حملتك للمراجعة/)).toBeVisible();

    await page.goto('/client/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(campaignName)).toBeVisible();
});

test('organization owner adds a local member without crossing organization boundaries', async ({ page }) => {
    const memberEmail = `member-${Date.now()}@local.test`;
    await signInDemoAdvertiser(page);
    await page.goto('/client/team', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'دعوة عضو' }).click();
    await page.getByLabel('اسم العضو').fill('عضو اختبار محلي');
    await page.getByLabel('البريد الإلكتروني').fill(memberEmail);
    await page.getByLabel('رقم التواصل').fill('+966511111111');
    await page.getByLabel('الدور').selectOption('campaign_manager');
    await page.getByRole('button', { name: 'إرسال الدعوة' }).click();
    await expect(page.getByText(memberEmail)).toBeVisible();
});

test('authenticated advertiser dashboard has no serious accessibility violations', async ({ page }) => {
    await signInDemoAdvertiser(page);
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
    const serious = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
    expect(serious).toEqual([]);
});
