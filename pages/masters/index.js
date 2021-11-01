import PublicLayout from "components/public/public-layout";
import {Main} from "components/public/masters/main";
import {getCats, getPageBySlug, getRegions, getMasters} from "libs/static-rest";
import {organizeCats} from "libs/arrs";

export async function getServerSideProps({params}) {
    const page = await getPageBySlug('masters');
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    //TODO get only essential services
    const regions = await getRegions();
    const masters = await getMasters();

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