export const timeInRus = milliseconds => {
    const mins = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    let str = null;
    if(hours < 1) {
        if(mins < 2) str = mins + ' минута'
        if(mins > 1 && mins < 5) str = mins + ' минуты'
        if(mins > 4) str = mins + ' минут'
    }
    if(mins > 60 && days < 1) {
        if(hours < 2) str = hours + ' час';
        if(hours > 1 && hours < 5) str = hours + ' часа';
        if(hours > 4) str = hours + ' часов';
    }
    if(days > 0 && days < 2) str = days + ' день';
    if(days > 1 && days < 5) str = days + ' дня';
    if(days > 4 && days < 31) str = days + ' дней';
    if(days > 30 && days < 121) str = months + ' месяца';
    if(days > 120 && days < 365) str = months + ' месяцев';
    if(days > 364) {
        let years = Math.floor(days / 365)
        if(years < 2) str = '1 год';
        if(years > 1 && years < 4) str = years + ' года';
        if(years > 4) str = years + ' лет';
        let months = Math.floor((days - years * 365) / 30);
        if(months > 0 && months < 2) str += ' и 1 месяц';
        if(months > 2 && months < 4) str += ', '+months+' месяца';
        if(months > 4) str += ', '+months+' месяцев';
    }
    return str
};

export const timeDiff = (oldStamp, newStamp) => Math.abs(oldStamp - newStamp);