/**
 * Constructor for Class MyRectangle
 *
 * @augments MyGraphLeaf
 * @param {CGFScene} scene - CGFScene where the rectangle will be drawn
 * @param {Array} args - Array containing the rectangle left-top and right-bottom vertices coordinates
 * @constructor
 */
function MyRectangle(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.minX = args[0];
    this.maxY = args[1];
    this.maxX = args[2];
    this.minY = args[3];

    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;

    this.initBuffers();
};

MyRectangle.prototype = Object.create(MyGraphLeaf.prototype);
MyRectangle.prototype.constructor = MyRectangle;

/**
 * Initialize the rectangle WebGL data buffers
 *
 * @return {null}
 */
MyRectangle.prototype.initBuffers = function() {
    this.vertices = [
        this.minX, this.minY, 0.0,
        this.maxX, this.minY, 0.0,
        this.maxX, this.maxY, 0.0,
        this.minX, this.maxY, 0.0
    ];

    this.indices = [
        0, 1, 2,
        2, 3, 0
    ];

    this.originalTexCoords = [
        0.0, this.height,
        this.width, this.height,
        this.width, 0.0,
        0.0, 0.0
    ];

    this.normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];

    this.texCoords = this.originalTexCoords.slice(); // clone array
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
