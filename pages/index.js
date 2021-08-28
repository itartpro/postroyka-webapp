import PublicLayout from 'components/public/public-layout';
import Order from 'components/public/order';
import Comments from 'components/public/home/comments';
import {Hero} from 'components/public/home/hero';
import {getPageBySlug} from 'libs/static-rest';
import css from 'styles/home.module.css';

export async function getStaticProps() {
    const page = await getPageBySlug('home');

    return {
        props: {
            page
        },
        revalidate: 120
    }
}

const Home = ({page}) => {

    return (
        <PublicLayout page={page}>
            <main className={`col start`}>
                <header className={`row ${css.hr1}`}><Hero/></header>
                <div className={'row center bet max '+css.best}>
                    <div className="col start rel">
                        <b>Добавьте заказ</b>
                        <p>Никаких лишних звонков – мы никому не показываем ваш номер</p>
                        <span>1</span>
                    </div>
                    <div className="col start rel">
                        <b>Сравните предложения</b>
                        <p>Связывайтесь с кандидатами и обсуждайте детали заказа по телефону или в чате</p>
                        <span>2</span>
                    </div>
                    <div className="col start rel">
                        <b>Договоритесь напрямую</b>
                        <p>Изучите отзывы об исполнителях, сравните их условия и цены на вашу работу</p>
                        <span>3</span>
                    </div>
                </div>
                <div className={`row ${css.bg}`}>
                    <Comments/>
                </div>
                <div className="col start max">
                    <Order/>
                    <Order/>
                    <Order/>
                </div>
            </main>
            <style jsx global>{`
                #__next > nav { background-color: white }
            `}</style>
        </PublicLayout>
    )
}

export default Home;