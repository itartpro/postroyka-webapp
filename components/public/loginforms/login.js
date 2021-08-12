import css from "./forms.module.css";
import { useForm } from "react-hook-form";
import {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {WsContext} from 'context/WsProvider';
import {validateEmailPhoneInput} from "libs/email-phone-input";

const Login = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const { request, wsMsg, verifiedJwt } = useContext(WsContext);
    const router = useRouter();

    useEffect(() => {
        const check = window.localStorage.getItem('User');
        let id = 0;
        if(verifiedJwt) {
            const str = window.localStorage.getItem('AccessJWT');
            let debased64 = null;
            try {
                debased64 = atob(str.split('.')[1])
            } catch (err) {
                return console.log( "Error decoding refresh token: " + err);
            }
            const parsed = JSON.parse(debased64);
            id = parseInt(parsed.sub);
        }
        if(verifiedJwt && check) {
            const user = JSON.parse(check);
            if(user.id !== id) {
                window.localStorage.removeItem('User');
            } else {
                return router.push('/profile/'+user.id)
            }
        }
        if(id !== 0 && verifiedJwt && !check) {
            const goData = {
                address: 'auth:50003',
                action: 'get-profile',
                instructions: JSON.stringify({id})
            };
            request('crud', JSON.stringify(goData))
        }
    }, [verifiedJwt])

    const onSubmit = d => {
        const login = validateEmailPhoneInput(d.login);
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
        request('jwt-auth', JSON.stringify(goData))
    };

    useEffect(() => {
        if(!wsMsg || wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if(res.data && res.data.hasOwnProperty("avatar")) {
            const user = res.data;
            const essentialUserData = {
                id: user.id,
                level: user.id,
                avatar: user.avatar,
                first_name: user.first_name,
                last_name: user.last_name,
                gender: user.gender
            }
            window.localStorage.setItem('User', JSON.stringify(essentialUserData));
            router.push('/profile/'+user.id)
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

export default Login