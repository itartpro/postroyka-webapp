import css from './info.module.css';

export const Info = ({user, services, choices}) => {
    return (
        <section className={`col start ${css.left}`}>
            <b>Об исполнителе</b>
            <div>
                <pre>{user && user.about}</pre>
            </div>
            <ul>
                <li>
                    <p>Ремонт офисов и нежилых помещений</p>
                    <ul className={`bet`}>
                        <li><p>Капитальный ремонт офисов</p><span>от 1 500 ₽/м²</span></li>
                        <li><p>Капитальный ремонт офисов</p><span>от 1 500 ₽/м²</span></li>
                        <li><p>Капитальный ремонт офисов</p><span>от 1 500 ₽/м²</span></li>
                    </ul>
                </li>
            </ul>
            <ul>
                {services && services.map(parent => parent && parent.children.map(c => (
                <li key={'is'+c.id}>
                    <p>{c.name}</p>
                    <ul className={`bet`}>
                        {c.children.map(e => {
                            if(choices[e.id]) {
                                return (
                                    <li key={'isc'+e.id}><p>{e.name}</p><span>от {choices[e.id].price} ₽/{e.extra}</span></li>
                                )
                            }
                        })}
                    </ul>
                </li>
                )))}
            </ul>
        </section>
    )
}