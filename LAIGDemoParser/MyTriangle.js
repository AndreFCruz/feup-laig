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

    var normalVec = this.calcNormal();
    this.normals = [];
    for (var i = 0; i < 3; i++)
        this.normals = this.normals.concat(normalVec);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.calcNormal = function() {
    var a = [
        this.pointB[0] - this.pointA[0],
        this.pointB[1] - this.pointA[1],
        this.pointB[2] - this.pointA[2]
    ];

    var b = [
        this.pointC[0] - this.pointA[0],
        this.pointC[1] - this.pointA[1],
        this.pointC[2] - this.pointA[2]
    ];

    var vec = crossProduct(a, b);

    return normalizeVector(vec);
};

function normalizeVector(a) {
    var len = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    return [a[0] / len, a[1] / len, a[2] / len];
}

function crossProduct(a, b) {
    if (a.length != 3 || b.length != 3)
        return null;

    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}