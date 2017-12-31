/**
 * A class representing a generic worker piece.
 * @augments Piece
 */
class Worker extends Piece {
    
    /**
     * Constructor for the worker piece class
     * 
     * @param {Array} pos - The piece starting position
     * @constructor
     */
    constructor(pos) {
        super(pos, "worker");
    }

    /**
     * Get the Worker's row in the board, for using in PLOG
     * 
     * @return {Number} - The Cell's row
     */
    getRow() {
        return this.position[2];
    }

    /**
     * Get the Worker's column in the board, for using in PLOG
     * 
     * @return {Number} - The Cell's column
     */
    getCol() {
        return this.position[0];
    }

}