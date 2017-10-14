/**
 * Constructor for Class MyCircle
 *
 * @augments MyGraphLeaf
 * @param {CGFScene} scene - CGFScene where the circle will be drawn
 * @param {Number} radius - Circle's radius
 * @param {Number} slices - Circle's number of parts
 * @constructor
 */
function MyCircle(scene, radius, slices) {
    MyGraphLeaf.call(this, scene);
    
    this.slices = slices;
    this.radius = radius;

    this.initBuffers();
};

MyCircle.prototype = Object.create(MyGraphLeaf.prototype);
MyCircle.prototype.constructor = MyCircle;

/**
 * Initialize the circle WebGL data buffers
 *
 * @return {null}
 */
MyCircle.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.originalTexCoords = [];

    // Assign vertices
    var deltaTheta = Math.PI * 2 / this.slices;
    for (var i = 0; i < this.slices; i++) {
        this.vertices.push(
            this.radius * Math.cos(deltaTheta * i),
            this.radius * Math.sin(deltaTheta * i), 0);

        this.originalTexCoords.push(
            (Math.cos(deltaTheta * i) / 2) + 0.5,
            0.5 - (Math.sin(deltaTheta * i) / 2));
    }

    // Center vertex
    var center_idx = this.vertices.length / 3;
    this.vertices.push(0, 0, 0);
    this.originalTexCoords.push(0.5, 0.5);

    // Assign indices
    for (var i = 0; i < this.slices; i++) {
        this.indices.push(center_idx, i, (i+1) % this.slices);
    }
    
    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}