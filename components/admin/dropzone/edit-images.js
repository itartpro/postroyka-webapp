import {useEffect, useState, useContext} from 'react'
import {WsContext} from 'context/WsProvider'
import EditImage from './edit-image'

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery'

export default function EditImages({ins}) {

    const {request, rs, wsMsg, setWsMsg} = useContext(WsContext);
    const [images, setImages] = useState([]);
    const [wait, setWait] = useState(false);
    const imgApi = '/api/images/'+ins.folder.split('/').join('-');

    const readImages = () => {
        if(wait || rs !== 1) return false;
        if(ins && ins.folder && ins.table && ins.album_id) {
            const instructions = {
                table: ins.table,
                album_id: ins.album_id
            };
            const goData = {
                address: 'gpics:50001',
                action: 'read',
                instructions: JSON.stringify(instructions)
            };
            return request(JSON.stringify(goData));
        }
        if(ins && !ins.table && ins.folder) {
            return fetch(imgApi)
                .then(res => res.json())
                .then(data => setImages(data))
                .catch(err => setWsMsg({type: 'alert:red', data: err}))
        }
    }

    useEffect(readImages, [rs])

    useEffect(() => {
        if (!wsMsg) return false;
        if (wsMsg.type === 'error') return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if(wsMsg.data.substr(9, 5) !== "gpics") return false;
        const res = JSON.parse(wsMsg.data);
        if (res.data === "no records found") {
            setWsMsg(null);
            return false;
        }
        if(!res.status) return setWsMsg({type: 'alert:red', data: res.data});
        
        if(!Array.isArray(res.data) && res.data.name) {
            //res.data contains one image object, wait 3 seconds after
            //last retrieved image insert and retrieve a batch from db with one trip
            setWait(true);
            setTimeout(() => {
                setWait(false);
                readImages()
            }, 3000);
        }
        if (Array.isArray(res.data)) setImages(sortList(res.data, 'sort_order'));
        setWsMsg(null);

    }, [wsMsg]);

    const removeImage = name => {
        let newList = images.filter(i => i.name !== name);
        setImages([...newList])
    }

    const updateImage = (id, form) => {
        const index = images.findIndex(i => i.id === id);
        images[index].alt = form.alt;
        images[index].link = form.link;
        images[index].sort_order = form.sort_order;
        images[index].text = form.text;
        images[index].title = form.title;
        const newList = sortList(images, 'sort_order');
        setImages([...newList])
    }

    const sortList = (list, key) => list.sort((a,b) => a[key] - b[key]);

    return (
        <>
            {images && images.length > 0 && (
                <section className={'row bet'}>
                    <Gallery>
                        {images.map((el, i) =>
                                <Item key={el.id || i}
                                      original={process.env.NEXT_PUBLIC_STATIC_URL+ins.folder+"/"+el.name}
                                      thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+ins.folder+"/"+el.name}
                                      width={el.width || ins.width}
                                      height={el.height || ins.height}
                                >
                                    {({ ref, open }) => (
                                        <div ref={ref}>
                                            <EditImage
                                                removeImage={removeImage}
                                                updateImage={updateImage}
                                                PhotoSwipe={open}
                                                {...el}
                                                width={el.width || ins.width}
                                                height={el.height || ins.height}
                                                folder={ins.folder}
                                                table={ins.table}/>
                                        </div>
                                    )}
                                </Item>
                            )}
                    </Gallery>
                </section>
            )}
        </>
    )
}