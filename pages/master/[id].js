import {getProfileById, getProfileComments} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import css from "./master.module.css";
import StarRating from "components/public/star-rating";
import {timeDiff, timeInRus} from "libs/time-stuff";
import {useState} from 'react';

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

const Master = ({profile, comments}) => {
    const fullName = profile.last_name + ' ' + profile.first_name + ' ' + profile.paternal_name;
    const timeOnSite = timeInRus(timeDiff(Date.parse(profile.created), Date.now()));
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
    const [showSection, setShowSection] = useState(1)

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
                <div className={'row start '+css.tabs}>
                    <button onClick={() => setShowSection(1)} className={showSection === 1 ? css.on : null}>Информация</button>
                    <button onClick={() => setShowSection(2)} className={showSection === 2 ? css.on : null}>Отзывы</button>
                    <button onClick={() => setShowSection(3)} className={showSection === 3 ? css.on : null}>Портфолио</button>
                </div>
                {showSection === 1 && (
                    <section>
                        <b>Об исполнителе</b>
                        <p>{profile.about}</p>
                    </section>
                )}
                {showSection === 2 && (
                    <section>
                        <b>Отзывы</b>
                    </section>
                )}
                {showSection === 3 && (
                    <section>
                        <b>Портфолио</b>
                    </section>
                )}
            </main>
        </PublicLayout>
    )
}

export default Master