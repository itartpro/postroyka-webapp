import {useRouter} from 'next/router'
import AdminLayout from 'components/admin/admin-layout'
import DropImages from 'components/admin/dropzone/drop-images'
import Links from 'components/admin/products/links'

export default function Images() {
    const {query} = useRouter();
    const urlId = parseInt(query.id);

    return (
        <AdminLayout>
            <Links id={urlId}/>
            <header className={'col start'}>
                <h1>Редактировать картинки товара, id: {urlId}</h1>
            </header>
            <DropImages drop_name={'product_'+urlId+'_images'} instructions={{
                location: 'products/'+urlId,
                width: 1200,
                height: 1200,
                fit: 'Fit',
                table: 'products_media',
                album_id: urlId,
                copy:{folder:'thumbs', height:480, width:320}
            }} />
        </AdminLayout>
    )
}