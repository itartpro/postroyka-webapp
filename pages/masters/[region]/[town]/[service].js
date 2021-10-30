import PublicLayout from "components/public/public-layout";
import {getCats, getPageBySlug, getRegions, getTowns} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";

export async function getServerSideProps({params}) {
    const page = {
        title: 'the title',
        slug: 'the slug',
        h1: 'the h1',
        description: 'the descretr',
        text: 'fgdfgdfg text sdsdf 5text'
    };
    if(params.service !== "all") {
        const page = await getPageBySlug(params.service)
    }
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
    const towns = await getTowns();

    return {
        props: {
            services,
            page,
            others,
            othersLine,
            regions,
            towns
        }
    }
}

const Masters = props => {
    return (
        <PublicLayout page={props.page}>
            <Main {...props}/>
        </PublicLayout>
    )
}

export default Masters