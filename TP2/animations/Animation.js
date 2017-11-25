class Animation {

  constructor() {
    this.duration;
    this.matrix = mat4.create();

    this.theta_ang = 0; // rotation around xx axis
    this.phi_ang = 0; // rotation around yy axis
  }

  update(elapsedTime) {
    // Template Method
    // update matrix in subclass function
    return null;
  }

  get matrix() {
    return this._matrix;
  }

  set matrix(mat) {
    this._matrix = mat;
  }

  reset() {
    // Template Method
    return null;
  }

  // Converts Cartesian coordinates (from orientation 3D vector) to Spherical Coordinates
  setOrientation(orientation) { 
    if (orientation.length != 3)
      throw new Error("Orientation vector must have 3 coordinates");

    var r = Math.sqrt( Math.pow(orientation[0], 2) + Math.pow(orientation[1], 2) + Math.pow(orientation[2], 2) );

    this.theta_ang = Math.acos(orientation[1] / r) - Math.PI / 2;
    this.phi_ang = Math.atan(orientation[0] / orientation[2]) + (orientation[2] < 0 ? Math.PI : 0);
  }

  calcMatrixOrientation() {
    mat4.rotate(this.matrix, this.matrix, this.phi_ang, [0, 1, 0]);
    mat4.rotate(this.matrix, this.matrix, this.theta_ang, [1, 0, 0]);
  }

}