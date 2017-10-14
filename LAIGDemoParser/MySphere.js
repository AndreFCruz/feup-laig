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
    this.vertices = [];
    this.indices = [];
    this.originalTexCoords = [];
    this.normals = [];

    var deltaTheta = Math.PI / this.stacks;
    var deltaPhi = (2 * Math.PI) / this.slices;

    var deltaTexT = 1.0 / this.stacks;
    var deltaTexS = 1.0 / this.slices;

    var vertexCount = 1;

    // Vertices - Using Spherical Coordinates
    for (var i = 0; i <= this.slices; i++) {
        var deltaX = Math.cos(i * deltaPhi) * this.radius;
        var deltaY = Math.sin(i * deltaPhi) * this.radius;
        var sCoord = 1 - i * deltaTexS;

        for (var j = 0; j <= this.stacks; j++) {
            var x = Math.sin(j * deltaTheta) * deltaX;
            var z = Math.sin(j * deltaTheta) * deltaY;
            var y = Math.cos(j * deltaTheta) * this.radius;

            var tCoord = j * deltaTexT;
            this.originalTexCoords.push(sCoord, tCoord);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);

            if (i > 0 && j > 0) {
                this.indices.push(
                    vertexCount,
                    vertexCount + this.stacks,
                    vertexCount + this.stacks + 1
                    );
                this.indices.push(
                    vertexCount + this.stacks,
                    vertexCount,
                    vertexCount - 1
                    );

                vertexCount++;
            }
        }

        if (i > 0)
            vertexCount++;
    }

    this.texCoords = this.originalTexCoords.slice(); // clone array

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

/**
 * Sets the Texture amplification factors
 *
 * @param {Number} ampS - Horziontal amplification factor
 * @param {Number} ampT - Vertical amplication factor
 * @return {null}
 */
MySphere.prototype.setTexAmplification = function(ampS, ampT) {
    // no amplification factors on 3D surfaces
}
