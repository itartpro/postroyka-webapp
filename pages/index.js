import PublicLayout from 'components/public/public-layout';
import Order from "components/public/order";
import css from './home.module.css';
import Comment from "../components/public/comment";

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
                            <div>
                                <b>С нами легко</b>
                                <p>Услуги строительных компаний помогут Вам...</p>
                                <img src="/images/home/people.png"/>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="col start max">
                    <Order/>
                    <Order/>
                    <Order/>
                </div>
                <div className={`row max ${css.bg}`}>
                    <Comment/>
                    <Comment/>
                    <Comment/>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Home;