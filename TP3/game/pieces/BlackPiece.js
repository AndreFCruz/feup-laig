/**
 * A class representing a generic black piece.
 * @augments Piece
 */
class BlackPiece extends Piece {
    
    /**
     * Constructor for the black piece class
     * 
     * @param {Array} pos - The piece starting position
     * @constructor
     */
    constructor(pos) {
        super(pos, "black piece");
    }

}