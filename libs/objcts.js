export const isEmpty = obj => {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false
        }
    }
    return true
}