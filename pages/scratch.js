import {useEffect, useContext} from 'react';
import {WsContext} from 'context/WsProvider';

const Scratch = () => {
    const { request, wsMsg } = useContext(WsContext);

    useEffect(() => {
        const instructions = {
            password: btoa("password")
        };
        const goData = {
            address: 'auth:50003',
            action: 'hash',
            instructions: JSON.stringify(instructions)
        };
        request(JSON.stringify(goData))
    }, []);

    useEffect(() => {
        if(!wsMsg) return false;
        console.log("it is", wsMsg);
    }, [wsMsg]);

    return (
        <div style={{padding:'30px'}}>
            <h1>Практика</h1>
        </div>
    )
}

export default Scratch