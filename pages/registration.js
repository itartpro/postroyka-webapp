import css from 'styles/forms.module.css';
import {useForm} from 'react-hook-form';
import {translit} from 'libs/slugify';
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO, rusDateToIso, isoToLocale, nowToLocaleString, localeToISO, rusToISO} from 'libs/js-time-to-psql';
import {validateEmailPhoneInput} from 'libs/email-phone-input';
import PublicLayout from "../components/public/public-layout";
import {getRegions, getTowns, getPageBySlug} from "libs/static-rest";

export async function getStaticProps() {
    //const page = await getPageBySlug('blog');
    const regions = await getRegions();
    const defaultTowns = await getTowns();
    return {
        props: {
            //page,
            regions,
            defaultTowns
        },
        revalidate: 120
    }
}

const Registration = ({regions, defaultTowns}) => {
    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const [regData, setRegData] = useState({});
    const [select, setSelect] = useState(1);
    const [towns, setTowns] = useState(defaultTowns);


    //handle info from server
    useEffect(() => {
        if (rs !== 1 || !wsMsg) return false;
        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("duplicate user") && showErr === null) {
                setShowErr("Кто-то уже зарегестрировался на сайте с таким email или телефоном");
            }
            setRegData({});
            return false
        }
        if (wsMsg.type !== "info") return false;

        const msg = JSON.parse(wsMsg.data);

        //parse towns
        if(msg.data && msg.data.hasOwnProperty(0)) {
            if(msg.data[0].hasOwnProperty('region_id')) {
                setTowns(msg.data);
                return true
            }
        }

        //for IMMEDIATE login after registration (no email/phone check)
        if(msg.data && msg.data.hasOwnProperty('refresh')) {
            if(msg.data.refresh === null) {
                const instructions = {
                    login: '',
                    password: btoa(regData.password)
                };
                if(regData.email !== '') {
                    instructions.login = btoa(regData.email)
                } else {
                    instructions.login = btoa(regData.phone)
                }
                const goData = {
                    address: 'auth:50003',
                    action: 'login',
                    instructions: JSON.stringify(instructions)
                };
                request(JSON.stringify(goData), 'jwt-auth');
            }
        }
        setRegData({});
    }, [rs, wsMsg]);

    //submit registration form
    const onSubmit = d => {
        setShowErr(null);
        d.password = translit(d.password);
        d.password_confirm = translit(d.password_confirm);
        registerAttempt(d)
    };

    //registration
    const registerAttempt = d => {
        const created = nowToISO();
        const checked = {
            full_name: d.full_name,
            email: '',
            password: d.password,
            gender: d.gender || '',
            created: created,
            last_online: created,
            country_id: 1
        };
        const login = validateEmailPhoneInput(d.login);
        if(login && login.type === 'email') {
            checked[login.type] = login.value
        } else {
            setShowErr("не похоже на Email")
        }

        setRegData(checked)
    };

    //send registration data to server
    useEffect(() => {
        if (!regData.email && !regData.phone) return false;
        const goData = {
            address: 'auth:50003',
            action: 'register',
            instructions: JSON.stringify(regData)
        };
        //request(JSON.stringify(goData))
        console.log('testing data for registration', regData);
    }, [regData])

    //html stuff
    const errMsg = (field = '', maxLength = 0) => {
        if (!errors || !errors[field]) return null;
        const e = errors[field]
        if (e.message !== "") return (<small>{e.message}</small>);
        if (e.type === "required") return (
            <small>Поле "{e.ref.placeholder || e.ref.name}" необходимо заполнить</small>);
        if (e.type === "maxLength") return (
            <small>У поля "{e.ref.placeholder || e.ref.name}" максимальная длинна {maxLength} символов</small>);
    }

    const passwordWatch = watch('password');
    const legalWatch = watch('legal');
    const regionWatch = watch('region');

    useEffect(() => {
        const goData = {
            address: 'auth:50003',
            action: 'read-towns',
            instructions: JSON.stringify({region_id: parseInt(regionWatch)})
        };
        request(JSON.stringify(goData));
    }, [regionWatch])

    return (
        <PublicLayout>
            <br/>
            <main className={`col start max`}>
                <h1>Регистрироваться как мастер</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={`col start ${css.form}`}>
                    <select {...register('legal', {required: true})} defaultValue="1">
                        <option value="1">Частное лицо</option>
                        <option value="2">ИП</option>
                        <option value="3">Юридическое лицо</option>
                    </select>

                    {legalWatch === "3" && (
                        <>
                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} placeholder="Краткое наименование (публикуется на странице)"/>
                            {errMsg('last_name', 70)}

                            <input type="text" {...register('paternal_name', {required: true, maxLength: 70})} placeholder="Точное полное наименование юридического лица"/>
                            {errMsg('last_name', 70)}
                        </>
                    ) || (
                        <>
                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя"/>
                            {errMsg('first_name', 40)}

                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} placeholder="Ваша фамилия"/>
                            {errMsg('last_name', 40)}

                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} placeholder="Ваше отчество (не обязательно)"/>
                            {errMsg('last_name', 40)}
                        </>
                    )}

                    <br/>
                    <b>Ваш адрес</b>
                    <p>Выберите Вашу область</p>
                    <select placeholder="Выберите Вашу область" {...register('region', {required: true})} defaultValue="1">
                        {regions.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>

                    <p>Выберите Ваш город/населённый пункт (или ближайший к нему из списка)</p>
                    <select placeholder="Выберите Ваш город" {...register('town', {required: true})}>
                        {towns && towns.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>

                    <input type="text" {...register('login', {required: true, maxLength: 70})} placeholder="Ваш email"/>
                    {errMsg('login', 70)}

                    <input type="password" {...register('password', {required: true, maxLength: 32})} placeholder="Выберите пароль"/>
                    {errMsg('password', 32)}

                    <input type="password" {...register('password_confirm', {
                        required: true,
                        maxLength: 32,
                        validate: {
                            sameAs: v => translit(v) === passwordWatch || "Пароли не похожи"
                        }
                    })} placeholder="Повторите пароль"/>
                    {errMsg('password_confirm', 32)}

                    <input type="submit" value="Зарегистрироваться"/>
                    {showErr && <small>{showErr}</small>}
                </form>
                <style jsx>{`
                    form > b {
                        margin-top: 10px;
                        font-size: 1.2rem
                    }
                    form > p {
                        margin: 10px 0 2px 0;
                        color: #777
                    }
                `}</style>
            </main>
            {}
        </PublicLayout>
    )
}

export default Registration