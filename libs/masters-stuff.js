import {getCats, getChoices, getMasters, getPortfolioImages, getTerritories, MastersPortfolios} from "./static-rest";
import {organizeCats} from "./arrs";
import {emailRegex} from "./email-phone-input";

export const getOrganizedMasters = async (loginIds = [], regionIds = [], townIds = [], serviceIds = []) => {
    const choices = {};
    if(townIds.length > 0) {
        await getTerritories([], townIds)
            .then(rows => {
                rows && rows.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
        await getTerritories(regionIds, [0])
            .then(rows => {
                rows && rows.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
    }
    if(regionIds.length > 0 && townIds.length < 1) {
        await getTerritories(regionIds)
            .then(rows => {
                rows && rows.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
    }
    if(serviceIds.length > 0) {
        const matches = [];
        await getChoices(serviceIds)
            .then(rows => {
                rows && rows.forEach(e => {
                    if(!choices.hasOwnProperty(e.login_id)) {
                        choices[e.login_id] = [];
                    }
                    choices[e.login_id].push(e);
                    if(!matches.includes(e.login_id)) {
                        matches.push(e.login_id)
                    }
                })
            })
        if(loginIds.length > 0) {
            loginIds.forEach((e, i) => {
                if(!matches.includes(e)) {
                    loginIds.splice(i, 1);
                }
            })
        }
        if(loginIds.length < 1 && matches.length > 0 && townIds.length < 1) {
            loginIds = matches
        }
    }
    if((regionIds.length > 0 || townIds.length > 0 || serviceIds.length > 0) && loginIds.length < 1) return null;
    const users = await getMasters(loginIds);
    const masterIds = users.map(e => e.id);
    const portfoliosByMaster = {};
    let portfolioImages = {};
    const portfolios = await MastersPortfolios(masterIds, serviceIds);
    if(Array.isArray(portfolios) && portfolios.length > 0) {
        const portfolioIds = [];
        portfolios.forEach(e => {
            if(!portfoliosByMaster.hasOwnProperty(e.login_id)) {
                portfoliosByMaster[e.login_id] = [];
            }
            portfoliosByMaster[e.login_id].push(e);
            portfolioIds.push(e.id.toString())
        });
        portfolioImages = await getPortfolioImages(portfolioIds);
    }
    return users.reduce((result, e) => {
        const master = e;
        master.portfolio = null;
        if (portfoliosByMaster[master.id] && portfoliosByMaster[master.id].length > 0) {
            portfoliosByMaster[master.id].forEach(e2 => {
                if (portfolioImages[e2.id] && portfolioImages[e2.id].length > 0) {
                    if (!master.portfolio) master.portfolio = [];
                    master.portfolio.push(portfolioImages[e2.id])
                }
            })
        }
        if(choices.hasOwnProperty(master.id)) {
            master.choices = choices[master.id]
        }
        result.push(master);
        return result
    }, [])
}

export const essentialCats = () => {
    return getCats("parent_id", ["2"])
        .then(parents => getCats("parent_id", parents.map(e => e.id.toString()))
            .then(kids => organizeCats(parents.concat(kids))[0].children))
}