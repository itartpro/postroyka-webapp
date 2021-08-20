    import Head from 'next/head';
import {useRouter} from 'next/router';
import css from './public-layout.module.css';
import Link from 'next/link';

const PublicLayout = ({page, user, children, ogImage}) => {
    const {asPath} = useRouter();
    return (
        <>
            <Head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="robots" content="index, follow"/>
                <title>{page && page.title}</title>
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
                <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL + asPath}/>
            </Head>
            <nav className={`row center ${css.top}`}>
                <div className={`row center bet max`}>
                    <Link href="/">
                        <a>
                            <img src="/images/logo.png" width="172" height="48" alt="Постройка" loading="lazy"/>
                        </a>
                    </Link>
                    <ul className={`row center init`}>
                        <li><Link href="/orders"><a>Заказы</a></Link></li>
                        <li><Link href="/masters"><a>Мастера и бригады</a></Link></li>
                        <li><Link href="/for-clients"><a>Для заказчиков</a></Link></li>
                        <li><Link href="/for-masters"><a>Для мастеров</a></Link></li>
                        <li><Link href="/blog"><a>Блог</a></Link></li>
                        <li><Link href="/login"><a>Войти</a></Link></li>
                    </ul>
                </div>
            </nav>
            {children}
            <style jsx global>{`
                @font-face {
                    font-family: Roboto;
                    src: url(../../public/fonts/Roboto-Regular.ttf);
                    font-weight: normal;
                    font-display: swap
                }
                
                @font-face {
                    font-family: Roboto;
                    src: url(../../public/fonts/Roboto-Bold.ttf);
                    font-weight: bold;
                    font-display: swap
                }
                
                * {
                    font-family: Roboto, Arial, "Helvetica Neue", sans-serif
                }
            `}</style>
        </>
    )
};

export default PublicLayout;