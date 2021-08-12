export const  validateEmailPhoneInput = input => {
    //remove whitespace
    input = input.replace(/\s/g, '');
    if (emailRegex(input)) {
        return {
            'type':'email',
            'value':input
        }
    }

    input = input.replace(/\(/g,'').replace(/\)/g,'').replace(/\-/g,'')
    if(input.length < 11 || input.length > 12) return false;
    if(phoneRegex(input)) {
        return {
            'type':'phone',
            'value':input
        }
    }
    return false
}

export const emailRegex = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

export const phoneRegex = phone => {
    phone = phone.replace('+','').replace(/\(/g,'').replace(/\)/g,'').replace(/\-/g,'');
    return /^\d+$/.test(phone)
}