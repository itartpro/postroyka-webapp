import fs from 'fs'
import path from 'path'

export default (req, res) => {
    const {location} = req.query;
    const dir = '/uploads/' + location.split('-').join('/');
    if (!fs.existsSync(dir)) {
        return res.status(200).json({"statusCode": 200, "result": []});
    }
    const filenames = fs.readdirSync(dir);

    if(!filenames.length) return res.status(200).json([]);

    const probe = require('probe-image-size');
    const result = filenames.map(name => {
        const data = fs.readFileSync(dir+'/'+name);
        const ps = probe.sync(data);
        return ({...ps, name})
    });
    return res.status(200).json(result);
}