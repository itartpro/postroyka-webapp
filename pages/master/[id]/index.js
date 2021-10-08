import {getCats, getMastersChoices, getProfileById, getProfileComments} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import css from "./master.module.css";
import {timeDiff, timeInRus} from "libs/time-stuff";
import {organizeCats} from "libs/arrs";
import {useState} from 'react';
import {Aside} from "components/public/master/aside";
import {StarRating} from "components/public/star-rating";
import {Info} from "components/public/master/info";
import {Portfolio} from "components/public/master/portfolio";
import {Comments} from "components/public/master/comments";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    const comments = await getProfileComments(parseInt(params.id));

    const choices = await getMastersChoices(params.id);
    const choiceIds = choices.map(e => e['service_id'])
    const services = await getCats().then(cats => organizeCats(cats)[1].children.map(e => ({
        id: e.id,
        parent_id: e.parent_id,
        name: e.name,
        children: e.children.map(c => ({
            id: c.id,
            parent_id: c.parent_id,
            name: c.name,
            children: c.children.map(c2 => ({
                id: c2.id,
                parent_id: c2.parent_id,
                name: c2.name,
                extra: c2.extra
            }))
        }))
    })));

    const filtered = [];
    if(services && choiceIds) {
        services.forEach((e,i) => e.children.forEach(e2 => {
            if(choiceIds.includes(e2.id)) {
                if(!filtered.hasOwnProperty(i)) {
                    filtered[i] = e;
                    filtered[i].children = [];
                }
                filtered[i].children.push(e2)
            }
        }))
    }

    const organizedChoices = {};
    choices.forEach(e => {
        organizedChoices[e.service_id] = e;
    })

    return {
        props: {
            profile,
            comments,
            services: filtered,
            choices: organizedChoices
        }
    }
}

const Master = ({profile, comments, services, choices}) => {
    const fullName = profile.last_name + ' ' + profile.first_name + (profile.paternal_name && ' ' + profile.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(profile.created), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'masters/'+profile.id+'/ava.jpg';
    const image = profile.avatar && masterAva || '/images/silhouette.jpg';
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
        case 1:
            company = 'мастер работает один';
            break;
        case 2:
            company = 'бригада 3-4 человека';
            break;
        case 3:
            legal = 'бригада 5-20 человека';
            break;
        case 4:
            legal = 'бригада более 20 человек';
            break;
        default:
            company = 'мастер работает один';
            break;
    }
    const [showSection, setShowSection] = useState(1)

    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'row start'}>
                    <div className={'col start init center '+css.d1}>
                        {image && <img src={image} alt={profile.first_name} width="150" height="150" loading="lazy"/>}
                        <StarRating rating={profile.rating}/>
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
                <div className="row">
                    {showSection === 1 && (
                        <Info user={profile} services={services} choices={choices}/>
                    )}
                    {showSection === 2 && (
                        <section>
                            <Comments/>
                        </section>
                    )}
                    {showSection === 3 && (
                        <Portfolio user={profile}/>
                    )}
                    <Aside/>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Master