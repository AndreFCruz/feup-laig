/**
 * MyBezier
 * Bezier curve of degree 3 and its derivative of degree 2.
 */
function MyBezier(point1, point2, point3, point4) {
    
    this.p1 = point1;
    this.p2 = point2;
    this.p3 = point3;
    this.p4 = point4;

    this.diffP1 = this.pointDiff(point2, point1, 4);
    this.diffP2 = this.pointDiff(point3, point2, 4);
    this.diffP3 = this.pointDiff(point4, point3, 4);
};

MyBezier.prototype.pointDiff = function(p1, p2, scale = 1) {
    return [
        scale * (p1[0] - p2[0]),
        scale * (p1[1] - p2[1]),
        scale * (p1[2] - p2[2])
    ];
};

MyBezier.prototype.calcPosition = function(t) {
    if (t < 0 || t > 1)
        console.log("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 3) * this.p1[0] + 3 * t * Math.pow(1-t, 2) * this.p2[0] + 3 * Math.pow(t, 2) * (1-t) * this.p3[0] + Math.pow(t, 3) * this.p4[0],
        Math.pow(1-t, 3) * this.p1[1] + 3 * t * Math.pow(1-t, 2) * this.p2[1] + 3 * Math.pow(t, 2) * (1-t) * this.p3[1] + Math.pow(t, 3) * this.p4[1],
        Math.pow(1-t, 3) * this.p1[2] + 3 * t * Math.pow(1-t, 2) * this.p2[2] + 3 * Math.pow(t, 2) * (1-t) * this.p3[2] + Math.pow(t, 3) * this.p4[2],
    ];
};

MyBezier.prototype.calcDerivative = function(t) {
    if (t < 0 || t > 1)
        console.log("Invalid t parameter to Bezier curve");

    return [
        Math.pow(1-t, 2) * this.diffP1[0] + 2 * (1-t) * t * this.diffP2[0] + Math.pow(t, 2) * this.diffP3[0],
        Math.pow(1-t, 2) * this.diffP1[1] + 2 * (1-t) * t * this.diffP2[1] + Math.pow(t, 2) * this.diffP3[1],
        Math.pow(1-t, 2) * this.diffP1[2] + 2 * (1-t) * t * this.diffP2[2] + Math.pow(t, 2) * this.diffP3[2]
    ];
};
