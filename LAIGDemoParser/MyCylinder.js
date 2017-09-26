/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radsConst = (Math.PI / 180) * (360 / this.slices);
    var deltaZ = 1 / this.stacks;

	var deltaX = 1 / this.slices;
 	var deltaY = 1 / this.stacks;
 	var xCoord = 0;
 	var yCoord = 0;

	// Vertices, Texture Coordinates & Normals
	for(var i = 0; i <= this.stacks; i++) {
		for(var j = 0; j < this.slices; j++) {
			this.vertices.push(Math.cos(radsConst * j), Math.sin(radsConst * j), i * deltaZ);
            this.normals.push(Math.cos(radsConst * j), Math.sin(radsConst * j), 0);

			this.vertices.push(Math.cos(radsConst * (j+1)), Math.sin(radsConst * (j+1)), i * deltaZ);
			this.normals.push(Math.cos(radsConst * (j+1)), Math.sin(radsConst * (j+1)), 0);
			            
			this.texCoords.push(xCoord, yCoord);
			xCoord += deltaX;
			this.texCoords.push(xCoord, yCoord);
		}
		xCoord = 0;
		yCoord += deltaY;
	}
	
	// Indices
	for(i = 0; i < this.stacks; i++) {
		for(j = 0; j < this.slices; j++) {
			this.indices.push(i*this.slices*2 + j*2, i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
			this.indices.push(i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
		}
	}
	

    // NOTE: Top and Bottom - normals are shared with sides' normals, imperfect lightning
/*
    // Bottom
    var center_bot = (this.vertices.length / 3);
    this.vertices = this.vertices.concat([0, 0, 0]);
    this.normals = this.normals.concat([0, 0, -1]);
    
    for (var i = 0; i < this.slices; i++) {
        this.indices = this.indices.concat([i, center_bot, (i + 1) % this.slices]);
    }

    // Top
    var center_top = (this.vertices.length / 3);
    this.vertices = this.vertices.concat([0, 0, 1]);
    this.normals = this.normals.concat([0, 0, 1]);
    
    for (var i = this.stacks * this.slices; i < this.slices + this.stacks * this.slices; i++) {
        //this.indices = this.indices.concat([center_top, i, (i + 2) >= this.slices * 2 * (this.stacks + 1) ? i + 2 - this.slices * 2 : i + 2]);
        this.indices = this.indices.concat([
            center_top, i, (i + 1) < (this.vertices.length / 3 - 2) ? i + 1 : i + 1 - this.slices]);
    }
*/

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
