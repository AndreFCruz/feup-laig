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
    constructor(pos, type, flipAnimation = false) {
        this.type = type;

        // World position
        this.position = pos ? pos : [0, 0, 0];

        // Board position
        this.boardPos = null;

        // Animation progress
        this.elapsedTime = null;
        this.initialTime = null;
        this.animation = null;
        this.flipAnimation = flipAnimation;
        
        this.selected = false;
    }

    /**
     * Get the piece board position
     * 
     * @return {Array} - Position [row, col]
     */
    get boardPos() {
        return this._boardPos;
    }

    /**
     * Set the board current Position
     * 
     * @param {Array} cell - Board new position
     * @return {null}
     */
    set boardPos(cell) {
        this._boardPos = cell;
        if (! cell) return;

        this.moveTo(cell[1], cell[0]);
    }

    /**
     * Get this piece world posiion
     * 
     * @return {mat4}
     */
    get position() {
        return this._position;
    }

    /**
     * Set the piece world position
     * 
     * @param {Array} pos - Piece new world position in format [x, y, z]
     * @return {null}
     */
    set position(pos) {
        this._position = pos;

        this.positionMatrix = mat4.create();
        mat4.translate(this.positionMatrix, this.positionMatrix, pos);
    }

    /**
     * Move the piece to the given board position, through an animation @see @class ArchAnimation
     * 
     * @param {Number} targetX - New row position
     * @param {Number} targetZ - New col position
     * @return {null}
     */
    moveTo(targetX, targetZ) {
        let previousPos = this.position;
        this.animation = new ArchAnimation(
            previousPos[0], previousPos[2], targetX, targetZ,
            this.flipAnimation
        );
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
        }
        return this.result;
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
     * Update the current Piece, useful for animations
     * 
     * @param {Number} elapsedTime - Time elapsed, in mili seconds
     * @return {null} 
     */
    update(elapsedTime) {
        if (this.initialTime == null)
            this.initialTime = elapsedTime;
        this.elapsedTime = elapsedTime;
        
        if (this.animation == null) {
            return;
        } else if (this.animation.finished) {
            this.position = [this.animation.xf, 0, this.animation.zf];
            this.animation = null;
            return;
        }
        
        this.animation.update(this.elapsedTime - this.initialTime);
    }
    
}