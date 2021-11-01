import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import formCSS from 'styles/forms.module.css';
import Link from 'next/link'
import {InputUpload} from "components/input-upload";
import {UploadProvider} from "context/UploadProvider";
import {useContext, useEffect, useState, useRef} from "react";
import {getProfileById, getRegions, getTowns, getCats, getMastersChoices} from 'libs/static-rest';
import {WsContext} from "context/WsProvider";
import {BsPencil} from "react-icons/bs"
import {useForm} from "react-hook-form";
import {organizeCats} from "libs/arrs";
import {IoIosArrowDown} from 'react-icons/io';
import {errMsg} from "libs/form-stuff";
import {toggleDown} from "libs/sfx";
import {ShowMessage} from "components/show-message";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const choices = await getMastersChoices(params.id).then(e => e.map(e => e['service_id']));
    const regions = await getRegions();
    const defaultTowns = await getTowns(fromDB.region_id);
    const homeRegion = regions.find(e => e.id === fromDB.region_id).name;
    const homeTown = defaultTowns.find(e => e.id === fromDB.town_id).name;
    const services = await getCats().then(cats => organizeCats(cats)[1].children.map(e => ({
        id: e.id,
        parent_id: e.parent_id,
        name: e.name,
        children: e.children.map(c => ({
            id: c.id,
            parent_id: c.parent_id,
            name: c.name
        }))
    })));

    return {
        props: {
            fromDB,
            regions,
            defaultTowns,
            services,
            homeRegion,
            homeTown,
            choices
        }
    }
}

const Info = ({fromDB, defaultTowns, regions, services, choices, homeRegion, homeTown}) => {
    const {wsMsg, request} = useContext(WsContext);
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+fromDB.id+'/ava.jpg';
    const initAva = fromDB.avatar && masterAva || '/images/silhouette.jpg';
    const [image, setImage] = useState(null);
    const [edits, setEdits] = useState({name:false, contacts:false, about: false, choices: false, company:false})
    const [towns, setTowns] = useState(defaultTowns);
    const [user, setUser] = useState(fromDB);
    const [clickedServices, setClickedServices] = useState([]);
    const [chosenServices, setChosenServices] = useState([])
    const simulateClick = useRef([]);
    const [showMsg, setShowMsg] = useState(null);

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    useEffect(() => {
        simulateClick.current.forEach((e, i) => {
            if(clickedServices.includes(i)) {
                const ul = e.parentElement;
                if(!ul.hasAttribute('style')) {
                    toggleDown(ul.previousElementSibling);
                }
            }
        })
    }, [clickedServices])

    useEffect(() => {
        setImage(initAva + '?' + Date.now());
        if(choices.length > 0) {
            const chosen = [];
            services.forEach(e => {
                e.children.forEach(c => {
                    choices.includes(c.id) && chosen.push(c.name)
                })
            });
            setChosenServices(chosen)
        }
    },[]);

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
                if (msg.status && msg.data.name === "ava.jpg") {
                    setImage(masterAva);
                    const goData = {
                        address: 'auth:50003',
                        action: 'update-cell',
                        instructions: JSON.stringify({
                            id: user.id,
                            column: "avatar",
                            value: "true",
                            table: "logins"
                        })
                    };
                    request(JSON.stringify(goData));
                    setImage(masterAva + '?' + Date.now())
                } else {
                    console.log(msg);
                }
            }

            if(msg.name === "auth") {
                //parse towns
                if(msg.data && msg.data.hasOwnProperty(0) && msg.data[0].hasOwnProperty('region_id')) {
                    setTowns(msg.data);
                    return true
                }

                if(msg.status && msg.data === 'updated successfully') {
                    setShowMsg("Успешно обновлены данные")
                }

                if(msg.status && msg.data === 'update-service-choices') {
                    setShowMsg("Обновлены выбранные специализации")
                }
            }
        } else {
            console.log(wsMsg.data)
        }
    }, [wsMsg])

    const regionWatch = watch('region');
    useEffect(() => {
        const goData = {
            address: 'auth:50003',
            action: 'read-towns',
            instructions: JSON.stringify({region_id: parseInt(regionWatch)})
        };
        request(JSON.stringify(goData))
    }, [regionWatch])

    const submitEdit = d => {
        if(d.company) d.company = parseInt(d.company);
        if(d.legal) d.legal = parseInt(d.legal);
        if(d.region_id) d.region_id = parseInt(d.region_id);
        if(d.town_id) d.town_id = parseInt(d.town_id);

        const merged = {...fromDB, ...d};
        const goData = {
            address: 'auth:50003',
            action: 'update-login',
            instructions: JSON.stringify(merged)
        };
        request(JSON.stringify(goData));
        if(d.town_id || d.region_id) {
            location.reload();
        }
        setUser(merged)
    }

    const updateChoices = d => {
        const serviceIds = d.services.map(e => parseInt(e));
        const goData = {
            address: 'auth:50003',
            action: 'update-service-choices',
            instructions: JSON.stringify({
                login_id: parseInt(fromDB.id),
                service_ids: serviceIds
            })
        }
        request(JSON.stringify(goData));
    }

    const editBackground = ({target}) => {
        const parent = target.parentElement;
        parent.classList.toggle(css.edit)
    }

    const company = e => {
        let company = '';
        switch(e) {
            case 1:
                company = 'мастер работает один'
                break;
            case 2:
                company = 'бригада 3-4 человека'
                break;
            case 3:
                company = 'бригада 5-20 человека'
                break;
            case 4:
                company = 'бригада более 20 человек'
                break;
            default:
                break;
        }
        return company
    }

    const legal = e => {
        let legal = '';
        switch(e) {
            case 1:
                legal = 'Частное лицо'
                break;
            case 2:
                legal = 'ИП'
                break;
            case 3:
                legal = 'Юридическое лицо'
                break;
            default:
                break;
        }
        return legal
    }

    const legalWatch = watch('legal');
    const fullName = user.last_name + ' ' + user.first_name + (user.paternal_name && ' ' + user.paternal_name);

    return (
        <PublicLayout loginName={user.first_name + ' ' + user.last_name}>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <a className={css.on}>Информация</a>
                    <Link href={'/master/'+user.id+'/edit/service-prices'}><a>Услуги и цены</a></Link>
                    <Link href={'/master/'+user.id+'/edit/portfolio'}><a>Портфолио</a></Link>
                </div>
                <ul className={css.list}>
                    <li className={'row center bet '+css.ava}>
                        <b>{image && 'Изменить фото профиля' || 'Фото профиля не загружено'}</b>
                        <label htmlFor="ava_upload">
                            <BsPencil/> Ред.
                            <UploadProvider
                                chunkSize={1048576}
                                allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                                address={'gpics:50001'}
                                action={'process'}
                                instructions={{
                                    folder: 'masters/' + user.id,
                                    width: 150,
                                    height: 150,
                                    fit: 'Fill', //Fit or Fill (with crop)
                                    position: 'Top',
                                    new_name: 'ava',
                                    copy:{
                                        folder:'masters/' + user.id + '/mini',
                                        height:70,
                                        width:70
                                    }
                                }}>
                                <InputUpload name="avatar" id="ava_upload" multiple={false}/>
                            </UploadProvider>
                        </label>
                        <div>
                            {image && <img src={image} alt={user.first_name} width="150" height="150" loading="lazy"/>}
                        </div>
                    </li>
                    <li className="row center bet">
                        <b>ФИО и юр. статус</b>
                        <button onClick={e => {
                            editBackground(e);
                            edits.name = edits.name === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                        {!edits.name && <div><p>{fullName}, {legal(user.legal)}</p></div>}
                        {edits.name && (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>
                                    <div className={'rel '+formCSS.sel}>
                                        <select {...register('legal', {required: true})} defaultValue={user.legal}>
                                            <option value="1">{legal(1)}</option>
                                            <option value="2">{legal(2)}</option>
                                            <option value="3">{legal(3)}</option>
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>

                                    {legalWatch === "3" && (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 70})} defaultValue={user.first_name} placeholder="Краткое наименование (публикуется на странице)"/>
                                            {errMsg(errors.first_name, 70)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} defaultValue={user.last_name} placeholder="Точное полное наименование юридического лица"/>
                                            {errMsg(errors.last_name, 70)}
                                        </>
                                    ) || (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} defaultValue={user.first_name} placeholder="Ваше имя"/>
                                            {errMsg(errors.first_name, 40)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} defaultValue={user.last_name} placeholder="Ваша фамилия"/>
                                            {errMsg(errors.last_name, 40)}

                                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} defaultValue={user.paternal_name} placeholder="Ваше отчество (не обязательно)"/>
                                            {errMsg(errors.paternal_name, 40)}
                                        </>
                                    )}

                                    <input type="submit" value="Изменить"/>
                                </form>
                            </div>
                        )}
                    </li>
                    <li className="row center bet">
                        <b>Контакты</b>
                        <button onClick={e => {
                            editBackground(e);
                            edits.contacts = edits.contacts === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                        {!edits.contacts && (
                            <div>
                                {user.phone && <p>{user.phone},</p>}
                                {user.email && <p>{user.email}</p>}
                                {<p>{homeRegion}, {homeTown}</p>}
                            </div>
                        ) || (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>

                                    <input type="text" {...register('phone', {maxLength: 40})} defaultValue={user.phone} placeholder="Ваш телефон"/>
                                    {errMsg(errors.phone, 40)}

                                    <input type="text" {...register('email', {required: true, maxLength: 40})} defaultValue={user.email} placeholder="Ваш email"/>
                                    {errMsg(errors.email, 40)}

                                    <br/>
                                    <br/>
                                    <b>Ваш город/нас. пункт</b>
                                    <p>Выберите Вашу область</p>
                                    <div className={'rel '+formCSS.sel}>
                                        <select placeholder="Выберите Вашу область" {...register('region_id', {required: true})} defaultValue={user.region_id}>
                                            {regions.map(e => (
                                                <option key={'ir'+e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>

                                    <br/>
                                    <p>Выберите Ваш город/населённый пункт (или ближайший к нему из списка)</p>
                                    <div className={'rel '+formCSS.sel}>
                                        <select placeholder="Выберите Ваш город" {...register('town_id', {required: true})} defaultValue={user.town_id}>
                                            {towns && towns.map(e => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>

                                    <input type="submit" value="Изменить"/>
                                </form>
                            </div>
                        )}
                    </li>
                    <li className="row center bet">
                        <b>О себе</b>
                        <button onClick={e => {
                            editBackground(e);
                            edits.about = edits.about === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                        {!edits.about && <div>{user.about || "\"О себе\" не заполнено"}</div>}
                        {edits.about && (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>
                                    <textarea {...register('about', {maxLength: 1600})} defaultValue={user.about || ""} placeholder="Напишите о себе"/>
                                    {errMsg(errors.about, 1600)}

                                    <input type="submit" value="Изменить"/>
                                </form>
                            </div>
                        )}
                    </li>
                    <li className="row center bet">
                        <b>Выбранные специализации</b>
                        <button onClick={e => {
                            editBackground(e);
                            if(edits.choices === false) {
                                setClickedServices(choices);
                                edits.choices = true;
                            } else {
                                setClickedServices([]);
                                edits.choices = false;
                            }
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                        {!edits.choices && (
                            <div>
                                <ul className={'col start'}>
                                    <li><b>Выбранные специализации</b></li>
                                    {chosenServices.length > 0 && chosenServices.map((e,i) => <li key={'cn'+i}>{e}</li>)}
                                </ul>
                            </div>
                        )}
                        {edits.choices && (
                            <div>
                                <form onSubmit={handleSubmit(updateChoices)} className={`col start ${formCSS.form}`}>
                                    <ul className={'col start'}>
                                        {services && services.map(parent => (
                                            <li key={'s'+parent.id}>
                                                <a className={formCSS.bar} role="button" onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{parent.name}</a>
                                                <ul className={`row start ${formCSS.hid}`}>
                                                    {parent.children.map(e => (
                                                        <li ref={el => simulateClick.current[e.id] = el} key={'s'+e.id}>
                                                            <label htmlFor={'srv_'+e.id} className={formCSS.check}>
                                                                {e.name}
                                                                <input
                                                                    id={'srv_'+e.id} type="checkbox"
                                                                    {...register('services')}
                                                                    defaultChecked={clickedServices.includes(e.id)}
                                                                    value={e.id}
                                                                    onClick={ev => {
                                                                        if(ev.target.checked) {
                                                                            if(!clickedServices.includes(e.id)) {
                                                                                clickedServices.push(e.id);
                                                                                setClickedServices([...clickedServices])
                                                                            }
                                                                        } else {
                                                                            if(clickedServices.includes(e.id)) {
                                                                                const newArr = clickedServices.filter(el => el !== e.id);
                                                                                setClickedServices([...newArr])
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                    <input type="submit" value="Изменить"/>
                                </form>
                            </div>
                        )}
                    </li>
                    <li className="row center bet">
                        <b>Состав бригады</b>
                        <button onClick={e => {
                            editBackground(e);
                            edits.company = edits.company === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                        {!edits.company && <div><p>{company(parseInt(user.company))}</p></div>}
                        {edits.company && (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>
                                    <div className={'rel '+formCSS.sel}>
                                        <select {...register('company', {required: true})} defaultValue={user.company}>
                                            <option value="1">{company(1)}</option>
                                            <option value="2">{company(2)}</option>
                                            <option value="3">{company(3)}</option>
                                            <option value="4">{company(4)}</option>
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>
                                    <input type="submit" value="Изменить"/>
                                </form>
                            </div>
                        )}
                    </li>
                </ul>
                {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={3000}/>}
            </main>
        </PublicLayout>
    )
}

export default Info