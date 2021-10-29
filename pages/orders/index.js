import PublicLayout from "components/public/public-layout";
import {Order} from 'components/public/orders/order';
import {getOrdersWithImages, getPageBySlug} from "libs/static-rest";
import goPost from "libs/go-post";

export async function getStaticProps() {
    const page = await getPageBySlug('orders');
    const orders = await getOrdersWithImages({});
    const regionIds = orders.map(e => e.region_id.toString());
    const townIds = orders.map(e => e.town_id.toString());
    const orderRegions = await goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'regions-where-in',
        instructions: JSON.stringify({
            column: 'id',
            values: regionIds
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            const organized = {};
            parsed.data.forEach(e => {
                organized[e.id] = e.name;
            });
            return organized
        } catch (e) {
            console.log("regions-where-in error:" + e + res);
            return res
        }
    });
    const orderTowns = await goPost(JSON.stringify({
        address: 'auth:50003',
        action: 'towns-where-in',
        instructions: JSON.stringify({
            column: 'id',
            values: townIds
        })
    })).then(res => {
        try {
            const parsed = JSON.parse(res);
            const organized = {};
            parsed.data.forEach(e => {
                organized[e.id] = e.name;
            });
            return organized
        } catch (e) {
            console.log("towns-where-in error:" + e + res);
            return res
        }
    });

    return {
        props: {
            page,
            orders,
            orderRegions,
            orderTowns
        },
        revalidate: 120
    }
}

const Orders = ({page, orders, orderRegions, orderTowns}) => {

    return (
        <PublicLayout page={page}>
            <br/>
            <main className="col start max">
                <header className="row start">
                    <h1>Все заказы</h1>
                </header>
                <br/>
                {orders && orders.map(e => <Order key={'o'+e.id} {...e} region={orderRegions[e.region_id]} town={orderTowns[e.town_id]}/>)}
            </main>
        </PublicLayout>
    )
}

export default Orders