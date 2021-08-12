import Head from 'next/head';
import {useRouter} from 'next/router';
import css from './public-layout.module.css';

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
            <div className={`row`}>
                {user && <nav className={`col start ${css.n1}`}><SideNav user={user} /></nav>}
                <main className={`col start ${css.m1}`}>{children}</main>
            </div>
        </>
    )
};

export default PublicLayout;