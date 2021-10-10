import css from './comments.module.css';
import PublicLayout from "../public-layout";

export const Comments = () => {
    return (
        <main className="row start max">
            <header className="row start">
                <div>
                    <h1>Отзывы</h1>
                    <div className={`row ${css.pad}`}>
                        <b>Все</b>
                        <p>Положительные</p>
                        <p>Нейтральные</p>
                        <p>Отрицательные</p>
                    </div>
                </div>
            </header>
            <section className={css.wow}>
                <div className={css.cont}>
                    <p>Положительный отзыв</p>
                    <p>По заказу <a href="https:\\google.com">Установка унитаза с обжатием труб из сшитого полиэтилена</a> </p>
                    <b>Что понравилось</b>
                    <p>В целом всё понравилось.
                        Работали: Алексей, Олег и Валерий.
                        Оперативно договорились о встрече, приехали вовремя, составили план работ и список необходимых материалов. Взяли предоплату за материалы под расписку, уехали.
                        На следующий день, привезли все материалы, выполнили требуемые работы в заявленный срок. (Установка и подключение унитаза, подвешивание и подключение водонагревателя, подключение мойки и посудомойки).
                        Так же оперативно выполнили дополнительные работы, о которых не было заявлено изначально (Установка и подключение умывальника).</p>
                    <b>Что не понравилось</b>
                    <p>Имеется крайняя необходимость все работы и цены фиксировать на бумаге, в независимости от объёма работ.
                        Алексей округляет цены в меньшую сторону, Олег в большую.
                    </p>
                    <b>Общие выводы</b>
                    <p>Хорошая бригада.</p>
                    <b>Фотографии</b>
                    <div>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                    </div>
                    <p><a href="https:\\google.com">Алексей </a>октябрь 2021</p>
                </div>
                <div className={css.cont}>
                    <p>Отрицательный отзыв</p>
                    <p>По заказу <a href="https:\\google.com">Установка унитаза с обжатием труб из сшитого полиэтилена</a> </p>
                    <b>Что понравилось</b>
                    <p>В целом всё понравилось.
                        Работали: Алексей, Олег и Валерий.
                         выполнили требуемые работы в заявленный срок. (Установка и подключение унитаза, подвешивание и подключение водонагревателя, подключение мойки и посудомойки).
                        Так же оперативно выполнили дополнительные работы, о которых не было заявлено изначально (Установка и подключение умывальника).</p>
                    <b>Что не понравилось</b>
                    <p>Имеется крайняя необходимость все работы и цены фиксировать на бумаге, в независимости от объёма работ.
                        Алексей округляет цены в меньшую сторону, Олег в большую. Оперативно договорились о встрече, приехали вовремя, составили план работ и список необходимых материалов. Взяли предоплату за материалы под расписку, уехали.
                        На следующий день, привезли все материалы,
                    </p>
                    <b>Общие выводы</b>
                    <p>Хорошая бригада.</p>
                    <b>Фотографии</b>
                    <div>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                        <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80" loading="lazy"/>
                    </div>
                    <p><a href="https:\\google.com">Алексей </a>октябрь 2021</p>
                </div>
            </section>


        </main>
    )
}