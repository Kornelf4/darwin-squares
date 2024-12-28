let viewCanvas = document.getElementById("viewCanvas");
let viewing = undefined;
let viewCtx = viewCanvas.getContext("2d");
let vCanvasXS = parseInt(viewCanvas.width);
let vCanvasYS = parseInt(viewCanvas.height);
let center = {x: vCanvasXS / 2, y: vCanvasYS / 2}
let viewUNIT = 10;
function updateView() {
    viewing = camera.spectate;
    drawCreature();
}
function unitMinv()  {
    viewUNIT -= 5
}
function unitAddv()  {
    viewUNIT += 5
}

function drawCreature() {
    viewCtx.clearRect(0, 0, vCanvasXS, vCanvasYS);
    if(viewing !== undefined) {
        for(let i = 0; i < viewing.cells.length; i++) {
            let relativeXv = viewing.cells[i].x - viewing.nucleusLoc.x;
            let relativeYv = viewing.cells[i].y - viewing.nucleusLoc.y;
            viewCtx.drawImage(viewing.cells[i].frames[0], center.x + relativeXv * viewUNIT, center.y + relativeYv * viewUNIT, viewUNIT, viewUNIT);
            viewCtx.beginPath()
            viewCtx.arc(center.x + relativeXv * viewUNIT + viewUNIT / 4, center.y + relativeYv * viewUNIT + viewUNIT / 4, viewUNIT / 25, 0, 2 * Math.PI);
            viewCtx.strokeStyle = "red";
            viewCtx.stroke();
            viewCtx.beginPath()
            viewCtx.arc(center.x + relativeXv * viewUNIT + viewUNIT * 0.75, center.y + relativeYv * viewUNIT + viewUNIT * 0.75, viewUNIT / 25, 0, 2 * Math.PI);
            viewCtx.strokeStyle = "blue";
            viewCtx.stroke();
        }
        for(let i = 0; i < viewing.brain.length; i++) {
            let lineStart = {x: viewing.brain[i].inputsFrom.x - viewing.nucleusLoc.x, y: viewing.brain[i].inputsFrom.y - viewing.nucleusLoc.y};
            let a = false;
            for(let i2 = 0; i2 < viewing.cells.length; i2++) {
                if(viewing.cells[i2] == viewing.brain[i].inputsFrom) {
                    a = true;
                }
            }
            if(!a) {
                continue;
            }
            for(let i2 = 0; i2 < viewing.brain[i].outputsTo.length; i2++) {
                let a = false;
                for(let i3 = 0; i3 < viewing.cells.length; i3++) {
                    if(viewing.cells[i3] == viewing.brain[i].outputsTo[i2].outputsTo) {
                        a = true;
                    }
                }
                if(!a) {
                    continue;
                }
                let lineStop = {x: viewing.brain[i].outputsTo[i2].outputsTo.x - viewing.nucleusLoc.x, y: viewing.brain[i].outputsTo[i2].outputsTo.y - viewing.nucleusLoc.y};
                viewCtx.strokeStyle = "black";
                const gradient = viewCtx.createLinearGradient(center.x + lineStart.x * viewUNIT + viewUNIT / 4, center.y + lineStart.y * viewUNIT + viewUNIT / 4, center.x + lineStop.x * viewUNIT + viewUNIT * 0.75, center.y + lineStop.y * viewUNIT + viewUNIT * 0.75);
                gradient.addColorStop(0, 'red');
                gradient.addColorStop(1, 'blue');
                viewCtx.strokeStyle = gradient;
                viewCtx.lineWidth = viewUNIT / 5;
                viewCtx.beginPath();
                viewCtx.moveTo(center.x + lineStart.x * viewUNIT + viewUNIT / 4, center.y + lineStart.y * viewUNIT + viewUNIT / 4);
                viewCtx.lineTo(center.x + lineStop.x * viewUNIT + viewUNIT * 0.75, center.y + lineStop.y * viewUNIT + viewUNIT * 0.75);
                viewCtx.stroke();
            }
        }
        for(let i = 0; i < viewing.brain.length; i++) {
            if(viewing.brain[i].type == "toCellOutputter") {
                
                let ancLoc = {x: viewing.brain[i].outputsTo.x - viewing.nucleusLoc.x, y: viewing.brain[i].outputsTo.y - viewing.nucleusLoc.y};
                let a = false;
                for(let i2 = 0; i2 < viewing.cells.length; i2++) {
                    if(viewing.cells[i2].x == viewing.brain[i].outputsTo.x && viewing.cells[i2].y == viewing.brain[i].outputsTo.y) {
                        a = true;
                    }
                }
                if(!a) continue;
                viewCtx.fillStyle = "black";
                viewCtx.font = viewUNIT / 3 + "px Arial";
                viewCtx.fillText((viewing.brain[i].value).toFixed(2), center.x + ancLoc.x * viewUNIT + viewUNIT / 4, center.y + ancLoc.y* viewUNIT + viewUNIT * 0.85)
            }

        }
    }
}