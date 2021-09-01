import {useEffect, useContext} from 'react';
import {WsContext} from 'context/WsProvider';

const Scratch = () => {
    const { request, wsMsg } = useContext(WsContext);

    //start at id 5, reset database after failures

    const checkStuff = () => {
        const goData = {
            address: 'cats:50004',
            action: 'read_all',
            instructions: "{}"
        };
        request(JSON.stringify(goData));
    }

    useEffect(() => {
        if(!wsMsg) return false;
        if(wsMsg.type !== "info") {
            console.log(wsMsg);
            return false
        }
        const msg = JSON.parse(wsMsg.data);
        if(Array.isArray(msg.data)) {
            console.log(msg.data);
            return true
        }
    }, [wsMsg]);

    //parent_id, name, slug, title, description, keywords, author, h1, text, image, sort_order, created_at, extra

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