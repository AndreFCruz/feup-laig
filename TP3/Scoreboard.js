/**
 * A class representing the Scoreboard
 */
class ScoreBoard {
    
    /**
     * Constructor for the scoreboard class
     * 
     * @param {Object} scene - The lighting scene where the scoreboard will be
     * @constructor
     */
    constructor(scene, pos) {
        this.scene = scene;

        this.player1Points = 0;
        this.player2Points = 0;

        this.turnTime = 0;
        this.currentTurnTime = null;

        this.lastUpdateTime = 0;
        // Updates each the timer second
        this.updateTimeTimer = 1000;
    }

    /**
     * Display the scoreboard in the scene
     * 
     * @return {null}
     */
    display() {
        this.scene.pushMatrix();
            this.displayScoreboard();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
            this.displayScoreboard();
        this.scene.popMatrix();
    }

    displayScoreboard() {
        // TODO
    }

    /**
     * Get the Cell's row in the board, for using in PLOG
     * 
     * @param {Number} currTime - time elapsed, in mili seconds
     * @return {null}
     */
    update(currTime) {

        //if (this.currentTurnTime == null)

        if (currTime - this.lastUpdateTime >= this.updateTimeTimer) {
            this.currentTurnTime++;
        }

        if (this.currentTurnTime > this.turnTime) {
            //Trocar de jogador no game
        }
    }

    /**
     * Start a new countdown in the timer for a new turn
     * 
     * @return {Number} - The Cell's column
     */
    startNewTurn() {
        this.currentTurnTime = this.turnTime;
    }

    /**
     * Increase the current turn Time by 1 minute
     * 
     * @return {null}
     */
    incTimer1min() {
        this.turnTime += 60;
    }

    /**
     * Increase the current turn Time by 1 second
     * 
     * @return {null}
     */
    incTimer1sec() {
        this.turnTime++;
    }

    /**
     * Increase the current turn Time by 10 seconds
     * 
     * @return {null}
     */
    incTimer10sec() {
        this.turnTime += 10;
    }

}