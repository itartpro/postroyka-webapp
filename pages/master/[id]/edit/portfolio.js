import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState} from "react";
import {getCats, getMastersChoices, getProfileById} from "libs/static-rest";
import formCSS from "styles/forms.module.css";
import {IoIosArrowDown} from 'react-icons/io';
import {toggleDown} from "libs/sfx";
import {ShowMessage} from "components/show-message";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const choices = await getMastersChoices(params.id);
    const choiceIds = choices.map(e => e['service_id'].toString());
    const services = await getCats('id', choiceIds);

    return {
        props: {
            fromDB,
            services
        }
    }
}

const Portfolio = ({fromDB, services}) => {
    const [user, setUser] = useState(fromDB);
    const [showMsg, setShowMsg] = useState(null);

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
                                    <div className={formCSS.hid}>Some controls will be here</div>
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