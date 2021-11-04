import PublicLayout from "components/public/public-layout";
import {Main} from "components/public/masters/main";
import {getPageBySlug, getRegions} from "libs/static-rest";
import {getOrganizedMasters, essentialCats} from "libs/masters-stuff";

export async function getStaticProps() {
    const page = await getPageBySlug('masters');
    const regions = await getRegions();
    const services = await essentialCats();
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