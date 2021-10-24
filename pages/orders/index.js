import PublicLayout from "components/public/public-layout";
import {Order} from "components/public/order";
import {getOrders, getPageBySlug, getOrdersImages} from "libs/static-rest";

export async function getStaticProps() {
    const page = await getPageBySlug('orders');
    const orders = await getOrders({})
    const orderIds = [];
    orders && orders.forEach(e => {
        orderIds.push(e.id.toString());
    });
    if(orderIds.length > 0) {
        await getOrdersImages(orderIds).then(res => {
            const organized = {};
            res.forEach(e => {
                if(!organized.hasOwnProperty(e.album_id)) {
                    organized[e.album_id] = [];
                }
                organized[e.album_id].push(e)
            });
            for(let i in organized) {
                organized[i].sort((a,b) => a['sort_order'] - b['sort_order'])
            }
            orders.forEach(e => {
                if(organized[e.id]) {
                    if(!e.hasOwnProperty('images')) {
                        e['images'] = [];
                    }
                    organized[e.id].forEach(img => e.images.push(img))
                }
            })
        });
    }


    return {
        props: {
            page,
            orders
        },
        revalidate: 120
    }
}

const Orders = ({page, orders}) => {
    console.log(orders[0])
    return (
        <PublicLayout>
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