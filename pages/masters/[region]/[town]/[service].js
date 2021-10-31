import PublicLayout from "components/public/public-layout";
import {getCats, getRegions, getTowns, getRow, getPageBySlug} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";

export async function getServerSideProps({params}) {
    const service = await getPageBySlug(params.service);
    let town = null;
    let region = null;
    if(params.town && params.town !== 'all') {
        town = await getRow("slug", params.town, "towns")
    }
    if(params.region && params.region !== 'russia') {
        region = await getRow("id", town.region_id.toString(), "regions");
    }

    let page;
    if(region) {
        if(town) {
            page = {
                title: `Мастера и бригады, услуга ${service.name} в городе ${town.name}, ${region.name}`,
                slug: params.town,
                h1: `Выполнить ${service.name} в городе ${town.name}, ${region.name}`,
                description: `${service.name}, нанять мастера, или бригаду рабочих в городе ${town.name}, регион ${region.name}`,
                text:''
            }
        } else {
            page = {
                title: `Мастера и бригады, услуга ${service.name}, ${region.name}`,
                slug: params.town,
                h1: `${service.name}, найти мастера или бригаду ${region.name}`,
                description: `${service.name}, нанять мастера, или бригаду рабочих, регион ${region.name}`,
                text:''
            }
        }
    } else {
        page = service
    }

    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    let othersLine = "";
    const others = services.reduce((result, parent) => {
        parent.children.forEach(e => {
            if(page.id === e.id) {
                othersLine = `Услуги раздела ${e.name}`;
                if(e.children && e.children.length > 0) {
                    e.children.forEach(e2 => result.push(e2))
                }
            }
            if(page.parent_id === e.id) {
                othersLine = `Другие услуги раздела ${e.name}`;
                if(e.children && e.children.length > 0) {
                    e.children.forEach(e2 => result.push(e2))
                }
            }
        })
        return result
    }, []);
    const regions = await getRegions();
    let towns = null;
    if(region) {
        towns = await getTowns(region.id);
    }

    return {
        props: {
            services,
            page,
            others,
            othersLine,
            regions,
            towns,
            region,
            town
        }
    }
}

const ServiceOffers = props => {
    return (
        <PublicLayout page={props.page}>
            <Main {...props}/>
        </PublicLayout>
    )
}

export default ServiceOffers