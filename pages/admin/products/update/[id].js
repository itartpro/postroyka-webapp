import AdminLayout from 'components/admin/admin-layout'
import {useEffect, useState, useContext, useRef} from 'react'
import {WsContext} from 'context/WsProvider'
import {useRouter} from 'next/router'
import css from 'pages/admin/form.module.css'
import css2 from '../products.module.css'
import {FaAngleDown, FaInfoCircle, FaCheck} from 'react-icons/fa'
import {toggleDown} from 'libs/sfx'
import {checkZeroPos, organizeCats, organizeFilterValues} from 'libs/arrs'
import {slugify, translit} from 'libs/slugify'
import UploadProvider from 'context/UploadProvider'
import InputUpload from 'components/input-upload'
import Links from 'components/admin/products/links'
import NotFound from 'components/not-found'
import dynamic from 'next/dynamic'

export default function Update() {

    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const {query} = useRouter();
    const urlId = parseInt(query.id);
    const [form, setForm] = useState({});
    const [filterForm, setFilterForm] = useState({});
    const [catIds, setCatIds] = useState([]);
    const [filters, setFilters] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [imageCache, setImageCache] = useState(Date.now);
    const [showSuccess, setShowSuccess] = useState(false);
    const mainForm = useRef();

    useEffect(() => {
        if (rs !== 1 || !urlId) return false;

        const goData = {
            address: 'products:50005',
            action: 'products-read',
            instructions: JSON.stringify({id: urlId})
        };
        request(JSON.stringify(goData));

        const goData2 = {
            address: 'products:50005',
            action: 'filters-read_all',
            instructions: "{}"
        };
        request(JSON.stringify(goData2));

        const goData3 = {
            address: 'products:50005',
            action: 'filter_values-read_all',
            instructions: "{}"
        };
        request(JSON.stringify(goData3));

        const goData4 = {
            address: 'cats:50004',
            action: 'read_all',
            instructions: "{}"
        };
        request(JSON.stringify(goData4));
    }, [rs, urlId])

    const handleFormChange = e => {
        const t = e.target;
        const counter = t.previousSibling.querySelector('.count');
        if (counter) counter.innerHTML = '[' + t.value.length + ']' || '';
        return setForm(form => ({...form, [t.name]:t.value}));
    };

    const Wysiwyg = dynamic(
        () => import('components/admin/wysiwyg'),
        { ssr: false }
    );
    const text = useRef();
    const appendContent = textFromSunEditor => text.current = textFromSunEditor;

    const handleFilterFormChange = e => {
        const t = e.target;
        return setFilterForm({...filterForm, [t.name]: t.value})
    }

    const handlePcCombosFormChange = el => {
        const check = el.target.checked;
        const val = parseInt(el.target.value);
        if(check && !catIds.includes(val)) {
            catIds.push(val);
            setCatIds([...catIds])
        }
        if(!check && catIds.includes(val)) {
            const newPcCombos = catIds.filter(e => e !== val);
            setCatIds([...newPcCombos])
        }
    }

    const checkPcCombos = id => catIds.includes(id)

    const autoFill = () => {
        form.parent_id = urlId;
        if (!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        if (form.slug) form.slug = slugify(translit(form.slug));
        if (!form.slug) form.slug = slugify(translit(form.name));
        if (!form.title) form.title = form.name;
        if (!form.description) form.description = form.name;
        if (!form.keywords) form.keywords = form.name;
        if (!form.h1) form.h1 = form.name;

        setForm({...form});
    }

    const saveData = () => {
        if(!form.name) return setWsMsg({type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        form.slug = slugify(translit(form.slug || form.name));
        form.price = parseInt(form.price);
        form.text = text.current;
        form.new_price = parseInt(form.new_price);
        form.sort_order = parseInt(form.sort_order);
        if(typeof form.recommended === "string" && form.recommended.length) {
            const noWhiteSpace = form.recommended.replace(/\s+/g, '');
            const recArr = noWhiteSpace.split(',');
            form.recommended = recArr.map(e => parseInt(e));
        } else {
            form.recommended = [];
        }
        const goData = {
            address: 'products:50005',
            action: 'products-update',
            instructions: JSON.stringify(form)
        };
        request(JSON.stringify(goData));

        const pfvCombos = [];
        for (let i in filterForm) {
            pfvCombos.push({
                "filter_id": parseInt(i),
                "product_id": urlId,
                "value_name": filterForm[i]
            })
        }
        const goData2 = {
            address: 'products:50005',
            action: 'pfv_combos-update',
            instructions: JSON.stringify(pfvCombos)
        };
        request(JSON.stringify(goData2));

        const pcCombos = [];
        if(catIds.length) {
            catIds.forEach(e => pcCombos.push({
                "product_id":urlId,
                "cat_id":e
            }))
        } else {
            pcCombos.push({
                "product_id":urlId,
                "cat_id":0
            })
        }
        const goData3 = {
            address: 'products:50005',
            action: 'pc_combos-update',
            instructions: JSON.stringify(pcCombos)
        };
        request(JSON.stringify(goData3));
    };

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if (wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if (res.name === "gpics") {
            setImageCache(Date.now());
            if(res.data.name && res.data.name.split(".")[0] === urlId.toString()) {
                form.image = res.data.name;
                form.short_description = res.data.width + ':' + res.data.height;
                setForm({...form});
                return saveData()
            }
        }
        if (res.name === "cats") {
            const cats = organizeCats(res.data);
            cats.forEach(c => c.id === 2 ? setCatalog(c.children) : null)
        }
        if (res.data && res.data.hasOwnProperty('product')) {
            if (res.data.pfv_combos !== null && res.data.pfv_combos.length) {
                const newFilterForm = {};
                res.data.pfv_combos.forEach(e => {
                    newFilterForm[e.filter_id] = e.value_name;
                });
                setFilterForm({...newFilterForm});
            }
            if (res.data.pc_combos) {
                for(let v of res.data.pc_combos) {
                    catIds.push(v.cat_id)
                }
                setCatIds([...catIds]);
            }
            return setForm(res.data.product);
        }
        if (checkZeroPos(res.data, 'filter_name')) return setFilters(res.data);
        if (checkZeroPos(res.data, 'value_name')) {
            const newFilters = organizeFilterValues(filters, res.data);
            setFilters([...newFilters]);
        }
        if(typeof res.data === 'string' && res.data === "updated successfully") {
            setShowSuccess(true);
            return setTimeout(() => setShowSuccess(false), 2000)
        }
    }, [wsMsg]);

    //this is for some expandable fields to be expanded on default
    const simulateClick = e => {
        if(!e) return false;
        if(!e.nextElementSibling.hasAttribute('style')) e.click();
    }

    return (
        <AdminLayout>
            {form.id && <>
                <Links id={urlId}/>
                <header className={'col start'}>
                    <h1>Редактировать "{form.name}", id: {urlId}</h1>
                </header>
                <form className={css.form} onSubmit={e => e.preventDefault()} ref={mainForm}>

                    <div>
                        <label htmlFor={'name'}>Название <span className="count"/></label>
                        <input type="text"
                               id={'name'}
                               name="name"
                               placeholder="Название категории, например Шорты"
                               maxLength={255}
                               onChange={handleFormChange}
                               value={form.name || ""}
                        />
                    </div>

                    <div>
                        <label htmlFor={'sort_order'}>Ордер сортировки (меньшие впереди)</label>
                        <input type="number" step="1" min="0"
                               id={'sort_order'}
                               name="sort_order"
                               onChange={handleFormChange}
                               value={form.sort_order || ""}
                        />
                    </div>

                    <div>
                        <label htmlFor={'recommended'}>id рекомендуемых товаров (через ",")</label>
                        <input type="text"
                               id={'recommended'}
                               name="recommended"
                               onChange={handleFormChange}
                               placeholder={"15, 29, 32, 6"}
                               value={form.recommended || ""}
                        />
                    </div>

                    <div className={'row start center ' + css.tab} onClick={toggleDown}><FaAngleDown/><h4>SEO общее</h4>
                    </div>
                    <div className={'col start ' + css.folder}>
                        <div>
                            <label htmlFor={'title'}>Title <span className="count"/></label>
                            <input type="text"
                                   id={'title'}
                                   name="title"
                                   placeholder="мета-тэг Title"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.title || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'h1'}>H1 (заглавная строка)<span className="count"/></label>
                            <input type="text"
                                   id={'h1'}
                                   name="h1"
                                   placeholder="Заглавная строка H1"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.h1 || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'description'}>Description (описание) <span className="count"/></label>
                            <input type="text"
                                   id={'description'}
                                   name="description"
                                   placeholder="мета-тэг description"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.description || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'keywords'}>мета-тэг keywords (если оставите пустым он автозаполнится) <span
                                className="count"/></label>
                            <input type="text"
                                   id={'keywords'}
                                   name="keywords"
                                   placeholder="шорты, женская одежда, нижняя одежда"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.keywords || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'author'}>мета-тэг author <span className="count"/></label>
                            <input type="text"
                                   id={'author'}
                                   name="author"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.author || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'slug'}>slug (url) (если оставите пустым он автозаполнится) <span
                                className="count"/></label>
                            <input type="text"
                                   id={'slug'}
                                   name="slug"
                                   placeholder="shorty"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.slug || 0}
                            />
                        </div>

                        <div>
                            <label htmlFor={'short_description'}>Краткое инфо <span className="short_description"/></label>
                            <input type="text"
                                   id={'short_description'}
                                   name="short_description"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.short_description || ""}
                            />
                        </div>

                        <div>
                            <label htmlFor={'extra'}>Дополнительно <span className="count"/></label>
                            <input type="text"
                                   id={'extra'}
                                   name="extra"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.extra || ""}
                            />
                        </div>
                    </div>
                    <br/>

                    <div className={'row start center ' + css.tab} ref={simulateClick} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>Основные характеристики</h4>
                        <div className={css.bubble}>
                            <FaInfoCircle className={'abs'}/>
                            <p>Просто не заполняйте те характеристики которые не нужны для конкретных товаров - и они не
                                будут отображатся в товаре.</p>
                        </div>
                    </div>
                    <div className={'row center ' + css.folder}>
                        <div className={css.shorty}>
                            <label htmlFor={'price'}>Цена</label>
                            <input type="number"
                                   min={0}
                                   max={9223372036854775807}
                                   id={'price'}
                                   name="price"
                                   placeholder="Цена"
                                   onChange={handleFormChange}
                                   value={form.price || 0}
                            />
                        </div>

                        <div className={css.shorty}>
                            <label htmlFor={'new_price'}>Новая цена (если акция)</label>
                            <input type="number"
                                   min={0}
                                   max={9223372036854775807}
                                   id={'new_price'}
                                   name="new_price"
                                   placeholder="Цена"
                                   onChange={handleFormChange}
                                   value={form.new_price || 0}
                            />
                        </div>

                        <div className={css.shorty}>
                            <label htmlFor={'family'}>Идентификатор похожих товаров (можно писать по русски -
                                превратится в
                                латиницу)<span className="count"/></label>
                            <input type="text"
                                   id={'family'}
                                   name="family"
                                   placeholder="shtoto123"
                                   maxLength={255}
                                   onChange={handleFormChange}
                                   value={form.family || ""}
                            />
                        </div>
                    </div>
                    <br/>

                    <div className={'row start center ' + css.tab} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>Значения фильтров</h4>
                        <div className={css.bubble}>
                            <FaInfoCircle className={'abs'}/>
                            <p>Эти значения доступны для любого товара - просто не заполняйте те которые не
                                нужны.<br/><br/>
                                Если нажать на пустое поле, в этих списках выпадают ранее заполненные значения.
                                Если того что Вам нужно в них нет Вы можете вписать новое и оно сохранится.<br/><br/>
                                Чтобы избавится от тех значений которые были заполнены по ошибке - или товаров с
                                такими характеристиками не существует - можете зайти в раздел фильтры затем
                                редактировать
                                или удалить ошибочные/не нужные значения.</p>
                        </div>
                    </div>
                    <div className={'row center ' + css.folder}>
                        {filters && filters.map(f => (
                            <div key={'fil_' + f.id} className={css.shorty}>
                                <label htmlFor={f.id}>{f.filter_name}:</label>
                                <input type="text" name={f.id} value={filterForm[f.id] || ''} list={'fil_' + f.id}
                                       onChange={handleFilterFormChange}/>
                                {f.children && (
                                    <datalist id={'fil_' + f.id}>
                                        {f.children.map(v => <option key={v.id}>{v.value_name}</option>)}
                                    </datalist>
                                )}
                            </div>
                        ))}
                    </div>
                    <br/>

                    <div className={'row start center ' + css.tab} ref={simulateClick} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>Картинка каталога</h4>
                        <div className={css.bubble}>
                            <FaInfoCircle className={'abs'}/>
                            <p>Эта картинка видна в страницах каталога, в мини-карточке товара.</p>
                        </div>
                    </div>
                    <div className={'row center ' + css.folder}>
                        {form.image && <img src={process.env.NEXT_PUBLIC_STATIC_URL + 'products/' + urlId + '/' + form.image + '?' + imageCache}/>}
                        <UploadProvider
                            //these will be props in the context
                            chunkSize={1048576}
                            allowed={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']}
                            address={'gpics:50001'}
                            action={'process'}
                            instructions={{
                                location: 'products/' + urlId,
                                width: 1903,
                                height: 2500,
                                fit: 'Fit',
                                position: 'Top',
                                newname: urlId.toString(),
                                table: '',
                                album_id: urlId,
                                //usually copy is not need for a product image - but in my case (single image) it is needed
                                copy: {folder: 'thumbs', height: 460, width: 380}
                            }}>
                            <InputUpload multiple={false}/>
                        </UploadProvider>
                        <button onClick={() => {
                            const goData = {
                                address: 'gpics:50001',
                                action: 'delete',
                                instructions: JSON.stringify({
                                    id: urlId,
                                    location: 'products/' + urlId,
                                    name: form.image,
                                    table: 'products'
                                })
                            };
                            return request(JSON.stringify(goData));
                        }}>Удалить картинку
                        </button>
                    </div>
                    <br/>

                    <div className={'row start center ' + css.tab} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>Поместить в другие категории каталога</h4>
                    </div>
                    <div className={'col start ' + css.folder}>
                        <ul className={css2.cats}>
                            {catalog.length > 0 && catalog.map(c => (
                                <li key={c.id}>
                                    <label>
                                        {c.name}
                                        <input type="checkbox" name="cats[]" value={c.id}
                                               defaultChecked={checkPcCombos(c.id)}
                                               onChange={handlePcCombosFormChange}/>
                                    </label>
                                    {c.children.length > 0 && <ul>
                                        {c.children.map(c2 => (
                                            <li key={c2.id}>
                                                <label>
                                                    {c2.name}
                                                    <input type="checkbox" name="cats[]" value={c2.id}
                                                           defaultChecked={checkPcCombos(c2.id)}
                                                           onChange={handlePcCombosFormChange}/>
                                                </label>
                                                {c2.children.length > 0 && <ul>
                                                    {c2.children.map(c3 => (
                                                        <li key={c3.id}>
                                                            <label>
                                                                {c3.name}
                                                                <input type="checkbox" name="cats[]" value={c3.id}
                                                                       defaultChecked={checkPcCombos(c3.id)}
                                                                       onChange={handlePcCombosFormChange}/>
                                                            </label>
                                                            {c3.children.length > 0 && <ul>
                                                                {c3.children.map(c4 => (
                                                                    <li key={c4.id}>
                                                                        <label>
                                                                            {c4.name}
                                                                            <input type="checkbox" name="cats[]"
                                                                                   value={c4.id}
                                                                                   defaultChecked={checkPcCombos(c4.id)}
                                                                                   onChange={handlePcCombosFormChange}/>
                                                                        </label>
                                                                    </li>
                                                                ))}
                                                            </ul>}
                                                        </li>
                                                    ))}
                                                </ul>}
                                            </li>
                                        ))}
                                    </ul>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <br/>

                    <div className={'row start center ' + css.tab} onClick={toggleDown}>
                        <FaAngleDown/>
                        <h4>Подробное описание</h4>
                    </div>
                    <div className={'col start ' + css.folder}>
                        <Wysiwyg drop_name={'first'} bodyText={form.text} setBodyText={appendContent} />
                    </div>
                    <br/>

                    <div className="row start">
                        <input type="submit" value="Сохранить" onClick={saveData}/>
                        <input type="submit" value="Автозаполнение" onClick={autoFill}/>
                        <a href="/admin/cats" className={css.cancel}>Отменить</a>
                    </div>

                </form>
                {showSuccess && <div className={'row center ' + css.success}><FaCheck/> Сохранено</div>}
            </> || <NotFound/>}
        </AdminLayout>
    )
}