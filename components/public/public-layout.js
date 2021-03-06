import Head from 'next/head';
import {useRouter} from 'next/router';
import css from './public-layout.module.css';
import Link from 'next/link';
import {toggleDown} from 'libs/sfx';
import {useState, useEffect, useContext} from 'react';
import {WsContext} from 'context/WsProvider';
import {nowToISO} from "libs/js-time-to-psql";

const PublicLayout = ({page, children, ogImage, loginName}) => {
    const router = useRouter();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [user, setUser] = useState(null);
    const { request, verifiedJwt } = useContext(WsContext);

    useEffect(() => {
        const str = window.localStorage.getItem('User');
        if(!str) return setUser(null);
        try {
            const parsed = JSON.parse(str);
            if(str) setUser(parsed);

            //update last time online
            if(verifiedJwt) {
                const goData = {
                    address: 'auth:50003',
                    action: 'update-last-online',
                    instructions: JSON.stringify({
                        id:parsed.id,
                        last_online: nowToISO()
                    })
                };
                request(JSON.stringify(goData))
            }

        } catch (e) {
            setUser(null)
        }
    }, []);

    const topColor = (router.pathname === '/' || router.pathname === '/for-clients') ? css.fff : css.f8;

    return (
        <>
            <Head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="robots" content="index, follow"/>
                <title>{(page && page.title) || "Постройка"}</title>
                {page &&
                <>
                    {page.description && <meta name="description" content={page.description}/>}
                    {page.keywords && <meta name="keywords" content={page.keywords}/>}
                    {page.title && <meta property="og:title" content={page.title}/>}
                    {page.description && <meta property="og:description" content={page.description}/>}
                </>
                }
                <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME}/>
                <meta property="og:image" content={ogImage || "/images/logo.png"}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL + router.asPath}/>
            </Head>
            <nav className={`row center ${css.top} ${topColor}`}>
                <div className={`row center bet max`}>
                    <Link href="/"><a><img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/logo.png`} width="172" height="48" alt="Постройка" loading="lazy"/></a></Link>
                    <div className={'row start '+css.hbg} onClick={e => {
                        e.target.classList.toggle(css.change);
                        toggleDown(e)
                    }}>
                        <div>
                            <div className={css.b1}/>
                            <div className={css.b2}/>
                            <div className={css.b3}/>
                        </div>
                        <Link href="/"><a><img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/logo.png`} width="172" height="48" alt="Постройка" loading="lazy"/></a></Link>
                    </div>
                    <ul className={`row center init`}>
                        <li><Link href="/orders"><a>Заказы</a></Link></li>
                        <li><Link href="/masters"><a>Мастера и бригады</a></Link></li>
                        <li><Link href="/for-clients"><a>Для заказчиков</a></Link></li>
                        <li><Link href="/for-masters"><a>Для мастеров</a></Link></li>
                        <li><Link href="/blog"><a>Блог</a></Link></li>
                        <li className={(loginName || user) && css.usr}>
                            {!user && <Link href="/login"><a>{loginName || 'Войти'}</a></Link>}
                            {user && (
                                <>
                                    <a role="button" onClick={toggleDown}>{loginName || (user.first_name + ' ' + user.last_name)}</a>
                                        {user.level === 1 && (
                                            <ul>
                                                <li><Link href={'/profile/'+user.id}><a>Профиль</a></Link></li>
                                                <li><Link href={'/profile/'+user.id+'/edit'}><a>Настройки</a></Link></li>
                                                <li><Link href={'/login?out'}><a>Выход</a></Link></li>
                                            </ul>
                                        )}
                                        {user.level === 2 && (
                                            <ul>
                                                <li><Link href={'/master/'+user.id}><a>Профиль</a></Link></li>
                                                <li><Link href={'/master/'+user.id+'/edit/info'}><a>Настройки</a></Link></li>
                                                <li><Link href={'/login?out'}><a>Выход</a></Link></li>
                                            </ul>
                                        )}
                                        {user.level === 9 && (
                                            <ul>
                                                <li><Link href={'/admin'}><a>В админку</a></Link></li>
                                                <li><Link href={'/login?out'}><a>Выход</a></Link></li>
                                            </ul>
                                        )}
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
            {children}
            <footer className={'row '+css.ft}>
                <div className={'row bet max'}>
                    <div className="col start">
                        <a itemProp="url" href="/">
                        <span itemProp="logo" itemScope itemType="http://schema.org/ImageObject">
                            <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/logo.png`} width="172" height="48" alt="Постройка" loading="lazy"/>
                            <meta itemProp="representativeOfPage" content="true"/>
                            <meta itemProp="thumbnail" content="/android-chrome-192x192.png"/>
                        </span>
                        </a>
                        <span>© 2021{currentYear !== 2021 ? ' - '+currentYear : null}</span>
                    </div>
                    <ul className={`col start`}>
                        <li><Link href="/orders"><a>Заказы</a></Link></li>
                        <li><Link href="/masters"><a>Мастера и бригады</a></Link></li>
                        <li><Link href="/for-clients"><a>Для заказчиков</a></Link></li>
                        <li><Link href="/for-masters"><a>Для мастеров</a></Link></li>
                        <li><Link href="/blog"><a>Блог</a></Link></li>
                        <li><Link href="/login"><a>Личный кабинет</a></Link></li>
                    </ul>
                    <div className="col start">
                        <a href="tel:+79621231212" rel="nofollow" itemProp="telephone">+7 962 123 12 12</a>
                        <span itemProp="email">mail@itart.pro</span>
                        <p itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                            <span itemProp="addressLocality">Москва</span>,
                            <span itemProp="streetAddress">улица Большая Молчановка, 21А</span>
                        </p>
                    </div>
                    <div className={'col start'}>
                        <a>Вконтакте</a>
                        <a>Инстаграм</a>
                        <a>Одноклассники</a>
                        <a>Facebook</a>
                    </div>
                </div>
            </footer>
        </>
    )
};

export default PublicLayout;