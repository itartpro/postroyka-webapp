import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Comment from 'components/public/comment'
import {useState, useRef, useEffect} from 'react'
import css from 'components/slider.module.css'
import css2 from './comments.module.css'

const Comments = () => {

    const [currentSlide, setCurrentSlide] = useState(0)
    const [pause, setPause] = useState(false);
    const timer = useRef();
    const [sliderRef, slider] = useKeenSlider({
        afterChange(s) {
            setCurrentSlide(s.details().relativeSlide)
        },
        slidesPerView: 3,
        spacing: 30,
        loop: true,
        controls: true,
        mode: "snap",
        breakpoints: {
            "(max-width: 960px)": {
                slidesPerView: 2,
                mode: "free-snap"
            },
            "(max-width: 600px)": {
                spacing: 0,
                slidesPerView: 1,
                mode: "free-snap",
                center: true,
                loop: true
            }
        }
    });

    useEffect(() => {
        sliderRef.current.addEventListener("mouseover", () => setPause(true));
        sliderRef.current.addEventListener("mouseout", () => setPause(false))
    }, [sliderRef])

    useEffect(() => {
        timer.current = setInterval(() => !pause && slider && slider.next(), 3000);
        return () => clearInterval(timer.current);
    }, [pause, slider]);

    return (
        <div className={'max '+css2.wrap}>
            <div ref={sliderRef} className="keen-slider">
                <div key={1} className="keen-slider__slide"><Comment/></div>
                <div key={2} className="keen-slider__slide"><Comment/></div>
                <div key={3} className="keen-slider__slide"><Comment/></div>
                <div key={4} className="keen-slider__slide"><Comment/></div>
                <div key={5} className="keen-slider__slide"><Comment/></div>
                <div key={6} className="keen-slider__slide"><Comment/></div>
            </div>
            {slider  && (
                <>
                    <ArrowLeft
                        onClick={(e) => e.stopPropagation() || slider.prev()}
                        disabled={currentSlide === 0}
                    />
                    <ArrowRight
                        onClick={(e) => e.stopPropagation() || slider.next()}
                        disabled={currentSlide === slider.details().size - 1}
                    />
                </>
            )}
            {slider  && (
                <div className={css.dots}>
                    {[...Array(slider.details().size).keys()].map((idx) => {
                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    slider.moveToSlideRelative(idx)
                                }}
                                className={css.dot + (currentSlide === idx ? " " + css.active : "")}
                            />
                        )
                    })}
                </div>
            )}
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

export default Comments