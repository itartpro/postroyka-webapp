export const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'ru-RU';

export const getCurrentTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const isoToLocale = (ISOString, LocaleString = getNavigatorLanguage()) => {
    try {
        const stamp = Date.parse(ISOString);
        return new Date(stamp).toLocaleString(LocaleString)
    } catch (e) {
        return null
    }
};

export const nowToLocaleString = (LocaleString = getNavigatorLanguage()) => new Date(Date.now()).toLocaleString(LocaleString);

export const nowToISO = () => new Date().toISOString();

export const localeToISO = string => new Date(string).toISOString()

//formatting
export const isoToRusDate = ISOString => {
    const rus = isoToLocale(ISOString, 'ru-RU');
    if(rus) return rus.split(", ")[0];
    return null
};

export const rusDateToIso = str => {
    const fullStr = `${str}, 12:00:00`;
    return rusToISO(fullStr)
};

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