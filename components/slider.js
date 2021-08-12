import { useKeenSlider } from 'keen-slider/react'
import {useRef, useEffect, useState} from 'react'
import 'keen-slider/keen-slider.min.css'
import css from './slider.module.css'

export default function Slider({children, reportSlide, duration, timeout, autoplay, className, style, dots, links, arrows, controls}) {

    //slider stuff
    const [currentSlide, setCurrentSlide] = useState(0)
    const [pause, setPause] = useState(false);
    const timer = useRef();
    const [sliderRef, slider] = useKeenSlider({
        afterChange(s) {
            setCurrentSlide(s.details().relativeSlide)
        },
        loop: true,
        duration,
        controls,
        dragStart: () => setPause(true),
        dragEnd: () => setPause(false)
    });

    useEffect(() => reportSlide(currentSlide), [currentSlide])

    useEffect(() => {
        if(!autoplay) return false;
        sliderRef.current.addEventListener("mouseover", () => setPause(true));
        sliderRef.current.addEventListener("mouseout", () => setPause(false))
    }, [sliderRef])

    useEffect(() => {
        if(!autoplay) return false;
        timer.current = setInterval(() => {
            if (!pause && slider) {
                slider.next()
            }
        }, timeout);
        return () => clearInterval(timer.current);
    }, [pause, slider])

    return (
        <>
            {slider && links && (
                <div className={css.links}>
                    <div>
                        {[...Array(slider.details().size).keys()].map((idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        slider.moveToSlideRelative(idx)
                                    }}
                                    className={css.link + (currentSlide === idx ? " " + css.active : "")}
                                >{links[idx]}</button>
                            )
                        })}
                    </div>
                </div>
            )}
            <div className={css.wrap}>
                <div className={className} style={style} ref={sliderRef}>
                    {children}
                </div>
                {slider && arrows && (
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
            </div>
            {slider && dots && (
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
        </>
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