import AdminLayout from 'components/admin/admin-layout'
import Link from 'next/link'
import css from './cats.module.css'
import {FaCodeBranch, FaCartPlus, FaImages, FaTrashAlt, FaBars} from 'react-icons/fa'
import {useEffect, useContext, useState} from 'react'
import {WsContext} from 'context/WsProvider'
import {organizeCats} from 'libs/arrs'
import {toggleDown} from 'libs/sfx'

export default function Cats() {

    const [cats, setCats] = useState([])
    const {request, rs, wsMsg, setWsMsg} = useContext(WsContext);
    const deleteCat = id => {
        if(rs !== 1) return false;
        const goData = {
            address: 'cats:50004',
            action: 'delete',
            instructions: JSON.stringify({
                id
            })
        };
        request(JSON.stringify(goData));
    }

    useEffect(() => {
        if(rs !== 1) return false;
        const goData = {
            address: 'cats:50004',
            action: 'read_all',
            instructions: "{}"
        };
        request(JSON.stringify(goData));
    }, [rs]);

    useEffect(() => {
        if(!wsMsg) return
        if(wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if(wsMsg.type === "info") {
            const resp = JSON.parse(wsMsg.data);
            if(!resp.status) return setWsMsg({type: 'alert:red', data: resp.data});
            resp.data.length ? setCats(organizeCats(resp.data)) : null;
            return setWsMsg(null)
        }
    }, [wsMsg]);

    return (
        <AdminLayout>
            <header className={'col start'}><h1>Редактировать разделы</h1></header>
            <section className={'col start'}>
                <div className={css.indicator}>Нажать на название раздела = Редактировать</div>
                <div className={css.indicator}><span><FaCodeBranch/></span> = Добавить подраздел</div>
                <div className={css.indicator}><span><FaCartPlus/></span> = Добавить товар</div>
                <div className={css.indicator}><span><FaImages/></span> = Редактировать фотографии</div>
                <div className={css.indicator}><span><FaTrashAlt/></span> = Ликвидировать весь раздел</div>
                <div className={css.indicator}><span><FaBars/></span> = Развернуть раздел</div>
                {/*<Link href={`/admin/cats/create/[parent_id]`} as={`/admin/cats/create/0`}>
                    <a className={css.link}>
                        <span><FaCodeBranch/></span>
                        <span>Добавить новый главный раздел</span>
                    </a>
                </Link>*/}
                <br/>
                {Array.isArray(cats) && cats.length &&
                <ul className={css.list}>
                    {cats.map(c => (
                        <li key={c.id}>
                            <div className={'row center'}>
                                <Link href={`/admin/cats/update/${c.id}`}><a>{c.name}</a></Link>
                                <Link href={`/admin/cats/create/${c.id}`}><span><FaCodeBranch/></span></Link>
                            </div>
                            {c.children.length > 0 && <>
                                <button className={css.bars} onClick={toggleDown}><FaBars/></button>
                                <ul className={css.list}>
                                    {c.children.map(c2 => (
                                        <li key={c2.id}>
                                            <div className={'row center'}>
                                                <Link href={`/admin/cats/update/[id]`} as={`/admin/cats/update/${c2.id}`}><a>{c2.name}</a></Link>
                                                <Link href={`/admin/cats/create/[id]`} as={`/admin/cats/create/${c2.id}`}><span><FaCodeBranch/></span></Link>
                                                {(c.id === 2) && <Link href={`/admin/products/create/[parent_id]`} as={`/admin/products/create/${c2.id}`}><span><FaCartPlus/></span></Link>}
                                                <Link href={`/admin/cats/images/[id]`} as={`/admin/cats/images/${c2.id}`}><span><FaImages/></span></Link>
                                                <a role="button" aria-label="delete category" onClick={() => deleteCat(c2.id)}><span><FaTrashAlt/></span></a>
                                            </div>
                                            {c2.children.length > 0 && <>
                                                <button className={css.bars} onClick={toggleDown}><FaBars/></button>
                                                <ul className={css.list}>
                                                    {c2.children.map(c3 => (
                                                        <li key={c3.id}>
                                                            <div className={'row center'}>
                                                                <Link href={`/admin/cats/update/[id]`} as={`/admin/cats/update/${c3.id}`}><a>{c3.name}</a></Link>
                                                                <Link href={`/admin/cats/create/[id]`} as={`/admin/cats/create/${c3.id}`}><span><FaCodeBranch/></span></Link>
                                                                {(c.id === 2) && <Link href={`/admin/products/create/[parent_id]`} as={`/admin/products/create/${c3.id}`}><span><FaCartPlus/></span></Link>}
                                                                <Link href={`/admin/cats/images/[id]`} as={`/admin/cats/images/${c3.id}`}><span><FaImages/></span></Link>
                                                                <a role="button" aria-label="delete category" onClick={() => deleteCat(c3.id)}><span><FaTrashAlt/></span></a>
                                                            </div>
                                                            {c3.children.length > 0 && <>
                                                                <button className={css.bars} onClick={toggleDown}><FaBars/></button>
                                                                <ul className={css.list}>
                                                                    {c3.children.map(c4 => (
                                                                        <li key={c4.id}>
                                                                            <div className={'row center'}>
                                                                                <Link href={`/admin/cats/update/[id]`} as={`/admin/cats/update/${c4.id}`}><a>{c4.name}</a></Link>
                                                                                <Link href={`/admin/cats/create/[id]`} as={`/admin/cats/create/${c4.id}`}><span><FaCodeBranch/></span></Link>
                                                                                {(c.id === 2) && <Link href={`/admin/products/create/[parent_id]`} as={`/admin/products/create/${c4.id}`}><span><FaCartPlus/></span></Link>}
                                                                                <Link href={`/admin/cats/images/[id]`} as={`/admin/cats/images/${c4.id}`}><span><FaImages/></span></Link>
                                                                                <a role="button" aria-label="delete category" onClick={() => deleteCat(c4.id)}><span><FaTrashAlt/></span></a>
                                                                            </div>
                                                                            {c4.children.length > 0 && <>
                                                                                <button className={css.bars} onClick={toggleDown}><FaBars/></button>
                                                                                <ul className={css.list}>
                                                                                    {c4.children.map(c5 => (
                                                                                        <li key={c5.id}>
                                                                                            <div className={'row center'}>
                                                                                                <Link href={`/admin/cats/update/[id]`} as={`/admin/cats/update/${c5.id}`}><a>{c5.name}</a></Link>
                                                                                                <Link href={`/admin/cats/create/[id]`} as={`/admin/cats/create/${c5.id}`}><span><FaCodeBranch/></span></Link>
                                                                                                {(c.id === 2) && <Link href={`/admin/products/create/[parent_id]`} as={`/admin/products/create/${c5.id}`}><span><FaCartPlus/></span></Link>}
                                                                                                <Link href={`/admin/cats/images/[id]`} as={`/admin/cats/images/${c5.id}`}><span><FaImages/></span></Link>
                                                                                                <a role="button" aria-label="delete category" onClick={() => deleteCat(c5.id)}><span><FaTrashAlt/></span></a>
                                                                                            </div>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </>}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>}
                                        </li>
                                    ))}
                                </ul>
                            </>}
                        </li>
                    ))}
                </ul>}
            </section>
        </AdminLayout>
    )
}