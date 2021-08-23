import Link from 'next/link'
import AdminLayout from 'components/admin/admin-layout'

export default function Banners() {
    return (
        <AdminLayout>
            <header className={'col start'}><h1>Редактировать баннеры</h1></header>
            <section className={'col start'}>
                <Link href="/admin/banners/[banner]" as={`/admin/banners/homeone`}><a className="link">Homeone</a></Link>
                <Link href="/admin/banners/[banner]" as={`/admin/banners/hometwo`}><a className="link">Hometwo</a></Link>
                <style jsx>{`
                    .link {
                      margin-bottom: 15px;
                      color: #2e6fdf;
                      text-decoration: underline;
                    }
                `}</style>
            </section>
        </AdminLayout>
    )
}