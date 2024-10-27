class Cell {
    constructor(x, y, name, debugColor) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.debugColor = debugColor;
        this.render = (context) => {
            context.fillStyle = this.debugColor;
            context.fillRect(camera.getRelativeX(this.x) * UNIT,camera.getRelativeY(this.y)* UNIT, UNIT, UNIT)
        }
    }
}