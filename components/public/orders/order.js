import css from "./order.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';

export const Order = props => {
    const created = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    console.log(props.images)
    return (
        <div className={`row bet ${css.box}`}>
            <div className={`row bet`}>
                <p>{props.title}</p>
                <span>{props.budget}р</span>
            </div>
            <div className={`row start center`}>
                <span>{props.images && props.images.length} фото</span>
                <button>Бесплатный заказ</button>
                <button>Можно позвонить</button>
            </div>
            <p>{props.description}</p>
            <div className={`row bet`}>
                <p>{props.region+', '+props.town}</p>
                <span>{created} назад</span>
            </div>
            {(props.images && props.images.length > 0) && (
                <div className={'row start '+css.gal}>
                    <Gallery>
                        {props.images.map((e, i) => (
                            <Item key={e.id || i}
                                  original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/'+e.name}
                                  thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                  width={e.width}
                                  height={e.height}
                                  title={e.text}
                            >
                                {({ ref, open }) => (
                                    <img
                                        ref={ref}
                                        onClick={open}
                                        src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                        alt={i}
                                        width={120}
                                        height={90}
                                        loading="lazy"
                                    />
                                )}
                            </Item>
                        ))}
                    </Gallery>
                </div>
            )}
        </div>
    )
}