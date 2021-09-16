import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import {getProfileById} from "libs/static-rest";
import Link from 'next/link'
import InputUpload from "../../components/input-upload";
import UploadProvider from "../../context/UploadProvider";

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
                <div className="row bet">
                    <img src="/images/silhouette.jpg" alt="Мастер не добавил фото" width="150" height="150" loading="lazy"/>
                    <p>Фото профиля не заполнено.</p>
                    <UploadProvider
                        chunkSize={1048576}
                        allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                        address={'gpics:50001'}
                        action={'process'}
                        instructions={{
                            folder: 'masters/' + profile.id,
                            width: 150,
                            height: 150,
                            fit: 'Fill', //Fit or Fill (with crop)
                            position: 'Center',
                            new_name: 'ava',
                            table: '',
                            album_id: profile.id,
                            copy:{
                                folder:'masters/' + profile.id + '/mini',
                                height:70,
                                width:70
                            }
                        }}>
                        <InputUpload multiple={false}/>
                    </UploadProvider>
                </div>
            </main>
        </PublicLayout>
    )
}

export default EditMaster