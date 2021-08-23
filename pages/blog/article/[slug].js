import PublicLayout from 'components/public/public-layout'
import {getPageBySlug, getLatestArticles} from 'libs/static-rest'
import css from './slug.module.css'
import cr from 'components/public/crumbs.module.css'
import {isoToRusDate} from 'libs/js-time-to-psql'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export async function getStaticPaths() {
    const paths = [];
    const articles = await getLatestArticles();
    const articleDirectory = path.join(process.cwd(), 'pages/blog/article');
    const statics = fs.readdirSync(articleDirectory).map(e => path.parse(articleDirectory+'/'+e).name);

    if(articles) {
        //exclude the ones that are files...
        const filtered = articles.filter(e => statics.includes(e));
        // Get the paths we want to pre-render based on posts
        filtered.forEach(e => {
            paths.push({ params: {slug: e.slug}})
        })
    }

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const page = await getPageBySlug(params.slug);
    if(!page) { return { notFound: true } }
    return {
        props: {
            page
        },
        revalidate: 120
    }
}

export default function Article({page}) {
    return (
        <PublicLayout page={page}>
            <main className={'col start'}>
                <ul className={'row start '+cr.cr}>
                    <li><Link href={'/'}><a>На главную</a></Link><span>/</span></li>
                    <li><Link href={'/blog'}><a>Блог</a></Link><span>/</span></li>
                </ul>
                <article className={css.ar}>
                    <header><h1 className="hl">{page.h1}</h1></header>
                    <div dangerouslySetInnerHTML={{__html: page.text}} />
                    <br/>
                    <div className="col start">
                        <p><span>{page.author || 'Лев'}</span></p>
                        <p>🕗 <span>{isoToRusDate(page.created_at)}</span></p>
                    </div>
                </article>
            </main>
        </PublicLayout>
    )
}