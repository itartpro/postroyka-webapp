import {getProfileById, getProfileComments} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import css from "./master.module.css";
import StarRating from "components/public/star-rating";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id));
    const comments = await getProfileComments(parseInt(params.id));
    delete profile['password'];
    delete profile['refresh'];

    return {
        props: {
            profile,
            comments
        }
    }
}

const timeDifference = (olderStamp, newerStamp) => {
    const diffTime = Math.abs(olderStamp - newerStamp);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    let timeOnSite = null;
    if(diffDays < 2) timeOnSite = diffDays + ' день';
    if(diffDays > 1 && diffDays < 4) timeOnSite = diffDays + ' дня';
    if(diffDays > 4 && diffDays < 31) timeOnSite = diffDays + ' дней';
    if(diffDays > 31 && diffDays < 120) timeOnSite = diffMonths + ' месяца';
    if(diffDays > 120 && diffDays < 365) timeOnSite = diffMonths + ' месяцев';
    if(diffDays > 365) {
        let years = Math.floor(diffDays / 365)
        if(years < 2) timeOnSite = '1 год';
        if(years > 1 && years < 4) timeOnSite = years + ' года';
        if(years > 4) timeOnSite = years + ' лет';
        let months = Math.floor((diffDays - years * 365) / 30);
        if(months > 0 && months < 2) timeOnSite += ' и 1 месяц';
        if(months > 2 && months < 4) timeOnSite += ', '+months+' месяца';
        if(months > 4) timeOnSite += ', '+months+' месяцев';
    }
    return timeOnSite
}

const Master = ({profile, comments}) => {
    console.log('profile: ', profile);
    const fullName = profile.last_name + ' ' + profile.first_name + ' ' + profile.paternal_name;
    const timeOnSite = timeDifference(Date.parse(profile.created), Date.now())
    let legal = null;
    let company = null;
    switch(profile.legal) {
        case 1:
            legal = 'Частный мастер'
            break;
        case 2:
            legal = 'ИП'
            break;
        case 3:
            legal = 'Юридическое лицо'
            break;
        default:
            break;
    }
    switch(profile.company) {
        case 2:
            company = 'бригада 3-4 человека'
            break;
        case 3:
            legal = 'бригада 5-20 человека'
            break;
        case 4:
            legal = 'бригада более 20 человек'
            break;
        default:
            break;
    }

    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'row start'}>
                    <div className={'col start init center '+css.d1}>
                        <img src="/images/silhouette.jpg" alt="Мастер не добавил фото" width="150" height="150" loading="lazy"/>
                        <StarRating rating={7}/>
                        <p>{(comments && comments.length) || 0} отзывов</p>
                    </div>
                    <div className={'col start init '+css.d2}>
                        <h1>{fullName}</h1>
                        <p><span>На сайте {timeOnSite}</span></p>
                        <p>{legal}{company && ', '+company}</p>
                        <button>Предложить заказ</button>
                    </div>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Master