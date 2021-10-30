import css from "./main.module.css";
import {toggleDown} from "libs/sfx";
import {Master} from "./master";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useRef} from 'react'


export const Main = ({services, page, others, regions, othersLine, towns}) => {

    const regionRef = useRef(null);
    const router = useRouter();
    const selectRegion = e => {
        const value = e.target.value;
        let empty = true;
        for(let i in router.query) {
            if(router.query.hasOwnProperty(i)) {
                empty = false;
                return true
            }
        }
        if(empty) return router.push(`/masters/${value}/all/all`);
    }
    const selectTown = e => {
        console.log(regionRef.current.value)
        const value = e.target.value;
        let empty = true;
        for(let i in router.query) {
            if(router.query.hasOwnProperty(i)) {
                empty = false;
                return true
            }
        }
    }

    return (
        <main className={'max ' + css.main}>
            <aside>
                <div className={`col ${css.place}`}>
                        <b>Местоположение</b>
                        <select ref={regionRef} placeholder="Выберите Вашу область" onChange={selectRegion} defaultValue={'moskovskaya-obl'}>
                            {regions.map(e => (
                                <option key={e.id} value={e.slug}>{e.name}</option>
                            ))}
                        </select>
                        <select placeholder="Ваш город или ближайший" onChange={selectTown} defaultValue={'moskva'}>
                            {towns.map(e => (
                                <option key={e.id} value={e.slug}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                <div className="col start">
                    <div className={css.cats}>
                        <b>Виды работ</b>
                        <ul>
                            {services && services.map(e => (
                                <li key={'s' + e.id}>
                                    <b role="button" onClick={toggleDown}>{e.name}</b>
                                    <ul className="row start">
                                        {e.children.map(e => (
                                            <li key={'s' + e.id}>
                                                <Link href={'/masters/russia/all/' + e.slug}>
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
                                    <Link href={'/masters/russia/all/' + e.slug}>
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
                {page.text.length && <div className={css.txt} dangerouslySetInnerHTML={{__html: page.text}} />}
            </section>
        </main>
    )
}