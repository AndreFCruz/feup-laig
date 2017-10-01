/**
 * MyTriangle
 * @param pointsArray an array of 9 floating point numbers, 3 points with 3 coordinates
 * @constructor
 */
function MyTriangle(scene, pointsArray) {
    MyGraphLeaf.call(this, scene);

    this.pointA = [pointsArray[0], pointsArray[1], pointsArray[2]];
    this.pointB = [pointsArray[3], pointsArray[4], pointsArray[5]];
    this.pointC = [pointsArray[6], pointsArray[7], pointsArray[8]];

    this.initBuffers();
};

MyTriangle.prototype = Object.create(MyGraphLeaf.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
    this.vertices = [
        this.pointA[0], this.pointA[1], this.pointA[2],
        this.pointB[0], this.pointB[1], this.pointB[2],
        this.pointC[0], this.pointC[1], this.pointC[2]
    ];

    this.indices = [
        0, 1, 2
    ];

    this.texCoords = this.vertices; // TODO do this properly

    this.normals = [ // TODO do this properly
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
