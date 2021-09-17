import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import formCSS from 'styles/forms.module.css';
import {getProfileById} from "libs/static-rest";
import Link from 'next/link'
import {InputUpload} from "components/input-upload";
import UploadProvider from "context/UploadProvider";
import {useContext, useEffect, useState} from "react";
import {WsContext} from "context/WsProvider";
import {BsPencil} from "react-icons/bs"
import {useForm} from "react-hook-form";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id));
    delete profile['password'];
    delete profile['refresh'];

    return {
        props: {
            profile
        }
    }
}

const EditMaster = ({profile}) => {
    const {wsMsg, request} = useContext(WsContext);
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'masters/'+profile.id+'/ava.jpg';
    const initAva = profile.avatar && masterAva || '/images/silhouette.jpg';
    const [image, setImage] = useState(null);
    const [edits, setEdits] = useState({name:false, contacts:false})

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const errMsg = (field = '', maxLength = 0) => {
        if (!errors || !errors[field]) return null;
        const e = errors[field]
        if (e.message !== "") return (<small>{e.message}</small>);
        if (e.type === "required") return (
            <small>Поле "{e.ref.placeholder || e.ref.name}" необходимо заполнить</small>);
        if (e.type === "maxLength") return (
            <small>У поля "{e.ref.placeholder || e.ref.name}" максимальная длинна {maxLength} символов</small>);
    }

    useEffect(() => setImage(initAva + '?' + Date.now()), []);

    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type === "info") {
            //update profile image and avatar status to true upon successful avatar upload
            if(wsMsg.data.substr(9, 5) === "gpics") {
                const res = JSON.parse(wsMsg.data);
                if(res.status && res.data.name !== "") {
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
                }
            }
        } else {
            console.log(wsMsg.data)
        }
    }, [wsMsg])

    const submitEditName = d => console.log(d)

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
                                <form onSubmit={handleSubmit(submitEditName)} className={`col start ${formCSS.form}`}>

                                    {profile.legal === "3" && (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 70})} defaultValue={profile.first_name} placeholder="Краткое наименование (публикуется на странице)"/>
                                            {errMsg('first_name', 70)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} defaultValue={profile.last_name} placeholder="Точное полное наименование юридического лица"/>
                                            {errMsg('last_name', 70)}
                                        </>
                                    ) || (
                                        <>
                                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} defaultValue={profile.first_name} placeholder="Ваше имя"/>
                                            {errMsg('first_name', 40)}

                                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} defaultValue={profile.last_name} placeholder="Ваша фамилия"/>
                                            {errMsg('last_name', 40)}

                                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} defaultValue={profile.paternal_name} placeholder="Ваше отчество (не обязательно)"/>
                                            {errMsg('paternal_name', 40)}
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
                                <form style={{height:'300px'}} onSubmit={handleSubmit(submitEditName)} className={`col start ${formCSS.form}`}>

                                    <input type="text" {...register('phone', {required: true, maxLength: 40})} defaultValue={profile.phone} placeholder="Ваш телефон"/>
                                    {errMsg('phone', 40)}

                                    <input type="text" {...register('email', {required: true, maxLength: 40})} defaultValue={profile.email} placeholder="Ваш email"/>
                                    {errMsg('email', 40)}

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