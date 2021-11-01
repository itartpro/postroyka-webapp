import PublicLayout from "components/public/public-layout";
import {Main} from "components/public/masters/main";
import {getCats, getPageBySlug, getRegions} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {getOrganizedMasters} from "libs/masters-stuff";

export async function getServerSideProps({params}) {
    const page = await getPageBySlug('masters');
    //TODO get only essential services
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();

    //get all masters in main masters page
    const masters = await getOrganizedMasters();

    return {
        props: {
            page,
            services,
            regions,
            masters
        }
    }
}

const AllMasters = props => {
    return (
        <PublicLayout page={props.page}>
            <Main {...props}/>
        </PublicLayout>
    )
}

export default AllMasters