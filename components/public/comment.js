import css from "./comment.module.css";
import {BsStar} from 'react-icons/bs';
import {IoIosCheckmarkCircleOutline} from 'react-icons/io';


export const Comment = () => {

    return (
        <div className={`row bet ${css.d1}`}>
            <div className="row bet">
                <p>Положительный отзыв</p>
                <BsStar/>
                <span>8.2</span>
                <div></div>
            </div>
            <div className="row center bet">
                <img src="https://thispersondoesnotexist.com/image" alt="" width="76" height="76" loading="lazy"/>
                <b>Фамилия Имя Отчество</b>
                <IoIosCheckmarkCircleOutline/>{/*Я думаю это надо сделать позитион абсолют*/}
                <span>17 отзывов</span>{/*Я думаю это надо сделать позитион абсолют*/}
            </div>
            <p>Порядочный, аккуратный мастер. Делает на совесть. Весь инструмент свой, в т.ч. фрезер. Делает, чтобы было
                удобно. Работой довольна. Заказ был, чтобы перила были надежны, с..</p>
            <span>2 дня назад</span>
        </div>
    )
}