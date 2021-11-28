import {timeDiff, timeInRus} from "libs/time-stuff";
import css from "./offer.module.css";
import Link from "next/link";

export const Offer = ({offer, master}) => {
    console.log(offer);
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
                <p>{offer.description}</p>
                <p><b>Цена за работу:</b><span>{offer.price}</span></p>
                <p><b>Дата и условия выезда:</b><span>{offer.meeting}</span></p>
            </div>
        </div>
    )
}