import css from './portfolio.module.css';
import {FiChevronDown} from "react-icons/fi";
import {toggleDown} from "libs/sfx";

export const Portfolio = props => {
    return (
        <ul className={`col start ${css.left}`}>
            <li>
                <a className={`row bet center`} role="button" onClick={toggleDown}>
                    <b>Премиальный ремонт дома под ключ</b>
                    <FiChevronDown/>
                </a>
            </li>
            <li>
                <a className={`row bet center`} role="button" onClick={toggleDown}>
                    <b>Премиальный ремонт дома под ключ</b>
                    <FiChevronDown/>
                </a>
            </li>
            <li>
                <a className={`row bet center`} role="button" onClick={toggleDown}>
                    <b>Премиальный ремонт дома под ключ</b>
                    <FiChevronDown/>
                </a>
                <div>
                    <div className={`col start ${css.d1}`}>
                        <b>Ремонт ванной и туалета в сталинки</b>
                        <p>Сроки и объем 50 дней Средняя цена 90000руб. Перечень работ Демонтаж перегородок из дранки, замена
                            всех стояков, устройство стяжки, разводка водопровода, канализации и электрики, устройство
                            перегородок из гипсокартона устройства тёплого электрического пола, укладка плитки и установка
                            сантехники Дополнительно Высота до потолка 3,4м.
                        </p>

                        <ul className={'row start'}>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                            <li><img src="https://placeimg.com/106/80/arch" alt="" width="106" height="80" loading="lazy"/></li>
                        </ul>

                        <p><span>Сроки и объём</span>50 дней</p>
                        <p><span>Средняя цена</span>90 000р</p>
                        <p><span>Дополнительно</span>Высота до потолка 3,4м</p>
                    </div>
                </div>
            </li>
        </ul>
    )
}