import {timeDiff, timeInRus} from "libs/time-stuff";
import css from "./offer.module.css";
import Link from "next/link";
import {useState} from "react";
import {isoToLocale} from "libs/js-time-to-psql";
import {BsChat, BsTrash} from "react-icons/bs";
import {useRouter} from "next/router";

export const Offer = ({offer, master}) => {
    const fullName = master.last_name + ' ' + master.first_name + (master.paternal_name && ' ' + master.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(master.created), Date.now()));
    const lastOnline = timeInRus(timeDiff(Date.parse(master.last_online), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+master.id+'/ava.jpg';
    const image = master.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';
    let location = (master.region_name && master.town_name) ? master.region_name + ", " + master.town_name : null;
    let company = null;
    switch(master.company) {
        case 1:
            company = 'мастер работает один';
            break;
        case 2:
            company = 'бригада 3-4 человека';
            break;
        case 3:
            company = 'бригада 5-20 человека';
            break;
        case 4:
            company = 'бригада более 20 человек';
            break;
        default:
            company = 'мастер работает один';
            break;
    }
    const [showSection, setShowSection] = useState(1);
    const startChat = () => {
        const router = useRouter();
        return router.push('/chat?offer='+offer.id)
    }

    return (
        <div className={css.offer}>
            <div className={css.d1}>
                <Link href={`/master/${master.id}`}>
                    <img src={image} alt={master.first_name} width="150" height="150" loading="lazy"/>
                </Link>
                <b>{fullName}</b>
                {location && <b>{location}</b>}
                <p className={css.comp}>{company}</p>
                <p>На сайте {timeOnSite}</p>
                <p>Был {lastOnline} назад</p>
            </div>
            <div className={css.d2}>
                <div className={`row start ${css.tabs}`}>
                    <button onClick={() => setShowSection(1)} className={showSection === 1 ? css.on : null}>Предложение</button>
                    <button onClick={() => setShowSection(2)} className={showSection === 2 ? css.on : null}>Об исполнителе</button>
                    <button onClick={() => setShowSection(3)} className={showSection === 3 ? css.on : null}>Отзывы</button>
                </div>
                {showSection === 1 && (
                <div className={css.d3}>
                    <p>{offer.description}</p>
                    <p><b>Цена за работу:</b><span>{offer.price}</span></p>
                    <p><b>Дата и условия выезда:</b><span>{offer.meeting}</span></p>
                    <p><b>Время предложения:</b><span>{isoToLocale(offer.created)}</span></p>
                </div>
                )}
                {showSection === 2 && (
                    <div className={css.d3}>
                        <pre>{master.about}</pre>
                    </div>
                )}
                {showSection === 3 && (
                    <div className={css.d3}>
                        <p>тут будет отзыв</p>
                    </div>
                )}
                <div className={`row bet ${css.actions}`}>
                    <button onClick={startChat}><BsChat/> Написать</button>
                    <button><BsTrash/> Нет, спасибо</button>
                </div>
            </div>
        </div>
    )
}