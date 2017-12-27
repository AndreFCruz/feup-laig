/**
 * Constant used for worker picking ID
 */
const WORKER_PICK_ID = 1000;
/**
 * Constant for knowing the player1 PRolog correspondent Side
 */
const PLAYER1_SIDE = 'black';
/**
 * Constant for knowing the player2 PRolog correspondent Side
 */
const PLAYER2_SIDE = 'white';

/**
 * The class responsible for handling the game.
 * Saves information such as the current game state, the type of players, etc
 */
class Game {
    
    /**
     * Constructor for the Game class
     * 
     * @param {Object} scene - The lighting scene were elements will be displayed
     * @constructor
     */
    constructor(scene) {

        this.gameElements = new GameElements(scene);

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

        this.playerType = {
            HUMAN : 1,
            RANDOM_AI : 2,
            SMART_AI : 3
        };
        this.player1 = null;
        this.player2 = null;
        //Either player1 or player2
        this.currentPlayer = null;

        //Indicating wich cell or worker was picked
        this.pickedWorker = null;
        this.pickedCell = null;

        // CurrentBoard representation of the game board (object)
        this.board = null;

    }

    /**
     * Set the type of player playing the game
     * 
     * @param {Integer} player1 - Type of player for the player1
     * @param {Integer} player2 - Type of player for the player2
     * @return {null}
     */
    setPlayers(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    /**
     * Switch between the players
     * 
     * @return {null}
     */
    switchPlayer() {
        if (this.currentPlayer == this.player1)
            this.currentPlayer = this.player2;
        else
        if (this.currentPlayer == this.player2)
            this.currentPlayer = this.player1;
        else
            console.error('No current player is set, can not switch between players');
    }

    /**
     * Get correspondent Prolog Side to the current player
     * 
     * @return {String} - correspondent Prolog Side
     */
    getPlayerSide() {
        if (this.currentPlayer == this.player1)
            return PLAYER1_SIDE;
        else
        if (this.currentPlayer == this.player2)
            return PLAYER2_SIDE;
        else
            console.error('No current player is set, can not get player Prolog side');
        return null;
    }

    /**
     * Displays the game elements
     * 
     * @return {null}
     */
    displayGame() {
        this.gameElements.displayGame();
    }

    /**
     * Update the game logic
     * 
     * @param {Number} currTime - current time, in miliseconds.
     * @return {null}
     */
    update(currTime) {

        if (boardChanged) {
            this.board = pLogBoard;
            boardChanged = false;
        
            // States dependent on board changes
            switch (this.currentState) {
                case this.state.NO_GAME_RUNNING:
                case this.state.HUMAN_VS_HUMAN:
                case this.state.HUMAN_VS_AI:
                    break;

                case this.state.AI_VS_AI:
                    /* When one of the AI's loses, go to NO_GAME_RUNNING */
                    getPrologRequest('aiPlay(' + this.currentPlayer + ',' + 
                                    getPlayerSide() + parseToPlog(this.board) + ')');
                    switchPlayer();
                    break;

                case this.state.WAIT_WORKER_H_VS_H:
                case this.state.WAIT_PIECE_H_VS_H:
                case this.state.WAIT_WORKER_H_VS_AI:
                case this.state.WAIT_PIECE_H_VS_AI:
                    break;

                case this.state.AI_PLAY_H_VS_AI:
                    /* After getting AI board, go to WAIT_WORKER_H_VS_AI
                    If AI won, go to NO_GAME_RUNNING */
                    break;

                default:
                    console.warn("Unknown Game state detected...");
            }
        }

        // States independent to board changes
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
                if (this.pickedCell) {
                    getPrologRequest('setHumanWorker(' + parseToPlog(this.board) + ',' + 
                                    getPlayerSide() + this.pickedCell.getRow() + ')');
                }
                break;

            case this.state.HUMAN_VS_AI:
                /* Get the User worker input, then wait for AI move worker.
                After, go to WAIT_WORKER_AI_VS_AI */
                break;

            case this.state.AI_VS_AI:
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
                break;

            default:
                console.warn("Unknown Game state detected...");
        }
    }

    /**
     * Handle the picked game elements
     * 
     * @param {Number} - The ID of the picked element
     * @return {null}
     */
    handlePick(pickedId) {

        if (pickedId >= WORKER_PICK_ID)
            this.pickedWorker = this.gameElements.workers[pickedId - WORKER_PICK_ID];
        else {
            // In cells, the 1st digit is the row, and the 2nd the column
            // - 1 because picking rows start at 1 and indexes at 0
            let row = Math.floor(pickedId / 10) - 1;
            let col = (pickedId % 10) - 1;
            this.pickedCell = this.gameElements.boardCells[row][col];
        }
    }

}