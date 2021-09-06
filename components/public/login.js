import css from "styles/forms.module.css";
import { useForm } from "react-hook-form";
import {useContext, useEffect} from 'react';
import {WsContext} from 'context/WsProvider';
import {validateEmailPhoneInput} from "libs/email-phone-input";


export const Login = ({loginAction}) => {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const { request, wsMsg, verifiedJwt } = useContext(WsContext);

    useEffect(() => {
        const check = window.localStorage.getItem('User');
        let idFromJWT = 0;
        if(verifiedJwt) {
            const str = window.localStorage.getItem('AccessJWT');
            let debased64 = null;
            try {
                debased64 = atob(str.split('.')[1])
            } catch (err) {
                console.log( "Error decoding refresh token: " + err);
                return loginAction(null)
            }
            const parsed = JSON.parse(debased64);
            idFromJWT = parseInt(parsed.sub)
        }
        if(verifiedJwt && check) {
            const user = JSON.parse(check);
            if(user.id !== idFromJWT) {
                window.localStorage.removeItem('User');
                return loginAction(null)
            } else {
                return loginAction(user)
            }
        }

        //if JWT is present - then get user data
        if(idFromJWT !== 0 && verifiedJwt && !check) {
            const goData = {
                address: 'auth:50003',
                action: 'get-profile',
                instructions: JSON.stringify({id:idFromJWT})
            };
            request(JSON.stringify(goData))
        }
    }, [verifiedJwt])

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
            loginAction(essentialUserData)
        }
    }, [wsMsg])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`col init start ${css.form}`}>
            <input type="text" {...register('login', {required: true, maxLength: 70})} placeholder="Ваш email или телефон"/>
            {errors.login && <small>Обязательное поле не более 70 символов</small>}

            <input type="password" {...register('password', {required: true, maxLength: 32})} placeholder="Ваш пароль"/>
            {errors.password && <small>Обязательное поле не более 32 символов</small>}

            <input type="submit" name="attempt_login" value="Войти"/>
        </form>
    )
}