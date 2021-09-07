import css from 'styles/forms.module.css';
import {useForm} from 'react-hook-form';
import {translit} from 'libs/slugify';
import {IoIosArrowDown} from 'react-icons/io';
import {useContext, useEffect, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO} from 'libs/js-time-to-psql';
import {validateEmailPhoneInput} from 'libs/email-phone-input';
import PublicLayout from 'components/public/public-layout';
import {getRegions, getTowns, getCats} from 'libs/static-rest';
import {organizeCats} from 'libs/arrs';
import {toggleDown} from 'libs/sfx';
import {useRouter} from 'next/router';

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

const Registration = ({regions, defaultTowns, services}) => {
    const {wsMsg, rs, request} = useContext(WsContext);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const [regData, setRegData] = useState({});
    const [towns, setTowns] = useState(defaultTowns);
    const [chosenServices, setChosenServices] = useState([]);
    const router = useRouter();

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

        if(msg && msg.data && msg.data.hasOwnProperty('refresh')) {
            if(msg.data.refresh === null) {
                //record the service ids the new master has chosen
                const goData = {
                    address: 'auth:50003',
                    action: 'update_service_choices',
                    instructions: JSON.stringify({
                        login_id: msg.data.id,
                        service_ids: chosenServices
                    })
                }
                request(JSON.stringify(goData));

                //for IMMEDIATE login after registration (no email/phone check)
                doStuffOnRegistration(msg.data)
            }
        }
        setRegData({})
    }, [rs, wsMsg]);

    const doStuffOnRegistration = user => {
        const instructions = {
            login: '',
            password: btoa(regData.password)
        };
        if(regData.email !== '') {
            instructions.login = btoa(regData.email)
        } else {
            instructions.login = btoa(regData.phone)
        }
        const goData2 = {
            address: 'auth:50003',
            action: 'login',
            instructions: JSON.stringify(instructions)
        };
        request(JSON.stringify(goData2), 'jwt-auth');
        const essentialUserData = {
            id: user.id,
            level: user.level,
            avatar: user.avatar,
            first_name: user.first_name,
            last_name: user.last_name
        };
        window.localStorage.setItem('User', JSON.stringify(essentialUserData));
        if (user.level === 2) return router.push('/orders');
    }

    //submit registration form
    const onSubmit = d => {
        setShowErr(null);
        d.password = translit(d.password);
        d.password_confirm = translit(d.password_confirm);
        registerAttempt(d);
        return false
    };

    //registration
    const registerAttempt = d => {
        if(!validateEmailPhoneInput(d.email)) {
            return setShowErr("не похоже на Email")
        }

        if(d.services.length > 0) {
            let newChoices = d.services.map(e => parseInt(e));
            setChosenServices(newChoices);
        } else {
            setChosenServices([]);
        }

        const created = nowToISO();
        const checked = {
            first_name: d.first_name,
            last_name: d.last_name,
            paternal_name: d.paternal_name,
            email: d.email,
            level: 2,
            phone: '',
            password: d.password,
            town_id: parseInt(d.town),
            created: created,
            last_online: created,
            legal: parseInt(d.legal)
        };

        return setRegData(checked)
    };

    //send registration data to server
    useEffect(() => {
        if (!regData.email && !regData.phone) return false;
        const goData = {
            address: 'auth:50003',
            action: 'register',
            instructions: JSON.stringify(regData)
        };
        request(JSON.stringify(goData))
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
        request(JSON.stringify(goData))
    }, [regionWatch])

    //TODO something when master is ALREADY in-system
    //TODO compile new webbackend and git push along with new auth and send Alexey new database
    //TODO reset ids in database in logins and choices

    return (
        <PublicLayout>
            <br/>
            <main className={`col start max`}>
                <h1>Регистрироваться как мастер</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={`col start ${css.form}`}>
                    <div className={'rel '+css.sel}>
                        <select {...register('legal', {required: true})} defaultValue="1">
                            <option value="1">Частное лицо</option>
                            <option value="2">ИП</option>
                            <option value="3">Юридическое лицо</option>
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>

                    {legalWatch === "3" && (
                        <>
                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} placeholder="Краткое наименование (публикуется на странице)"/>
                            {errMsg('last_name', 70)}

                            <input type="text" {...register('paternal_name', {required: true, maxLength: 70})} placeholder="Точное полное наименование юридического лица"/>
                            {errMsg('paternal_name', 70)}
                        </>
                    ) || (
                        <>
                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя"/>
                            {errMsg('first_name', 40)}

                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} placeholder="Ваша фамилия"/>
                            {errMsg('last_name', 40)}

                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} placeholder="Ваше отчество (не обязательно)"/>
                            {errMsg('paternal_name', 40)}
                        </>
                    )}

                    <br/>
                    <b>Ваш адрес</b>
                    <p>Выберите Вашу область</p>
                    <div className={'rel '+css.sel}>
                        <select placeholder="Выберите Вашу область" {...register('region', {required: true})} defaultValue="1">
                            {regions.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>

                    <p>Выберите Ваш город/населённый пункт (или ближайший к нему из списка)</p>
                    <div className={'rel '+css.sel}>
                        <select placeholder="Выберите Ваш город" {...register('town', {required: true})}>
                            {towns && towns.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>

                    <input type="text" {...register('email', {required: true, maxLength: 50})} placeholder="Ваш email"/>
                    {errMsg('email', 50)}

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

                    <br/>
                    <b>Выберите категории заказов которые Вам интересно выполнять</b>
                    <ul className={'col start'}>
                        {services && services.map(parent => (
                            <li key={'s'+parent.id}>
                                <a role="button" onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{parent.name}</a>
                                <ul>
                                    {parent.children.map(e => (
                                        <li key={'s'+e.id}>
                                            <label htmlFor={'srv_'+e.id} className={css.check}>
                                                {e.name}
                                                <input id={'srv_'+e.id} type="checkbox" {...register('services')} value={e.id}/>
                                                <span></span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    <input type="submit" value="Зарегистрироваться"/>
                    {showErr && <small>{showErr}</small>}
                    <br/><br/>
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
                    
                    form ul {
                        list-style: none
                    }
                    
                    form > ul {
                        margin-top: 10px
                    }
                    
                    form ul li a {
                        display: block;
                        width: 100%
                    }
                    
                    form > ul > li > a {
                        padding: 15px;
                        background: #f8f8f8;
                        border-bottom: 1px solid #DDD
                    }
                    
                    form > ul ul {
                        transition: all .3s;
                        max-height: 0;
                        background: white;
                        overflow: hidden
                    }
                    
                    form > ul ul li {
                        border-bottom: 1px solid #DDD;
                        padding: 10px
                    }
                `}</style>
            </main>
        </PublicLayout>
    )
}

export default Registration