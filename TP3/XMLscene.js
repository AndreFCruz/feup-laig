var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;
    interface.scene = this;

    this.lightValues = {};

    //For dropdown in interface
    //Starting by selecting nothing
    this.selectedNode = null;

    //For Color Controller
    this.selectedColor = "#ff6322";

    //For selecting scene elements
    this.setPickEnabled(true);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.initCameras();

    this.enableTextures(true);
    
    this.gl.clearColor(0,0,0, 1.0);
    this.gl.clearDepth(1000.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
    this.axis = new CGFaxis(this);

    this.setUpdatePeriod(1. / 60);

    this.secondaryShader = new CGFshader(this.gl, "shaders/selectable.vert", "shaders/selectable.frag");
    this.secondaryShader.setUniformsValues({
      secondaryColor: hexToRgbVec(this.selectedColor),
      timeFactor: 0
    });

    //For not displaying picking elements
    this.noDisplayShader = new CGFshader(this.gl,"shaders/noDisplay.vert", "shaders/noDisplay.frag");

    this.game = new Game(this);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
}

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);

    //Adds Color Controller
    this.interface.addColorController();
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {

    this.logPicking();
	this.clearPickRegistration();

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();
    
    if (this.graph.loadedOk) 
    {        
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

        // Draw axis
        this.axis.display();

        let i = 0;
        for (let key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        // Displays the scene.
        this.graph.displayScene();

        // Displays the game elements
        this.game.displayGame();
    }
    else
    {
        // Draw axis
        this.axis.display();
    }

    this.popMatrix();

    // ---- END Background, camera and axis setup
}

/**
 * Update the entire scene
 * 
 * @param {Number} currTime - current time, in miliseconds.
 * @return {null}
 */
XMLscene.prototype.update = function(currTime) {
    this.graph.updateScene(currTime);
    this.updateShader(currTime);
    this.game.update(currTime);
}

/**
 * Set the shader to the default shader.
 * 
 * @return {null}
 */
XMLscene.prototype.setDefaultShader = function() {
    this.setActiveShader(this.defaultShader);
}

/**
 * Set the shader to the color shader.
 * 
 * @return {null}
 */
XMLscene.prototype.setSecondaryShader = function() {
    this.setActiveShader(this.secondaryShader);
}


/**
 * Set the shader for invisible elements
 * 
 * @return {null}
 */
XMLscene.prototype.setNoDisplayShader = function() {
    this.setActiveShader(this.noDisplayShader);
}

/**
 * Update the color Shader.
 * 
 * @return {null}
 */
XMLscene.prototype.updateShader = function(currTime) {
    let t = (Math.sin(currTime / 1000) + 1) / 2;

    this.secondaryShader.setUniformsValues({timeFactor: t});    
}

/**
 * Update the color shader to use a new color.
 * 
 * @param {String} hexValue - Hexadecimal value for the new shader color
 * @return {null}
 */
XMLscene.prototype.updateShaderColor = function(hexValue) {
    let color = hexToRgbVec(this.selectedColor);

    this.secondaryShader.setUniformsValues({secondaryColor: color})
}

/**
 * Show in console information about picked elements
 * 
 * @return {null}
 */
XMLscene.prototype.logPicking = function() {

	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let pick in this.pickResults) {

				let obj = this.pickResults[pick][0];
                if (obj) {

                    let customId = this.pickResults[pick][1];
                    this.game.handlePick(customId);			
                    console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}