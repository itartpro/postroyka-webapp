import PublicLayout from 'components/public/public-layout';
import {getProfileById} from 'libs/static-rest';
import css from './profile.module.css';

export async function getServerSideProps({params}) {
    const user = await getProfileById(parseInt(params.id));
    if (!user) {return {notFound: true}}

    const page = {
        "title":`${user.first_name} ${user.last_name} - профиль на art.people!`,
        "description":`${user.first_name} ${user.last_name} - профиль на art.people!`,
        "keywords":`${user.first_name} ${user.last_name}`
    }

    return {
        props: {user, page}
    }
}

export default function Profile({user, page}) {

    return (
        <PublicLayout user={user} page={page}>
            <img
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}profiles/${user.id}/bigava.jpg`}
                alt={user.first_name}
                width="152"
                height="152"
                loading="lazy"
                onError={e => {
                    e.target.onError = null;
                    e.target.src = '/images/logo.png'
                }}
            />
        </PublicLayout>
    )
}