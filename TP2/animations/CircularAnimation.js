class CircularAnimation extends Animation {
  constructor(id, speed, center, radius, startang, rotang) {
    super(id);

    this.speed = speed;
    this.center = center;
    this.radius = radius;

    let angToRad = Math.PI / 180;
    this.startAng = startang * angToRad;
    this.rotAng = rotang * angToRad;
    this.length = rotang / 360 * (2 * this.radius * Math.PI);

    this.duration = this.length / this.speed * 1000;
  }

  update(elapsedTime) {
  	if (elapsedTime > this.duration)
  		return null;

  	let t = elapsedTime / this.duration;
  	let pos = this.calcPosition(t);

  	mat4.identity(this.matrix);
  	mat4.translate(this.matrix, this.matrix, pos);
  }

  calcPosition(t) {
    if (t < 0 || t > 1)
        throw new Error("Invalid t parameter to Circular Animation");

    let currentAng = this.startAng + t * this.rotAng;
    return [Math.cos(currentAng) * this.radius, 0, Math.sin(currentAng) * this.radius];
  }
}
