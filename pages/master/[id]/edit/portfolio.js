import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {useState} from "react";
import {getProfileById} from "libs/static-rest";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });

    return {
        props: {
            fromDB
        }
    }
}

const Portfolio = ({fromDB}) => {
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
                    <h1>Уже очень скоро я начну разработку редактирования портфолио мастера</h1>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Portfolio