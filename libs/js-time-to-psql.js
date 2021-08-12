export const isoToRus = ISOString => {
    try {
        const stamp = Date.parse(ISOString);
        return new Date(stamp).toLocaleString('ru-RU')
    } catch (e) {
        return null
    }
}

export const rusToISO = str => {
    const halves = str.split(", ");
    const split = halves[0].split(".");
    if(split[0].length < 2) split[0] = '0' + split[0];
    if(split[1].length < 2) split[0] = '0' + split[0];
    if(split[2].length < 2) split[0] = '0' + split[0];
    const fullStr = `${split[1]}.${split[0]}.${split[2]}, ${halves[1]}`;
    try {
        const stamp = Date.parse(fullStr)
        return new Date(stamp).toISOString()
    } catch (e) {
        return null
    }
}

export const nowToISO = () => new Date(Date.now()).toISOString();

export const nowToRus = () => new Date(Date.now()).toLocaleString('ru-RU');

export const isoToRusDate = ISOString => {
    const rus = isoToRus(ISOString);
    if(rus) return rus.split(", ")[0];
    return null
}

export const rusDateToIso = str => {
    const fullStr = `${str}, 12:00:00`;
    return rusToISO(fullStr)
}