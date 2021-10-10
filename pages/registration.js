import formCSS from 'styles/forms.module.css';
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
import {errMsg} from "libs/form-stuff";

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

    //if User is found in localstorage - kick them to their appropriate area
    useEffect(() => {
        const userStr = window.localStorage.getItem('User');
        if(!userStr) return false;
        try {
            const user = JSON.parse(userStr);
            if(user.level === 9) {
                return router.push('/admin')
            }
            if(user.level === 2) {
                return router.push('/orders')
            }
        } catch (e) {
            window.localStorage.removeItem('User');
            return false
        }
    }, []);

    //for IMMEDIATE login after registration (no email/phone check)
    const doAfterRegistration = user => {
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
        setTimeout(() => {
            router.push('/master/'+user.id);
        }, 1000)
    };

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

        //looks like the master registered and got into the database
        if(msg && msg.data && msg.data.hasOwnProperty('refresh')) {
            if(msg.data.refresh === null) {
                //record the service ids the new master has chosen
                const goData = {
                    address: 'auth:50003',
                    action: 'update-service-choices',
                    instructions: JSON.stringify({
                        login_id: msg.data.id,
                        service_ids: chosenServices
                    })
                }
                request(JSON.stringify(goData));

                doAfterRegistration(msg.data)
            }
        }
        setRegData({})
    }, [rs, wsMsg]);

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
            region_id: parseInt(d.region),
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

    return (
        <PublicLayout>
            <main className={`col start max`}>
                <h1>Регистрироваться как мастер</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={`col start ${formCSS.form}`}>
                    <div className={'rel '+formCSS.sel}>
                        <select {...register('legal', {required: true})} defaultValue="1">
                            <option value="1">Частное лицо</option>
                            <option value="2">ИП</option>
                            <option value="3">Юридическое лицо</option>
                        </select>
                        <span><IoIosArrowDown/></span>
                    </div>

                    {legalWatch === "3" && (
                        <>
                            <input type="text" {...register('first_name', {required: true, maxLength: 70})} placeholder="Краткое наименование (публикуется на странице)"/>
                            {errMsg(errors.first_name, 70)}

                            <input type="text" {...register('last_name', {required: true, maxLength: 70})} placeholder="Точное полное наименование юридического лица"/>
                            {errMsg(errors.last_name, 70)}
                        </>
                    ) || (
                        <>
                            <input type="text" {...register('first_name', {required: true, maxLength: 40})} placeholder="Ваше имя"/>
                            {errMsg(errors.first_name, 40)}

                            <input type="text" {...register('last_name', {required: true, maxLength: 40})} placeholder="Ваша фамилия"/>
                            {errMsg(errors.last_name, 40)}

                            <input type="text" {...register('paternal_name', {required: false, maxLength: 40})} placeholder="Ваше отчество (не обязательно)"/>
                            {errMsg(errors.paternal_name, 40)}
                        </>
                    )}

                    <br/>
                    <b>Ваш адрес</b>
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

                    <br/>
                    <b>Выберите категории заказов которые Вам интересно выполнять</b>
                    <ul className={'col start'}>
                        {services && services.map(parent => (
                            <li key={'s'+parent.id}>
                                <a className={formCSS.bar} role="button" onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{parent.name}</a>
                                <ul className={formCSS.hid}>
                                    {parent.children.map(e => (
                                        <li key={'s'+e.id}>
                                            <label htmlFor={'srv_'+e.id} className={formCSS.check}>
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
            </main>
        </PublicLayout>
    )
}

export default Registration