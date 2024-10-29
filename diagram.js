var timeUnit = 10;
var timeline = [];
var space = 5;
var measure = 1.5;
var maxData = Math.floor(canvasXsize / space);
ctx2.lineWidth = 3
ctx2.font = "25px Serif"

var moverCells = 0;
var membranCells = 0;

var cellCounts = {};
var diagramColors = {
    nucleus: "yellow",
    reproduction: "red",
    plantCount: "darkgreen"
};

class Note {
    constructor(config) {
        for (let i in config) {
            this[i] = config[i]
        }
    }
}
function updateData() {
    while (timeline.length > maxData) {
        timeline.splice(0, 1);
    }
}
function takeNote() {
    for (let i = 0; i < cellTypes.length; i++) {
        diagramColors[(new cellTypes[i]()).name] = (new cellTypes[i]()).debugColor;
    }
    moverCells = 0;
    membranCells = 0;
    for (i in cellCounts) {
        cellCounts[i] = 0;
    }
    for (let i = 0; i < organisms.length; i++) {
        for (let i2 = 0; i2 < organisms[i].cells.length; i2++) {
            cellCounts[organisms[i].cells[i2].name]++;
        }
    }
    timeline.push(new Note({ dayColor: timeColor, plantCount: plants.length, ...cellCounts }));
}
function displayDia() {

    ctx2.clearRect(0, 0, canvasXsize, canvasYsize);
    
    for (i in timeline[timeline.length - 1]) {
        for (let i2 = 0; i2 < timeline.length; i2++) {
            if (timeline[i2 + 1] === undefined) continue;
            if (i == "dayColor") {
                ctx2.fillStyle = `rgb(${timeline[i2][i]}, ${timeline[i2][i]}, ${timeline[i2][i]})`;
                ctx2.fillRect(i2 * space, 0, space, canvasYsize)
            } else {
                ctx2.strokeStyle = diagramColors[i];
                ctx2.beginPath();
                ctx2.moveTo(i2 * space, canvasYsize - (timeline[i2][i]) / measure);
                ctx2.lineTo((i2 + 1) * space, canvasYsize - (timeline[i2 + 1][i]) / measure);
                ctx2.stroke();
            }

        }
    }
    let countero = 0;
    for (i in diagramColors) {
        ctx2.fillStyle = diagramColors[i];
        ctx2.fillRect(0, countero * 20, 20, 20)
        ctx2.fillStyle = "black";
        ctx2.fillText(i + ": ", 25, countero * 20 + 20, 250);
        ctx2.fillText(timeline[timeline.length - 1][i], 155, countero * 20 + 20);
        countero++;
    }
}