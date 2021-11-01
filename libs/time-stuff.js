const minString = mins => {
    const str = mins.toString();
    const last = parseInt(str.slice(-1));
    if(last > 4 || (mins > 4 && mins < 21)) return 'минут'
    if(last === 1) return 'минута'
    if(last > 1 && last < 5) return 'минуты'
}

const hourString = hours => {
    const str = hours.toString();
    const last = parseInt(str.slice(-1));
    if(last > 4 || (hours > 4 && hours < 21)) return 'часов'
    if(last === 1) return 'час'
    if(last > 1 && last < 5) return 'часа'
}

const dayString = days => {
    const str = days.toString();
    const last = parseInt(str.slice(-1));
    if(last > 4 || (days > 4 && days < 21)) return 'дней'
    if(last === 1) return 'день'
    if(last > 1 && last < 5) return 'дня'
}

const monthString = months => {
    const str = months.toString();
    const last = parseInt(str.slice(-1));
    if(last > 4 || (months > 4 && months < 21)) return 'месяцев'
    if(last === 1) return 'месяц'
    if(last > 1 && last < 5) return 'месяца'
}

const yearString = years => {
    const str = years.toString();
    const last = parseInt(str.slice(-1));
    if(last > 4 || (years > 4 && years < 21)) return 'лет'
    if(last === 1) return 'год'
    if(last > 1 && last < 5) return 'года'
}

export const timeInRus = milliseconds => {
    const mins = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    let str = null;
    let left = null;
    if(hours < 1) {
        str = mins + ' ' + minString(mins);
    }
    if(mins > 60 && days < 1) {
        str = hours + ' ' + hourString(hours)
        left = mins - hours * 60;
        if(left > 0) {
            str = str + ' ' + left + ' ' + minString(left)
        }
    }
    if(days > 0) {
        str = days + ' ' + dayString(days);
        left = hours - days * 24;
        if(left > 0) {
            str = str + ' ' + left + ' ' + hourString(left)
        }
    }
    if(days > 30) {
        str = months + ' ' + monthString(months);
        left = days - months * 30;
        if(left > 0) {
            str = str + ' ' + left + ' ' + dayString(left)
        }
    }

    if(days > 365) {
        str = years + ' ' + yearString(years);
        left = months - years * 12;
        if(left > 0) {
            str = str + ' ' + left + ' ' + monthString(left)
        }
    }

    return str
};

export const timeDiff = (oldStamp, newStamp) => Math.abs(oldStamp - newStamp);