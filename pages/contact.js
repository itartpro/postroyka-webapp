import PublicLayout from "components/public/public-layout";
import formCSS from "styles/forms.module.css";
import {useForm} from "react-hook-form";
import {errMsg} from "libs/form-stuff";
import {useContext, useEffect, useState} from 'react'
import {WsContext} from 'context/WsProvider';

const Contact = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const { request, wsMsg, verifiedJwt } = useContext(WsContext);
    const [user, setUser] = useState(null);

    const onSubmit = d => {
        console.log(d)
        return false
    };

    //When JWT is in local storage and verified - get user data
    useEffect(() => {
        if(verifiedJwt) {
            const userString = window.localStorage.getItem('User');
            const JWTString = window.localStorage.getItem('AccessJWT');
            if(userString && JWTString) {
                const user = JSON.parse(userString);
                const goData = {
                    address: 'auth:50003',
                    action: 'get-profile',
                    instructions: JSON.stringify({id:user.id})
                };
                request(JSON.stringify(goData))
            }
        }
    }, [verifiedJwt])

    useEffect(() => {
        if (!wsMsg) return false;
        if(wsMsg.type === "error" && wsMsg.data.includes("no rows in result set")) {
            return false
        }
        const res = JSON.parse(wsMsg.data);
        if (res.data) {
            if (res.data.hasOwnProperty("avatar")) {
                const loggedIn = {
                    name: res.data.last_name + ' ' + res.data.first_name + ' ' + res.data.paternal_name,
                    email: res.data.email,
                    phone: res.data.phone
                }
                setUser(loggedIn)

                //TODO make chat with admin
            }
        }
    }, [wsMsg]);

    return (
        <PublicLayout>
            <main className={`max`}>
                <br/>
                <h1>Отправить запрос/комментарий</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={`col init start ${formCSS.form}`}>
                    <input type="text" {...register('name', {required: true, maxLength: 70})} placeholder="Как Вас зовут"/>
                    {errors.name && <small>Обязательное поле не более 70 символов</small>}

                    <input type="text" {...register('contact', {required: true, maxLength: 70})} placeholder="Ваш email или телефон"/>
                    {errors.contact && <small>Обязательное поле не более 70 символов</small>}

                    <textarea {...register('content', {required: true, maxLength: 2000})} placeholder="Ваш вопрос / комментарий / запрос"/>
                    {errMsg(errors.content, 2000)}

                    <input type="submit" name="attempt_contact" value="Отправить"/>
                </form>
            </main>
        </PublicLayout>
    )
}

export default Contact