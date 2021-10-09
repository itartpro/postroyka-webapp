import css from './info.module.css';

export const Info = ({user, services, choices}) => {

    return (
        <section className={`col start ${css.left}`}>
            <b>Об исполнителе</b>
            <div><pre>{user && user.about}</pre></div>
            {services && services.map(s => s.children.length > 0 && (
                <ul className={'bet'}>
                    {s.children.map(c => (
                        <li key={'sc'+c.id}>
                            <p>{c.name}</p>
                            {c.children.length > 0 && (
                                <ul className={'bet'}>
                                    {c.children.map(e => (
                                        <li key={'sce'+e.id}>
                                            <p>{e.name}</p>
                                            <span>от {choices[e.id].price} ₽/{e.extra}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ))}
        </section>
    )
}