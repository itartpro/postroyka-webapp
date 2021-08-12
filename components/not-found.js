export default function NotFound() {
    return (
        <main>
            <section>
                <h1>404 - Страница не найдена</h1>
                <br/>
                <a href="/">Вернутся на главную</a>
            </section>
            <style global jsx>{`
              main {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                text-align: center;
              }
              
              a {
                color: #0070f3!important
              }
            `}</style>
        </main>
    )
}