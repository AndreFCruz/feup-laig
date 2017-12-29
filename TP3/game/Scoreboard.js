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
    constructor(scene) {
        this.scene = scene;

        this.player1Points = 0;
        this.player2Points = 0;

        this.turnTime = 0;
        this.currentTurnTime = 600;

        this.lastUpdateTime = 0;
        // Updates each the timer second
        this.updateTimeTimer = 1000;

        // Initialize the fixed graphic elements of the scoreboard
        this.initGraphics();
    }

    /**
     * Initialize the graphic elements necessary to display the scoreboard
     * 
     * @return {null}
     */
    initGraphics() {
        
        //Graphic Elements
        this.minDigit = new MyRectangle(this.scene, [-2, 2, -1, 0]);
        this.minDigit.setTexAmplification(1,2);

        this.divider = new MyRectangle(this.scene, [-1, 2, 0, 0]);
        this.divider.setTexAmplification(1,2);

        this.tenSecDigit = new MyRectangle(this.scene, [0, 2, 1, 0]);
        this.tenSecDigit.setTexAmplification(1,2);

        this.unitSecDigit = new MyRectangle(this.scene, [1, 2, 2, 0]);
        this.unitSecDigit.setTexAmplification(1,2);


        // Needed textures - digits and digits divider
        this.digitTextures = [];

        for (let i = 0; i < 10; ++i) {

            let digitTex = new CGFappearance(this.scene);
            digitTex.loadTexture("scenes/numbers/" + i + ".png");
            this.digitTextures.push(digitTex);
        }

        this.dividerTex = new CGFappearance(this.scene);
        this.dividerTex.loadTexture("scenes/numbers/divider.png");

        // Current values for the digits
        this.currentUnitSec = 0;
        this.currentTenSec = 0;
        this.currentMin = 0;

        //TODO: Missing game results
    }

    /**
     * Display the scoreboard in the scene
     * 
     * @return {null}
     */
    display() {

        this.scene.pushMatrix();
            this.scene.translate( -3, 0, BOARD_SIZE / 2);
            this.displayScoreboard();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate( BOARD_SIZE + 3, 0, BOARD_SIZE / 2);
            this.scene.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
            this.displayScoreboard();
        this.scene.popMatrix();
    }

    displayScoreboard() {
        this.scene.scale(1, 0.6, 0.6);
        this.scene.rotate(90 * DEGREE_TO_RAD, 0, 1, 0);

        this.digitTextures[this.currentUnitSec].apply();
        this.unitSecDigit.display();

        this.digitTextures[this.currentTenSec].apply();
        this.tenSecDigit.display();

        this.dividerTex.apply();
        this.divider.display();

        this.digitTextures[this.currentMin].apply();
        this.minDigit.display();
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
            this.lastUpdateTime = currTime;
            this.decrementCountDown();
        }

        if (!this.currentTurnTime) {
            //Trocar de jogador no game
        }
    }

    /**
     * Decrement the current time of the countdown
     * 
     * @return {null}
     */
    decrementCountDown() {
        if (this.currentTurnTime == 0)
            return;

        let minutes = Math.floor(--this.currentTurnTime / 60);
        let seconds = this.currentTurnTime % 60;

        this.currentMin = minutes;
        this.currentTenSec = Math.floor(seconds / 10);
        this.currentUnitSec = seconds % 10;
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
     * Increase the current turn Time by 10 seconds
     * 
     * @return {null}
     */
    incTimer10sec() {
        this.turnTime += 10;
    }

}