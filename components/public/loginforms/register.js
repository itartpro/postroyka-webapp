import css from './forms.module.css';
import {useForm} from 'react-hook-form';
import {translit} from 'libs/slugify';
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO, rusDateToIso} from 'libs/js-time-to-psql';
import {validateEmailPhoneInput} from 'libs/email-phone-input';

const Register = () => {
    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [countries, setCountries] = useState([]);
    const [showErr, setShowErr] = useState(null);
    const [regi, setRegi] = useState({});

    //get a list of countries
    useEffect(() => {
        if (rs !== 1 || countries.length > 1) return false;
        const goData = {
            address: 'auth:50003',
            action: 'read-countries',
            instructions: JSON.stringify({})
        };
        request('crud', JSON.stringify(goData))
    }, [rs]);


    //misc
    useEffect(() => {
        if (!wsMsg) return false;
        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("duplicate user") && showErr === null) {
                setShowErr("Кто-то уже зарегестрировался на сайте с таким email или телефоном");
            }
            setRegi({});
            return false
        }
        if (wsMsg.type !== "info") return false;
        const msg = JSON.parse(wsMsg.data);
        if (msg.status && msg.data && msg.data.hasOwnProperty('name')) {
            countries.push(msg.data);
            setCountries([...countries]);
            regi.country_id = msg.data.id;
            setRegi({...regi});
            return true
        }
        if (msg.status && msg.data && Array.isArray(msg.data)) {
            setCountries(msg.data);
            return true
        }
        //for IMMEDIATE login after registration (no email/phone check)
        if(msg.data && msg.data.hasOwnProperty('refresh')) {
            if(msg.data.refresh === null) {
                const instructions = {
                    login: '',
                    password: btoa(regi.password)
                };
                if(regi.email !== '') {
                    instructions.login = btoa(regi.email)
                } else {
                    instructions.login = btoa(regi.phone)
                }
                const goData = {
                    address: 'auth:50003',
                    action: 'login',
                    instructions: JSON.stringify(instructions)
                };
                request('jwt-auth', JSON.stringify(goData));
            }
        }
        setRegi({});
    }, [wsMsg])


    //submit registration form
    const onSubmit = d => {
        setShowErr(null);
        d.password = translit(d.password);
        d.password_confirm = translit(d.password_confirm);
        getCountry().then(country => registerAttempt(d, country))
    };
    const passwordWatch = watch('password');
    //get their country during submit
    const getCountry = async () => {
        return fetch('https://extreme-ip-lookup.com/json/')
            .then(res => res.json())
            .then(data => data.country)
            .catch((data, status) => {
                console.log('Request to extreme-ip-lookup.com failed:', data);
                return 'Russia'
            })
    }
    //registration
    const registerAttempt = (d, country) => {
        const checked = {
            full_name: d.full_name,
            email: '',
            password: d.password,
            gender: d.gender || '',
            created: nowToISO(),
            birthdate: rusDateToIso(d.day + '.' + d.month + '.' + d.year)
        };
        const login = validateEmailPhoneInput(d.login);
        if(login && login.type === 'email') {
            checked[login.type] = login.value
        } else {
            setShowErr("не похоже на Email")
        }

        const found = countries.find(e => e.name === country);
        if (!found) {
            const goData = {
                address: 'auth:50003',
                action: 'new-country',
                instructions: JSON.stringify({name: country})
            };
            request('crud', JSON.stringify(goData));
        } else {
            checked.country_id = found.id;
        }

        setRegi(checked);
    };
    useEffect(() => {
        if (!regi.country_id || !(!regi.email || !regi.phone)) return false;
        const goData = {
            address: 'auth:50003',
            action: 'register',
            instructions: JSON.stringify(regi)
        };
        request('crud', JSON.stringify(goData));
    }, [regi])


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
    const addOptions = (ev, min, max) => {
        const select = ev.target;
        if (select.type !== 'select-one') return false;
        if (select.childNodes.length > 1) return false;
        for (let i = min; i <= max; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt)
        }
    }
    const addYears = ev => {
        let year = new Date().getFullYear();
        const max = year - 13;
        const min = year - 120;
        addOptions(ev, min, max);
    }

    return (
        <div className={`col start init`}>
            <p>Вы здесь впервые?</p>
            <small>Зарегистрируйтесь, и не забудьте записать пароль</small>
            <form onSubmit={handleSubmit(onSubmit)} className={`col start ${css.form}`}>
                <input type="text" {...register('full_name', {required: true, maxLength: 50})} placeholder="Ваше имя"/>
                {errMsg('full_name', 50)}

                <br/>
                <div className={`row start ${css.select}`}>
                    <p className={`row start`}>Дата рождения</p>
                    <select onClick={e => addOptions(e, 1, 31)} {...register('day', {required: true})}>
                        <option value="">День</option>
                    </select>
                    <select onClick={e => addOptions(e, 1, 12)} {...register('month', {required: true})}>
                        <option value="">Месяц</option>
                    </select>
                    <select onClick={e => addYears(e)} {...register('year', {required: true})}>
                        <option value="">Год</option>
                    </select>
                    {(errors['day'] || errors['month'] || errors ['year']) &&
                    <small>Необходимо выбрать дату рождения</small>}
                </div>

                <br/>
                <div className={`row start center ${css.radios}`}>
                    <p>Ваш пол</p>
                    <label htmlFor="man">М
                        <input id="man" type="radio" name="gender" value="m" {...register('gender', {maxLength: 1})}/>
                    </label>
                    <label htmlFor="woman">Ж
                        <input id="woman" type="radio" name="gender" value="w" {...register('gender', {maxLength: 1})}/>
                    </label>
                </div>
                {errMsg('gender')}

                <input type="text" {...register('login', {required: true, maxLength: 70})} placeholder="Ваш email"/>
                {errMsg('login', 70)}
                {showErr && <small>{showErr}</small>}

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
            </form>
        </div>
    )
}

export default Register