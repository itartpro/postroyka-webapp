const goPost = (body, url) => {
    if(!url) url = process.env.GO_REST;
    return fetch(url, {
        headers:{'Content-Type':'application/json', 'Cookie':'ab6e2ed0caebf9e43227682823bf77c2'},
        method:'POST',
        body
    })
        .then(res => res.json())
        .then(data => data)
        .catch(err => {
            console.log('goPost error', err);
            return null
        });
}

export default goPost