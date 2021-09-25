import PublicLayout from "components/public/public-layout";
import {getCats, getMastersChoices, getProfileById} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState} from "react";
import formCSS from "styles/forms.module.css";
import {toggleDown} from "libs/sfx";
import {useForm} from "react-hook-form";
import {IoIosArrowDown} from 'react-icons/io';

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const choices = await getMastersChoices(params.id);
    const choiceIds = choices.map(e => e['service_id'])
    const services = await getCats().then(cats => organizeCats(cats)[1].children.map(e => ({
        id: e.id,
        parent_id: e.parent_id,
        name: e.name,
        children: e.children.map(c => ({
            id: c.id,
            parent_id: c.parent_id,
            name: c.name,
            children: c.children.map(c2 => ({
                id: c2.id,
                parent_id: c2.parent_id,
                name: c2.name,
                extra: c2.extra
            }))
        }))
    })));

    const filtered = [];
    if(services && choiceIds) {
        services.forEach((e,i) => e.children.forEach(e2 => {
            if(choiceIds.includes(e2.id)) {
                if(!filtered.hasOwnProperty(i)) {
                    filtered[i] = e;
                    filtered[i].children = [];
                }
                filtered[i].children.push(e2)
            }
        }))
    }

    const organizedChoices = {};
    choices.forEach(e => {
        organizedChoices[e.service_id] = e;
    })

    return {
        props: {
            fromDB,
            services: filtered,
            choices: organizedChoices
        }
    }
}

const ServicePrices = ({fromDB, services, choices}) => {
    const [user, setUser] = useState(fromDB);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    const updateChoicePrices = d => {

        for(let i in d) {
            console.log(d[i])
        }
        const goData = {
            address: 'auth:50003',
            action: 'update-service-prices',
            instructions: JSON.stringify([])
        }
        //request(JSON.stringify(goData));
    }

    console.log(choices)

    return (
        <PublicLayout loginName={user.first_name + ' ' + user.last_name}>
            <br/>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <Link href={'/master/'+user.id+'/edit/info'}><a>Информация</a></Link>
                    <a className={css.on}>Услуги и цены</a>
                    <Link href={'/master/'+user.id+'/edit/portfolio'}><a>Портфолио</a></Link>
                </div>
                <div className={css.list}>
                    <h1>Редактировать цены на услуги</h1>
                    <form onSubmit={handleSubmit(updateChoicePrices)} className={`col start ${formCSS.form}`}>
                        <ul className={'col start'}>
                            {services && services.map(parent => parent && parent.children.map(c => (
                                <li key={'s'+c.id}>
                                    <a role="button" onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{c.name}</a>
                                    <ul className={`row start`}>
                                        {c.children.map(e => (
                                            <li className={css.edit_price} key={'s'+e.id}>
                                                <label>{e.name}</label>
                                                <span/>
                                                <input type="number" min={0} max={999999999} step={1} {...register(''+e.id)} defaultValue={choices[e.id] && choices[e.id].price}/>
                                                <p>&#8381; / {e.extra}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )))}
                        </ul>
                        <input type="submit" value="Изменить"/>
                    </form>
                </div>
            </main>
        </PublicLayout>
    )
}

export default ServicePrices