import fs from 'fs'
import probe from 'probe-image-size'

export const ProbeImages = async arr => {
    const checked = [];
    const result = {};
    arr.forEach(e => {
        try {
            if (fs.existsSync('./public/'+e.path)) checked.push(e);
            result[e.id] = {};
            return true
        } catch(err) {
            return false
        }
    });

    if(!checked.length) return [];

    checked.forEach(e => {
        const data = fs.readFileSync('./public/'+e.path);
        const ps = probe.sync(data);
        result[e.id].data = {...ps, id:e.id, path:e.path}
    });

    return result
}