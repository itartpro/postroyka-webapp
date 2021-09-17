import {UploadContext} from 'context/UploadProvider'
import {useContext} from 'react'
export const InputUpload = props => {
    const {setRemains} = useContext(UploadContext);
    const handleFileInput = e => setRemains(Array.from(e.target.files));
    return <input type="file" style={{maxWidth: '300px'}} multiple={props.multiple} name={props.name} id={props.id} onChange={handleFileInput}/>
}