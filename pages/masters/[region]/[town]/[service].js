import PublicLayout from "components/public/public-layout";
import {getCats, getPageBySlug} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {Main} from "components/public/masters/main";

export async function getServerSideProps({params}) {
    const page = await getPageBySlug(params.service);
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

    return {
        props: {
            services,
            page,
            others,
            othersLine
        }
    }
}

const Masters = ({services, page, others, othersLine}) => {
    return (
        <PublicLayout page={page}>
            <Main services={services} page={page} others={others} othersLine={othersLine}/>
        </PublicLayout>
    )
}

export default Masters