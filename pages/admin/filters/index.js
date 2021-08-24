import AdminLayout from 'components/admin/admin-layout'
import css from '../form.module.css'
import {useState, useContext, useEffect} from 'react'
import {WsContext} from 'context/WsProvider'
import FilterForm from 'components/admin/filters/filter-form'

export default function Filters() {

    const {wsMsg, rs, setWsMsg, request} = useContext(WsContext);
    const [form, setForm] = useState({filter_name: null});
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        if(rs !== 1) return
        const goData = {
            address: 'products:50005',
            action: 'filters-read_all',
            instructions: ""
        };
        request(JSON.stringify(goData));
    }, [rs]);

    const saveNewFilter = () => {
        if (!form.filter_name) return setWsMsg({
            type: 'alert:red',
            data: `Необходимо заполнить поле "Название"`
        });
        const goData = {
            address: 'products:50005',
            action: 'filters-create',
            instructions: JSON.stringify(form)
        };
        request(JSON.stringify(goData));
        setForm({filter_name: null});
    }

    const formChange = e => {
        const t = e.target;
        return setForm({...form, [t.name]: t.value});
    };

    const organizeFilters = arr => arr.sort((a,b) => a.filter_name.localeCompare(b.filter_name));

    useEffect(() => {
        if (!wsMsg || !wsMsg.hasOwnProperty('data')) return false;
        if (wsMsg.type === "error") return setWsMsg({type: 'alert:red', data: wsMsg.data});
        if (wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        if (!res.status) return setWsMsg({type: 'alert:red', data: res.data});
        if(res.name !== "products") return false;
        if(Array.isArray(res.data)) return setFilters(organizeFilters(res.data));
        if (res.data.hasOwnProperty('filter_name')) return setFilters(filters => organizeFilters([...filters, res.data]))
        if(typeof res.data === 'string' && res.data.substr(0, 20) === "deleted from filters") {
            let id = parseInt(res.data.substr(21));
            let newFilters = filters.filter(el => el.id !== id);
            return setFilters(filters => organizeFilters([...newFilters]))
        }
        if(res.data === "updated successfully") return setWsMsg({type: 'alert:green', data: res.data});
    }, [wsMsg])

    return (
        <AdminLayout>
            <header className={'row'}><h1>Филтры</h1></header>
            <form className={css.form} onSubmit={e => e.preventDefault()}>
                <h2>Добавить</h2>
                <br/>
                <div>
                    <label htmlFor={'filter_name'}>Название</label>
                    <input type="text"
                           id={'filter_name'}
                           name="filter_name"
                           placeholder='Название фильтра, например "Материал"'
                           maxLength={255}
                           onChange={formChange}
                           value={form.filter_name || ''}
                    />
                </div>
                <input type="submit" value="Сохранить" onClick={saveNewFilter}/>
            </form>
            <br/><br/>
            {filters.length && <section>
                <h2>Редактировать</h2>
                <br/>
                {filters.map(el => <FilterForm key={el.id} {...el}/>)}
            </section>}
        </AdminLayout>
    );
}