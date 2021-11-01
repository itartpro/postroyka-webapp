import {useEffect, useContext, useState} from 'react';
import {WsContext} from 'context/WsProvider';

const Scratch = () => {
    const { request, wsMsg } = useContext(WsContext);
    const [cats, setCats] = useState([]);
    const [regions, setRegions] = useState([]);

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
                setCats(msg.data)
            }
            if(msg.data[1].hasOwnProperty('country_id')) {
                setRegions(msg.data)
            }
        }
    }, [wsMsg]);

    useEffect(() => {
        if(cats.length < 10) return false;
        console.log('And the regions are set...working on dupes...');
        const organized = {};
        for (let v of cats) {
            if(!organized.hasOwnProperty(v.slug)) {
                organized[v.slug] = v
            } else {
                console.log('original:', organized[v.slug]);
                console.log('possible dupe:', v);
                const goData = {
                    address: 'cats:50004',
                    action: 'update-cell',
                    instructions: JSON.stringify({
                        id: v.id,
                        column: "slug",
                        value: v.slug + "-" + v.id
                    })
                };
                //request(JSON.stringify(goData))
            }
        }
    }, [cats])

    const checkStuff = () => {
        console.log('button pushed...')
        const goData = {
            address: 'cats:50004',
            action: 'read_all',
            instructions: "{}"
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