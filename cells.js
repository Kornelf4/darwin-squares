class Cell {
    constructor(x, y, name, debugColor) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.debugColor = debugColor;
        this.render = (context) => {
            context.fillStyle = this.debugColor;
            context.fillRect(camera.getRelativeX(this.x * UNIT),camera.getRelativeY(this.y * UNIT), UNIT, UNIT)
        }
    }
}
class Nucleus extends Cell {
    constructor(x, y) {
        super(x, y, "nucleus", "yellow");
        this.value = 1;
    }
}
class Whip extends Cell {
    constructor(x, y) {
        super(x, y, "whip", "blue");
        this.heading = randomNumber(0, 3);
        this.value = 0;
        this.activationLevel = 0;
        this.energyUse = 0.1;
        this.speed = 0.1;
        this.update = (parent) => {
            if(this.activationLevel === undefined || parent.energy < this.energyUse) return;
            for(let i = 0; i < parent.cells.length; i++) {
                if(this.heading == 0) {
                    parent.moveDirect.y -= this.speed * this.activationLevel;
                }
                if(this.heading == 1) {
                    parent.moveDirect.x += this.speed * this.activationLevel;
                }
                if(this.heading == 2) {
                    parent.moveDirect.y += this.speed * this.activationLevel;
                }
                if(this.heading == 3) {
                    parent.moveDirect.x -= this.speed * this.activationLevel;
                }
            }
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
            parent.brain.unshift(new BrainNode(this, [], "fromCellInputter", null, "Tesing Output Node"));
        }
    }
}
class PhotoCell extends Cell {
    constructor(x, y) {
        super(x, y, "green", "green");
        this.value = 0;
        this.update = (parent) => {
            let sunRate = Math.abs(time - dayLength / 2);
            parent.energy += sunRate / 1000;
        }
    }
}