import PublicLayout from "components/public/public-layout";
import {Main} from "components/public/masters/main";
import {getCats, getPageBySlug} from "libs/static-rest";
import {organizeCats} from "libs/arrs";

export async function getServerSideProps({params}) {
    const page = await getPageBySlug('masters');
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });

    return {
        props: {
            page,
            services
        }
    }
}

const Masters = ({page, services}) => {
    return (
        <PublicLayout page={page}>
            <Main services={services} page={page}/>
        </PublicLayout>
    )
}

export default Masters