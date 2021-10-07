import PublicLayout from "components/public/public-layout";
import formCSS from "styles/forms.module.css";
import css from "./add.module.css";

const Add = () => {
    return (
        <PublicLayout>
            <main className="col start max">
                <h1 style={css.h1}>Добавить заказ</h1>
                <form className={'col start '+formCSS.form}>
                    <label>Что нужно сделать?</label>
                    <input type="text" name="in1"/>
                </form>
            </main>
        </PublicLayout>
    )
}