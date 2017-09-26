/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCircle(scene, slices) {
    CGFobject.call(this, scene);
    
    this.slices = slices;

    this.initBuffers();
}
;
MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.texCoords = [];

    // Assign vertices
    var deltaTheta = Math.PI * 2 / this.slices;
    for (var i = 0; i < this.slices; i++) {
        this.vertices.push(Math.cos(deltaTheta * i), Math.sin(deltaTheta * i), 0);
        this.texCoords.push((Math.cos(deltaTheta * i) / 2) + 0.5, 0.5 - (Math.sin(deltaTheta * i) / 2));
    }

    // Center vertex
    var center_idx = this.vertices.length / 3;
    this.vertices.push(0, 0, 0);
    this.texCoords.push(0.5, 0.5);

    // Assign indices
    for (var i = 0; i < this.slices; i++) {
        this.indices.push(center_idx, i, (i+1) % this.slices);
    }
    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
