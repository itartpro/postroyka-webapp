export const toggleDown = e => {
    let el = e.target || e;
    let bro = el.nextElementSibling;
    if(!bro) return false;
    let broHeight = bro.offsetHeight;
    const svg = el.querySelector('svg');
    if(svg) {
        svg.style.transition = 'all .3s';
        if(svg.style.transform) {
            svg.removeAttribute('style');
            svg.style.transition = 'all .3s'
        } else {
            svg.style.transform = 'rotate(180deg)';
        }
    }
    bro.style.transition = 'all .3s';
    bro.style.overflow = 'hidden';
    if(broHeight > 0) {
        bro.style.maxHeight = '600px';
        setTimeout(() => {
            bro.style.maxHeight = '0'
        }, 300)
    } else {
        bro.style.maxHeight = '600px';
        setTimeout(() => {
            bro.style.maxHeight = 'initial'
        }, 300)
    }
}

export const formatPrice = e => {
    e = e.toString();
    if(e.length === 4) return e.substr(0, 1) + " " + e.substr(1, 3);
    if(e.length === 5) return e.substr(0, 2) + " " + e.substr(2, 3);
    if(e.length === 6) return e.substr(0, 3) + " " + e.substr(3, 3);
    if(e.length === 7) return e.substr(0, 1) + " " + e.substr(1, 3) + " " + e.substr(4, 3);
    if(e.length === 8) return e.substr(0, 2) + " " + e.substr(2, 3) + " " + e.substr(5, 3);
    if(e.length === 9) return e.substr(0, 3) + " " + e.substr(3, 3) + " " + e.substr(6, 3);
}