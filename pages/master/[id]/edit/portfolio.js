import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState, useEffect} from "react";
import {getCats, getMastersChoices, getPortfolio, getProfileById} from "libs/static-rest";
import formCSS from "styles/forms.module.css";
import {IoIosArrowDown} from 'react-icons/io';
import {toggleDown} from "libs/sfx";
import {ShowMessage} from "components/show-message";
import css2 from "../add-work/add-work.module.css";
import {useForm} from "react-hook-form";
import {errMsg} from "libs/form-stuff";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(params.id).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const choiceIds = await getMastersChoices(params.id).then(choices => {
        if(!choices) return null;
        return choices.map(e => e['service_id'].toString());
    });
    const services = choiceIds && await getCats('id', choiceIds);
    const works = await getPortfolio(params.id)
    const organizedWorks = {};
    works.forEach(e => {
        if(!organizedWorks.hasOwnProperty(e.service_id)) {
            organizedWorks[e.service_id] = []
        }
        organizedWorks[e.service_id].push(e)
    })

    return {
        props: {
            fromDB,
            services,
            works: organizedWorks
        }
    }
}

//TODO load portfolio
//TODO add ability to add images right here

//each work in portfolio is:
//id
//master_id
//order_id //0 if none
//name Название
//service_id Привзяка к какой категории/услуге это относится
//description Описание
//hours Сроки
//price Приблизительная цена за похожую работу

//Галерея:(из нескольких картинок)
//portfolio_media table standard layout

const Portfolio = ({fromDB, services, works}) => {
    const [user, setUser] = useState(fromDB);
    const [showMsg, setShowMsg] = useState(null);

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

    return (
        <PublicLayout loginName={user.first_name + ' ' + user.last_name}>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <Link href={'/master/'+user.id+'/edit/info'}><a>Информация</a></Link>
                    <Link href={'/master/'+user.id+'/edit/service-prices'}><a>Услуги и цены</a></Link>
                    <a className={css.on}>Портфолио</a>
                </div>
                <div className={css.list}>
                    <h1>Добавить/редактировать в портфолио</h1>
                    <div>
                        <ul className={'col start'}>
                            {services && services.map(s => (
                                <li key={'s'+s.id}>
                                    <a role="button" className={formCSS.bar} onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{s.name}</a>
                                    <div className={formCSS.hid}>
                                        {works[s.id] && works[s.id].map(e => {
                                            return (
                                                <form onSubmit={handleSubmit(submitEdit)} className={`col start ${formCSS.form +' '+ css2.padded}`}>
                                                    <input type="text" {...register('name', {required: true, maxLength: 200})} placeholder="Название" defaultValue={e.name}/>
                                                    {errMsg(errors.name, 70)}

                                                    <textarea {...register('description', {required: true, maxLength: 2000})} placeholder="Напишите о самой работе / о процессе" defaultValue={e.description}/>
                                                    {errMsg(errors.description, 2000)}

                                                    <p>Сколько времени ушло на эту работу? (можно приблизительно)</p>
                                                    <div className={`row center start ${css2.time}`}>
                                                        <label>Часы:</label>
                                                        <input type="number" min="0" max="23" placeholder="Часы" {...register('hours')}/>
                                                        <label>Дни:</label>
                                                        <input type="number" min="0" max="1460" placeholder="Дни" {...register('days')}/>
                                                    </div>

                                                    <input type="number" {...register('price')} min="0" max="2147483647" placeholder="Приблизительная цена за похожую работу (в рублях)" defaultValue={e.price}/>
                                                    {errMsg(errors.price, 70)}

                                                    <p>Примечание: фотографии можно будет добавлять и редактировать, после добавления, на странице редактирования портфолио.</p>

                                                    <input onClick={e => hideForAWhile(e)} type="submit" value="Изменить"/>
                                                    {showErr && <small>{showErr}</small>}
                                                </form>
                                            )
                                        })}
                                        <Link href={'/master/'+user.id+'/add-work/'+s.id}><a className={css.b1 + ' ' + formCSS.grn}>Добавить новую работу</a></Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={3000}/>}
            </main>
        </PublicLayout>
    )
}

export default Portfolio