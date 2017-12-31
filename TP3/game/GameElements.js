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
 * A class representing all the game elements of a board (board cells and pieces)
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
        this.piecesInPlay = [];

        // Initialize Object Pools
        this.whitePool = new ObjectPool(() => new WhitePiece([0, 0, 0]), NUMBER_PIECES);
        this.blackPool = new ObjectPool(() => new BlackPiece([0, 0, 0]), NUMBER_PIECES);
        for (let i = 0; i < NUMBER_PIECES; ++i) {
            this.whitePool.elements[i].position = [-2 + i * .5, 0, -1.2 - (i % 2 ? 0 : 0.7)];
            this.blackPool.elements[i].position = [-2 + i * .5, 0, 9.2 + (i % 2 ? 0 : 0.7)];
        }

        // There are always exactly two workers
        this.workers = [];
        this.workers[0] = new Worker([-1, 0, 0]);
        this.workers[1] = new Worker([-1, 0, 1]);

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

    /**
     * Updates all the game elements, useful for animations
     * 
     * @param {Number} currTime - Current application time, in mili seconds
     */
    update(currTime) {
        let whitePieces = this.whitePool.elements;
        for (let i = 0; i < whitePieces.length; ++i)
            whitePieces[i].update(currTime);

        let blackPieces = this.blackPool.elements;
        for (let i = 0; i < blackPieces.length; ++i)
            blackPieces[i].update(currTime);

        for (let i = 0; i < this.piecesInPlay.length; ++i)
            this.piecesInPlay[i].update(currTime);

        for (let i = 0; i < this.workers.length; ++i)
            this.workers[i].update(currTime);
    }

    /**
     * Fetches a black piece from the side of the board (from an object pool)
     * 
     * @return {Object} - The piece returned ( @see Piece )
     */
    fetchBlackPiece() {
        let piece = this.blackPool.acquire();
        this.piecesInPlay.push(piece);

        return piece;
    }

    /**
     * Fetches a white piece from the side of the board (from an object pool)
     * 
     * @return {Object} - The piece returned ( @see Piece )
     */
    fetchWhitePiece() {
        let piece = this.whitePool.acquire();
        this.piecesInPlay.push(piece);

        return piece;
    }

    /**
     * Fetches the piece in the given board position
     * 
     * @param {Array} pos - The position on the board
     * @return {Object} - the piece on the position ( @see Piece ) 
     */
    fetchPieceInPlay(pos) {
        let piece = null;
        for (let i = 0; i < this.piecesInPlay.length; i++) {
            let piecePos = this.piecesInPlay[i].boardPos;
            if (pos && piecePos[0] == pos[0] && piecePos[1] == pos[1]) {
                piece = this.piecesInPlay[i];
                break;
            }
        }

        return piece;
    }

    /**
     * Makes the piece in the given board position return to the board sides ( return to its object pool )
     * 
     * @param {Array} pos - The position on the board
     * @return {null}
     */
    releasePiece(pos) {
        let piece = this.fetchPieceInPlay(pos);
        if (! (piece && pos) ) return;

        let index = this.piecesInPlay.indexOf(piece);
        this.piecesInPlay.splice(index, 1);

        // position on the side of the board
        if (piece.type[0] == 'b') { // black piece
            this.blackPool.release(piece);
            let i = this.blackPool.elements.length - 1;
            piece.moveTo(-2 + i * .5, 9.2 + (i % 2 ? 0 : 0.7));
        } else if (piece.type[0] == 'w') { // white piece
            this.whitePool.release(piece);
            let i = this.whitePool.elements.length - 1;            
            piece.moveTo(-2 + i * .5, -1.2 - (i % 2 ? 0 : 0.7));
        }

        piece.boardPos = null;
    }

    /**
     * Makes the Worker on the given board position return to its side inital position
     * 
     * @param {Array} pos - The position on the board
     * @return {null} 
     */
    releaseWorker(pos) {
        let worker = this.fetchWorker(pos);
        if (! (worker && pos) ) return;

        let index = this.workers.indexOf(worker);
        worker.boardPos = null;
        
        // Is other worker in play ?
        let otherWorkerInPlay = (this.workers[(index + 1) % 2].boardPos != null);
        worker.moveTo(-1, otherWorkerInPlay ? 1 : 0);
    }

    /**
     * Fetches the worker in the given board position, if one is given, or
     * fetches the first worker outside of the board, if none is given.
     * 
     * @param {Array} pos - The position on the board. This parameter is optional 
     * @return {null}
     */
    fetchWorker(pos = null) {
        for (let i = 0; i < this.workers.length; i++) {
            let workerPos = this.workers[i].boardPos;
            if (pos == null && workerPos == null)
                return this.workers[i];
            else if (pos && workerPos[0] == pos[0] && workerPos[1] == pos[1])
                return this.workers[i];
        }

        return null;
    }

    /**
     * Selects the worker in the given position [row, col] of the board
     * 
     * @param {Number} row - The worker's row
     * @param {Number} col - The worker's col
     * @return {null}
     */
    selectWorker(row, col) {
        let worker = this.fetchWorker([row, col]);
        worker.selected = true;
    }

    /**
     * Deselects both workers. Useful for beggining new turns
     * 
     * @return {null}
     */
    resetSelectedWorkers() {
        this.workers[0].selected = false;
        this.workers[1].selected = false;        
    }

    /**
     * Release all the pieces (white, black and workers) from the board to their object pools or inital positions.
     * Useful for reseting the game
     * 
     * @return {null}
     */
    reset() {
        // Release all pieces from play into the pools
        for (let i = 0; i < this.piecesInPlay.length; ++i) {
            let piece = this.piecesInPlay[i];
            if (piece.type == 'black piece')
                this.blackPool.release(piece);
            else if (piece.type == 'white piece')
                this.whitePool.release(piece);
            piece.boardPos = null;
        }
        this.piecesInPlay = [];

        // Move them to the borders
        for (let i = 0; i < NUMBER_PIECES; ++i) {
            this.whitePool.elements[i].moveTo(-2 + i * .5, -1.2 - (i % 2 ? 0 : 0.7));
            this.blackPool.elements[i].moveTo(-2 + i * .5, 9.2 + (i % 2 ? 0 : 0.7));
        }

        // Reset workers and move them to the borders
        for (let i = 0; i < this.workers.length; ++i) {
            this.workers[i].boardPos = null;
            this.workers[i].moveTo(-1, i);
        }
    }

    /**
     * Displays the game associated elements, such as: board cells and pieces
     * 
     * @return {null}
     */
    displayGame() {
        let whitePieces = this.whitePool.elements;
        for (let wPiece in whitePieces)
            this.scene.currentGraph.displayPiece(whitePieces[wPiece]);

        let blackPieces = this.blackPool.elements;
        for (let bPiece in blackPieces)
            this.scene.currentGraph.displayPiece(blackPieces[bPiece]);

        for (let piece in this.piecesInPlay)
            this.scene.currentGraph.displayPiece(this.piecesInPlay[piece]);

        //There are always exactly two workers
        this.scene.registerForPick( WORKER_PICK_ID, this.workers[0]);
        this.scene.currentGraph.displayPiece(this.workers[0]);

        this.scene.registerForPick( WORKER_PICK_ID + 1, this.workers[1]);
        this.scene.currentGraph.displayPiece(this.workers[1]);

        this.scene.setNoDisplayShader();

        for (let row in this.boardCells) {
            for (let col in this.boardCells[row]) {
                let cell = this.boardCells[row][col];

                // pickId's 1st digit is the row and the 2nd digit the column
                this.scene.registerForPick((parseInt(row) + 1) * 10 + (parseInt(col) + 1), cell);

                this.boardCells[row][col].display();
            }
        }

        this.scene.clearPickRegistration();

        this.scene.setDefaultShader();
    }

}