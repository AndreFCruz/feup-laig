/**
 * A class representing a generic board cell.
 */
class BoardCell {
    
    /**
     * Constructor for the black piece class
     * 
     * @param {Array} pos - The cell position in the board
     * @constructor
     */
    constructor(scene, pos) {
        this.scene = scene;
        
        this.cell = new MyRectangle(scene, [pos[0], pos[1] + 1, pos[0] + 1, pos[1]]);
    }

    display() {
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI * -90 / 180, 0, 1, 0);
            this.scene.rotate(Math.PI * -90 / 180, 1, 0, 0);
            this.cell.display();
        this.scene.popMatrix();
    }

}