import PublicLayout from 'components/public/public-layout'
import css from './home.module.css'

const Home = () => {
    const page = {
        'title':'',
        'description':'',
        'keywords':''
    };
    const ogImage = '';

    return (
        <PublicLayout page={page} ogImage={ogImage}>
            <main className={`row center ${css.m1}`}>
                <h1>Постройка hello</h1>
            </main>
        </PublicLayout>
    )
}

export default Home;