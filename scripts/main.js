var canvas = document.getElementById("simCanvas");
canvas.width = window.innerWidth / 2.2;
canvas.height = window.innerHeight / 1.5;
var diagramCanv = document.getElementById("diaCanv");
diagramCanv.width = window.innerWidth / 2.2;
diagramCanv.height = window.innerHeight / 1.5;
var ctx = canvas.getContext("2d");
var ctx2 = diagramCanv.getContext("2d");
var canvasXsize = parseInt(canvas.width);
var canvasYsize = parseInt(canvas.height);
var timer = null;
var FPS = 100;
var UNIT = 5;
var graphics = true;
var WORLDSIZE = 70;
var animSpeed = 15;
var mutationRate = 5;
var mutationRate2 = 5;
var COUNTER = 0;
var isRunning = false;
var cellCost = 5;
var cellTypes = [PhotoCell, NotCell, MembranCell, Eater, Whip, Eye, Adder, RandomCell, PlantEye, Eye, Eater, Whip, Whip, Whip, Eye, MembranCell, Whip];
var time = 0;
var dayLength = 8000;
var timeColor = 255;
var timePart = "day";
var musicAudio = new Audio("audio/game.mp3");
var bubble = new Audio("audio/bubbles.wav");
var buttonSound = new Audio("audio/aceptar.wav");
musicAudio.loop = true;
var bubbleTimer = 0;
var bubbleEnabled = false;
var organisms = [
];
var plants = [];
for (let i = 0; i < 15; i++) {
    let randX = randomNumber(0, canvasXsize);
    let randY = randomNumber(0, canvasYsize);
    organisms.unshift(new Organism(randX, randY, [], [
        { inst: PhotoCell, x: 0, y: 1, heading: randomNumber(0, 3) },
        { inst: PhotoCell, x: 0, y: -1, heading: randomNumber(0, 3) },
        { inst: Whip, x: 1, y: 0, heading: randomNumber(0, 3) },
        { inst: Reproduction, x: -1, y: 0, heading: randomNumber(0, 3) },
        { inst: MembranCell, x: 1, y: 1, heading: randomNumber(0, 3) },
        { inst: MembranCell, x: 1, y: -1, heading: randomNumber(0, 3) },
    ], 100, [
        { type: "cell-cell", from: { x: 0, y: 0 }, to: { x: -1, y: 0 } },
        { type: "cell-cell", from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }
    ]))
    organisms[0].addCell(new Nucleus(randX, randY));
    organisms[0].start();
}

console.log(organisms[0].brain);
var camera = new Camera(0, 0);

function killHalf() {
    for (let i = 0; i < organisms.length; i++) {
        if (organisms[i] === undefined) continue;
        if (i % 2 == 0) {
            organisms.splice(i, 1)
        }
    }
    buttonSound.play();
}
function killHalfPlant() {
    for (let i = 0; i < plants.length; i++) {
        if (plants[i] === undefined) continue;
        if (i % 4 == 0) {
            plants.splice(i, 1)
        }
    }
    buttonSound.play();
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
            if (checkAABBCollision(new Plant(randomX, randomY, 0.5), organisms[i].cells[i2])) {
                can = false;
            }
        }
    }
    for (let i = 0; i < plants.length; i++) {
        if (checkAABBCollision(new Plant(randomX, randomY, 0.5), plants[i])) {
            can = false;
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
    
    var canvasXsize = parseInt(canvas.width);
    var canvasYsize = parseInt(canvas.height);
    if (COUNTER % 5 == 0 && isRunning) {
        takeNote();
        updateData();
        displayDia();
    }
    mutationRate = document.getElementById("cellMutNum").value;
    mutationRate2 = document.getElementById("orgMutNum").value;
    if (document.getElementById("culling").checked) {
        if (organisms.length > parseInt(document.getElementById("maxOrg").value)) {
            killHalf();
        }
        if (plants.length > parseInt(document.getElementById("maxFood").value)) {
            killHalfPlant();
        }
    }

    graphics = document.getElementById("graphics").checked;
    if (isRunning) {
        bubbleTimer++;
        if(bubbleTimer > 100) {
            bubbleTimer = 0;
            if(randomNumber(0, 100) < 20) {
                bubble.play();
            }
        }
        ctx.clearRect(0, 0, canvasXsize, canvasYsize);
        if (graphics) renderPlants();
        if (graphics) camera.update();
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
        if (COUNTER % parseInt(document.getElementById("foodDelay").value) == 0) {
            addPlants();
        }
        updateOrganisms();
        if (graphics) renderPlants();
        if (graphics) renderOrganisms();
        //if(graphics) {
            particleTick();
        //}
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
    if (e.key) {

    }
}

function spectate() {
    let randomOrg = organisms[randomNumber(0, organisms.length - 1)];
    camera.spectate = randomOrg;
    buttonSound.play();
}

function setMusic(elem) {
    if(elem.checked) {
        musicAudio.play();
        bubbleEnabled = true;
    }
}

start()

/*musicAudio.addEventListener("ended", function(){
    musicAudio.currentTime = 0;
    if(musicAudio.src == "audio/game.mp3") {
        musicAudio.src = "audio/game2.wav";
    } else {
        musicAudio.src = "audio/game.mp3";
    }
    musicAudio.play();
});*/
function unitAdd() {
    UNIT += 5;
    buttonSound.play();
}
function unitMin() {
    UNIT -= 5;
    buttonSound.play();
}
function setRunning() {
    isRunning = !isRunning;
    buttonSound.play();
}