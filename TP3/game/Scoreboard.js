/**
 * A class representing the Scoreboard
 */
class ScoreBoard {
    
    /**
     * Constructor for the scoreboard class
     * 
     * @param {Object} scene - The lighting scene where the scoreboard will be
     * @param {String} timeOutFunction - Function to be called when a timeout happens
     * @constructor
     */
    constructor(scene, timeOutFunction) {
        this.scene = scene;
        this.timeOutFunction = timeOutFunction;

        this.wonGames1 = 0;
        this.wonGames2 = 0;

        this.turnTime = 0;
        this.currentTurnTime = 0;
        this.gameRunning = false;

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

        this.playerScore1 = new MyRectangle(this.scene, [-5, 3, -3, -1]);
        this.playerScore1.setTexAmplification(2,4);

        this.playerScore2 = new MyRectangle(this.scene, [ 3, 3,  5, -1]);
        this.playerScore2.setTexAmplification(2,4);


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

    /**
     * Display the scoreboard elements in the screen: player won games and timer countdown
     * 
     * @return {null}
     */
    displayScoreboard() {
        this.scene.scale(1, 0.6, 0.6);
        this.scene.rotate(90 * DEGREE_TO_RAD, 0, 1, 0);

        this.digitTextures[this.currentUnitSec].apply();
        this.unitSecDigit.display();

        this.scene.registerForPick( TIMER_PICK_ID, this.tenSecDigit);
        this.digitTextures[this.currentTenSec].apply();
        this.tenSecDigit.display();
        this.scene.clearPickRegistration();

        this.dividerTex.apply();
        this.divider.display();

        this.scene.registerForPick( TIMER_PICK_ID + 1, this.minDigit);
        this.digitTextures[this.currentMin % 10].apply();
        this.minDigit.display();
        this.scene.clearPickRegistration();

        this.digitTextures[this.wonGames1].apply();
        this.playerScore1.display();

        this.digitTextures[this.wonGames2].apply();
        this.playerScore2.display();
    }

    /**
     * Update the scoreboard, with the current time, in mili seconds
     * 
     * @param {Number} currTime - time elapsed, in mili seconds
     * @return {null}
     */
    update(currTime) {

        if (this.gameRunning) {
            if (this.turnTime) {
                if (this.turnStartTime == null) this.turnStartTime = currTime;

                let previousTurnTime = this.currentTurnTime;
                this.currentTurnTime = Math.round((this.turnStartTime + this.turnTime * 1000 - currTime) / 1000);

                if (this.currentTurnTime == 0) {
                    this.timeOutFunction();
                } else if (this.currentTurnTime != previousTurnTime) {
                    this.updateTimerDigits(this.currentTurnTime);
                }
            }
        } else
            this.updateTimerDigits(this.turnTime);
    }

    /**
     * Updates the timer digits with the given time
     * 
     * @param {Numer} time - Time of timer, in mili seconds
     * @return {null}
     */
    updateTimerDigits(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        this.currentMin = Math.abs(minutes); // on rare ocasions this abs is needed
        this.currentTenSec = Math.abs(Math.floor(seconds / 10));
        this.currentUnitSec = Math.abs(seconds % 10);
    }

    /**
     * Indicate the Scoreboard that a new game began
     */
    gameBegan() {
        this.gameRunning = true;
        this.turnStartTime = null;
    }

    /**
     * Start a new countdown in the timer for a new turn
     * 
     * @return {Number} - The Cell's column
     */
    startNewTurn() {
        this.turnStartTime = null;
    }

    /**
     * Increase the current turn Time by 1 minute
     * 
     * @return {null}
     */
    incTimer1min() {
        this.turnTime += 60;

        // To loop around
        if (this.turnTime >= 600)
            this.turnTime -= 600;

    }

    /**
     * Increase the current turn Time by 10 seconds
     * 
     * @return {null}
     */
    incTimer10sec() {
        this.turnTime += 10;
    }

    /**
     * Inform the scoreboard that the given player won the game
     * 
     * @param {Number} player - The player that won the game
     * @return {null}
     */
    playerWin(player) {
        this.gameRunning = false;

        if (player == 1)
            this.wonGames1++;
        else
            this.wonGames2++;
    }
    
    /**
     * Handle the picked timer digit
     * 
     * @param {Number} - The ID of the picked element
     * @return {null}
     */
    handlePick(pickedId) {
        if (pickedId == TIMER_PICK_ID)
            this.incTimer10sec();
        else
            this.incTimer1min();
    }

}