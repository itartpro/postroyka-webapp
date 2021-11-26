import PublicLayout from "components/public/public-layout";
import {getOrdersWithImages, getProfileById, getRow, getPageBySlug, getOrders} from "libs/static-rest";
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';
import css from './order.module.css'
import {formatPrice} from "libs/sfx";
import {isoToRusDate} from "libs/js-time-to-psql";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from "next/link";
import {useState} from "react";

export async function getServerSideProps({params}) {

    const order = await getOrdersWithImages({id:[parseInt(params.id)]}).then(data => data && data[0]);
    if (!order) {
        return {
            notFound: true,
        }
    }
    const otherOrdersCount = await getOrders({login_id: order.login_id}).then(res => Array.isArray(res) ? res.length : null);
    const town = await getRow('id', order.town_id, 'towns');
    const region = await getRow('id', order.region_id, 'regions');
    const customer = await getProfileById(parseInt(order.login_id)).then(e => {
        if(e) {
            delete e['password'];
            delete e['refresh'];
        }
        return e;
    });
    const service = await getPageBySlug("", order.service_id).then(res => {
        if(res) {
            return {
                id: res.id,
                name: res.name,
                slug: res.slug
            }
        }
        return null
    });

    return {
        props: {
            order,
            town,
            region,
            customer,
            service,
            otherOrdersCount
        }
    }
}

const Order = ({order, otherOrdersCount, town, region, customer, service}) => {
    const [query, setQuery] = useState("");
    const handleParam = setValue => e => setValue(e.target.value);
    const handleSubmit = e => {
        e.preventDefault();
        if(query.length > 3) {
            router.replace({
                pathname: 'orders/add',
                query: {title: query.trim()},
            })
        } else {
            router.push('orders/add')
        }
    }

    return (
        <PublicLayout>
            <br/>
            <main className={`col start max`}>
                <header><h1>{order.title}</h1></header>
                <br/>
                <p className={css.gray}>{region.name}, {town.name}</p>
                <br/>
                {order.description !== "" && <p>{order.description}<br/><br/></p>}
                <p className={css.budget}>
                    <span>{formatPrice(order.budget)}р</span>
                    <span className={css.gray}>Приблизительный бюджет</span>
                </p>
                <br/>
                {(order.images && order.images.length > 0) && (
                    <div className={'row start '+css.gal}>
                        <Gallery>
                            {order.images.map((e, i) => (
                                <Item key={e.id || i}
                                      original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/'+e.name}
                                      thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                      width={e.width}
                                      height={e.height}
                                      title={e.text}
                                >
                                    {({ ref, open }) => (
                                        <img
                                            ref={ref}
                                            onClick={open}
                                            src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                            alt={i}
                                            width={120}
                                            height={90}
                                            loading="lazy"
                                        />
                                    )}
                                </Item>
                            ))}
                        </Gallery>
                    </div>
                )}
                <ul className={`${css.details}`}>
                    <li>
                        <span>Заказ</span>
                        <span>{order.id}</span>
                    </li>
                    <li>
                        <span>Заказчик</span>
                        <span>{customer.first_name} (Заказов в общем: {otherOrdersCount})</span>
                    </li>
                    <li>
                        <span>Добавлен</span>
                        <span>{isoToRusDate(order.created)} <span className={css.gray}>&nbsp;{timeInRus(timeDiff(Date.parse(order.created), Date.now()))} назад</span></span>
                    </li>
                    <li>
                        <span>Сроки</span>
                        <span>{order.time}</span>
                    </li>
                    <li>
                        <span>Категория</span>
                        <span>{service.name}</span>
                    </li>
                </ul>
                <div className={`row bet ${css.bottom}`}>
                    <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/orders/bottom.jpg`} alt="Покрасить стены"  width="420" height="322" loading="lazy"/>
                    <div className="col bet">
                        <b>Вы мастер? Обеспечьте заказами себя, бригаду или компанию</b>
                        <ul>
                            <li>Стабильный поток заказов каждый день</li>
                            <li>Вы сами выбираете заказы и заказчиков, предлагаете свои условия</li>
                            <li>Договаривайтесь напрямую без комиссий и посредников</li>
                        </ul>
                        <div className="row center start">
                            <Link href={'/registration'}><a className={css.grn}>Регистрация мастера</a></Link>
                            <Link href={'/for-masters'}><a>Условия работы на сервисе</a></Link>
                        </div>
                        <p><b>Или</b> Найдите мастера под Ваши работы</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="title" value={query} onChange={handleParam(setQuery)} placeholder="Что требуется сделать?"/>
                            <input type="submit" value="Найти мастера ›"/>
                        </form>
                    </div>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Order