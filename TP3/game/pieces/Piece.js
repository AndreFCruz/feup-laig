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

        // Saves the fixed positions
        this.position = pos;

        // Useful for intermedeary animation positions
        this.positionMatrix = mat4.create();
        // mat4.fromTranslation(this.positionMatrix, pos);
        mat4.identity(this.positionMatrix);
        mat4.translate(this.positionMatrix, this.positionMatrix, pos);
        
        this.animation = null;

        // Animation progress
        this.elapsedTime = null;
        this.initialTime = null;
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