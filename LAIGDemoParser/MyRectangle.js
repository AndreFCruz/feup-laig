/**
 * MyRectangle
 * @param TODO
 * @constructor
 */
function MyRectangle(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.minX = args[0];
    this.minY = args[1];
    this.maxX = args[2];
    this.maxY = args[3];

    // TODO set amp texture settings

    this.initBuffers();
};

MyRectangle.prototype = Object.create(MyGraphLeaf.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {
    this.vertices = [
        this.minX, this.minY, 0.0,
        this.maxX, this.minY, 0.0,
        this.minX, this.maxY, 0.0,
        this.maxX, this.maxY, 0.0
    ];

    this.indices = [
        0, 1, 2, 3
    ];

    this.texCoords = [
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    this.normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
    this.initGLBuffers();
}
;
