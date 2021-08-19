import css from "./order.module.css";

const Order = () => {

    return (
        <div className={`row bet ${css.box}`}>
            <div className={`row bet`}>
                <p>Покрыть ванну акрилом. Три года назад уже покрывали. Также нужно поменять смеситель.</p>
                <span>5 000р</span>
            </div>
            <div className={`row start center`}>
                <span>1 фото</span>
                <button>Бесплатный заказ</button>
                <button>Можно позвонить</button>
            </div>
            <p>Требуется выполнить работу: расчистка участка, покраска, копка, работа с растениями, покос травы, кладка
                блоков, погрузка и разгрузка строительных материалов, подъем на этаж и прочие работы.</p>
            <div className={`row bet`}>
                <p>Краснодарский край, городской округ Сочи, село Верхнениколаевское, Николаевская улица, 12А </p>
                <span>1 час 8 минут назад</span>
            </div>
        </div>
    )
}

export default Order