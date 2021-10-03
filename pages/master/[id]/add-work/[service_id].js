//TODO add possibility of referencing an order id (order_id)

import PublicLayout from "components/public/public-layout";
import Link from 'next/link';
import {useState, useEffect, useContext} from "react";
import {getProfileById, getPageBySlug} from "libs/static-rest";
import {ShowMessage} from "components/show-message";
import {WsContext} from "context/WsProvider";
import {useForm} from "react-hook-form";
import {errMsg} from "libs/form-stuff";

import css from "../edit/edit.module.css";
import formCSS from "styles/forms.module.css";
import css2 from "./add-work.module.css"

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const service = await getPageBySlug('', parseInt(params.service_id));

    return {
        props: {
            fromDB,
            service
        }
    }
}

const AddWork = ({fromDB, service}) => {
    const [user, setUser] = useState(fromDB);
    const [showMsg, setShowMsg] = useState(null);
    const page = {
        title: 'Добавить работу новую работу в портфолио'
    }

    //verify user access
    const { wsMsg, verifiedJwt, verifyById, checkAccess, request } = useContext(WsContext);
    const [ showContent, setShowContent ] = useState(undefined);
    useEffect(() => {
        const check = verifyById(fromDB.id) || checkAccess([9]);
        verifiedJwt !== undefined && setShowContent(check === true ? check : false);
    }, [verifiedJwt, showContent]);

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showErr, setShowErr] = useState(null);
    const submitEdit = d => {
        const work = {
            name: d.name,
            description: d.description,
            hours: parseInt(d.hours || 0) + parseInt(d.days || 0) * 24,
            login_id: parseInt(fromDB.id),
            service_id: parseInt(service.id),
            price: parseInt(d.price),
            order_id: 0
        }
        const goData = {
            address: 'auth:50003',
            action: 'add-work',
            instructions: JSON.stringify(work)
        };
        request(JSON.stringify(goData));
    }

    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type === "info") {
            let msg = null;
            try {
                msg = JSON.parse(wsMsg.data);
            } catch (err) {
                console.log("could not parse data: ",wsMsg.data, err)
                return false;
            }

            if(msg.name === "auth") {
                if(msg.status && msg.data === "added successfully") {
                    location.replace('/master/' + user.id + '/edit/portfolio')
                }
            }
        } else {
            setShowMsg(wsMsg.data)
        }
    }, [wsMsg])

    const hideForAWhile = e => {
        e.target.style.display = 'none';
        setTimeout(() => e.target.removeAttribute('style'), 3000);
    }

    return (
        <PublicLayout page={page} loginName={user.first_name + ' ' + user.last_name}>
            {showContent && <main className="col start max">
                <div className={'row start ' + css.tabs}>
                    <Link href={'/master/' + user.id + '/edit/info'}><a>Информация</a></Link>
                    <Link href={'/master/' + user.id + '/edit/service-prices'}><a>Услуги и цены</a></Link>
                    <Link href={'/master/' + user.id + '/edit/portfolio'}><a>Портфолио</a></Link>
                </div>
                <div className={css.list}>
                    <h1>Добавить новую работу в раздел портфолио {service.name}</h1>
                    <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form +' '+ css2.padded}`}>
                        <input type="text" {...register('name', {required: true, maxLength: 200})} placeholder="Название"/>
                        {errMsg(errors.name, 70)}

                        <textarea {...register('description', {required: true, maxLength: 2000})} placeholder="Напишите о самой работе / о процессе"/>
                        {errMsg(errors.description, 2000)}

                        <p>Сколько времени ушло на эту работу? (можно приблизительно)</p>
                        <div className={`row center start ${css2.time}`}>
                            <label>Часы:</label>
                            <input type="number" min="0" max="23" placeholder="Часы" {...register('hours')}/>
                            <label>Дни:</label>
                            <input type="number" min="0" max="1460" placeholder="Дни" {...register('days')}/>
                        </div>

                        <input type="number" {...register('price')} min="0" max="2147483647" placeholder="Приблизительная цена за похожую работу (в рублях)"/>
                        {errMsg(errors.price, 70)}

                        <p>Примечание: фотографии можно будет добавлять и редактировать, после добавления, на странице редактирования портфолио.</p>

                        <input onClick={e => hideForAWhile(e)} type="submit" value="Добавить"/>
                        {showErr && <small>{showErr}</small>}
                    </form>
                </div>
                {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={3000}/>}
            </main>}
        </PublicLayout>
    )
}

export default AddWork