import PublicLayout from "../components/public/public-layout";
import {Login as LoginComponent} from "../components/public/loginforms/login";

const Login = () => {
    return (
        <PublicLayout>
            <LoginComponent/>
        </PublicLayout>
    )
}

export default Login