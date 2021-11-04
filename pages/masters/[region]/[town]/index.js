import PublicLayout from "components/public/public-layout";
import {getRegions, getTowns, getRow} from "libs/static-rest";
import {Main} from "components/public/masters/main";
import {essentialCats, getOrganizedMasters} from "libs/masters-stuff";

export async function getServerSideProps({params}) {
    const town = await getRow("slug", params.town, "towns");
    const region = await getRow("id", town.region_id.toString(), "regions");
    const page = {
        title: `Найти мастера, или бригаду рабочих в городе ${town.name}, ${region.name}`,
        slug: params.town,
        h1: `Мастера и бригады города ${town.name}, ${region.name}`,
        description: `Нанять мастера, или бригаду рабочих в городе ${town.name}, ${region.name}`,
        text:''
    };

    const services = await essentialCats();
    const regions = await getRegions();
    const towns = await getTowns(town.region_id || 1);
    const masters = await getOrganizedMasters([], [town.region_id], [town.id])

    return {
        props: {
            services,
            page,
            regions,
            towns,
            region,
            town,
            masters
        }
    }
}

const LocalMasters = props => {
    return (
        <PublicLayout page={props.page}>
            <Main {...props}/>
        </PublicLayout>
    )
}

export default LocalMasters