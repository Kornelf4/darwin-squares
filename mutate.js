function generate2DarryFromCells(cells) {
    console.log(cells)
    let maxWidth = 0;
    let maxHeight = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].x > maxWidth) {
            maxWidth = cells[i].x;
        }
        if (cells[i].y > maxHeight) {
            maxHeight = cells[i].y;
        }
    }
    maxWidth += 1;
    maxHeight += 1;
    let minWidth = JSON.parse(JSON.stringify(maxWidth));
    let minHeight = JSON.parse(JSON.stringify(maxHeight));
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].x < minWidth) {
            minWidth = cells[i].x;
        }
        if (cells[i].y < minHeight) {
            minHeight = cells[i].y;
        }
    }
    let cellMap = generate2DArray(maxHeight - minHeight, maxWidth - minWidth, null);
    for (let i = 0; i < cells.length; i++) {
        cellMap[cells[i].y - minHeight][cells[i].x - minWidth] = cells[i];
    }
    return cellMap;
}

//[{inst: PhotoCell, x: 0, y: 1}, {inst: Whip, x: 0, y: 2}, {inst: PhotoCell, x: 0, y: 3}]
//[{type: "cell-cell", from: {x: 0, y: 0}, to: {x: 0, y: 1}}, {type: "cell-cell", from: {x: 0, y: 0}, to: {x: 0, y: 2}}]
function mutateBlueprint(blueprint) {
    let result = [...blueprint];
    if (randomNumber(0, 20) < mutationRate2) {
        for (let i = 0; i < blueprint.length; i++) {
            if (randomNumber(0, 20) < mutationRate) {
                let addHeading = randomNumber(0, 3);
                let targetLoc = { x: JSON.parse(JSON.stringify(blueprint[i].x)), y: JSON.parse(JSON.stringify(blueprint[i].y)) };
                let randomCelltype = cellTypes[randomNumber(0, cellTypes.length - 1)];
                let exist = false;
                if (addHeading == 0) targetLoc.y -= 1;
                if (addHeading == 1) targetLoc.x += 1;
                if (addHeading == 2) targetLoc.y += 1;
                if (addHeading == 3) targetLoc.x -= 1;
                for (let i2 = 0; i2 < blueprint.length; i2++) {
                    if (blueprint[i2].x == targetLoc.x && blueprint[i2].y == targetLoc.y) exist = true;
                }
                if (exist) continue;
                result.unshift({ inst: randomCelltype, x: targetLoc.x, y: targetLoc.y, heading: randomNumber(0, 3)});
            }
        }
    }
    if (randomNumber(0, 20) < mutationRate2) {
        for (let i = 0; i < result.length; i++) {
            if (randomNumber(0, 20) < mutationRate) {
                let randomCelltype = cellTypes[randomNumber(0, cellTypes.length - 1)];
                if (result[i].inst != Reproduction) {
                    result[i].inst = randomCelltype;
                }
            }
            if (randomNumber(0, 20) < mutationRate) {
                result[i].heading = randomNumber(0, 3)
            }
        }
    }
    return result;
}

function mutateBrain(connections, blueprint) {
    let result = [...connections];
    for (let i = 0; i < result.length; i++) {
        if (randomNumber(0, 27) < mutationRate) {
            if (result[i].type == "cell-cell")
                var randomBlock = blueprint[randomNumber(0, blueprint.length - 1)];
            if (randomBlock.x == result[i].from.x && randomBlock.y == result[i].from.y) {
                continue;
            }
            result[i].to.x = randomBlock.x;
            result[i].to.y = randomBlock.y;
        }
    }
    if (randomNumber(0, 27) < mutationRate) {
        let random1 = randomNumber(0, blueprint.length - 1);
        let random2 = randomNumber(0, blueprint.length - 1);
        if (random1 == random2) return result;
        result.unshift({ type: "cell-cell", from: { x: blueprint[random1].x, y: blueprint[random1].y }, to: { x: blueprint[random2].x, y: blueprint[random2].y } })
    }
    return result;
}