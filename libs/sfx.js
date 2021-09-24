export const toggleDown = e => {
    const bro = e.target.nextElementSibling;
    const check = bro.getAttribute('style');
    const svg = e.target.querySelector('svg');
    if(!check) {
        if(svg) {
            svg.style.transition = 'all .3s';
            svg.style.transform = 'rotate(180deg)'
        }
        bro.style.borderBottom = 'none';
        bro.style.maxHeight = '600px';
        setTimeout(() => {
            bro.style.maxHeight = 'initial';
        }, 300);
    } else {
        if(svg) svg.style.transform = 'initial';
        bro.style.maxHeight = '600px';
        setTimeout(() => {
            bro.removeAttribute('style');
            if(svg) svg.removeAttribute('style');
        }, 300)
    }
}