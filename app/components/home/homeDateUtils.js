import {
    CalendarDate,
    GregorianCalendar,
    IslamicUmalquraCalendar,
    toCalendar,
} from '@internationalized/date';

const gregorianCalendar = new GregorianCalendar();
const hijriCalendar = new IslamicUmalquraCalendar();

function assertValidDate(dateObj) {
    if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
        throw new RangeError('Invalid Gregorian date');
    }
}

function assertInteger(value, label) {
    if (!Number.isInteger(value)) {
        throw new RangeError(`Invalid ${label}`);
    }
}

export const getHijriParts = (dateObj) => {
    assertValidDate(dateObj);
    const gregorianDate = new CalendarDate(
        gregorianCalendar,
        dateObj.getFullYear(),
        dateObj.getMonth() + 1,
        dateObj.getDate(),
    );
    const hijriDate = toCalendar(gregorianDate, hijriCalendar);
    return { y: hijriDate.year, m: hijriDate.month, d: hijriDate.day };
};

export const hijriToGregorian = (hY, hM, hD) => {
    assertInteger(hY, 'Hijri year');
    assertInteger(hM, 'Hijri month');
    assertInteger(hD, 'Hijri day');

    if (hY < 1300 || hY > 1600 || hM < 1 || hM > 12 || hD < 1) {
        throw new RangeError('Hijri date is outside the supported Umm al-Qura range');
    }

    const firstDay = new CalendarDate(hijriCalendar, hY, hM, 1);
    if (hD > hijriCalendar.getDaysInMonth(firstDay)) {
        throw new RangeError('Invalid Hijri day for the selected month');
    }

    const hijriDate = new CalendarDate(hijriCalendar, hY, hM, hD);
    const gregorianDate = toCalendar(hijriDate, gregorianCalendar);

    // Noon avoids crossing the civil day around DST changes on affected devices.
    return new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day, 12, 0, 0, 0);
};
