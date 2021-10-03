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