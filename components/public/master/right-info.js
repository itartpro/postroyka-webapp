import css from './right-info.module.css';

export const RightInfo = props => {
    return (
        <aside className={`col start ${css.rig}`}>
            <b>Расположение</b>

            <p><img src="/images/profilemaster/geo.png" width="18" height="21" alt="geo"
                    loading="lazy"/> Кабардино-Балкарская Республика</p>
            <b>Выезд на объекты</b>
            <ul><img src="/images/profilemaster/geo.png" width="18" height="21" alt="geo" loading="lazy"/> Ивановская
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
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Вежливость</p>
                </div>
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Доступность для связи</p>
                </div>
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Пунктуальность</p>
                </div>
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Попадание в смету</p>
                </div>
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Соблюдение сроков</p>
                </div>
                <div className={`row start ${css.star}`}>
                    <div>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                        <img src="/images/profilemaster/star.png" width="19" height="18" alt="geo" loading="lazy"/>
                    </div>
                    <p>Баланс цены/качества</p>
                </div>
            </div>
            <p>Оценили 5 заказчиков</p>
        </aside>
    )
}