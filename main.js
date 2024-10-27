var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var canvasXsize = parseInt(canvas.width);
var canvasYsize = parseInt(canvas.height);
var timer = null;
var FPS = 45;
var UNIT = 25;
var WORLDSIZE = 60;
var COUNTER = 0;
var cellCost = 5;
var time = 0;
var dayLength = 10000;
var timeColor = 255;
var timePart = "day";
var organisms = [
    new Organism(10, 10, [], [{inst: Whip, x: 0, y: 1}, {inst: Whip, x: 0, y: 2}, {inst: PhotoCell, x: 0, y: 3}], 100, [{type: "cell-cell", from: {x: 0, y: 0}, to: {x: 0, y: 1}}, {type: "cell-cell", from: {x: 0, y: 0}, to: {x: 0, y: 2}}])
];
var plants = [];
organisms[0].addCell(new Nucleus(5, 5));
organisms[0].start();
testPairing(organisms[0].brain);
console.log(organisms[0].brain)
var camera = new Camera(0, 0);

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
    for(let i = 0; i < organisms.length; i++) {
        for(let i2 =  0; i2 < organisms[i].cells.length; i2++) {
            if(checkAABBCollision(new Plant(randomX, randomY, 5), organisms[i].cells[i2])) {
                can = false;
            }
        }
    }
    if(can) {
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
        organisms[i].render(ctx);
    }
}

function tick() {
    COUNTER++;
    time++;
    if(time < dayLength / 4 || time > (dayLength / 4) * 3) {
        timePart = "nigth";
    } else {
        timePart = "nigth";
    }
    if(time < dayLength / 2) {
        timeColor -= 255 / (dayLength / 2);
    } else {
        timeColor += 255 / (dayLength / 2);
    }
    canvas.style["background-color"] = `rgb(${timeColor}, ${timeColor}, ${timeColor})`;
    if(time == dayLength) {
        time = 0;
    }
    if(COUNTER % 20 == 0) {
        addPlants();
    }
    camera.update();
    updateOrganisms();
    renderPlants();
}

function start() {
    timer = setInterval("tick()", 1000 / FPS)
}

start()