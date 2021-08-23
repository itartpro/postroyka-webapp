import AdminLayout from 'components/admin/admin-layout'
import css from '../../form.module.css'
import {useState, useContext, useEffect} from 'react'
import {WsContext} from 'context/WsProvider'
import {translit, slugify} from 'libs/slugify'
import {useRouter} from 'next/router'
import {nowToISO} from 'libs/js-time-to-psql'

export default function Create() {

    const router = useRouter();
    const urlId = parseInt(router.query.parent_id);
    const [form, setForm] = useState({});
    const [parent, setParent] = useState({})

    const handleChange = e => {
        const t = e.target;
        const counter = t.previousSibling.querySelector('.count');
        if(counter) counter.innerHTML = '['+ t.value.length +']' || ''
        return setForm({...form, [t.name]: t.value});
    }

    const {wsMsg, setWsMsg, rs, request} = useContext(WsContext)

    useEffect(() => {
        if(rs !== 1) return false;
        if(urlId !== 0) {
            const goData = {
                address: 'cats:50004',
                action: 'read',
                instructions: JSON.stringify({id:urlId})
            };
            return request('crud', JSON.stringify(goData))
        }

    }, [router.query, rs])

    const saveData = () => {
        form.parent_id = urlId;
        if(!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        form.created_at = nowToISO();
        form.slug = slugify(translit(form.slug || form.name));
        if(form.sort_order) form.sort_order = parseInt(form.sort_order);

        const goData = {
            address: 'cats:50004',
            action: 'create',
            instructions: JSON.stringify(form)
        }
        request('crud', JSON.stringify(goData))
    }

    const autoFill = () => {
        form.parent_id = urlId;
        if(!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        if(form.slug)  form.slug = slugify(translit(form.slug));
        if(!form.slug) form.slug = slugify(translit(form.name));
        if(!form.title) form.title = form.name;
        if(!form.description) form.description = form.name;
        if(!form.keywords) form.keywords = form.name;
        if(!form.h1) form.h1 = form.name;

        setForm({...form});
    }

    const clearAll = () => setForm({});

    useEffect(() => {
        if (wsMsg && wsMsg.hasOwnProperty('data') && typeof wsMsg.data === 'string') {
            if (wsMsg.data.substr(9, 4) === "cats") {
                const res = JSON.parse(wsMsg.data);
                if(!res.status) return setWsMsg({type: 'alert:red', data: res.data});
                if(parseInt(res.data.parent_id) === urlId) {
                    return router.push('/admin/cats/update/[id]', '/admin/cats/update/'+res.data.id);
                }
                setParent(res.data)
            }
            if(wsMsg.type === "error") {
                if (wsMsg.data.substr(0, 25) === "Couldn't do unary on crud") {
                    const resp = wsMsg.data.split(" = ");
                    if(resp[3]) return setWsMsg({type: 'alert:red', data: resp[3]});
                }
                return setWsMsg({type: 'alert:red', data: wsMsg.data});
            }
        }
    }, [wsMsg])

    //parent_id, name, slug, title, description, keywords, author, h1, text, image, sort_order, created_at, extra
    return (
        <AdminLayout>
            <header className={'col start'}>
                <h1>{
                    urlId === 0 && "Новая главная категория" ||
                    "Добавить под-раздел категории "+parent.name
                }</h1>
            </header>
            <section className={'col start'}>
                <form className={css.form} onSubmit={e => e.preventDefault()}>
                    <div>
                        <label htmlFor={'name'}>Название <span className="count"/></label>
                        <input type="text"
                               id={'name'}
                               name="name"
                               placeholder="Название категории, например Шорты"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.name || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'title'}>мета-тэг title (если оставите пустым он автозаполнится) <span className="count"/></label>
                        <input type="text"
                               id={'title'}
                               name="title"
                               placeholder="Купить шорты такие-то в интернет магазине каком-то"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.title || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'h1'}>H1 (если оставите пустым он автозаполнится) <span className="count"/></label>
                        <input type="text"
                               id={'h1'}
                               name="h1"
                               placeholder="Купить женские шорты такие-то"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.h1 || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'description'}>мета-тэг description (если оставите пустым он автозаполнится) <span className="count"/></label>
                        <input type="text"
                               id={'description'}
                               name="description"
                               placeholder="Купить шорты недорого и со скидкой в интернет магазине каком-то, а также другую мужскую и женскую одежду"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.description || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'keywords'}>мета-тэг keywords (если оставите пустым он автозаполнится) <span className="count"/></label>
                        <input type="text"
                               id={'keywords'}
                               name="keywords"
                               placeholder="шорты, женская одежда, нижняя одежда"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.keywords || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'author'}>мета-тэг author <span className="count"/></label>
                        <input type="text"
                               id={'author'}
                               name="author"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.author || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'slug'}>slug (url) (если оставите пустым он автозаполнится) <span className="count"/></label>
                        <input type="text"
                               id={'slug'}
                               name="slug"
                               placeholder="shorty"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.slug || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'sort_order'}>Ордер сортировки (меньшие впереди)</label>
                        <input type="number" step="1" min="1"
                               id={'sort_order'}
                               name="sort_order"
                               placeholder="1"
                               onChange={handleChange}
                               value={form.sort_order || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor={'extra'}>Дополнительно <span className="count"/></label>
                        <input type="text"
                               id={'extra'}
                               name="extra"
                               maxLength={255}
                               onChange={handleChange}
                               value={form.extra || ''}
                        />
                    </div>

                    <div className="row start">
                        <input type="submit" value="Сохранить" onClick={saveData}/>
                        <input type="submit" value="Автозаполнение" onClick={autoFill}/>
                        <a className={css.cancel} role="button" onClick={clearAll}>Отменить</a>
                    </div>

                </form>
            </section>
        </AdminLayout>
    );
}