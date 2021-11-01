import css from "./master.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";

export const Master = props => {

    const fullName = props.last_name + ' ' + props.first_name + (props.paternal_name && ' ' + props.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/mini/ava.jpg';
    const image = props.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';

    return (
        <div className={css.master}>
            <div className="row start center">
                <img src={image} alt={props.first_name} width="76" height="76" loading="lazy"/>
                <b>{fullName}</b>
            </div>

            <div className={`row center bet ${css.very}`}>
                <a href="#">Премиальный ремонт дома под ключ</a>
                <b>от 6 000р / м²</b>
                <button>Предложить заказ</button>
            </div>

            <div className={`row start ${css.gray}`}>
                <p>На сайте {timeOnSite}</p>
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