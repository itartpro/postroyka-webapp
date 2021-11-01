import PublicLayout from "components/public/public-layout";
import {getCats, getRegions, getTowns, getRow} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";

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

    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();
    const towns = await getTowns(town.region_id || 1);

    return {
        props: {
            services,
            page,
            regions,
            towns,
            region,
            town
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