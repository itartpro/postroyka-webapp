import PublicLayout from "components/public/public-layout";
import {getProfileById} from "libs/static-rest";
import css from "./edit.module.css";

export const getServerSideProps = async ({params, res}) => {
    const fromDB = await getProfileById(parseInt(params.id)).then(e => {
        delete e['password'];
        delete e['refresh'];
        return e;
    });
    if (fromDB.level !== 1) {
        return {
            notFound: true
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
                <h1 className={css.h1}>Тут можно будет редактировать профиль</h1>
            </main>
        </PublicLayout>
    )
}

export default Edit