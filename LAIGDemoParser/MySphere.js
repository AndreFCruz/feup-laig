/**
 * Constructor for Class MySphere
 *
 * @augments MyGraphLeaf
 * @param {CGFScene} scene - CGFScene where the sphere will be drawn
 * @param {Array} args - Array containing the Sphere's height, number of sections along height and number of parts per section 
 * @constructor
 */
function MySphere(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.radius = args[0];
    this.slices = args[1];
    this.stacks = args[2];

    this.initBuffers();
};

MySphere.prototype = Object.create(MyGraphLeaf.prototype);
MySphere.prototype.constructor = MySphere;

/**
 * Initialize the sphere WebGL data buffers
 *
 * @return {null}
 */
MySphere.prototype.initBuffers = function() {
    this.indices = [];
    this.vertices = [];
    this.normals = [];
    this.originalTexCoords = [];

    var deltaTheta = Math.PI / this.stacks;
    var deltaPhi = 2 * Math.PI / this.slices;

    var deltaTexS = 1.0 / this.slices;
    var deltaTexT = 1.0 / this.stacks;

    for (var i = 0; i <= this.stacks; i++) {
        for (var j = 0; j <= this.slices; j++) {
            var x = this.radius * Math.sin(i * deltaTheta) * Math.cos(j * deltaPhi);
            var y = this.radius * Math.sin(i * deltaTheta) * Math.sin(j * deltaPhi);
            var z = this.radius * Math.cos(i * deltaTheta);

            this.vertices.push(x, y, z);

            this.normals.push(
                Math.sin(i * deltaTheta) * Math.cos(j * deltaPhi),
                Math.sin(i * deltaTheta) * Math.sin(j * deltaPhi),
                Math.cos(i * deltaTheta));

            this.originalTexCoords.push(
                j / this.slices,
                i / this.stacks);
        }
    }

    for (var i = 0; i < this.stacks; i++) {
        for (var j = 0; j < this.slices; j++) {
            this.indices.push(
                i * (this.slices + 1) + j,
                (i + 1) * (this.slices + 1) + j,
                (i + 1) * (this.slices + 1) + j + 1);
            this.indices.push(
                i * (this.slices + 1) + j,
                (i + 1) * (this.slices + 1) + j + 1,
                i * (this.slices + 1) + j + 1);
        }
    }

    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

/**
 * Sets the texture amplification factors
 *
 * @param {Number} ampS - Horziontal amplification factor
 * @param {Number} ampT - Vertical amplication factor
 * @return {null}
 */
MySphere.prototype.setTexAmplification = function(ampS, ampT) {
    // no amplification factors on 3D surfaces
}
