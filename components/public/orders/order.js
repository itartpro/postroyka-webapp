import css from "./order.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";

export const Order = props => {
    const created = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    console.log(props.images)
    return (
        <div className={`row bet ${css.box}`}>
            <div className={`row bet`}>
                <p>{props.title}</p>
                <span>{props.budget}р</span>
            </div>
            <div className={`row start center`}>
                <span>{props.images && props.images.length} фото</span>
                <button>Бесплатный заказ</button>
                <button>Можно позвонить</button>
            </div>
            <p>{props.description}</p>
            <div className={`row bet`}>
                <p>{props.region+', '+props.town}</p>
                <span>{created} назад</span>
            </div>
        </div>
    )
}