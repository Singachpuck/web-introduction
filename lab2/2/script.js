window.onload = () => {
    const target = document.querySelector('.target-cell'),
        targetIndex = Array.from(target.parentElement.children).indexOf(target),
        palette = document.querySelector('.palette'),
        cells = targetIndex % 2 == 0 ? document.querySelectorAll('tr > td:nth-of-type(2n + 1)')
                : document.querySelectorAll('tr > td:nth-of-type(2n)');
    
    target.addEventListener('mouseover', e => {
        e.target.style.backgroundColor = randomColorHex();
    });

    target.addEventListener('click', e => {
        e.target.style.backgroundColor = palette.value;
    });

    target.addEventListener('dblclick', e => {
        for (cell of cells) {
            cell.style.backgroundColor = palette.value;
        }
    });

    function randomColorHex() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}