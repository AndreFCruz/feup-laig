class BezierAnimation extends Animation {
  constructor(id, speed, controlPoints) {
    super(id);
    this.speed = speed;

    if (controlPoints.length != 4)
      throw new Error("ControlPoints for Bezier Curve must be exactly 4");

    // TODO calcular length com o algoritmo de Casteljou - ver enunciado
    this.length = 1; 
    this.duration = this.length / this.speed;

    this.p1 = controlPoints[0];
    this.p2 = controlPoints[1];
    this.p3 = controlPoints[2];
    this.p4 = controlPoints[3];

    this.diffP1 = this.pointDiff(point2, point1, 4);
    this.diffP2 = this.pointDiff(point3, point2, 4);
    this.diffP3 = this.pointDiff(point4, point3, 4);
  }

  update(elapsedTime) {
    if (elapsedTime > this.duration)
      return null;

    let t = elapsedTime / this.duration;

    let pos = this.calcPosition(t);
    mat4.translate(this.matrix, pos);
    // TODO check if pos can be used interchangeably with vec3

    this.setOrientation(calcDerivative(t));
  }

  pointDiff(p1, p2, scale = 1) {
    return [
        scale * (p1[0] - p2[0]),
        scale * (p1[1] - p2[1]),
        scale * (p1[2] - p2[2])
    ];
  }

  calcPosition(t) {
    if (t <= 0 || t >= 1)
        throw new Error("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 3) * this.p1[0] + 3 * t * Math.pow(1-t, 2) * this.p2[0] + 3 * Math.pow(t, 2) * (1-t) * this.p3[0] + Math.pow(t, 3) * this.p4[0],
        Math.pow(1-t, 3) * this.p1[1] + 3 * t * Math.pow(1-t, 2) * this.p2[1] + 3 * Math.pow(t, 2) * (1-t) * this.p3[1] + Math.pow(t, 3) * this.p4[1],
        Math.pow(1-t, 3) * this.p1[2] + 3 * t * Math.pow(1-t, 2) * this.p2[2] + 3 * Math.pow(t, 2) * (1-t) * this.p3[2] + Math.pow(t, 3) * this.p4[2],
    ];
  }

  calcDerivative(t) {
    if (t <= 0 || t >= 1)
        throw new Error("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 2) * this.diffP1[0] + 2 * (1-t) * t * this.diffP2[0] + Math.pow(t, 2) * this.diffP3[0],
        Math.pow(1-t, 2) * this.diffP1[1] + 2 * (1-t) * t * this.diffP2[1] + Math.pow(t, 2) * this.diffP3[1],
        Math.pow(1-t, 2) * this.diffP1[2] + 2 * (1-t) * t * this.diffP2[2] + Math.pow(t, 2) * this.diffP3[2]
    ];
  }
}
