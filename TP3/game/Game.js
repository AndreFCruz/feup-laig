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
            AI_VS_AI_LOOP : 5,
            HUMAN_VS_AI_SET_AI_WORKER : 6,
            WAIT_WORKER_H_VS_H : 7,
            WAIT_PIECE_H_VS_H : 8,
            WAIT_WORKER_H_VS_AI : 9,
            WAIT_PIECE_H_VS_AI : 10,
            AI_PLAY_H_VS_AI : 11
        };
        this.currentState = this.state.NO_GAME_RUNNING;

        this.playerType = {
            HUMAN: 'human',
            RANDOM_AI: 'random',
            SMART_AI: 'smart'
        };
        this.player1 = null;
        this.player2 = null;

        // Either 1 (for player1) or 2 (for player2)
        this.currentPlayer = null;

        //Indicating wich cell or worker was picked
        this.pickedWorker = null;
        this.pickedCell = null;

        // For making requests to Prolog
        this.communication = new Communication();

        // CurrentBoard representation of the game board (object)
        this.board = null;

        //For displaying sweet alerts for in game messages
        this.alert = new Alert(this);
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
    switchPlayer() { // TODO check for player1 == player2
        if (this.currentPlayer)
            this.currentPlayer = (this.currentPlayer % 2) + 1;
        else
            console.error('No current player is set, can not switch between players');
    }

    /**
     * Get correspondent Prolog Side to the current player
     * 
     * @return {String} - correspondent Prolog Side
     */
    getPlayerSide() { // TODO check for player1 == player2
        if (this.currentPlayer == 1)
            return PLAYER1_SIDE;
        else if (this.currentPlayer == 2)
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
        this.gameElements.update(currTime);

        if (this.communication.boardChanged) {
            this.board = this.communication.prologBoard;
            this.communication.boardChanged = false;
        
            // States dependent on board changes
            switch (this.currentState) {
                
                case this.state.AI_VS_AI:
                    this.setAIvsAIworkers();
                    return;
                case this.state.AI_VS_AI_LOOP:
                    this.aiPlay(AI_VS_AI_LOOP);
                    return;
                case this.state.HUMAN_VS_AI_SET_AI_WORKER:
                    this.setAIworkerHvsAI();
                    return;
                case this.state.AI_PLAY_H_VS_AI:
                    this.aiPlay(this.state.WAIT_WORKER_H_VS_AI);
                    return;

                case this.state.NO_GAME_RUNNING:
                case this.state.HUMAN_VS_HUMAN:
                case this.state.HUMAN_VS_AI:
                case this.state.WAIT_WORKER_H_VS_H:
                case this.state.WAIT_PIECE_H_VS_H:
                case this.state.WAIT_WORKER_H_VS_AI:
                case this.state.WAIT_PIECE_H_VS_AI:
                    // Board independent States
                    break;

                default:
                    console.warn("Unknown Game state detected...");
            }
        }

        // States independent to board changes
        switch (this.currentState) {

            case this.state.NO_GAME_RUNNING:
                //Do nothing
                break;
            case this.state.HUMAN_VS_HUMAN:
                this.setWorkersHvsH();
                break;
            case this.state.HUMAN_VS_AI:
                this.setWorkerHvsAI();
                break;
            case this.state.WAIT_WORKER_H_VS_H:
                this.waitWorkerH(this.state.WAIT_PIECE_H_VS_H, this.state.WAIT_WORKER_H_VS_H);
                break;
            case this.state.WAIT_PIECE_H_VS_H:
                this.waitPieceH(this.state.WAIT_WORKER_H_VS_H);
                break;
            case this.state.WAIT_WORKER_H_VS_AI:
                this.waitWorkerH(this.state.WAIT_PIECE_H_VS_AI, this.state.AI_PLAY_H_VS_AI);
                break;
            case this.state.WAIT_PIECE_H_VS_AI:
                this.waitPieceH(this.state.AI_PLAY_H_VS_AI);
                break;
            
            case this.state.AI_VS_AI:
            case this.state.AI_VS_AI_LOOP:
            case this.state.HUMAN_VS_AI_SET_AI_WORKER:
            case this.state.AI_PLAY_H_VS_AI:
                // Board dependent states
                break;

            default:
                console.warn("Unknown Game state detected...");
        }
    }

    /**
     * Checks if both workers are set on board
     * State Machine associated function.
     * 
     * @return {Bool} - True if workers are set, false otherwise
     */
    areWorkersSet() {
        return (this.gameElements.isOnBoard(this.gameElements.workers[0]) && 
                this.gameElements.isOnBoard(this.gameElements.workers[1]));
    }

    /**
     * Sets both workers on the board, in AI vs AI mode
     * State Machine associated function.
     * 
     * @return {null}
     */
    setAIvsAIworkers() {
        if (this.areWorkersSet()) {
            // In AI vs AI white always starts
            this.currentPlayer = 2;
            this.currentState = this.state.AI_VS_AI_LOOP;
        } else {// TODO check request
            this.communication.getPrologRequest(
                'setAIWorker(' + 
                this.getPlayerSide() + ',' +
                this.communication.parseBoardToPlog(this.board) + ',' + 
                this.getPlayerSide() + ')'
            );
            this.switchPlayer();
        }
    }

    /**
     * Executes an AI play and after switches current state to the given state
     * State Machine associated function.
     * 
     * @param {Number} nextState - Following state in state machine, after executing AI play
     * @return {null}
     */
    aiPlay(nextState) {
        this.communication.getPrologRequest(
            'aiPlay(' + 
            this.currentPlayer + ',' + 
            this.getPlayerSide() + ',' + 
            this.communication.parseBoardToPlog(this.board) + ')'
        );
        this.switchPlayer();
        this.currentState = nextState;
    }

    /**
     * Set the AI worker in Human vs AI mode
     * State Machine associated function.
     * 
     * @return {null}
     */
    setAIworkerHvsAI() {
        if (this.areWorkersSet()) {
            this.currentState = this.state.WAIT_WORKER_H_VS_AI;
        } else {
            this.communication.getPrologRequest(
                'setAIWorker(' + 
                this.currentPlayer + ',' +
                this.communication.parseBoardToPlog(this.board) + ',' + 
                this.getPlayerSide() + ')'
            );
            this.switchPlayer();
        }
    }

    /**
     * Setting both workers on board, through picking, in Human vs Human mode
     * State Machine associated function.
     * 
     * @return {null}
     */
    setWorkersHvsH() {
        if (this.pickedCell) {
            this.communication.getPrologRequest(
                'setHumanWorker(' + 
                this.communication.parseBoardToPlog(this.board) + ',' + 
                this.pickedCell.getRow() + ',' + 
                this.pickedCell.getCol() + ')'
            );

            // TODO remove this from here, for testing only now
            if (this.gameElements.isOnBoard(this.gameElements.workers[0])) {
                let test0 = this.gameElements.workers[1];
                test0.position[0] = this.pickedCell.getCol();
                test0.position[2] = this.pickedCell.getRow();
                mat4.identity(test0.positionMatrix);
                mat4.translate(test0.positionMatrix, test0.positionMatrix, test0.position);
            } else {
                let test1 = this.gameElements.workers[0];
                test1.position[0] = this.pickedCell.getCol();
                test1.position[2] = this.pickedCell.getRow();
                mat4.identity(test1.positionMatrix);
                mat4.translate(test1.positionMatrix, test1.positionMatrix, test1.position);
            }

            this.switchPlayer();
            this.pickedCell = null;
        }

        if (this.areWorkersSet()) {
            this.alert.chooseFirstPlayer();
            this.currentState = this.state.WAIT_WORKER_H_VS_H;
        }
    }

    /**
     * Setting the first worker on the board, in Human vs AI mode
     * State Machine associated function.
     * 
     * @return {null}
     */
    setWorkerHvsAI() {
        if (this.pickedCell) {
            this.communication.getPrologRequest(
                'setHumanWorker(' + 
                this.communication.parseBoardToPlog(this.board) + ',' + 
                this.getPlayerSide() + ',' + this.pickedCell.getRow() + ',' +
                this.pickedCell.getCol() + ')'
            );
            this.switchPlayer();
            this.alert.chooseFirstPlayer();
            this.currentState = this.state.HUMAN_VS_AI_SET_AI_WORKER;
            this.pickedCell = null;
        }
    }

    /**
     * Moving the Human chosen Worker on the board, or, 
     * the Human chosen piece on the board (using @see waitPieceH(nextState))
     * State Machine associated function.
     * 
     * @param {Number} putPieceState - Following state in state machine, after moving the worker
     * @param {Number} nextState - Following state in state machine, after setting the piece
     * @return {null}
     */
    waitWorkerH(putPieceState, nextState) {
        if (this.pickedWorker) {
            if (this.pickedCell) {
                this.communication.getPrologRequest(
                    'moveWorker(' + 
                    this.communication.parseBoardToPlog(this.board) + ',' +
                    this.pickedWorker.getRow() + ',' +
                    this.pickedWorker.getCol() + ',' +
                    this.pickedCell. getRow() + ',' + 
                    this.pickedCell.getCol() + ')'
                );
                this.currentState = putPieceState;
                this.pickedWorker = null;
                this.pickedCell = null;
            }
        } else this.waitPieceH(nextState);
    }

    /**
     * Setting the Human chosen piece on the board
     * State Machine associated function.
     * 
     * @param {Number} nextState - Following state in state machine, after setting the piece
     * @return {null}
     */
    waitPieceH(nextState) {
        if (this.pickedCell) {
            this.communication.getPrologRequest(
                'setPiece(' + this.getPlayerSide() + ',' +
                this.communication.parseBoardToPlog(this.board) + ',' +
                this.pickedCell.getRow() + ',' +
                this.pickedCell.getCol() + ')'
            );
            this.switchPlayer();
            this.currentState = nextState;
            this.pickedCell = null;
        }
    }

    /**
     * Initialize a game of Human vs Human
     * 
     * @return {null}
     */
    beginHvsH() {
        this.beginGame(this.playerType.HUMAN, this.playerType.HUMAN, this.state.HUMAN_VS_HUMAN);
        //TODO call this on GUI, acordding to selected type
        //calling it in interface
    }

    /**
     * Initialize a game of Human vs AI
     * 
     * @param {number} aiType - The type of AI for player 2
     * @return {null}
     */
    beginHvsAI(aiType) {
        this.beginGame(this.playerType.HUMAN, aiType, this.state.HUMAN_VS_AI);
        //TODO call this on GUI, acordding to selected type
    }

    /**
     * Initialize a game of AI vs AI
     * 
     * @param {number} aiType1 - The type of AI for player 1
     * @param {number} aiType2 - The type of AI for player 2
     * @return {null}
     */
    beginHvsAI(aiType1, aiType2) {
        this.beginGame(aiType1, aiType2, this.state.AI_VS_AI);
        //TODO call this on GUI, acordding to selected type
    }

    /**
     * Initialize a generic game
     * 
     * @param {number} playerType1 - The type of Player for player 1
     * @param {number} playerType2 - The type of Player for player 2
     * @param {Number} nextState - The next State for the game beginning
     * @return {null}
     */
    beginGame(playerType1, playerType2, nextState) {
        this.communication.getPrologRequest('init');
        this.player1 = playerType1;
        this.player2 = playerType2;
        this.currentPlayer = 1;
        this.currentState = nextState;
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