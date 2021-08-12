import css from './edit-image.module.css'
import {useState, useEffect, useContext} from 'react'
import {WsContext} from 'context/WsProvider'

export default function EditImage({table,id,PhotoSwipe,location,alt,title,text,link,sort_order,name,width,height,removeImage,updateImage}) {

    const formData = {table,id,alt,title,text,link,sort_order}
    const {request, wsMsg, setWsMsg} = useContext(WsContext);
    const [form, setForm] = useState(formData);
    const loc = process.env.NEXT_PUBLIC_STATIC_URL+location+"/"+name;

    const handleChange = e => {
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
        request('crud', JSON.stringify(goData));
    }

    const imageRemove = deletedName => deletedName === name ? removeImage(name) : null;

    const imageUpdate = updatedId => parseInt(updatedId) === id ? updateImage(id, form) : null;

    const deleteImage = () => {
        const goData = {
            address: 'gpics:50001',
            action: 'delete',
            instructions: JSON.stringify({...form,"table":table,"location":location,"name":name})
        }
        request('crud', JSON.stringify(goData));
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
                    src={loc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                />
            </div>
            {table && <form onSubmit={e => e.preventDefault()}>
                <div>
                    <label htmlFor={id + 'alt'}>alt:</label>
                    <input type="text" id={id + 'alt'} value={form.alt}
                           name="alt"
                           maxLength={255}
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor={id + 'title'}>title:</label>
                    <input type="text" id={id + 'title'} value={form.title}
                           name="title"
                           maxLength={255}
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor={id + 'link'}>Ссылка:</label>
                    <input type="text" id={id + 'link'} value={form.link}
                           name="link"
                           maxLength={255}
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor={id + 'text'}>Текст:</label>
                    <input type="text" id={id + 'text'} value={form.text}
                           name="text"
                           maxLength={255}
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor={id + 'sort_order'}>Ордер:</label>
                    <input type="number" step="1" min="1" id={id + 'sort_order'} value={form.sort_order}
                           name="sort_order"
                           onChange={handleChange}/>
                </div>
                <div className="row">
                    <input type="submit" value="Сохранить" onClick={saveData}/>
                    <input type="submit" value="Удалить" onClick={deleteImage}/>
                </div>
            </form>}
            {!table && location && <input type="submit" value="Удалить" onClick={deleteImage}/>}
        </div>
    )
}