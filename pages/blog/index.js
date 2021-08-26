import PublicLayout from 'components/public/public-layout';
import ArticleCard from 'components/public/blog/article-card';
import {getLatestArticles, getPageBySlug} from 'libs/static-rest';
import Link from 'next/link';

export async function getStaticProps() {
    const page = await getPageBySlug('blog');
    const articles = await getLatestArticles();
    return {
        props: {
            page,
            articles
        },
        revalidate: 120
    }
}

export default function Blog({page, articles}) {
    return (
        <PublicLayout page={page}>
            <main className={'col start max'}>
                <ul className={'row start'}>
                    <li><Link href={'/'}><a>На главную</a></Link><span>/</span></li>
                </ul>
                {articles && (
                    <>
                        <header><h1 className="hl">Блог</h1></header>
                        <ul className={'row bet'}>
                            {articles.map(e => (
                                <ArticleCard key={e.id} {...e}/>
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </PublicLayout>
    )
}