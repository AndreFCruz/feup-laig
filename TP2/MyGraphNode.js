/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;
    
    // IDs of child nodes.
    this.children = [];

    // Child leaves.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    this.animation = null;

    //Geometric Matrix
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    // Animation progress
    this.elapsedTime = null;
    this.initialTime = null;
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

/**
 * Update elapsed time
 */
MyGraphNode.prototype.update = function(elapsedTime) {
    if (this.initialTime == null)
            this.initialTime = elapsedTime;
    this.elapsedTime = elapsedTime;
    
    if (this.animation != null)
        this.animation.update(this.elapsedTime - this.initialTime);
}
