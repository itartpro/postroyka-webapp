import PublicLayout from "components/public/public-layout";
import css from 'styles/login.module.css';
import css2 from "styles/forms.module.css";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/router';
import {useContext, useEffect} from 'react'
import {WsContext} from 'context/WsProvider';
import {validateEmailPhoneInput} from "libs/email-phone-input";
import Link from 'next/link';

const Login = () => {

    const router = useRouter();

    if (router.query.hasOwnProperty('out')) {
        window.localStorage.removeItem('AccessJWT');
        window.localStorage.removeItem('RefreshJWT');
        window.localStorage.removeItem('User')
        router.push('/login')
    }

    const { register, handleSubmit, formState: {errors} } = useForm();
    const { request, wsMsg, verifiedJwt, logOut } = useContext(WsContext);

    //When JWT is in local storage and verified - get user data
    useEffect(() => {
        if(!verifiedJwt) return false;

        const userString = window.localStorage.getItem('User');
        const JWTString = window.localStorage.getItem('AccessJWT');
        if(!userString && !JWTString) return logOut();
        let idFromJWT = 0;
        let debased64 = null;
        let user = {id:null};

        try {
            debased64 = atob(JWTString.split('.')[1])
            if(userString) user = JSON.parse(userString);
        } catch (err) {
            console.log( "User and/or AccessJWT corrupted: " + err);
            logOut();
            return false
        }
        const parsed = JSON.parse(debased64);
        idFromJWT = parseInt(parsed.sub)

        if(user.id === idFromJWT) {
            if (user.level === 9) return router.push('/admin');
            if (user.level === 2) return router.push('/orders')
        }

        if(idFromJWT !== 0) {
            const goData = {
                address: 'auth:50003',
                action: 'get-profile',
                instructions: JSON.stringify({id:idFromJWT})
            };
            request(JSON.stringify(goData))
        }
    }, [verifiedJwt])

    useEffect(() => {
        if(!wsMsg || wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if(res.data && res.data.hasOwnProperty("avatar")) {
            const user = res.data;
            const essentialUserData = {
                id: user.id,
                level: user.level,
                avatar: user.avatar,
                first_name: user.first_name,
                last_name: user.last_name
            };
            window.localStorage.setItem('User', JSON.stringify(essentialUserData));
            if (user.level === 9) return router.push('/admin');
            if (user.level === 2) return router.push('/orders')
        }
    }, [wsMsg]);

    const onSubmit = d => {
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
    };

    return (
        <PublicLayout>
            <main className={`row bet max center`}>
                <div className={'col start ' + css.d1}>
                    <h1>Вход</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className={`col init start ${css2.form}`}>
                        <input type="text" {...register('login', {required: true, maxLength: 70})} placeholder="Ваш email или телефон"/>
                        {errors.login && <small>Обязательное поле не более 70 символов</small>}

                        <input type="password" {...register('password', {required: true, maxLength: 32})} placeholder="Ваш пароль"/>
                        {errors.password && <small>Обязательное поле не более 32 символов</small>}

                        <input type="submit" name="attempt_login" value="Войти"/>
                    </form>
                    <p className={css.p1}><a href="https://www.google.ru/">Забыли пароль?</a></p>
                </div>
                <style global jsx>{`
                    form > input[type=submit] {
                        width: 100%!important;
                        max-width: 130px!important
                    }
                `}</style>
                <div className={css.a1}>
                    <p>Впервые на Построй Ке?</p>
                    <p><a href="#">Добавить заказ</a> – если вы ищете исполнителя работ</p>
                    <p><Link href={'/for-masters'}><a>Стать исполнителем</a></Link> – если вы ищете заказы</p>
                    <style>{`
                    div:nth-child(2) a {
                        color: #47CB43;
                        font-weight: bold
                    }
                    div:nth-child(2) a:hover {
                        color: #2a9b26;
                        text-decoration: underline;
                        transition: all .3s
                    }                    
                `}</style>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Login