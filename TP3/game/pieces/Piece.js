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
        this.type = type;

        // World position
        this.position = pos ? pos : [0, 0, 0];

        // Board position
        this.boardPos = null;

        // Animation progress
        this.elapsedTime = null;
        this.initialTime = null;

        this.animation = null;        
    }

    get boardPos() {
        return this._boardPos;
    }

    set boardPos(cell) {
        if (! cell) return;
        this._boardPos = cell;
        this.position = [cell[0], 0, cell[1]];
    }

    get position() {
        return this._position;
    }

    set position(pos) {
        this._position = pos;

        this.positionMatrix = mat4.create();
        mat4.translate(this.positionMatrix, this.positionMatrix, pos);
    }

    /**
     * Getter for the piece position matrix
     * 
     * @return {mat4} - Piece current position respective matrix
     */
    getPositionMatrix() {
        this.result = mat4.clone(this.positionMatrix);
        if (this.animation) {
            mat4.multiply(this.result, this.positionMatrix, this.animation.matrix);
        } // TODO change order of operands in multiply ?
        return this.result;
    }

    /**
     * Getter for the piece position
     * 
     * @return {Array} - Piece position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Getter for the piece type
     * 
     * @return {String} - The piece type
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
        return null;
    }

    update(elapsedTime) {
        if (this.initialTime == null)
            this.initialTime = elapsedTime;
        this.elapsedTime = elapsedTime;
        
        if (this.animation != null)
            this.animation.update(this.elapsedTime - this.initialTime);
    }
    
}