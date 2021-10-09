import goPost from './go-post';
import {organizeCats} from './arrs';

export const getPageBySlug = (slug, id = null) => {
    const post = id !== null ? {id} : {slug};
    return goPost(JSON.stringify({
        address: 'cats:50004',
        action: 'read',
        instructions: JSON.stringify(post)
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
        instructions: JSON.stringify({id:parseInt(id)})
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

export const getMastersChoices = id => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'masters-choices',
        instructions: JSON.stringify({id:parseInt(id)})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getMastersChoices error:" + e + res);
            return null
        }
    })
}

export const getPortfolio = id => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-portfolio',
        instructions: JSON.stringify({login_id:parseInt(id)})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getPortfolio error:" + e + res);
            return null
        }
    })
}

export const getProfileComments = id => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-profile-comments',
        instructions: JSON.stringify({id:parseInt(id)})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getCommentsById error:" + e + res);
            return null
        }
    })
}

export const getRegions = (country_id = 1) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'read-regions',
        instructions: JSON.stringify({country_id:parseInt(country_id)})
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
        instructions: JSON.stringify({region_id:parseInt(region_id)})
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

export const getCats = (columnName = null, valueArray = null) => {
    const post = {
        address: 'cats:50004',
        action: 'read_all',
        instructions: '{}'
    };
    if(columnName && valueArray) {
        post.action = 'read-where-in';
        post.instructions = JSON.stringify({
            column: columnName,
            values: valueArray
        });
    }
    return goPost(JSON.stringify(post))
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

export const getPortfolioImages = workIdStrings => {
    return goPost(JSON.stringify({
        address: 'gpics:50001',
        action: 'read-where-in',
        instructions: JSON.stringify({
            column: 'album_id',
            table: 'portfolio_media',
            values: workIdStrings
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getPortfolioImages error:" + e + res);
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