class Animation {

    constructor(id) {
      this.id = id;
      this.active = false;
    }

    // steps the animation delta seconds
    step(delta) {
      return null;
    }

    /** CHECK IF FUNCTIONS BELLOW THIS LINE ARE NEEDED **/

    // calculate new matrix with current parameters
    update(delta) {
      return null;
    }

    start() {
      this.active = true;
    }

    stop() {
      this.active = false;
    }

    isDone() {
        return ! this.active;
    }
}