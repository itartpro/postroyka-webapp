import PublicLayout from "components/public/public-layout";
import css from "./masters.module.css";
import {BsStar} from 'react-icons/bs';

const Masters = () => {
    return (
        <PublicLayout>
            <main className={`row start bet max`}>
                <section className={css.left}>
                    <div className={`col ${css.block}`}>
                        <b>Регион</b>
                        <input type="text" placeholder="Введите ваш регион"/>
                        <input type="text" placeholder="Ваш район"/>
                    </div>
                    <div className={css.filt}>
                        <b>Виды работ</b>
                        <ul>
                            <li><b>Комплексные работы</b></li>
                            <li>
                                <ul>
                                    <li><p>Строительство домов и коттеджей</p></li>
                                    <li><p>Ремонт квартир</p></li>
                                    <li><p>Ремонт кухни</p></li>
                                </ul>
                            </li>

                            <li><b>Строительство бань и саун</b></li>
                            <li><b>Строительство бассейнов</b></li>
                            <li><b>Строительство гаражей</b></li>
                            <li><b>Строительно-монтажные работы</b></li>
                            <li><b>Инженерные системы</b></li>
                            <li><b>Ремонт снегоуборочной и садовой техники</b></li>
                            <li><b>Ремонт электроники</b></li>
                        </ul>
                    </div>
                    <div className={css.formi}>
                        <button>Добавить заказ</button>
                        <p>Заинтересованные подрядчики пришлют вам свои предложения с ценами и прочими условиями, на
                            которых они готовы взяться за работу.</p>
                    </div>
                </section>
                <section className={css.right}>
                    <div>
                        <img src="https://thispersondoesnotexist.com/image" alt="" width="76" height="76"
                             loading="lazy"/>
                        <b>Арсёнов Михаил Александрович</b>
                        <span className="rel"><BsStar/> 8.2</span>

                        <div className={`row center bet ${css.very}`}>
                            <a href="#">
                                Премиальный ремонт дома под ключ
                            </a>
                            <b>
                                от 6 000р / м²
                            </b>
                            <button>
                                Предложить заказ
                            </button>
                        </div>
                        <div className={`row start ${css.grayp}`}>
                            <p>На сайте 6 лет 2 месяца</p>
                            <p>Был 1 год 8 месяцев назад</p>
                        </div>

                        <div className={css.ss}>
                            <p>
                                Комплексные ремонтные работы под ключ или отдельные виды работ. Ремонтно-отделочные
                                работы
                                любой сложности. Индивидуальный подход к каждому клиенту.
                                Работы под ключ или отдельные виды работ. Ремонтно-отделочные работы любой сложности.
                                Индивидуальный подход к каждому клиенту.
                            </p>
                            <a href="#">Развернуть</a>
                        </div>


                        <div className={css.imge}>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                        </div>

                        <div>
                            <b>Последний отзыв</b>
                            <p>
                                Комплексные ремонтные работы под ключ или отдельные виды работ. Ремонтно-отделочные
                                работы
                                любой сложности. Индивидуальный подход к каждому клиенту.
                                Работы под ключ или отдельные виды работ. Ремонтно-отделочные работы любой сложности.
                                Индивидуальный подход к каждому клиенту.
                            </p>
                        </div>
                        <div className={css.vo}>
                            <p><a href="#">Аделина, </a>Апрель 2021, по заказу <a href="#"> Сделать потолки в 3х комнатах</a></p>
                        </div>


                    </div>
                    <div className="row center start">
                        <img src="https://thispersondoesnotexist.com/image" alt="" width="76" height="76"
                             loading="lazy"/>
                        <b>Арсёнов Михаил Александрович</b>
                        <span className="rel"><BsStar/> 8.2</span>

                        <div className={`row center bet ${css.very}`}>
                            <a href="#">
                                Премиальный ремонт дома под ключ
                            </a>
                            <b>
                                от 6 000р / м²
                            </b>
                            <button>
                                Предложить заказ
                            </button>
                        </div>
                        <div className={`row start ${css.grayp}`}>
                            <p>На сайте 6 лет 2 месяца</p>
                            <p>Был 1 год 8 месяцев назад</p>
                        </div>

                        <div className={css.ss}>
                            <p>
                                Комплексные ремонтные работы под ключ или отдельные виды работ. Ремонтно-отделочные
                                работы
                                любой сложности. Индивидуальный подход к каждому клиенту.
                                Работы под ключ или отдельные виды работ. Ремонтно-отделочные работы любой сложности.
                                Индивидуальный подход к каждому клиенту.
                            </p>
                            <a href="#">Развернуть</a>
                        </div>


                        <div className={css.imge}>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                            <img src="http://placekitten.com/g/106/80" alt="master" width="106" height="80"
                                 loading="lazy"/>
                        </div>

                        <div>
                            <b>Последний отзыв</b>
                            <p>
                                Комплексные ремонтные работы под ключ или отдельные виды работ. Ремонтно-отделочные
                                работы
                                любой сложности. Индивидуальный подход к каждому клиенту.
                                Работы под ключ или отдельные виды работ. Ремонтно-отделочные работы любой сложности.
                                Индивидуальный подход к каждому клиенту.
                            </p>
                        </div>
                        <div className={css.vo}>
                            <p><a href="#">Аделина, </a>Апрель 2021, по заказу <a href="#"> Сделать потолки в 3х комнатах</a></p>
                        </div>


                    </div>


                </section>
            </main>
        </PublicLayout>
    )
}

export default Masters