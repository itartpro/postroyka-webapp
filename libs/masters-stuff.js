import {getCats, getMasters, getPortfolioImages, getTerritories, MastersPortfolios} from "./static-rest";
import {organizeCats} from "./arrs";

export const getOrganizedMasters = async (loginIds = [], regionIds = [], townIds = [], serviceIds = []) => {
    if(townIds.length > 0) {
        await getTerritories([], townIds)
            .then(terr => {
                terr && terr.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
        await getTerritories(regionIds, [0])
            .then(terr => {
                console.log('townid 0', terr)
                terr && terr.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
    }
    if(regionIds.length > 0 && townIds.length < 1) {
        await getTerritories(regionIds)
            .then(terr => {
                terr && terr.forEach(e => {
                    if(!loginIds.includes(e.login_id)) {
                        loginIds.push(e.login_id)
                    }
                })
            });
    }
    if((regionIds.length > 0 || townIds.length > 0) && loginIds.length < 1) return null;
    const users = await getMasters(loginIds);
    const masterIds = users.map(e => e.id);
    const portfolios = await MastersPortfolios(masterIds, serviceIds);
    const portfoliosByMaster = {};
    const portfolioIds = [];
    portfolios.forEach(e => {
        if(!portfoliosByMaster.hasOwnProperty(e.login_id)) {
            portfoliosByMaster[e.login_id] = [];
        }
        portfoliosByMaster[e.login_id].push(e);
        portfolioIds.push(e.id.toString())
    });
    const portfolioImages = await getPortfolioImages(portfolioIds);
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
        result.push(master);
        return result
    }, [])
}

export const essentialCats = () => {
    return getCats("parent_id", ["2"])
        .then(parents => getCats("parent_id", parents.map(e => e.id.toString()))
            .then(kids => organizeCats(parents.concat(kids))[0].children))
}