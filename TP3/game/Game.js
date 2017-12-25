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

        this.state = {
            NO_GAME_RUNNING : 1,
            HUMAN_VS_HUMAN : 2,
            HUMAN_VS_AI : 3,
            AI_VS_AI : 4,
            WAIT_WORKER_H_VS_H : 5,
            WAIT_PIECE_H_VS_H : 6,
            WAIT_WORKER_H_VS_AI : 7,
            WAIT_PIECE_H_VS_AI : 8,
            AI_PLAY_H_VS_AI : 9
        };
        this.currentState = this.state.NO_GAME_RUNNING;

        // Change to function that initiates it
        // When board gets updated, see the difference and turn it into an animation
        // Move this to set game as well mby
        this.board = null;

        let test;
        test = getPrologRequest('test');
        console.log('HERE ' + test);

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

    updateState() {
        switch (this.currentState) {
            case this.state.NO_GAME_RUNNING:
                /* Starting a game leads to either:
                    - HUMAN_VS_HUMAN;
                    - HUMAN_VS_AI;
                    - AI_VS_AI; */
                break;
            case this.state.HUMAN_VS_HUMAN:
                /* Get the 2 workers starting position, till then, stay in this mode.
                After, go to WAIT_WORKER_H_VS_H */
                break;
            case this.state.HUMAN_VS_AI:
                /* Get the User worker input, then wait for AI move worker.
                After, go to WAIT_WORKER_AI_VS_AI */
                break;
            case this.state.AI_VS_AI:
                /* Get AI play and stay in this state.
                When one of the AI's loses, go to NO_GAME_RUNNING */
                break;
            case this.state.WAIT_WORKER_H_VS_H:
                /* If user wants to move worker, get input and go to WAIT_PIECE_H_VS_H
                If user does not want to move worker, automatically go to WAIT_PIECE_H_VS_H
                If someone lost, go to NO_GAME_RUNNING */
                break;
            case this.state.WAIT_PIECE_H_VS_H:
                /* Set user piece then go WAIT_WORKER_H_VS_H */
                break;
            case this.state.WAIT_WORKER_H_VS_AI:
                /* If user wants to move worker, get input and go to WAIT_PIECE_H_VS_AI
                If user does not want to move worker, automatically go to WAIT_PIECE_H_VS_AI
                If someone lost, go to NO_GAME_RUNNING */
                break;
            case this.state.WAIT_PIECE_H_VS_AI:
                /* Set user piece then go to HUMAN_FINISHED_MOVE */
                break;
            case this.state.AI_PLAY_H_VS_AI:
                /* After getting AI board, go to WAIT_WORKER_H_VS_AI
                If AI won, go to NO_GAME_RUNNING */
                break;
            default:
                console.warn("Unknown Game state detected...");
        }
    }
}