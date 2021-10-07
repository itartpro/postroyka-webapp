import PublicLayout from 'components/public/public-layout';
import {Order} from 'components/public/order';
import Comments from 'components/public/home/comments';
import {Hero} from 'components/public/home/hero';
import {getCats, getPageBySlug, getRegions} from 'libs/static-rest';
import css from 'styles/home.module.css';
import {organizeCats} from 'libs/arrs';
import Link from 'next/link';
import {Block300} from "components/public/block300";
import {Button} from "components/public/button";
import {toggleDown} from "libs/sfx";
import {IoIosArrowDown} from 'react-icons/io';

export async function getStaticProps() {
    const page = await getPageBySlug('home');
    const services = await getCats().then(cats => {
        if(cats === null) return null;
        return organizeCats(cats)[1].children
    });
    const regions = await getRegions();

    return {
        props: {
            page,
            services,
            regions
        },
        revalidate: 120
    }
}

const Home = ({page, services, regions}) => {

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