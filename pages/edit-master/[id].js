import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import {getProfileById} from "libs/static-rest";
import Link from 'next/link'

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

const EditMaster = ({profile}) => {
    console.log(profile);

    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <a className={css.on}>Информация</a>
                    <Link href={'/edit-portfolio/'+profile.id}><a>Портфолио</a></Link>
                </div>
            </main>
        </PublicLayout>
    )
}

export default EditMaster