import css from './right-info.module.css';

export const RightInfo = props => {
    return (
        <aside className={`col start ${css.rig}`}>
            <b>Расположение</b>
            <p><span><img src="/images/profilermaster/geo.png" width="18" height="21" alt="geo" loading="lazy"/>
</span>Кабардино-Балкарская Республика</p>
            <blockquote>Выезд на объекты</blockquote>
        </aside>
    )
}