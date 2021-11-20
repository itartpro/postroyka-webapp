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
                console.log(`getPageBySlug JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getProfileById JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getMastersChoices JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getPortfolio JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    })
}

export const MastersPortfolios = (masterIds, serviceIds = []) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'masters-portfolios',
        instructions: JSON.stringify({
            login_id: masterIds,
            service_id: serviceIds
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`organizedRegions JSON.parse error:${e}\nresponse:${res}\n`);
            return res
        }
    });
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
            const images = parsed.data;
            const organized = {};
            images && images.length > 0 && images.forEach(e => {
                if(!organized.hasOwnProperty(e.album_id)) {
                    organized[e.album_id] = [];
                }
                organized[e.album_id].push(e)
            });
            for(let i in organized) {
                organized[i].sort((a,b) => a['sort_order'] - b['sort_order'])
            }
            return organized
        } catch (e) {
            console.log(`getPortfolioImages JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getCommentsById JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getRegions JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getTowns JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    })
}

export const getCats = (columnName = null, strValueArray = null) => {
    const post = {
        address: 'cats:50004',
        action: 'read_all',
        instructions: '{}'
    };
    if(columnName && strValueArray) {
        post.action = 'read-where-in';
        post.instructions = JSON.stringify({
            column: columnName,
            values: strValueArray
        });
    }
    return goPost(JSON.stringify(post))
        .then(res => {
            try {
                const parsed = JSON.parse(res);
                return parsed.data
            } catch (e) {
                console.log(`getCats JSON.parse error:${e}\nresponse:${res}\n`);
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

export const getOrders = ({order_by = "", limit = 0, offset = 0, service_id = [], town_id = [],
                              region_id = [], budgetGreater = 0, budgetLess = 0}) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-orders',
        instructions: JSON.stringify({order_by, limit, offset, service_id, town_id, region_id, budgetGreater, budgetLess})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`getOrders JSON.parse error:${e}\nresponse:${res}\n`);
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
            console.log(`getOrdersImages JSON.parse error:${e}\nresponse:${res}\n`);
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
                if(Array.isArray(res) && res.length > 0) {
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
                } else {
                    //if no images then jump to here and return without images
                    return orders;
                }
            });
        }
    });
}

export const organizedRegions = strRegionIds => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'regions-where-in',
        instructions: JSON.stringify({
            column: 'id',
            values: strRegionIds
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            const organized = {};
            parsed.data.forEach(e => {
                organized[e.id] = e.name;
            });
            return organized
        } catch (e) {
            console.log(`organizedRegions JSON.parse error:${e}\nresponse:${res}\n`);
            return res
        }
    });
}

export const organizedTowns = strTownIds => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'towns-where-in',
        instructions: JSON.stringify({
            column: 'id',
            values: strTownIds
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            const organized = {};
            parsed.data.forEach(e => {
                organized[e.id] = e.name;
            });
            return organized
        } catch (e) {
            console.log(`organizedTowns JSON.parse error:${e}\nresponse:${res}\n`);
            return res
        }
    });
}

export const getRow = (column, value, table) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-row',
        instructions: JSON.stringify({column, value: value.toString(), table})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`getCell JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    })
}

export const getTerritories = (region_id = [], town_id = [], login_id = []) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-territories',
        instructions: JSON.stringify({region_id, town_id, login_id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`getTerritories JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    });
}

export const getChoices = (service_id = [], login_id = [], id = []) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-choices',
        instructions: JSON.stringify({service_id, login_id, id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`getChoices JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    });
}

export const getOrganizedTerritories = (region_id = [], town_id = [], login_id = []) => {
    return getTerritories(region_id, town_id, login_id).then(territories => {
        if(territories.length > 0) {
            const organizedTerritories = {};
            territories.forEach(e => {
                if(!organizedTerritories.hasOwnProperty(e.region_id)) {
                    organizedTerritories[e.region_id] = {};
                }
                if(e.town_id !== 0) {
                    organizedTerritories[e.region_id][e.town_id] = e;
                }
            })
        } else {
            return null
        }
    })
}

export const getMasters = (login_id = [], service_id = []) => {
    return goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'get-masters',
        instructions: JSON.stringify({login_id, service_id})
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            return parsed.data
        } catch (e) {
            console.log(`getMasters JSON.parse error:${e}\nresponse:${res}\n`);
            return null
        }
    })
}