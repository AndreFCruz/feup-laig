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
        this.currentTurnTime = 0;

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
        this.minDigit       = new MyRectangle(this.scene, [0, 1, 1, 0]);
        this.divider        = new MyRectangle(this.scene, [1, 1, 2, 0]);
        this.tenSecDigit    = new MyRectangle(this.scene, [2, 1, 3, 0]);
        this.unitSecDigit   = new MyRectangle(this.scene, [3, 1, 4, 0]);

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
            this.displayScoreboard();
        this.scene.popMatrix();

        /*this.scene.pushMatrix();
            this.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
            this.displayScoreboard();
        this.scene.popMatrix();*/
    }

    displayScoreboard() {
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
     * Increase the current turn Time by 10 seconds
     * 
     * @return {null}
     */
    incTimer10sec() {
        this.turnTime += 10;
    }

}