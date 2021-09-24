import PublicLayout from "components/public/public-layout";
import css from 'styles/for-clients.module.css';
import {Hero} from "../components/public/home/hero";
import Order from "../components/public/order";
import {Button} from "../components/public/button";

const ForClients = () => {
    return (
        <PublicLayout>
            <main className={'col start'}>
                <header className={`row ${css.hr1}`}><Hero/></header>

                <div className={`row bet ${css.st1}`}>
                    <div className="col start max">
                        <h1>Построй Ка – не стройфирма, а портал мастеров и бригад</h1>
                        <p>Это крупнейший <span>специализированный сайт для поиска подрядчиков</span> в России. Сотни
                            заказчиков
                            находят здесь мастеров ежедневно. И вот почему:</p>
                    </div>
                </div>
                <section className={`row bet max`}>

                    <div className={`row ${css.bl1}`}>
                        <img src="images/clients/client1.png" alt="people"  width="281" height="142" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>5 - 15 минут</p>
                            <p>Среднее время ожидания первого предложения</p>
                        </div>
                    </div>
                    <div className={`row ${css.bl1}`}>
                        <img src="images/clients/client1.png" alt="people"  width="281" height="142" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>5 - 15 минут</p>
                            <p>Среднее время ожидания первого предложения</p>
                        </div>
                    </div>




                </section>
            </main>
        </PublicLayout>
    )
}

export default ForClients