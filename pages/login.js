import PublicLayout from "../components/public/public-layout";
import {Login as LoginComponent} from "../components/public/loginforms/login";

const Login = () => {
    return (
        <PublicLayout>
            <main className={`row center`}>
                <LoginComponent/>
                <p>Какой то текст</p>
            </main>
        </PublicLayout>
    )
}

export default Login