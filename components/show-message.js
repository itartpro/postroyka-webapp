import css from './show-message.module.css'
import {useEffect} from 'react'

export const ShowMessage = ({text, color, clear, timer = 0}) => {

    const showColor = () => color === "red" ? css.red : css.green;

    const clearMessage = () => clear(null);

    useEffect(() => {
        if(!text || timer === 0) return false;
        setTimeout(() => clearMessage(), timer)
    }, [text])

    return (
        <div className={showColor() + ' ' + css.d1}>
            <p>{text}</p>
            <span onClick={clearMessage}>&#10006;</span>
        </div>
    )
}