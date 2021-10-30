import {useEffect, useContext, useState} from 'react';
import {WsContext} from 'context/WsProvider';
import {organizeCats} from "libs/arrs";
import {slugify, translit} from "libs/slugify";

const Scratch = () => {
    const { request, wsMsg } = useContext(WsContext);
    const [cats, setCats] = useState([]);
    const [regions, setRegions] = useState([]);
    const [towns, setTowns] = useState([]);

    //check out incoming data
    useEffect(() => {
        if(!wsMsg) return false;
        console.log(wsMsg);
        if(wsMsg.type !== "info") {
            console.log(wsMsg);
            return false
        }
        const msg = JSON.parse(wsMsg.data);
        if(Array.isArray(msg.data)) {
            if(msg.data[1].hasOwnProperty('created_at')) {
                setCats(organizeCats(msg.data)[1].children)
            }
            if(msg.data[0].hasOwnProperty('country_id')) {
                setRegions(msg.data)
            }
            if(msg.data[0].hasOwnProperty('region_id')) {
                setTowns(msg.data)
            }
        }
    }, [wsMsg]);

    useEffect(() => {
        if(regions.length > 0) {
            regions.forEach(e => {
                const goData = {
                    address: 'auth:50003',
                    action: 'update-cell',
                    instructions: JSON.stringify({
                        id: e.id,
                        column: "slug",
                        value: slugify(translit(e.name)),
                        table: "towns"
                    })
                };
                //request(JSON.stringify(goData));
            })
        }
    }, [regions])

    useEffect(() => {
        if(towns.length > 0) {
            towns.forEach(e => {
                const goData = {
                    address: 'auth:50003',
                    action: 'update-cell',
                    instructions: JSON.stringify({
                        id: e.id,
                        column: "slug",
                        value: slugify(translit(e.name)),
                        table: "towns"
                    })
                };
                //request(JSON.stringify(goData));
            })
        }
    }, [towns])

    const checkStuff = () => {
        console.log('button pushed...')
        const goData = {
            address: 'auth:50003',
            action: 'read-towns',
            instructions: JSON.stringify({country_id:1})
        };
        request(JSON.stringify(goData));
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