/**
 * A class used to represent a Circular Animation
 * @augments Animation
 */
class CircularAnimation extends Animation {

  /**
   * Constructor for circular animation class
   * 
   * @augments Animation
   * @param {Number} speed - Animation speed
   * @param {Number} center - Center of the circular animation
   * @param {Number} radius - Radius of the circular animation
   * @param {Number} startang - Starting angle for the animation
   * @param {Number} rotang - Total rotation angle for the animation
   * @constructor
   */
  constructor(speed, center, radius, startang, rotang) {
    super();

    this.speed = speed;
    this.center = center;
    this.radius = radius;

    let angToRad = Math.PI / 180;
    this.startAng = startang * angToRad;
    this.rotAng = rotang * angToRad;
    this.length = Math.abs(rotang) / 360 * (2 * this.radius * Math.PI);

    this.duration = this.length / this.speed * 1000;
  }

  /**
   * @inheritdoc
   * @override 
   */
  update(elapsedTime) {
  	if (elapsedTime > this.duration)
  		return null;

  	let t = elapsedTime / this.duration;
    if (t < 0 || t > 1)
      throw new Error("Invalid t parameter to Circular Animation");

  	mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.center);
    mat4.rotateY(this.matrix, this.matrix, this.rotAng * t);
    mat4.translate(this.matrix, this.matrix, [this.radius, 0, 0]);
    mat4.rotateY(this.matrix, this.matrix, this.startAng);
  }
}
