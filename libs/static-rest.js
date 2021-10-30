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

export const getOrders = ({order_by = "", limit = 0, offset = 0, service_id = [], town_id = [], region_id = [], budgetGreater = 0, budgetLess = 0}) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-orders',
        instructions: JSON.stringify({order_by, limit, offset, service_id, town_id, region_id, budgetGreater, budgetLess})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getOrders error:" + e + res);
            return null
        }
    })
}

export const getOrdersImages = orderIdStrings => {
    return goPost(JSON.stringify({
        address: 'gpics:50001',
        action: 'read-where-in',
        instructions: JSON.stringify({
            column: 'album_id',
            table: 'orders_media',
            values: orderIdStrings
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log("getOrdersImages error:" + e + res);
            return null
        }
    })
}

export const getOrdersWithImages = instructions => {
    return getOrders(instructions).then(orders => {
        if(!orders) return null;
        const orderIds = orders.map(e => e.id.toString());
        if(orderIds.length > 0) {
            return getOrdersImages(orderIds).then(res => {
                const organized = {};
                if(res.length > 0) {
                    res.forEach(e => {
                        if (!organized.hasOwnProperty(e.album_id)) {
                            organized[e.album_id] = [];
                        }
                        organized[e.album_id].push(e)
                    });
                    for (let i in organized) {
                        organized[i].sort((a, b) => a['sort_order'] - b['sort_order'])
                    }
                    orders.forEach(e => {
                        if (organized[e.id]) {
                            if (!e.hasOwnProperty('images')) {
                                e['images'] = [];
                            }
                            organized[e.id].forEach(img => e.images.push(img))
                        }
                    });
                    return orders;
                }
            });
        }
        //if no images then jump to here and return without images
        return orders;
    });
}