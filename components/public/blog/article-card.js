import css from './article-card.module.css'
import {isoToRusDate} from 'libs/js-time-to-psql'
import Link from 'next/link'

export default function ArticleCard(props) {
    return (
        <li className={css.li}>
            <Link href={`/blog/article/${props.slug}`}>
                <a>
                    {props.image.length > 0 && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/uploads/cats/${props.id}/${props.image}`}
                            alt={props.name}
                            width={320}
                            height={200}
                            loading="lazy"
                        />
                    )}
                </a>
            </Link>
            <span>{props.name}</span>
            <span>{isoToRusDate(props.created_at)}</span>
        </li>
    )
}