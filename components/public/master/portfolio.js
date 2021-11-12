import css from './portfolio.module.css';
import {FiChevronUp} from "react-icons/fi";
import {toggleDown} from "libs/sfx";

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';

export const Portfolio = ({user, works, workServices, photos}) => {

    return (
        <ul className={`col start ${css.left}`}>
            {workServices && workServices.map(s => (
                <li key={'ws'+s.id}>
                    <a className={`row bet center`} role="button" onClick={toggleDown}>
                        <b>{s.name}</b>
                        <FiChevronUp/>
                    </a>
                    <div>
                        {works[s.id].map(e => (
                            <div key={'w'+e.id} className={`col start ${css.d1}`}>
                                <b>{e.name}</b>
                                <p>{e.description}</p>
                                {photos[e.id] && (
                                    <div className={'row start '+css.gal}>
                                        <Gallery>
                                            {photos[e.id].map((e, i) => (
                                                <Item key={e.id || i}
                                                      original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+user.id+'/work/'+e.album_id+'/'+e.name}
                                                      thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+user.id+'/work/'+e.album_id+'/mini/'+e.name}
                                                      width={e.width}
                                                      height={e.height}
                                                      title={e.text}
                                                >
                                                    {({ ref, open }) => (
                                                        <img
                                                            ref={ref}
                                                            onClick={open}
                                                            src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+user.id+'/work/'+e.album_id+'/mini/'+e.name}
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
                                <p><span>Сроки и объём</span>{e.volume}</p>
                                <p><span>Средняя цена</span>{e.price}</p>
                            </div>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    )
}