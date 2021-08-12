import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        //const url = this.props.__NEXT_DATA__.page; //for custom stuff
        return (
            <Html>
                <Head />
                <body itemscope=" " itemtype="http://schema.org/Organization">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument