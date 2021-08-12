import PublicLayout from 'components/public/public-layout'

const Home = () => {
    const page = {
        'title':'',
        'description':'',
        'keywords':''
    };
    const ogImage = '';

    return (
        <PublicLayout page={page} ogImage={ogImage}>
            <main className={`row center`}>
                <h1>Постройка</h1>
            </main>
        </PublicLayout>
    )
}

export default Home;