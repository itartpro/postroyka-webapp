import css from './drop-upload.module.css'
import {useState, useContext} from 'react'
import {UploadContext} from 'context/UploadProvider'
import ProgressBar from './progress-bar'

export default function DropUpload(props) {

    //The following code should be reused in another part of app dealing with uploads
    const {rs, done, parts, remains, setRemains, setPause, completed, upload} = useContext(UploadContext);
    const [show, setShow] = useState(false);
    const dragEnter = () => setShow(true);
    const dragEnd = () => setShow(false);
    const prevDef = e => {
        e.stopPropagation();
        e.preventDefault();
    }
    const fileDrop = e => {
        if (rs !== 1) return false;
        if (remains && remains.length) return false;

        e.stopPropagation();
        e.preventDefault();
        setRemains(Array.from(e.dataTransfer.files));
    }
    const handleDropClick = e => {
        if (rs !== 1) return false;
        if (remains && remains.length) e.preventDefault();
    }
    const handleFileInput = e => setRemains(Array.from(e.target.files));

    return (
        //throw props from Banners to UploadProvider
        <label key={props.name} htmlFor={`wsupinput${props.name}`} onDragOver={prevDef} onDragEnter={prevDef}
               onDragLeave={prevDef} onDrop={fileDrop} onClick={handleDropClick}>
            <input type="file" multiple id={`wsupinput${props.name}`} onChange={handleFileInput}/>
            <div onDragEnd={dragEnd} onDragLeave={dragEnd} onDragEnter={dragEnter} onDrop={dragEnd}
                 className={'col center ' + css.drop}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path fill="none" stroke="#202020" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M31 48V3M16 20L31 3l15 16"/>
                    <path fill="none" stroke="#202020" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M8 46v16h46V46"/>
                </svg>
                <p>Нажмите или перетащите файлы сюда для загрузки</p>
                {show && <div className={'col center ' + css.overlay}>Похоже на файлы...</div>}
            </div>
            {parts > 0 && (<button style={{
                fontSize: '1rem',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                boxShadow: '0 2px 2px rgba(0,0,0,0.5)'
            }} onClick={() => setPause(true)}>Остановить/Поставить на паузу загрузку.
                (Возобновить можно в течении 3х часов, иначе загруженные данные удаляются.) </button>)}
            {props.showProgress &&
            <>
                <ul className={'col start'}>
                    {done && done.map((el, i) => (<li key={'pro' + i}>{el}</li>))}
                </ul>
                {remains && remains.length > 0 &&
                <ProgressBar
                    bgcolor={"#39bbe1"}
                    completed={(Math.ceil(done.length / (done.length + remains.length) * 100))}
                    name={"Все файлы"}/>
                }
                {upload && <ProgressBar bgcolor={"#2aa29e"} completed={completed} name={upload.name}/>}
            </>}

            <style jsx>{`
            input[type=file] {
              display: none;
              pointer-events: none
            }
            ul {
              list-style: none
            }
            li {
              margin-bottom: 5px;
              padding: 5px 15px;
              color: green
            }
        `}</style>
        </label>
    )
}