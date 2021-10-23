import css from "./star.module.css";

export const Star = ({rating = 0}) => {

    return (
        <p className={css.star}>
            <span style={{width: `${rating}%`}}/>
        </p>
    )
}