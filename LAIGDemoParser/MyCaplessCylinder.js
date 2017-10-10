/**
 * Constructor for Class MyCaplessCylinder
 *
 * @augment MyGraphLeaf
 * @param {CGFScene} scene - CGFScene where the capless cylinder will be drawn
 * @param {Number} height - Cylinder's height
 * @param {Number} botRadius - Cylinder's bottom base radius
 * @param {Number} topRadius - Cylinder's top base radius
 * @param {Number} stacks - Cylinder's number of sections along height
 * @param {Number} slices - Cylinder's number of parts per section
 * @constructor
 */
function MyCaplessCylinder(scene, height, botRadius, topRadius, stacks, slices) {
    MyGraphLeaf.call(this, scene);

    this.height = height;
    this.botRadius = botRadius;
    this.topRadius = topRadius;
    this.stacks = stacks;
    this.slices = slices;

    this.initBuffers();
};

MyCaplessCylinder.prototype = Object.create(MyGraphLeaf.prototype);
MyCaplessCylinder.prototype.constructor = MyCaplessCylinder;

/**
 * Initialize the capless cylinder WebGL data buffers
 *
 * @return {null}
 */
MyCaplessCylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.originalTexCoords = [];

    var deltaRadius = (this.topRadius - this.botRadius) / this.stacks;

    var deltaTheta = (2 * Math.PI) / this.slices;
    var deltaHeight = this.height / this.stacks;

    var deltaX = 1.0 / this.slices;
    var deltaY = 1.0 / this.stacks;
    var vertexNumber = 1;

    var xCoord = 0;
    var yCoord = 0;

    for (i = 0; i <= this.stacks; i++) {
        for (j = 0; j < this.slices; j++) {
            this.vertices.push(
                Math.cos(deltaTheta * j) * (i * deltaRadius + this.botRadius),
                Math.sin(deltaTheta * j) * (i * deltaRadius + this.botRadius),
                i * deltaHeight);
            this.normals.push(
                Math.cos(deltaTheta * j),
                Math.sin(deltaTheta * j),
                0);

            this.vertices.push(
                Math.cos(deltaTheta * (j+1)) * (i * deltaRadius + this.botRadius),
                Math.sin(deltaTheta * (j+1)) * (i * deltaRadius + this.botRadius),
                i * deltaHeight);
            this.normals.push(
                Math.cos(deltaTheta * (j+1)),
                Math.sin(deltaTheta * (j+1)),
                0);

            this.originalTexCoords.push(xCoord, yCoord);
            xCoord += deltaX;
            this.originalTexCoords.push(xCoord, yCoord);
        }

        xCoord = 0;
        yCoord += deltaY;
    }

    // Indices
    for(i = 0; i < this.stacks; i++) {
        for(j = 0; j < this.slices; j++) {
            this.indices.push(i*this.slices*2 + j*2, i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
            this.indices.push(i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
        }
    }

    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
