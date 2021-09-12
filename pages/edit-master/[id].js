import PublicLayout from "components/public/public-layout";
import {useState} from 'react';
import css from "./edit.module.css";
import {getProfileById, getProfileComments} from "../../libs/static-rest";
import Master from "../master/[id]";
import Link from 'next/link'

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

const EditMaster = ({profile}) => {
    console.log(profile);
    const [showSection, setShowSection] = useState(1)

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