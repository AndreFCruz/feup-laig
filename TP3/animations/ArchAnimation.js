/**
 * A class used to represent an Arch Animation
 * @augments Animation
 */
class ArchAnimation extends Animation {

    constructor (xi, zi, xf, zf, flip = false) {
        super();
        this.xi = xi;
        this.zi = zi;
        this.xf = xf;
        this.zf = zf;

        this.currX = 0;
        this.currZ = 0;
        this.currY = 0;

        this.distance = Math.sqrt(Math.pow(this.xf - this.xi, 2) + Math.pow(this.zf - this.zi, 2));
        this.acumulatedDistance = 0;
        this.time = this.distance * 200;

        this.angle = Math.PI;
        this.elapsedAngle = 0;

        this.previousTick = null;

        this.finished = false;
        this.flip = flip;
    }

    update (currTime) {
        if (this.acumulatedDistance >= this.distance) {
            this.finished = true;
            return;
        }
        if (this.previousTick == null) {
            this.previousTick = currTime;
            return;
        }
        let deltaTime = currTime - this.previousTick;
        this.previousTick = currTime;

        this.dx = (this.xf - this.xi) * deltaTime / this.time;
        this.dz = (this.zf - this.zi) * deltaTime / this.time;
        let angle = this.angle * deltaTime / this.time;

        this.currX += this.dx;
        this.currZ += this.dz;
        this.elapsedAngle += angle;

        this.currY = 6 * Math.sin(this.elapsedAngle);

        this.acumulatedDistance += Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dz, 2));
        this.updateMatrix();
    }

    updateMatrix() {
        mat4.identity(this.matrix);
        
        if (this.flip) {
            mat4.translate(this.matrix, this.matrix, [this.currX + 0.5, this.currY, this.currZ + 0.5]);
            mat4.rotate(this.matrix, this.matrix, this.elapsedAngle * 10, [1, 0, 0]);
            mat4.translate(this.matrix, this.matrix, [-0.5, -0.075, -0.5]);
        } else {
            mat4.translate(this.matrix, this.matrix, [this.currX, this.currY, this.currZ]);
        }
    }
}