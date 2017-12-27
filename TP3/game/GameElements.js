/**
 * Maximum number of pieces that there can possibly exist for each side.
 */
const NUMBER_PIECES = 40;
/**
 * Number of workers present in the game.
 */
const NUMBER_WORKERS = 2;
/**
 * Board Size. Number of cells of a board.
 */
const BOARD_SIZE = 9

/**
 * A class representing a game instance
 */
class GameElements {
    
    /**
     * Constructor for the game elements class
     * 
     * @param {Object} scene - The lighting scene were elements will be displayed
     * @constructor
     */
    constructor(scene) {
        this.scene = scene;

        this.setUpGame();
    }

    /**
     * Creates all the elements - pieces and board cells - needed for the game.
     * 
     * @return {null}
     */
    setUpGame() {
        
        //For different Pieces
        this.whitePieces = {};
        this.blackPieces = {};
        for (let i = 0; i < NUMBER_PIECES; ++i) {
            this.whitePieces[i] = new WhitePiece([10, 0, 0]);
            this.blackPieces[i] = new BlackPiece([0, 0, 10]);
        }

        // TODO CHANGE ALL THIS HARDCODED POSITIONS -> All to start inside the bag
        //There are always exactly two workers
        this.workers = {};
        this.workers[0] = new Worker([-1, 0, -1]);
        this.workers[1] = new Worker([-1, 0, -1]);

        //For the Board Cells
        this.boardCells = {};
        for (let i = 0; i < BOARD_SIZE; ++i) {
            this.boardCells[i] = {};
            
            for (let j = 0; j < BOARD_SIZE; ++j) {

                // Because of how rectangles are initially displayed and 
                // Because index starts at 0 and picking rows at 1
                this.boardCells[i][j] = new BoardCell(this.scene, [BOARD_SIZE - 1 - i, j]);
            }
        }
    }

    /**
     * Checks whether a piece is inside the board limits, therefore, on the board
     * 
     * @param {Object} - The piece to be checked
     * @return {Boolean} - True if piece is on the board, false otherwise
     */
    isOnBoard(piece) {
        let piecePos = piece.getPosition();

        if (piecePos[0] < 0 || piecePos[1] < 0 ||
            piecePos[0] > BOARD_SIZE || piecePos[1] > BOARD_SIZE) 
            return false;
        else
            return true;
    }

    /**
     * Displays the game associated elements, such as: board cells and pieces
     * 
     * @return {null}
     */
    displayGame() {
        for (let wPiece in this.whitePieces)
            this.scene.graph.displayPiece(this.whitePieces[wPiece]);

        for (let bPiece in this.blackPieces)
            this.scene.graph.displayPiece(this.blackPieces[bPiece]);
        
        //There are always exactly two workers
        this.scene.registerForPick( WORKER_PICK_ID, this.workers[0]);
        this.scene.graph.displayPiece(this.workers[0]);

        this.scene.registerForPick( WORKER_PICK_ID + 1, this.workers[1]);
        this.scene.graph.displayPiece(this.workers[1]);

        this.scene.setNoDisplayShader();

        for (let row in this.boardCells) {
            for (let col in this.boardCells[row]) {
                let cell = this.boardCells[row][col];

                //The pick id 1st digit is the row and the 2nd digit the column
                this.scene.registerForPick((parseInt(row) + 1) * 10 + (parseInt(col) + 1), cell);

                this.boardCells[row][col].display();
            }
        }

        this.scene.setDefaultShader();
    }

}