import AdminLayout from 'components/admin/admin-layout'
import css from '../../form.module.css'
import {useState, useContext, useEffect} from 'react'
import {useRouter} from 'next/router'
import {WsContext} from 'context/WsProvider'
import ValueForm from 'components/admin/filters/value-form'

export default function Values() {

    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const [filter, setFilter] = useState({});
    const [values, setValues] = useState([]);
    const {query} = useRouter();
    const urlId = parseInt(query.id);
    const [form, setForm] = useState({});

    useEffect(() => {
        if(rs !== 1 || !urlId) return false;
        const goData = {
            address: 'products:50005',
            action: 'filter_values-read_group',
            instructions: JSON.stringify({id:urlId})
        };
        request(JSON.stringify(goData));
    }, [rs, urlId]);

    const saveNewValue = () => {
        form.filter_id = urlId;
        if (!form.value_name) return setWsMsg({
            type: 'alert:red', data: `Необходимо заполнить поле "Название"`});
        const goData = {
            address: 'products:50005',
            action: 'filter_values-create',
            instructions: JSON.stringify(form)
        };
        request(JSON.stringify(goData));
        setForm({filter_id:urlId, value_name: null});
    }

    const formChange = e => {
        const t = e.target;
        return setForm({...form, [t.name]: t.value});
    };

    const organizeValues = arr => arr.sort((a,b) => a.value_name.localeCompare(b.value_name));

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if (wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if (!res.status) return setWsMsg({type: 'alert:red', data: res.data});
        if (res.name !== "products") return false;
        if (res.data.hasOwnProperty("filter") && res.data.hasOwnProperty("filter_values")) {
            setFilter(res.data.filter);
            setValues(res.data.filter_values || []);
        }
        if (res.data.hasOwnProperty('value_name')) return setValues(values => organizeValues([...values, res.data]))
        if(typeof res.data === 'string' && res.data.substr(0, 26) === "deleted from filter_values") {
            let id = parseInt(res.data.substr(27));
            let newValues = values.filter(el => el.id !== id);
            return setValues(values => organizeValues([...newValues]))
        }
        if(res.data === "updated successfully") return setWsMsg({type: 'alert:green', data: res.data});
    }, [wsMsg])

    return (
        <AdminLayout>
            <header className={'row'}><h1>Редактировать значения фильтра "{filter.filter_name}"</h1></header>
            <form className={css.form} onSubmit={e => e.preventDefault()}>
                <h2>Добавить</h2>
                <br/>
                <div>
                    <label htmlFor={'value_name'}>Название</label>
                    <input type="text"
                           id={'value_name'}
                           name="value_name"
                           placeholder='Название значения, например "Метал" или "Дерево" если фильтр это "Материал"'
                           maxLength={255}
                           onChange={formChange}
                           value={form.value_name || ''}
                    />
                </div>
                <input type="submit" value="Сохранить" onClick={saveNewValue}/>
            </form>
            <br/><br/>
            {values.length && <section>
                <h2>Редактировать</h2>
                <br/>
                {values.map(el => <ValueForm key={el.id} {...el}/>)}
            </section>}
        </AdminLayout>
    );
}