/**
 * MyCaplessCylinder
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

MyCaplessCylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.originalTexCoords = [];

    var deltaRadius = (this.topRadius - this.botRadius) / this.stacks;

    var deltaTheta = (2 * Math.PI) / this.slices;
    var deltaHeight = this.height / this.stacks;

    var deltaTexS = 1.0 / this.slices;
    var deltaTexT = 1.0 / this.stacks;
    var vertexNumber = 1;

    var sCoord = 0;
    var tCoord = 0;

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

            this.originalTexCoords.push(sCoord, tCoord);
            sCoord += deltaTexS;
        }
        sCoord = 0;
        tCoord += deltaTexT;
    }

    for (i = 0; i < this.stacks; i++) {
        for (j = 0; j < this.slices - 1; j++) {
            this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
            this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
        }

        this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
        this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
    }

    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
