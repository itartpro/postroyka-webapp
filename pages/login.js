import PublicLayout from "components/public/public-layout";
import {Login as LoginComponent} from "components/public/login";
import css from 'styles/login.module.css';

const Login = () => {
    return (
        <PublicLayout>

            <main className={`row bet max center`}>
                <div>
                    <h1>Вход</h1>
                    <LoginComponent/>
                    <p className={css.p1}><a href="https://www.google.ru/">Забыли пароль?</a></p>
                </div>
                <p>Впервые на Построй Ке?</p>
            </main>
            {/*<style jsx global>{`*/}
            {/*    // main {*/}
            {/*    //     position: relative;*/}
            {/*    // } */}
            {/*    // main > p {*/}
            {/*    //     position: absolute;  */}
            {/*    // }*/}
            {/*    // h1 {*/}
            {/*    //     margin-bottom: 15px*/}
            {/*    // }*/}
            {/*    // p {*/}
            {/*    //     color: red  */}
            {/*    // }*/}
            {/*`}</style>*/}
        </PublicLayout>
    )
}

export default Login