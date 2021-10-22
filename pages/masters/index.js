import PublicLayout from "components/public/public-layout";
import css from "./masters.module.css";
import {Master} from "components/public/masters/master";

const Masters = () => {
    return (
        <PublicLayout>
            <main className={`row start bet max`}>
                <aside className={css.left}>
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
                </aside>

                <section className={css.right}>
                    <div className={css.others}>
                        <b>Другие услуги этого раздела</b>
                        <a>
                            <span>Премиальный ремонт квартир под ключ</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Косметический ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Капитальный ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Ремонт квартир в новостройке</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Черновая отделка</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Премиальный ремонт квартир под ключ</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Косметический ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Капитальный ремонт дома</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Ремонт квартир в новостройке</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                        <a>
                            <span>Черновая отделка</span>
                            <span>от 5 000 до 13 000р / м²</span>
                        </a>
                    </div>
                    <Master/>
                    <Master/>
                </section>
            </main>
        </PublicLayout>
    )
}

export default Masters