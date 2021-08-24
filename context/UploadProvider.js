import {useState, useEffect, useContext, createContext} from 'react'
import {WsContext} from 'context/WsProvider'

export const UploadContext = createContext(null)

export default function UploadProvider(props) {
    const {rs, request, wsMsg, setWsMsg} = useContext(WsContext)
    const [remains, setRemains] = useState([])
    const [upload, setUpload] = useState(null)
    const [done, setDone] = useState([])
    const [chunkSize, setChunkSize] = useState(0)
    const [offset, setOffset] = useState(0)
    const [parts, setParts] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [pause, setPause] = useState(false)
    const initChunkSize = (props.chunkSize >= 32768 && props.chunkSize <= 1048576) ? props.chunkSize : 131072 //default 128 Kb

    const onLoadHandler = ev => {
        if (ev.target.error == null) {
            const goData = {
                name: upload.name,
                file_size: upload.size,
                data: ev.target.result,
                offset: offset,
                part: parts
            }
            //if its the last part send instructions for processing and saving to database (keep overhead low for else)
            if (parts < 2) {
                const fullInstructions = {
                    ...props.instructions,
                    name: upload.name,
                    type: upload.type,
                    size: upload.size
                }
                goData.address = props.address
                goData.action = props.action
                goData.instructions = JSON.stringify(fullInstructions)
            }
            request(JSON.stringify(goData), 'upload')
        } else {
            setWsMsg({type: 'error', data: "UploadProvider.js onLoadHandler error: "+ev.target.error})
        }
    }

    const readChunk = (file, _chunkSize, _offset) => {
        const r = new FileReader()
        const newOffset = _offset + _chunkSize
        const blob = file.slice(_offset, newOffset)
        r.onload = onLoadHandler
        r.readAsDataURL(blob)
    }


    const nextQueuedFile = () => {
        let newArr = remains.filter(e => e.name !== upload.name)
        setRemains(newArr)
        if (upload && !done.includes(upload.name)) setDone([...done, upload.name])
        setUpload(null)
        setOffset(0)
        setParts(0)
    }

    useEffect(() => {
        if (!wsMsg) return;
        if (wsMsg.type === 'info') {
            const res = JSON.parse(wsMsg.data);
            if(typeof res.data !== 'string') return;
            if (res.data === "file already exists") {
                setParts(1);
                setOffset(upload.size);
                setCompleted(100);
                return;
            }
            if (res.data.substr(0, 8) === "received") {
                let newParts = parts - 1;
                if (newParts <= 0) {
                    nextQueuedFile();
                } else {
                    setCompleted(Math.ceil(offset / upload.size * 100));
                    setParts(newParts);
                    setOffset(offset + chunkSize);
                }
                return;
            }
            if (res.data.substr(0, 9) === "incorrect") {
                let correctOffset = parseInt(res.data.split(":")[1]);
                setOffset(parseInt(correctOffset));
                let remainingSize = upload.size - correctOffset;
                let chunk = initChunkSize <= remainingSize ? initChunkSize : remainingSize; // set chunkSize to <= to initChunkSize
                setChunkSize(chunk);
                setParts(Math.ceil((remainingSize / chunk)));
                return;
            }
        }
        if (wsMsg.type === 'error' && wsMsg.data !== 'Token is expired') {
            setRemains([]);
            setUpload(null);
            setOffset(0);
            setParts(0);
            setWsMsg(undefined);
        }
    }, [wsMsg]);

    useEffect(() => {
        if (upload && parts > 0) readChunk(upload, chunkSize, offset);
    }, [parts]);

    useEffect(() => {
        if (!upload) return;
        const fileSize = upload.size;
        if (fileSize > 0) {
            let chunk = initChunkSize <= fileSize ? initChunkSize : fileSize; // set chunkSize to <= to initChunkSize
            setChunkSize(chunk);
            setParts(Math.ceil((fileSize / chunk)));
        }
    }, [upload]);

    //Handle uploading init here, on set upload a chain reaction will start with useEffect
    useEffect(() => {
        if (typeof remains === "undefined") return;
        if (!remains.length) return;
        let file = remains[0];
        if (validateFile(file)) {
            setUpload(file);
        } else {
            //remove bad file from remains array
            setWsMsg({type: 'error', data:"File type not allowed in this component"});
            let newArr = remains.filter(e => e.name !== file.name);
            setRemains(newArr);
        }
    }, [remains]);

    const validateFile = file => {
        //example for allowed: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon']
        if (props.allowed && props.allowed.length) {
            if (props.allowed.indexOf(file.type) === -1) return false;
        }
        return true;
    }

    useEffect(() => {
        if (!pause) return false;
        setRemains([]);
        setUpload(null);
        setOffset(0);
        setParts(0);
    }, [pause]);

    return (
        <UploadContext.Provider value={{
            rs,
            request,
            done,
            parts,
            remains,
            setRemains,
            setPause,
            completed,
            upload
        }}>
            {props.children}
        </UploadContext.Provider>
    )
}