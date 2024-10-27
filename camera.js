class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cameraSpeed = 10
        this.getRelativeX = (x) => {
            return x - this.x;
        }
        this.getRelativeY = (y) => {
            return y - this.y;
        }
        this.update = () => {
            if(keys.w) {
                this.y -= this.cameraSpeed;
            }
            if(keys.a) {
                this.x -= this.cameraSpeed;
            }
            if(keys.s) {
                this.y += this.cameraSpeed;
            }
            if(keys.d) {
                this.x += this.cameraSpeed;
            }
        }
    }
}