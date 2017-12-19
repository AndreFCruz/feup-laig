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
        this.pieceType = type;
        this.position = pos;
    }

    /**
     * Getter for the piece position
     */
    getPosition() {
        return this._position;
    }

    /**
     * Updates the animation, by updating the animation matrix
     * 
     * @param {Number} elapsedTime - time elapsed since the animation started
     * @return {null}
     */
    update(elapsedTime) {
    // Template Method
    // update matrix in subclass function
    return null;
    }

    /**
     * Move the piece to a new position
     * 
     * @param {Array} newPosition 
     */
    move(newPosition) {
        return null;
    }

}