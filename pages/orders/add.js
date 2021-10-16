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
import {MdAddAPhoto} from "react-icons/md";
import {IoIosArrowDown} from 'react-icons/io';
import {useRouter} from "next/router";
import {MarkedRangeSlider} from "components/public/orders/marked-range-slider";
import {translit} from "../../libs/slugify";

export async function getStaticProps() {
    const regions = await getRegions();
    const defaultTowns = await getTowns();
    const cats = await getCats();
    const services = organizeCats(cats)[1].children;
    const directServices = [];
    const smartSearch = [];
    services.forEach(e => e.children.forEach(e2 => {
        directServices.push({
            id: e2.id,
            parent_id: e2.parent_id,
            name: e2.name
        });
        if(e2.hasOwnProperty('children') && e2.children.length > 0) {
            e2.children.forEach(e3 => {
                smartSearch.push({
                    id: e3.id,
                    parent_id: e3.parent_id,
                    name: e3.name
                })
            })
        }
    }))

    return {
        props: {
            regions,
            defaultTowns,
            directServices: directServices.sort((a,b) => a.name.localeCompare(b.name)),
            smartSearch
        },
        revalidate: 120
    }
}

const Add = ({regions, defaultTowns, smartSearch, directServices}) => {
    const {wsMsg, rs, request} = useContext(WsContext);
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

    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm({
        defaultValues: {
            service_id:""
        }
    });

    const onSubmit = d => {
        console.log(d)
    }

    //all of this deals with the title
    const {query} = useRouter();
    useEffect(() => query && query.title && setValue('title', query.title), [query])
    const titleWatch = watch('title');
    const searchWord = str => {
        if(!str) return false;
        const title = str.toLowerCase();
        const idx1 = directServices.findIndex(e => {
            const str = e.name.toLowerCase();
            return str.includes(title)
        });
        const idx2 = smartSearch.findIndex(e => {
            const str = e.name.toLowerCase();
            return str.includes(title)
        });
        if(directServices[idx1]) {
            setValue('service_id', directServices[idx1].id);
            return true;
        }
        if(!directServices[idx1] && smartSearch[idx2]) {
            setValue('service_id', smartSearch[idx2].parent_id);
            return true;
        }
        return false
    }
    useEffect(() => {
        if(!titleWatch) return false;
        const exp = titleWatch.split(" ");
        exp[0] && searchWord(exp[0]);
        exp[1] && searchWord(exp[1]);
        exp[2] && searchWord(exp[2])
    }, [titleWatch])

    //region and towns
    const regionWatch = watch('region');
    useEffect(() => {
        const goData = {
            address: 'auth:50003',
            action: 'read-towns',
            instructions: JSON.stringify({region_id: parseInt(regionWatch)})
        };
        request(JSON.stringify(goData))
    }, [regionWatch])

    const marks = [1000, 1500, 2000, 2500, 3000, 5000, 7000, 10000, 15000, 30000, 50000, 100000, 150000, 300000, 500000, 1000000, 1500000, 3000000, 10000000];
    const [rangeValue, setRangeValue] = useState(0);
    const getRangeValue = e => setRangeValue(e);

    return (
        <PublicLayout>
            <main className="col start max">
                <header><h1 className={css.h1}>Добавить заказ</h1></header>
                <form onSubmit={handleSubmit(onSubmit)} className={'col start ' + formCSS.form}>
                    <p>Что нужно сделать?</p>
                    <input type="text" {...register('title', {required: true, maxLength: 90})} placeholder='Заголовок (например "Сделать натяжные потолки" или "Ремонт стиральной машинки")'/>
                    {errMsg(errors.title, 70)}
                    <br/>

                    <p>Чтобы Ваш заказ быстрее попал к соответствующему мастеру выберите к какой категории работ отонсится Ваш заказ</p>
                    <div className={'rel '+formCSS.sel}>
                        <select {...register('service_id', {required: true})} data-label="Категория услуг">
                            <option value="">Выберите категорию</option>
                            {directServices && directServices.map(e => (
                                <option key={'ds'+e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>
                    {errMsg(errors.service_id)}
                    <br/>

                    <p>Укажите объем и виды работ</p>
                    <textarea
                        {...register("text", {required: true, maxLength: 2000})}
                        placeholder="Напишите список работ, укажите объём (например, если это помещение, то в квадратных метрах). Опишите Ваши пожелания и требования если они есть. Чем детальнее Вы напишите тех. задание - тем охотнее согласятся работать компетентные мастера."/>
                    {errMsg(errors.text, 2000)}
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
                    <br/>

                    <b>Ваш город / где будет проводится работа</b>
                    <p>Выберите Вашу область</p>
                    <div className={'rel '+formCSS.sel}>
                        <select placeholder="Выберите Вашу область" {...register('region', {required: true})} defaultValue="1">
                            {regions.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>

                    <p>Выберите Ваш город/населённый пункт (или ближайший к нему из списка)</p>
                    <div className={'rel '+formCSS.sel}>
                        <select placeholder="Выберите Ваш город" {...register('town', {required: true})}>
                            {towns && towns.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>
                    <br/>

                    <p>Выберите бюджет</p>
                    <MarkedRangeSlider returnValue={getRangeValue} marks={marks}/>
                    <div className={'row '+css.budget}>
                        <span>До</span>
                        <input type="number" placeholder="budget" defaultValue={rangeValue} {...register("budget", {required: true, max: marks[marks.length - 1], min: marks[0]})} />
                        <span>рублей</span>
                    </div>
                    <br/>

                    <b>Как Вас зовут? (публикуется, фамилия и отчество не обязательно)</b>
                    <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя"/>
                    {errMsg(errors.first_name, 40)}

                    <input type="text" {...register('last_name', {required: true, maxLength: 40})} placeholder="Ваша фамилия"/>
                    {errMsg(errors.last_name, 40)}

                    <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} placeholder="Ваше отчество"/>
                    {errMsg(errors.paternal_name, 40)}
                    <br/>

                    <input type="text" {...register('email', {required: true, maxLength: 50})} placeholder="Ваш email"/>
                    {errMsg(errors.email, 50)}

                    <input type="password" {...register('password', {required: true, maxLength: 32})} placeholder="Выберите пароль"/>
                    {errMsg(errors.password, 32)}

                    <input type="password" {...register('password_confirm', {
                        required: true,
                        maxLength: 32,
                        validate: {
                            sameAs: v => translit(v) === passwordWatch || "Пароли не похожи"
                        }
                    })} placeholder="Повторите пароль"/>
                    {errMsg(errors.password_confirm, 32)}

                    <input type="submit" value="Найти мастера"/>
                </form>
                <br/><br/><br/>
            </main>
        </PublicLayout>
    )
}

export default Add