//TODO all of this!
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

const Master = ({profile, comments}) => {
    console.log('profile: ', profile);
    console.log('comments: ', comments);
    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'col start init center '+css.d1}>
                    <img src="/images/silhouette.jpg" alt="Мастер не добавил фото" width="150" height="150" loading="lazy"/>
                    <StarRating rating={7}/>
                    <p>{(comments && comments.length) || 0} отзывов</p>
                </div>
            </main>
        </PublicLayout>
    )
}

export default Master