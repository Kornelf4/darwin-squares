class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.getRelativeX = (x) => {
            return x - this.x;
        }
        this.getRelativeY = (y) => {
            return y - this.y;
        }
    }
}