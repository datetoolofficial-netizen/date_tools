import { describe, expect, it } from 'vitest';
import { dayNames, getLocalizedEventName, getTodayInfo, i18n } from '../app/i18n';
import { getToolSettings, renderShareTemplate } from '../app/toolSettings';

describe('date result presentation', () => {
    it('defines localized Hijri suffixes instead of rendering an undefined value', () => {
        expect(i18n.ar.hijriSuffix).toBe(' هـ');
        expect(i18n.en.hijriSuffix).toBe(' AH');
    });

    it('keeps both entered dates in the duration share text', () => {
        const settings = getToolSettings({}, 'date', 'ar');
        const shareText = renderShareTemplate(settings, 'durationResult', {
            toolTitle: 'حساب المدة',
            firstDate: '1/1/1448 هـ',
            secondDate: '18/3/1448 هـ',
            result: 'شهران و17 يومًا',
            url: 'https://date-tool.com/date-difference',
        });

        expect(shareText).toContain('1/1/1448 هـ');
        expect(shareText).toContain('18/3/1448 هـ');
    });

    it('localizes the today banner, weekdays, and known appointment names', () => {
        expect(dayNames.en[1]).toBe('Monday');
        expect(getTodayInfo('en', {
            dayName: 'Monday',
            gregDay: 7,
            gregMonth: 'September',
            hijriDay: 25,
            hijriMonth: 'Rabi al-Awwal',
        })).toBe('Today is Monday, September 7 (Gregorian) | 25 Rabi al-Awwal AH');
        expect(getLocalizedEventName({ name: 'الراتب' }, 'en')).toBe('Salary Payment');
        expect(getLocalizedEventName({ name: 'موعد مخصص', nameEn: 'Custom Event' }, 'en')).toBe('Custom Event');
    });
});
