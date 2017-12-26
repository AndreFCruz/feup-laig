const NUMBER_PIECES = 40;
const NUMBER_WORKERS = 2;
const BOARD_SIZE = 9;

/**
 * A class representing a game instance
 */
class Game {
    
    /**
     * Constructor for the black piece class
     * 
     * @param {Object} scene - The lighting
     * @constructor
     */
    constructor(scene) {
        this.scene = scene;
        this.gameLogic = new GameLogic();

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

        // TODO CHANGE ALL THIS HARDCODED POSITIONS
        //There are always exactly two workers
        this.workers = {};
        this.workers[0] = new Worker([5, 0, 5]);
        this.workers[1] = new Worker([7, 0, 7]);

        //For the Board Cells
        this.boardCells = {};
        for (let i = 0; i < BOARD_SIZE; ++i) {
            this.boardCells[i] = {};
            
            for (let j = 0; j < BOARD_SIZE; ++j) {

                //Because of how rectangles are initially displayed
                let maxRow = BOARD_SIZE - 1;
                this.boardCells[i][j] = new BoardCell(this.scene, [maxRow - i, j]);
            }
        }
    }

    /**
     * Displays the game pieces
     * 
     * @return {null}
     */
    displayGame() {
        for (let wPiece in this.whitePieces)
            this.scene.graph.displayPiece(this.whitePieces[wPiece]);

        for (let bPiece in this.blackPieces)
            this.scene.graph.displayPiece(this.blackPieces[bPiece]);
        
        //There are always exactly two workers
        this.scene.graph.displayPiece(this.workers[0]);
        this.scene.graph.displayPiece(this.workers[1]);

        this.scene.setNoDisplayShader();

        for (let row in this.boardCells) {
            for (let col in this.boardCells[row]) {
                let cell = this.boardCells[row][col];

                //The pick id is a number where id / 10 = row and id % 10 = col
                this.scene.registerForPick((parseInt(row) + 1) * 10 + (parseInt(col) + 1), cell);

                this.boardCells[row][col].display();
            }
        }

        //For now do CONNECTION TESTS go here

        this.scene.setDefaultShader();
    }

    /**
     * Update the game elements
     * 
     * @param {Number} currTime - current time, in miliseconds.
     * @return {null}
     */
    update(currTime) {
        this.gameLogic.update();
    }
}