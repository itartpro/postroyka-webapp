import PublicLayout from 'components/public/public-layout';
import Order from "components/public/order";
import css from './home.module.css';
import Comments from "components/public/home/comments";

const Home = () => {
    const page = {
        'title':'',
        'description':'',
        'keywords':''
    };
    const ogImage = '';

    return (
        <PublicLayout page={page} ogImage={ogImage}>
            <main className={`col start`}>
                <header className={`row ${css.hr1}`}>
                    <div className="col start max rel">
                        <h1>Найдите мастера под Ваши работы</h1>
                        <form>
                            <input type="text" placeholder="Что требуется сделать?"/>
                            <input type="submit" value="Найти мастера"/>
                        </form>
                        <div className={css.d2}>
                            <div className={'row bet'}>
                                <div className="col start">
                                    <b>С нами легко</b>
                                    <p>Услуги строительных компаний помогут вам построить дом с нуля или преобразить свое жилище в точно оговоренные сроки</p>
                                </div>
                                <img src="/images/home/people.png" alt="Слайд 1" width="365" height="300" loading="lazy"/>
                            </div>
                        </div>
                        <div className={'row center bet '+css.pg}>
                            <button>&lsaquo;</button>
                            <span>1</span>
                            <span>/</span>
                            <span>5</span>
                            <button>&rsaquo;</button>
                        </div>
                    </div>
                </header>
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