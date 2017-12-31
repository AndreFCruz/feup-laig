/**
 * A class representing a generic white piece.
 * @augments Piece
 */
class WhitePiece extends Piece {
    
    /**
     * Constructor for the white piece class
     * 
     * @param {Array} pos - The piece starting position
     * @constructor
     */
    constructor(pos) {
        super(pos, "white piece");
    }

}