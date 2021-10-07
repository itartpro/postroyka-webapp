import PublicLayout from "components/public/public-layout";
import {Order} from "components/public/order";

const Orders = () => {
    return (
        <PublicLayout>
            <br/>
            <main className="col start max">
                <header className="row start">
                    <h1>Все заказы</h1>
                </header>
                <br/>
                <Order/>
                <Order/>
                <Order/>
            </main>
        </PublicLayout>
    )
}

export default Orders