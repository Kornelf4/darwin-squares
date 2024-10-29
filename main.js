var canvas = document.getElementById("simCanvas");
var diagramCanv = document.getElementById("diaCanv");
var ctx = canvas.getContext("2d");
var ctx2 = diagramCanv.getContext("2d");
var canvasXsize = parseInt(canvas.width);
var canvasYsize = parseInt(canvas.height);
var timer = null;
var FPS = 100;
var UNIT = 5;
var graphics = true;
var WORLDSIZE = 110;
var mutationRate = 5;
var mutationRate2 = 5;
var COUNTER = 0;
var isRunning = true;
var cellCost = 4;
var cellTypes = [PhotoCell,NotCell, MembranCell, Eater, Whip, Eye, Adder, Whip, MembranCell, Whip, RandomCell, Eater, Eater, Eye, Whip];
var time = 0;
var dayLength = 8000;
var timeColor = 255;
var timePart = "day";
var organisms = [
];
var plants = [];
for (let i = 0; i < 10; i++) {
    let randX = randomNumber(0, canvasXsize);
    let randY = randomNumber(0, canvasYsize);
    organisms.unshift(new Organism(randX, randY, [], [
        { inst: PhotoCell, x: 0, y: 1, heading: randomNumber(0, 3)},
        { inst: PhotoCell, x: 0, y: -1, heading: randomNumber(0, 3)},
        { inst: Whip, x: 1, y: 0, heading: randomNumber(0, 3)},
        { inst: Reproduction, x: -1, y: 0, heading: randomNumber(0, 3)},
        { inst: MembranCell, x: 1, y: 1, heading: randomNumber(0, 3)},
        { inst: MembranCell, x: 1, y: -1, heading: randomNumber(0, 3)},
    ], 50, [
        { type: "cell-cell", from: { x: 0, y: 0 }, to: { x: -1, y: 0 } },
        { type: "cell-cell", from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }
    ]))
    organisms[0].addCell(new Nucleus(randX, randY));
    organisms[0].start();
}

console.log(organisms[0].brain);
var camera = new Camera(0, 0);

function killHalf() {
    for(let i = 0; i < organisms.length; i++) {
        if(organisms[i] === undefined) continue;
        if(i % 2 == 0) {
            organisms.splice(i, 1)
        }
     }
}
function killHalfPlant() {
    for(let i = 0; i < plants.length; i++) {
        if(plants[i] === undefined) continue;
        if(i % 4 == 0) {
            plants.splice(i, 1)
        }
     }
}

function generate2DArray(rows, columns, fill) {
    const array = [];
    for (let i = 0; i < rows; i++) {
        array[i] = [];
        for (let j = 0; j < columns; j++) {
            array[i][j] = fill;
        }
    }
    return array;
}

function addPlants() {
    var can = true;
    var randomX = randomNumber(0, WORLDSIZE);
    var randomY = randomNumber(0, WORLDSIZE);
    for (let i = 0; i < organisms.length; i++) {
        for (let i2 = 0; i2 < organisms[i].cells.length; i2++) {
            if (checkAABBCollision(new Plant(randomX, randomY, 5), organisms[i].cells[i2])) {
                can = false;
            }
        }
    }
    if (can) {
        plants.unshift(new Plant(randomX, randomY, 0.5))
    }
}

function renderPlants() {
    for (let i = 0; i < plants.length; i++) {
        plants[i].render(ctx);
    }
}

function updateOrganisms() {
    ctx.clearRect(0, 0, canvasXsize, canvasYsize);
    for (let i = 0; i < organisms.length; i++) {
        organisms[i].update();
        if (organisms[i] === undefined) continue;
        //organisms[i].render(ctx);
    }
}

function renderOrganisms() {
    for (let i = 0; i < organisms.length; i++) {
        organisms[i].render(ctx);
    }
}

function tick() {
    if(COUNTER % 5 == 0) {
        takeNote();
        updateData();
        displayDia();
    }
    document.getElementById("organismNum").innerText = organisms.length;
    document.getElementById("foodNum").innerText = plants.length;
    mutationRate = document.getElementById("cellMutNum").value;
    mutationRate2 = document.getElementById("orgMutNum").value;
    if(document.getElementById("culling").checked) {
        if(organisms.length > parseInt(document.getElementById("maxOrg").value)) {
            killHalf();
        }
        if(plants.length > parseInt(document.getElementById("maxFood").value)) {
            killHalfPlant();
        }
    }
    
    graphics = document.getElementById("graphics").checked;
    if (isRunning) {
        ctx.clearRect(0, 0, canvasXsize, canvasYsize);
        if(graphics) renderPlants();
        if(graphics) camera.update();
        //if (!isRunning) return;
        COUNTER++;
        time++;
        if (time > dayLength) {
            time = 0
        }
        if (time < dayLength / 2) {
            timePart = "day";
            timeColor -= (255 / (dayLength / 2));
        }
        if (time > dayLength / 2) {
            timePart = "night";
            timeColor += (255 / (dayLength / 2));
        }
        //console.log(timeColor)
        canvas.style["background-color"] = `rgb(${timeColor}, ${timeColor}, ${timeColor})`;
        if (COUNTER % 1 == 0) {
            addPlants();
        }
        updateOrganisms();
        if(graphics) renderPlants();
        if(graphics) renderOrganisms()
    } else {
        if (graphics) {
            ctx.clearRect(0, 0, canvasXsize, canvasYsize);
            camera.update();
            renderOrganisms();
            renderPlants();
        } else {
            ctx.clearRect(0, 0, canvasXsize, canvasYsize)
        }
    }
}

function start() {
    timer = setInterval("tick()", 1000 / FPS)
}

function setSpeed(e) {
    console.log(e)
    if(e.key) {

    }
}

document.getElementById("speed").addEventListener("keypress", function(e) {
    console.log("a")
    if(e.key == "Enter") {
        FPS = document.getElementById("speed").value;
        
        timer = null;
        timer = setInterval("tick()", 1000 / FPS)
        console.log(timer)
    }
})

start()