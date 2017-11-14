class Animation {

  constructor(id) {
    this.id = id;
    this.active = false;

    this.theta_ang = 0; // rotation around xx axis
    this.phi_ang = 0; // rotation around yy axis
  }

  update(delta) {
    return null;
  }

  // Converts Cartesian coordinates (from orientation 3D vector) to Spherical Coordinates
  setOrientation(orientation) { 
    if (orientation.length != 3)
      throw new Error("Orientation vector must have 3 coordinates");

    var r = Math.sqrt( Math.pow(this.orientation[0], 2) + Math.pow(this.orientation[1], 2) + Math.pow(this.orientation[2], 2) );

    this.theta_ang = Math.acos(this.orientation[1] / r) - Math.PI / 2;
    this.phi_ang = Math.atan(this.orientation[0] / this.orientation[2]) + (this.orientation[2] < 0 ? Math.PI : 0);
  }

  displayOrientation(scene) {
    scene.rotate(this.phi_ang, 0, 1, 0);
    scene.rotate(this.theta_ang, 1, 0, 0);
  }

}