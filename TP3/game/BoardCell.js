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
        this.position = pos;
        
        this.cell = new MyRectangle(scene, [pos[1], 
                                            pos[0] + 0.96, 
                                            pos[1] + 0.96, 
                                            pos[0]]);
    }

    /**
     * Display the current cell in the screen
     * 
     * @return {null}
     */
    display() {
        this.scene.pushMatrix();
            this.scene.translate(0, 0.03, BOARD_SIZE);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.cell.display();
        this.scene.popMatrix();
    }

    /**
     * Get the Cell's row in the board, for using in PLOG
     * 
     * @return {Number} - The Cell's row
     */
    getRow() {
        // Because of how rectangles are initially displayed and 
        // Because index starts at 0 and picking rows at 1
        return BOARD_SIZE - 1 - this.position[0];
    }

    /**
     * Get the Cell's column in the board, for using in PLOG
     * 
     * @return {Number} - The Cell's column
     */
    getCol() {
        return this.position[1];
    }
}