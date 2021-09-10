import {BsStarFill, BsStarHalf} from 'react-icons/bs';
import css from './star-rating.module.css';

const StarRating = ({rating = 0}) => {

    const outOf = 10;
    const stars = Math.round((rating / outOf * 5) * 2)/2;
    const fullStars = Math.floor(stars);
    const half = stars - fullStars;
    const starsArr = new Array(fullStars).fill(null);

    return (
        <div className={css.d1}>
            {starsArr.length > 0 && starsArr.map((e, i) => (
                <span key={i}><BsStarFill/></span>
            ))}
            {half > 0 && <span><BsStarHalf/></span>}
            {rating > 0 && <p>{rating}</p>}
        </div>
    )
}

export default StarRating