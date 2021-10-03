import css from "./block300.module.css";

export const Block300 = () => {

    return (
        <div className={`row bet ${css.bl1}`}>

            <div>
                <h1>Более 300 тысяч заказчиков уже нашли мастера на Постройке</h1>
                <p>Это совершенно бесплатно и ни к чему не обязывает.
                    В среднем, на каждый заказ поступает 5-7 предложений</p>
                <button>Добавить заказ</button>
            </div>
            <div>
                <img src="/images/home/people.png" alt="people"  width="372" height="272" loading="lazy"/>
            </div>
        </div>
    )
}