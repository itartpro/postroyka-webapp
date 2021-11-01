import css from "./master.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from 'next/link';

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';

export const Master = props => {

    const fullName = props.last_name + ' ' + props.first_name + (props.paternal_name && ' ' + props.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/mini/ava.jpg';
    const image = props.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';

    const photos = [];
    if(props.portfolio) {
        const set = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]}
        const imageIds = [];
        const fillSet = set => {
            props.portfolio.forEach((album, i) => {
                for(let image of album) {
                    if(!imageIds.includes(image.id)) {
                        imageIds.push(image.id);
                        set[i].push(image);
                        break;
                    }
                }
            });
            if(imageIds.length < 6) fillSet(set);
        }

        fillSet(set);
        for(let i in set) {
            if(set[i].length > 0) {
                set[i].forEach(e => photos.push(e))
            }
        }
    }

    return (
        <div className={css.master}>
            <div className={css.nfo}>
                <Link href={`/master/${props.id}`}>
                    <a className="row center">
                        <img src={image} alt={props.first_name} width="76" height="76" loading="lazy"/>
                        <b>{fullName}</b>
                    </a>
                </Link>
                <button>Предложить заказ</button>
            </div>

            <ul>
                <li>
                    <p>Премиальный ремонт дома под ключ</p>
                    <b>от 6 000р / м²</b>
                </li>
            </ul>

            <div className={`row start ${css.gray}`}>
                <p>На сайте {timeOnSite}</p>
                <p>Был 1 год 8 месяцев назад</p>
            </div>

            <div className={css.text}>
                <pre>{props.about}</pre>
                <button>Развернуть</button>
            </div>

            {photos.length > 0 && (
                <div className={'row start '+css.gal}>
                    <Gallery>
                        {photos.map((e, i) => (
                            <Item key={e.id || i}
                                  original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/2/work/'+e.album_id+'/'+e.name}
                                  thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/2/work/'+e.album_id+'/mini/'+e.name}
                                  width={e.width}
                                  height={e.height}
                                  title={e.text}
                            >
                                {({ ref, open }) => (
                                    <img
                                        ref={ref}
                                        onClick={open}
                                        src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/2/work/'+e.album_id+'/mini/'+e.name}
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

            <div>
                <b>Последний отзыв</b>
                <p>
                    Комплексные ремонтные работы под ключ или отдельные виды работ. Ремонтно-отделочные
                    работы
                    любой сложности. Индивидуальный подход к каждому клиенту.
                    Работы под ключ или отдельные виды работ. Ремонтно-отделочные работы любой сложности.
                    Индивидуальный подход к каждому клиенту.
                </p>
            </div>
            <div className={css.vo}>
                <p><a>Аделина</a>, Апрель 2021, по заказу <a>Сделать потолки в 3х комнатах</a></p>
            </div>
        </div>
    )
}