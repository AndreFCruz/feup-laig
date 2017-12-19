/**
 * An abstract class representing a generic piece.
 * @abstract
 */
class Piece {

    /**
     * Constructor for abstract Piece class
     * 
     * @param {Array} pos - The piece starting position
     * @param {String} type - The piece type
     * @constructor
     */
    constructor(pos, type) {
        //Flag indicating if piece is on the board
        this.onBoard = false;

        this.type = type;
        this.position = pos;
    }

    /**
     * Getter for the piece position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Getter for the piece position
     */
    getType() {
        return this.type;
    }

    /**
     * Move the piece to a new position
     * 
     * @param {Array} newPosition 
     */
    move(newPosition) {
        this.onBoard = true;
        return null;
    }

}