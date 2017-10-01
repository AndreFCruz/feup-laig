/**
 * MyRectangle
 * @param TODO
 * @constructor
 */
function MyRectangle(scene, minX, minY, maxX, maxY) {
    MyGraphLeaf.call(this, scene);

    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;

    // TODO set amp texture settings

    this.initBuffers();
};

MyQuad.prototype = Object.create(MyGraphLeaf.prototype);
MyQuad.prototype.constructor = MyRectangle;

MyQuad.prototype.initBuffers = function() {
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
