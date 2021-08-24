import PublicLayout from "components/public/public-layout";
import Link from 'next/link';
import css from 'styles/for-masters.module.css';

const ForMasters = () => {
    return (
        <PublicLayout>
            <main className={`row center`}>
                <h1>Для мастера</h1>
                <Link href="/registration">
                    <a>Регистрироватся</a>
                </Link>
            </main>
        </PublicLayout>
    )
}

export default ForMasters