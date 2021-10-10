import PublicLayout from "components/public/public-layout";
import formCSS from "styles/forms.module.css";
import css from "./add.module.css";
import {useForm} from "react-hook-form";
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO} from 'libs/js-time-to-psql';
import {validateEmailPhoneInput} from 'libs/email-phone-input';
import {getRegions, getTowns, getCats} from 'libs/static-rest';
import {organizeCats} from 'libs/arrs';
import {errMsg} from "libs/form-stuff";
import {ShowMessage} from "components/show-message";
import {UploadProvider} from "context/UploadProvider";
import {InputUpload} from "components/input-upload";
import {MdAddAPhoto} from "react-icons/md"

export async function getStaticProps() {
    const regions = await getRegions();
    const defaultTowns = await getTowns();
    const cats = await getCats();
    const services = organizeCats(cats)[1].children.map(e => ({
        id: e.id,
        parent_id: e.parent_id,
        name: e.name,
        children: e.children.map(c => ({
            id: c.id,
            parent_id: c.parent_id,
            name: c.name
        }))
    }));
    return {
        props: {
            regions,
            defaultTowns,
            services
        },
        revalidate: 120
    }
}

const Add = ({regions, defaultTowns, services}) => {
    const {wsMsg, rs, request} = useContext(WsContext);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const [regData, setRegData] = useState({});
    const [towns, setTowns] = useState(defaultTowns);
    const [showMsg, setShowMsg] = useState(null);
    const [images,setImages] = useState([]);

    //handle info from server
    useEffect(() => {
        if (rs !== 1 || !wsMsg) return false;
        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("is taken") && showErr === null) {
                setShowErr("Кто-то уже зарегестрировался на сайте с таким email или телефоном")
            } else {
                setShowErr(wsMsg.data)
            }
            setRegData({});
            return false
        }
        if (wsMsg.type !== "info") {
            setShowMsg(wsMsg.data);
            return false
        }

        let msg = null;
        try {
            msg = JSON.parse(wsMsg.data);
        } catch (err) {
            console.log("could not parse data: ",wsMsg.data, err)
            return false;
        }

        //parse towns
        if(msg && msg.data && msg.data.hasOwnProperty(0)) {
            if(msg.data[0].hasOwnProperty('region_id')) {
                setTowns(msg.data);
                return true
            }
        }
        setRegData({})
    }, [rs, wsMsg]);

    const regionWatch = watch('region');

    const onSubmit = data => console.log(data);
    console.log(errors);

    return (
        <PublicLayout>
            <main className="col start max">
                <header><h1 className={css.h1}>Добавить заказ</h1></header>
                <form onSubmit={handleSubmit(onSubmit)} className={'col start ' + formCSS.form}>
                    <label htmlFor="i1">Что нужно сделать?</label>
                    <input id="i1" type="text" {...register('name', {required: true, maxLength: 90})} placeholder="Заголовок"/>
                    {errMsg(errors.first_name, 70)}
                    <br/>
                    <label htmlFor="i2">Укажите объем и виды работ</label>
                    <textarea id="i2" {...register("text", {required: true, maxLength: 2000})} />
                    {errMsg(errors.first_name, 2000)}
                    <div className={'row start '+css.imgs}>
                        {!(images && images.length > 4) && (
                            //ограничение на 5 картинок для каждой работы
                            <div className={css.add_img}>
                                <span>Приложить изображения <MdAddAPhoto/></span>
                                <div>
                                    <label htmlFor="add_order_images">
                                        <UploadProvider
                                            chunkSize={1048576}
                                            allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                                            address={'gpics:50001'}
                                            action={'process'}
                                            instructions={{
                                                folder: 'temp',
                                                width: 1000,
                                                height: 1000,
                                                fit: 'Fit', //Fit or Fill (with crop)
                                                position: 'Center',
                                                copy:{
                                                    folder:'temp/mini',
                                                    height:100,
                                                    width:140
                                                }
                                            }}>
                                            <InputUpload name="add_order_images" id="add_order_images" multiple={false}/>
                                        </UploadProvider>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </main>
        </PublicLayout>
    )
}

export default Add