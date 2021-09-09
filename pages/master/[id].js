import {getProfileById} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import css from "./master.module.css";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id));
    delete profile['password'];
    delete profile['refresh'];

    return {
        props: {
            profile
        }
    }
}

const Master = ({profile}) => {
    console.log('profile: ', profile);
    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'col start init center '+css.d1}>
                    <img src="/images/silhouette.jpg" alt="Мастер не добавил фото" width="150" height="150" loading="lazy"/>
                    
                </div>
            </main>
        </PublicLayout>
    )
}

export default Master