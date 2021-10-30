import PublicLayout from "components/public/public-layout";
import css from "../../masters.module.css";
import {Master} from "components/public/masters/master";
import {getCats} from "libs/static-rest";
import {organizeCats} from "libs/arrs";
import {toggleDown} from "libs/sfx";
import {IoIosArrowDown} from 'react-icons/io';
import Link from 'next/link';

export async function getServerSideProps({params}) {
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });

    return {
        props: {
            services
        }
    }
}

const Masters = ({services}) => {
    return (
        <PublicLayout>
            <main className={'max '+css.main}>
                <aside>
                    <div className={`col ${css.place}`}>
                        <b>Регион</b>
                        <input type="text" placeholder="Введите ваш регион"/>
                        <input type="text" placeholder="Ваш район"/>
                    </div>
                    <div className={css.cats}>
                        <b>Виды работ</b>
                        <ul>
                            {services && services.map(e => (
                                <li key={'s'+e.id}>
                                    <b role="button" onClick={toggleDown}>{e.name}</b>
                                    <ul className="row start">
                                        {e.children.map(e => (
                                            <li key={'s'+e.id}>
                                                <Link href={'/masters/russia/all/'+e.slug}>
                                                    <a>{e.name}</a>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={css.formi}>
                        <button>Добавить заказ</button>
                        <p>Заинтересованные подрядчики пришлют вам свои предложения с ценами и прочими условиями, на
                            которых они готовы взяться за работу.</p>
                    </div>
                </aside>
                <section className={css.right}>
                    <div className={css.others}>
                        <b>Другие услуги этого раздела</b>
                        <a>
                            <span>Премиальный ремонт квартир под ключ</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Косметический ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Капитальный ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Ремонт квартир в новостройке</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Черновая отделка</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Премиальный ремонт квартир под ключ</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Косметический ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Капитальный ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Ремонт квартир в новостройке</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Черновая отделка</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                    </div>
                    <Master/>
                    <Master/>
                </section>
            </main>
        </PublicLayout>
    )
}

export default Masters