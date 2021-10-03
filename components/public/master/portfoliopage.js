import css from './portfoliopage.module.css';
import {FiChevronDown} from "react-icons/fi";

export const PortfolioPage = props => {
    return (

        <aside className={`col start`}>
            <div className={`row bet center ${css.zgl}`}>
                <b>Премиальный ремонт дома под ключ</b>
                <span> <FiChevronDown/> </span>
            </div>
            <div className={`row bet center ${css.zgl}`}>
                <b>Премиальный ремонт дома под ключ</b>
                <span> <FiChevronDown/> </span>
            </div>
            <div className={`row bet center ${css.zgl}`}>
                <b>Премиальный ремонт дома под ключ</b>
                <span> <FiChevronDown/> </span>
            </div>

            <section className={`col start ${css.left2}`}>
                <b>Ремонт ванной и туалета в сталинки</b>
                <p>Сроки и объем 50 дней Средняя цена 90000руб. Перечень работ Демонтаж перегородок из дранки, замена
                    всех стояков, устройство стяжки, разводка водопровода, канализации и электрики, устройство
                    перегородок из гипсокартона устройства тёплого электрического пола, укладка плитки и установка
                    сантехники Дополнительно Высота до потолка 3,4м.
                </p>
                <p>Развернуть</p>

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


            </section>

        </aside>
    )
}