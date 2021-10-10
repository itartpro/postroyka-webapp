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
                    <p>По заказу <a href="https:\\google.com">Установка унитаза с обжатием труб из сшитого
                        полиэтилена</a></p>
                    <b>Что понравилось</b>
                    <p>В целом всё понравилось.
                        Работали: Алексей, Олег и Валерий.
                        Оперативно договорились о встрече, приехали вовремя, составили план работ и список необходимых
                        материалов. Взяли предоплату за материалы под расписку, уехали.
                        На следующий день, привезли все материалы, выполнили требуемые работы в заявленный срок.
                        (Установка и подключение унитаза, подвешивание и подключение водонагревателя, подключение мойки
                        и посудомойки).
                        Так же оперативно выполнили дополнительные работы, о которых не было заявлено изначально
                        (Установка и подключение умывальника).</p>
                    <b>Что не понравилось</b>
                    <p>Имеется крайняя необходимость все работы и цены фиксировать на бумаге, в независимости от объёма
                        работ.
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
                    <p>По заказу <a href="https:\\google.com">Установка унитаза с обжатием труб из сшитого
                        полиэтилена</a></p>
                    <b>Что понравилось</b>
                    <p>В целом всё понравилось.
                        Работали: Алексей, Олег и Валерий.
                        выполнили требуемые работы в заявленный срок. (Установка и подключение унитаза, подвешивание и
                        подключение водонагревателя, подключение мойки и посудомойки).
                        Так же оперативно выполнили дополнительные работы, о которых не было заявлено изначально
                        (Установка и подключение умывальника).</p>
                    <b>Что не понравилось</b>
                    <p>Имеется крайняя необходимость все работы и цены фиксировать на бумаге, в независимости от объёма
                        работ.
                        Алексей округляет цены в меньшую сторону, Олег в большую. Оперативно договорились о встрече,
                        приехали вовремя, составили план работ и список необходимых материалов. Взяли предоплату за
                        материалы под расписку, уехали.
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
                    <p><a href="https:\\google.com">Алексей </a> октябрь 2021</p>
                    <div className={css.img2}>
                        <div className={`row center start`}>
                            <img src="http://placekitten.com/g/30/30" alt="master" width="30" height="30"
                                 loading="lazy"/>
                                <b>Петренко Лев Антонович</b>
                            <p>Хотелось бы внести пояснения по поводу некорректного отзыва в наш адрес в
                                разделе:"Что не понравилось", так как мы дорожим и уважаем мнение наших
                                заказчик,если оно объективное.Олег и Алексей Нальский, мы являемся партнерами.
                                Каждый из нас отвечает за свое направление.Алексей за сантехнику и электрику, а я за
                                отделочные работы.Договор в данном случае не заключался по причине незначительного
                                объема работ(работы по укладке 20 м2. плитки).Но даже, если заказчик пожелал бы его
                                заключить,в данном случае мы были только рады, так как при осмотре помещения с ним
                                были согласованы определенные работы и их стоимость, а затем появились
                                дополнительные незаявленные работы, которые также были с ним утверждены, но заказчик
                                по своим каким-то личным соображениям отказался за них платить,сославшись на то что
                                у него бюджет ограничен(разговор шел о доплате 2500 руб.).Это мягко говоря
                                несерьезно, каждая работа ведь должна быть оплачена, тем более если она согласована
                                с заказчиком(вот почему договор и смета были бы в данном случае в нашу пользу).Это
                                на самом деле такой "развод" со стороны заказчика - вы же мне не сказали, что это
                                дополнительные работы, я и не думал за них платить.Что касается сроков окончания
                                работ, то они затянулись по причине того, что возникли дополнительные работы,
                                которые до этого не предусматривались.Но даже при всем при этом работы были
                                закончены 13.02, а заказчик указывал срок - не позднее 15.02.Более того, была
                                осуществлена тщательная уборка помещения, хотя это не входило в стоимость заявленных
                                работ и заказчик собирался это сделать своими собственными силами.Материал не
                                закупался с запасом опять же с целью экономии средств заказчика и в результате
                                излишков не осталось(докупал и довозил материал я, хотя это была прерогатива
                                заказчика).В самом конце работ мастер сделал от себя подарок, в виде устройства
                                полочки из плитки для мыльных принадлежностей.Заказчик это даже не оценил в виде
                                положительного отзыва.Хотелось бы адекватного, разумного и ответственного отношения
                                заказчиков в адрес мастеров, которые добротно, достойно и качественно выполняют свою
                                работу.С уважением, Олег и Алексей!</p>
                        </div>
                </div>
            </div>
        </section>


</main>
)
}