/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/
function MyGraphLeaf(scene) {
	CGFobject.call(this, scene);
};

MyGraphLeaf.prototype = Object.create(CGFobject.prototype);
MyGraphLeaf.prototype.constructor = MyGraphLeaf;


