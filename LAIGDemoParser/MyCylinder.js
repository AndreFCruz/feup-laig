/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.height = args[0];
    this.botRadius = args[1];
    this.topRadius = args[2];
    this.stacks = args[3];
    this.slices = args[4];

    this.initBuffers();
};

MyCylinder.prototype = Object.create(MyGraphLeaf.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var deltaRadius = (this.topRadius - this.botRadius) / this.stacks;

    var deltaTheta = (2 * Math.PI) / this.slices;
    var deltaHeight = this.height / this.stacks;

    var deltaTexS = 1.0 / this.slices;
    var deltaTexT = 1.0 / this.stacks;
    var vertexNumber = 1;

    // Vertices, Texture Coordinates & Normals
    for (var i = 0; i <= this.slices; i++) {
        var theta = i * deltaTheta;
        var sCoord = i * deltaTexS;
        var tCoord = 1.0;
        var x = Math.cos(theta);
        var y = Math.sin(theta);

        for (var j = 0; j <= this.stacks; j++) {
            var currentRadius = this.botRadius + j * deltaRadius;
            var tCoord = 1 - j * deltaTexT;
            var z = j * deltaHeight;

            this.vertices.push(x * currentRadius, y * currentRadius, z) ;
            this.normals.push(x * currentRadius, y * currentRadius, 0);
            this.texCoords.push(sCoord, tCoord);

            if (i > 0 && j > 0) {
                this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
                this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);

                vertexNumber++;
            }
        }

        if (i > 0) {
            vertexNumber++;
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
