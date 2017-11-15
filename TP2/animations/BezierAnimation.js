class BezierAnimation extends Animation {
  constructor(id, speed, controlPoints) {
    super(id);
    this.speed = speed;

    if (controlPoints.length != 4)
      throw new Error("ControlPoints for Bezier Curve must be exactly 4");

    this.p1 = controlPoints[0];
    this.p2 = controlPoints[1];
    this.p3 = controlPoints[2];
    this.p4 = controlPoints[3];

    this.length = this.calcCurveLength();
    this.duration = this.length / this.speed;

    this.diffP1 = pointDiff(this.p2, this.p1, 4);
    this.diffP2 = pointDiff(this.p3, this.p2, 4);
    this.diffP3 = pointDiff(this.p4, this.p3, 4);
  }

  update(elapsedTime) {
    if (elapsedTime > this.duration)
      return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);
    //mat4.fromTranslation(this.matrix, pos);
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, pos);
    // TODO check if pos can be used interchangeably with vec3

    this.setOrientation(this.calcDerivative(t));
  }

  // Approximation of curve's arc length
  calcCurveLength() {
    let steps = 20; // approximation steps
    let length = 0;

    let currPoint = this.p1;

    for (let i = 1; i <= steps; i++) {
      let p = this.calcPosition(i / steps);
      let change = pointDiff(p, currPoint);

      length += Math.sqrt(
                      Math.pow(change[0], 2) + 
                      Math.pow(change[1], 2) + 
                      Math.pow(change[2], 2)); 
      currPoint = p;
    }

    return length;
  }

  calcPosition(t) {
    if (t < 0 || t > 1)
        throw new Error("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 3) * this.p1[0] + 3 * t * Math.pow(1-t, 2) * this.p2[0] + 3 * Math.pow(t, 2) * (1-t) * this.p3[0] + Math.pow(t, 3) * this.p4[0],
        Math.pow(1-t, 3) * this.p1[1] + 3 * t * Math.pow(1-t, 2) * this.p2[1] + 3 * Math.pow(t, 2) * (1-t) * this.p3[1] + Math.pow(t, 3) * this.p4[1],
        Math.pow(1-t, 3) * this.p1[2] + 3 * t * Math.pow(1-t, 2) * this.p2[2] + 3 * Math.pow(t, 2) * (1-t) * this.p3[2] + Math.pow(t, 3) * this.p4[2],
    ];
  }

  calcDerivative(t) {
    if (t < 0 || t > 1)
        throw new Error("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 2) * this.diffP1[0] + 2 * (1-t) * t * this.diffP2[0] + Math.pow(t, 2) * this.diffP3[0],
        Math.pow(1-t, 2) * this.diffP1[1] + 2 * (1-t) * t * this.diffP2[1] + Math.pow(t, 2) * this.diffP3[1],
        Math.pow(1-t, 2) * this.diffP1[2] + 2 * (1-t) * t * this.diffP2[2] + Math.pow(t, 2) * this.diffP3[2]
    ];
  }
}
