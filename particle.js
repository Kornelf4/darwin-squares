let systems = [];
var toRad = (deg) => deg * Math.PI / 180;
function getMovementVec(deg, speed, a) {
    if (a == "for") {
        return { x: parseFloat((speed * Math.cos(toRad(deg))).toFixed(2)), y: parseFloat((speed * Math.sin(toRad(deg))).toFixed(2)) }
    } else {
        return { x: parseFloat((speed * Math.cos(toRad(deg))).toFixed(2)) * -1, y: parseFloat((speed * Math.sin(toRad(deg))).toFixed(2)) * -1 }
    }
}

function partstart() {
    systems.unshift(new ParticleSystem(
        [new ParticleEmitter(
            100,
            100,
            "explosion",
            1,
            10,
            {
                degChange: "Math.sin(thiss.counter) * 5",
                rChange: 0,
                gChange: -20,
                bChange: 0,
                alphaChange: -0.05,
                speedChange: -0.1,
                sizeChange: 0.3,
                startSize: 3,
                startColor: { r: 0, g: 255, b: 255, alpha: 1 },
                startSpeed: 3,
                startDeg: -160,
                lifetime: "Math.round(Math.random() * 70)",
                moveType: "forward"
            },
            {
                startDegMult: { min: -180, max: 180 },
                relativeX: { min: -10, max: 10 },
                relativeY: { min: -10, max: 10 },
                spawnAtOnce: { min: 100, max: 100 }
            }
        ),
        ]))
}

class Particle {
    constructor(x, y, name, size, color, speed, moveDeg, changeOptions, lifetime, moveType) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.size = size;
        this.counter = 0;
        this.color = color;
        this.speed = speed;
        this.moveDeg = moveDeg;
        this.changeOptions = changeOptions;
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.alpha = color.alpha;
        this.lifetime = lifetime;
        this.moveType = moveType;
        this.render = (context) => {
            context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
            context.fillRect(camera.getRelativeX(this.x * UNIT), camera.getRelativeY(this.y * UNIT), this.size * UNIT, this.size * UNIT);
        }
        this.moveForward = () => {
            if (this.moveType == "forward") {
                this.x += getMovementVec(this.moveDeg, this.speed, "for").x;
                this.y += getMovementVec(this.moveDeg, this.speed, "for").y;
            } else {
                this.x += getMovementVec(this.moveDeg, this.speed, "back").x;
                this.y += getMovementVec(this.moveDeg, this.speed, "back").y;
            }
        }
        this.moveBackward = () => {
            this.x -= getMovementVec(this.moveDeg, this.speed).x;
            this.y -= getMovementVec(this.moveDeg, this.speed).y;
        }
        this.updateStuff = () => {
            this.counter++;
            let proccessed = JSON.parse(this.changeOptions);
            let funcP = new Function(
                "thiss",
                `return {
                    moveDeg: ${proccessed.moveDeg},
                    rChange: ${proccessed.rChange},
                    gChange: ${proccessed.gChange},
                    bChange: ${proccessed.bChange},
                    alphaChange: ${proccessed.alphaChange},
                    speedChange: ${proccessed.speedChange},
                    sizeChange: ${proccessed.sizeChange},
                    lifetime: ${proccessed.lifetime}
                }`
            );
            let proccesResult = funcP(this);
            this.moveDeg = parseFloat(parseFloat(this.moveDeg) + parseFloat(proccesResult.moveDeg)).toFixed(3);
            if (this.r + proccesResult.rChange < 255) {
                this.r += proccesResult.rChange;
            }
            this.lifetime = proccesResult.lifetime;
            if (this.g + proccesResult.gChange < 255) {
                this.g += proccesResult.gChange;
            }
            if (this.b + proccesResult.bChange < 255) {
                this.b += proccesResult.bChange;
            }
            this.alpha += proccesResult.alphaChange;
            this.speed += proccesResult.speedChange;
            if (this.size + proccesResult.sizeChange >= 0) {
                this.size += proccesResult.sizeChange;
                this.x -= proccesResult.sizeChange / 2;
                this.y -= proccesResult.sizeChange / 2;
            }
        }
    }
}

function generateRandomFloat(min, max) {
    return parseFloat(Math.random() * (max - min) + min);
}
class ParticleEmitter {
    constructor(x, y, emitParticle, emitCount, emitDelay, particleOptions, emitOptions) {
        this.x = x;
        this.y = y;
        this.counter = 0;
        this.emitParticle = emitParticle;
        this.emitCount = emitCount;
        this.emitDelay = emitDelay;
        this.spawned = 0;
        this.particleOptions = particleOptions;
        this.emitOptions = emitOptions;
        this.emit = (to) => {
            this.counter++;
            if (this.counter == this.emitDelay && this.spawned < emitCount) {
                this.spawned++;
                this.counter = 0;
                let spawn = Math.round(generateRandomFloat(this.emitOptions.spawnAtOnce.min, this.emitOptions.spawnAtOnce.max));
                for (let i = 0; i < spawn; i++) {
                    to.particles.unshift(
                        new Particle(
                            this.x + generateRandomFloat(this.emitOptions.relativeX.min, this.emitOptions.relativeX.max),
                            this.y + generateRandomFloat(this.emitOptions.relativeY.min, this.emitOptions.relativeY.max),
                            this.emitParticle,
                            particleOptions.startSize,
                            { r: particleOptions.startColor.r, g: particleOptions.startColor.g, b: particleOptions.startColor.b, alpha: particleOptions.startColor.alpha },
                            particleOptions.startSpeed,
                            particleOptions.startDeg + generateRandomFloat(this.emitOptions.startDegMult.min, this.emitOptions.startDegMult.max),
                            `{
                                "moveDeg": "${particleOptions.degChange}",
                                "rChange": "${particleOptions.rChange}",
                                "gChange": "${particleOptions.gChange}",
                                "bChange": "${particleOptions.bChange}",
                                "alphaChange": "${particleOptions.alphaChange}",
                                "speedChange": "${particleOptions.speedChange}",
                                "sizeChange": "${particleOptions.sizeChange}",
                                "lifetime": "${particleOptions.lifetime}"
                            }`,
                            particleOptions.lifetime,
                            particleOptions.moveType
                        )
                    );
                }
            }
        }
    }
}

class ParticleSystem {
    constructor(emitters) {
        this.emitters = emitters;
        this.particles = [];
        this.updateEmitters = () => {
            for (let i = 0; i < this.emitters.length; i++) {
                this.emitters[i].emit(this);
            }
        }
        this.render = (context) => {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].render(context);
            }
        }
        this.updateParticles = () => {
            for (let i = 0; i < this.particles.length; i++) {
                if (this.particles[i] === undefined) continue;
                if (this.particles[i].lifetime <= this.particles[i].counter) {
                    this.particles.splice(i, 1);
                }
                if (this.particles[i] === undefined) continue;
                this.particles[i].updateStuff();
                this.particles[i].moveForward();
            }
        }
    }
}

function particleTick() {
    for (let i = 0; i < systems.length; i++) {
        systems[i].updateEmitters();
        systems[i].updateParticles("forward");
        systems[i].render(ctx);
    }
}