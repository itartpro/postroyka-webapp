import DropUpload from './drop-upload'
import EditImages from './edit-images'
import UploadProvider from 'context/UploadProvider'

export default function DropImages(props) {
    return (
        <div ref={props.dropRef || null}>
            <UploadProvider
                //these will be props in the context
                chunkSize={1048576}
                allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                address={'gpics:50001'}
                action={'process'}
                instructions={props.instructions}>
                <DropUpload name={props.drop_name} showProgress={true}/>
            </UploadProvider><br/>
            <EditImages ins={props.instructions}/>
        </div>
    )
}