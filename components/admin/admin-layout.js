import css from './admin-layout.module.css'
import Link from 'next/link'
import {useEffect, useState, useContext, useRef} from 'react'
import {useRouter} from 'next/router'
import {WsContext} from 'context/WsProvider'
import ShowMessage from '../show-message'
import {FaFlag, FaHome, FaIdCard, FaFileImage, FaSitemap, FaSignOutAlt, FaFilter} from 'react-icons/fa'
import NotFound from '../not-found'

export default function AdminLayout({children}) {

    //Check login or kick
    const {pathname} = useRouter();
    const { verifiedJwt, checkAccess, setWsMsg, wsMsg } = useContext(WsContext);
    const [ showContent, setShowContent ] = useState(undefined);
    const [ msgText, setMsgText ] = useState(undefined);
    const [ msgType, setMsgType ] = useState([]);

    const handleMessage = childData => {
        if(!childData && wsMsg && wsMsg.type.substr(0, 5) === "alert") setWsMsg(null);
        setMsgText(childData);
    }
    const msgProps = {handleMessage, msgText};

    useEffect(() => {
        const check = checkAccess([9]);
        verifiedJwt !== undefined && setShowContent(check === true ? check : false);
    }, [verifiedJwt, showContent]);

    useEffect(() => {
        if(wsMsg && wsMsg.hasOwnProperty('type')) {
            if(wsMsg.type.substr(0, 5) === "alert") {
                const type = wsMsg.type.split(":");
                setMsgText(wsMsg.data);
                setMsgType(type);
            }
        }
    }, [wsMsg])

    const navRef = useRef();
    const pattiesRef = useRef();
    const mainRef = useRef();
    const burgerFlip = () => {
        navRef.current.classList.toggle(css.change);
        pattiesRef.current.classList.toggle(css.change);
        mainRef.current.classList.toggle(css.change);
    }

    const menu = [
        ["/", "На главную", <FaFlag/>],
        ["/admin", "Админка", <FaHome/>],
        ["/login", "Логин", <FaIdCard/>],
        ["/admin/banners", "Баннеры", <FaFileImage/>],
        ["/admin/cats", "Разделы", <FaSitemap/>],
    ]
    return (
        <>
            { showContent &&
                <>
                    <nav className={'col start ' + css.menu} ref={navRef}>
                        <ul className={'col start'}>
                            {menu.map((e, i) => (
                                <li key={i}>
                                    <Link href={e[0]}>
                                        <a className={pathname === e[0] && css.current} onClick={e[3]}>
                                            <span>{e[2]}</span>
                                            <span>{e[1]}</span>
                                        </a>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a href="/login?out">
                                    <span><FaSignOutAlt/></span>
                                    <span>Выход</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className={css.burger} onClick={burgerFlip}>
                        <div className={css.patties} ref={pattiesRef}>
                            <div className={css.bar1}></div>
                            <div className={css.bar2}></div>
                            <div className={css.bar3}></div>
                        </div>
                    </div>
                    <main className={'col start ' + css.main} ref={mainRef}>
                        {children}
                        { msgText && <ShowMessage {...msgProps} msgType={msgType}/> }
                    </main>
                    <style global jsx>{`
                      body, nav {
                        background-color: #e0e0e0
                      }
                      footer {
                        background: gray;
                        color: white
                      }
                    `}</style>
                </>
            || <NotFound/> }
        </>
    );
}