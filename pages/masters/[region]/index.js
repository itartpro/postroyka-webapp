import PublicLayout from "components/public/public-layout";
import {getCats, getRegions, getTowns, getRow} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";

export async function getServerSideProps({params}) {
    const region = await getRow("slug", params.region, "regions")
    const page = {
        title: 'Мастера области ' + region.name,
        slug: params.region,
        h1: 'Мастера области ' + region.name,
        description: 'Найти мастера в области ' + region.name,
        text:''
    };

    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();
    const towns = await getTowns(region.id || 1);

    return {
        props: {
            services,
            page,
            regions,
            towns,
            region
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