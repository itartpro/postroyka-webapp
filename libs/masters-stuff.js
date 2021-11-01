import {getPortfolioImages, getMasters, MastersPortfolios} from "./static-rest";

export const getOrganizedMasters = async (serviceIds = []) => {
    const masters = await getMasters();
    const masterIds = masters.map(e => e.id);
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
    const organizedMasters = masters.reduce((result, e) => {
        const master = e;
        master.portfolio = null;
        if(portfoliosByMaster[master.id] && portfoliosByMaster[master.id].length > 0) {
            portfoliosByMaster[master.id].forEach(e2 => {
                if(portfolioImages[e2.id] && portfolioImages[e2.id].length > 0) {
                    if(!master.portfolio) master.portfolio = [];
                    master.portfolio.push(portfolioImages[e2.id])
                }
            })
        }
        result.push(master);
        return result
    }, []);

    return organizedMasters
}