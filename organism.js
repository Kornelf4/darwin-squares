class Organism {
    constructor(centerX, centerY, starterCells, blueprint, energy) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.cells = starterCells;
        this.blueprint = blueprint;
        this.energy = energy;
        this.moveDirect = {x: 0, y: 0};
        this.render = (context) => {
            for(let i = 0; i < this.cells.length; i++) {
                this.cells[i].render(context);
            } 
        }
    }
}