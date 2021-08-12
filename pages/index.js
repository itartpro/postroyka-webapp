import PublicLayout from 'components/public/public-layout'
import Login from "../components/public/loginforms/login";
import Register from "../components/public/loginforms/register";

const Home = () => {
    const page = {
        'title':'social network title',
        'description':'social network description',
        'keywords':'social network keywords',
    };
    const ogImage = 'https://itart.pro/images/splash.png';

    return (
        <PublicLayout page={page} ogImage={ogImage}>
            <main className={`row center`}>
                <h1>Логин и регистрация</h1>
                <Login/>
                <Register/>
            </main>
        </PublicLayout>
    )
}

export default Home;