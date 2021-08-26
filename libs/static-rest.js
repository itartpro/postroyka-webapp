import goPost from './go-post';
import {organizeCats} from './arrs';

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

export const getCats = (url = null) => {
    return goPost(JSON.stringify({
        address: 'cats:50004',
        action: 'read_all',
        instructions: "{}"
    }), url)
        .then(res => {
            try {
                const parsed = JSON.parse(res);
                return parsed.data
            } catch (e) {
                console.log("getCats error:" + e + res);
                return null
            }
        })
}

export const getLatestArticles = (limit = null, url = null) => {
    return getCats(url)
        .then(data => organizeCats(data))
        .then(cats => {
            if(!Array.isArray(cats) || !cats.length) return null;
            const allArticles = [];
            cats && cats[2] && cats[2].children.forEach(e => e.children.forEach(c => {
                if(!c.extra.includes('inactive')) {
                    allArticles.push(c)
                }
            }));
            const sorted = allArticles.sort((a,b) => b['id'] - a['id']);
            if(limit) {
                const limited = [];
                const li = parseInt(limit);
                sorted.forEach((e,i) => {
                    if(i < li) limited.push(e)
                });
                return limited
            } else {
                return sorted
            }
        })
}