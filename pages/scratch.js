import {useEffect, useContext, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {organizeCats} from "libs/arrs";
import {slugify, translit} from "libs/slugify";

const Scratch = () => {
    //TODO find duplicate slugs and make them unique
    const { request, wsMsg } = useContext(WsContext);
    const [cats, setCats] = useState([]);

    //check out incoming data
    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type !== "info") {
            console.log(wsMsg);
            return false
        }
        const msg = JSON.parse(wsMsg.data);
        if(Array.isArray(msg.data)) {
            if(msg.data[1].hasOwnProperty('created_at')) {
                setCats(organizeCats(msg.data)[1].children)
            }
        }
    }, [wsMsg]);

    const checkStuff = () => {
        console.log('button pushed...')
        const goData = {
            address: 'auth:50003',
            action: 'read-towns',
            instructions: JSON.stringify({country_id:1})
        };
        //request(JSON.stringify(goData));
    }

    return (
        <main className={'row center'}>
            <div className={'col start'}>
                <h1>Практика</h1>
                <button onClick={checkStuff}>Делать!</button>
            </div>
            <style jsx>{`
                div {
                    padding:30px;
                    width: 100%;
                    max-width: 300px;
                    text-align: center
                }
            `}</style>
        </main>
    )
}

export default Scratch