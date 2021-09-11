import PublicLayout from "components/public/public-layout";
import Link from 'next/link';
import css from 'styles/for-masters.module.css';

const ForMasters = () => {
    return (
        <PublicLayout>
            <main className={'row bet max center'}>
                <div className={`col`}>
                    <div className={`row`}>
                        <div className={`col ${css.m1}`}>
                            <h1>Получите заказы уже сегодня</h1>
                            <div className={css.p1}>
                                <p>Построй Ка - тут вы возьмете заказ по профилю, типу сложности и комфортной цене</p>
                                <img src="/images/master1.png" alt="master" loading="lazy"/>
                            </div>
                            <div className={css.p1}>
                                <p>Предложите свои услуги любому заказчику и найчнете работайте с ним напрямую</p>
                                <img src="/images/master2.png" alt="master" loading="lazy"/>
                            </div>
                            <div className={css.p1}>
                                <style>{`
                                     p:nth-child(2) {
                                       color: #47CB43;
                                     }                    
                                `}</style>
                                <p>Абсолютно бесплатно и без комиссии</p>
                                <img src="/images/master3.png" alt="master" loading="lazy"/>
                            </div>
                        </div>
                        <img className={css.m2} src="/images/formasters.png" alt="formasters" loading="lazy"/>
                    </div>
                    <div className={`center ${css.b1}`}>
                        <Link href="/registration">
                            <a>Получить заказы</a>
                        </Link>
                    </div>
                </div>


                <div className={css.g1}>
                    <h1>Возьмите заказ на раз – два</h1>
                    <div className={`row bet`}>
                        <div>
                            <div className={`row bet ${css.ho}`}>
                                <img src="/images/imgone.png" alt="one" loading="lazy"/>
                                <p><span>Зарегистрируйтесь</span>
                                    <br/>Заказчики хотят видеть, с кем они имеют дело. <br/>Чем больше информации вы
                                    заполните, тем чаще вас будут выбирать.</p>
                                <span><img src="/images/Line.png" alt="line"/></span>
                            </div>
                            <span className={css.sp}>Р А З</span>
                        </div>
                        <div>
                            <div className={`row bet ${css.ho}`}>
                                <img src="/images/imgtwo.png" alt="one" loading="lazy"/>
                                <p><span>Выбирайте интересные вам заказы</span>
                                    <br/>ЗВам будут доступны все открытые по Вашему выбору заказы, по всем видам работ в рамках выбранного бюджета.</p>
                                <span><img src="/images/Line.png" alt="line"/></span>
                            </div>
                            <span className={css.sp}>Д В А</span>
                        </div>
                    </div>
                </div>


            </main>
        </PublicLayout>
    )
}

export default ForMasters