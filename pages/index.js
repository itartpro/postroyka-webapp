import PublicLayout from 'components/public/public-layout';
import Order from "components/public/order";
import css from './home.module.css';

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
                <header className={`row ${css.d1}`}>
                    <div className="col start max">
                        <h1>Найдите мастера под Ваши работы</h1>
                        <form>
                            <input type="text" placeholder="Что требуется сделать?"/>
                            <input type="submit" value="Найти мастера"/>
                        </form>
                        <div className={css.d2}>
                            <div className={css.d3}>
                                <b>С нами легко</b>
                                <p>Услуги строительных компаний помогут Вам...</p>
                                <img src="/images/home/people.png"/>
                            </div>

                        </div>
                    </div>
                </header>
                <small>Ещё чего</small>
                <Order/>
            </main>
        </PublicLayout>
    )
}

export default Home;