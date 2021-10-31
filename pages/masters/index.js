import PublicLayout from "components/public/public-layout";
import {Main} from "components/public/masters/main";
import {getCats, getPageBySlug, getRegions, getTowns} from "libs/static-rest";
import {organizeCats} from "libs/arrs";

export async function getServerSideProps({params}) {
    const page = await getPageBySlug('masters');
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();

    return {
        props: {
            page,
            services,
            regions
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