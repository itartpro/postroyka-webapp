import {UploadContext} from 'context/UploadProvider'
import {useContext} from 'react'
export default function InputUpload(props) {
    const {setRemains} = useContext(UploadContext);
    const handleFileInput = e => setRemains(Array.from(e.target.files));
    return <input type="file" style={{maxWidth: '300px'}} multiple={props.multiple} name="image" id="image" onChange={handleFileInput}/>
}