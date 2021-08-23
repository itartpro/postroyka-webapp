import AdminLayout from 'components/admin/admin-layout'
import DropImages from 'components/admin/dropzone/drop-images'

//There will always be a limited amount of banners on a site
//That why this is an excellent example of showing how to implement
//getStaticProps and getStaticPaths
//https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
const bannerParams = {
    "homeone":{
        name:"Большой баннер",
        instructions: {
            location: 'banners/1',
            width: 1903,
            height: 680,
            fit: 'Fill',
            table: 'banners_media',
            album_id: 1
        }
    },
    "hometwo":{
        name:"Маленький баннер",
        instructions: {
            location: 'banners/2',
            width: 680,
            height: 380,
            fit: 'Fill',
            table: 'banners_media',
            album_id: 2
        }
    }
}

//params.banner is what we get from file name ([banner]) and url slug
export async function getStaticProps({params}) {
    return {
        props: bannerParams[params.banner]
    }
}

export async function getStaticPaths() {
    return {
        paths: [
            {params: {banner: 'homeone'}},
            {params: {banner: 'hometwo'}}
        ],
        fallback: false
    }
}

export default function Banner(props) {

    return (
        <AdminLayout>
            <header className={'col start'}><h1>Редактировать {props.name}</h1></header>
            <DropImages drop_name={props.name} instructions={props.instructions}/>
        </AdminLayout>
    )
}