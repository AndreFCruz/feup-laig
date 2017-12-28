/**
 * Maximum number of pieces that there can possibly exist for each side.
 */
const NUMBER_PIECES = 25;

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
        this.whiteInPlay = [];
        this.blackInPlay = [];

        // Initialize Object Pools
        this.whitePool = new ObjectPool(() => new WhitePiece([0, 0, 0]), NUMBER_PIECES);
        this.blackPool = new ObjectPool(() => new BlackPiece([0, 0, 0]), NUMBER_PIECES);
        for (let i = 0; i < NUMBER_PIECES; ++i) {
            this.whitePool.elements[i].position = [-2 + i * .5, 0, -1.2 - (i % 2 ? 0 : 0.7)];
            this.blackPool.elements[i].position = [-2 + i * .5, 0, 9.2 + (i % 2 ? 0 : 0.7)];
        }

        // There are always exactly two workers
        this.workers = [];
        this.workers[0] = new Worker([-1, 0, 1]);
        this.workers[1] = new Worker([-1, 0, 0]);

        // For the Board Cells
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

    update(currTime) {
        let whitePieces = this.whitePool.elements;
        for (let i = 0; i < whitePieces.length; ++i)
            whitePieces[i].update(currTime);

        let blackPieces = this.blackPool.elements;
        for (let i = 0; i < blackPieces.length; ++i)
            blackPieces[i].update(currTime);
    }

    fetchBlackPiece() {
        let piece = this.blackPool.acquire();
        this.blackInPlay.push(piece);

        return piece;
    }

    fetchWhitePiece() {
        let piece = this.whitePool.acquire();
        this.whiteInPlay.push(piece);

        return piece;
    }

    fetchWorker(pos = null) {
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i].boardPos == pos)
                return this.workers[i];
        }

        return null;
    }

    /**
     * Displays the game associated elements, such as: board cells and pieces
     * 
     * @return {null}
     */
    displayGame() {
        let whitePieces = this.whitePool.elements;        
        for (let wPiece in whitePieces)
            this.scene.graph.displayPiece(whitePieces[wPiece]);

        let blackPieces = this.blackPool.elements;            
        for (let bPiece in blackPieces)
            this.scene.graph.displayPiece(blackPieces[bPiece]);
        
        //There are always exactly two workers
        this.scene.registerForPick( WORKER_PICK_ID, this.workers[0]);
        this.scene.graph.displayPiece(this.workers[0]);

        this.scene.registerForPick( WORKER_PICK_ID + 1, this.workers[1]);
        this.scene.graph.displayPiece(this.workers[1]);

        this.scene.setNoDisplayShader();

        for (let row in this.boardCells) {
            for (let col in this.boardCells[row]) {
                let cell = this.boardCells[row][col];

                // pickId's 1st digit is the row and the 2nd digit the column
                this.scene.registerForPick((parseInt(row) + 1) * 10 + (parseInt(col) + 1), cell);

                this.boardCells[row][col].display();
            }
        }

        this.scene.setDefaultShader();
    }

}