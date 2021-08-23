import {useRouter} from 'next/router'
import AdminLayout from 'components/admin/admin-layout'
import Links from 'components/admin/products/links'
import css from 'pages/admin/form.module.css'
import css2 from './variants.module.css'
import {useState, useEffect, useContext} from 'react'
import {WsContext} from 'context/WsProvider'
import {checkZeroPos} from 'libs/arrs'

export default function Images() {
    const {query} = useRouter();
    const urlId = parseInt(query.id);
    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);

    const [newSizes, setNewSizes] = useState('');
    const [pVars, setPVars] = useState([]);
    const [pVarsForm, setPVarsForm] = useState({});

    useEffect(() => {
        if (rs !== 1 || !urlId) return false;
        const goData = {
            address: 'products:50005',
            action: 'products-read',
            instructions: JSON.stringify({id: urlId})
        };
        request('crud', JSON.stringify(goData));
    }, [rs, urlId]);

    useEffect(() => {
        const form = {};
        pVars.length && pVars.forEach(e => form[e.id] = e);
        return setPVarsForm(form);
    }, [pVars]);

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if (wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if (!res.status) return setWsMsg({type: 'alert:red', data: res.data});
        if (res.data.hasOwnProperty('p_vars')) return setPVars([...res.data.p_vars]);
        if (checkZeroPos(res.data, 'units_left')) return setPVars([...res.data]);
        if (typeof res.data === "string" && res.data.substr(0, 13) === "p_var deleted") {
            const id = parseInt(res.data.split(":")[1]);
            const newArr = pVars.filter(e => e.id !== id)
            return setPVars([...newArr]);
        }
    }, [wsMsg]);

    const handlePVarsChange = e => {
        const t = e.target;
        const id = t.dataset.id;
        if(t.name === "value") {
            pVarsForm[id][t.name] = t.value;
        } else {
            pVarsForm[id][t.name] = parseInt(t.value);
        }
        setPVarsForm(pVarsForm => ({...pVarsForm}));
    }

    const saveData = () => {
        const newArr = Object.values(pVarsForm)
        console.log(newArr);
    }

    const deleteData = e => {
        const goData = {
            address: 'products:50005',
            action: 'p_vars-delete',
            instructions: e.target.dataset.id
        };
        request('crud', JSON.stringify(goData));
    }

    const makeFastSizes = () => {
        if(newSizes.length) {
            const noWhiteSpace = newSizes.replace(/\s+/g, '');
            const newArr = noWhiteSpace.split(',');
            const newPVars = [];
            newArr.forEach(e => {
                newPVars.push({
                    price:0,
                    product_id:urlId,
                    units_left:1,
                    value:e
                })
            });
            const goData = {
                address: 'products:50005',
                action: 'p_vars-update',
                instructions: JSON.stringify(newPVars)
            };
            request('crud', JSON.stringify(goData));
        }
    }

    return (
        <AdminLayout>
            <Links id={urlId}/>
            <header className={'col start'}>
                <h1>Редактировать варианты товара, id: {urlId}</h1>
            </header>
            <section className={'row '+css2.sec}>
                <div className={'row '+css2.forms}>
                    <div className={'col start'}>
                        <b>Редактировать</b>
                        <p>* Если оставить цену пустой будет использоватся основная цена товара</p>
                        <p>* Если на Вашем сайте остатки не имеют значения оставьте поле "Сколько осталось" с 1</p>
                        <b>В этом разделе нажимая на одну кнопку сохранить сохраняется всё.</b>
                        <br/>
                    </div>

                    {pVars.length > 0 && pVars.map(p => pVarsForm[p.id] && (
                        <form key={p.id} className={css.form} onSubmit={e => e.preventDefault()}>
                            <div>
                                <label htmlFor={'value'+p.id}>Значение варианта</label>
                                <input type="text" id={'value'+p.id} name="value"
                                       placeholder="40" maxLength={255}
                                       value={pVarsForm[p.id].value}
                                       data-id={p.id}
                                       onChange={handlePVarsChange}
                                />
                            </div>
                            <div>
                                <label htmlFor={'price'+p.id}>Цена</label>
                                <input type="number" step="1" min="0" max="9223372036854775807"
                                       id={'price'+p.id} name="price" placeholder="1200"
                                       value={parseInt(pVarsForm[p.id].price)}
                                       data-id={p.id}
                                       onChange={handlePVarsChange}
                                />
                            </div>
                            <div>
                                <label htmlFor={'units_left'+p.id}>Сколько осталось</label>
                                <input type="number" step="1" min="0" max="2147483647"
                                       id={'units_left'+p.id} name="units_left" placeholder="1"
                                       value={pVarsForm[p.id].units_left}
                                       data-id={p.id}
                                       onChange={handlePVarsChange}
                                />
                            </div>
                            <div className="row">
                                <input type="submit" value="Сохранить" onClick={saveData}/>
                                <input type="submit" value="Удалить" data-id={p.id} onClick={deleteData}/>
                            </div>
                        </form>
                    ))}
                </div>
                <div className={'col start '+css2.quick}>
                    <form className={css.form} onSubmit={e => e.preventDefault()}>
                        <b>Заполнить размеры быстро!</b>
                        <p>- Просто напишите размеры через запятую (типо 40, 42, 44, 46, 48) и они сделаются</p>
                        <p>- Можно написать один размер/вариант - просто без запятой</p>
                        <br/>
                        <div>
                            <label htmlFor={'sizes'}>Варианты/размеры</label>
                            <input type="text"
                                   id={'sizes'}
                                   name="sizes"
                                   placeholder="40, 42, 44, 46"
                                   maxLength={255}
                                   onChange={e => setNewSizes(e.target.value)}
                                   value={newSizes}
                            />
                        </div>
                        <div className="row">
                            <input type="submit" value="Сделать" onClick={makeFastSizes}/>
                        </div>
                    </form>
                </div>
            </section>
        </AdminLayout>
    )
}