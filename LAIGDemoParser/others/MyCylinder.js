/**
 * construtor default da classe 'MyCylinder'
 * @constructor
 * @augments MyGraphLeaf
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} height - altura do cilindro
 * @param {Number} radiusBottom - raio da base inferior do cilindro
 * @param {Number} radiusTop - radio da base superior do cilindro
 * @param {Number} stacks - número de secções do cilindro em altura
 * @param {Number} slices - número de secçoes do cilindro em torno dos raios
 * @return {null}
 */
function MyCylinder(scene, args) {
	MyGraphLeaf.call(this, scene);

	this.height = args[0];
	this.radiusBottom = args[1];
	this.radiusTop = args[2];
	this.stacks = args[3];
	this.slices = args[4];

	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyCylinder.prototype = Object.create(MyGraphLeaf.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/**
 * inicializa os buffers WebGL da primitiva 'MyCylinder'
 * @return {null}
 */
MyCylinder.prototype.initBuffers = function() {

	var radiusIncrement = (this.radiusTop - this.radiusBottom) / this.stacks;
	var stackIncrement = this.height / this.stacks;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var texelIncrementS = 1.0 / this.slices;
	var texelIncrementT = 1.0 / this.stacks;
	var vertexNumber = 1;
	var sCoord = 0.0;
	var theta = 0;

	for (var i = 0; i <= this.slices; i++) {

		var tCoord = 1.0;
		var nRadius = this.radiusBottom;
		var x = Math.cos(theta);
		var y = Math.sin(theta);
		var z = 0;

		for (var j = 0; j <= this.stacks; j++) {

			this.vertices.push(x * nRadius, y * nRadius, z) ;
			this.normals.push(x * nRadius, y * nRadius, 0);
			this.texCoords.push(sCoord, tCoord);

			if (i > 0 && j > 0) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
				this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);

				vertexNumber++;
			}

			z += stackIncrement;
			tCoord -= texelIncrementT;
			nRadius += radiusIncrement;
		}

		if (i > 0) {
			vertexNumber++;
		}

		theta += thetaIncrement;
		sCoord += texelIncrementS;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};