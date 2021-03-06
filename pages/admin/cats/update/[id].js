import AdminLayout from 'components/admin/admin-layout'
import css from '../../form.module.css'
import {useState, useContext, useEffect, useRef} from 'react'
import {WsContext} from 'context/WsProvider'
import {translit, slugify} from 'libs/slugify'
import {useRouter} from 'next/router'
import {nowToISO, isoToRusDate, rusDateToIso} from 'libs/js-time-to-psql'
import {FaAngleDown, FaInfoCircle, FaCheck} from 'react-icons/fa'
import Link from 'next/link'
import {toggleDown} from 'libs/sfx'
import {UploadProvider} from 'context/UploadProvider'
import {InputUpload} from 'components/input-upload'
import dynamic from 'next/dynamic'
import { useForm } from "react-hook-form";

export default function Update() {
    const router = useRouter();
    const urlId = parseInt(router.query.id);
    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const [imageCache, setImageCache] = useState(Date.now);
    const [dbData, setDbData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if(rs !== 1 || !urlId) return false;
        const goData = {
            address: 'cats:50004',
            action: 'read',
            instructions: JSON.stringify({id:urlId})
        };
        request(JSON.stringify(goData))
    }, [rs, urlId]);

    //this is for some expandable fields to be expanded on default
    const simulateClick = e => {
        if(!e) return false;
        if(!e.nextElementSibling.hasAttribute('style')) e.click();
    }


    const count = e => {
        e.preventDefault();
        const t = e.target;
        const counter = t.previousSibling.querySelector('.count');
        if(counter) counter.innerHTML = '['+ t.value.length +']' || '';
    }

    const Wysiwyg = dynamic(
        () => import('components/admin/wysiwyg'),
        { ssr: false }
    );
    let text = useRef('');
    const appendContent = textFromSunEditor => text.current = textFromSunEditor

    const checkForm = formData => {
        const form = {...dbData, ...formData};
        form.name = formData.name || dbData.name;
        if(!form.name) {
            return setWsMsg({type: 'alert:red', data: `???????????????????? ?????????????????? ???????? "????????????????"`});
        }
        form.image = dbData.image;
        form.text = text.current;
        if(form.sort_order) form.sort_order = parseInt(form.sort_order);
        return saveData(form)
    }

    const saveData = data => {
        const checked = {...dbData, ...data};
        checked.slug = slugify(translit(checked.slug || checked.name));
        const rusDate = checked.created_at;
        checked.created_at = rusDateToIso(rusDate) || nowToISO();
        const goData = {
            address: 'cats:50004',
            action: 'update',
            instructions: JSON.stringify(checked)
        };
        return request(JSON.stringify(goData));
    }

    const autoFill = () => {
        if (!dbData.name) return setWsMsg({type: 'alert:red', data: `???????????????????? ?????????????????? ???????? "????????????????"`});
        if (dbData.slug) dbData.slug = slugify(translit(dbData.slug));
        if (!dbData.slug) dbData.slug = slugify(translit(dbData.name));
        if (!dbData.title) dbData.title = dbData.name;
        if (!dbData.description) dbData.description = dbData.name;
        if (!dbData.keywords) dbData.keywords = dbData.name;
        if (!dbData.h1) dbData.h1 = dbData.name;

        setDbData({...dbData});
    }

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if (wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if (!res.status) return setWsMsg({type: 'alert:red', data: res.data});
        if (res.name === "gpics") {
            setImageCache(Date.now());
            if (dbData.image === res.data.name) return true;
            if(res.data.name && res.data.name.split(".")[0] === urlId.toString()) {
                dbData.image = res.data.name;
                setDbData({...dbData});
                return saveData({image: res.data.name})
            }
        }
        if(typeof res.data === 'string' && res.data === "updated successfully") {
            setShowSuccess(true);
            return setTimeout(() => setShowSuccess(false), 2000)
        }
        if(res.name === "cats" && res.data.hasOwnProperty('parent_id')) {
            const fetched = {...res.data, created_at:isoToRusDate(res.data.created_at)}
            reset(fetched);
            text.current = fetched.text;
            return setDbData(fetched)
        }
    }, [wsMsg]);

    return (
        <AdminLayout>
            <header className={'col start'}><h1>?????????????????????????? {dbData.name}, id: {urlId}</h1></header>
            <section className={'col start'}>
                <form className={css.form} onSubmit={e => e.preventDefault()}>
                    <div>
                        <label htmlFor={'name'}>???????????????? <span className="count"/></label>
                        <input
                            onChange={count}
                            placeholder="???????????????? ??????????????????, ???????????????? ??????????"
                            {...register("name", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'title'}>Title <span className="count"/></label>
                        <input
                            placeholder="????????-?????? Title"
                            onChange={count}
                            {...register("title", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'h1'}>H1 (?????????????????? ????????????)<span className="count"/></label>
                        <input
                            onChange={count}
                            placeholder="?????????????????? ???????????? H1"
                            {...register("h1", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'description'}>Description (????????????????) <span className="count"/></label>
                        <input
                            onChange={count}
                            placeholder="????????-?????? description"
                            {...register("description", {
                                maxLength: 255
                            })}                  />

                        </div>

                    <div>
                        <label htmlFor={'keywords'}>????????-?????? keywords (???????? ???????????????? ???????????? ???? ????????????????????????????) <span className="count"/></label>
                        <input
                            onChange={count}
                            placeholder="??????????, ?????????????? ????????????, ???????????? ????????????"
                            {...register("keywords", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'author'}>????????-?????? author <span className="count"/></label>
                        <input
                            onChange={count}
                            {...register("author", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'slug'}>slug (url) (???????? ???????????????? ???????????? ???? ????????????????????????????) <span className="count"/></label>
                        <input
                            onChange={count}
                            placeholder="shorty"
                            {...register("slug", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'sort_order'}>?????????? ???????????????????? (?????????????? ??????????????)</label>
                        <input
                            type="number"
                            min="0"
                            defaultValue={urlId}
                            onChange={count}
                            {...register("sort_order", {
                                step: 1,
                                min: 0
                            })}
                        />
                    </div>

                    <div className={'row start center ' + css.tab} ref={simulateClick} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>???????????????? ??????????????????/????????????</h4>
                        <div className={css.bubble}>
                            <FaInfoCircle className={'abs'}/>
                            <p>?????? ???????????????? ?????????? ?? ?????????????????? ????????????????, ?? ????????-???????????????? ????????????.</p>
                        </div>
                    </div>
                    <div className={'row center ' + css.folder}>
                        {dbData.image && <img alt={dbData.name || ""} src={process.env.NEXT_PUBLIC_STATIC_URL + '/uploads/cats/' + urlId + '/' + dbData.image + '?' + imageCache} />}
                        {<UploadProvider
                            chunkSize={1048576}
                            allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                            address={'gpics:50001'}
                            action={'process'}
                            instructions={{
                                folder: 'cats/' + urlId,
                                width: 320,
                                height: 200,
                                fit: 'Fill', //Fit or Fill (with crop)
                                position: 'Center',
                                new_name: urlId.toString(),
                                table: '',
                                album_id: urlId
                            }}>
                            <InputUpload multiple={false}/>
                        </UploadProvider>}
                        <button onClick={() => {
                            const goData = {
                                address: 'gpics:50001',
                                action: 'delete',
                                instructions: JSON.stringify({
                                    id: urlId,
                                    folder: 'cats/' + urlId,
                                    name: dbData.image,
                                    table: 'cats'
                                })
                            };
                            return request(JSON.stringify(goData));
                        }}>?????????????? ????????????????
                        </button>
                    </div><br/>

                    <div>
                        <label htmlFor={'extra'}>?????????????????????????? <span className="count"/></label>
                        <input
                            onChange={count}
                            {...register("extra", {
                                maxLength: 255
                            })}
                        />
                    </div>

                    <div>
                        <label htmlFor={'created_at'}>???????? ???????????????????? (????.????.????????)</label>
                        <input
                            onChange={count}
                            {...register("created_at", {
                                maxLength: 10
                            })}
                        />
                    </div>

                    <div className="row start">
                        <input type="submit" value="??????????????????" onClick={handleSubmit(checkForm)}/>
                        <input type="submit" value="????????????????????????????" onClick={autoFill}/>
                        <Link href="/admin/cats">
                            <a className={css.cancel}>????????????????</a>
                        </Link>
                    </div>

                    {Wysiwyg && dbData &&
                        <Wysiwyg drop_name={'first'} bodyText={text.current || dbData.text} setBodyText={appendContent}
                                 instructions={{width: 900, height: 600, fit: 'Fit'}}
                                 imageLocation={'cats/' + urlId + '/wysiwyg'}/>
                    }
                </form>
            </section>
            {showSuccess && <div className={'row center '+css.success}><FaCheck/> ??????????????????</div>}
        </AdminLayout>

    );
}