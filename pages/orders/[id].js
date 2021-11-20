import PublicLayout from "components/public/public-layout";
import {getOrdersWithImages} from "libs/static-rest";
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';
import css from './order.module.css'

export async function getServerSideProps({params}) {

    const order = await getOrdersWithImages({id:[parseInt(params.id)]}).then(data => data && data[0]);

    return {
        props: {
            order
        }
    }
}

const Order = ({order}) => {
    return (
        <PublicLayout>
            <br/>
            <main className={`col start max`}>
                <header><h1>Заказ №{order.id} "{order.title}"</h1></header>
                <br/>
                {(order.images && order.images.length > 0) && (
                    <div className={'row start '+css.gal}>
                        <Gallery>
                            {order.images.map((e, i) => (
                                <Item key={e.id || i}
                                      original={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/'+e.name}
                                      thumbnail={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                      width={e.width}
                                      height={e.height}
                                      title={e.text}
                                >
                                    {({ ref, open }) => (
                                        <img
                                            ref={ref}
                                            onClick={open}
                                            src={process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/orders/'+e.album_id+'/mini/'+e.name}
                                            alt={i}
                                            width={120}
                                            height={90}
                                            loading="lazy"
                                        />
                                    )}
                                </Item>
                            ))}
                        </Gallery>
                    </div>
                )}
            </main>
        </PublicLayout>
    )
}

export default Order