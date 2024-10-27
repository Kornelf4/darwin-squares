class Organism {
    constructor(centerX, centerY, starterCells, blueprint, energy, connectInstructions) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.cells = starterCells;
        this.blueprint = blueprint;
        this.connectInstructions = connectInstructions;
        this.energy = energy;
        this.complete = false;
        this.nucleusLoc = { x: 0, y: 0 }
        this.brain = [];
        this.moveDirect = { x: 0, y: 0 };
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
            this.centerX = Number(Number(this.centerX).toFixed(2));
            this.centerY = Number(Number(this.centerY).toFixed(2));
            this.moveDirect.x = Number(Number(this.moveDirect.x).toFixed(2));
            this.moveDirect.y = Number(Number(this.moveDirect.y).toFixed(2));
            this.nucleusLoc.x = Number(Number(this.nucleusLoc.x).toFixed(2));
            this.nucleusLoc.y = Number(Number(this.nucleusLoc.y).toFixed(2));
            this.energy = Number(Number(this.energy).toFixed(2));
            for(let i = 0; i < this.cells.length; i++) {
                this.cells[i].x = Number(Number(this.cells[i].x).toFixed(2));
                this.cells[i].y = Number(Number(this.cells[i].y).toFixed(2));
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
                if (this.energy > cellCost + randomNumber(2, cellCost) && !this.complete) {
                    //scearch for buildable blueprint things
                    scearcHeading = heading;
                    if (scearcHeading == 0) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x == this.blueprint[i].x + JSON.parse(JSON.stringify(this.nucleusLoc.x)) && builtCell.y - 1 == this.blueprint[i].y + this.nucleusLoc.y) {
                                for (let i2 = 0; i2 < this.cells.length; i2++) {
                                    if (JSON.stringify(new this.blueprint[i].inst(builtCell.x, builtCell.y - 1)) == JSON.stringify(this.cells[i2])) {
                                        continue;
                                    }
                                }
                                this.cells.unshift(new this.blueprint[i].inst(builtCell.x, builtCell.y - 1));
                                this.cells[0].start(this);
                                this.blueprint.splice(i, 1);
                                this.energy -= cellCost;
                            }
                        }
                    }
                    if (scearcHeading == 1) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x + 1 == this.blueprint[i].x + JSON.parse(JSON.stringify(this.nucleusLoc.x)) && builtCell.y == this.blueprint[i].y + this.nucleusLoc.y) {
                                for (let i2 = 0; i2 < this.cells.length; i2++) {
                                    if (JSON.stringify(new this.blueprint[i].inst(builtCell.x + 1, builtCell.y)) == JSON.stringify(this.cells[i2])) {
                                        continue;
                                    }
                                }
                                this.cells.unshift(new this.blueprint[i].inst(builtCell.x + 1, builtCell.y));
                                this.cells[0].start(this);
                                this.blueprint.splice(i, 1);
                                this.energy -= cellCost;
                            }
                        }
                    }
                    if (scearcHeading == 2) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x == this.blueprint[i].x + JSON.parse(JSON.stringify(this.nucleusLoc.x)) && builtCell.y + 1 == this.blueprint[i].y + this.nucleusLoc.y) {
                                for (let i2 = 0; i2 < this.cells.length; i2++) {
                                    if (JSON.stringify(new this.blueprint[i].inst(builtCell.x, builtCell.y + 1)) == JSON.stringify(this.cells[i2])) {
                                        continue;
                                    }
                                }
                                this.cells.unshift(new this.blueprint[i].inst(builtCell.x, builtCell.y + 1));
                                this.cells[0].start(this);
                                this.blueprint.splice(i, 1);
                                this.energy -= cellCost;
                            }
                        }
                    }
                    if (scearcHeading == 3) {
                        for (let i = 0; i < this.blueprint.length; i++) {
                            if (this.blueprint[i] === undefined) continue;
                            if (builtCell.x - 1 == this.blueprint[i].x + JSON.parse(JSON.stringify(this.nucleusLoc.x)) && builtCell.y == this.blueprint[i].y + this.nucleusLoc.y) {
                                for (let i2 = 0; i2 < this.cells.length; i2++) {
                                    if (JSON.stringify(new this.blueprint[i].inst(builtCell.x - 1, builtCell.y)) == JSON.stringify(this.cells[i2])) {
                                        continue;
                                    }
                                }
                                this.cells.unshift(new this.blueprint[i].inst(builtCell.x - 1, builtCell.y));
                                this.cells[0].start(this);
                                this.blueprint.splice(i, 1);
                                this.energy -= cellCost;
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < this.cells.length; i++) {
                for(let i2 = 0; i2 < 4; i2++) {
                    check(this.cells[i], i2);
                }
            }
            //check plants
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].name == "nucleus") {
                    this.nucleusLoc.x = this.cells[i].x;
                    this.nucleusLoc.y = this.cells[i].y;
                }
                for (let i2 = 0; i2 < plants.length; i2++) {
                    if (plants[i2] === undefined) continue;
                    if (checkAABBCollision(this.cells[i], plants[i2])) {
                        this.energy += plants[i2].size;
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
                        this.brain.unshift(new BrainNode(this.cells[fromFound], [], "fromCellInputter", null, "To Whip From"));
                        for (let i2 = 0; i2 < this.brain.length; i2++) {
                            if (this.brain[i2].type == "toCellOutputter" && this.brain[i2].outputsTo.x == this.cells[toFound].x && this.brain[i2].outputsTo.y == this.cells[toFound].y) {
                                this.brain[i2].inputsFrom.unshift(this.brain[0]);
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
                }
            }

            //move
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i].x += this.moveDirect.x;
                this.cells[i].y += this.moveDirect.y;
            }
            this.centerX += this.moveDirect.x;
            this.centerY += this.moveDirect.y;
            if(this.centerX < 0) {
                this.centerX = WORLDSIZE - 1;
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x += WORLDSIZE;
                }
            }
            if(this.centerY < 0) {
                this.centerY = WORLDSIZE - 1;
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y += WORLDSIZE;
                }
            }
            if(this.centerX > WORLDSIZE) {
                this.centerX = 1;
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x -= WORLDSIZE;
                }
            }
            if(this.centerY > WORLDSIZE) {
                this.centerY = 1
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y -= WORLDSIZE;
                }
            }
            this.moveDirect = { x: 0, y: 0 };
            //update brain
            for (let i = 0; i < this.brain.length; i++) {
                this.brain[i].update();
            }
        }
        this.addCell = (cell) => {
            this.cells.unshift(cell);
            if (this.cells[0].start !== undefined) {
                this.cells[0].start(this)
            }
        }
    }
}