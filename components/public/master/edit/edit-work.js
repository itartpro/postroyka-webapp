import formCSS from "styles/forms.module.css";
import css2 from "pages/master/[id]/add-work/add-work.module.css";
import css from "./edit.module.css";
import {errMsg} from "libs/form-stuff";
import {useForm} from "react-hook-form";
import {UploadProvider} from "context/UploadProvider";
import {InputUpload} from "components/input-upload";
import {MdAddAPhoto} from "react-icons/md"
import {EditImage} from './edit-image';
import {useState, useEffect, useContext} from 'react'
import {WsContext} from "context/WsProvider";

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';

export const EditWork = ({serviceId, userId, work, setShowMsg }) => {
    //backend stuff
    const {wsMsg, request, rs} = useContext(WsContext);

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const submitEdit = d => {
        const workData = {
            id: work.id,
            name: d.name,
            description: d.description,
            hours: parseInt(d.hours || 0) + parseInt(d.days || 0) * 24,
            login_id: userId,
            service_id: serviceId,
            price: parseInt(d.price),
            order_id: work.order_id
        };
        const goData = {
            address: 'auth:50003',
            action: 'update-work',
            instructions: JSON.stringify(workData)
        };
        request(JSON.stringify(goData));
    }
    const calculatedDays = Math.floor(work.hours/24);
    const calculatedHours = work.hours - calculatedDays * 24;

    //image stuff
    const ins = {
        folder: 'masters/'+userId+'/work/'+work.id,
        album_id: work.id,
        table: 'portfolio_media'
    }
    const [images,setImages] = useState([])
    const [wait, setWait] = useState(false);
    const imgApi = ins.folder && '/api/images/'+ins.folder.split('/').join('-');
    const sortList = (list, key) => list.sort((a,b) => a[key] - b[key]);
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
        if(imgApi && ins && !ins.table && ins.folder) {
            return fetch(imgApi)
                .then(res => res.json())
                .then(data => setImages(data))
                .catch(err => setWsMsg({type: 'alert:red', data: err}))
        }
    }
    useEffect(readImages, [rs])
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

    //read back-end
    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type === "info") {
            let msg = null;
            try {
                msg = JSON.parse(wsMsg.data);
            } catch (err) {
                console.log("could not parse data: ",wsMsg.data, err)
                return false;
            }

            if(msg.name === "gpics") {
                //update profile image and avatar status to true upon successful avatar upload
                if (msg.status) {
                    if(!Array.isArray(msg.data) && msg.data.name) {
                        //res.data contains one image object, wait 3 seconds after (unless uploading by one - then less)
                        //last retrieved image insert and retrieve a batch from db with one trip
                        setWait(true);
                        setTimeout(() => {
                            setWait(false);
                            readImages()
                        }, 500);
                    }

                    if (Array.isArray(msg.data) && msg.data[0].album_id === work.id) {
                        setImages(sortList(msg.data, 'sort_order'));
                    }
                } else {
                    console.log(msg.data);
                }
            }

            if(msg.name === "auth") {
                if(msg.status && msg.data === 'updated successfully') {
                    setShowMsg("Успешно обновлены данные")
                }
            }
        } else {
            console.log(wsMsg.data)
        }
    }, [wsMsg])

    return (
        <div className="col start">
            <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form +' '+ css2.padded}`}>
                <input type="text" {...register('name', {required: true, maxLength: 200})} placeholder="Название" defaultValue={work.name}/>
                {errMsg(errors.name, 70)}

                <textarea {...register('description', {required: true, maxLength: 2000})} placeholder="Напишите о самой работе / о процессе" defaultValue={work.description}/>
                {errMsg(errors.description, 2000)}

                <p>Сколько времени ушло на эту работу? (можно приблизительно)</p>
                <div className={`row center start ${css2.time}`}>
                    <label>Часы:</label>
                    <input type="number" min="0" max="23" placeholder="Часы" {...register('hours')} defaultValue={calculatedHours}/>
                    <label>Дни:</label>
                    <input type="number" min="0" max="1460" placeholder="Дни" {...register('days')} defaultValue={calculatedDays}/>
                </div>

                <input type="number" {...register('price')} min="0" max="2147483647" placeholder="Приблизительная цена за похожую работу (в рублях)" defaultValue={work.price}/>
                {errMsg(errors.price, 70)}

                <input type="submit" value="Изменить инфо"/>
            </form>
            <div className={'row '+css.imgs}>
                {(images && images.length > 0) && (
                    <Gallery>
                        {images.map((el, i) =>
                            <Item key={el.id || i}
                                  original={process.env.NEXT_PUBLIC_STATIC_URL+ins.folder+"/"+el.name}
                                  thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+ins.folder+"/mini/"+el.name}
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
                                            thumb={process.env.NEXT_PUBLIC_STATIC_URL+ins.folder+"/mini/"+el.name}
                                            table={ins.table}/>
                                    </div>
                                )}
                            </Item>
                        )}
                    </Gallery>
                )}
                {!(images && images.length > 4) && (
                    //ограничение на 5 картинок для каждой работы
                    <div className={css.add_img}>
                        <span>Добавить фото <MdAddAPhoto/></span>
                        <div>
                            <label htmlFor="work_img_upload">
                                <UploadProvider
                                    chunkSize={1048576}
                                    allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                                    address={'gpics:50001'}
                                    action={'process'}
                                    instructions={{
                                        folder: 'masters/' + userId + '/work/' + work.id,
                                        width: 1400,
                                        height: 1400,
                                        fit: 'Fit', //Fit or Fill (with crop)
                                        position: 'Center',
                                        table: 'portfolio_media',
                                        album_id: work.id,
                                        copy:{
                                            folder:'masters/' + userId + '/work/' + work.id + '/mini',
                                            height:100,
                                            width:140
                                        }
                                    }}>
                                    <InputUpload name="work_img" id="work_img_upload" multiple={false}/>
                                </UploadProvider>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}