class CircularAnimation extends Animation {
  constructor(id, speed, center, radius, startang, rotang) {
    super(id);

    this.speed = speed;
    this.center = center;
    this.radius = radius;
    this.startAng = startang;
    this.rotAng = rotang;

    this.deltaAng = rotang - startang;
  }
}
