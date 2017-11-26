class BezierAnimation extends Animation {
  constructor(speed, controlPoints) {
    super();
    this.speed = speed;

    if (controlPoints.length != 4)
      throw new Error("ControlPoints for Bezier Curve must be exactly 4");

    this.p1 = controlPoints[0];
    this.p2 = controlPoints[1];
    this.p3 = controlPoints[2];
    this.p4 = controlPoints[3];

    this.length = this.calcCurveLength();
    this.duration = this.length / this.speed * 1000;

    this.diffP1 = pointDiff(this.p2, this.p1, 4);
    this.diffP2 = pointDiff(this.p3, this.p2, 4);
    this.diffP3 = pointDiff(this.p4, this.p3, 4);
  }

  update(elapsedTime) {
    if (elapsedTime > this.duration)
      return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, pos);

    this.setOrientation(this.calcDerivative(t));
    this.calcMatrixOrientation();
  }

  // Approximation of curve's arc length
  calcCurveLength() {
    let steps = 20; // approximation steps
    let length = 0;

    let currPoint = this.p1;

    for (let i = 1; i <= steps; i++) {
      let p = this.calcPosition(i / steps);

      length += distPoints(p, currPoint);
      currPoint = p;
    }

    return length;
  }

  //Recursive Casteljou algorithm for computing a curve's arc length
  casteljou(missingIterations, controlPoints) {
    let cp1 = controlPoints[0];
    let cp3 = controlPoints[1];
    let cp7 = controlPoints[2];
    let cp9 = controlPoints[3];
    
    let cp2 = middlePoint(cp1, cp3);
    let cp4 = middlePoint(cp3, cp7);
    let cp8 = middlePoint(cp7, cp9);
    
    let cp5 = middlePoint(cp2, cp4);
    let cp6 = middlePoint(cp4, cp8);
    
    let midpoint = middlePoint(cp5, cp6);
  
    if (missingIterations == 1)
      return (distPoints(cp1, cp2) +
              distPoints(cp2, cp5) +
              distPoints(cp5, midpoint) +
              distPoints(midpoint, cp6) +
              distPoints(cp6, cp8) +
              distPoints(cp8, cp9));
    else
      return (this.casteljou(--missingIterations, [cp1, cp2, cp5, midpoint]) +
              this.casteljou(missingIterations, [midpoint, cp6, cp8, cp9]));
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
