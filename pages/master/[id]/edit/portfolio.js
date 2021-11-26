import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import Link from 'next/link';
import {getCats, getMastersChoices, getPortfolio, getProfileById} from "libs/static-rest";
import formCSS from "styles/forms.module.css";
import {IoIosArrowDown} from 'react-icons/io';
import {toggleDown} from "libs/sfx";
import {EditWork} from "components/public/master/edit/edit-work";
import {useState, useEffect, useContext} from "react";
import {ShowMessage} from "components/show-message";
import {WsContext} from "context/WsProvider";

export async function getServerSideProps({params}) {
    const fromDB = await getProfileById(params.id).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    if (fromDB.level !== 2) {
        return {
            notFound: true
        }
    }
    const choiceIds = await getMastersChoices(params.id).then(resp => {
        return resp.reduce((result, e) => {
            if(e.parent) {
                result.push(e.service_id.toString())
            }
            return result
        }, []);
    })
    const services = choiceIds && await getCats('id', choiceIds);
    const works = await getPortfolio(params.id)
    const organizedWorks = {};
    works && works.forEach(e => {
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

const Portfolio = ({fromDB, services, works}) => {

    const [showMsg, setShowMsg] = useState(null);
    //verify user access
    const { wsMsg, verifiedJwt, verifyById, checkAccess, request } = useContext(WsContext);
    const [ showContent, setShowContent ] = useState(undefined);
    useEffect(() => {
        const check = verifyById(fromDB.id) || checkAccess([9]);
        verifiedJwt !== undefined && setShowContent(check === true ? check : false);
    }, [verifiedJwt, showContent]);

    return (
        <PublicLayout loginName={showContent && (fromDB.first_name + ' ' + fromDB.last_name)}>
            <br/>
            {showContent && (
                <main className="col start max">
                    <div className={'row start '+css.tabs}>
                        <Link href={'/master/'+fromDB.id+'/edit/info'}><a>Информация</a></Link>
                        <Link href={'/master/'+fromDB.id+'/edit/service-prices'}><a>Услуги и цены</a></Link>
                        <a className={css.on}>Портфолио</a>
                    </div>
                    <div className={css.list}>
                        <h1>Добавить/редактировать в портфолио</h1>
                        <div>
                            <ul className={'col start'}>
                                {services && services.map(s => (
                                    <li key={'ps'+s.id}>
                                        <a role="button" className={formCSS.bar} onClick={toggleDown}><IoIosArrowDown/>&nbsp;&nbsp;{s.name}</a>
                                        <div className={formCSS.hid}>
                                            {works[s.id] && works[s.id].map(e => (
                                                <EditWork
                                                    key={'pw'+e.id}
                                                    serviceId={s.id}
                                                    userId={fromDB.id}
                                                    work={e}
                                                    setShowMsg={setShowMsg}
                                                />
                                            ))}
                                            <br/><br/>
                                            <Link href={'/master/'+fromDB.id+'/add-work/'+s.id}><a className={`${css.b1} ${formCSS.grn} ${css.inverse}`}>Добавить новую работу в раздел "{s.name}"</a></Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={3000}/>}
                </main>
            ) || <main className="col max"><p>Нет данных</p></main>}
        </PublicLayout>
    )
}

export default Portfolio