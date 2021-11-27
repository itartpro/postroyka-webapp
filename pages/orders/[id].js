import PublicLayout from "components/public/public-layout";
import {getOrdersWithImages, getProfileById, getRow, getPageBySlug, getOrders} from "libs/static-rest";
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery';
import css from './order.module.css'
import {formatPrice} from "libs/sfx";
import {isoToRusDate} from "libs/js-time-to-psql";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from "next/link";
import {useState, useEffect, useContext} from "react";
import {WsContext} from "context/WsProvider";
import {useForm} from "react-hook-form";
import {errMsg} from "libs/form-stuff";
import formCSS from "styles/forms.module.css";
import {nowToISO} from "libs/js-time-to-psql";
import {ShowMessage} from "components/show-message";

export async function getServerSideProps({params}) {

    const order = await getOrdersWithImages({id:[parseInt(params.id)]}).then(data => data && data[0]);
    if (!order) {
        return {
            notFound: true,
        }
    }
    const otherOrdersCount = await getOrders({login_id: order.login_id}).then(res => Array.isArray(res) ? res.length : null);
    const town = await getRow('id', order.town_id, 'towns');
    const region = await getRow('id', order.region_id, 'regions');
    const customer = await getProfileById(parseInt(order.login_id)).then(e => e !== null ? {id: e.id, first_name: e.first_name} : null);
    const service = await getPageBySlug("", order.service_id).then(res => {
        if(res) {
            return {
                id: res.id,
                name: res.name,
                slug: res.slug
            }
        }
        return null
    });

    return {
        props: {
            order,
            town,
            region,
            customer,
            service,
            otherOrdersCount
        }
    }
}

const Order = ({order, otherOrdersCount, town, region, customer, service}) => {
    const [query, setQuery] = useState("");
    const handleParam = setValue => e => setValue(e.target.value);
    const addOrder = e => {
        e.preventDefault();
        if(query.length > 3) {
            router.replace({
                pathname: 'orders/add',
                query: {title: query.trim()},
            })
        } else {
            router.push('orders/add')
        }
    }
    const [showMsg, setShowMsg] = useState(null);
    //verify user access
    const { wsMsg, verifiedJwt, verifyById, checkAccess, request } = useContext(WsContext);
    const [showContent, setShowContent ] = useState(undefined);
    const [masterId, setMasterId] = useState(null);
    const [offer, setOffer] = useState(null);
    useEffect(() => {
        const check = checkAccess([2, 9]);
        verifiedJwt !== undefined && setShowContent(check === true ? check : false);
        if(check === true) {
            const user = JSON.parse(window.localStorage.getItem('User'));
            if(user.level === 2 && user.id !== customer.id) {
                setMasterId(user.id);
                //TODO check if master already sent his offer, or received an offer
            } else {
                setShowContent(false)
            }
        }
    }, [verifiedJwt, showContent]);

    //handle info from server
    useEffect(() => {
        if (!wsMsg) return false;

        if (wsMsg.type === "error") {
            if(wsMsg.data.includes("is taken")) {
                let msg = "Кто-то уже зарегестрировался на сайте с таким email или телефоном. Если это Вы - то введите Ваш логин (email/телефон) в конце формы.";
                setShowMsg(msg)
            } else {
                setShowMsg(wsMsg.data)
            }
            return false
        }
        if (wsMsg.type !== "info") {
            setShowMsg(wsMsg.data);
            return false
        }

        let msg = {};
        try {
            msg = JSON.parse(wsMsg.data);
        } catch (err) {
            console.log("could not parse data: ",wsMsg.data, err);
            return false
        }

        if(msg.data && msg.name === 'auth') {
            //handle addition of offer
            if(msg.data.hasOwnProperty('order_id')) setOffer(msg.data)
        }

    }, [wsMsg]);

    //form stuff
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const submitOffer = d => {
        const offer = {
            order_id: order.id,
            customer_id: customer.id,
            master_id: masterId,
            accept: 2, //2 - master offers to customer
            price: d.price,
            meeting: d.meeting,
            description: d.description,
            created: nowToISO()
        };
        const goData = {
            address: 'auth:50003',
            action: 'add-offer',
            instructions: JSON.stringify(offer)
        };
        request(JSON.stringify(goData))
    }

    return (
        <PublicLayout>
            <br/>
            <main className={`col start max`}>
                <header><h1>{order.title}</h1></header>
                <br/>
                <p className={css.gray}>{region.name}, {town.name}</p>
                <br/>
                {order.description !== "" && <p>{order.description}<br/><br/></p>}
                <p className={css.budget}>
                    <span>{formatPrice(order.budget)}р</span>
                    <span className={css.gray}>Приблизительный бюджет</span>
                </p>
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
                <ul className={`${css.details}`}>
                    <li>
                        <span>Заказ</span>
                        <span>{order.id}</span>
                    </li>
                    <li>
                        <span>Заказчик</span>
                        <span>{customer.first_name} (Заказов в общем: {otherOrdersCount})</span>
                    </li>
                    <li>
                        <span>Добавлен</span>
                        <span>{isoToRusDate(order.created)} <span className={css.gray}>&nbsp;{timeInRus(timeDiff(Date.parse(order.created), Date.now()))} назад</span></span>
                    </li>
                    <li>
                        <span>Сроки</span>
                        <span>{order.time}</span>
                    </li>
                    <li>
                        <span>Категория</span>
                        <span>{service.name}</span>
                    </li>
                </ul>
                {!offer && showContent && (
                    <form onSubmit={handleSubmit(submitOffer)} className={`col start ${formCSS.form}`}>
                        <br/>
                        <b>Предложить свою кандидатуру</b>
                        <span className={css.gray}>* Ваше имя, дата предложения и ссылка на Ваш профиль будут автоматически показаны в Вашем предложении.</span>
                        <input type="text" {...register('price', {required: true, maxLength: 100})} data-label="Цена за работу" placeholder="Цена за всю работу (можно приблизительно)"/>
                        {errMsg(errors.price, 100)}

                        <input type="text" {...register('meeting', {maxLength: 100})} data-label="Дата и условия выезда" placeholder="Дата и условия выезда (Когда вы сможете встретится, приедете Вы или менеджер)"/>
                        {errMsg(errors.meeting, 100)}

                        <textarea {...register('description', {required: true, maxLength: 300})} placeholder="Ваше предложение"/>
                        {errMsg(errors.description, 2000)}

                        <input type="submit" value="Предложить"/>
                        <br/>
                    </form>
                )}
                {offer && (
                    <div className={css.offered}>
                        <b>Вы уже отправили своё предложение на выполнение этого заказа</b>
                        <p>Заказчик увидит Ваше предложение, описание Вашего профиля, ссылку на Ваш профиль, и свяжется с Вами если предложение ему подойдёт</p>
                        <ul className={`${css.details}`}>
                            <li>
                                <span>Цена за работу:</span>
                                <span>{offer.price}</span>
                            </li>
                            <li>
                                <span>Дата и условия выезда:</span>
                                <span>{offer.meeting}</span>
                            </li>
                            <li>
                                <span>Ваше предложение:</span>
                                <span>{offer.description}</span>
                            </li>
                        </ul>
                    </div>
                )}
                <div className={`row bet ${css.bottom}`}>
                    <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/orders/bottom.jpg`} alt="Покрасить стены"  width="420" height="322" loading="lazy"/>
                    <div className="col bet">
                        <b>Вы мастер? Обеспечьте заказами себя, бригаду или компанию</b>
                        <ul>
                            <li>Стабильный поток заказов каждый день</li>
                            <li>Вы сами выбираете заказы и заказчиков, предлагаете свои условия</li>
                            <li>Договаривайтесь напрямую без комиссий и посредников</li>
                        </ul>
                        <div className="row center start">
                            <Link href={'/registration'}><a className={css.grn}>Регистрация мастера</a></Link>
                            <Link href={'/for-masters'}><a>Условия работы на сервисе</a></Link>
                        </div>
                        <p><b>Или</b> Найдите мастера под Ваши работы</p>
                        <form onSubmit={addOrder}>
                            <input type="text" name="title" value={query} onChange={handleParam(setQuery)} placeholder="Что требуется сделать?"/>
                            <input type="submit" value="Найти мастера ›"/>
                        </form>
                    </div>
                </div>
                {showMsg && <ShowMessage text={showMsg} clear={setShowMsg} timer={6000}/>}
            </main>
        </PublicLayout>
    )
}

export default Order