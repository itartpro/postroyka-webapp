import {useEffect, useContext} from 'react';
import {WsContext} from 'context/WsProvider';

const Scratch = () => {
    const { request, wsMsg } = useContext(WsContext);

    useEffect(() => {
        const instructions = {
            password: btoa("a guy dude")
        };
        const goData = {
            address: 'auth:50003',
            action: 'hash',
            instructions: JSON.stringify(instructions)
        };
        request(JSON.stringify(goData))
    }, []);

    useEffect(() => {
        if(!wsMsg || wsMsg.type !== "info") return false;
        const res = JSON.parse(wsMsg.data);
        console.log(res);
    }, [wsMsg]);

    return (
        <div style={{padding:'30px'}}>
            <h1>Практика</h1>
        </div>
    )
}

export default Scratch