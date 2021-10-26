import PublicLayout from "components/public/public-layout";
import Link from 'next/link';
import css from 'styles/for-masters.module.css';

const ForMasters = () => {
    return (
        <PublicLayout>
            <main className={'row bet max center'}>
                <div className={`col`}>
                    <div className={`row bet`}>
                        <div className={`col ${css.m1}`}>
                            <h1>Получите заказы уже сегодня</h1>
                            <div>
                                <p>Построй Ка - тут вы возьмете заказ по профилю, типу сложности и комфортной цене</p>
                                <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/master1.png`} alt="master" width="100" height="126" loading="lazy"/>
                            </div>
                            <div>
                                <p>Предложите свои услуги любому заказчику и найчнете работайте с ним напрямую</p>
                                <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/master2.png`} alt="master" width="141" height="130" loading="lazy"/>
                            </div>
                            <div>
                                <p>Абсолютно бесплатно и без комиссии</p>
                                <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/master3.png`} alt="master" width="100" height="113" loading="lazy"/>
                            </div>
                        </div>
                        <img className={css.i2} src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/formasters.png`} alt="formasters" width="572" height="477" loading="lazy"/>
                    </div>
                    <div className={`center ${css.b1}`}>
                        <Link href="/registration">
                            <a>Получить заказы</a>
                        </Link>
                    </div>
                </div>

                <div className={`max bet ${css.g1}`}>
                    <h2>Возьмите заказ на раз – два</h2>
                    <div className={`row bet`}>
                        <div>
                            <div className={`row bet ${css.ho}`}>
                                <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/imgone.png`} alt="one" width="189" height="188" loading="lazy"/>
                                <p><span>Зарегистрируйтесь</span>
                                    <br/>Заказчики хотят видеть, с кем они имеют дело. <br/>Чем больше информации вы
                                    заполните, тем чаще вас будут выбирать.</p>
                                <span><img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/line.png`} width="322" height="101" alt="line" loading="lazy"/></span>
                            </div>
                            <span className={css.sp}>Р А З</span>
                        </div>
                        <div>
                            <div className={`row bet ${css.ho}`}>
                                <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/imgtwo.png`} width="189" height="188" alt="one" loading="lazy"/>
                                <p><span>Выбирайте интересные вам заказы</span>
                                    <br/>Вам будут доступны все открытые по Вашему выбору заказы, по всем видам работ в рамках выбранного бюджета.</p>
                                <span><img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/line.png`} width="322" height="101" alt="line" loading="lazy"/></span>
                            </div>
                            <span className={css.sp}>Д В А</span>
                        </div>
                    </div>
                </div>

                <div className={`row bet`}>
                    <div className={css.m4}>
                        <h2>Вам доступен весь функционал сервиса</h2>
                        <div className={`col ${css.m3}`}>
                            <div>
                                <p><span>Биржа заказов</span><br/>Отправка предложений заказчикам в любой категории выбранной Вами без ограничений.</p>
                            </div>
                            <div>
                                <p><span>Открытые чаты</span><br/>Обсуждение сроков, условий, цен.<br/>Обмен телефонами.<br/><br/> Договоренность с заказчиком о взаимодействии напрямую, вне сервиса.</p>
                            </div>
                    <div className={`center ${css.b1}`}>
                        <Link href="/registration">
                            <a>Зарегистрироваться</a>
                        </Link>
                </div>
                        </div>
                    </div>
                    <img className={css.img3} src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/niceblock.png`} alt="formasters" width="705" height="367" loading="lazy"/>
                </div>

                <section className={css.i3}>
                    <img src={`${process.env.NEXT_PUBLIC_STATIC_URL}/public/images/formasters/we.png`} width="280" height="30" alt="one" loading="lazy"/>
                </section>

            </main>
        </PublicLayout>
    )
}

export default ForMasters