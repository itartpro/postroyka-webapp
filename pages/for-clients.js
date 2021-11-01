import PublicLayout from "components/public/public-layout";
import css from 'styles/for-clients.module.css';
import {Hero} from "components/public/home/hero";
import {useState} from "react";
import {useRouter} from "next/router";

const ForClients = () => {

    const router = useRouter();
    const [query, setQuery] = useState("")
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
                <section className={`row bet max ${css.bl1}`}>

                    <div className={`row`}>
                        <img src="images/clients/client1.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>5 - 15 минут</p>
                            <p>Среднее время ожидания первого предложения</p>
                        </div>
                    </div>

                    <div className={`row`}>
                        <img src="images/clients/client2.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>До 60% экономии</p>
                            <p>За счет конкуренции мастеров и отсутствия комиссии</p>
                        </div>
                    </div>

                    <div className={`row`}>
                        <img src="images/clients/client3.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>130 тыс. мастеров</p>
                            <p>Поборются за ваш заказ</p>
                        </div>
                    </div>

                    <div className={`row`}>
                        <img src="images/clients/client4.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>7 предложений</p>
                            <p>В среднем приходит на заказ</p>
                        </div>
                    </div>

                    <div className={`row`}>
                        <img src="images/clients/client5.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>Конфиденциально</p>
                            <p>Сообщайте свои контакты только выбранным исполнителям</p>
                        </div>
                    </div>

                    <div className={`row`}>
                        <img src="images/clients/client6.png" alt="people" width="281" height="132" loading="lazy"/>
                        <div className={css.bl2}>
                            <p>21 000 отзывов</p>
                            <p>Помогут сравнить исполнителей</p>
                        </div>
                    </div>

                </section>
                <div className={`row bet ${css.st1}`}>
                    <div className="col start max">
                        <h3>Как найти мастера или бригаду на сайте Построй Ке?</h3>
                        <p>От «мастера на час» до строительной компании — одинаково простая схема поиска, сравнения,
                            выбора и работы</p>
                    </div>
                </div>
                <section className={`row max bet`}>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>01</p>
                            <img src="images/clients/icon1.png" alt="people" width="23" height="23" loading="lazy"/>
                        </div>
                        <p><span>Добавьте</span> заказ</p>
                        <p>Опишите, какие работы требуется выполнить — чем подробнее описание, тем более точные цены
                            смогут предложить мастера. Всё быстро и конфиденциально — и никто не увидит ваш номер
                            телефона, пока вы не решите передать его выбранному мастеру.</p>
                    </div>

                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>02</p>
                            <img src="images/clients/icon2.png" alt="people" width="26" height="26" loading="lazy"/>
                        </div>
                        <p><span>Получите предложения</span> с ценами за 15 минут</p>
                        <p>В среднем, менее чем через 15 минут после публикации заказа начинают поступать первые
                            предложения от исполнителей, заинтересованных в вашем заказе. Мастера предлагают свои
                            условия работы и задают уточняющие вопросы.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>03</p>
                            <img src="images/clients/icon3.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Сравните</span> мастеров</p>
                        <p>Сравнивайте не только предложения, но и анкеты приславших их мастеров. Обратите внимание,
                            подтверждены ли данные подрядчика («зеленая галочка»), как давно он зарегистрирован на
                            сайте, изучите отзывы предыдущих заказчиков. Рекомендации по выбору подрядчика.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>04</p>
                            <img src="images/clients/icon4.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Обсудите</span> условия</p>
                        <p>Обменяйтесь контактами с заинтересовавшими вас кандидатами и обсудите детали заказа и их
                            предложения с ними напрямую. Это можно сделать по телефону или в переписке на сайте.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>05</p>
                            <img src="images/clients/icon5.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Зафиксируйте</span> договоренности</p>
                        <p>Если договорились о выезде мастера на объект, рекомендуется зафиксировать все детали и
                            условия в переписке внутри сайта. Это позволит пресечь большую часть спорных ситуаций на
                            корню.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>06</p>
                            <img src="images/clients/icon6.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Заключите</span> договор</p>
                        <p>Если работы будут выполняться, заключите с исполнителем договор напрямую. Это особенно важно
                            для крупных работ.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>07</p>
                            <img src="images/clients/icon7.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Работы:</span> оплачивайте поэтапно</p>
                        <p>Разбивайте крупные работы на небольшие этапы и проводите оплату поэтапно. Избегайте
                            предоплат, особенно без документации. Участвуйте в закупке материалов.</p>
                    </div>
                    <div className={css.sct}>
                        <div className={`row center bet`}>
                            <p>08</p>
                            <img src="images/clients/icon8.png" alt="people" width="29" height="29" loading="lazy"/>
                        </div>
                        <p><span>Оставьте</span> отзыв</p>
                        <p>Примите работы и расскажите о своем взаимодействии с мастером.</p>
                    </div>
                </section>

                <section className={`row bet max ${css.lin1}`}>
                    <div className={`col`}>
                        <img src="images/clients/im1.png" alt="people" width="350" height="185" loading="lazy"/>
                        <p><span>Работайте напрямую</span> <br/>Построй Ка — не посредник и не стройфирма, а
                            информационный
                            сайт.</p>
                    </div>
                    <div className={`col`}>
                        <img src="images/clients/im2.png" alt="people" width="350" height="185" loading="lazy"/>
                        <p><span>Выбирайте сами</span> <br/>Нет диспетчеров. Обсуждайте заказ непосредственно с подрядчиками, а не с колл-центром.</p>
                    </div>
                    <div className={`col`}>
                        <img src="images/clients/im3.png" alt="people" width="350" height="185" loading="lazy"/>
                        <p><span>Экономьте до 60%</span> <br/>Конкуренция мастеров. Нет комиссии. Срез рынка от «суперэконом-» до «премиум-» класса.</p>
                    </div>
                </section>
                <section className={css.bg}>
                    <div className={`row max bet`}>
                        <div className={css.d2}>
                            <h3>Найдите мастера под Ваши работы</h3>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="title" value={query} onChange={handleParam(setQuery)} placeholder="Что требуется сделать?"/>
                                <input type="submit" value="Найти мастера"/>
                            </form>
                            <p>Опишите, какие работы требуются. — Свободные мастера, которых заинтересует ваш заказ, пришлют свои предложения по ценам и срокам. — Вы сможете обсудить свой заказ и договориться о выезде на объект и работах напрямую с любым из ответивших исполнителей.</p>
                        </div>
                        <img src="images/clients/imgblock.jpg" alt="people" width="550" height="293" loading="lazy"/>
                        <div className={`row center ${css.statis}`}>
                            <p>Мастеров онлайн: <span>312</span></p>
                            <p>Заказов в неделю: <span>1 714</span></p>
                            <p>Предложений в сутки: <span>615</span></p>
                        </div>
                    </div>

                </section>
            </main>
        </PublicLayout>
    )
}

export default ForClients