import {getOrdersWithImages, getProfileById, organizedRegions, organizedTowns} from "libs/static-rest";
import PublicLayout from "components/public/public-layout";
import {timeDiff, timeInRus} from "libs/time-stuff";
import {Order} from "components/public/orders/order";

export async function getServerSideProps({params}) {
    const profile = await getProfileById(parseInt(params.id)).then(e => {
        if(e) {
            delete e['password'];
            delete e['refresh'];
        }
        return e;
    });
    if (!profile) {
        return {
            notFound: true,
        }
    }

    const orders = await getOrdersWithImages({login_id: [parseInt(params.id)]})
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
            profile,
            orders,
            orderRegions,
            orderTowns
        }
    }
}

const Profile = ({profile, orders, orderRegions, orderTowns}) => {

    const timeOnSite = timeInRus(timeDiff(Date.parse(profile.created), Date.now()));
    console.log(orders)

    return (
        <PublicLayout>
            <main className="col start max">
                <br/>
                <header><h1>{profile.first_name}</h1></header>
                <p>Заказчик</p>
                <p>На сайте {timeOnSite}</p>
                <br/>
                <div>
                    <b>Заказы и отзывы</b>
                    {orders && orders.map(e => (
                        <Order key={'o'+e.id} {...e} region={orderRegions[e.region_id]} town={orderTowns[e.town_id]}/>
                    ))}
                </div>
            </main>
        </PublicLayout>
    )
}

export default Profile