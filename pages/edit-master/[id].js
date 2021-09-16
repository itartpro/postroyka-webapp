import PublicLayout from "components/public/public-layout";
import css from "./edit.module.css";
import {getProfileById} from "libs/static-rest";
import Link from 'next/link'
import InputUpload from "components/input-upload";
import UploadProvider from "context/UploadProvider";
import {useContext, useEffect, useState} from "react";
import {WsContext} from "context/WsProvider";

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
    const {wsMsg, request} = useContext(WsContext);
    const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'masters/'+profile.id+'/ava.jpg';
    const initAva = profile.avatar && masterAva || '/images/silhouette.jpg';
    const [image, setImage] = useState(null);
    useEffect(() => setImage(initAva + '?' + Date.now()), []);

    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type === "info") {
            if(wsMsg.data.substr(9, 5) === "gpics") {
                const res = JSON.parse(wsMsg.data);
                if(res.status && res.data.name !== "") {
                    setImage(masterAva);
                    const goData = {
                        address: 'auth:50003',
                        action: 'update-cell',
                        instructions: JSON.stringify({
                            id: profile.id,
                            column: "avatar",
                            value: "true"
                        })
                    };
                    request(JSON.stringify(goData));
                    setImage(masterAva + '?' + Date.now())
                }
            }
        } else {
            console.log(wsMsg.data)
        }
    }, [wsMsg])

    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <div className={'row start '+css.tabs}>
                    <a className={css.on}>Информация</a>
                    <Link href={'/edit-portfolio/'+profile.id}><a>Портфолио</a></Link>
                </div>
                <div className="row bet">
                    {image && <img src={image} alt={profile.first_name} width="150" height="150" loading="lazy"/>}
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
                            position: 'Top',
                            new_name: 'ava',
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