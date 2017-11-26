/**
 * An abstract class representing a generic animation.
 * @abstract
 */
class Animation {

  /**
   * Constructor for abstract animation class
   * 
   * @constructor
   */
  constructor() {
    this.duration;
    this.matrix = mat4.create();

    this.theta_ang = 0; // rotation around xx axis
    this.phi_ang = 0; // rotation around yy axis
  }

  /**
   * Updates the animation, by updating the animation matrix
   * 
   * @param {Number} elapsedTime - time elapsed since the animation started
   * @return {null}
   */
  update(elapsedTime) {
    // Template Method
    // update matrix in subclass function
    return null;
  }

  /**
   * Getter for the animation transformation matrix
   * 
   * @return {mat4}
   */
  get matrix() {
    return this._matrix;
  }

  /**
   * Setter for the animation transformation matrix
   * 
   * @param {mat4} - New matrix to be set
   * @return {null}
   */
  set matrix(mat) {
    this._matrix = mat;
  }

  /**
   * Reset an animation
   * 
   * @return {null}
   */
  reset() {
    // Template Method
    return null;
  }

  /**
   * Converts the cartesion coordiantes from the orientation 3D vector, to Spherical Coordinates.
   * Sets spherical coordinates in theta_ang and phi_ang attributes.
   * 
   * @param {Array} orientation - Array containing orientation vector coordinates
   * @return {null}
   */
  setOrientation(orientation) { 
    if (orientation.length != 3)
      throw new Error("Orientation vector must have 3 coordinates");

    var r = Math.sqrt( Math.pow(orientation[0], 2) + Math.pow(orientation[1], 2) + Math.pow(orientation[2], 2) );

    this.theta_ang = Math.acos(orientation[1] / r) - Math.PI / 2;
    this.phi_ang = Math.atan(orientation[0] / orientation[2]) + (orientation[2] < 0 ? Math.PI : 0);
  }

  /**
   * Applies orientation values to the animation maitrx.
   * Orientation values saved in attributes: theta_ang and phi_ang.
   *
   * @return {null}
   */
  calcMatrixOrientation() {
    mat4.rotate(this.matrix, this.matrix, this.phi_ang, [0, 1, 0]);
    mat4.rotate(this.matrix, this.matrix, this.theta_ang, [1, 0, 0]);
  }

}