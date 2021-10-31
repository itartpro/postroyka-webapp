import PublicLayout from "components/public/public-layout";
import {Order} from 'components/public/orders/order';
import {getOrdersWithImages, getPageBySlug, organizedRegions, organizedTowns} from "libs/static-rest";

export async function getStaticProps() {
    const page = await getPageBySlug('orders');
    const orders = await getOrdersWithImages({});
    let orderRegions = null;
    let orderTowns = null;
    if(orders) {
        const regionIds = orders.map(e => e.region_id.toString());
        const townIds = orders.map(e => e.town_id.toString());
        orderRegions = await organizedRegions(regionIds)
        orderTowns = await organizedTowns(townIds)
    }

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