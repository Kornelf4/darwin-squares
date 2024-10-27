class Plant {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.color = "green";
        this.size = size;
        this.render = (context) => {
            context.fillStyle = this.color;
            context.fillRect(camera.getRelativeX(this.x * UNIT), camera.getRelativeY(this.y * UNIT), this.size * UNIT, this.size * UNIT);
        } 
    }
}