import css from './hero.module.css';
import { useKeenSlider } from 'keen-slider/react'
import {useState, useRef, useEffect} from 'react';

export const Hero = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = useRef([]);
    const timer = useRef();

    const [sliderRef, slider] = useKeenSlider({
        slides: 3,
        loop: true,
        duration: 500,
        afterChange(s) {
            setCurrentSlide(s.details().relativeSlide)
        }
    })

    useEffect(() => {
        timer.current = setInterval(() => slider && slider.next(), 4000);
        return () => clearInterval(timer.current);
    }, [slider]);

    useEffect(() => {
        slides.current.forEach(e => e.classList.remove(css.show));
        slides.current[currentSlide].classList.add(css.show);
    }, [currentSlide])

    return (
        <div className="col start max rel">
            <div className={css.d2}>
                <h1>Найдите мастера под Ваши работы</h1>
                <div className={`row bet`}>
                    <p>Мастеров онлайн: <span>312</span></p>
                    <p>Заказов в неделю: <span>1 714</span></p>
                    <p>Предложений в сутки: <span>615</span></p>
                </div>
                <form>
                    <input type="text" placeholder="Что требуется сделать?"/>
                    <input type="submit" value="Найти мастера"/>
                </form>
            </div>
            <div className={css.wrap}>
                <div ref={sliderRef} className={css.d1}>
                    <div key={0} className={'row bet '+css.show} ref={el => slides.current[0] = el}>
                        <div className="col start">
                            <b>С нами легко</b>
                            <p>Услуги строительных компаний помогут вам построить дом с нуля или преобразить свое жилище в точно оговоренные сроки</p>
                        </div>
                        <img src="/images/home/people1.png" alt="построить дом" width="365" height="300" loading="lazy"/>
                    </div>
                    <div key={1} className={'row bet'} ref={el => slides.current[1] = el}>
                        <div className="col start">
                            <b>Большой спектр услуг</b>
                            <p>Услуги строительных компаний помогут вам построить дом с нуля или преобразить свое жилище в точно оговоренные сроки</p>
                        </div>
                        <img src="/images/home/people2.png" alt="найти работу" width="366" height="299" loading="lazy"/>
                    </div>
                    <div key={2} className={'row bet'} ref={el => slides.current[2] = el}>
                        <div className="col start">
                            <b>Абсолютно безопасно</b>
                            <p>Выберите мастера по выгодной цене или отзывам. Мы не скрываем негативные отзывы и проверяем каждый из них.</p>
                        </div>
                        <img src="/images/home/people3.png" alt="Выбрать мастера" width="366" height="299" loading="lazy"/>
                    </div>
                </div>
                {slider  && (
                    <div className={'row center bet '+css.arr}>
                        <ArrowLeft
                            onClick={(e) => e.stopPropagation() || slider.prev()}
                            disabled={currentSlide === 0}
                        />
                        <span>{currentSlide + 1}</span>
                        <span>/</span>
                        <span>3</span>
                        <ArrowRight
                            onClick={(e) => e.stopPropagation() || slider.next()}
                            disabled={currentSlide === slider.details().size - 1}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

const ArrowLeft = props => {
    const disabeld = props.disabled ? css.arrow_disabled : ""
    return (
        <svg
            onClick={props.onClick}
            className={css.arrow + ' ' + css.arrow_left + ' ' + disabeld}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </svg>
    )
}

const ArrowRight = props => {
    const disabeld = props.disabled ? css.arrow_disabled : ""
    return (
        <svg
            onClick={props.onClick}
            className={css.arrow + ' ' + css.arrow_right + ' ' + disabeld}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
        </svg>
    )
}