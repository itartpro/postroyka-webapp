import PublicLayout from "components/public/public-layout";
import {getRegions, getTowns, getRow} from "libs/static-rest";
import {Main} from "components/public/masters/main";
import {essentialCats} from "libs/masters-stuff";
import {getOrganizedMasters} from "libs/masters-stuff";

export async function getServerSideProps({params}) {
    const region = await getRow("slug", params.region, "regions")
    const page = {
        title: 'Мастера области ' + region.name,
        slug: params.region,
        h1: 'Мастера области ' + region.name,
        description: 'Найти мастера в области ' + region.name,
        text:''
    };
    const services = await essentialCats();
    const regions = await getRegions();
    const towns = await getTowns(region.id);
    const masters = await getOrganizedMasters([], [region.id])

    return {
        props: {
            services,
            page,
            regions,
            towns,
            region,
            masters
        }
    }
}

const RegionalMasters = props => {
    return (
        <PublicLayout page={props.page}>
            <Main {...props}/>
        </PublicLayout>
    )
}

export default RegionalMasters