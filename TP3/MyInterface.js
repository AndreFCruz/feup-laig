 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    // http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)
    
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    // Save the lightsGroup and respective lights so that it can be updated
    this.lightsGroup = this.gui.addFolder("Lights");
    this.lightsGroup.open();
    this.lights = [];

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;
    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            this.lights.push(
                this.lightsGroup.add(this.scene.lightValues, key)
            );
        }
    }
}

/**
 * Updates the lights folder with the lights given
 * 
 * @param {Object} lights - The new lights to be used in the scene
 * @return {null}
 */
MyInterface.prototype.updateLightsGroup = function(lights) {
    
    for (let i = 0; i < this.lights.length; ++i)
        this.lightsGroup.remove(this.lights[i]);

    // Clearing lights array
    this.lights = [];

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;
    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            this.lights.push(
                this.lightsGroup.add(this.scene.lightValues, key)
            );
        }
    }
}

/**
 * Adds a color controller for the current selected node
 * 
 * @return {null}
 */
MyInterface.prototype.addColorController = function() {
    this.gui.addColor(this.scene, 'selectedColor').onChange(function(v) {
        this.object.updateShaderColor(v);
    });
}

/**
 * Adds a group controller to the select wich type of game to begin
 * 
 * @return {null}
 */
MyInterface.prototype.addInitGameGroup = function() {
    
    let gameModes = this.gui.addFolder("Game Modes");
    gameModes.open();

    // Human vs Human Mode
    gameModes.add(this.scene, 'hVSh').name('Multiplayer');

    // Human vs AI Mode
    let humanVSai = gameModes.addFolder("Singleplayer");
    humanVSai.add(this.scene, 'hVSrandom').name("Dummy AI");
    humanVSai.add(this.scene, 'hVSsmart').name("Smart AI");

    // AI vs AI Mode
    let aiVSai = gameModes.addFolder("AI X AI");
    aiVSai.add(this.scene, 'randomVSrandom').name("Dummy X Dummy");
    aiVSai.add(this.scene, 'randomVSsmart').name("Dummy X Smart");
    aiVSai.add(this.scene, 'smartVSrandom').name("Smart X Dummy");
    aiVSai.add(this.scene, 'smartVSsmart').name("Smart X Smart");
}

/**
 * Adds a group where the player can choose wich Scene Graph to display
 * 
 * @return {null}
 */
MyInterface.prototype.addMultipleScenes = function(sceneGraphs) {

    let sceneNames = [];
    for (let names in sceneGraphs)
        sceneNames.push(names);

    this.gui.add(this.scene, 'selectedSceneGraph', sceneNames).onChange(function(sceneName) {
        this.object.onGraphChange(sceneName);
    }).name("Scene");
}

MyInterface.prototype.processKeyDown = function(event) {
    console.log("Key Down");
    console.log(event);

    if (! this.scene) {
        console.error("Interface's scene is not set.");
        return;
    }

    switch (event.key) {
        case 'w':
        case 'W':
            this.scene.zoomIn();
            break;
        case 's':
        case 'S': // zoom out
            this.scene.zoomOut();
            break;
        case 'a':
        case 'A': // flip camera left
            this.scene.rotateCameraLeft();
            break;
        case 'd':
        case 'D': // flip camera right
            this.scene.rotateCameraRight();            
            break;
        case 'x':
        case 'X': // reset camera
            this.scene.resetCamera();            
            break;
        default:
            console.log("Key not bound: " + event.key);
    }
}