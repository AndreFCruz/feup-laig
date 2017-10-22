/**
 * Constructor for Class MyPatch
 *
 * @augments MyGraphLeaf
 * @param {CGFScene} scene - CGFScene where the cylinder will be drawn
 * @param {Array} args - Array containing the patches arguments
 * @param {Array} controlPoints - Array containing the control points for the NURBS surface
 * @constructor
 */
function MyPatch(scene, args, controlPoints) {
    MyGraphLeaf.call(this, scene);

    this.controlPoints = controlPoints;
    this.partsU = parseInt(args[0]);
    this.partsV = parseInt(args[1]);
    this.degU = controlPoints.length - 1;
    this.degV = controlPoints[0].length - 1;

    this.nurbsObj = this.makeSurface();
};

MyPatch.prototype = Object.create(MyGraphLeaf.prototype);
MyPatch.prototype.constructor = MyPatch;

/**
 * Function that creates the patch surface
 *
 * @param {Number} degU - degree in the U direction
 * @param {Number} degV - degree in the V direction
 * @param {Array} controlVertexes - array containing the control vertices
 * @param {Number} partsU - number of parts in the U direction
 * @param {Number} partsV - number of parts in the V direciton
 * @return {CGFnurbsObject}
 */
MyPatch.prototype.makeSurface = function() {
        
    var knots1 = getKnotsVector(this.degU);
    var knots2 = getKnotsVector(this.degV);
        
    var nurbsSurface = new CGFnurbsSurface(this.degU, this.degV, knots1, knots2, this.controlPoints);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
    return obj;
}

/**
 * Creater of the Knot Vector.
 * Important to characterize the parametric space of the curve
 *
 * @return {Array} - Array containing the Knots.
 */
function getKnotsVector(degree) {
    
    var v = new Array();
    for (var i=0; i<=degree; i++) {
        v.push(0);
    }
    for (var i=0; i<=degree; i++) {
        v.push(1);
    }
    return v;
}
/**
 * Display the NURBS object in the CGFScene
 *
 * @return {null}
 */
MyPatch.prototype.display = function() {
    this.nurbsObj.display();
}

/**
 * Sets the Texture amplification factors
 *
 * @param {Number} ampS - Horziontal amplification factor
 * @param {Number} ampT - Vertical amplication factor
 * @return {null}
 */
MyPatch.prototype.setTexAmplification = function(ampS, ampT) {
    // no amplification factors on 3D surfaces
}