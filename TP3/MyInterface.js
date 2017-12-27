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
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)
    
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}

/**
 * Adds a dropdown containing the IDs of all the selected nodes
 * 
 * @return {null}
 */
MyInterface.prototype.addSelecDropDown = function(selectables) {

    //Adding option to select nothing
    selectables.splice(0, 0, " ");

    this.gui.add(this.scene, 'Selectables', selectables);
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

MyInterface.prototype.processKeyDown = function(event) {
    console.log("Key Down");
    console.log(event);

    if (! this.scene) {
        console.error("Interface's scene is not set.");
        return;
    }

    switch (event.key) {
        case 'a':
        case 'A':
            // flip camera left
            break;
        case 'd':
        case 'D':
            // flip camera right
            break;
        case 's':
        case 'S':
            this.scene.game.beginHvsH();
            break;
        default:
            console.log("Key not bound: " + event.key);
    }
}