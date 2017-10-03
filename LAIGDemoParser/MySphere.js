/**
 * MySphere
 * @constructor
 */
function MySphere(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.radius = args[0];
    this.slices = args[1];
    this.stacks = args[2];

    this.initBuffers();
};

MySphere.prototype = Object.create(MyGraphLeaf.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.texCoords = [];
    this.normals = [];

    var deltaTheta = Math.PI / this.stacks;
    var deltaPhi = (2 * Math.PI) / this.slices;

    var deltaTexT = 1.0 / this.stacks;
    var deltaTexS = 1.0 / this.slices;

    var vertexCount = 1;

    // Vertices - Using Spherical Coordinates
    for (var i = 0; i <= this.slices; i++) {
        var deltaX = Math.cos(i * deltaPhi) * this.radius;
        var deltaY = Math.sin(i * deltaPhi) * this.radius;
        var sCoord = 1 - i * deltaTexS;

        for (var j = 0; j <= this.stacks; j++) {
            var x = Math.sin(j * deltaTheta) * deltaX;
            var z = Math.sin(j * deltaTheta) * deltaY;
            var y = Math.cos(j * deltaTheta) * this.radius;

            var tCoord = j * deltaTexT;
            this.texCoords.push(sCoord, tCoord);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);

            if (i > 0 && j > 0) {
                this.indices.push(
                    vertexCount,
                    vertexCount + this.stacks,
                    vertexCount + this.stacks + 1
                    );
                this.indices.push(
                    vertexCount + this.stacks,
                    vertexCount,
                    vertexCount - 1
                    );

                vertexCount++;
            }
        }

        if (i > 0)
            vertexCount++;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
