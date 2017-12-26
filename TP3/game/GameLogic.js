/**
 * The class associated to the game logic.
 * Saves information such as the current game state, the type of players, etc
 */
class GameLogic {
    
    /**
     * Constructor for the Game Logic class
     * 
     * @constructor
     */
    constructor() {

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
        this.currentPlayer = null;

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
     * Update the game logic
     * 
     * @return {null}
     */
    update() {
        if (boardChanged) {
            this.board = pLogBoard;
            boardChanged = false;
        
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
                    /* When one of the AI's loses, go to NO_GAME_RUNNING */
                    if (this.currentPlayer == 'black')
                        getPrologRequest('aiPlay(' + this.player1 + ',black,' + parseToPlog(this.board) + ')');
                    else if (this.currentPlayer == 'white')
                        getPrologRequest('aiPlay(' + this.player2 + ',white,' + parseToPlog(this.board) + ')');
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
}