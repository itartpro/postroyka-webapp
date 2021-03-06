import css from "./master.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from 'next/link';

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';

export const Master = props => {

    const fullName = props.last_name + ' ' + props.first_name + (props.paternal_name && ' ' + props.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(props.created), Date.now()));
    const lastOnline = timeInRus(timeDiff(Date.parse(props.last_online), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/mini/ava.jpg';
    const image = props.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';

    const photos = [];
    const imageIds = [];
    const set = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]};
    let limit = 0;
    let albumRounds = 0;
    let totalImages = 0;
    if(props.portfolio && props.portfolio.length > 0) {
        props.portfolio.forEach(album => totalImages += album.length);
        const fillSet = (set, imageIds, limit, totalImages, albumRounds) => {
            props.portfolio.forEach((album, i) => {
                for(let image of album) {
                    if(!imageIds.includes(image.id) && limit < 6) {
                        imageIds.push(image.id);
                        set[i].push(image);
                        limit++;
                        break;
                    }
                }
            });

            albumRounds++

            if(limit <= totalImages && limit < 6 && albumRounds < 6) {
                return fillSet(set, imageIds, limit, totalImages, albumRounds);
            }
        }

        fillSet(set, imageIds, limit, totalImages, albumRounds);
        for(let i in set) {
            if(set[i].length > 0) {
                set[i].forEach(e => photos.push(e))
            }
        }
    }

    const expandAbove = e => {
        const bro = e.target.previousElementSibling;
        if(!bro.hasAttribute('style')) {
            bro.setAttribute('style', 'max-height: 1200px');
            e.target.innerHTML = '????????????????'
        } else {
            bro.removeAttribute('style');
            e.target.innerHTML = '????????????????????'
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
                <button>???????????????????? ??????????</button>
            </div>

            <ul>
                {props.choices && props.choices.map(e => {
                    if(e.price > 0) {
                        return (
                            <li key={e.id}>
                                <p>{props.service.name}</p>
                                <b>{e.price}?? / {props.service.extra}</b>
                            </li>
                        )
                    }
                })}
            </ul>

            <div className={`row start ${css.gray}`}>
                <p>???? ?????????? {timeOnSite}</p>
                <p>?????? {lastOnline} ??????????</p>
            </div>

            {props.about !== "" && (
                <div className={css.text}>
                    <pre>{props.about}</pre>
                    <button onClick={expandAbove}>????????????????????</button>
                </div>
            )}

            {photos.length > 0 && (
                <div className={'row start '+css.gal}>
                    <Gallery>
                        {photos.map((e, i) => (
                            <Item key={e.id || i}
                                  original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/work/'+e.album_id+'/'+e.name}
                                  thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/work/'+e.album_id+'/mini/'+e.name}
                                  width={e.width}
                                  height={e.height}
                                  title={e.text}
                            >
                                {({ ref, open }) => (
                                    <img
                                        ref={ref}
                                        onClick={open}
                                        src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+props.id+'/work/'+e.album_id+'/mini/'+e.name}
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
                <b>?????????????????? ??????????</b>
                <p>
                    ?????????????????????? ?????????????????? ???????????? ?????? ???????? ?????? ?????????????????? ???????? ??????????. ????????????????-????????????????????
                    ????????????
                    ?????????? ??????????????????. ???????????????????????????? ???????????? ?? ?????????????? ??????????????.
                    ???????????? ?????? ???????? ?????? ?????????????????? ???????? ??????????. ????????????????-???????????????????? ???????????? ?????????? ??????????????????.
                    ???????????????????????????? ???????????? ?? ?????????????? ??????????????.
                </p>
            </div>
            <div className={css.vo}>
                <p><a>??????????????</a>, ???????????? 2021, ???? ???????????? <a>?????????????? ?????????????? ?? 3?? ????????????????</a></p>
            </div>
        </div>
    )
}