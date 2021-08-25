import goPost from './go-post'

export const getPageBySlug = slug => {
    return goPost(JSON.stringify({
        address: 'cats:50004',
        action: 'read',
        instructions: JSON.stringify({slug})
    }))
        .then(res => {
            try {
                const parsed = JSON.parse(res);
                return parsed.data
            } catch (e) {
                console.log("getPageBySlug error:" + e + res);
                return null
            }
        })
}

export const getProfileById = id => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-profile',
        instructions: JSON.stringify({id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getProfileById error:" + e + res);
            return null
        }
    })
}

export const getRegions = (country_id = 1) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'read-regions',
        instructions: JSON.stringify({country_id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getRegions error:" + e + res);
            return null
        }
    })
}

export const getTowns = (region_id = 1) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'read-towns',
        instructions: JSON.stringify({region_id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getTowns error:" + e + res);
            return null
        }
    })
}