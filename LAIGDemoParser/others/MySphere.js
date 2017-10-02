/**
 * construtor default da classe 'MySphere'
 * @constructor
 * @augments MyGraphLeaf
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function MySphere(scene, args) {
	MyGraphLeaf.call(this, scene);

	this.radius = args[0];
	this.slices = args[1];
	this.stacks = args[2];
	
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MySphere.prototype = Object.create(MyGraphLeaf.prototype);
MySphere.prototype.constructor = MySphere;

/**
 * inicializa os buffers WebGL da primitiva 'MySphere'
 * @return {null}
 */
MySphere.prototype.initBuffers = function() {

	var texelLengthS = 1.0 / this.slices;
	var texelLengthT = 1.0 / this.stacks;
	var phiIncrement = (2 * Math.PI) / this.slices;
	var thetaIncrement = Math.PI / this.stacks;
	var sCoord = 1.0;
	var vertexNumber = 1;
	var phi = 0;

	for (var i = 0; i <= this.slices; i++) {

		var theta = 0;
		var tCoord = 0.0;
		var deltaX = this.radius * Math.cos(phi);
		var deltaY = this.radius * Math.sin(phi);

		for (var j = 0; j <= this.stacks; j++) {

			var x = deltaX * Math.sin(theta);
			var z = deltaY * Math.sin(theta);
			var y = this.radius * Math.cos(theta);

			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			this.texCoords.push(sCoord, tCoord);

			if (i > 0 && j > 0) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
				this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);

				vertexNumber++;
			}

			theta += thetaIncrement;
			tCoord += texelLengthT;
		}

		if (i > 0) {
			vertexNumber++;
		}

		phi += phiIncrement;
		sCoord -= texelLengthS;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};