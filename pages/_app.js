import 'styles/globals.css'
import WsProvider from '../context/WsProvider'

export default function App({Component, pageProps}) {
    return (
        <WsProvider>
            <Component {...pageProps} />
        </WsProvider>
    )
}