/**
 * Constant used for worker picking ID
 */
const WORKER_PICK_ID = 1000;
/**
 * Constant for knowing the player1 Prolog correspondent Side
 */
const PLAYER1_SIDE = 'black';
/**
 * Constant for knowing the player2 Prolog correspondent Side
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
            AI_VS_AI_LOOP: 5,
            HUMAN_VS_AI_SET_AI_WORKER: 6,
            WAIT_WORKER_H_VS_H : 7,
            WAIT_PIECE_H_VS_H : 8,
            WAIT_WORKER_H_VS_AI : 9,
            WAIT_PIECE_H_VS_AI : 10,
            AI_PLAY_H_VS_AI : 11
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

        // TODO - ver se o inicio das animações é feito aqui, ou na receção de respostas

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
                    if (this.gameElements.isOnBoard(this.gameElements.workers[0]) && 
                        this.gameElements.isOnBoard(this.gameElements.workers[1])) {
                            this.currentPlayer = this.player2;
                            this.currentState = this.state.AI_VS_AI_LOOP;
                    } else {
                        getPrologRequest('setAIWorker(' + this.currentPlayer + ',' +
                                        parseToPlog(this.board) + ',' + getPlayerSide() + ')');
                        switchPlayer();
                    }
                    break;

                case this.state.AI_VS_AI_LOOP:
                    getPrologRequest('aiPlay(' + this.currentPlayer + ',' + 
                                    getPlayerSide() + parseToPlog(this.board) + ')');
                    switchPlayer();
                    break;

                case this.state.HUMAN_VS_AI_SET_AI_WORKER:
                    if (this.gameElements.isOnBoard(this.gameElements.workers[0]) && 
                        this.gameElements.isOnBoard(this.gameElements.workers[1])) {
                            this.currentState = this.state.WAIT_WORKER_H_VS_AI;
                    } else {
                        getPrologRequest('setAIWorker(' + this.currentPlayer + ',' +
                                        parseToPlog(this.board) + ',' + getPlayerSide() + ')');
                    }
                    break;

                case this.state.WAIT_WORKER_H_VS_H:
                case this.state.WAIT_PIECE_H_VS_H:
                case this.state.WAIT_WORKER_H_VS_AI:
                case this.state.WAIT_PIECE_H_VS_AI:
                    break;

                case this.state.AI_PLAY_H_VS_AI:
                    getPrologRequest('aiPlay(' + this.currentPlayer + ',' + 
                                    getPlayerSide() + parseToPlog(this.board) + ')');
                    switchPlayer();
                    this.currentState = this.state.WAIT_WORKER_H_VS_AI;
                    break;

                default:
                    console.warn("Unknown Game state detected...");
            }
        }

        // States independent to board changes
        switch (this.currentState) {
            case this.state.NO_GAME_RUNNING:
                break;

            case this.state.HUMAN_VS_HUMAN:
                if (this.pickedCell) {
                    getPrologRequest('setHumanWorker(' + parseToPlog(this.board) + ',' + 
                                    getPlayerSide() + this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    this.pickedCell = null;
                }

                if (this.gameElements.isOnBoard(this.gameElements.workers[0]) && 
                    this.gameElements.isOnBoard(this.gameElements.workers[1]))
                    this.currentState = this.state.WAIT_WORKER_H_VS_H;
                break;

            case this.state.HUMAN_VS_AI:
                if (this.pickedCell) {
                    getPrologRequest('setHumanWorker(' + parseToPlog(this.board) + ',' + 
                                    getPlayerSide() + this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    switchPlayer();
                    this.currentState = this.state.HUMAN_VS_AI_SET_AI_WORKER;
                    this.pickedCell = null;
                }
                break;
            
            case this.state.AI_VS_AI:
            case this.state.AI_VS_AI_LOOP:
            case this.state.HUMAN_VS_AI_SET_AI_WORKER:
                break;

            case this.state.WAIT_WORKER_H_VS_H:
                if (this.pickedWorker) {
                    if (this.pickedCell) {
                        getPrologRequest('moveWorker(' + parseToPlog(this.board) + ',' +
                                        this.pickedWorker.getRow() + ',' +
                                        this.pickedWorker.getCol() + ',' +
                                        this.pickedCell. getRow() + ',' + 
                                        this.pickedCell.getCol() + ')');
                        this.currentState = this.state.WAIT_PIECE_H_VS_H;
                        this.pickedWorker = null;
                        this.pickedCell = null;
                    }
                } else if (this.pickedCell) {
                    getPrologRequest('setPiece(' + getPlayerSide() + ',' +
                                    parseToPlog(this.board) + ',' +
                                    this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    switchPlayer();
                    this.currentState = this.state.WAIT_WORKER_H_VS_H;
                    this.pickedCell = null;
                }
                break;

            case this.state.WAIT_PIECE_H_VS_H:
                if (this.pickedCell) {
                    getPrologRequest('setPiece(' + getPlayerSide() + ',' +
                                    parseToPlog(this.board) + ',' +
                                    this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    switchPlayer();
                    this.currentState = this.state.WAIT_WORKER_H_VS_H;
                    this.pickedCell = null;
                }
                break;

            case this.state.WAIT_WORKER_H_VS_AI:
                if (this.pickedWorker) {
                    if (this.pickedCell) {
                        getPrologRequest('moveWorker(' + parseToPlog(this.board) + ',' +
                                        this.pickedWorker.getRow() + ',' +
                                        this.pickedWorker.getCol() + ',' +
                                        this.pickedCell. getRow() + ',' + 
                                        this.pickedCell.getCol() + ')');
                        this.currentState = this.state.WAIT_PIECE_H_VS_AI;
                        this.pickedWorker = null;
                        this.pickedCell = null;
                    }
                } else if (this.pickedCell) {
                    getPrologRequest('setPiece(' + getPlayerSide() + ',' +
                                    parseToPlog(this.board) + ',' +
                                    this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    switchPlayer();
                    this.currentState = this.state.AI_PLAY_H_VS_AI;
                    this.pickedCell = null;
                }
                break;

            case this.state.WAIT_PIECE_H_VS_AI:
                if (this.pickedCell) {
                    getPrologRequest('setPiece(' + getPlayerSide() + ',' +
                                    parseToPlog(this.board) + ',' +
                                    this.pickedCell.getRow() + ',' +
                                    this.pickedCell.getCol() + ')');
                    switchPlayer();
                    this.currentState = this.state.AI_PLAY_H_VS_AI;
                    this.pickedCell = null;
                }
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
            // In cells, the 1st digit is the row and the 2nd digit the column
            // - 1 because picking rows start at 1 and indexes at 0
            let row = Math.floor(pickedId / 10) - 1;
            let col = (pickedId % 10) - 1;
            this.pickedCell = this.gameElements.boardCells[row][col];
        }
    }

}