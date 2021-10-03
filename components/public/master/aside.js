import css from './aside.module.css';
import {GrLocation} from "react-icons/gr";

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
                    <p className={css.star}>
                        <span style={{width: '50%'}}/>
                    </p>
                    <p>Вежливость</p>
                </div>
                <div className={`row start`}>
                    <p className={css.star}>
                        <span style={{width: '50%'}}/>
                    </p>
                    <p>Доступность для связи</p>
                </div>
                <div className={`row start`}>
                    <p className={css.star}>
                        <span style={{width: '70%'}}/>
                    </p>
                    <p>Пунктуальность</p>
                </div>
                <div className={`row start`}>
                    <p className={css.star}>
                        <span style={{width: '50%'}}/>
                    </p>
                    <p>Попадание в смету</p>
                </div>
                <div className={`row start`}>
                    <p className={css.star}>
                        <span style={{width: '90%'}}/>
                    </p>
                    <p>Соблюдение сроков</p>
                </div>
                <div className={`row start`}>
                    <p className={css.star}>
                        <span style={{width: '30%'}}/>
                    </p>
                    <p>Баланс цены/качества</p>
                </div>
            </div>
            <p>Оценили 5 заказчиков</p>
        </aside>
    )
}