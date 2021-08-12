import goPost from './go-post'

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