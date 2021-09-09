import {useState, useEffect, createContext} from 'react';

export const WsContext = createContext(null);

export default function WsProvider(props) {

    //websocket object, ready-state, websocket id, token
    const [ws, setWs] = useState(undefined);
    const [rs, setRs] = useState(3)//ws.readyState is: 0-connecting, 1-open, 2-closing, 3-closed
    const [wsId, setWsId] = useState(undefined);
    const [verifiedJwt, setVerifiedJwt] = useState(undefined);
    const [wsMsg, setWsMsg] = useState(undefined);

    //send stuff to Go
    const request = async (data, type = 'crud') => {
        const payload = {data, type}
        if (ws && ws['readyState'] === 1) {
            ws.send(JSON.stringify(payload));
            return true
        }
        return false
    }

    const configureWebSocket = () => {
        ws.onopen = () => {
            setRs(1);
            ws.onmessage = onMsgEv => {
                const msgObj = JSON.parse(onMsgEv.data);
                let parsed = [];
                switch (msgObj.type) {
                    case "client-websocket-id":
                        setWsId(msgObj.data);
                        break

                    case "go-error":
                        setWsMsg({type: 'error', data: msgObj.data});
                        break

                    case "go-info":
                        setWsMsg({type: 'info', data: msgObj.data});
                        break

                    case "jwt-auth":
                        parsed = JSON.parse(msgObj.data);
                        request(JSON.stringify({
                            acs: parsed[0],
                            ref: parsed[1]
                        }), 'verify-jwt-auth');
                        break

                    case "valid-tokens":
                        parsed = JSON.parse(msgObj.data);
                        window.localStorage.setItem('AccessJWT', parsed[0]);
                        window.localStorage.setItem('RefreshJWT', parsed[1]);
                        setVerifiedJwt(true);
                        break

                    case "jwt-token-invalid":
                        setWsMsg({type: 'error', data: msgObj.data});
                        logOut();
                        break

                    case "stored-jwt-token-valid":
                        setVerifiedJwt(true);
                        break

                    default:
                        break
                }
            }
        }
        ws.onclose = ev => {
            setWsMsg({type: 'error', data: 'WebSocket connection closed: ' + JSON.stringify(ev)})
            setRs(3)
        }
        ws.onerror = ev => {
            setWsMsg({type: 'error', data: 'WebSocket error observed: ' + JSON.stringify(ev)})
        }
    }

    const logOut = () => {
        setVerifiedJwt(false);
        window.localStorage.removeItem('AccessJWT');
        window.localStorage.removeItem('RefreshJWT');
        window.localStorage.removeItem('User')
    }

    const decodeJWT = key => {
        const storedJWT = window.localStorage.getItem(key);
        if(!storedJWT) return false;
        let debased64 = null;
        try {
            debased64 = atob(storedJWT.split('.')[1])
        } catch (err) {
            setWsMsg({type: 'error', data: `error decoding ${key}: ${err}`});
            return logOut()
        }
        return JSON.parse(debased64);
    }

    const checkAccess = levels => {
        const parsed = decodeJWT('AccessJWT');
        const level = parseInt(parsed.level);
        if (!levels.includes(level)) return false;
        return !(verifiedJwt !== undefined && verifiedJwt !== true)
    }

    const refreshAttempt = () => {
        const parsed = decodeJWT('RefreshJWT');
        const exp = parsed.exp * 1000;
        const now = new Date().getTime();
        if (exp < now) {
            setWsMsg({type: 'info', data: "Refresh token expired"});
            return logOut()
        }
        const str = window.localStorage.getItem('RefreshJWT')
        request(str, 'refresh-attempt')
    }

    //This function will address the backend and validate the access token EVERYTIME ws.readyState changes
    useEffect(() => {
        const parsed = decodeJWT('AccessJWT');
        if (rs === 1 && parsed) {
            const exp = parsed.exp * 1000;
            const now = new Date().getTime();
            const str = window.localStorage.getItem('AccessJWT')
            if (exp > now) request(str, 'validate-access-token');
            if (exp < now) refreshAttempt()
        }
    }, [rs])

    //start new ws connection or configure current connection when websocket or readyState changes
    useEffect(() => {
        //start new ws connection or configure current connection when websocket or readyState changes
        if (rs === 3) {
            setWs(new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET));
            setRs(0)
        }
        if (ws && rs === 0) configureWebSocket()
    }, [ws, rs])

    return (
        <WsContext.Provider value={{
            request,
            verifiedJwt,
            rs,
            wsMsg,
            setWsMsg,
            checkAccess,
            logOut,
        }}>
            {props.children}
        </WsContext.Provider>
    )
}
