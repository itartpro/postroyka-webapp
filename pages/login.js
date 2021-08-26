import PublicLayout from "components/public/public-layout";
import {Login as LoginComponent} from "components/public/login";
import css from 'styles/login.module.css';

const Login = () => {
    return (
        <PublicLayout>

            <main className={`row bet max center`}>
                <div className={'col start '+css.d1}>
                    <h1>Вход</h1>
                    <LoginComponent/>
                    <p className={css.p1}><a href="https://www.google.ru/">Забыли пароль?</a></p>
                </div>
                <style global jsx>{`
                    form > input[type=submit] {
                        width: 100%!important;
                        max-width: 300px!important
                    }
                `}</style>
                <p>Впервые на Построй Ке?</p>
            </main>
        </PublicLayout>
    )
}

export default Login