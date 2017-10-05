/**
 * MyRectangle
 * @param TODO
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
        0.0, 0.0,
        this.width, 0.0,
        this.width, this.height,
        0.0, this.height
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
};
