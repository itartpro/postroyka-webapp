import css from './edit-image.module.css'
import {useState, useEffect, useContext} from 'react'
import {WsContext} from 'context/WsProvider'

export const EditImage = ({table,id,PhotoSwipe,folder,thumb,alt,title,text,link,sort_order,name,width,height,removeImage,updateImage}) => {

    //const formData = {table,id,alt,title,text,link,sort_order}
    const {request, wsMsg, setWsMsg} = useContext(WsContext);
    //const [form, setForm] = useState(formData);

    /*const handleChange = e => {
        const t = e.target
        return setForm({...form, [t.name]: t.value});
    }

    const saveData = () => {
        form.sort_order = parseInt(form.sort_order);
        const goData = {
            address: 'gpics:50001',
            action: 'update',
            instructions: JSON.stringify({...form,"table":table})
        }
        request(JSON.stringify(goData));
    }*/

    const imageRemove = deletedName => deletedName === name ? removeImage(name) : null;

    const imageUpdate = updatedId => parseInt(updatedId) === id ? updateImage(id, form) : null;

    const deleteImage = () => {
        const goData = {
            address: 'gpics:50001',
            action: 'delete',
            instructions: JSON.stringify({...form,"table":table,"folder":folder,"name":name})
        }
        request(JSON.stringify(goData));
    }

    useEffect(() => {
        if(!wsMsg) return false
        if(wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.data.substr(9, 5) === "gpics") {
            const res = JSON.parse(wsMsg.data);
            if(typeof res.data === 'string') {
                //delete or updated failed
                if(res.data.substr(7, 10) === "failed, id") setWsMsg({type: 'alert:red', data: res.data});
                //success
                if(res.data.substr(0, 14) === "update success") {
                    const img = res.data.split(":");
                    imageUpdate(img[1], form);
                    setWsMsg({type: 'alert:green:timed', data: "image updated"});
                }
                if(res.data.substr(0, 13) === "image deleted") {
                    const img = res.data.split(":");
                    imageRemove(img[1]);
                }
            }
        }
    }, [wsMsg])

    return (
        <div className={css.img}>
            <div>
                <img
                    onClick={PhotoSwipe}
                    src={thumb}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                />
            </div>

            {/*table && <form onSubmit={e => e.preventDefault()}>
                <div>
                    <label htmlFor={id + 'text'}>Текст:</label>
                    <textarea name="text" id={id + 'text'} cols="30" rows="2" maxLength={255} defaultValue={form.text} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor={id + 'sort_order'}>Ордер сортировки:</label>
                    <input type="number" step="1" min="1" id={id + 'sort_order'} value={form.sort_order} name="sort_order" onChange={handleChange}/>
                </div>
                <div className="row">
                    <input type="submit" value="Сохранить" onClick={saveData}/>
                    <input type="submit" value="Удалить" onClick={deleteImage}/>
                </div>
            </form>}
            {!table && folder && <input type="submit" value="Удалить" onClick={deleteImage}/>*/}
            <input type="submit" value="Удалить" onClick={deleteImage}/>
        </div>
    )
}