import { describe, expect, it } from 'vitest';
import { getHijriParts, hijriToGregorian } from '../app/components/home/homeDateUtils';

describe('Umm al-Qura date conversion', () => {
    it('converts a known Hijri date to Gregorian without browser Intl', () => {
        const result = hijriToGregorian(1446, 9, 1);

        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(1);
    });

    it('keeps the reported iPhone conversion case Gregorian', () => {
        const result = hijriToGregorian(1414, 7, 23);

        expect([result.getFullYear(), result.getMonth() + 1, result.getDate()]).toEqual([1994, 1, 6]);
    });

    it('round-trips Gregorian dates through Umm al-Qura parts', () => {
        const source = new Date(2024, 2, 11, 12, 0, 0, 0);
        const hijri = getHijriParts(source);
        const result = hijriToGregorian(hijri.y, hijri.m, hijri.d);

        expect([result.getFullYear(), result.getMonth(), result.getDate()]).toEqual([2024, 2, 11]);
    });

    it('rejects a day that does not exist in the selected Hijri month', () => {
        expect(() => hijriToGregorian(1446, 9, 30)).toThrow(RangeError);
    });

    it('rejects dates outside the supported Umm al-Qura range', () => {
        expect(() => hijriToGregorian(1299, 12, 29)).toThrow(RangeError);
    });
});
