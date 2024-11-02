function generateFrames(cell) {
    let frameResult = [];
    for (let i = 1; i < cell.frameNumber + 1; i++) {
        let image = new Image(UNIT, UNIT);
        image.src = "sprites/" + cell.name + "/" + cell.name + "-" + i + ".png";
        frameResult.push(image);
    }
    return frameResult;
}

class Cell {
    constructor(x, y, name, debugColor) {
        this.x = x;
        this.y = y;
        this.canOverlap = false;
        this.age = 0;
        this.name = name;
        this.debugColor = debugColor;
        this.updateAge = () => {
            this.age++;
            if (this.age > 100) {
                this.canOverlap = true;
            }
        }
        this.render = (context) => {
            if (this.hasImage) {
                this.frameTimer++;
                if (this.frameTimer > animSpeed) {
                    this.frameTimer = 0;
                    this.actualFrameIndex++;
                    if (this.actualFrameIndex == this.frameNumber) {
                        this.actualFrameIndex = 0;
                    }
                }
                context.drawImage(this.frames[this.actualFrameIndex], camera.getRelativeX(this.x * UNIT), camera.getRelativeY(this.y * UNIT), UNIT, UNIT)
            } else {
                context.fillStyle = this.debugColor;
                context.fillRect(camera.getRelativeX(this.x * UNIT), camera.getRelativeY(this.y * UNIT), UNIT, UNIT)
            }

        }
    }
}
class Nucleus extends Cell {
    constructor(x, y) {
        super(x, y, "nucleus", "yellow");
        this.hasImage = true;
        this.value = 1;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
    }
}
class Whip extends Cell {
    constructor(x, y, heading) {
        super(x, y, "whip", "blue");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.heading = heading;
        this.value = 0;
        this.activationLevel = 0;
        this.energyUse = 0.03;
        this.speed = 1;
        this.update = (parent) => {
            if (this.activationLevel === undefined || parent.energy < this.energyUse) return;
            //for (let i = 0; i < parent.cells.length; i++) {
            if (Math.round(this.activationLevel) == 1) {
                if (this.heading == 0) {
                    parent.moveDirect.y -= (this.speed * this.activationLevel) / 2;
                }
                if (this.heading == 1) {
                    parent.moveDirect.x += (this.speed * this.activationLevel) / 2;
                }
                if (this.heading == 2) {
                    parent.moveDirect.y += (this.speed * this.activationLevel) / 2;
                }
                if (this.heading == 3) {
                    parent.moveDirect.x -= (this.speed * this.activationLevel) / 2;
                }
            }

            //}
            parent.energy -= this.energyUse;
        }
        this.start = (parent) => {
            parent.brain.unshift(new BrainNode([], this, "toCellOutputter", null, "Whip Input Node"));
        }
    }
}

class TestCell extends Cell {
    constructor(x, y) {
        super(x, y, "test", "pink");
        this.value = 1;
        this.start = (parent) => {
        }
    }
}

class Adder extends Cell {
    constructor(x, y) {
        super(x, y, "adder", "orange")
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.activationLevel = 0;
        this.update = (parent) => {
            if (this.activationLevel <= 0) {
                this.value = this.activationLevel;
            } else {
                this.value = 1;
            }
        }
        this.start = (parent) => {
            parent.brain.unshift(new BrainNode([], this, "toCellOutputter", null, "Ligic To system output node"));
        }
    }
}

class PhotoCell extends Cell {
    constructor(x, y) {
        super(x, y, "green", "green");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.time = 0;
        this.update = (parent) => {
            this.time++;
            let sunRate = Math.abs(time - dayLength / 2) * 2;
            if (!collideCell(this, organisms, parent) && this.time > 30) {
                parent.energy += (sunRate / 5500 + 0.06) * 25;
                this.time = 0;
            }
            this.value = sunRate / dayLength;
        }
        this.start = () => {
        }
    }
}

class NotCell extends Cell {
    constructor(x, y) {
        super(x, y, "not", "purple")
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.activationLevel = 0;
        this.update = (parent) => {
            if (Math.round(this.activationLevel) == 1) {
                this.value = 0;
            } else {
                this.value = 1;
            }
        }
        this.start = (parent) => {
            parent.brain.unshift(new BrainNode([], this, "toCellOutputter", null, "Ligic To system output node"));
        }
    }
}

class Reproduction extends Cell {
    constructor(x, y) {
        super(x, y, "reproduction", "red");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.time = 0;
        this.activationLevel = 0;
        this.update = (parent) => {
            this.time++;
            if (this.activationLevel === undefined) return;
            if (this.time < 150) return;
            //if(Math.round(this.activationLevel) == 0) return;
            if (parent.energy < cellCost * 6 * 0.7 + randomNumber(4, 10)) return;
            let targetLoc = { x: JSON.parse(JSON.stringify(this.x)), y: JSON.parse(JSON.stringify(this.y)) }
            if(collideCell(this, organisms, parent)) return;
            for (let i = 0; i < 4; i++) {
                if (randomNumber(0, 3) == 0) {
                    targetLoc.y -= 1;
                } else if (randomNumber(0, 3) == 1) {
                    targetLoc.x += 1;
                } else if (randomNumber(0, 3) == 2) {
                    targetLoc.y += 1;
                } else {
                    targetLoc.x -= 1;
                }

                if (collideCell({x: targetLoc.x, y: targetLoc.y, age: 1000}, organisms, parent)) continue;
                organisms.unshift(new Organism(this.x, this.y, [], mutateBlueprint(parent.blueprintGenes), (cellCost * 6 * 0.5) * 8.5, mutateBrain(parent.connectGenes, parent.blueprintGenes)));
                organisms[0].addCell(new Nucleus(targetLoc.x, targetLoc.y));
                organisms[0].start();
                break;
            }
            this.time = 0;
            parent.energy -= cellCost * 6 * 0.7;
        }
        this.start = (parent) => {
            parent.brain.unshift(new BrainNode([], this, "toCellOutputter", null, "Reproduct Input Node"));
        }
    }
}
class MembranCell extends Cell {
    constructor(x, y) {
        super(x, y, "membran", "lightblue");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 1;
        this.start = (parent) => {

        }
    }
}

class Eater extends Cell {
    constructor(x, y) {
        super(x, y, "eater", "pink");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.timer = 0;
        this.activationLevel = 0;
        this.targetLoc = {}
        this.energyGet = cellCost * (3 / 4) * 8;
        this.update = (parent) => {
            this.timer++;
            if (this.timer > 100 && Math.round(this.activationLevel) == 1) {
                for (let i = 0; i < 3; i++) {
                    this.targetLoc = { x: this.x, y: this.y }
                    if (i == 0) this.targetLoc.y -= 1;
                    if (i == 1) this.targetLoc.x += 1;
                    if (i == 2) this.targetLoc.y += 1;
                    if (i == 3) this.targetLoc.x -= 1;
                    let res = collideCellIndex({ x: this.targetLoc.x, y: this.targetLoc.y, age: 1000 }, organisms, parent)
                    if(organisms[res.arrInd] === undefined) continue;
                    if(organisms[res.arrInd].cells[res.cellInd].name == "reproduction") continue;
                    if (typeof res === "object") {
                        this.timer = 0;
                        organisms[res.arrInd].cells.splice(res.cellInd, 1);
                        parent.energy += this.energyGet;
                        systems.unshift(
                            new ParticleSystem([
                                new ParticleEmitter(
                                    this.targetLoc.x,
                                    this.targetLoc.y,
                                    "explosion",
                                    1,
                                    10,
                                    {
                                        degChange: "Math.sin(thiss.counter) * 5",
                                        rChange: 0,
                                        gChange: 0,
                                        bChange: 0,
                                        alphaChange: -0.05,
                                        speedChange: -0.1,
                                        sizeChange: 0.05,
                                        startSize: 0.2,
                                        startColor: { r: 255, g: 0, b: 0, alpha: 1 },
                                        startSpeed: 0.2,
                                        startDeg: -160,
                                        lifetime: "Math.round(Math.random() * 7)",
                                        moveType: "forward"
                                    },
                                    {
                                        startDegMult: { min: -180, max: 180 },
                                        relativeX: { min: -1, max: 1 },
                                        relativeY: { min: -1, max: 1 },
                                        spawnAtOnce: { min: 100, max: 100 }
                                    }
                                ),
                            ])
                        )
                        console.log("system added")
                    }
                }
            }
        }
        this.start = (parent) => {
            parent.brain.unshift(new BrainNode([], this, "toCellOutputter", null, "Eat Input Node"));
        }
    }
}

class Eye extends Cell {
    constructor(x, y, heading) {
        super(x, y, "cellSensor", "lightgreen")
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.heading = heading;
        this.value = 0;
        this.timer = 0;
        this.distance = 10;
        this.targetLoc = null;
        this.found = false;
        this.start = (parent) => {

        }
        this.update = (parent) => {
            if (this.heading === undefined) {
                this.heading = randomNumber(0, 3)
            }
            this.timer++;
            this.targetLoc = { x: this.x, y: this.y };
            this.found = false;
            if (this.timer > 100) {
                this.timer = 0;
                if (this.heading == 0) {
                    for (let i = 0; i < this.distance; i += UNIT / 2) {
                        if (collideCell({ x: this.targetLoc.x, y: this.targetLoc.y - i, age: 1000 }, organisms, parent)) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 1) {
                    for (let i = 0; i < this.distance; i += UNIT / 2) {
                        if (collideCell({ x: this.targetLoc.x + i, y: this.targetLoc.y, age: 1000 }, organisms, parent)) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 2) {
                    for (let i = 0; i < this.distance; i += UNIT / 2) {
                        if (collideCell({ x: this.targetLoc.x, y: this.targetLoc.y + i, age: 1000 }, organisms, parent)) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 3) {
                    for (let i = 0; i < this.distance; i += UNIT / 2) {
                        if (collideCell({ x: this.targetLoc.x - i, y: this.targetLoc.y, age: 1000 }, organisms, parent)) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
            }

        }
    }
}

class RandomCell extends Cell {
    constructor(x, y) {
        super(x, y, "random", "cyan");
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.value = 0;
        this.time = 0;
        this.start = (parent) => { };
        this.update = () => {
            this.time++;
            if (this.time > 25) {
                this.time = 0;
                this.value = Math.random();
            }
        }
    }
}

class PlantEye extends Cell {
    constructor(x, y, heading) {
        super(x, y, "plantSensor", "brown")
        this.hasImage = true;
        this.frameNumber = 7;
        this.frames = generateFrames(this);
        this.actualFrameIndex = 0;
        this.frameTimer = 0;
        this.heading = heading;
        this.value = 0;
        this.timer = 0;
        this.distance = 85;
        this.targetLoc = null;
        this.found = false;
        this.start = (parent) => {

        }
        this.update = (parent) => {
            if (this.heading === undefined) {
                this.heading = randomNumber(0, 3);
            }
            this.timer++;
            this.targetLoc = { x: this.x, y: this.y };
            this.found = false;
            if (this.timer > 100) {
                this.timer = 0;
                if (this.heading == 0) {
                    for (let i = 0; i < this.distance; i += UNIT / 2) {
                        for (let i2 = 0; i2 < plants.length; i2++) {
                            if (checkAABBCollision({ x: this.targetLoc.x, y: this.targetLoc.y - i }, plants[i2])) {
                                this.value = 1 - (i / this.distance);
                                this.found = true;
                            }
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 1) {
                    for (let i2 = 0; i2 < plants.length; i2++) {
                        if (checkAABBCollision({ x: this.targetLoc.x + i, y: this.targetLoc.y }, plants[i2])) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 2) {
                    for (let i2 = 0; i2 < plants.length; i2++) {
                        if (checkAABBCollision({ x: this.targetLoc.x, y: this.targetLoc.y + i }, plants[i2])) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
                if (this.heading == 3) {
                    for (let i2 = 0; i2 < plants.length; i2++) {
                        if (checkAABBCollision({ x: this.targetLoc.x - i, y: this.targetLoc.y }, plants[i2])) {
                            this.value = 1 - (i / this.distance);
                            this.found = true;
                        }
                    }
                    if (!this.found) {
                        this.value = 0;
                    }
                }
            }
        }
    }
}