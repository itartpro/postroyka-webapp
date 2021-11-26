import PublicLayout from "components/public/public-layout";
import {getCats, getRegions, getTowns, getRow, getPageBySlug} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";
import {getOrganizedMasters} from "libs/masters-stuff";

export async function getServerSideProps({params}) {
    const service = await getPageBySlug(params.service);
    if (!service) {
        return {
            notFound: true,
        }
    }
    const serviceIds = [];
    serviceIds.push(service.id);
    let town = null;
    let region = null;
    if(params.town && params.town !== "all") {
        town = await getRow("slug", params.town, "towns")
    }
    if(params.region && params.region !== 'russia') {
        region = await getRow("slug", params.region, "regions")
    }
    if(town && region && town.region_id.toString() !== region.id.toString()) {
        region = await getRow("id", town.region_id.toString(), "regions")
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
    let parentService = null;
    const others = services.reduce((result, parent) => {
        parent.children.forEach(e => {
            if(service.id === e.id) {
                othersLine = `Услуги раздела ${e.name}`;
                if(e.children && e.children.length > 0) {
                    e.children.forEach(e2 => result.push(e2))
                }
            }
            if(service.parent_id === e.id) {
                serviceIds.push(e.id);
                othersLine = `Другие услуги раздела ${e.name}`;
                parentService = e;
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
    const regionIds = region !== null ? [region.id] : [];
    const townIds = town !== null ? [town.id] : [];
    const masters = await getOrganizedMasters([], regionIds, townIds, serviceIds)

    return {
        props: {
            services,
            service,
            parentService,
            page,
            others,
            othersLine,
            regions,
            towns,
            region,
            town,
            masters
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