import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState} from "react";
import {getCats, getMastersChoices, getProfileById} from "libs/static-rest";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const choices = await getMastersChoices(params.id);
    const choiceIds = choices.map(e => e['service_id']);
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
                    <h1>Редактирование портфолио мастера здесь</h1>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Portfolio