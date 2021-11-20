import css from "./order.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from "next/link";

export const Order = props => {
    const created = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    return (
        <div className={`row bet ${css.box}`}>
            <div className={`row bet`}>
                <Link href={`/orders/${props.id}`}><a>{props.title}</a></Link>
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