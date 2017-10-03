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

    // Set-up texture coordinates
    this.calcTexCoords();
    this.texCoords = this.originalTexCoords.slice();

    var normalVec = this.calcNormal();
    this.normals = [];
    for (var i = 0; i < 3; i++) {
        this.normals.push(normalVec[0], normalVec[1], normalVec[2]);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.calcTexCoords = function() {
    this.originalTexCoords = [0, 0];

    var distAB = vec3.distance(this.pointA, this.pointB);
    this.originalTexCoords.push(distAB, 0);

    var vecAB = vec3.create();
    vec3.sub(vecAB, this.pointB, this.pointA);

    var vecAC = vec3.create();
    vec3.sub(vecAC, this.pointC, this.pointA);

    // projection of AC in AB
    var projACinAB = vec3.dot(vecAC, vecAB) / distAB;

    // triangle's height
    var distAC = vec3.len(vecAC);
    var theta = Math.acos(projACinAB / distAC);
    var height = Math.sin(theta) * distAC;

    this.originalTexCoords.push(projACinAB, height);
}

MyTriangle.prototype.calcNormal = function() {
    var a = vec3.fromValues(
        this.pointB[0] - this.pointA[0],
        this.pointB[1] - this.pointA[1],
        this.pointB[2] - this.pointA[2]
    );

    var b = vec3.fromValues(
        this.pointC[0] - this.pointA[0],
        this.pointC[1] - this.pointA[1],
        this.pointC[2] - this.pointA[2]
    );

    var normalVec = vec3.create();
    vec3.cross(normalVec, a, b);

    vec3.normalize(normalVec, normalVec);

    return normalVec;
};

