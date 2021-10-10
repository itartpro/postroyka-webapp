import PublicLayout from "components/public/public-layout";
import formCSS from "styles/forms.module.css";
import css from "./add.module.css";

const Add = () => {
    return (
        <PublicLayout>
            <main className="col start max">
                <h1 className={css.h1}>Добавить заказ</h1>
                <form className={'col start ' + formCSS.form}>
                    <label className={css.tyt}><span>Что нужно сделать?</span></label>

                    <div className={css.tab}>
                        <h3>Начните с заголовка. Например:</h3>
                        <p><span>○</span> Требуется ремонт в квартире</p>
                        <p><span>○</span> Укладка ламината в офисе</p>
                        <p><span>○</span> Строительство дома</p>
                    </div>
                    <div className={css.in1}>
                        <input type="text" name="in1"/>
                    </div>
                </form>
                <form className={'col start ' + formCSS.form}>
                    <label className={css.tyt}><span>Укажите объем и виды работ</span></label>

                    <div className={css.tab}>
                        <h3>Какую работу нужно сделать?</h3>
                        <p><span>○</span> Напишите список работ</p>
                        <p><span>○</span> Укажите объём работ в квадратных метрах, штуках или в другой подходящей единице измерения</p>
                        <p><span>○</span> Опишите ваши пожелания и требования, если они есть</p>
                    </div>
                    <div className={css.in1}>
                        <input type="text" name="in1"/>
                    </div>
                </form>
            </main>
        </PublicLayout>
    )
}

export default Add