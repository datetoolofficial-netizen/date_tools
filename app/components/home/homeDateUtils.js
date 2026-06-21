export const i18n = {
    ar: {
        pageTitle: "أدوات التاريخ الشاملة", hCalcAge: "احسب عمرك بدقة", hGreg: "بالتاريخ الميلادي", hHijri: "بالتاريخ الهجري", calendarMode: "اختيار نوع التاريخ", modeGregorian: "ميلادي", modeHijri: "هجري",
        lblBirth: "أدخل تاريخ ميلادك:", btnCalc: "احسب العمر", hConv: "تحويل التاريخ", hG2H: "ميلادي إلى هجري", hH2G: "هجري إلى ميلادي",
        lblGreg: "التاريخ الميلادي:", lblHijri: "التاريخ الهجري:", btnG2H: "تحويل لهجري", btnH2G: "تحويل لميلادي",
        hDiff: "حساب المدة بين تاريخين", hDiffGreg: "بالميلادي", hDiffHijri: "بالهجري", lblDate1: "التاريخ الأول:", lblDate2: "التاريخ الثاني:",
        btnDiff: "احسب المدة", adPortal: "إعلان مميز", navHome: "الرئيسية", navPortal: "بوابة المعلنين",
        rights: "جميع الحقوق محفوظة", footerPortal: "بوابة أدوات التاريخ", adBanner1: "مساحة إعلانية (بانر 1)", adBanner2: "مساحة إعلانية (بانر 2)",
        day: "اليوم", month: "الشهر", year: "السنة", errSelect: "الرجاء اختيار التاريخ كاملاً", errFuture: "التاريخ لا يمكن أن يكون في المستقبل!",
        resAge: "عمرك هو:", resAgeH: "عمرك بالهجري:", resDiffText: "المدة بينهما:", resG2H: "يوافق هجرياً:", resH2G: "يوافق ميلادياً:", sameDay: "اليوم (نفس التاريخ)",
        y1: "سنة", y2: "سنتين", y3: "سنوات", y4: "سنة", m1: "شهر", m2: "شهرين", m3: "أشهر", m4: "شهر", d1: "يوم", d2: "يومين", d3: "أيام", d4: "يوم", and: " و "
    },
    en: {
        pageTitle: "Comprehensive Date Tools", hCalcAge: "Calculate Your Age", hGreg: "Gregorian Date", hHijri: "Hijri Date", calendarMode: "Choose calendar type", modeGregorian: "Gregorian", modeHijri: "Hijri",
        lblBirth: "Enter your birth date:", btnCalc: "Calculate Age", hConv: "Date Conversion", hG2H: "Gregorian to Hijri", hH2G: "Hijri to Gregorian",
        lblGreg: "Gregorian Date:", lblHijri: "Hijri Date:", btnG2H: "Convert to Hijri", btnH2G: "Convert to Gregorian",
        hDiff: "Duration Between Dates", hDiffGreg: "In Gregorian", hDiffHijri: "In Hijri", lblDate1: "First Date:", lblDate2: "Second Date:",
        btnDiff: "Calculate Duration", adPortal: "Featured Ad", navHome: "Home", navPortal: "Advertisers Portal",
        rights: "All Rights Reserved", footerPortal: "Date Tools Portal", adBanner1: "Ad Space (Banner 1)", adBanner2: "Ad Space (Banner 2)",
        day: "Day", month: "Month", year: "Year", errSelect: "Please select the complete date", errFuture: "Date cannot be in the future!",
        resAge: "Your age is:", resAgeH: "Your Hijri age is:", resDiffText: "Duration between them:", resG2H: "Hijri equivalent:", resH2G: "Gregorian equivalent:", sameDay: "Today (Same Date)",
        y1: "year", y2: "years", y3: "years", y4: "years", m1: "month", m2: "months", m3: "months", m4: "months", d1: "day", d2: "days", d3: "days", d4: "days", and: " and "
    }
};

export const monthNames = {
    ar: {
        greg: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        hijri: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
    },
    en: {
        greg: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        hijri: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah']
    }
};

export const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const getHijriParts = (dateObj) => {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).formatToParts(dateObj);
    let y = 0, m = 0, d = 0;

    parts.forEach((part) => {
        if (part.type === 'year') y = parseInt(part.value);
        if (part.type === 'month') m = parseInt(part.value);
        if (part.type === 'day') d = parseInt(part.value);
    });

    return { y, m, d };
};

export const hijriToGregorian = (hY, hM, hD) => {
    const target = hY * 10000 + hM * 100 + hD;
    let minDays = Math.floor(new Date(1900, 0, 1).getTime() / 86400000);
    let maxDays = Math.floor(new Date(2100, 11, 31).getTime() / 86400000);
    let resultDays = minDays;

    for (let i = 0; i < 20; i += 1) {
        const midDays = Math.floor((minDays + maxDays) / 2);
        const midDate = new Date(midDays * 86400000);
        const parts = getHijriParts(midDate);
        const midVal = parts.y * 10000 + parts.m * 100 + parts.d;

        if (midVal === target) {
            resultDays = midDays;
            break;
        } else if (midVal < target) {
            minDays = midDays + 1;
        } else {
            maxDays = midDays - 1;
        }
    }

    return new Date(resultDays * 86400000);
};
