/**
 * A class representing a generic board cell.
 */
class BoardCell {
    
    /**
     * Constructor for the black piece class
     * 
     * @param {Object} scene - The lighting scene
     * @param {Array} pos - The cell position in the board
     * @constructor
     */
    constructor(scene, pos) {
        this.scene = scene;
        
        this.cell = new MyRectangle(scene, [pos[1], 
                                            pos[0] + 1, 
                                            pos[1] + 1, 
                                            pos[0]]);
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(0, 0.1, BOARD_SIZE);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.cell.display();
        this.scene.popMatrix();
    }

}