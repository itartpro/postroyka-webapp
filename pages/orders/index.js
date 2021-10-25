import PublicLayout from "components/public/public-layout";
import {Order} from 'components/public/orders/order';
import {getOrdersWithImages, getPageBySlug} from "libs/static-rest";

export async function getStaticProps() {
    const page = await getPageBySlug('orders');
    const orders = await getOrdersWithImages({});

    return {
        props: {
            page,
            orders
        },
        revalidate: 120
    }
}

const Orders = ({page, orders}) => {

    return (
        <PublicLayout page={page}>
            <br/>
            <main className="col start max">
                <header className="row start">
                    <h1>Все заказы</h1>
                </header>
                <br/>
                {orders && orders.map(e => <Order key={'o'+e.id} {...e}/>)}
            </main>
        </PublicLayout>
    )
}

export default Orders