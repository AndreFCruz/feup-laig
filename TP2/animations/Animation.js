class Animation {

  constructor(id) {
    this.id = id;
    this.active = false;

    this.duration;
    this.matrix = mat4.create();

    this.theta_ang = 0; // rotation around xx axis
    this.phi_ang = 0; // rotation around yy axis
  }

  update(elapsedTime) {
    // update matrix in subclass function
    return null;
  }

  start() {
    active = true;
  }

  stop() {
    active = false;
  }

  isActive() {
    return this.isActive;
  }

  get matrix() {
    return this._matrix;
  }

  set matrix(mat) {
    this._matrix = mat;
  }

  // Converts Cartesian coordinates (from orientation 3D vector) to Spherical Coordinates
  setOrientation(orientation) { 
    if (orientation.length != 3)
      throw new Error("Orientation vector must have 3 coordinates");

    var r = Math.sqrt( Math.pow(orientation[0], 2) + Math.pow(orientation[1], 2) + Math.pow(orientation[2], 2) );

    this.theta_ang = Math.acos(orientation[1] / r) - Math.PI / 2;
    this.phi_ang = Math.atan(orientation[0] / orientation[2]) + (orientation[2] < 0 ? Math.PI : 0);
  }

  orientate() {
    mat4.rotateY(this.matrix, this.matrix, this.phi_ang);
    mat4.rotateX(this.matrix, this.matrix, this.theta_ang);
  }

}