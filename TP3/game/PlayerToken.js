/**
 * A class representing the Player Token, that signals the current player
 */
class PlayerToken extends Piece {
    constructor(scene) {
        super([-1, 0, 8], 'token');

        this.scene = scene;
        this.currentSide = 0;
        this.BOARD_SIZE = 9;

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
        this.token = new MyCylinder(this.scene, [
            1,      // height
            0.5, 0, // bot and top radius
            10, 10, // stacks/slices
            1, 1    // top/bot caps
        ]);

        // Appearance
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.1, 0.2, 0.3, 1);
    }

    flipSides() {
        this.currentSide = (this.currentSide + 1) % 2;
        this.moveTo(this.currentSide ? this.BOARD_SIZE + 1 : -1, 8);
    }

    reset() {
        if (this.currentSide != 0) {
            this.flipSides();
        }
    }

    /**
     * Display the scoreboard in the scene
     * 
     * @return {null}
     */
    display() {
        this.scene.pushMatrix();
            this.material.apply();
            this.scene.multMatrix(this.getPositionMatrix());
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.token.display();
        this.scene.popMatrix();
    }
}