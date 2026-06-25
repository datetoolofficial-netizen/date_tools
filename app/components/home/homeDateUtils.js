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
