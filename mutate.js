function generate2DarryFromCells(cells) {
    console.log(cells)
    let maxWidth = 0;
    let maxHeight = 0;
    for(let i = 0; i < cells.length; i++) {
        if(cells[i].x > maxWidth) {
            maxWidth = cells[i].x;
        }
        if(cells[i].y > maxHeight) {
            maxHeight = cells[i].y;
        }
    }
    maxWidth += 1;
    maxHeight += 1;
    let minWidth = JSON.parse(JSON.stringify(maxWidth));
    let minHeight = JSON.parse(JSON.stringify(maxHeight));
    for(let i = 0; i < cells.length; i++) {
        if(cells[i].x < minWidth) {
            minWidth = cells[i].x;
        }
        if(cells[i].y < minHeight) {
            minHeight = cells[i].y;
        }
    }
    let cellMap = generate2DArray(maxHeight - minHeight, maxWidth - minWidth, null);
    for(let i = 0; i < cells.length; i++) {
        cellMap[cells[i].y - minHeight][cells[i].x - minWidth] = cells[i];
    }
    return cellMap;
}