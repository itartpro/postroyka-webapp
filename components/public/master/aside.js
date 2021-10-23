import css from './aside.module.css';
import {GrLocation} from "react-icons/gr";
import {Star} from "components/public/master/star";

export const Aside = props => {
    return (
        <aside className={`col start ${css.as}`}>
            <b>Расположение</b>

            <p><GrLocation/> Кабардино-Балкарская Республика</p>
            <b>Выезд на объекты</b>
            <ul><GrLocation/> Ивановская
                область
                <li>Вичуга</li>
                <li>Иваново</li>
                <li>Кинешма</li>
                <li>Ивановский район</li>
                <li>Кинешемский район</li>
                <li>Фурмановский район</li>
                <li>Фурманов</li>
            </ul>
            <b>Оценки</b>
            <div>
                <div className={`row start`}>
                    <Star rating={40}/>
                    <p>Вежливость</p>
                </div>
                <div className={`row start`}>
                    <Star rating={90}/>
                    <p>Доступность для связи</p>
                </div>
                <div className={`row start`}>
                    <Star rating={50}/>
                    <p>Пунктуальность</p>
                </div>
                <div className={`row start`}>
                    <Star rating={50}/>
                    <p>Попадание в смету</p>
                </div>
                <div className={`row start`}>
                    <Star rating={50}/>
                    <p>Соблюдение сроков</p>
                </div>
                <div className={`row start`}>
                    <Star rating={50}/>
                    <p>Баланс цены/качества</p>
                </div>
            </div>
            <p>Оценили 5 заказчиков</p>
        </aside>
    )
}