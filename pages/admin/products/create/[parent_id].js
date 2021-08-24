import AdminLayout from 'components/admin/admin-layout'
import {useEffect, useState, useContext} from 'react'
import {WsContext} from 'context/WsProvider'
import {useRouter} from 'next/router'
import css from 'pages/admin/form.module.css'
import {FaAngleDown} from 'react-icons/fa'
import {toggleDown} from 'libs/sfx'
import {slugify, translit} from 'libs/slugify';

export default function Create() {

    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const [category, setCategory] = useState({})
    const [form, setForm] = useState({});
    const router = useRouter();
    const urlId = parseInt(router.query.parent_id);

    useEffect(() => {
        if(rs !== 1 || !urlId) return false;
        const goData = {
            address: 'cats:50004',
            action: 'read',
            instructions: JSON.stringify({id:urlId})
        };
        request(JSON.stringify(goData))
    }, [rs, urlId])

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if(wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if(wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if(res.name === "cats" && !res.status) return router.push('/admin/cats');
        if(res.name === "cats" && res.status) setCategory(res.data);
        if(res.name === "products" && !res.status) return setWsMsg({type: 'alert:red', data: res.data});
        if(res.name === "products" && res.status) return router.push('/admin/products/update/'+res.data.id);
    }, [wsMsg]);

    const handleChange = e => {
        const t = e.target;
        const counter = t.previousSibling.querySelector('.count');
        if(counter) counter.innerHTML = '['+ t.value.length +']' || ''
        return setForm({...form, [t.name]: t.value});
    };

    const autoFill = () => {
        if(!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        if(form.slug)  form.slug = slugify(translit(form.slug));
        if(!form.slug) form.slug = slugify(translit(form.name));
        if(!form.title) form.title = form.name;
        if(!form.description) form.description = 'Купить '+category.name+' '+form.name;
        if(!form.keywords) form.keywords = category.name+', '+form.name;
        if(!form.h1) form.h1 = form.name;

        setForm({...form});
    }

    const saveData = () => {
        if(!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        form.slug = slugify(translit(form.slug || form.name));
        form.cat_id = urlId;
        const goData = {
            address: 'products:50005',
            action: 'products-create',
            instructions: JSON.stringify(form)
        };
        request(JSON.stringify(goData));
    }

    const clearAll = () => setForm({});

    return (
        <AdminLayout>
            <header className={'col start'}>
                <h1>Добавить новый товар в категории "{category.name}"</h1>
            </header>
            <p className={css.pad}>Просто напишите имя для товара, он сохранится в базу а далее вы сможете редактировать его характеристики.</p><br/>
            <p className={css.pad}>SEO тэги и заглавную можно заполнить сейчас, но проще дать системе их автозаполнить</p><br/>
            <form className={css.form} onSubmit={e => e.preventDefault()}>
                <div>
                    <label htmlFor={'name'}>Название <span className="count"/></label>
                    <input type="text"
                           id={'name'}
                           name="name"
                           placeholder="Название товара, например Шорты"
                           maxLength={255}
                           onChange={handleChange}
                           value={form.name || ''}
                    />
                </div>
                <div className={'row start center '+css.tab} onClick={toggleDown}><FaAngleDown/><h4>SEO общее</h4></div>
                <div className={'col start '+css.folder}>
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

                    <div className="row start">
                        <input type="submit" value="Автозаполнение" onClick={autoFill}/>
                    </div>
                </div>
                <br/>
                <div className="row start">
                    <input type="submit" value="Сохранить" onClick={saveData}/>
                    <a className={css.cancel} role="button" onClick={clearAll}>Отменить</a>
                </div>
            </form>
        </AdminLayout>
    );
}