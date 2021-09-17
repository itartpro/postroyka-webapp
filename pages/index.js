import PublicLayout from 'components/public/public-layout';
import Order from 'components/public/order';
import Comments from 'components/public/home/comments';
import {Hero} from 'components/public/home/hero';
import {getCats, getPageBySlug} from 'libs/static-rest';
import css from 'styles/home.module.css';
import {organizeCats} from 'libs/arrs';
import Link from 'next/link';
import {Block300} from "components/public/block300";
import {Button} from "components/public/button";

export async function getStaticProps() {
    const page = await getPageBySlug('home');
    const cats = await getCats();
    const services = organizeCats(cats)[1].children;

    return {
        props: {
            page,
            services
        },
        revalidate: 120
    }
}

const Home = ({page, services}) => {

    return (
        <PublicLayout page={page}>
            <main className={`col start`}>
                <header className={`row ${css.hr1}`}><Hero/></header>
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
                        <a>Смотреть все ›</a>
                    </header>
                    <br/>
                    <br/>
                    <Order/>
                    <Order/>
                    <Order/>
                    <Button/>
                </section>
                <div className="row max">
                    <Block300/>
                </div>
                <br/>
                <br/>
                <div className={'col start max '+css.sv}>
                    <p className={css.headline}>Какие виды работ можно заказать?</p>
                    {services && services.map(e => (
                        <div key={'s'+e.id} className="col start">
                            <p>{e.name}</p>
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
            </main>
        </PublicLayout>
    )
}

export default Home;