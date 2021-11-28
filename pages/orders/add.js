import PublicLayout from "components/public/public-layout";
import formCSS from "styles/forms.module.css";
import css from "./add.module.css";
import {useForm} from "react-hook-form";
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO} from 'libs/js-time-to-psql';
import {getRegions, getTowns, getCats} from 'libs/static-rest';
import {organizeCats} from 'libs/arrs';
import {errMsg} from "libs/form-stuff";
import {UploadProvider} from "context/UploadProvider";
import {InputUpload} from "components/input-upload";
import {MdAddAPhoto} from "react-icons/md";
import {IoIosArrowDown} from 'react-icons/io';
import {useRouter} from "next/router";
import {MarkedRangeSlider} from "components/public/orders/marked-range-slider";
import {translit} from "libs/slugify";
import {ShowMessage} from "components/show-message";
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';
import {validateEmailPhoneInput} from "libs/email-phone-input";
import css2 from "styles/forms.module.css";

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
    const {wsMsg, rs, verifiedJwt, request, logOut} = useContext(WsContext);
    const [showErr, setShowErr] = useState(null);
    const [towns, setTowns] = useState(defaultTowns);
    const [showMsg, setShowMsg] = useState(null);
    const [order, setOrder] = useState({});
    const [images,setImages] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);

    //all of this deals with the title and id for images temp folder
    useEffect(() => {
        if(!router.query.id) {
            //router.push('/profile/'+user.id);
            let newUrl = router.pathname;
            if(router.query.title) {
                newUrl += '?title=' + router.query.title.replace(/ /g, '+');
                newUrl += '&id=' + Date.now()
            } else {
                newUrl += '?id=' + Date.now()
            }
            router.push(newUrl)
        }
        router.query.title && setValue('title', router.query.title)
    }, [router.query])

    //When JWT is in local storage and verified - get user data
    useEffect(() => {
        if(!verifiedJwt) return false;

        const userString = window.localStorage.getItem('User');
        const JWTString = window.localStorage.getItem('AccessJWT');
        if(!userString && !JWTString) return logOut();

        let idFromJWT = 0;
        let debased64 = null;
        let localUser = {id:null};

        try {
            debased64 = atob(JWTString.split('.')[1])
            if(userString) localUser = JSON.parse(userString);
        } catch (err) {
            setShowMsg( "User and/or AccessJWT corrupted: " + err);
            logOut();
            return false
        }
        const parsed = JSON.parse(debased64);
        idFromJWT = parseInt(parsed.sub)

        if(localUser.id === idFromJWT) {
            setUser(localUser)
        } else {
            if(idFromJWT !== 0) {
                const goData = {
                    address: 'auth:50003',
                    action: 'get-profile',
                    instructions: JSON.stringify({id:idFromJWT})
                };
                request(JSON.stringify(goData))
            }
        }
    }, [verifiedJwt])

    //handle info from server
    useEffect(() => {
        if (rs !== 1 || !wsMsg) return false;

        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("is taken")) {
                let msg = "Кто-то уже зарегестрировался на сайте с таким email или телефоном. Если это Вы - то введите Ваш логин (email/телефон) в конце формы.";
                setShowErr(msg);
                setShowMsg(msg);
                setShowLogin(true);
            } else {
                setShowErr(wsMsg.data)
            }
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

        if(msg.data && msg.name === 'auth') {
            //looks like the visitor registered and got into the database
            if(msg.data.hasOwnProperty('refresh')) {
                const user = msg.data;
                const essentialUserData = {
                    id: user.id,
                    level: user.level,
                    avatar: user.avatar,
                    first_name: user.first_name,
                    last_name: user.last_name
                };
                window.localStorage.setItem('User', JSON.stringify(essentialUserData));
                setUser(essentialUserData);
            }

            //looks like the order has been added to db, check for images and add them to alum and move them to folder
            if(msg.data.hasOwnProperty('budget')) {
                if(msg.data.id && images.length > 0) {
                    let album_id = parseInt(msg.data.id);
                    images.forEach(e => {
                        const goData = {
                            address: 'gpics:50001',
                            action: 'process',
                            instructions: JSON.stringify({
                                src: 'temp/'+router.query.id,
                                name: e.name,
                                folder: 'orders/' + album_id,
                                width: 1400,
                                height: 1400,
                                fit: 'Fit', //Fit or Fill (with crop)
                                position: 'Center',
                                table: 'orders_media',
                                album_id,
                                copy:{
                                    folder:'orders/' + album_id + '/mini',
                                    height:100,
                                    width:120
                                }
                            })
                        };
                        request(JSON.stringify(goData))
                    });
                    setImages([]);
                }
                return router.push('/profile/'+msg.data.login_id)
            }

            //parse towns
            if(msg.data.hasOwnProperty(0)) {
                if(msg.data[0].hasOwnProperty('region_id')) {
                    setTowns(msg.data);
                    return true
                }
            }
        }

        if(msg.data && msg.name === 'gpics') {
            const folder = 'temp/'+router.query.id
            const imgApi = folder && '/api/images/'+folder.split('/').join('-');
            fetch(imgApi)
                .then(res => res.json())
                .then(data => {
                    if(data && data.length > 0) {
                        setImages([...data])
                    } else {
                        setImages([])
                    }
                })
                .catch(err => console.log(err))
        }

    }, [rs, wsMsg]);

    useEffect(() => {
        if(!user || !order) return false;
        if(user.hasOwnProperty('id') && user.hasOwnProperty('first_name') && order.hasOwnProperty('town_id')) {
            //insert new order into database, with the visitors id
            order.login_id = user.id;
            const goData = {
                address: 'auth:50003',
                action: 'add-order',
                instructions: JSON.stringify(order)
            };
            request(JSON.stringify(goData))
        }
    }, [user, order])

    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm({
        defaultValues: {
            service_id:""
        }
    });

    const titleWatch = watch('title');
    const searchWord = str => {
        if(!str || str.length < 3) return false;
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

    const passwordWatch = watch('password');

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
    const getRangeValue = e => {
        setValue('budget', e);
        setRangeValue(e);
    }

    const deleteImage = name => {
        const goData = {
            address: 'gpics:50001',
            action: 'delete',
            instructions: JSON.stringify({
                folder:"temp/"+router.query.id,
                name
            })
        }
        request(JSON.stringify(goData));
    }

    const onSubmit = d => {
        //check if errors object is not empty
        for(let i in errors) return false;

        const created = nowToISO();
        const register = {
            first_name: d.first_name,
            last_name: d.last_name,
            paternal_name: d.paternal_name,
            email: d.email,
            level: 1,
            phone: '',
            password: d.password,
            region_id: parseInt(d.region),
            town_id: parseInt(d.town),
            created: created,
            last_online: created
        };

        if (!register.email && !register.phone) return false;

        let name = d.first_name;
        if(d.paternal_name.length > 0) name += ' '+d.paternal_name;
        if(d.last_name.length > 0) name += ' '+d.last_name;

        //first register guy
        const addOrder = {
            name,
            title: d.title,
            service_id: parseInt(d.service_id),
            created: created,
            description: d.description,
            region_id: parseInt(d.region),
            town_id: parseInt(d.town),
            login_id: 0,
            budget: parseInt(d.budget),
            time: d.time || ""
        };
        setOrder(addOrder);

        const goData = {
            address: 'auth:50003',
            action: 'register',
            instructions: JSON.stringify(register)
        };
        request(JSON.stringify(goData))
    }

    const tryLogin = d => {
        const login = validateEmailPhoneInput(d.login);
        {/* login returns {type, value} type is 'email' or 'phone' (this check fails if other type of login is used) */}
        if(!login) return false;
        const instructions = {
            login: btoa(login.value),
            password: btoa(d.password)
        };
        const goData = {
            address: 'auth:50003',
            action: 'login',
            instructions: JSON.stringify(instructions)
        };

        request(JSON.stringify(goData), 'jwt-auth')
    }

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
                        {...register("description", {required: true, maxLength: 2000})}
                        data-label="Описание работы"
                        placeholder="Напишите список работ, укажите объём (например, если это помещение, то в квадратных метрах). Опишите Ваши пожелания и требования если они есть. Чем детальнее Вы напишите тех. задание - тем охотнее согласятся работать компетентные мастера."/>
                    {errMsg(errors.description, 2000)}
                    <br/>

                    <p>Сроки (когда можно начинать/нужно закончить)</p>
                    <input type="text" {...register('time', {maxLength: 100})} placeholder="Сроки"/>
                    {errMsg(errors.time, 100)}
                    <br/>

                    <div className={'row start '+css.imgs}>
                        {(images && images.length > 0) && (
                            <Gallery>
                                {images.map((e, i) =>
                                    <Item key={i}
                                          original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/temp/'+router.query.id+'/'+e.name}
                                          thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/temp/'+router.query.id+'/'+e.name}
                                          width={e.width}
                                          height={e.height}
                                    >
                                        {({ ref, open }) => (
                                            <div className="col">
                                                <figure>
                                                    <img
                                                        ref={ref}
                                                        onClick={open}
                                                        src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/temp/'+router.query.id+'/'+e.name}
                                                        alt={i}
                                                        width={Math.round(e.width * 100 / e.height)}
                                                        height={100}
                                                        loading="lazy"
                                                    />
                                                </figure>
                                                <button onClick={ev => {
                                                    ev.preventDefault();
                                                    deleteImage(e.name)
                                                }}>Удалить</button>
                                            </div>
                                        )}
                                    </Item>
                                )}
                            </Gallery>
                        )}
                        {!(images && images.length > 3) && (
                            //ограничение на 4 картинок для каждой работы
                            <div className={css.add_img}>
                                <span>Приложить изображения<br/>(до 4) <MdAddAPhoto/></span>
                                <div>
                                    <label htmlFor="add_order_images">
                                        <UploadProvider
                                            chunkSize={1048576}
                                            allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                                            address={'gpics:50001'}
                                            action={'process'}
                                            instructions={{
                                                folder: 'temp/'+router.query.id,
                                                width: 1400,
                                                height: 1400,
                                                fit: 'Fit', //Fit or Fill (with crop)
                                                position: 'Center',
                                                temp_time: 3600
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
                        <input type="number" data-label="Бюджет" {...register("budget", {required: true, max: marks[marks.length - 1], min: marks[0]})} />
                        <span>рублей</span>
                    </div>
                    {errMsg(errors.budget)}
                    <br/>

                    <b>Как Вас зовут? (публикуется имя, фамилия и отчество не обязательно)</b>
                    <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя" defaultValue={user && user.first_name || ""}/>
                    {errMsg(errors.first_name, 40)}

                    <input type="text" {...register('last_name', {required: false, maxLength: 40})} placeholder="Ваша фамилия" defaultValue={user && user.last_name || ""}/>
                    {errMsg(errors.last_name, 40)}

                    <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} placeholder="Ваше отчество"/>
                    {errMsg(errors.paternal_name, 40)}
                    <br/>

                    {/* Оптимальный вариант это дать им выбор логина по Google ИЛИ
                    Email / Пароль
                    Телефон / Пароль
                    Если заполнено оба поля Телефон и Email то Email выступает в качестве логина
                    ---- А ЕЩЁ идеальнее это сделать возможность логина ПО гугл и ПО почте/телефону паролю
                    ---- Если у них уже сделана система Логина/пароля то им нужно авторизоватся и после этого авторизоватся в Google
                    */}
                    {!user && (
                        <>
                            <p>В дальнейшем Вы сможете авторизовываться на сайте используя свой Email и Пароль</p>
                            <input type="email" {...register('email', {required: true, maxLength: 50})} placeholder="Ваш email"/>
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
                        </>
                    )}

                    <input type="submit" value="Найти мастера"/>
                    {showErr && <small>{showErr}</small>}
                </form>
                {showLogin && (
                    <form onSubmit={handleSubmit(tryLogin)} className={`col init start ${css2.form}`}>
                        <br/><br/>
                        <input type="text" {...register('login', {required: true, maxLength: 70})} placeholder="Ваш email или телефон"/>
                        {errors.login && <small>Обязательное поле не более 70 символов</small>}

                        <input type="password" {...register('password', {required: true, maxLength: 32})} placeholder="Ваш пароль"/>
                        {errors.password && <small>Обязательное поле не более 32 символов</small>}

                        <input type="submit" name="attempt_login" value="Войти"/>
                    </form>
                )}
                <br/><br/><br/>
                {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={6000}/>}
            </main>
        </PublicLayout>
    )
}

export default Add