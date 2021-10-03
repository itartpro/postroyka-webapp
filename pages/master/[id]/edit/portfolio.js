import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState} from "react";
import {getCats, getMastersChoices, getPortfolio, getProfileById} from "libs/static-rest";
import formCSS from "styles/forms.module.css";
import {IoIosArrowDown} from 'react-icons/io';
import {toggleDown} from "libs/sfx";
import {ShowMessage} from "components/show-message";

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

    return {
        props: {
            fromDB,
            services,
            works
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
    console.log(works);

    return (
        <PublicLayout loginName={user.first_name + ' ' + user.last_name}>
            <br/>
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