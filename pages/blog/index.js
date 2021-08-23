import PublicLayout from 'components/public/public-layout'
import ArticleCard from 'components/public/blog/article-card'
import {getLatestArticles, getPageBySlug} from 'libs/static-rest'
import Link from 'next/link'
import cr from 'components/public/crumbs.module.css'
import Hat from "../../components/public/hat";

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
            <Hat />
            <main className={'col start'}>
                <ul className={'row start '+cr.cr}>
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
            <style jsx global>{`
              body {
                  color: white;
                  background: linear-gradient(45deg,rgba(0,91,93,0.7),rgba(71,22,78,0.7)),url(/images/funfon.svg);
                  background-repeat: repeat;
                  background-size: auto, 200px;
              }
              main {
                  max-width: 1200px;
                  margin: 0 auto;
                  padding-bottom: 50px;
                  min-height: calc(100vh - 122px);
              }
              .back {
                  width: 100%;
                  max-width: 1230px;
                  margin: 30px auto;
                  padding: 0 15px;
                  font-size: 1.1rem
              }
              main > ul {
                text-shadow: 0 1px 0 #000
              }
              .back a:hover {
                  text-decoration: underline
              }
              @media all and (max-width: 1220px) {
                  main {
                    padding: 0 15px
                  }
              }
            `}</style>
        </PublicLayout>
    )
}