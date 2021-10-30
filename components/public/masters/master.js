import css from "./master.module.css";

export const Master = () => {
    return (
        <div className={css.master}>
            <div className="row start center">
                <img src="https://thispersondoesnotexist.com/image" alt="" width="76" height="76" loading="lazy"/>
                <b>Арсёнов Михаил Александрович</b>
            </div>

            <div className={`row center bet ${css.very}`}>
                <a href="#">Премиальный ремонт дома под ключ</a>
                <b>от 6 000р / м²</b>
                <button>Предложить заказ</button>
            </div>

            <div className={`row start ${css.gray}`}>
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


            <div className={'row start '+css.gal}>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
                     loading="lazy"/>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
                     loading="lazy"/>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
                     loading="lazy"/>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
                     loading="lazy"/>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
                     loading="lazy"/>
                <img src="http://placekitten.com/g/120/90" alt="master" width="120" height="90"
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
                <p><a>Аделина</a>, Апрель 2021, по заказу <a>Сделать потолки в 3х комнатах</a></p>
            </div>
        </div>
    )
}