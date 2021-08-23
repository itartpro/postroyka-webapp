import {useRouter} from 'next/router'
import AdminLayout from 'components/admin/admin-layout'
import DropImages from 'components/admin/dropzone/drop-images'

export default function Images() {
    const {query} = useRouter();
    const urlId = parseInt(query.id);

    return (
        <AdminLayout>
            <header className={'col start'}>
                <h1>Редактировать картинки категории, id: {urlId}</h1>
            </header>
            <DropImages drop_name={'cat_'+urlId+'_images'} instructions={{
                location: 'cats/'+urlId,
                width: 1200,
                height: 1200,
                fit: 'Fit',
                table: 'cats_media',
                album_id: urlId
            }} />
        </AdminLayout>
    )
}