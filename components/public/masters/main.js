import css from "./main.module.css";
import {toggleDown} from "libs/sfx";
import {Master} from "./master";
import Link from 'next/link';

export const Main = ({services, page, others, othersLine}) => {
    return (
        <main className={'max '+css.main}>
            <aside>
                    <div className={`col ${css.place}`}>
                        <b>Местоположение</b>
                        <input type="text" placeholder="Ваш регион"/>
                        <input type="text" placeholder="Ваш город или ближайший"/>
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
                    <div className={css.add}>
                        <button>Добавить заказ</button>
                        <p>Заинтересованные подрядчики пришлют вам свои предложения с ценами и прочими условиями, на
                            которых они готовы взяться за работу.</p>
                    </div>
                </aside>
            <section className={css.right}>
                    <header><h1>{page.h1 || page.name}</h1></header>
                    {others && others.length > 0 && (
                        <div className={css.others}>
                            <h2>{othersLine}</h2>
                            <ul>
                                {others.map(e => (
                                    <li>
                                        <Link href={'/masters/russia/all/'+e.slug}>
                                            <a>
                                                <span>{e.name}</span>
                                                <span>от 5 000 до 13 000р / м²</span>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Master/>
                    <Master/>
                </section>
        </main>
    )
}