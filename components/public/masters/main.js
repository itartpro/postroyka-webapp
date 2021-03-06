import css from "./main.module.css";
import {toggleDown} from "libs/sfx";
import {Master} from "./master";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useRef} from 'react'

export const Main = ({services, page, others, region, town, regions, othersLine, towns, masters, service, parentService}) => {

    const {push, query} = useRouter();
    const regionRef = useRef(null)
    const selectRegion = e => {
        const value = e.target.value;
        if (!query.service) {
            return push(`/masters/${value}`);
        } else {
            if(value === '') {
                return push(`/masters/russia/all/${query.service}`);
            }
            return push(`/masters/${value}/all/${query.service}`);
        }
    }
    const selectTown = e => {
        const value = e.target.value;
        if (!query.service) {
            return push(`/masters/${regionRef.current.value}/${value}`);
        } else {
            if(value === '') {
                return push(`/masters/${regionRef.current.value}/all/${query.service}`);
            }
            return push(`/masters/${regionRef.current.value}/${value}/${query.service}`);
        }
    }

    const makeCompact = ev => {
        const btn = ev.target;
        const div = btn.nextElementSibling;
        if(div.classList.contains(css.compact)) {
            div.style.maxHeight = '1000px';
            setTimeout(() => {
                div.classList.remove(css.compact);
                div.removeAttribute('style');
                btn.innerText = 'Скрыть место и вид работ'
            }, 300)
        } else {
            div.style.maxHeight = '1000px';
            setTimeout(() => {
                div.classList.add(css.compact);
                div.removeAttribute('style');
                btn.innerText = 'Выбрать место и вид работ'
            }, 300)
        }
    }

    return (
        <main className={'max ' + css.main}>
            <aside>
                <button onClick={e => makeCompact(e)} className={css.toggle}>Выбрать место и вид работ</button>
                <div className={'col start '+css.compact}>
                    <div className={`col ${css.place}`}>
                    <b>Местоположение</b>
                    <select ref={regionRef} onChange={selectRegion}
                            defaultValue={region && region.slug || ''}>
                        <option value="">Выберите Вашу область</option>
                        {regions && regions.map(e => (
                            <option key={e.id} value={e.slug}>{e.name}</option>
                        ))}
                    </select>
                    <select onChange={selectTown}
                            defaultValue={town && town.slug || ''}>
                        <option value="">Ваш город или ближайший</option>
                        {towns && towns.map(e => (
                            <option key={e.id} value={e.slug}>{e.name}</option>
                        ))}
                    </select>
                </div>
                    <div className={css.cats}>
                        <b>Виды работ</b>
                        <ul>
                            {services && services.map(e => (
                                <li key={'s' + e.id}>
                                    <b role="button" onClick={toggleDown}>{e.name}</b>
                                    <ul className="row start">
                                        {e.children.map(e => (
                                            <li key={'s' + e.id}>
                                                <Link href={`/masters/${query.region || 'russia'}/${query.town || 'all'}/${e.slug}`}>
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
                        <Link href={`/orders/add`}><a>Добавить заказ</a></Link>
                        <p>Заинтересованные подрядчики пришлют вам свои предложения с ценами и прочими условиями, на
                            которых они готовы взяться за работу.</p>
                    </div>
                </div>
            </aside>
            <section className={css.right}>
                <header><h1>{page.h1 || page.name}</h1></header>
                {others && (
                    <div className={css.others}>
                        <h2>{othersLine}</h2>
                        <ul>
                            {others.map(e => (
                                <li key={e.id}>
                                    <Link href={`/masters/${query.region || 'russia'}/${query.town || 'all'}/${e.slug}`}>
                                        <a>{e.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {masters && masters.map(e => {
                    return (
                        <Master key={'m'+e.id} service={service} {...e}/>
                    )
                })}
                {!masters && region && town && service && !parentService && <p>Попробуйте поискать мастеров по региону <Link href={`/masters/${region.slug}`}><a className={css.link}>{region.name}</a></Link></p>}
                {!masters && region && town && !service && !parentService && <p>Попробуйте поискать мастеров по региону <Link href={`/masters/${region.slug}`}><a className={css.link}>{region.name}</a></Link></p>}
                {!masters && region && town && service && parentService && <p>Попробуйте поискать мастеров по региону <Link href={`/masters/${region.slug}/all/${service.slug}`}><a className={css.link}>{region.name}</a></Link></p>}
                {!masters && region && parentService && <p>Попробуйте поискать мастеров с похожими услугами в родительской услуге, и по региону<br/><Link href={`/masters/${region.slug}/all/${parentService.slug}`}><a className={css.link}>{parentService.name}</a></Link></p>}
                {!masters && region && !town && !parentService && <p>Похоже в этом регионе нет мастеров. Зарегестрируйтесь как мастер и станьте первым!<br/><Link href={`/for-masters`}><a className={css.link}>Стать первым!</a></Link></p>}
                {!masters && !region && !parentService && <p>Попробуйте поискать похожих мастеров <Link href={`/masters`}><a className={css.link}>Все мастера</a></Link></p>}
                {page.text.length > 0 && <div className={css.txt} dangerouslySetInnerHTML={{__html: page.text}}/>}
                <br/>
            </section>
        </main>
    )
}