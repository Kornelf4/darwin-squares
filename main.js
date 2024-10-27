var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var canvasXsize = parseInt(canvas.width);
var canvasYsize = parseInt(canvas.height);
var timer = null;
var FPS = 45;
var UNIT = 25;
var organisms = [
    new Organism(0, 0, [new Cell(5, 5, "test", "red")], [], 0)
];
var camera = new Camera(0, 0);

function renderOrganisms() {
    ctx.clearRect(0, 0, canvasXsize, canvasYsize);
    for(let i = 0; i < organisms.length; i++) {
        organisms[i].render(ctx);
    }
}

function tick() {
    renderOrganisms();
}

function start() {
    timer = setInterval("tick()", 1000/FPS)
}

start()