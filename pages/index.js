import PublicLayout from 'components/public/public-layout';
import {Order} from 'components/public/orders/order';
import Comments from 'components/public/home/comments';
import {Hero} from 'components/public/home/hero';
import {getCats, getOrdersWithImages, getPageBySlug, getRegions} from 'libs/static-rest';
import css from 'styles/home.module.css';
import {organizeCats} from 'libs/arrs';
import Link from 'next/link';
import {Button} from "components/public/button";
import {toggleDown} from "libs/sfx";
import {IoIosArrowDown} from 'react-icons/io';
import goPost from "libs/go-post";

export async function getStaticProps() {
    const page = await getPageBySlug('home');
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();
    const orders = await getOrdersWithImages({limit: 8});
    let orderRegions = null;
    let orderTowns = null;
    if(orders) {
        const regionIds = orders.map(e => e.region_id.toString());
        const townIds = orders.map(e => e.town_id.toString());
        orderRegions = await goPost(JSON.stringify({
            address: 'auth:50003',
            action: 'regions-where-in',
            instructions: JSON.stringify({
                column: 'id',
                values: regionIds
            })
        })).then(res => {
            try {
                const parsed = JSON.parse(res);
                const organized = {};
                parsed.data.forEach(e => {
                    organized[e.id] = e.name;
                });
                return organized
            } catch (e) {
                console.log("regions-where-in error:" + e + res);
                return res
            }
        });
        orderTowns = await goPost(JSON.stringify({
            address: 'auth:50003',
            action: 'towns-where-in',
            instructions: JSON.stringify({
                column: 'id',
                values: townIds
            })
        })).then(res => {
            try {
                const parsed = JSON.parse(res);
                const organized = {};
                parsed.data.forEach(e => {
                    organized[e.id] = e.name;
                });
                return organized
            } catch (e) {
                console.log("towns-where-in error:" + e + res);
                return res
            }
        });
    }

    return {
        props: {
            page,
            services,
            regions,
            orders,
            orderRegions,
            orderTowns
        },
        revalidate: 120
    }
}

const Home = ({page, services, regions, orders, orderRegions, orderTowns}) => {

    return (
        <PublicLayout page={page}>
            <main className={`col start`}>
                <header className={`row ${css.hr1}`}><Hero h1={page.h1}/></header>
                <div className={'row center bet max '+css.best}>
                    <div className="col start rel">
                        <b>Добавьте заказ</b>
                        <p>Никаких лишних звонков – мы никому не показываем ваш номер</p>
                    </div>
                    <div className="col start rel">
                        <b>Сравните предложения</b>
                        <p>Связывайтесь с кандидатами и обсуждайте детали заказа по телефону или в чате</p>
                    </div>
                    <div className="col start rel">
                        <b>Договоритесь напрямую</b>
                        <p>Изучите отзывы об исполнителях, сравните их условия и цены на вашу работу</p>
                    </div>
                </div>
                <section className={`row ${css.bg}`}>
                    <header className={'row start max '+css.blu}>
                        <p className={css.headline}>Последние отзывы о выполненных работах</p>
                        <a>Рекомендации по выбору исполнителя</a>
                    </header>
                    <Comments/>
                </section>
                <section className="col start max">
                    <br/><br/>
                    <header className={'row start '+css.blu}>
                        <p className={css.headline}>Актуальные заказы</p>
                        <Link href={'/orders'}><a>Смотреть все ›</a></Link>
                    </header>
                    <br/>
                    <br/>
                    {orders && orders.map(e => <Order key={'o'+e.id} {...e} region={orderRegions[e.region_id]} town={orderTowns[e.town_id]}/>)}
                    <Button/>
                </section>
                <div className="row max">
                    <div className={`row bet ${css.bl1}`}>
                        <div>
                            <h1>Более 300 тысяч заказчиков уже нашли мастера на Постройке</h1>
                            <p>Это совершенно бесплатно и ни к чему не обязывает.
                                В среднем, на каждый заказ поступает 5-7 предложений</p>
                            <Link href={'/orders/add'}><a>Добавить заказ</a></Link>
                        </div>
                        <div>
                            <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/home/people.png`} alt="people"  width="372" height="272" loading="lazy"/>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
                <div className={'col start max '+css.sv}>
                    <p className={css.headline}>Какие виды работ можно заказать?</p>
                    {services && services.map(e => (
                        <div key={'s'+e.id} className="col start">
                            <a role="button" onClick={toggleDown}><IoIosArrowDown/>&nbsp;{e.name}</a>
                            <ul className="row start">
                                {e.children.map(e => (
                                    <li key={'s'+e.id}>
                                        <Link href={'/service/'+e.slug}>
                                            <a>{e.name}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <br/>
                <div className={'col start max '+css.sv}>
                    <p className={css.headline}>Найти мастера по региону</p>
                    <ul className="row start">
                        {regions && regions.map(e => (
                            <li key={'r'+e.id}>
                                <Link href={'/masters/'+e.id}>
                                    <a>{e.name}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <br/>
            </main>
        </PublicLayout>
    )
}

export default Home;