import PublicLayout from "components/public/public-layout";
import {getProfileById} from "libs/static-rest";
import css from "./edit.module.css";

export const getServerSideProps = async ({params, res}) => {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });

    if(fromDB.level === 2) {
        return {
            redirect: {
                destination: `/master/${fromDB.id}/edit/info`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            fromDB
        }
    }
}

const Edit = ({fromDB}) => {
    return (
        <PublicLayout loginName={fromDB.first_name}>
            <main className={`max`}>
                <h1 className={css.h1}>Тут будет профиль пользователя</h1>
            </main>
        </PublicLayout>
    )
}

export default Edit