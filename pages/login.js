import PublicLayout from "components/public/public-layout";
import {Login as LoginComponent} from "components/public/login";

const Login = () => {
    return (
        <PublicLayout>
            <main className={`row center`}>
                <LoginComponent/>
                <p>Какой то текст</p>
            </main>
            <style jsx global>{`
                main > p {
                    color: red
                }
            `}</style>
        </PublicLayout>
    )
}

export default Login