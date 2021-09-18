import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import formCSS from 'styles/forms.module.css';
import {getProfileById} from "libs/static-rest";
import Link from 'next/link'
import {InputUpload} from "components/input-upload";
import {UploadProvider} from "context/UploadProvider";
import {useContext, useEffect, useState} from "react";
import {getRegions, getTowns, getCats} from 'libs/static-rest';
import {WsContext} from "context/WsProvider";
import {BsPencil} from "react-icons/bs"
import {useForm} from "react-hook-form";
import {organizeCats} from "libs/arrs";
import {IoIosArrowDown} from 'react-icons/io';
import {errMsg} from "libs/form-stuff";

export async function getServerSideProps({params}) {
    const defaultProfile = await getProfileById(parseInt(params.id));
    delete defaultProfile['password'];
    delete defaultProfile['refresh'];
    //TODO below AND compile and upload new gowebbackend and gpics + their respective Dockerfiles + new database
    //TODO then get service choices
    const regions = await getRegions();
    const defaultTowns = await getTowns(defaultProfile.region_id);
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
            defaultProfile,
            regions,
            defaultTowns,
            services
        }
    }
}

const EditMaster = ({defaultProfile, defaultTowns, regions, services}) => {
    const {wsMsg, request} = useContext(WsContext);
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'masters/'+defaultProfile.id+'/ava.jpg';
    const initAva = defaultProfile.avatar && masterAva || '/images/silhouette.jpg';
    const [image, setImage] = useState(null);
    const [edits, setEdits] = useState({name:false, contacts:false})
    const [towns, setTowns] = useState(defaultTowns);
    const [profile, setProfile] = useState(defaultProfile)

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);

    useEffect(() => setImage(initAva + '?' + Date.now()),[]);

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
                            id: profile.id,
                            column: "avatar",
                            value: "true"
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
        const safe = {
            about: d.about,
            company: parseInt(d.company),
            email: d.email,
            last_name: d.last_name,
            legal: parseInt(d.legal),
            paternal_name: d.paternal_name,
            phone: d.phone,
            region_id: parseInt(d.region_id),
            town_id: parseInt(d.town_id)
        }
        const merged = {...defaultProfile, ...safe};
        const goData = {
            address: 'auth:50003',
            action: 'update-login',
            instructions: JSON.stringify(merged)
        };
        request(JSON.stringify(goData));
        setProfile(merged)
    }

    const editBackground = ({target}) => {
        const parent = target.parentElement;
        parent.classList.toggle(css.edit)
    }

    const fullName = profile.last_name + ' ' + profile.first_name + (profile.paternal_name && ' ' + profile.paternal_name);

    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <a className={css.on}>Информация</a>
                    <Link href={'/edit-portfolio/'+profile.id}><a>Портфолио</a></Link>
                </div>
                <ul className={css.list}>
                    <li className={'row center bet '+css.ava}>
                        <b>{image && 'Изменить фото профиля' || 'Фото профиля не загружено'}</b>
                        <div>
                            {image && <img src={image} alt={profile.first_name} width="150" height="150" loading="lazy"/>}
                        </div>
                        <label htmlFor="ava_upload">
                            <BsPencil/> Ред.
                            <UploadProvider
                                chunkSize={1048576}
                                allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                                address={'gpics:50001'}
                                action={'process'}
                                instructions={{
                                    folder: 'masters/' + profile.id,
                                    width: 150,
                                    height: 150,
                                    fit: 'Fill', //Fit or Fill (with crop)
                                    position: 'Top',
                                    new_name: 'ava',
                                    copy:{
                                        folder:'masters/' + profile.id + '/mini',
                                        height:70,
                                        width:70
                                    }
                                }}>
                                <InputUpload name="avatar" id="ava_upload" multiple={false}/>
                            </UploadProvider>
                        </label>
                    </li>
                    <li className="row center bet">
                        <b>ФИО</b>
                        {!edits.name && <div><p>{fullName}</p></div>}
                        {edits.name && (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>

                                    {profile.legal === "3" && (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 70})} defaultValue={profile.first_name} placeholder="Краткое наименование (публикуется на странице)"/>
                                            {errMsg(errors.first_name, 70)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} defaultValue={profile.last_name} placeholder="Точное полное наименование юридического лица"/>
                                            {errMsg(errors.last_name, 70)}
                                        </>
                                    ) || (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} defaultValue={profile.first_name} placeholder="Ваше имя"/>
                                            {errMsg(errors.first_name, 40)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} defaultValue={profile.last_name} placeholder="Ваша фамилия"/>
                                            {errMsg(errors.last_name, 40)}

                                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} defaultValue={profile.paternal_name} placeholder="Ваше отчество (не обязательно)"/>
                                            {errMsg(errors.paternal_name, 40)}
                                        </>
                                    )}

                                    <input type="submit" value="Изменить"/>
                                    {showErr && <small>{showErr}</small>}
                                </form>
                            </div>
                        )}
                        <button onClick={e => {
                            editBackground(e);
                            edits.name = edits.name === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                    </li>
                    <li className="row center bet">
                        <b>Контакты</b>
                        {!edits.contacts && (
                            <div>
                                {profile.phone && <p>{profile.phone}</p>}
                                {profile.email && <p>{profile.email}</p>}
                            </div>
                        ) || (
                            <div>
                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form}`}>

                                    <input type="text" {...register('phone', {maxLength: 40})} defaultValue={profile.phone} placeholder="Ваш телефон"/>
                                    {errMsg(errors.phone, 40)}

                                    <input type="text" {...register('email', {required: true, maxLength: 40})} defaultValue={profile.email} placeholder="Ваш email"/>
                                    {errMsg(errors.email, 40)}

                                    <br/>
                                    <br/>
                                    <b>Ваш город/нас. пункт</b>
                                    <p>Выберите Вашу область</p>
                                    <div className={'rel '+formCSS.sel}>
                                        <select placeholder="Выберите Вашу область" {...register('region_id', {required: true})} defaultValue={profile.region_id}>
                                            {regions.map(e => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>

                                    <br/>
                                    <p>Выберите Ваш город/населённый пункт (или ближайший к нему из списка)</p>
                                    <div className={'rel '+formCSS.sel}>
                                        <select placeholder="Выберите Ваш город" {...register('town_id', {required: true})} defaultValue={profile.town_id}>
                                            {towns && towns.map(e => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <span><IoIosArrowDown/></span>
                                    </div>

                                    <input type="submit" value="Изменить"/>
                                    {showErr && <small>{showErr}</small>}
                                </form>
                            </div>
                        )}
                        <button onClick={e => {
                            editBackground(e);
                            edits.contacts = edits.contacts === false;
                            setEdits({...edits});
                        }}><BsPencil/> Ред.</button>
                    </li>
                    <li className="row center bet"><hr/></li>
                </ul>
            </main>
        </PublicLayout>
    )
}

export default EditMaster