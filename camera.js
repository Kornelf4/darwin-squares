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
            if(this.spectate === undefined) {
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
            } else {
                this.x = this.spectate.nucleusLoc.x * UNIT - canvasXsize / 2;
                this.y = this.spectate.nucleusLoc.y * UNIT - canvasYsize / 2;
            }
        }
    }
}