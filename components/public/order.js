import css from "./order.module.css";

export const Order = props => {
    return (
        <div className={`row bet ${css.box}`}>
            <div className={`row bet`}>
                <p>{props.title}</p>
                <span>{props.budget}р</span>
            </div>
            <div className={`row start center`}>
                <span>{props.images.length} фото</span>
                <button>Бесплатный заказ</button>
                <button>Можно позвонить</button>
            </div>
            <p>{props.description}</p>
            <div className={`row bet`}>
                <p>{props.region_id+', '+props.town_id}</p>
                <span>{props.created}</span>
            </div>
        </div>
        )
}