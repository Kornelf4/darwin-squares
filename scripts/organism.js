
var game = {
    collide: function (array, obj, returntype, filter) { //compare all the object collisions in the given array with the given objects
        let a = false; //detected collision
        let collides = []; //used in multiple collision detection
        for (let i = 0; i < array.length; i++) {
            if (array[i] === obj) continue;
            if (array[i].type == "camera") continue;
            if (array[i].scene != obj.scene && obj.scene !== undefined) {
                continue;
            }
            if (array[i].canCollide == false) continue;
            if (checkAABBCollision(obj, array[i])) {
                if (returntype == "boo") {
                    if (obj.constructor.name == "virus") {

                    }
                    return true;
                }; //Is collided with anything?
                if (returntype == "moving" && !array[i].collectable) return true;
                if (returntype == "object") return array[i]; //What is this colliding?
                if ((returntype == "objectsorted" && array[i][filter.property] == filter.value) && array[i][filter.property] !== undefined) return array[i];
                if (returntype == "multi") collides.unshift(array[i]);  //What is this colliding? (return the array of collided objects)
                if ((returntype == "sorted" && array[i][filter.property] == filter.value) && array[i][filter.property] !== undefined) return true; //The collided object has the filtered property with value?
            } else {
                if (returntype == "boo") //return false;
                    if (returntype == "object" || returntype == "sorted") {
                        //console.error(new ReferenceError("Warning! Can not return object from collide when not overlap. Try another return type. Actual return type: " + returntype + " -> returned false"));
                        //return false;
                    }
            }
        }
        if (returntype == "multi") {
            return collides;
        }
        return false;
    },
}
function fix2(num) {
    return Math.round(num * 10) / 10
}

function collideCell(cell, array, organism) {
    for (let i = 0; i < array.length; i++) {
        if (organism == array[i]) continue;
        for (let i2 = 0; i2 < array[i].cells.length; i2++) {
            if (checkAABBCollision(cell, array[i].cells[i2]) && cell.age > 50 && array[i].cells[i2].age > 50) {
                return true;
            }
        }
    }
    return false;
}
function collideCellIndex(cell, array, organism) {
    for (let i = 0; i < array.length; i++) {
        if (organism == array[i]) continue;
        for (let i2 = 0; i2 < array[i].cells.length; i2++) {
            if (checkAABBCollision(cell, array[i].cells[i2]) && cell.age > 50 && array[i].cells[i2].age > 50) {
                return { arrInd: i, cellInd: i2 };
            }
        }
    }
    return false;
}

class Organism {
    constructor(centerX, centerY, starterCells, blueprint, energy, connectInstructions) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.cells = starterCells;
        this.blueprint = blueprint;
        this.connectInstructions = connectInstructions;
        this.energy = energy;
        this.complete = false;
        this.blueprintGenes = [...blueprint];
        this.connectGenes = [...connectInstructions];
        this.nucleusLoc = { x: 0, y: 0 }
        this.brain = [];
        this.moveDirect = { x: 0, y: 0 };
        this.sensorContain = function (array, element) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].x == element.x && array[i].y == element.y) {
                    return true;
                }
            }
            return false;
        }
        this.start = () => {
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].name == "nucleus") {
                    this.nucleusLoc.x = this.cells[i].x;
                    this.nucleusLoc.y = this.cells[i].y;
                }
            }
        };
        this.render = (context) => {
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i].render(context);
            }
        }
        this.update = () => {
            for (let i = 0; i < this.cells.length; i++) {
                if(!isNaN(parseFloat(document.getElementById("sm").value))) {
                    this.energy -= 0.13 * parseFloat(document.getElementById("sm").value);
                }
                if (this.cells[i].age > 15000) {
                    this.cells.splice(i, 1)
                }
            }
            if (this.energy < 5 || this.energy > 10000) {
                for (let i = 0; i < this.cells.length; i++) {
                    plants.unshift(new Plant(this.cells[i].x, this.cells[i].y, 0.5));
                }
                organisms.splice(organisms.indexOf(this), 1);
            }
            let alive = false;
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].name == "nucleus") {
                    alive = true;
                }
            }
            if (!alive) {
                for (let i = 0; i < this.cells.length; i++) {
                    plants.unshift(new Plant(this.cells[i].x, this.cells[i].y, 0.5));
                }
                organisms.splice(organisms.indexOf(this), 1);
            }
            this.centerX = fix2(this.centerX);
            this.centerY = fix2(this.centerY);
            this.moveDirect.x = fix2(this.moveDirect.x);
            this.moveDirect.y = fix2(this.moveDirect.y);
            this.nucleusLoc.x = fix2(this.nucleusLoc.x);
            this.nucleusLoc.y = fix2(this.nucleusLoc.y);
            this.energy = fix2(this.energy);
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i].x = fix2(this.cells[i].x);
                this.cells[i].y = fix2(this.cells[i].y);
            }
            //check cell groups
            let removede = 0;
            let startingLocX = null;
            let longMap = [];

            let sensored = [];
            let removedNears = null;
            let startingLocY = 0;
            if (this.removedCell != null) {
                var cellGroups = [];
                removedNears = this.removedCell.getAllNear();
                for (let i = 0; i < removedNears.length; i++) {
                    if (game.collide(this.cells, removedNears[i], "boo")) {
                        cellGroups.unshift([game.collide(this.cells, removedNears[i], "object")]);
                    }
                }
                let numu = 0;
                let a = (root, cell) => {
                    let anears = cell.getAllNear();
                    for (let i = 0; i < anears.length; i++) {
                        if (game.collide(this.cells, anears[i], "boo") && !this.sensorContain(sensored, game.collide(this.cells, anears[i], "object")) && !this.sensorContain(root, game.collide(this.cells, anears[i], "object"))) {
                            root.unshift(game.collide(this.cells, anears[i], "object"));
                            sensored.unshift(game.collide(this.cells, anears[i], "object"));
                            a(root, game.collide(this.cells, anears[i], "object"));
                        }
                    }
                }
                for (let i = 0; i < cellGroups.length; i++) {
                    a(cellGroups[i], cellGroups[i][0]);
                }
                for (let i = 0; i < cellGroups.length; i++) {
                    longMap.push(cellGroups[i].length)
                }
                let still = cellGroups[longMap.indexOf(Math.max(...longMap))];
                let removeded = 0;
                for (let i = 0; i < cellGroups.length; i++) {
                    if (cellGroups[i - removeded] != still) {
                        cellGroups.splice(i - removeded, 1);
                        removeded++;
                    }
                }
                if (cellGroups[0] !== undefined) {
                    this.cells = cellGroups[0];
                    this.groupDebug = cellGroups;
                    this.removedCell = null;
                }

            }
            //check it is it th organism complate
            var a = false;
            var b = true;
            for (let i = 0; i < this.blueprint.length; i++) {
                a = false;
                for (let i2 = 0; i2 < this.cells.length; i2++) {
                    if (this.blueprint[i].x + this.nucleusLoc.x == this.cells[i2].x && this.blueprint[i].y + this.nucleusLoc.y == this.cells[i2].y) {
                        a = true;
                    }
                }
                if (!a) {
                    this.complete = false;
                    b = false;
                }
            }
            if (b) {
                this.complete = true;
            }
            //build this organism if possible
            let check = (builtCell, heading) => {
                var scearcHeading = 0;
                if (!this.complete) {
                    //scearch for buildable blueprint things
                    scearcHeading = heading;
                    if (scearcHeading == 0) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x == this.blueprint[i].x + this.nucleusLoc.x && builtCell.y - 1 == this.blueprint[i].y + this.nucleusLoc.y) {
                                if (!collideCell({ x: builtCell.x, y: builtCell.y - 1, age: 1000 }, organisms, this)) {
                                    if (this.energy < cellCost *3) continue;
                                    this.cells.unshift(new this.blueprint[i].inst(builtCell.x, builtCell.y - 1, this.blueprint[i].heading));
                                    this.cells[0].start(this);
                                    this.blueprint.splice(i, 1);
                                    this.energy -= cellCost;
                                }

                            }
                        }
                    }
                    if (scearcHeading == 1) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x + 1 == this.blueprint[i].x + this.nucleusLoc.x && builtCell.y == this.blueprint[i].y + this.nucleusLoc.y) {
                                if (!collideCell({ x: builtCell.x + 1, y: builtCell.y, age: 1000 }, organisms, this)) {

                                    if (this.energy < cellCost * 3) continue;
                                    this.cells.unshift(new this.blueprint[i].inst(builtCell.x + 1, builtCell.y, this.blueprint[i].heading));
                                    this.cells[0].start(this);
                                    this.blueprint.splice(i, 1);
                                    this.energy -= cellCost;
                                }

                            }
                        }
                    }
                    if (scearcHeading == 2) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x == this.blueprint[i].x + this.nucleusLoc.x && builtCell.y + 1 == this.blueprint[i].y + this.nucleusLoc.y) {
                                if (!collideCell({ x: builtCell.x, y: builtCell.y + 1, age: 1000 }, organisms, this)) {
                                    if (this.energy < cellCost *3) continue;
                                    this.cells.unshift(new this.blueprint[i].inst(builtCell.x, builtCell.y + 1, this.blueprint[i].heading));
                                    this.cells[0].start(this);
                                    this.blueprint.splice(i, 1);
                                    this.energy -= cellCost;
                                }
                            }
                        }
                    }
                    if (scearcHeading == 3) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x - 1 == this.blueprint[i].x + this.nucleusLoc.x && builtCell.y == this.blueprint[i].y + this.nucleusLoc.y) {
                                if (!collideCell({ x: builtCell.x - 1, y: builtCell.y, age: 1000 }, organisms, this)) {
                                    if (this.energy < cellCost *3) continue;
                                    this.cells.unshift(new this.blueprint[i].inst(builtCell.x - 1, builtCell.y, this.blueprint[i].heading));
                                    this.cells[0].start(this);
                                    this.blueprint.splice(i, 1);
                                    this.energy -= cellCost;
                                }

                            }
                        }
                    }
                }
            }
            for (let i = 0; i < this.cells.length; i++) {
                for (let i2 = 0; i2 < 4; i2++) {
                    check(this.cells[i], randomNumber(0, 4));
                }
            }
            //check plants
            for (let i = 0; i < this.cells.length; i++) {
                for (let i2 = 0; i2 < plants.length; i2++) {
                    if (plants[i2] === undefined) continue;
                    if (checkAABBCollision(this.cells[i], plants[i2]) && this.cells[i].name == "membran") {
                        this.energy += cellCost * 4.5;
                        plants.splice(i2, 1)
                    }
                }
            }
            for (let i = 0; i < this.connectInstructions.length; i++) {
                if (this.connectInstructions[i].type == "cell-cell") {
                    var fromFound = false;
                    var toFound = false;
                    for (let i2 = 0; i2 < this.cells.length; i2++) {
                        if (this.cells[i2].x == this.connectInstructions[i].from.x + this.nucleusLoc.x && this.cells[i2].y == this.connectInstructions[i].from.y + this.nucleusLoc.y) {
                            fromFound = i2;
                        }
                        if (this.cells[i2].x == this.connectInstructions[i].to.x + this.nucleusLoc.x && this.cells[i2].y == this.connectInstructions[i].to.y + this.nucleusLoc.y) {
                            toFound = i2;
                        }
                    }
                    //if the connectiopn does not exist
                    if (typeof fromFound === "number" && typeof toFound === "number") {
                        this.brain.unshift(new BrainNode(this.cells[fromFound], [], "fromCellInputter", null, "1. brainnode"));
                        for (let i2 = 0; i2 < this.brain.length; i2++) {
                            if (this.brain[i2].type == "toCellOutputter" && this.brain[i2].outputsTo.x == this.cells[toFound].x && this.brain[i2].outputsTo.y == this.cells[toFound].y) {
                                if (Array.isArray(this.brain[i2].inputsFrom)) {
                                    this.brain[i2].inputsFrom.unshift(this.brain[0]);
                                }
                                this.brain[0].outputsTo.unshift(this.brain[i2]);
                            }
                        }
                        this.connectInstructions.splice(i, 1);
                    }
                }
            }


            //update cells
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].update !== undefined) {
                    this.cells[i].update(this);
                    this.cells[i].updateAge();
                }
            }

            //move
            let canX = true;
            let canY = true;
            /*for (let i = 0; i < this.cells.length; i++) {
                ctx.fillStyle = "black";
                //ctx.fillRect(camera.getRelativeX((this.cells[i].x + this.moveDirect.x * 2) * UNIT), camera.getRelativeY(this.cells[i].y * UNIT), UNIT, UNIT)
                if(collideCell({x: this.cells[i].x + this.moveDirect.x * 2, y: this.cells[i].y, age: this.cells[i].age}, organisms, this)) {
                    canX = false;
                    
                }
                ctx.fillStyle = "black";
                //ctx.fillRect(camera.getRelativeX(this.cells[i].x * UNIT), camera.getRelativeY((this.cells[i].y + this.moveDirect.y * 2) * UNIT), UNIT, UNIT)
                if(collideCell({x: this.cells[i].x, y: this.cells[i].y + this.moveDirect.y * 2, age: this.cells[i].age}, organisms, this)) {
                    canY = false;
                    
                }
            }*/
            if (canX) {
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x += this.moveDirect.x;
                }
                this.centerX += this.moveDirect.x;
                this.nucleusLoc.x += this.moveDirect.x;
            }
            if (canY) {
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y += this.moveDirect.y;
                }
                this.centerY += this.moveDirect.y;
                this.nucleusLoc.y += this.moveDirect.y;
            }

            if (this.nucleusLoc.x < 0) {
                this.centerX = WORLDSIZE;
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x += WORLDSIZE;
                }
                this.nucleusLoc.x += WORLDSIZE;
            }
            if (this.nucleusLoc.y < 0) {
                this.centerY = WORLDSIZE;
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y += WORLDSIZE;
                }
                this.nucleusLoc.y += WORLDSIZE;
            }
            if (this.nucleusLoc.x > WORLDSIZE) {
                this.centerX = 0;
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x -= WORLDSIZE;
                }
                this.nucleusLoc.x -= WORLDSIZE;
            }
            if (this.nucleusLoc.y > WORLDSIZE) {
                this.centerY = 0
                for (let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y -= WORLDSIZE;
                }
                this.nucleusLoc.y -= WORLDSIZE;
            }
            this.moveDirect = { x: 0, y: 0 };
            //update brain
            for (let i = 0; i < this.brain.length; i++) {
                this.brain[i].update();
            }
            /*for(let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].name == "nucleus") {
                    this.nucleusLoc.x = this.cells[i].x;
                    this.nucleusLoc.y = this.cells[i].y;
                }
            }*/
        }
        this.addCell = (cell) => {
            this.cells.unshift(cell);
            if (this.cells[0].start !== undefined) {
                this.cells[0].start(this)
            }
        }
    }
}