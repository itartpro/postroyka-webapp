import {getCats, getMastersChoices, getPortfolio, getPortfolioImages, getProfileById, getProfileComments} from "libs/static-rest";
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
    const choiceIds = await getMastersChoices(params.id);
    const organizedChoices = {};
    choices.forEach(e => {
        organizedChoices[e.service_id] = e;
    })
    const directIds = choices.reduce((result, e) => {
        if(!e.parent) {
            result.push(e.service_id.toString())
        }
        return result
    }, [])
    const directServices = await getCats('id', directIds);
    const parentIds = [...new Set(directServices.map(e => e.parent_id.toString()))]
    const serviceParents = await getCats('id', parentIds);
    const services = organizeCats([...serviceParents, ...directServices])

    const worksUn = await getPortfolio(params.id)
    const works = {};
    const workServiceIds = [];
    const workIds = [];
    worksUn && worksUn.forEach(e => {
        if(!works.hasOwnProperty(e.service_id)) {
            works[e.service_id] = []
        }
        works[e.service_id].push(e)
        workServiceIds.push(e.service_id.toString());
        workIds.push(e.id.toString());
    });
    //master could've chosen works unrelated to services he put a price on - so need to retrieve these services separately
    const workServices = await getCats('id', workServiceIds);
    const photos = await getPortfolioImages(workIds);

    return {
        props: {
            profile,
            comments,
            services,
            choices: organizedChoices,
            works,
            workServices,
            photos
        }
    }
}

const Master = ({profile, comments, services, choices, works, workServices, photos}) => {

    const fullName = profile.last_name + ' ' + profile.first_name + (profile.paternal_name && ' ' + profile.paternal_name);
    const timeOnSite = timeInRus(timeDiff(Date.parse(profile.created), Date.now()));
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+profile.id+'/ava.jpg';
    const image = profile.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';
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
    const [showSection, setShowSection] = useState(1);

    return (
        <PublicLayout>
            <main className="col start max">
                <br/>
                <div className={'row start'}>
                    <div className={'col start init center '+css.d1}>
                        <img src={image} alt={profile.first_name} width="150" height="150" loading="lazy"/>
                        <StarRating rating={profile.rating || 6.3}/>
                        <p>Отзывов: {(comments && comments.length) || 2}</p>
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
                <div className={css.d3}>
                    {showSection === 1 && (
                        <Info user={profile} services={services} choices={choices}/>
                    )}
                    {showSection === 2 && (
                        <Comments/>
                    )}
                    {showSection === 3 && (
                        <Portfolio user={profile} works={works} workServices={workServices} photos={photos}/>
                    )}
                    <Aside/>
                </div>
                <br/>
                <br/>
            </main>
        </PublicLayout>
    )
}

export default Master