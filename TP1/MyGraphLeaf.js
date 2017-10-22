/**
 * Constructor for Class MyGraphLeaf
 *
 * @augments CGFObject
 * @param {CGFScene} scene - CGFScene where the capless the LEAF will be drawn
 * @constructor
 */
function MyGraphLeaf(scene) {
	CGFobject.call(this, scene);

	this.originalTexCoords = [];
};

MyGraphLeaf.prototype = Object.create(CGFobject.prototype);
MyGraphLeaf.prototype.constructor = MyGraphLeaf;


/**
 * Sets the Leaf's texture amplification factors
 *
 * @param {Number} ampS - Horziontal amplification factor
 * @param {Number} ampT - Vertical amplication factor
 * @return {null}
 */
MyGraphLeaf.prototype.setTexAmplification = function(ampS, ampT) {
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.originalTexCoords[i] / ampS;
		this.texCoords[i+1] = this.originalTexCoords[i+1] / ampT;
	}

	this.updateTexCoordsGLBuffers();
}