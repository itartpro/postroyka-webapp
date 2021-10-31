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
    let othersLine = "";
    const others = services.reduce((result, parent) => {
        parent.children.forEach(e => {
            if(page.id === e.id) {
                othersLine = `Услуги раздела ${e.name}`;
                if(e.children && e.children.length > 0) {
                    e.children.forEach(e2 => result.push(e2))
                }
            }
            if(page.parent_id === e.id) {
                othersLine = `Другие услуги раздела ${e.name}`;
                if(e.children && e.children.length > 0) {
                    e.children.forEach(e2 => result.push(e2))
                }
            }
        })
        return result
    }, []);
    const regions = await getRegions();
    const towns = await getTowns(region.id || 1);

    return {
        props: {
            services,
            page,
            others,
            othersLine,
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