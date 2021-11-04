import css from './aside.module.css';
import {GrLocation} from "react-icons/gr";
import {Star} from "components/public/master/star";

export const Aside = props => {
    const home = props.homeLoc || props.regions[props.profile.region_id] + ' ' + props.towns[props.profile.town_id];
    return (
        <aside className={`col start ${css.as}`}>
            <b>Расположение</b>
            <p><GrLocation/> {home}</p>

            <b>Выезд на объекты</b>
            <ul>
                {props.territories && Object.keys(props.territories).map(region => (
                    <li key={region}>
                        <p><GrLocation/> {props.regions[region]}</p>
                        <ul>
                            {Object.keys(props.territories[region]).map(town => (
                                <li key={town}>{props.towns[town]}</li>
                            ))}
                        </ul>
                    </li>
                ))}
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