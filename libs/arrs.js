export const organizeCats = cats => {
    if(!Array.isArray(cats) || !cats.length) return cats;

    const catObj = {};
    cats.forEach((v, i) => {
        v.children = [];
        catObj[v.id] = v;
        catObj[v.id].position = i;
    });
    cats.forEach(el => {
        if(!catObj[el.parent_id]) {
            let newLength = cats.push({
                id: el.parent_id,
                parent_id: 0,
                children: []
            });
            catObj[el.parent_id] = {
                id: el.parent_id,
                parent_id: 0,
                children: [],
                position: newLength - 1
            }
        }
        let index = catObj[el.parent_id].position;
        cats[index].children.push(el);
    });
    return cats.filter(el => el.parent_id === 0);
}

export const checkZeroPos = (arr, name) => {
    if(!arr) return false;
    return !!(Array.isArray(arr) && arr.length && arr[0].hasOwnProperty(name));
}

export const sortList = (list, key) => list.sort((a,b) => a[key] - b[key]);