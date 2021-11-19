import {getProfileById} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import {timeDiff, timeInRus} from "libs/time-stuff";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });

    return {
        props: {
            profile
        }
    }
}

const Profile = ({profile}) => {

    const timeOnSite = timeInRus(timeDiff(Date.parse(profile.created), Date.now()));

    return (
        <PublicLayout>
            <main className="col start max">
                <br/>
                <header><h1>{profile.first_name}</h1></header>
                <p>Заказчик</p>
                <p>На сайте {timeOnSite}</p>
                <br/>
                <div>
                    <b>Заказы и отзывы</b>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Profile