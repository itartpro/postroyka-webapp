import css from 'components/public/loginforms/forms.module.css';
import {useForm} from 'react-hook-form';
import {translit} from 'libs/slugify';
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO, rusDateToIso} from 'libs/js-time-to-psql';
import {validateEmailPhoneInput} from 'libs/email-phone-input';
import PublicLayout from "../components/public/public-layout";

const Registration = () => {
    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const [regData, setRegData] = useState({});

    //handle info from server
    useEffect(() => {
        if (!wsMsg) return false;
        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("duplicate user") && showErr === null) {
                setShowErr("Кто-то уже зарегестрировался на сайте с таким email или телефоном");
            }
            setRegData({});
            return false
        }
        if (wsMsg.type !== "info") return false;
        const msg = JSON.parse(wsMsg.data);
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
    }, [wsMsg])

    //submit registration form
    const onSubmit = d => {
        setShowErr(null);
        d.password = translit(d.password);
        d.password_confirm = translit(d.password_confirm);
        registerAttempt(d)
    };
    const passwordWatch = watch('password');

    //registration
    const registerAttempt = d => {
        const checked = {
            full_name: d.full_name,
            email: '',
            password: d.password,
            gender: d.gender || '',
            created: nowToISO(),
            last_online: '',
            country_id: 1
        };
        const login = validateEmailPhoneInput(d.login);
        if(login && login.type === 'email') {
            checked[login.type] = login.value
        } else {
            setShowErr("не похоже на Email")
        }

        setRegData(checked);
    };
    useEffect(() => {
        if (!regData.email && !regData.phone) return false;
        const goData = {
            address: 'auth:50003',
            action: 'register',
            instructions: JSON.stringify(regData)
        };
        request(JSON.stringify(goData));
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

    return (
        <PublicLayout>
            <main className={`col start init`}>
                <p>Вы здесь впервые?</p>
                <small>Зарегистрируйтесь, и не забудьте записать пароль</small>
                <form onSubmit={handleSubmit(onSubmit)} className={`col start ${css.form}`}>
                    <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя"/>
                    {errMsg('first_name', 40)}

                    <input type="text" {...register('last_name', {required: true, maxLength: 40})} placeholder="Ваша фамилия"/>
                    {errMsg('last_name', 40)}

                    <input type="text" {...register('paternal_name', {required: true, maxLength: 40})} placeholder="Ваше отчество"/>
                    {errMsg('last_name', 40)}

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
            </main>
        </PublicLayout>
    )
}

export default Registration