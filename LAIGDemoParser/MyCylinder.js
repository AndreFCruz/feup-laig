/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, args) {
    MyGraphLeaf.call(this, scene);

    this.height = args[0];
    this.botRadius = args[1];
    this.topRadius = args[2];
    this.stacks = args[3];
    this.slices = args[4];

    this.caplessCylinder = new MyCaplessCylinder(
        scene, args[0], args[1], args[2], args[3], args[4]);

    if (args[5] == 1)
        this.topCap = new MyCircle(scene, this.topRadius, this.slices);
    if (args[6] == 1)
        this.botCap = new MyCircle(scene, this.botRadius, this.slices);

    this.initBuffers();
};

MyCylinder.prototype = Object.create(MyGraphLeaf.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display = function() {

    this.caplessCylinder.display();

    if (this.topCap != null) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.topCap.display();
        this.scene.popMatrix();
    }

    if (this.botCap != null) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.botCap.display();
        this.scene.popMatrix();
    }

}

MyCylinder.prototype.setTexAmplification = function(ampS, ampT) {
    // this.caplessCylinder.setTexAmplification(ampS, ampT);
}