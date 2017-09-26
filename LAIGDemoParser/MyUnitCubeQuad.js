/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyUnitCubeQuad(scene) {
	CGFobject.call(this,scene);
	
	this.quad = new MyQuad(this.scene);
	this.quad.initBuffers();

	this.flip = 180 * this.scene.deg2rad; // doesn't work, why?
};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;

MyUnitCubeQuad.prototype.display = function() {
	
	// face da frente (z)
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();
	
	// face de trás (-z)
	this.scene.pushMatrix();
	this.scene.translate(0, 0, -0.5);
	this.scene.rotate(180 * this.scene.deg2rad, 0, 1, 0);
	this.quad.display();
	this.scene.popMatrix();
	
	// face esquerda (-x)
	this.scene.pushMatrix();
	this.scene.translate(-0.5, 0, 0);
	this.scene.rotate(-90 * this.scene.deg2rad, 0, 1, 0);
	this.quad.display();
	this.scene.popMatrix();

	// face direita (x)
	this.scene.pushMatrix();
	this.scene.translate(0.5, 0, 0);
	this.scene.rotate(90 * this.scene.deg2rad, 0, 1, 0);
	this.quad.display();
	this.scene.popMatrix();

	// face inferior (-y)
	this.scene.pushMatrix();
	this.scene.translate(0, -0.5, 0);
	this.scene.rotate(90 * this.scene.deg2rad, 1, 0, 0);
	this.quad.display();
	this.scene.popMatrix();

	// face superior (y)
	this.scene.pushMatrix();
	this.scene.translate(0, 0.5, 0);
	this.scene.rotate(-90 * this.scene.deg2rad, 1, 0, 0);
	this.quad.display();
	this.scene.popMatrix();
}